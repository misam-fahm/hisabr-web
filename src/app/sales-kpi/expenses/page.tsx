"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ExpensesChart from "@/Components/Charts-Graph/Expenses";
import { sendApiRequest } from "@/utils/apiUtils";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface ExpensesPageData {
  storeid: string;
  startdate: string;
  enddate: string;
  months: number;
}

const ExpensesPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ label: string; value: number }[]>([]);
  const [pageData, setPageData] = useState<ExpensesPageData | null>(null);
  const [chartColors, setChartColors] = useState<string[]>([]);

  // Color palette
  const colorPalette = [
    "#B22222", // Firebrick (Dark Red)
    "#FF7F7F", // Light Coral (Light Red)
    "#1E90FF", // Dodger Blue
    "#2E8B57", // Sea Green
    "#DAA520", // Goldenrod
    "#8A2BE2", // Blue Violet
    "#FF69B4", // Hot Pink
    "#708090", // Indian Red
    "#3CB371", // Medium Sea Green
    "#40E0D0", // Turquoise
    "#F4A460", // Sienna
    "#FF6347", // Tomato
    "#5F9EA0", // Cadet Blue
    "#778899", // Light Slate Gray
    "#DB7093", // Pale Violet Red
    "#556B2F", // Dark Olive Green
    "#FFB6C1", // Light Pink
    "#708090", // Slate Gray
    "#F4A460", // Sandy Brown
  ];

  useEffect(() => {
    // Retrieve data from localStorage
    const storedData = localStorage.getItem("expensesPageData");
    if (storedData) {
      try {
        const parsedData: ExpensesPageData = JSON.parse(storedData);
        if (parsedData.storeid && parsedData.startdate && parsedData.enddate && parsedData.months) {
          setPageData(parsedData);
        } else {
          setError("Incomplete data in storage");
        }
      } catch (err) {
        setError("Error parsing stored data");
      }
    } else {
      setError("Missing required parameters");
    }
    setLoading(false);
  }, []);

  const handleBackClick = () => {
    if (pageData) {
      router.push("/sales-kpi");
    }
  };

  useEffect(() => {
    if (!pageData) return;

    const { storeid, startdate, enddate, months } = pageData;

    const fetchExpensesData = async () => {
      try {
        const response: any = await sendApiRequest({
          mode: "getExpensesDtl",
          storeid,
          startdate,
          enddate,
        });
        if (response?.status === 200) {
          const saleskpi = response?.data?.expenses[0];
          const config = saleskpi?.config || {};
          const payrollTaxAmt = saleskpi?.labour_cost && config?.payroll_tax ? saleskpi.labour_cost * (config.payroll_tax / 100) : 0;

          if (saleskpi) {
            const cats = [
              { label: "Payroll Tax", value: payrollTaxAmt },
              { label: "PAR", value: (config.par || 0) * months },
              { label: "NuCO2", value: (config.nuco2 || 0) * months },
              { label: "Trash", value: (config.trash || 0) * months },
              { label: "Repairs", value: (config.repair_exp || 0) * months },
              { label: "Gas Bill", value: (config.gas_bill_exp || 0) * months },
              { label: "Internet", value: (config.internet_exp || 0) * months },
              {
                label: "Insurance",
                value: ((config.insurance_exp || 0) / 12) * months,
              },
              {
                label: "Water Bill",
                value: (config.water_bill_exp || 0) * months,
              },
              {
                label: "Property Tax",
                value: ((config.property_tax_exp || 0) / 12) * months,
              },
              {
                label: "Rent/Mortgage",
                value: (config.rent_mortgage_exp || 0) * months,
              },
              {
                label: "Labor Salary",
                value: (config.labor_operat_salary_exp || 0) * months,
              },
              ...(saleskpi?.additional_expense || []).map((item: any) => ({
                label: item.expname,
                value: item.amount,
              })),
            ].filter((item) => item.value > 0);

            // Sort categories by value in descending order
            const sortedCats = cats.sort((a, b) => b.value - a.value);

            // Generate colors: red for highest value, others from palette
            const maxValueIndex = sortedCats.length > 0 ? 0 : -1;
            const colors = sortedCats.map((_, index) =>
              index === maxValueIndex ? "#E74C3C" : colorPalette[index % colorPalette.length]
            );

            setCategories(sortedCats);
            setChartColors(colors);
          } else {
            setCategories([]);
            setChartColors([]);
          }
        } else {
          setError("Failed to fetch expenses data");
        }
      } catch (err) {
        setError("Error fetching expenses data");
      } finally {
        setLoading(false);
      }
    };

    fetchExpensesData();
  }, [pageData]);

  const renderTableSkeleton = (isMobile: boolean) => {
    const rowCount = 5;
    return (
      <table className="w-full border-collapse text-white table-fixed rounded-[10px] border border-[#E4E4EF]">
        <thead className="bg-[#0F1044] top-0 z-10">
          <tr>
            <th
              className={`text-center ${
                isMobile ? "px-2 py-1.5 text-[12px]" : "px-4 py-2 text-[15px]"
              } text-[#FFFFFF] font-normal border-r border-[#E4E4EF] w-[55%]`}
            >
              Label
            </th>
            <th
              className={`text-center ${
                isMobile ? "px-2 py-1.5 text-[12px]" : "px-4 py-2 text-[15px]"
              } text-[#FFFFFF] font-normal border-r border-[#E4E4EF] w-[22.5%]`}
            >
              Amount
            </th>
            <th
              className={`text-center ${
                isMobile ? "px-2 py-1.5 text-[12px]" : "px-4 py-2 text-[15px]"
              } text-[#FFFFFF] font-normal w-[22.5%]`}
            >
              %
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(rowCount)].map((_, index) => (
            <tr
              key={index}
              className={index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"}
            >
              <td
                className={`${
                  isMobile
                    ? "px-2 py-1 text-[11px]"
                    : "px-4 py-1.5 text-[14px]"
                } border-r border-[#E4E4EF] text-left truncate flex items-center gap-2`}
              >
                <Skeleton circle width={isMobile ? 8 : 12} height={isMobile ? 8 : 12} />
                <Skeleton width="80%" />
              </td>
              <td
                className={`${
                  isMobile
                    ? "px-2 py-1 text-[11px]"
                    : "px-4 py-1.5 text-[14px]"
                } text-right border-r border-[#E4E4EF]`}
              >
                <Skeleton width="60%" />
              </td>
              <td
                className={`${
                  isMobile
                    ? "px-2 py-1 text-[11px]"
                    : "px-4 py-1.5 text-[14px]"
                } text-right`}
              >
                <Skeleton width="60%" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Skeleton circle height={150} width={150} className="md:h-[200px] md:w-[200px]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-red-500 text-center px-4">
        {error}
      </div>
    );
  }

  // Only render ExpensesChart if pageData is fully defined
  const canRenderChart = pageData?.storeid && pageData?.startdate && pageData?.enddate && pageData?.months !== undefined;

  // Calculate total for table percentages
  const total = categories.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full flex flex-col p-4 md:p-6">
      {/* Header with Back Button and Title */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-[#0F1044] hover:text-[#36A2EB] font-bold text-xl md:text-2xl transition-colors"
        >
          <svg
            className="w-5 h-5 md:w-6 md:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Operating Expenses Chart
        </button>
      </div>

      {/* Mobile and Tablet View (below 2xl) */}
      <div className="flex flex-col gap-4 2xl:hidden">
        <div className="w-full flex justify-center">
          {canRenderChart && categories.length > 0 ? (
            <ExpensesChart
              storeid={pageData!.storeid}
              startdate={pageData!.startdate}
              enddate={pageData!.enddate}
              months={pageData!.months}
              categories={categories}
              colors={chartColors}
            />
          ) : (
            <Skeleton circle height={300} width={300} className="max-w-[300px]" />
          )}
        </div>
        <div className="w-full flex justify-center items-center">
          <div className="w-full max-w-[99%] md:max-w-[31rem]">
            {categories.length > 0 ? (
              <table className="w-full border-collapse text-white table-fixed rounded-[10px] border border-[#E4E4EF]">
                <thead className="bg-[#0F1044] top-0 z-10">
                  <tr>
                    <th className="text-center px-2 py-1.5 text-[#FFFFFF] font-normal text-[12px] border-r border-[#E4E4EF] w-[55%]">
                      Label
                    </th>
                    <th className="text-center px-2 py-1.5 text-[#FFFFFF] font-normal text-[12px] border-r border-[#E4E4EF] w-[22.5%]">
                      Amount
                    </th>
                    <th className="text-center px-2 py-1.5 text-[#FFFFFF] font-normal text-[12px] w-[22.5%]">
                      %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"}
                    >
                      <td className="px-2 py-1 text-[#636363] text-[11px] border-r border-[#E4E4EF] text-left truncate flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: chartColors[index] || "#E0E0E0" }}
                        ></span>
                        {item.label || "N/A"}
                      </td>
                      <td className="px-2 py-1 text-[#636363] text-[11px] text-right border-r border-[#E4E4EF]">
                        ${Math.round(item.value).toLocaleString()}
                      </td>
                      <td className="px-2 py-1 text-[#636363] text-[11px] text-right">
                        {((item.value / total) * 100).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              renderTableSkeleton(true)
            )}
          </div>
        </div>
      </div>

      {/* Desktop View (2xl and above) */}
      <div className="hidden 2xl:flex 2xl:flex-row 2xl:gap-6 flex-1">
        <div className="w-full 2xl:w-2/3 flex justify-center items-center">
          {canRenderChart && categories.length > 0 ? (
            <ExpensesChart
              storeid={pageData!.storeid}
              startdate={pageData!.startdate}
              enddate={pageData!.enddate}
              months={pageData!.months}
              categories={categories}
              colors={chartColors}
            />
          ) : (
            <Skeleton circle height={450} width={450} className="max-w-[450px]" />
          )}
        </div>
        <div className="w-full 2xl:w-1/3 flex justify-center items-center">
          <div className="w-full max-w-[31rem]">
            {categories.length > 0 ? (
              <table className="w-full border-collapse text-white table-fixed rounded-[10px] border border-[#E4E4EF]">
                <thead className="bg-[#0F1044] top-0 z-10">
                  <tr>
                  <th className="text-center px-4 py-2 text-[#FFFFFF] font-normal text-[15px] border-r border-[#E4E4EF] w-[55%]">
                    Label
                  </th>
                    <th className="text-center px-4 py-2 text-[#FFFFFF] font-normal text-[15px] border-r border-[#E4E4EF] w-[22.5%]">
                      Amount
                    </th>
                    <th className="text-center px-4 py-2 text-[#FFFFFF] font-normal text-[15px] w-[22.5%]">
                      %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"}
                    >
                      <td className="px-4 py-1.5 text-[#636363] text-[14px] border-r border-[#E4E4EF] text-left truncate flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: chartColors[index] || "#E0E0E0" }}
                        ></span>
                        {item.label || "N/A"}
                      </td>
                      <td className="px-4 py-1.5 text-[#636363] text-[14px] text-right border-r border-[#E4E4EF]">
                        ${Math.round(item.value).toLocaleString()}
                      </td>
                      <td className="px-4 py-1.5 text-[#636363] text-[14px] text-right">
                        {((item.value / total) * 100).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              renderTableSkeleton(false)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;
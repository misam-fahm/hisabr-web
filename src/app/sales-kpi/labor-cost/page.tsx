"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ExpensesChart from "@/Components/Charts-Graph/Expenses";
import { sendApiRequest } from "@/utils/apiUtils";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface LaborCostPageData {
  storeid: string;
  startdate: string;
  enddate: string;
  months: number;
  data: any;
}

const ExpensesPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ label: string; value: number }[]>([]);
  const [pageData, setPageData] = useState<LaborCostPageData | null>(null);
  const [chartColors, setChartColors] = useState<string[]>([]);
  const [laborHours, setLaborHours] = useState<number>(0);

  // Color palette
  const colorPalette = [
    "#B22222", // Firebrick (Dark Red)
    "#FF7F7F", // Light Coral (Light Red)
    "#DAA520", // Goldenrod
    "#1E90FF", // Dodger Blue
    "#2E8B57", // Sea Green
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
    "#168A6F", // Tender Commission Color (Green)
  ];

  useEffect(() => {
    // Retrieve data from localStorage
    const storedData = localStorage.getItem("laborCostPageData");
    if (storedData) {
      try {
        const parsedData: LaborCostPageData = JSON.parse(storedData);
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
      // Store pageData in localStorage for SalesKPI to use
      localStorage.setItem("salesKpiReturnData", JSON.stringify(pageData));
      router.push("/");
    }
  };

  useEffect(() => {
    if (!pageData) return;

    const { storeid, startdate, enddate, months, data } = pageData;
    const cats = [
        { label: "Labor Cost", value: (data?.labour_cost || 0) + (data?.additional_labor_expense || 0) },
        { label: "Payroll Tax", value: (data?.labour_cost || 0) * ((data?.payrolltax || 0) / 100) || 0 },
    ].filter((item) => item.value);

    // Sort categories by value in descending order
    const sortedCats = cats.sort((a, b) => b.value - a.value);
    const colors = sortedCats.map((item, index) => {
        return colorPalette[index % colorPalette.length];
    });

    setCategories(sortedCats);
    setChartColors(colors);

    const fetchExpensesData = async () => {
      try {
        const response: any = await sendApiRequest({
          mode: "getLaborDetail",
          storeid,
          startdate,
          enddate,
        });
        if (response?.status === 200) {
          setLaborHours(Number(response?.data?.labor_hours || 0));
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching expenses data");
      } finally {
        setLoading(false);
      }
    };
    fetchExpensesData();
  }, [pageData]); // Add totalTenderCommission as dependency

  const renderTableSkeleton = (isMobile: boolean) => {
    const rowCount = 5;
    return (
      <table className="w-full border-collapse text-white table-fixed rounded-[10px] border border-[#E4E4EF]">
        <thead className="bg-[#0F1044] top-0 z-10">
          <tr>
            <th
              className={`text-center ${
                isMobile ? "px-2 py-1.5 text-[12px] md:text-[20px]" : "px-4 py-2 text-[15px]"
              } text-[#FFFFFF] font-normal border-r border-[#E4E4EF] w-[55%]`}
            >
              Label
            </th>
            <th
              className={`text-right ${
                isMobile ? "px-2 py-1.5 text-[12px] md:text-[20px]" : "px-4 py-2 text-[15px]"
              } text-[#FFFFFF] font-normal border-r border-[#E4E4EF] w-[22.5%]`}
            >
              Amount
            </th>
            <th
              className={`text-right ${
                isMobile ? "px-2 py-1.5 text-[12px] md:text-[20px]" : "px-4 py-2 text-[15px]"
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
                    ? "px-2 py-1 text-[11px] md:text-[19px]"
                    : "px-4 py-1.5 text-[14px]"
                } border-r border-[#E4E4EF] text-left truncate flex items-center gap-2`}
              >
                <Skeleton circle width={isMobile ? 8 : 12} height={isMobile ? 8 : 12} />
                <Skeleton width="80%" />
              </td>
              <td
                className={`${
                  isMobile
                    ? "px-2 py-1 text-[11px] md:text-[19px]"
                    : "px-4 py-1.5 text-[14px]"
                } text-right border-r border-[#E4E4EF]`}
              >
                <Skeleton width="60%" />
              </td>
              <td
                className={`${
                  isMobile
                    ? "px-2 py-1 text-[11px] md:text-[19px]"
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

  // Calculate total for table percentages (including tender commission)
  const total = categories.reduce((sum, item) => sum + item.value, 0);

  return (
    <main
      className="relative px-6 below-md:px-3 max-h-[calc(100vh-60px)] overflow-hidden"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="sticky top-0 z-20 bg-[#f7f8f9] px-6 below-md:px-3 py-4">
        <div className="flex items-center justify-between">
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
            Labor Cost
          </button>
        </div>
      </div>

      <div
        className="px-6 below-md:px-3 overflow-y-auto scrollbar-none"
        style={{ maxHeight: "calc(100vh - 120px)" }}
      >
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
          {/* 👇 Formula Row */}
          {/* <div className="flex flex-col items-center bg-gray-100 px-4 py-3 rounded-lg shadow-sm">
            <span className="text-lg font-semibold text-gray-700">
                {`$${((pageData?.data?.labour_cost || 0) + (pageData?.data?.additional_labor_expense || 0)).toFixed(2)}`} / {laborHours} ={" "}
                <span className="text-2xl font-bold text-gray-800 mt-1">
                {(laborHours ? 
                    `$${(((pageData?.data?.labour_cost || 0) +
                        (pageData?.data?.additional_labor_expense || 0)) /
                        laborHours
                    ).toFixed(2)}`
                    : "0"
                )}
                </span>
            </span>
            <span className="text-sm text-gray-500">
                Labor Cost / Labor Hour = Labor Cost per Hour
            </span>
          </div> */}
          {laborHours > 0 &&(<div className="flex flex-col items-center bg-gray-100 px-4 py-3 rounded-lg shadow-sm">
            {/* Formula Row */}
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                <span>
                $
                {(
                    (pageData?.data?.labour_cost || 0) +
                    (pageData?.data?.additional_labor_expense || 0)
                ).toLocaleString()}
                </span>

                <span>/</span>

                {/* 👇 This will now be vertically centered */}
                <span className="flex items-center">
                {laborHours.toLocaleString()}
                </span>

                <span>=</span>

                {/* Result */}
                <span className="text-2xl font-bold text-gray-800">
                {laborHours
                    ? `$${(
                        ((pageData?.data?.labour_cost || 0) +
                        (pageData?.data?.additional_labor_expense || 0)) /
                        laborHours
                    ).toFixed(2)}`
                    : "$0"}
                </span>
            </div>

            {/* Label */}
            <span className="text-sm text-gray-500 mt-2 text-center">
                Labor Cost / Labor Hour = Labor Cost per Hour
            </span>
          </div>)}
          
          <div className="w-full flex justify-center items-center">
            <div className="w-full max-w-[99%] md:max-w-full">
              {categories.length > 0 ? (
                <table className="w-full border-collapse text-white table-fixed rounded-[10px] border border-[#E4E4EF]">
                  <thead className="bg-[#0F1044] top-0 z-10 sticky">
                    <tr>
                      <th className="text-center px-2 py-1.5 text-[#FFFFFF] font-normal text-[12px] md:text-[20px] border-r border-[#E4E4EF] w-[55%]">
                        Label
                      </th>
                      <th className="text-right px-2 py-1.5 text-[#FFFFFF] font-normal text-[12px] md:text-[20px] border-r border-[#E4E4EF] w-[22.5%]">
                        Amount
                      </th>
                      <th className="text-right px-2 py-1.5 text-[#FFFFFF] font-normal text-[12px] md:text-[20px] w-[22.5%]">
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
                        <td className="px-2 py-1 text-[#636363] text-[11px] md:text-[19px] border-r border-[#E4E4EF] text-left truncate flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: chartColors[index] || "#E0E0E0" }}
                          ></span>
                          {item.label || "N/A"}
                        </td>
                        <td className="px-2 py-1 text-[#636363] text-[11px] md:text-[19px] text-right border-r border-[#E4E4EF]">
                          {`$${Math.round(item.value).toLocaleString()}`}
                        </td>
                        <td className="px-2 py-1 text-[#636363] text-[11px] md:text-[19px] text-right">
                          {`${((item.value / total) * 100).toFixed(2)}%`}
                        </td>
                      </tr>
                    ))}
                    {/* Total Row */}
                    <tr className="bg-[#0F1044] text-white border-t-2 border-[#E4E4EF]">
                      <td className="px-2 py-1.5 text-[11px] md:text-[19px] font-bold border-r border-[#E4E4EF] text-left">
                        Total
                      </td>
                      <td className="px-2 py-1.5 text-[11px] md:text-[19px] font-bold text-right border-r border-[#E4E4EF]">
                        ${Math.round(total).toLocaleString()}
                      </td>
                      <td className="px-2 py-1.5 text-[11px] md:text-[19px] font-bold text-right">
                        100%
                      </td>
                    </tr>
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
                {laborHours > 0 && (<div className="flex flex-col items-center bg-gray-100 px-4 py-3 rounded-lg shadow-sm">
                    {/* Formula Row */}
                    <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                        <span>
                        $
                        {(
                            (pageData?.data?.labour_cost || 0) +
                            (pageData?.data?.additional_labor_expense || 0)
                        ).toLocaleString()}
                        </span>

                        <span>/</span>

                        {/* 👇 This will now be vertically centered */}
                        <span className="flex items-center">
                        {laborHours.toLocaleString()}
                        </span>

                        <span>=</span>

                        {/* Result */}
                        <span className="text-2xl font-bold text-gray-800">
                        {laborHours
                            ? `$${(
                                ((pageData?.data?.labour_cost || 0) +
                                (pageData?.data?.additional_labor_expense || 0)) /
                                laborHours
                            ).toFixed(2)}`
                            : "$0"}
                        </span>
                    </div>

                    {/* Label */}
                    <span className="text-sm text-gray-500 mt-2 text-center">
                        Labor Cost / Labor Hour = Labor Cost per Hour
                    </span>
                </div>)}
              {categories.length > 0 ? (
                <table className="w-full border-collapse text-white table-fixed rounded-[10px] border border-[#E4E4EF]">
                  <thead className="bg-[#0F1044] top-0 z-10">
                    <tr>
                      <th className="text-center px-4 py-2 text-[#FFFFFF] font-normal text-[15px] border-r border-[#E4E4EF] w-[55%]">
                        Label
                      </th>
                      <th className="text-right px-4 py-2 text-[#FFFFFF] font-normal text-[15px] border-r border-[#E4E4EF] w-[22.5%]">
                        Amount
                      </th>
                      <th className="text-right px-4 py-2 text-[#FFFFFF] font-normal text-[15px] w-[22.5%]">
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
                            {`$${Math.round(item.value).toLocaleString()}`}
                        </td>
                        <td className="px-4 py-1.5 text-[#636363] text-[14px] text-right">
                          {`${((item.value / total) * 100).toFixed(2)}%`}
                        </td>
                      </tr>
                    ))}
                    {/* Total Row */}
                    <tr className="bg-[#0F1044] text-white border-t-2 border-[#E4E4EF]">
                      <td className="px-4 py-1.5 text-[14px] font-bold border-r border-[#E4E4EF] text-left">
                        Total
                      </td>
                      <td className="px-4 py-1.5 text-[14px] font-bold text-right border-r border-[#E4E4EF]">
                        ${Math.round(total).toLocaleString()}
                      </td>
                      <td className="px-4 py-1.5 text-[14px] font-bold text-right">
                        100%
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                renderTableSkeleton(false)
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ExpensesPage;
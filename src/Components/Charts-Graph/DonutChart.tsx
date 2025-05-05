import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NoDataFound from "@/Components/UI/NoDataFound/NoDataFound";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface DonutChartProps {
  values: any;
  operatExpAmt: number;
}

const backgroundColors = [
  "#4B4B4B", // Labour Cost
  "#DAB777", // COGS
  "#653C59", // Royalty
  "#FF5555", // Operating Expenses
  "#3CB371", // Profit
];

const DonutChart: React.FC<DonutChartProps> = ({ values, operatExpAmt }) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);
  const [isSpecificMdScreen, setIsSpecificMdScreen] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const royalty = values?.net_sales
    ? values.net_sales * (values?.royalty / 100 || 0.09)
    : 0;
  const profit = values?.net_sales
    ? Math.round(
        values.net_sales -
          values.producttotal -
          values.labour_cost -
          operatExpAmt -
          royalty
      )
    : 0;
  const labourCost = Number(values?.labour_cost) || 0;
  const taxAmount = Number(values?.tax_amt) || 0;
  const operatingExpenses = Number(operatExpAmt) || 0;
  const validProfit = profit < 0 ? 0 : profit;
  const cogs = Number(values?.producttotal) || 0;

  const total = labourCost + cogs + royalty + operatingExpenses + validProfit;
  const hasData = total > 0;

  const dataItems = [
    { label: "Labour Cost", amount: labourCost, color: backgroundColors[0] },
    { label: "COGS", amount: cogs, color: backgroundColors[1] },
    { label: "Royalty", amount: royalty, color: backgroundColors[2] },
    {
      label: "Expenses",
      amount: operatingExpenses,
      color: backgroundColors[3],
    },
    { label: "Profit", amount: validProfit, color: backgroundColors[4] },
  ].filter((item) => item.amount > 0);

  // Sort by percentage (descending), matching TenderRevenueChart
  const sortedData = hasData
    ? [...dataItems].sort(
        (a, b) => (b.amount / total) * 100 - (a.amount / total) * 100
      )
    : [];

  const percentages =
    total > 0
      ? dataItems.map((item) => ((item.amount / total) * 100).toFixed(2))
      : dataItems.map(() => "0");

  const normalizedPercentages = percentages.map(Number);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const tabletQuery = window.matchMedia("(max-width: 1024px)");
    const specificMdScreenQuery = window.matchMedia(
      "(width: 1180px) and (height: 820px)"
    );

    setIsMobile(mobileQuery.matches);
    setIsTablet(tabletQuery.matches);
    setIsSpecificMdScreen(specificMdScreenQuery.matches);

    const handleMobileResize = (e: MediaQueryListEvent) =>
      setIsMobile(e.matches);
    const handleTabletResize = (e: MediaQueryListEvent) =>
      setIsTablet(e.matches);
    const handleSpecificMdScreenResize = (e: MediaQueryListEvent) =>
      setIsSpecificMdScreen(e.matches);

    mobileQuery.addEventListener("change", handleMobileResize);
    tabletQuery.addEventListener("change", handleTabletResize);
    specificMdScreenQuery.addEventListener(
      "change",
      handleSpecificMdScreenResize
    );

    // Simulate loading
    setTimeout(() => setLoading(false), 1000);

    return () => {
      mobileQuery.removeEventListener("change", handleMobileResize);
      tabletQuery.removeEventListener("change", handleTabletResize);
      specificMdScreenQuery.removeEventListener(
        "change",
        handleSpecificMdScreenResize
      );
    };
  }, []);

  const data = hasData
    ? {
        labels: sortedData.map((row) => row.label),
        datasets: [
          {
            data: sortedData.map((row) => (row.amount / total) * 100), // Use percentages directly
            backgroundColor: sortedData.map((row) => row.color),
            borderWidth: 2.42,
            borderColor: "#FFFFFF",
            hoverOffset: 20,
            hoverBorderWidth: 3,
            hoverBorderColor: "rgba(0, 0, 0, 0.5)",
            radius: "70%",
          },
        ],
      }
    : {
        labels: ["No Data Available"],
        datasets: [
          {
            data: [100],
            backgroundColor: ["#E0E0E0"],
            borderWidth: 2.42,
            borderColor: "#FFFFFF",
            hoverOffset: 0,
            hoverBorderWidth: 0,
            radius: "48%",
          },
        ],
      };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    circumference: 360, // Ensure full circle, clockwise
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: {
        display: hasData && !isMobile,
        color: (context) => sortedData[context.dataIndex]?.color || "#000000",
        font: { size: 12 },
        formatter: (value, context) => {
          const label = context.chart.data.labels![context.dataIndex] as string;
          return `${label.length > 10 ? label.slice(0, 10) + "..." : label}: ${Number(value).toFixed(1)}%`;
        },
        align: "end",
        anchor: "end",
        offset: 8,
        clamp: true,
        clip: false,
      },
    },
    onHover: (event, chartElement) => {
      if (chartElement.length > 0) {
        setHoveredIndex(chartElement[0].index);
      } else {
        setHoveredIndex(null);
      }
    },
    animation: { duration: 300 },
  };

  const renderCenterText = () => {
    if (!hasData) {
      return <p className="m-0 font-bold text-[14px]">No Data Available</p>;
    }

    if (hoveredIndex === null) {
      return (
        <p className="m-0 font-bold" style={{ fontSize: "28px" }}>
          {values?.net_sales
            ? `$${Math.round(values.net_sales).toLocaleString()}`
            : "$0"}
        </p>
      );
    }

    const item = sortedData[hoveredIndex];
    const percentage = ((item.amount / total) * 100).toFixed(2);
    const amount = Math.round(item.amount).toLocaleString();
    const label = item.label;
    const maxLength = 18;

    if (label.length > maxLength) {
      const words = label.split(" ");
      let firstLine = "";
      let secondLine = "";
      let currentLine = "";

      for (const word of words) {
        if ((currentLine + word).length <= maxLength) {
          currentLine += (currentLine ? " " : "") + word;
        } else {
          if (!firstLine) {
            firstLine = currentLine;
            currentLine = word;
          } else {
            secondLine += (secondLine ? " " : "") + word;
          }
        }
      }
      if (!secondLine) secondLine = currentLine;

      return (
        <div className="flex flex-col items-center space-y-1">
          <p className="m-0 font-bold text-[14px]">{firstLine}</p>
          <p className="m-0 font-bold text-[14px]">{secondLine}</p>
          <p className="m-0 text-[14px]">{percentage}%</p>
          <p className="m-0 text-[14px]">${amount}</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center space-y-1">
        <p className="m-0 font-bold text-[14px]">{label}</p>
        <p className="m-0 text-[14px]">{percentage}%</p>
        <p className="m-0 text-[14px]">${amount}</p>
      </div>
    );
  };

  const truncateLabel = (name: string, maxLength: number = 18) => {
    if (
      (isMobile || isTablet || isSpecificMdScreen) &&
      name.length > maxLength
    ) {
      return name.slice(0, maxLength) + "...";
    }
    return name;
  };

  return (
    <div className="flex flex-row items-center justify-between below-md:flex-col tablet:flex-col 2xl:flex-row 2xl:gap-6">
      {/* Chart Section */}
      <div className="w-full flex justify-center items-center lg:mr-5 xl:mr-10 2xl:mr-20 2xl:translate-x-[10%]">
        {loading ? (
          <div className="relative w-[451.5px] h-[451.5px] sm:w-[493.5px] sm:h-[493.5px] tablet:w-[525px] tablet:h-[525px] rounded-lg pt-8 pb-8 flex justify-center items-center">
            <Skeleton circle height={200} width={200} />
          </div>
        ) : sortedData.length === 0 ? (
          <div className="relative w-[451.5px] h-[451.5px] sm:w-[493.5px] sm:h-[493.5px] tablet:w-[525px] tablet:h-[525px] rounded-lg pt-8 pb-8 flex justify-center items-center">
            <NoDataFound />
          </div>
        ) : (
          <div className="relative w-[451.5px] h-[451.5px] sm:w-[493.5px] sm:h-[493.5px] tablet:w-[525px] tablet:h-[525px] rounded-lg pt-8 pb-8 flex justify-center items-center">
            <Doughnut
              data={data}
              options={options}
              plugins={[ChartDataLabels]}
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-[14px] text-gray-800 max-w-[80%]">
              {renderCenterText()}
            </div>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="w-full below-md:w-full tablet:w-full lg:w-[125%] xl:w-[125%] 2xl:w-[86.56875%] flex justify-center items-center">
        <div className="w-full max-w-[99%] md:max-w-full lg:max-w-[125%] xl:max-w-[125%] 2xl:max-w-[86.56875%]">
          {loading ? (
            <table className="w-full border-collapse text-white table-fixed rounded-[10px] border border-[#E4E4EF]">
              <thead className="bg-[#0F1044] top-0 z-10 sticky">
                <tr>
                  <th className="text-center px-2 py-1.5 text-[#FFFFFF] font-normal text-[14px] border-r border-[#E4E4EF] w-[50%]">
                    Label
                  </th>
                  <th className="text-center px-2 py-1.5 text-[#FFFFFF] font-normal text-[14px] border-r border-[#E4E4EF] w-[27.5%]">
                    Amount
                  </th>
                  <th className="text-center px-2 py-1.5 text-[#FFFFFF] font-normal text-[14px] w-[22.5%]">
                    %
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"}
                  >
                    <td className="px-2 py-1 text-[13px] border-r border-[#E4E4EF] text-left truncate flex items-center gap-1.5">
                      <Skeleton circle width={8} height={8} />
                      <Skeleton width="80%" />
                    </td>
                    <td className="px-2 py-1 text-[13px] text-right border-r border-[#E4E4EF]">
                      <Skeleton width="60%" />
                    </td>
                    <td className="px-2 py-1 text-[13px] text-right">
                      <Skeleton width="60%" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : sortedData.length === 0 ? (
            <table className="w-full border-collapse text-white table-fixed rounded-[10px] border border-[#E4E4EF]">
              <thead className="bg-[#0F1044] top-0 z-10 sticky">
                <tr>
                  <th className="text-center px-2 py-1.5 text-[#FFFFFF] font-normal text-[14px] border-r border-[#E4E4EF] w-[50%]">
                    Label
                  </th>
                  <th className="text-center px-2 py-1.5 text-[#FFFFFF] font-normal text-[14px] border-r border-[#E4E4EF] w-[27.5%]">
                    Amount
                  </th>
                  <th className="text-center px-2 py-1.5 text-[#FFFFFF] font-normal text-[14px] w-[22.5%]">
                    %
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    colSpan={3}
                    className="px-2 py-1 text-[13px] text-center bg-white"
                  >
                    <NoDataFound />
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <table className="w-full border-collapse text-white table-fixed rounded-[10px] border border-[#E4E4EF]">
              <thead className="bg-[#0F1044] top-0 z-10 sticky">
                <tr>
                  <th className="text-center px-2 py-1.5 text-[#FFFFFF] font-normal text-[14px] border-r border-[#E4E4EF] w-[50%]">
                    Label
                  </th>
                  <th className="text-center px-2 py-1.5 text-[#FFFFFF] font-normal text-[14px] border-r border-[#E4E4EF] w-[27.5%]">
                    Amount
                  </th>
                  <th className="text-center px-2 py-1.5 text-[#FFFFFF] font-normal text-[14px] w-[22.5%]">
                    %
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((row, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"}
                  >
                    <td className="px-2 py-1 text-[#636363] text-[13px] border-r border-[#E4E4EF] text-left truncate flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: row.color || "#E0E0E0" }}
                      ></span>
                      {truncateLabel(row.label || "N/A")}
                    </td>
                    <td className="px-2 py-1 text-[#636363] text-[13px] text-right border-r border-[#E4E4EF]">
                      ${Math.round(row.amount).toLocaleString()}
                    </td>
                    <td className="px-2 py-1 text-[#636363] text-[13px] text-right">
                      {((row.amount / total) * 100).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonutChart;

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

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const DonutChart = ({ values, operatExpAmt }: any) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

  // Exclude Sales from total
  const total =
    labourCost + taxAmount + royalty + operatingExpenses + validProfit;

  const hasData = total > 0;

  // Normalize percentages to sum to 100%
  const percentages = total > 0
    ? {
        labourCost: ((labourCost / total) * 100).toFixed(2),
        taxAmount: ((taxAmount / total) * 100).toFixed(2),
        royalty: ((royalty / total) * 100).toFixed(2),
        operatingExpenses: ((operatingExpenses / total) * 100).toFixed(2),
        profit: ((validProfit / total) * 100).toFixed(2),
      }
    : {
        labourCost: 0,
        taxAmount: 0,
        royalty: 0,
        operatingExpenses: 0,
        profit: 0,
      };

  // Ensure percentages sum to 100%
  const percentageValues = [
    Number(percentages.labourCost),
    Number(percentages.taxAmount),
    Number(percentages.royalty),
    Number(percentages.operatingExpenses),
    Number(percentages.profit),
  ];
  const percentageSum = percentageValues.reduce((sum, val) => sum + val, 0);
  const normalizedPercentages =
    percentageSum > 0
      ? percentageValues.map((val) => ((val / percentageSum) * 100).toFixed(2))
      : percentageValues.map(() => 0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    setIsMobile(mediaQuery.matches);

    const handleResize = (e: any) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  const backgroundColors = [
    "#4B4B4B", // Labour Cost
    "#DAB777", // Sales Tax
    "#653C59", // Royalty
    "#FF5555", // Operating Expenses
    "#3CB371", // Profit
  ];

  const data = hasData
    ? {
        labels: ["Labour Cost", "Sales Tax", "Royalty", "Expenses", "Profit"],
        datasets: [
          {
            data: normalizedPercentages,
            backgroundColor: backgroundColors,
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

  const topIndices = normalizedPercentages
    .map((value, index) => ({ index, value: Number(value) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
    .map((item) => item.index);

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: {
        display: hasData && !isMobile,
        color: (context) => backgroundColors[context.dataIndex % backgroundColors.length],
        font: { size: 14 },
        formatter: (value, context) => {
          const index = context.dataIndex;
          if (topIndices.includes(index)) {
            const label = context.chart.data.labels![index] as string;
            return `${label.length > 10 ? label.slice(0, 10) + "..." : label}: ${Number(
              value
            ).toFixed(1)}%`;
          }
          return null;
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
      return <p className="m-0 font-bold">No Data Available</p>;
    }

    if (hoveredIndex === null) {
      return (
        <p className="m-0 font-bold" style={{ fontSize: "28px" }}>
          {values?.net_sales
            ? `$${Math.round(values?.net_sales).toLocaleString()}`
            : "$00,000"}
        </p>
      );
    }
    

    const labels = ["Labour Cost", "Sales Tax", "Royalty", "Expenses", "Profit"];
    const amounts = [labourCost, taxAmount, royalty, operatingExpenses, validProfit];
    const label = labels[hoveredIndex];
    const percentage = normalizedPercentages[hoveredIndex];
    const amount = Math.round(amounts[hoveredIndex]).toLocaleString();
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
          <p className="m-0 font-bold text-sm">{firstLine}</p>
          <p className="m-0 font-bold text-sm">{secondLine}</p>
          <p className="m-0 text-sm">{Number(percentage).toFixed(2)}%</p>
          <p className="m-0 text-sm">${amount}</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center space-y-1">
        <p className="m-0 font-bold text-sm">{label}</p>
        <p className="m-0 text-sm">{Number(percentage).toFixed(2)}%</p>
        <p className="m-0 text-sm">${amount}</p>
      </div>
    );
  };

  return (
    <main>
      <div className="relative w-[470px] h-[470px] tablet:w-[500px] tablet:h-[500px] below-md:w-[430px] below-md:h-[430px] mx-auto rounded-lg pt-8 pb-8">
        <Doughnut data={data} options={options} plugins={[ChartDataLabels]} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-base text-gray-800 max-w-[80%]">
          {renderCenterText()}
        </div>
      </div>
    </main>
  );
};

export default DonutChart;
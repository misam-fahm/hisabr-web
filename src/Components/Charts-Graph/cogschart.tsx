"use client";
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
import NoDataFound from "@/Components/UI/NoDataFound/NoDataFound";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface CogsChartProps {
  storeid: string | null;
  startdate: string | null;
  enddate: string | null;
  cogsData: { sellername: string; producttotal: number }[];
  colors: string[];
}

const CogsChart: React.FC<CogsChartProps> = ({
  storeid,
  startdate,
  enddate,
  cogsData,
  colors,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Detect mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
    };
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!storeid || !startdate || !enddate) {
    return (
      <div className="w-full max-w-[300px] h-[300px] mx-auto md:max-w-[400px] md:h-[400px] lg:max-w-[450px] lg:h-[450px]">
        <Skeleton circle height="100%" width="100%" />
      </div>
    );
  }

  if (!cogsData.length) {
    return (
      <div className="w-full max-w-[300px] h-[300px] mx-auto md:max-w-[400px] md:h-[400px] lg:max-w-[450px] lg:h-[450px]">
        <NoDataFound />
      </div>
    );
  }

  const labels = cogsData.map((item) =>
    item.sellername === "Gordon Food Service Inc"
      ? item.sellername
      : item.sellername || "N/A"
  );
  const values = cogsData.map((item) => item.producttotal);
  const total = values.reduce((sum, val) => sum + val, 0);
  const hasData = total > 0;

  const chartData = hasData
    ? {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: colors,
            borderWidth: 2,
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
            borderWidth: 2,
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
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: {
        display: hasData,
        color: "#000000",
        font: { size: 13, weight: "bold" },
        formatter: (value, context) => {
          const percentage = ((value / total) * 100).toFixed(1);
          if (parseFloat(percentage) > 4) {
            return `${percentage}%`;
          }
          return null;
        },
        align: "center",
        anchor: "center",
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
        <p className="m-0 font-bold text-xl md:text-3xl">
          ${Math.round(total).toLocaleString()}
        </p>
      );
    }
    const label = labels[hoveredIndex];
    const value = values[hoveredIndex];
    const percentage = ((value / total) * 100).toFixed(2);
    const maxLength = isMobile ? 14 : 18; // 14 for mobile, 18 for desktop

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
          <p className="m-0 text-sm">{percentage}%</p>
          <p className="m-0 text-sm">${Math.round(value).toLocaleString()}</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center space-y-1">
        <p className="m-0 font-bold text-sm">{label}</p>
        <p className="m-0 text-sm">{percentage}%</p>
        <p className="m-0 text-sm">${Math.round(value).toLocaleString()}</p>
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-[300px] h-[300px] mx-auto md:max-w-[400px] md:h-[400px] lg:max-w-[450px] lg:h-[450px]">
      <Doughnut
        data={chartData}
        options={options}
        plugins={[ChartDataLabels]}
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-base text-gray-800 max-w-[80%]">
        {renderCenterText()}
      </div>
    </div>
  );
};

export default CogsChart;
import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  Plugin,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const TenderRevenueChart = ({ tenderData }: any) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Calculate total revenue and percentages
  const totalRevenue = tenderData?.reduce((sum: number, row: any) => sum + (row.payments || 0), 0) || 0;
  const hasData = totalRevenue > 0;

  const percentages = tenderData?.map((row: any) => {
    const revenue = row.payments || 0;
    return totalRevenue > 0 ? ((revenue / totalRevenue) * 100).toFixed(2) : 0;
  }) || [];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Chart data
  const data = hasData
    ? {
        labels: tenderData.map((row: any) => row.tendername || "Unknown"),
        datasets: [
          {
            data: percentages.map((percentage: string) => Number(percentage) || 0),
            backgroundColor: [
              "#00BFFF", // Sales-like color
              "#3CB371", // Profit-like color
              "#4B4B4B", // Labour Cost-like color
              "#DAB777", // Sales Tax-like color
              "#653C597A", // Royalty-like color
              "#FF5555", // Expenses-like color
            ].slice(0, tenderData.length), // Match colors to the number of tenders
            borderWidth: 2,
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
          },
        ],
      };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Disable default legend
      },
      tooltip: {
        enabled: true,
      },
    },
    cutout: "70%", // Donut hole size
    layout: {
      padding: {
        left: 120,
        right: 120,
      },
    },
  };

 const centerTextPlugin: Plugin<"doughnut"> = {
    id: "centerTextPlugin",
    beforeDraw(chart) {
      const { ctx, width, height } = chart;
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const centerX = width / 2;
      const centerY = height / 2;

      // Display total amount without decimals
      ctx.font = "bold 18px Arial";
      ctx.fillStyle = "#000";
      ctx.fillText(
        `$${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
        centerX,
        centerY
      );
      ctx.restore();
    },
  };

  // Custom plugin to display labels with lines
  const customArrowsPlugin: Plugin<"doughnut"> = {
    id: "customArrowsPlugin",
    afterDatasetDraw(chart) {
      if (isMobile) return;

      const { ctx, chartArea, data: chartData } = chart;
      const meta = chart.getDatasetMeta(0);

      if (!ctx || !meta || !chartData) return;

      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;
      const outerRadius = Math.min(chartArea.width, chartArea.height) / 2;

      meta.data.forEach((arc, index) => {
        const label = chartData.labels![index] as string;
        const value = chartData.datasets[0].data[index] as number;

        if (value === 0) return; // Skip if value is 0

        const arcElement = arc as ArcElement;
        const angle = (arcElement.startAngle + arcElement.endAngle) / 2;
        const startX = centerX + Math.cos(angle) * (outerRadius * 0.9);
        const startY = centerY + Math.sin(angle) * (outerRadius * 0.9);
        const midX = centerX + Math.cos(angle) * outerRadius;
        const midY = centerY + Math.sin(angle) * outerRadius;

        let labelX = midX + (angle > Math.PI ? -50 : 50);
        let labelY = midY;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(midX, midY);
        ctx.strokeStyle = "#675660B8";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(midX, midY);
        ctx.lineTo(labelX, labelY);
        ctx.strokeStyle = "#675660B8";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(startX, startY, 3, 0, 2 * Math.PI);
        ctx.fillStyle = "#675660B8";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(labelX, labelY, 3, 0, 2 * Math.PI);
        ctx.fillStyle = "#675660B8";
        ctx.fill();

        ctx.save();
        ctx.font = "500 12px Arial";
        ctx.fillStyle = "#4A4A4A";
        ctx.textAlign = angle > Math.PI ? "right" : "left";
        ctx.fillText(label, labelX + (angle > Math.PI ? -5 : 5), labelY - 5);
        ctx.restore();

        ctx.save();
        ctx.font = "700 12px Arial";
        ctx.fillStyle = "#0A0A0A";
        ctx.textAlign = angle > Math.PI ? "right" : "left";
        ctx.fillText(`${value}%`, labelX + (angle > Math.PI ? -5 : 5), labelY + 15);
        ctx.restore();
      });
    },
  };

  return (
    <main>
      <div className="below-md:hidden w-[470px] h-[470px] tablet:w-[500px] tablet:h-[500px]">
        <Doughnut
          data={data}
          options={options}
          plugins={[centerTextPlugin, customArrowsPlugin]}
        />
      </div>
   
    </main>
  );
};

export default TenderRevenueChart;
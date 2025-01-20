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

const DonutChart: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

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

  const data = {
    labels: ["Profit", "Labour Cost", "Sales Tax", "ROYALTY", "COGS"],
    datasets: [
      {
        data: [65.2, 16.0, 8.6, 9.0, 9.8],
        backgroundColor: [
          "#53755599", // profit
          "#DAB777", // Labour cost
          "#653C597A", // Sales Tax
          "#79AFC7", // Royalty
          "#AC8892", // Cogs
        ],
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
    },
    cutout: "70%", // Donut hole size
    layout: {
      padding: {
        left: 105,
        right: 85,
      },
    },
  };

  // Custom plugin to display text labels and data values vertically (column)
  const customArrowsPlugin: Plugin<"doughnut"> = {
    id: "customArrowsPlugin",
    afterDatasetDraw(chart) {
      if (isMobile) return; // Skip drawing on mobile

      const { ctx, chartArea, data: chartData } = chart;
      const meta = chart.getDatasetMeta(0);

      if (!ctx || !meta || !chartData) return;

      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;
      const outerRadius = Math.min(chartArea.width, chartArea.height) / 2;

      // Define custom colors for each label
      const lineColors = [
        "#6E7F6F",
        "#998156",
        "#675660B8",
        "#5E6B7E",
        "#5A3D5599",
      ];
      const labelColors = [
        "#3A3A3A",
        "#4A4A4A",
        "#5A5A5A",
        "#6A6A6A",
        "#7A7A7A",
      ];
      const valueColors = [
        "#0A0A0A",
        "#0A0A0A",
        "#0A0A0A",
        "#0A0A0A",
        "#0A0A0A",
      ];

      meta.data.forEach((arc, index) => {
        const arcElement = arc as ArcElement;
        const angle = (arcElement.startAngle + arcElement.endAngle) / 2;
        const startX = centerX + Math.cos(angle) * (outerRadius * 0.9);
        const startY = centerY + Math.sin(angle) * (outerRadius * 0.9);
        const midX = centerX + Math.cos(angle) * outerRadius;
        const midY = centerY + Math.sin(angle) * outerRadius;

        let labelX = midX + (angle > Math.PI ? -50 : 50);
        let labelY = midY;

        // Check if it's the 'Labour Cost' index and make it vertical with a horizontal line outside the chart
        if (chartData.labels![index] === "Labour Cost") {
          labelX = centerX + Math.cos(angle) * (outerRadius * 1.5);
          labelY = centerY + Math.sin(angle) * (outerRadius * 1);

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(midX, midY);
          ctx.strokeStyle = lineColors[index];
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(midX, midY);
          ctx.lineTo(labelX, labelY);
          ctx.strokeStyle = lineColors[index];
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          labelX = midX + (angle > Math.PI ? -50 : 50);
          labelY = midY;

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(midX, midY);
          ctx.strokeStyle = lineColors[index];
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(midX, midY);
          ctx.lineTo(labelX, labelY);
          ctx.strokeStyle = lineColors[index];
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(startX, startY, 3, 0, 2 * Math.PI);
        ctx.fillStyle = lineColors[index];
        ctx.fill();

        ctx.beginPath();
        ctx.arc(labelX, labelY, 3, 0, 2 * Math.PI);
        ctx.fillStyle = lineColors[index];
        ctx.fill();

        ctx.save();
        ctx.font = "500 12px Arial";
        ctx.fillStyle = labelColors[index];
        ctx.textAlign = angle > Math.PI ? "right" : "left";
        ctx.fillText(
          chartData.labels![index] as string,
          labelX + (angle > Math.PI ? -5 : 5),
          labelY - 5
        );

        ctx.restore();

        ctx.save();
        ctx.font = "700 12px Arial";
        ctx.fillStyle = valueColors[index];
        ctx.textAlign = angle > Math.PI ? "right" : "left";
        ctx.fillText(
          `${chartData.datasets[0].data[index]}%`,
          labelX + (angle > Math.PI ? -5 : 5),
          labelY + 15
        );
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
          plugins={[customArrowsPlugin]}
        />
      </div>
      <div className="below-lg:hidden tablet:hidden below-md:w-[430px] below-md:h-[430px]">
        <Doughnut
          data={data}
          options={options}
          plugins={isMobile ? [customArrowsPlugin] : []}
        />
      </div>
    </main>
  );
};

export default DonutChart;

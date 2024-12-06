import React from "react";
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
  const data = {
    labels: ["Profit", "Labor Cost", "Sales Tax", "ROYALTY", "COGS"],
    datasets: [
      {
        data: [65.2, 16.0, 8.6, 9.0, 9.8],
        backgroundColor: [
          "#53755599", // profit
          "#DAB777", // Labor cost
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
        display: false, // Hide default legend
      },
    },
    cutout: "70%", // Donut hole size
    layout: {
      padding: {
        top: 50,
        bottom: 50,
        left: 100,
        right: 120,
      },
    },
  };

  // Custom plugin with dots and arrows
  const customArrowsPlugin: Plugin<"doughnut"> = {
    id: "customArrowsPlugin",
    afterDatasetDraw(chart) {
      const { ctx, chartArea, data: chartData } = chart;
      const meta = chart.getDatasetMeta(0);

      if (!ctx || !meta || !chartData) return;

      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;
      const outerRadius = Math.min(chartArea.width, chartArea.height) / 2;

      meta.data.forEach((arc, index) => {
        const angle = (arc.startAngle + arc.endAngle) / 2; // Midpoint of the arc
        const startX = centerX + Math.cos(angle) * (outerRadius * 0.9); // Vertical line start (inside)
        const startY = centerY + Math.sin(angle) * (outerRadius * 0.9); // Vertical line start (inside)
        const midX = centerX + Math.cos(angle) * outerRadius; // Vertical line end
        const midY = centerY + Math.sin(angle) * outerRadius; // Vertical line end
        const labelX = midX + (angle > Math.PI ? -50 : 50); // Horizontal line end
        const labelY = midY; // Keep it aligned horizontally

        // Draw vertical line (standing line inside)
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(midX, midY);
        ctx.strokeStyle = "#888";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw horizontal line (sleeping line outside)
        ctx.beginPath();
        ctx.moveTo(midX, midY);
        ctx.lineTo(labelX, labelY);
        ctx.strokeStyle = "#888";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw dots at both ends
        ctx.beginPath();
        ctx.arc(startX, startY, 3, 0, 2 * Math.PI); // Dot at start
        ctx.fillStyle = "#888";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(labelX, labelY, 3, 0, 2 * Math.PI); // Dot at end
        ctx.fillStyle = "#888";
        ctx.fill();

        // Draw label text
        ctx.save();
        ctx.font = "bold 12px Arial";
        ctx.fillStyle = "#333";
        ctx.textAlign = angle > Math.PI ? "right" : "left"; // Adjust alignment
        ctx.fillText(
          `${chartData.labels![index]} ${chartData.datasets[0].data[index]}%`,
          labelX + (angle > Math.PI ? -5 : 5), // Slight adjustment for readability
          labelY - 5
        );
        ctx.restore();
      });
    },
  };

  return (
    <div style={{ width: "500px", height: "500px" }}>
      <Doughnut data={data} options={options} plugins={[customArrowsPlugin]} />
    </div>
  );
};

export default DonutChart;

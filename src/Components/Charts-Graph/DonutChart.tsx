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

const DonutChart = ({values}:any ) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);


  const labourCost = Number(values?.labour_cost) || 0;
  const taxAmount = Number(values?.tax_amt) || 0;
  const royalty = values?.net_sales ? Number((values.net_sales * 0.09).toFixed(2)) : 0;
  const operatingExpenses = values?.labour_cost ?  109817 : 0;

  const total = labourCost + taxAmount + royalty + operatingExpenses;

  const hasData = total > 0;

  // Prevent division by zero
  const percentages = total > 0 ? {
    labourCost: ((labourCost / total) * 100).toFixed(2),
    taxAmount: ((taxAmount / total) * 100).toFixed(2),
    royalty: ((royalty / total) * 100).toFixed(2),
    operatingExpenses: ((operatingExpenses / total) * 100).toFixed(2),
  } : {
    labourCost: 0,
    taxAmount: 0,
    royalty: 0,
    operatingExpenses: 0,
  };


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

  const data = hasData
  ? {
      labels: ["Labour Cost", "Sales Tax", "ROYALTY", "Operating Expenses"],
      datasets: [
        {
          data: [
            Number(percentages?.labourCost) || 0,
            Number(percentages?.taxAmount) || 0,
            Number(percentages?.royalty) || 0,
            Number(percentages?.operatingExpenses) || 0,
          ],
          backgroundColor: ["#53755599", "#DAB777", "#653C597A", "#79AFC7"],
          borderWidth: 2,
        },
      ],
    }
  : {
      labels: ["No Data Available"],
      legend: {
        display: hasData, // Hide legend when no data
      },
      datasets: [
        {
          data: [100], // Dummy data to keep the chart structure
          backgroundColor: ["#E0E0E0"], // Grey color for empty state
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
        left: 120,
        right: 120,
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
       
      ];
      const labelColors = [
        "#3A3A3A",
        "#4A4A4A",
        "#5A5A5A",
        "#6A6A6A",
       
      ];
      const valueColors = [
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

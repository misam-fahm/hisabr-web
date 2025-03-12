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

const DonutChart = ({values , operatExpAmt}:any ) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const sales:any = values?.net_sales ? `${Math.round(values?.net_sales)}` : 0;
  const royalty = values?.net_sales ? values?.net_sales * ((values?.royalty / 100) || 0.09) : 0;
  const profit:any = values?.net_sales ?`${Math.round(values?.net_sales - values?.producttotal - values?.labour_cost - operatExpAmt - royalty)}`  : 0;
  // const CustomerCount = values?.customer_count ? `${Math.round(values?.customer_count)?.toLocaleString()}` : '00,000' ;
  const labourCost = Number(values?.labour_cost) || 0;
  const taxAmount = Number(values?.tax_amt) || 0;
 
  const validProfit = profit < 0 ? 0 : profit;

  const total:any = labourCost + taxAmount + royalty + operatExpAmt + sales + validProfit ;

  const hasData = total > 0;

  // Prevent division by zero
  const percentages = total > 0 ? {
    labourCost: ((labourCost / total) * 100).toFixed(2),
    taxAmount: ((taxAmount / total) * 100).toFixed(2),
    royalty: ((royalty / total) * 100).toFixed(2),
    operatingExpenses: ((operatExpAmt / total) * 100).toFixed(2),
    profit:((validProfit / total) * 100).toFixed(2),
    sales: ((sales / total) * 100).toFixed(2),
  } : {
    labourCost: 0,
    taxAmount: 0,
    royalty: 0,
    operatingExpenses: 0,
    profit:0,
    sales:0,
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
      labels: [ "Sales" , "Profit" , "Labour Cost", "Sales Tax", "ROYALTY", " Expenses" ],
      datasets: [
        {
          data: [
            Number(percentages?.sales) || 0,
             Number(percentages?.profit) || 0,
              Number(percentages?.labourCost) || 0,
              Number(percentages?.taxAmount) || 0,
              Number(percentages?.royalty) || 0,
              Number(percentages?.operatingExpenses) || 0,
          ],
          backgroundColor: [
            "#00BFFF", // Sales
            "#3CB371", // Profit (Dark Green)
            "#4B4B4B", // Labour Cost (Dark Gray)
            "#DAB777", // Sales Tax (Same)
            "#653C597A",
            // "#DAB777", // Royalty (Same)
            "#FF5555", // Operating Expenses (Light Red)
          ],
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
  
      // Define custom colors for selected labels
      const lineColors = {
        Profit: "#6E7F6F",
        Sales: "#998156",
        "Labour Cost": "#675660B8",
      };
  
      const labelColors = {
        Profit: "#3A3A3A",
        Sales: "#4A4A4A",
        "Labour Cost": "#5A5A5A",
      };
  
      const valueColors = {
        Profit: "#0A0A0A",
        Sales: "#0A0A0A",
        "Labour Cost": "#0A0A0A",
      };
  
      meta.data.forEach((arc, index) => {
        const label = chartData.labels![index] as string;
        const value = chartData.datasets[0].data[index] as number;
  
        // Only draw for selected labels and hide Profit if it's 0
        if (!["Profit", "Sales", "Labour Cost"].includes(label) || (label === "Profit" && value === 0)) return;
  
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
        ctx.strokeStyle = lineColors[label];
        ctx.lineWidth = 1;
        ctx.stroke();
  
        ctx.beginPath();
        ctx.moveTo(midX, midY);
        ctx.lineTo(labelX, labelY);
        ctx.strokeStyle = lineColors[label];
        ctx.lineWidth = 1;
        ctx.stroke();
  
        ctx.beginPath();
        ctx.arc(startX, startY, 3, 0, 2 * Math.PI);
        ctx.fillStyle = lineColors[label];
        ctx.fill();
  
        ctx.beginPath();
        ctx.arc(labelX, labelY, 3, 0, 2 * Math.PI);
        ctx.fillStyle = lineColors[label];
        ctx.fill();
  
        ctx.save();
        ctx.font = "500 12px Arial";
        ctx.fillStyle = labelColors[label];
        ctx.textAlign = angle > Math.PI ? "right" : "left";
        ctx.fillText(label, labelX + (angle > Math.PI ? -5 : 5), labelY - 5);
        ctx.restore();
  
        ctx.save();
        ctx.font = "700 12px Arial";
        ctx.fillStyle = valueColors[label];
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

"use client";
import { FC } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LineChart: FC = () => {
  // Load your custom marker images
  const blueMarker = new Image();
  blueMarker.src = "/images/blue.svg"; // Image for first dataset
  const greenMarker = new Image();
  greenMarker.src = "/images/green_dot.svg"; // Image for second dataset

  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "2023",
        data: [
          7000, 2000, 4000, 3000, 5000, 2000, 7000, 3000, 7000, 6000, 11000,
          5000,
        ],
        borderColor: "#2563EB",
        backgroundColor: "rgba(37, 99, 235, 0.1)", // Adjusted for better transparency
        fill: true,
        tension: 0.4,
        pointStyle: blueMarker,
        pointRadius: 10,
        pointHoverRadius: 12,
      },
      {
        label: "2024",
        data: [
          14000, 9000, 9000, 13000, 7000, 3000, 14000, 6000, 18000, 17000,
          17000, 7000,
        ],
        borderColor: "#388E3C",
        backgroundColor: "rgba(111, 209, 149, 0.1)", // Adjusted for better transparency
        fill: true,
        tension: 0.4,
        pointStyle: greenMarker,
        pointRadius: 10,
        pointHoverRadius: 12,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return `$${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: "#F7F8F9",
          borderDash: [5, 5], // Dotted lines
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          display: true,
          color: "#F7F8F9",
          borderDash: [5, 5], // Dotted lines
        },
        ticks: {
          callback: (value: number) => `$${value / 1000}k`,
          font: {
            size: 12,
          },
          stepSize: 4000,
        },
        min: 0,
        max: 20000,
      },
    },
    elements: {
      line: {
        borderWidth: 1,
      },
    },
  };

  return (
    <div className=" p-[8px] w-[100%] h-[100%]">
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;

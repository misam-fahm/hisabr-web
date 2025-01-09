"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Data for the chart
const data: any = [
  { month: "Jan", "2021": 20000, "2022": 30000, "2023": 40000, "2024": 60000 },
  { month: "Feb", "2021": 1000, "2022": 2000, "2023": 45000, "2024": 6000 },
  { month: "Mar", "2021": 15000, "2022": 40000, "2023": 50000, "2024": 70000 },
  { month: "Apr", "2021": 35000, "2022": 45000, "2023": 55000, "2024": 75000 },
  { month: "May", "2021": 40000, "2022": 40000, "2023": 60000, "2024": 80000 },
  { month: "Jun", "2021": 45000, "2022": 55000, "2023": 65000, "2024": 40000 },
  { month: "Jul", "2021": 5000, "2022": 60000, "2023": 70000, "2024": 90000 },
  { month: "Aug", "2021": 55000, "2022": 5000, "2023": 75000, "2024": 95000 },
  { month: "Sep", "2021": 40000, "2022": 70000, "2023": 80000, "2024": 100000 },
  { month: "Oct", "2021": 65000, "2022": 75000, "2023": 85000, "2024": 15000 },
  { month: "Nov", "2021": 70000, "2022": 80000, "2023": 90000, "2024": 110000 },
  { month: "Dec", "2021": 75000, "2022": 85000, "2023": 95000, "2024": 115000 },
];

// Custom Dot to display images for the data points
interface CustomDotProps {
  cx: number;
  cy: number;
  value: number;
  year: string;
}

const CustomDot: React.FC<CustomDotProps> = ({ cx, cy, value, year }) => {
  const yearImages: Record<string, string> = {
    "2021": "/images/2021.svg",
    "2022": "/images/2022.svg",
    "2023": "/images/2023.svg",
    "2024": "/images/2024.svg",
  };

  const yearColors: Record<string, string> = {
    "2021": "rgba(95, 128, 133, 0.25)", // Light Pink for 2021
    "2022": "rgba(222, 197, 96, 0.25)", // Light Green for 2022
    "2023": "rgba(121, 108, 114, 0.25)", // Light Blue for 2023
    "2024": "rgba(121, 108, 114, 0.25)", // Light Yellow for 2024
  };

  const size = 17; // Size of the background square
  const imageWidth = 10; // Custom width for the image
  const imageHeight = 10; // Custom height for the image

  return (
    <>
      <rect
        x={cx - size / 2}
        y={cy - size / 2}
        width={size}
        height={size}
        fill={yearColors[year] ?? "#FFFFFF"} // Default color if year not found
        style={{
          clipPath: "circle(50%)", // Ensures the image is fully rounded
        }}
      />
      <image
        x={cx - imageWidth / 2} // Adjust X to center the image
        y={cy - imageHeight / 2} // Adjust Y to center the image
        width={imageWidth} // Custom width
        height={imageHeight} // Custom height
        href={yearImages[year] ?? ""}
        style={{
          clipPath: "circle(50%)", // Ensures the image stays circular
        }}
      />
    </>
  );
};

// Custom legend content for displaying images with years below them
const CustomLegend: React.FC = () => {
  const yearImages: Record<string, string> = {
    "2021": "/images/20212.svg",
    "2022": "/images/20222.svg",
    "2023": "/images/20232.svg",
    "2024": "/images/20242.svg",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {Object.keys(yearImages).map((year) => (
        <div
          key={year}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 10px",
          }}
        >
          <img
            src={yearImages[year]}
            alt={year}
            width={30}
            height={30}
            style={{
              borderRadius: "50%",
              padding: "5px",
            }}
          />
          <span style={{ marginTop: "5px", fontSize: "12px" }}>{year}</span>
        </div>
      ))}
    </div>
  );
};

const MultiLineChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={330}>
      <LineChart data={data} margin={{ top: 20, right: 30, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />

        {/* X-Axis */}
        <XAxis dataKey="month" className="text-[#000000B2] text-[12px]" />

        {/* Y-Axis */}
        <YAxis
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} // Format to avoid decimals
          domain={[
            Math.min(
              ...data.map((item) =>
                Math.min(item["2021"], item["2022"], item["2023"], item["2024"])
              )
            ),
            Math.max(
              ...data.map((item) =>
                Math.max(item["2021"], item["2022"], item["2023"], item["2024"])
              )
            ),
          ]}
          tickCount={7} // Custom ticks
          axisLine={false} // Remove Y-axis line
          tickLine={false} // Remove tick lines
          className="text-[#000000B2] text-[12px]"
        />

        {/* Tooltip */}
        <Tooltip formatter={(value) => `$${value}`} />

        {/* Custom Legend with images and years below */}
        <Legend content={<CustomLegend />} />

        {/* Line for 2021 */}
        <Line
          type="monotone"
          dataKey="2021"
          stroke="#3C5A7A"
          dot={(props) => {
            const { key, ...restProps } = props;
            return (
              <CustomDot
                key={`dot-2021-${props.cx}`}
                {...restProps}
                year="2021"
              />
            );
          }}
        />

        {/* Line for 2022 */}
        <Line
          type="monotone"
          dataKey="2022"
          stroke="#D78F47"
          dot={(props) => {
            const { key, ...restProps } = props;
            return (
              <CustomDot
                key={`dot-2022-${props.cx}`}
                {...restProps}
                year="2022"
              />
            );
          }}
        />

        {/* Line for 2023 */}
        <Line
          type="monotone"
          dataKey="2023"
          stroke="#F0D75C"
          dot={(props) => {
            const { key, ...restProps } = props;
            return (
              <CustomDot
                key={`dot-2023-${props.cx}`}
                {...restProps}
                year="2023"
              />
            );
          }}
        />

        {/* Line for 2024 */}
        <Line
          type="monotone"
          dataKey="2024"
          stroke="#77638A"
          dot={(props) => {
            const { key, ...restProps } = props;
            return (
              <CustomDot
                key={`dot-2024-${props.cx}`}
                {...restProps}
                year="2024"
              />
            );
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MultiLineChart;

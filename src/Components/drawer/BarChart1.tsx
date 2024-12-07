"use client";

import { FC, useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", value: 1500000 },
  { month: "Feb", value: 1200000 },
  { month: "Mar", value: 2000000 },
  { month: "Apr", value: 900000 },
  { month: "May", value: 1700000 },
  { month: "Jun", value: 1300000 },
  { month: "Jul", value: 1800000 },
  { month: "Aug", value: 1100000 },
  { month: "Sep", value: 1400000 },
  { month: "Oct", value: 1600000 },
  { month: "Nov", value: 1900000 },
  { month: "Dec", value: 2500000 }, // Last value updated to 2500000
];

const SimpleBarChart: FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 800); // Mobile if screen width is ≤ 800px
    };

    handleResize(); // Check on initial load
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-[100%] h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={
            isMobile
              ? { right: 10, left: 12 }
              : { top: 1, right: 25, left: 25, bottom: 20 }
          }
        >
          {/* X-Axis */}
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => (isMobile ? value.charAt(0) : value)}
          />
          {/* Y-Axis */}
          <YAxis
            axisLine={false}
            tickLine={false}
            domain={[0, 2500000]} // Ensure the Y-axis accommodates the max value
            ticks={[0, 500000, 1000000, 1500000, 2000000, 2500000]} // Custom tick marks
            tickFormatter={(value) =>
              isMobile ? `${value / 1000}k` : value.toLocaleString()
            }
            tick={{ fontSize: 12 }}
          />
          {/* Tooltip */}
          <Tooltip />
          {/* Bar for the chart */}
          <Bar
            dataKey="value"
            fill="rgba(95, 57, 92, 0.8)"
            barSize={isMobile ? 8 : 30}
            radius={[3, 3, 0, 0]} // Rounded top corners
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleBarChart;

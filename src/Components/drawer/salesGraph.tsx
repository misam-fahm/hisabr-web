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
  { year: "2024", value: 1500000 },
  { year: "2023", value: 1200000 },
  { year: "2022", value: 2000000 },
  { year: "2021", value: 900000 },
  { year: "2020", value: 1700000 },
  { year: "2019", value: 1300000 },
  { year: "2018", value: 1800000 },
  { year: "2017", value: 1100000 },
];

const SimpleBarChart: FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size for mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 800);
    };

    handleResize(); // Check initial screen size
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={
            isMobile
              ? { right: 5, left: 0 }
              : { top: 1, right: 25, left: 30, bottom: 20 }
          }
        >
          {/* X-Axis */}
          <XAxis
            dataKey="year"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />
          {/* Y-Axis */}
          <YAxis
            axisLine={false}
            tickLine={false}
            domain={[0, 2500000]} // Ensure the Y-axis accommodates the max value
            ticks={[0, 500000, 1000000, 1500000, 2000000, 2500000]} // Custom tick marks
            tickFormatter={(value) =>
              isMobile ? `${value / 1000}k` : value.toLocaleString()
            } // Format as "k" for mobile or default for desktop
            tick={{ fontSize: 12 }}
          />
          {/* Tooltip */}
          <Tooltip
            formatter={(value: number) => value.toLocaleString()} // Format tooltip values
          />

          {/* Bar for the chart */}
          <Bar
            dataKey="value"
            fill="rgba(236, 162, 96, 0.8)"
            barSize={isMobile ? 8 : 30}
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleBarChart;

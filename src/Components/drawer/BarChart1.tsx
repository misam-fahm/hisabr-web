"use client";

import { FC } from "react";
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
  return (
    <div className="w-[100%] h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
        >
          {/* X-Axis */}
          <XAxis dataKey="month" axisLine={false} tickLine={false} />
          {/* Y-Axis */}
          <YAxis
            axisLine={false}
            tickLine={false}
            domain={[0, 2500000]} // Ensure the Y-axis accommodates the max value
            ticks={[0, 500000, 1000000, 1500000, 2000000, 2500000]} // Custom tick marks
          />
          {/* Tooltip */}
          <Tooltip />
          {/* Bar for the chart */}
          <Bar
            dataKey="value"
            fill="rgba(95, 57, 92, 0.8)"
            barSize={30}
            radius={[3, 3, 0, 0]} // Rounded top corners
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleBarChart;

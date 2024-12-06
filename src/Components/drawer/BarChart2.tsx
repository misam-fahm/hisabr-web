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
  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
        >
          {/* X-Axis */}
          <XAxis dataKey="year" axisLine={false} tickLine={false} />
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
          <Bar dataKey="value" fill="rgba(236, 162, 96, 0.8)" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleBarChart;

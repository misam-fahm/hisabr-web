import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Updated data with months
const yearData: Record<number, { month: string; value1: number }[]> = {
  2021: [
    { month: "Jan", value1: 15000 },
    { month: "Feb", value1: 16000 },
    { month: "Mar", value1: 17000 },
    { month: "Apr", value1: 18000 },
    { month: "May", value1: 14000 },
    { month: "Jun", value1: 12000 },
    { month: "Jul", value1: 13000 },
    { month: "Aug", value1: 14000 },
    { month: "Sep", value1: 15000 },
    { month: "Oct", value1: 16000 },
    { month: "Nov", value1: 17000 },
    { month: "Dec", value1: 18000 },
  ],
  2022: [
    { month: "Jan", value1: 16000 },
    { month: "Feb", value1: 17000 },
    { month: "Mar", value1: 18000 },
    { month: "Apr", value1: 19000 },
    { month: "May", value1: 15000 },
    { month: "Jun", value1: 13000 },
    { month: "Jul", value1: 14000 },
    { month: "Aug", value1: 15000 },
    { month: "Sep", value1: 16000 },
    { month: "Oct", value1: 17000 },
    { month: "Nov", value1: 18000 },
    { month: "Dec", value1: 19000 },
  ],
};

const BarChart3: React.FC<{ selectedYear: number }> = ({ selectedYear }) => {
  const chartData = yearData[selectedYear] || [];

  return (
    <ResponsiveContainer width="100%" height={330}>
      <BarChart data={chartData} barSize={35} barGap={8} barCategoryGap={12}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12 }}
          tickMargin={10}
          interval={0}
          angle={0}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(tick) => `${tick / 1000}k`} // Updated to display in 'k' format
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
          domain={[0, 25000]}
          ticks={[0, 5000, 10000, 15000, 20000, 25000]} // Defined ticks explicitly
        />
        <Tooltip />
        <Legend
          formatter={() => (
            <span style={{ color: "#000000B2", fontSize: "12px" }}>
              Customer count
            </span>
          )}
        />
        <Bar
          dataKey="value1"
          stackId="a"
          fill="rgba(127, 97, 125, 0.8)"
          radius={[5, 5, 0, 0]}
          background={{ fill: "rgba(127, 97, 125, 0.2)" }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChart3;

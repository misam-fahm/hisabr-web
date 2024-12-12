"use client"
import React, { useState, useEffect } from "react";
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

const yearData: Record<number, { category: string; value1: number }[]> = {
  2021: [
    { category: "Beverage", value1: 150000 },
    { category: "Cakes", value1: 160000 },
    { category: "Food", value1: 170000 },
    { category: "Novelties", value1: 180000 },
    { category: "Soft Serve", value1: 140000 },
    { category: "Donations", value1: 120000 },
  ],
  2022: [
    { category: "Beverage", value1: 160000 },
    { category: "Cakes", value1: 170000 },
    { category: "Food", value1: 180000 },
    { category: "Novelties", value1: 190000 },
    { category: "Soft Serve", value1: 150000 },
    { category: "Donations", value1: 130000 },
  ],
};




const BarChart3: React.FC<{ selectedYear: number }> = ({ selectedYear }) => {
  const chartData = yearData[selectedYear] || [];

  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 801);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial state based on current window size

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={330}>
      <BarChart
        data={chartData}
        barSize={isMobile ? 20 : 35}
        barGap={8}
        barCategoryGap={12}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="category"
          tick={{ fontSize: 12 }}
          tickMargin={10}
          interval={0}
          angle={0}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(tick) => `$${tick / 1000}k`}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
          domain={[0, 250000]}
          ticks={[0, 50000, 100000, 150000, 200000, 250000]}
        />
        <Tooltip />
        <Legend
          formatter={() => (
            <span style={{ color: "#000000B2", fontSize: "12px" }}>
              {selectedYear}
            </span>
          )}
        />
        <Bar
          dataKey="value1"
          stackId="a"
          fill="rgba(200, 127, 94, 0.8)"
          radius={[5, 5, 0, 0]}
          background={{ fill: "rgba(200, 127, 94, 0.2)" }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChart3;

"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Group A", value: 200000 },
  { name: "Group B", value: 150000 },
  { name: "Group C", value: 100000 },
  { name: "Group D", value: 80000 },
  { name: "Group E", value: 121645 }, // Total sums to 651,645
];

const COLORS = ["#796C72", "#376066CC", "#DEC560", "#5B7993", "#C87F5E"];

const DonutChart = () => {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="w-full h-[400px] flex justify-center items-center relative">
      {/* Ensure the container has position: relative */}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* Donut Chart */}
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            dataKey="value"
            startAngle={90}
            endAngle={450} // Adjust for donut rotation
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {/* Center Text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: "12px", color: "#737373", fontWeight: "500" }}>
          Total Items
        </div>
        <div style={{ fontSize: "28px", fontWeight: "bold", color: "#0A0A0A" }}>
          {new Intl.NumberFormat('en-US').format(total)}
        </div>
      </div>
    </div>
  );
};

export default DonutChart;

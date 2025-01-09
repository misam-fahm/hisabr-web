"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Group A", value: 200000 },
  { name: "Group B", value: 150000 },
];

const COLORS = ["#376066CC", "#DEC560"];

const DonutChart = () => {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="w-full h-[300px] flex justify-center items-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart className="relative z-50">
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
            tabIndex={-1} // Disable focus
            style={{ outline: "none" }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",

              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            }}
            labelStyle={{
              fontWeight: "bold",
              fontSize: "14px",
              color: "#333",
            }}
            itemStyle={{
              fontSize: "15px",
              color: "#737373",
              background: "white",
            }}
          />
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
          Total Customers
        </div>
        <div style={{ fontSize: "28px", fontWeight: "bold", color: "#0A0A0A" }}>
          {total.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default DonutChart;

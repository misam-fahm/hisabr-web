"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Beverage", value: 200000 },
  { name: "Cakes", value: 150000 },
  { name: "Food", value: 100000 },
  { name: "Novelties-Boxed", value: 80000 },
  { name: "Soft Serve", value: 121645 }, // Total sums to 651,645
];

const COLORS = ["#796C72", "#376066CC", "#DEC560", "#5B7993", "#C87F5E"];

const DonutChart = () => {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="w-full h-[320px] flex justify-center items-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart className="relative z-30">
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
              outline: "none",
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
          zIndex: "10",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            color: "#737373",
            fontWeight: "500",
            background: "white",
            position: "relative",
            zIndex: "10",
          }}
        >
          Total Items
        </div>
        <div
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#0A0A0A",
            background: "white",
            position: "relative",
            zIndex: "10",
          }}
        >
          {total.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default DonutChart;

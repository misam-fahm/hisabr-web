"use client";

import { AnyCnameRecord } from "dns";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const colorMapping: { [key: string]: string } = {
  "Beverages": "#376066CC",
  "Seafood": "#DEC560",
  "Frozen": "#5B7993",
  "Meat": "red",
  "Dessert": "brown",
  "Grocery": "#796C79",
  "Packaged & Other": "black",
  "Dairy": "gray",
  "Produce": "#796C79",
  "Cleaning Products": "lightblue",
  "Tortilla": "green",
};

const DonutChart = ({ enhancedItems = [], totalExtPrice ,totalQty }: any) => {
  const data: any = enhancedItems?.map((item: any) => ({
    name: item.itemname, 
    value: item.totalextprice, // Keep value as a number
  })) || [];

  if (data.length === 0) return <div>No data available</div>;

  return (
    <div className="w-full h-auto flex justify-center items-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart className="relative z-30">
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            dataKey="value"
            startAngle={90}
            endAngle={450}
            tabIndex={-1}
            style={{ outline: "none" }}
          >
            {data.map((entry: any, index: any) => (
              <Cell key={`cell-${index}`} fill={colorMapping[entry.name] || "#ccc"} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Sales"]}
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
          ${totalExtPrice?.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default DonutChart;



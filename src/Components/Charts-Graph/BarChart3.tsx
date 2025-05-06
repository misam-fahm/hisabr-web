"use client";
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
    { category: "Cake", value1: 160000 },
    { category: "Food", value1: 170000 },
    { category: "Novelty", value1: 180000 },
    { category: "Soft Serve", value1: 140000 },
    { category: "Donation", value1: 120000 },
  ],
  2022: [
    { category: "Beverage", value1: 160000 },
    { category: "Cake", value1: 170000 },
    { category: "Food", value1: 180000 },
    { category: "Novelty", value1: 190000 },
    { category: "Soft Serve", value1: 150000 },
    { category: "Donation", value1: 130000 },
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

  // Custom function to render X-axis tick with wrapping (applied only on mobile)
  const renderCustomizedTick = (props: any) => {
    const { x, y, payload } = props;
    const lines = payload.value.split(" "); // Split category names into words for wrapping
    return (
      <g transform={`translate(${x},${y})`}>
        {lines.map((line: string, index: number) => (
          <text
            key={index}
            x={0}
            y={index * 12} // Adjust spacing between lines
            textAnchor="middle"
            fontSize={10}
            fill="#666"
          >
            {line}
          </text>
        ))}
      </g>
    );
  };

  // Default tick rendering with different font size for larger screens
  const renderDefaultTick = (props: any) => {
    const { x, y, payload } = props;
    return (
      <text
        x={x}
        y={y + 10} // Adjust vertical positioning
        textAnchor="middle"
        fontSize={isMobile ? 10 : 14} // Different font size for mobile vs large screens
        fill="#666"
      >
        {payload.value}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={330}>
      <BarChart
        data={chartData}
        barSize={isMobile ? 20 : 35}
        barGap={8}
        barCategoryGap={12}
        margin={
          isMobile
            ? { right: 10, left: -10 }
            : { top: 1, right: 25, left: 10, bottom: 20 }
        }
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="category"
          tick={isMobile ? renderCustomizedTick : renderDefaultTick}
          tickMargin={10}
          interval={0}
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
          content={({ payload }) => (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {payload?.map((entry, index) => (
                <div
                  key={`item-${index}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "0 10px",
                  }}
                >
                  {/* Rounded box */}
                  <span
                    style={{
                      display: "inline-block",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%", // Rounded box
                      backgroundColor: entry.color, // Bar color
                      marginRight: "8px",
                      marginTop: "10px",
                    }}
                  ></span>
                  {/* Category name */}
                  <span
                    style={{
                      color: "#000000B2",
                      fontSize: "14px",
                      marginTop: "10px",
                    }}
                  >
                    {selectedYear}
                  </span>
                </div>
              ))}
            </div>
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
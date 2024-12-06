import React, { FC } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
} from "recharts";

const data = [
  { name: "Jan", Expense: 90, Sale: 40, Profit: 70 },
  { name: "Feb", Expense: 20, Sale: 30, Profit: 50 },
  { name: "Mar", Expense: 50, Sale: 50, Profit: 60 },
  { name: "Apr", Expense: 20, Sale: 20, Profit: 40 },
  { name: "May", Expense: 40, Sale: 60, Profit: 50 },
  { name: "Jun", Expense: 30, Sale: 30, Profit: 60 },
  { name: "Jul", Expense: 60, Sale: 50, Profit: 80 },
  { name: "Aug", Expense: 20, Sale: 40, Profit: 70 },
  { name: "Sep", Expense: 80, Sale: 90, Profit: 85 },
  { name: "Oct", Expense: 70, Sale: 80, Profit: 80 },
  { name: "Nov", Expense: 90, Sale: 70, Profit: 60 },
  { name: "Dec", Expense: 30, Sale: 20, Profit: 50 },
];

const CustomChart: FC = () => {
  return (
    <div className="w-full h-[299px] relative z-10">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          {/* X-Axis */}
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
              fill: "#000000B2",
            }}
          />
          {/* Left Y-Axis */}
          <YAxis
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            tick={{
              fontSize: 12,
              fill: "#000000B2",
            }}
          />
          {/* Right Y-Axis */}
          <YAxis
            yAxisId="right"
            orientation="right"
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            tick={{
              fontSize: 12,
              fill: "#000000B2",
            }}
          />
          {/* Tooltip */}
          <Tooltip cursor={false} />
          {/* Legend */}
          <Legend
            content={({ payload }) => (
              <div style={{ display: "flex", justifyContent: "center" }}>
                {payload
                  ?.filter((entry, index) => index !== 2) // Exclude the third label
                  .map((entry, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginRight: 20,
                      }}
                    >
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          backgroundColor: entry.color,
                          marginRight: 5,
                        }}
                      ></div>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#000000B2",
                        }}
                      >
                        {entry.value}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          />
          {/* Bars */}
          <Bar
            dataKey="Expense"
            fill="rgba(190, 152, 161, 0.5)"
            barSize={25}
            radius={[3, 3, 0, 0]}
          />
          <Bar
            dataKey="Sale"
            fill="rgba(68, 100, 95, 0.7)"
            barSize={25}
            radius={[3, 3, 0, 0]}
          />
          {/* Shadow Area for Profit */}
          <defs>
            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C08238" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#C08238" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="Profit"
            stroke="none"
            fill="url(#colorProfit)"
          />
          {/* Line for Profit */}
          <Line
            type="monotone"
            dataKey="Profit"
            stroke="#C08238"
            strokeWidth={2}
            dot
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomChart;

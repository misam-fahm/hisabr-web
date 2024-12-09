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
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen size is less than 801px
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 801);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial state based on current window size

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prepare chart data based on screen size
  const chartData =
    yearData[selectedYear]?.map((item) => ({
      ...item,
      month: isMobile ? item.month[0] : item.month, // Display short month name on mobile
    })) || [];

  return (
    <ResponsiveContainer width="100%" height={330}>
      <BarChart
        data={chartData}
        barSize={isMobile ? 10 : 35} // Smaller bar size for mobile
        barGap={8}
        barCategoryGap={12}
        margin={isMobile ? { right: 20, left: -8 } : { right: 20, left: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: isMobile ? 10 : 12 }}
          tickMargin={10}
          interval={0}
          angle={0}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(tick) => `${tick / 1000}k`}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
          domain={[0, 25000]}
          ticks={[0, 5000, 10000, 15000, 20000, 25000]}
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

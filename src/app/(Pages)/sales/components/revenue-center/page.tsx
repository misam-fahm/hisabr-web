"use client";

import React from "react";

const paymentData = [
  {
    name: "American Express",
    quantity: 10,
    total: "$223.27",
    percent: "5.99%",
  },
  {
    name: "Cash",
    quantity: 75,
    total: "$772.21",
    percent: "20.71%",
  },
  {
    name: "Delivery Doordash Integrated",
    quantity: 6,
    total: "$112.36",
    percent: "3.01%",
  },
  {
    name: "Discover",
    quantity: 4,
    total: "$49.63",
    percent: "1.33%",
  },
  {
    name: "Gift Card",
    quantity: 26,
    total: "$209.31",
    percent: "5.61%",
  },
  {
    name: "Master Card",
    quantity: 37,
    total: "$510.31",
    percent: "13.6%",
  },
];

const PaymentTable: React.FC = () => {
  return (
    <div className="overflow-x-auto rounded-lg mb-16 shadow-md">
      <table className="min-w-full">
        <thead className="bg-[#334155] text-white">
          <tr className=" text-[15px] font-medium">
            <th className="px-4 py-2 text-left font-medium">Name</th>
            <th className="px-4 py-2 text-left font-medium">Quantity</th>
            <th className="px-4 py-2 text-left font-medium">Total</th>
            <th className="px-4 py-2 text-left font-medium">Percent</th>
          </tr>
        </thead>
        <tbody>
          {paymentData.map((row, index) => (
            <tr
              key={index}
              className={`${index % 2 === 0 ? "bg-[#F8F9FB]" : "bg-white"}`}
            >
              <td className="px-4 py-2 text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
                {row.name}
              </td>
              <td className="px-8 py-2 text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
                {row.quantity}
              </td>

              <td className="px-4 py-2 text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
                {row.total}
              </td>
              <td className="px-4 py-2 text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
                {row.percent}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentTable;

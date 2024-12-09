"use client";

import React from "react";

// Payment data
const paymentData = [
  {
    name: "American Express",
    quantity: 10,
    total: 223.27,

    percent: "5.99%",
  },
  {
    name: "Cash",
    quantity: 75,
    total: 772.21,
    taxes: 45.2,
    percent: "20.71%",
  },
  {
    name: "Delivery Doordash Integrated",
    quantity: 6,
    total: 112.36,

    percent: "3.01%",
  },
  {
    name: "Discover",
    quantity: 4,
    total: 49.63,

    percent: "1.33%",
  },
];

const PaymentTable: React.FC = () => {
  // Calculate the total amount and total taxes
  const grandTotal = paymentData.reduce((acc, item) => acc + item.total, 0);

  return (
    <div className="overflow-x-auto rounded-lg mb-16 shadow-md">
      <table className="min-w-full">
        <thead className="bg-[#334155] text-white">
          <tr className="text-[15px] font-medium">
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
                ${row.total.toFixed(2)}
              </td>

              <td className="px-4 py-2 text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
                {row.percent}
              </td>
            </tr>
          ))}
          {/* Add total row */}
          <tr className="bg-[#F8F9FC]">
            <td className="px-4 py-2 text-[#636363] text-[14px]">Total</td>
            <td className="px-8 py-2 text-[#636363] text-[14px]"></td>
            <td className="px-4 py-2 text-[#636363] text-[14px]">
              ${grandTotal.toFixed(2)}
            </td>

            <td className="px-4 py-2 text-[#636363] text-[14px]"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PaymentTable;

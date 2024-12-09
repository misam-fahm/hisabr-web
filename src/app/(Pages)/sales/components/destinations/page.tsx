"use client";

import React from "react";

const discountData = [
  {
    name: "$ Discount",
    quantity: 1,
    total: "$234.86",
    percent: "100%",
  },
  {
    name: "$ Discount Mobile",
    quantity: 1,
    total: "$0.00",
    percent: "0.00%",
  },
  {
    name: "$ 0.50 Off Blizzard",
    quantity: 3,
    total: "$0.00",
    percent: "0.00%",
  },
  {
    name: "% Discount",
    quantity: 1,
    total: "$0.00",
    percent: "0.00%",
  },
  {
    name: "Total Destinations",
    quantity: 12,
    total: "$35.09",
    percent: "",
  },
];

const DiscountTable: React.FC = () => {
  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="min-w-full border-collapse">
        <thead className="bg-[#334155] text-white">
          <tr className="text-[15px] font-medium">
            <th className="px-4 py-2 text-left font-medium">Name</th>
            <th className="px-4 py-2 text-left font-medium">Quantity</th>
            <th className="px-4 py-2 text-left font-medium">Total</th>
            <th className="px-4 py-2 text-left font-medium">Percent</th>
          </tr>
        </thead>
        <tbody>
          {discountData.map((row, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-[#F8F9FC]" : "bg-white"
              } text-[14px]`}
            >
              <td className="px-4 py-2 text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
                {row.name}
              </td>
              <td className="px-9 py-2 text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
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

export default DiscountTable;

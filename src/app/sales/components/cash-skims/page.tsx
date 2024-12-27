"use client";

import React from "react";

const discountData = [
  {
    name: "Cash Skim",
    quantity: 0,
    total: "$234.86",
  },
  {
    name: "Total Cash Skims",
    quantity: 0,
    total: "$35.09",
  },
];

const DiscountTable: React.FC = () => {
  return (
    <main>
      <div className="overflow-x-auto below-md:hidden rounded-lg shadow-md">
        <table className="min-w-full border-collapse">
          <thead className="bg-[#334155] text-white">
            <tr className="text-[15px] font-medium">
              <th className="px-4 py-2 text-left font-medium">Name</th>
              <th className="px-4 py-2 text-left font-medium">Quantity</th>
              <th className="px-4 py-2 text-left font-medium">Total</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="below-lg:hidden tablet:hidden">
        <div className="flex flex-col">
          <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
            <div className="flex justify-between items-center border-b border-[#E4E4EF] pb-2 mb-4 mt-2 px-2 text-sm">
              <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                <span>American Express</span>
              </div>
            </div>
            <div className="space-y-3 mb-2 px-2">
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">American Express</p>
                <p className="text-[#1A1A1A] text-[12px]"> 10</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Total</p>
                <p className="text-[#1A1A1A] text-[12px]"> $223.27</p>
              </div>
            </div>
          </div>

          <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
            <div className="flex justify-between items-center border-b border-[#E4E4EF] pb-2 mb-4 mt-2 px-2 text-sm">
              <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                <span>American Express</span>
              </div>
            </div>
            <div className="space-y-3 mb-2 px-2">
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">American Express</p>
                <p className="text-[#1A1A1A] text-[12px]"> 10</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Total</p>
                <p className="text-[#1A1A1A] text-[12px]"> $223.27</p>
              </div>
            </div>
          </div>

          <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
            <div className="flex justify-between items-center border-b border-[#E4E4EF] pb-2 mb-4 mt-2 px-2 text-sm">
              <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                <span>American Express</span>
              </div>
            </div>
            <div className="space-y-3 mb-2 px-2">
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">American Express</p>
                <p className="text-[#1A1A1A] text-[12px]"> 10</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Total</p>
                <p className="text-[#1A1A1A] text-[12px]"> $223.27</p>
              </div>
            </div>
          </div>

          <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
            <div className="flex justify-between items-center border-b border-[#E4E4EF] pb-2 mb-4 mt-2 px-2 text-sm">
              <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                <span>American Express</span>
              </div>
            </div>
            <div className="space-y-3 mb-2 px-2">
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">American Express</p>
                <p className="text-[#1A1A1A] text-[12px]"> 10</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Total</p>
                <p className="text-[#1A1A1A] text-[12px]"> $223.27</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DiscountTable;

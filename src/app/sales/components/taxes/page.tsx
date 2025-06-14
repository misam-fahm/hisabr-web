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
    <main>
      <div className="overflow-x-auto rounded-lg  below-md:hidden shadow-sm border border-[#E4E4EF]">
        <table className="min-w-full">
          <thead className="bg-[#334155] text-white">
            <tr className="text-[15px] font-medium">
              <th className="px-4 py-2 text-left font-normal">Name</th>
              <th className="px-4 py-2 text-right font-normal">Quantity</th>
              <th className="px-4 py-2 text-right font-normal">Total</th>
              <th className="px-4 py-2 text-right font-normal">Percent</th>
            </tr>
          </thead>
          <tbody>
            {paymentData.map((row, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-[#F8F9FB]" : "bg-white"}`}
              >
                {/* Left-Aligned Text for Name */}
                <td className="px-4 py-1.5 text-left text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
                  {row.name}
                </td>

                {/* Right-Aligned Numeric Columns */}
                <td className="px-5 py-1.5 text-right text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
                  {row.quantity}
                </td>
                <td className="px-4 py-1.5 text-right text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
                  ${row.total.toFixed(2)}
                </td>
                <td className="px-4 py-1.5 text-right text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
                  {row.percent}
                </td>
              </tr>
            ))}
            {/* Total Row */}
            <tr className="bg-[#F8F9FC]">
              <td className="px-4 py-2 text-left text-[#636363] text-[14px]">
                Total
              </td>
              <td className="px-8 py-2 text-right text-[#636363] text-[14px]"></td>
              <td className="px-4 py-2 text-right text-[#636363] text-[14px]">
                ${grandTotal.toFixed(2)}
              </td>
              <td className="px-4 py-2 text-right text-[#636363] text-[14px]"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="below-lg:hidden tablet:hidden">
        <div className="flex flex-col">
          <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
            <div className=" items-center mb-4 mt-2 px-2">
              <div className="flex justify-between pb-2 w-[100%] border-b border-[#E4E4EF]">
                <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                  <span>American Express</span>
                </div>
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
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]"> Percent</p>
                <p className="text-[#1A1A1A] text-[12px]">5.99%</p>
              </div>
            </div>
          </div>

          <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
            <div className=" items-center mb-4 mt-2 px-2">
              <div className="flex justify-between pb-2 w-[100%] border-b border-[#E4E4EF]">
                <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                  <span>American Express</span>
                </div>
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
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]"> Percent</p>
                <p className="text-[#1A1A1A] text-[12px]">5.99%</p>
              </div>
            </div>
          </div>

          <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
            <div className=" items-center mb-4 mt-2 px-2">
              <div className="flex justify-between pb-2 w-[100%] border-b border-[#E4E4EF]">
                <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                  <span>American Express</span>
                </div>
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
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]"> Percent</p>
                <p className="text-[#1A1A1A] text-[12px]">5.99%</p>
              </div>
            </div>
          </div>

          <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
            <div className=" items-center mb-4 mt-2 px-2">
              <div className="flex justify-between pb-2 w-[100%] border-b border-[#E4E4EF]">
                <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                  <span>American Express</span>
                </div>
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
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]"> Percent</p>
                <p className="text-[#1A1A1A] text-[12px]">5.99%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaymentTable;

"use client";

import React from "react";

const paymentData = [
  {
    name: "American Express",
    quantity: 10,
    payment: "$223.27",
    tips: "$0.00",
    total: "$223.27",
    percent: "5.99%",
  },
  {
    name: "Cash",
    quantity: 75,
    payment: "$772.21",
    tips: "$0.00",
    total: "$772.21",
    percent: "20.71%",
  },
  {
    name: "Delivery Doordash Integrated",
    quantity: 6,
    payment: "$112.36",
    tips: "$0.00",
    total: "$112.36",
    percent: "3.01%",
  },
  {
    name: "Discover",
    quantity: 4,
    payment: "$49.63",
    tips: "$0.00",
    total: "$49.63",
    percent: "1.33%",
  },
  {
    name: "Gift Card",
    quantity: 26,
    payment: "$209.21",
    tips: "$0.00",
    total: "$209.31",
    percent: "5.61%",
  },
  {
    name: "Master Card",
    quantity: 37,
    payment: "$510.21",
    tips: "$0.00",
    total: "$510.31",
    percent: "13.6%",
  },
  {
    name: "Mobile/ Web Order",
    quantity: 3,
    payment: "$54.75",
    tips: "$0.00",
    total: "$54.75",
    percent: "1.47%",
  },
  {
    name: "Visa",
    quantity: 137,
    payment: "$1,796.49",
    tips: "$0.00",
    total: "$1,796.49",
    percent: "48.1%",
  },
];

const PaymentTable: React.FC = () => {
  return (
    <main>
      <div className="overflow-x-auto rounded-lg mb-16 shadow-md  below-md:hidden">
        <table className="min-w-full below-md:hidden">
          <thead className="bg-[#334155] text-white">
            <tr className=" text-[15px] font-medium">
              <th className="px-4 py-2 text-left font-medium">Name</th>
              <th className="px-4 py-2 text-left font-medium">Quantity</th>
              <th className="px-4 py-2 text-left font-medium">Payment</th>
              <th className="px-4 py-2 text-left font-medium">Tips</th>
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
                  {row.payment}
                </td>
                <td className="px-4 py-2 text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
                  {row.tips}
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
                <p className="text-[#808080] text-[14px]">Payment</p>
                <p className="text-[#1A1A1A] text-[12px]">$3201</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Tips</p>
                <p className="text-[#1A1A1A] text-[12px]">$0</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Total</p>
                <p className="text-[#1A1A1A] text-[12px]">$3201</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Percent</p>
                <p className="text-[#1A1A1A] text-[12px]">10%</p>
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
                <p className="text-[#808080] text-[14px]">Payment</p>
                <p className="text-[#1A1A1A] text-[12px]">$3201</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Tips</p>
                <p className="text-[#1A1A1A] text-[12px]">$0</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Total</p>
                <p className="text-[#1A1A1A] text-[12px]">$3201</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Percent</p>
                <p className="text-[#1A1A1A] text-[12px]">10%</p>
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
                <p className="text-[#808080] text-[14px]">Payment</p>
                <p className="text-[#1A1A1A] text-[12px]">$3201</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Tips</p>
                <p className="text-[#1A1A1A] text-[12px]">$0</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Total</p>
                <p className="text-[#1A1A1A] text-[12px]">$3201</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Percent</p>
                <p className="text-[#1A1A1A] text-[12px]">10%</p>
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
                <p className="text-[#808080] text-[14px]">Payment</p>
                <p className="text-[#1A1A1A] text-[12px]">$3201</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Tips</p>
                <p className="text-[#1A1A1A] text-[12px]">$0</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Total</p>
                <p className="text-[#1A1A1A] text-[12px]">$3201</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Percent</p>
                <p className="text-[#1A1A1A] text-[12px]">10%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaymentTable;
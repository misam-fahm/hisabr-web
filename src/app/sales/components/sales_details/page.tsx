"use client";

import React from "react";

interface TableData {
  category: string;
  rows: { description: string; value: string }[];
}

const data: TableData[] = [
  {
    category: "Sales Summary",
    rows: [
      { description: "Date", value: "17/10/2013" },
      { description: "Store ID", value: "56,484.47" },
      { description: "Gross Sales", value: "$3,484.47" },
      { description: "Net Sales", value: "$3,484.47" },
      { description: "Tax Collected", value: "$3,484.47" },
      { description: "Total Sales Count", value: "234" },
      { description: "Average Sales Count", value: "$3,484.47" },
    ],
  },
  {
    category: "Sales Breakdown",
    rows: [
      { description: "Total Items Sales", value: "$3,484.47" },
      { description: "Taxable Item Sales", value: "$3,484.47" },
      { description: "Non-Taxable Item Sales", value: "$3,484.47" },
      { description: "Non-Revenue Item", value: "$2,956.12" },
    ],
  },
  {
    category: "Labour Information",
    rows: [
      { description: "Labor Cost", value: "$636.32" },
      { description: "Labor Hours", value: "$59.72" },
      { description: "Labor Percentage of Sales", value: "$59.72" },
      { description: "Sales per Labor Hour", value: "$59.72" },
    ],
  },
  {
    category: "Cash Flow",
    rows: [
      { description: "Cash Tips Received", value: "$636.32" },
      { description: "Cash Deposits Accepted", value: "$59.72" },
      { description: "Deposits Redeemed", value: "$59.72" },
      { description: "Cash Paid in", value: "$59.72" },
      { description: "Cash Paid Out", value: "$59.72" },
      { description: "Total Cash", value: "$59.72" },
    ],
  },
  {
    category: "Discounts & Promotions",
    rows: [
      { description: "Total Discounts Given", value: "$636.32" },
      { description: "Total Promotion Applied", value: "$59.72" },
    ],
  },
  {
    category: "Gift Card Information",
    rows: [
      { description: "Gift Card Reload Amount", value: "$636.32" },
      { description: "Gift Card Cash Out Count", value: "482" },
      { description: "Gift Card Cash Out Amount", value: "$59.72" },
      { description: "Gift Card Promotions", value: "$59.72" },
      { description: "Gift Card Issue Count", value: "5972" },
      { description: "Gift Card Issue Amount", value: "$59.72" },
    ],
  },
  {
    category: "Refunds & Voids",
    rows: [
      { description: "Refund Issued", value: "$636.32" },
      { description: "Voids", value: "$59.72" },
    ],
  },
  {
    category: "Miscellaneous",
    rows: [
      { description: "Donation Count", value: "86362" },
      { description: "Donation Total", value: "$59.72" },
    ],
  },
];

const TableComponent: React.FC = () => {
  return (
    <main>
      <div className="below-md:hidden  overflow-x-auto rounded-lg shadow-sm border border-[#E4E4EF]">
        <div
          className=" overflow-y-auto  scrollbar-hide "
          style={{ maxHeight: "calc(100vh - 192px)" }}
        >
          <table className="min-w-full bg-white table-fixed">
            <thead className="bg-[#334155] text-white sticky top-0 z-[2]">
              <tr>
                <th className="px-4 py-2 text-left text-[15px] font-normal">
                  Category
                </th>
                <th className="px-4 py-2 text-left text-[15px] font-normal">
                  Description
                </th>
                <th className="px-4 py-2 text-right text-[15px] font-normal">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((section, index) => (
                <React.Fragment key={index}>
                  {section.rows.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={`${rowIndex === 0 ? "bg-[#F8F9FCFA]" : ""}`} // Apply a background color for the first row of each section
                    >
                      <td className="px-4 py-1.5 text-left text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
                        {rowIndex === 0 ? section.category : ""}
                      </td>
                      <td className="px-4 py-1.5 text-left text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
                        {row.description}
                      </td>
                      <td className="px-4 py-1.5 text-right  text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="below-lg:hidden tablet:hidden">
        <div className="flex flex-col">
          <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
            <div className=" items-center mb-4 mt-2 px-2">
              <div className="flex justify-between pb-2 w-[100%] border-b border-[#E4E4EF]">
                <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                  <span>Sales Summary</span>
                </div>
              </div>
            </div>
            <div className="space-y-3 mb-2 px-2">
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Date</p>
                <p className="text-[#1A1A1A] text-[12px]">12-01-22</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Store ID</p>
                <p className="text-[#1A1A1A] text-[12px]">DY</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Gross Sales</p>
                <p className="text-[#1A1A1A] text-[12px]">213</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Net Sales</p>
                <p className="text-[#1A1A1A] text-[12px]">CS</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Tax Collected</p>
                <p className="text-[#1A1A1A] text-[12px]">4 x 2 LB</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Total Sales Count</p>
                <p className="text-[#1A1A1A] text-[12px]">$ 36.37</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">
                  Average Sales Count
                </p>
                <p className="text-[#1A1A1A] text-[12px]">$ 11.83</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Tax</p>
                <p className="text-[#1A1A1A] text-[12px]">-</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Total</p>
                <p className="text-[#1A1A1A] text-[12px]">$ 43.37</p>
              </div>
            </div>
          </div>

          <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
            <div className=" items-center mb-4 mt-2 px-2">
              <div className="flex justify-between pb-2 w-[100%] border-b border-[#E4E4EF]">
                <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                  <span>Sales Summary</span>
                </div>
              </div>
            </div>
            <div className="space-y-3 mb-2 px-2">
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Date</p>
                <p className="text-[#1A1A1A] text-[12px]">12-01-22</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Store ID</p>
                <p className="text-[#1A1A1A] text-[12px]">DY</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Gross Sales</p>
                <p className="text-[#1A1A1A] text-[12px]">213</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Net Sales</p>
                <p className="text-[#1A1A1A] text-[12px]">CS</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Tax Collected</p>
                <p className="text-[#1A1A1A] text-[12px]">4 x 2 LB</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Total Sales Count</p>
                <p className="text-[#1A1A1A] text-[12px]">$ 36.37</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">
                  Average Sales Count
                </p>
                <p className="text-[#1A1A1A] text-[12px]">$ 11.83</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Tax</p>
                <p className="text-[#1A1A1A] text-[12px]">-</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Total</p>
                <p className="text-[#1A1A1A] text-[12px]">$ 43.37</p>
              </div>
            </div>
          </div>

          <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
            <div className=" items-center mb-4 mt-2 px-2">
              <div className="flex justify-between pb-2 w-[100%] border-b border-[#E4E4EF]">
                <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                  <span>Sales Summary</span>
                </div>
              </div>
            </div>
            <div className="space-y-3 mb-2 px-2">
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Date</p>
                <p className="text-[#1A1A1A] text-[12px]">12-01-22</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Store ID</p>
                <p className="text-[#1A1A1A] text-[12px]">DY</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Gross Sales</p>
                <p className="text-[#1A1A1A] text-[12px]">213</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Net Sales</p>
                <p className="text-[#1A1A1A] text-[12px]">CS</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Tax Collected</p>
                <p className="text-[#1A1A1A] text-[12px]">4 x 2 LB</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Total Sales Count</p>
                <p className="text-[#1A1A1A] text-[12px]">$ 36.37</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">
                  Average Sales Count
                </p>
                <p className="text-[#1A1A1A] text-[12px]">$ 11.83</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Tax</p>
                <p className="text-[#1A1A1A] text-[12px]">-</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Total</p>
                <p className="text-[#1A1A1A] text-[12px]">$ 43.37</p>
              </div>
            </div>
          </div>

          <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
            <div className=" items-center mb-4 mt-2 px-2">
              <div className="flex justify-between pb-2 w-[100%] border-b border-[#E4E4EF]">
                <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                  <span>Sales Summary</span>
                </div>
              </div>
            </div>
            <div className="space-y-3 mb-2 px-2">
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Date</p>
                <p className="text-[#1A1A1A] text-[12px]">12-01-22</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Store ID</p>
                <p className="text-[#1A1A1A] text-[12px]">DY</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Gross Sales</p>
                <p className="text-[#1A1A1A] text-[12px]">213</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Net Sales</p>
                <p className="text-[#1A1A1A] text-[12px]">CS</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Tax Collected</p>
                <p className="text-[#1A1A1A] text-[12px]">4 x 2 LB</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Total Sales Count</p>
                <p className="text-[#1A1A1A] text-[12px]">$ 36.37</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">
                  Average Sales Count
                </p>
                <p className="text-[#1A1A1A] text-[12px]">$ 11.83</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Tax</p>
                <p className="text-[#1A1A1A] text-[12px]">-</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Total</p>
                <p className="text-[#1A1A1A] text-[12px]">$ 43.37</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TableComponent;

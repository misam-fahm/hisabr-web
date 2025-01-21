"use client";

import React from "react";

interface TableData {
  category: string;
  rows: { description: string; value: string }[];
}

const data: TableData[] = [
  {
    category: "General Information",
    rows: [
      { description: "Date", value: "2022-01-02" },
      { description: "Store", value: "13246" },
    ],
  },
  {
    category: "Sales Data",
    rows: [
      { description: "Gross", value: "$4,132.25" },
      { description: "Net", value: "$4,058.08" },
      { description: "Order Count", value: "296" },
      { description: "Guest Count", value: "296" },
      { description: "Total Sales Count", value: "--" },
      { description: "Average", value: "$13.71" },
    ],
  },
  {
    category: "Item Sales",
    rows: [
      { description: "Total Item Sales", value: "$4,132.25" },
      { description: "Taxable Item Sales", value: "$4,058.08" },
      { description: "Non-Taxable Item Sales", value: "$0.00" },
    ],
  },
  {
    category: "Tips",
    rows: [{ description: "Cash Tips Received", value: "$0.00" }],
  },
  {
    category: "Taxes",
    rows: [{ description: "Tax", value: "$284.06" }],
  },
  {
    category: "Deposits",
    rows: [
      { description: "Deposits Accepted Amount", value: "$0.00" },
      { description: "Deposits Redeemed Amount", value: "$0.00" },
      { description: "Cash Deposits Accepted", value: "$0.00" },
      { description: "Deposits Redeemed", value: "$0.00" },
    ],
  },
  {
    category: "Labor Costs",
    rows: [
      { description: "Labour Cost", value: "$687.94" },
      { description: "Labour Hours", value: "62.58" },
      { description: "Labor Percent", value: "16.95%" },
      { description: "Sales Per Labor Hour", value: "$66.03" },
    ],
  },
  {
    category: "Payments",
    rows: [
      { description: "Sales Per Labor Hour", value: "$66.03" },
      { description: "Paid In", value: "$0.00" },
      { description: "Paid Out", value: "$0.00" },
    ],
  },
  {
    category: "Discounts & Promotions",
    rows: [
      { description: "Discounts", value: "--" },
      { description: "Promotions", value: "--" },
      { description: "Gift Card Promotions", value: "--" },
    ],
  },
  {
    category: "Refunds",
    rows: [
      { description: "Refunds", value: "--" },
      { description: "Voids", value: "--" },
    ],
  },
  {
    category: "Gift Card Details",
    rows: [
      { description: "Gift Card Issue Count", value: "--" },
      { description: "Gift Card Issue Amount", value: "--" },
      { description: "Gift Card Reload Count", value: "--" },
      { description: "Gift Card Reload Amount", value: "--" },
      { description: "Gift Card Cash Out Count", value: "--" },
      { description: "Gift Card Cash Out Amount", value: "--" },
    ],
  },
  {
    category: "Non-Revenue Items",
    rows: [{ description: "Non-Revenue Items", value: "$3,455.10" }],
  },
  {
    category: "Cash Details",
    rows: [{ description: "Total Cash", value: "$887.04" }],
  },
  {
    category: "Donations",
    rows: [
      { description: "Donation Count", value: "0" },
      { description: "Donation Total", value: "$0.00" },
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
                      <td className="px-4 py-1.5 text-right text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
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

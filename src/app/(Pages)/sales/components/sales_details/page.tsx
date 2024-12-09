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

    <div className="overflow-x-auto rounded-lg shadow-sm">
      <div className="max-h-[360px] overflow-y-auto  scrollbar-hide">

        <table className="min-w-full bg-white">
          <thead className="bg-[#334155] text-white sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 text-left text-[15px] font-medium">
                Category
              </th>
              <th className="px-4 py-2 text-left text-[15px] font-medium">
                Description
              </th>
              <th className="px-4 py-2 text-left text-[15px] font-medium">
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
                    <td className="px-4 py-2 text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
                      {rowIndex === 0 ? section.category : ""}
                    </td>
                    <td className="px-4 py-2 text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
                      {row.description}
                    </td>
                    <td className="px-4 py-2 text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
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
  );
};

export default TableComponent;

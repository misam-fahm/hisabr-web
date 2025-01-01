"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";


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

  const formattedData = data?.map((item:any) => {
    const rawDate = new Date(item?.date);
  
    // Format the date as MM-DD-YY
    const formattedDate = `${(rawDate?.getMonth() + 1)
      .toString()
      .padStart(
        2,
        "0"
      )}-${rawDate?.getDate().toString().padStart(2, "0")}-${rawDate
      .getFullYear()
      .toString()
      .slice(-2)}`;
  
    return { ...item, date: formattedDate };
  });


  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "category",
      header: () => <div className="text-left">  Category</div>,
      cell: (info) => <span>{info.getValue() as string}</span>,
      size: 160,
    },
    {
      accessorKey: "description",
      header: () => <div className="text-left">Description</div>,
      cell: (info) => <span>{info.getValue() as string}</span>,
      size:160,
    },
    {
      accessorKey: "value",
      header: () => <div className="text-right mr-2">Value</div>,
      cell: (info) => (
        <div className="text-right">{info.getValue() as number}</div>
      ),
      size: 160,
    },
    
    
  ];

  const [globalFilter, setGlobalFilter] = React.useState("");
  
  const table = useReactTable({
    data: formattedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: 0,
      },
    },
  });
  
  return (
    <main
    className="max-h-[calc(100vh-60px)] below-md:max-h-[calc(100vh-1px)] tablet:max-h-[calc(100vh-1px)] below-md:mb-10 tablet:mb-10 overflow-auto"
    style={{ scrollbarWidth: "thin" }}
  >
      <div className="tablet:hidden overflow-x-auto border-collapse border border-gray-200 rounded-lg flex-grow hidden flex-col md:block shadow-md">
      <div className="overflow-hidden max-w-full">
        <table className="w-full border-collapse border-gray-200 table-fixed shadow-lg px-3">
              <thead className="bg-[#334155]  top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="text-left px-4 py-2.5 text-[#FFFFFF] font-medium text-[15px] w-[100px]"
                        style={{ width: `${header.column.getSize()}px` }} // Applying dynamic width
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
            </table>
          
            <div
              className="w-full overflow-y-auto scrollbar-thin flex-grow"
              style={{ maxHeight: "calc(100vh - 240px)" }}
            >
              <table className="w-full border-collapse border-gray-200 shadow table-fixed px-3">
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
                      <td className="px-4 py-2 text-[#636363] text-[14px] text-right whitespace-nowrap overflow-x-auto custom-scrollbar">
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
      </div>

      <div className="below-lg:hidden tablet:hidden">
        <div className="flex flex-col">
          <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
            <div className="flex justify-between items-center border-b border-[#E4E4EF] pb-2 mb-4 mt-2 px-2 text-sm">
              <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                <span>Sales Summary</span>
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
            <div className="flex justify-between items-center border-b border-[#E4E4EF] pb-2 mb-4 mt-2 px-2 text-sm">
              <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                <span>Sales Summary</span>
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
            <div className="flex justify-between items-center border-b border-[#E4E4EF] pb-2 mb-4 mt-2 px-2 text-sm">
              <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                <span>Sales Summary</span>
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
            <div className="flex justify-between items-center border-b border-[#E4E4EF] pb-2 mb-4 mt-2 px-2 text-sm">
              <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                <span>Sales Summary</span>
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

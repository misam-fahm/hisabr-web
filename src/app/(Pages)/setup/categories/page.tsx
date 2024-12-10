"use client";
import React, { FC, useState } from "react";
import DateRange from "@/Components/drawer/DateRangePicker";
import Images from "@/Components/ui/Common/Image";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";

import AddNewItems from "@/Components/Setup/AddNewItems";
import AddCategories from "@/Components/Setup/AddCategories";

interface TableRow {
  name: string;
  description: string;
  noOfItems: number;
}

const data: TableRow[] = [
  {
    name: "Beverage",
    description: "Soft Drinks, Juices",
    noOfItems: 7327,
  },
  {
    name: "Bakery",
    description: "Cold drinks, Juices",
    noOfItems: 43643,
  },
  {
    name: "Dairy",
    description: "Chips., Cookies, Biscuits",
    noOfItems: 8979,
  },
  {
    name: "Snacks",
    description: "Soft Drinks, Juices",
    noOfItems: 7327,
  },
  {
    name: "Soft Serve",
    description: "Cold drinks, Juices",
    noOfItems: 7327,
  },
  {
    name: "Beverage",
    description: "Chips., Cookies, Biscuits",
    noOfItems: 76486,
  },
  {
    name: "Snacks",
    description: "Bread, Cakes, Pasteries",
    noOfItems: 54787,
  },
  {
    name: "Soft Serve",
    description: "Milk, butter, cheese",
    noOfItems: 899,
  },
  {
    name: "Snacks",
    description: "Soft Drinks, Juices",
    noOfItems: 4214,
  },
];

const columns: ColumnDef<TableRow>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "noOfItems",
    header: "No. of Items",
  },

  {
    accessorKey: "edit",
    header: "Edit",
    cell: () => (
      <Images src="/images/edit.svg" alt="edit" width={35} height={35} />
    ),
  },

  {
    id: "delete",
    header: "Delete",
    cell: () => (
      <Images src="/images/delete.svg" alt="delete" width={35} height={35} />
    ),
  },
];
const Page: FC = () => {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 6,
        pageIndex: 0,
      },
    },
  });

  const { pageIndex, pageSize } = table.getState().pagination;
  const totalItems = table.getFilteredRowModel().rows.length;
  const startItem = pageIndex * pageSize + 1;
  const endItem = Math.min((pageIndex + 1) * pageSize, totalItems);

  return (
    <main
      className="max-h-[calc(100vh-10px)] overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <div className=" my-24 mx-6 below-md:my-24">
        <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center mt-4 mb-4 gap-4">
          <p className="text-[16px] font-bold text-[#334155]">
            Item Categories
          </p>

          <div className="flex flex-row gap-2 ">
            <AddNewItems />
            <AddCategories />
          </div>
        </div>

        <div>
          {/* Table */}
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-[#334155]">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="text-left px-4 py-3 text-[#FFFFFF] font-medium text-[15px]"
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
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={
                      row.index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"
                    }
                    
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-1 text-[#636363] text-[14px]"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          

          {/* Pagination */}
          <div className="mt-4 flex gap-2 justify-between items-center">
            {/* Page Range Display */}
            <div>
              <span className="text-[#8899A8] text-[12px] font-medium ml-3">
                {startItem} - {endItem} of {totalItems}
              </span>
            </div>

            {/* Pagination Numbers */}
            <div className="flex flex-row gap-3">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-4 py-2 bg-[#EBEFF6] text-gray-700 rounded-md disabled:opacity-50"
                style={{ background: "#EBEFF6" }}
              >
                <img src="/images/left.svg" />
              </button>

              {Array.from({ length: table.getPageCount() }, (_, index) => {
                const pageIndex = index;
                return (
                  <button
                    key={pageIndex}
                    onClick={() => table.setPageIndex(pageIndex)}
                    className={`px-4 py-2 rounded-md text-[12px] ${
                      table.getState().pagination.pageIndex === pageIndex
                        ? "!important text-[#FFFFFF]"
                        : " text-gray-700"
                    }`}
                    style={{
                      backgroundColor:
                        table.getState().pagination.pageIndex === pageIndex
                          ? "#1AA47D"
                          : "transparent",
                    }}
                  >
                    {pageIndex + 1}
                  </button>
                );
              })}

              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-4 py-2 bg-[gray-200] text-gray-700 rounded-md disabled:opacity-50"
                style={{ background: "#EBEFF6" }}
              >
                <img src="/images/right.svg" />
              </button>

              <div>
                <div className="w-full">
                  {/* Dropdown for Page Selection */}
                  <select
                    value={table.getState().pagination.pageIndex} // Sync with current page index
                    onChange={(e) => table.setPageIndex(Number(e.target.value))} // Update page on selection
                    className=" pl-3 pr-8 py-[10px] rounded-md text-[12px] border-2 bg-[#f7f8f9] cursor-pointer border-[#D8D8DB6E] text-[#637381]"
                  >
                    {Array.from(
                      { length: table.getPageCount() },
                      (_, index) => (
                        <option key={index} value={index}>
                          Page {index + 1}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default Page;

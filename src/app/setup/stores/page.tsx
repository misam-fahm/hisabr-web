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

import AddStore from "@/Components/Setup/AddStore";
import EditStore from "@/Components/Setup/EditStore";

interface TableRow {
  store: string;
  date: string;
  location: string;
  user: string;
  county: string;
  royalty: string;
}

const data: TableRow[] = [
  {
    store: "Store 1",
    date: "13-12-24",
    location: "VatisinVille",
    user: "MORTGAGE",
    county: "10%",
    royalty: "MORTGAGE",
  },
  {
    store: "Store 2",
    date: "13-12-24",
    location: "VatisinVille",
    user: "MORTGAGE",
    county: "10%",
    royalty: "MORTGAGE",
  },
  {
    store: "Store 3",
    date: "13-12-24",
    location: "VatisinVille",
    user: "MORTGAGE",
    county: "10%",
    royalty: "MORTGAGE",
  },
  {
    store: "13246",
    date: "13-12-24",
    location: "VatisinVille",
    user: "MORTGAGE",
    county: "10%",

    royalty: "MORTGAGE",
  },
  {
    store: "Store 2",
    date: "13-12-24",
    location: "VatisinVille",
    user: "MORTGAGE",
    county: "10%",
    royalty: "MORTGAGE",
  },
  {
    store: "Store 1",
    date: "13-12-24",
    location: "VatisinVille",
    user: "MORTGAGE",
    county: "10%",
    royalty: "MORTGAGE",
  },
  {
    store: "Store 2",
    date: "13-12-24",
    location: "VatisinVille",
    user: "MORTGAGE",
    county: "10%",
    royalty: "MORTGAGE",
  },
  {
    store: "Store 3",
    date: "13-12-24",
    location: "VatisinVille",
    user: "MORTGAGE",
    county: "10%",
    royalty: "MORTGAGE",
  },
  {
    store: "Store 1",
    date: "13-12-24",
    location: "VatisinVille",
    user: "MORTGAGE",
    county: "10%",
    royalty: "MORTGAGE",
  },
  {
    store: "Store 2",
    date: "13-12-24",
    location: "VatisinVille",
    user: "MORTGAGE",
    county: "10%",
    royalty: "MORTGAGE",
  },
  {
    store: "Store 3",
    date: "13-12-24",
    location: "VatisinVille",
    user: "MORTGAGE",
    county: "10%",
    royalty: "MORTGAGE",
  },
  {
    store: "13246",
    date: "13-12-24",
    location: "VatisinVille",
    user: "MORTGAGE",
    county: "10%",
    royalty: "MORTGAGE",
  },
];

const columns: ColumnDef<TableRow>[] = [
  {
    accessorKey: "store",
    header: () => <div className="text-left">Store</div>,
    cell: (info) => <span>{info.getValue() as string}</span>,
    size: 100,
  },
  {
    accessorKey: "date",
    header: () => <div className="text-left">Date</div>,
    cell: (info) => <span>{info.getValue() as string}</span>,
    size: 100,
  },

  {
    accessorKey: "location",
    header: () => <div className="text-left">Location</div>,
    cell: (info) => <div className="ml-1">{info.getValue() as string}</div>,
    size: 120,
  },
  {
    accessorKey: "user",
    header: () => <div className="text-left ">User</div>,
    cell: (info) => <div className="ml-2">{info.getValue() as string}</div>,
    size: 100,
  },
  {
    accessorKey: "county",
    header: () => <div className="text-right mr-8">County</div>,
    cell: (info) => (
      <div className="text-right mr-8">{info.getValue() as number}</div>
    ),
    size: 100,
  },
  {
    accessorKey: "royalty",
    header: () => <div className="text-left">Royalty</div>, 
    cell: (info) => <div className="ml-2">{info.getValue() as number}</div>,
    size: 80,
  },
  {
    id: "edit",
    header: () => <div className="text-center">Edit</div>,
    cell: () => (
      <span className="flex justify-center">
      <EditStore/>
      </span>
    ),
    size: 70,
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
        pageSize: 10,
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
      className="max-h-[calc(100vh-60px)] px-6 below-md:px-3  below-md:py-2 overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <div className="flex flex-row justify-end gap-2 below-md:hidden my-6">
        <AddStore />
      </div>

      {/* Mobile View */}
      <div
        className="block md:hidden"
        style={{
          maxHeight: "calc(100vh - 80px)",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch", // Enables smooth scrolling on mobile
          scrollbarWidth: "none", // Hide scrollbar
        }}
      >
        {table.getRowModel().rows.map((row) => (
          <div
            key={row.id}
            className={`border-b border-gray-300 p-3 bg-white rounded-lg mb-2 shadow-sm`}
          >
            <div className="flex justify-between items-center">
              {/* Name */}
              <span className="font-medium text-[16px] text-[#334155]">
                {row.getValue("store")}
              </span>
              <div className="flex items-center gap-3">
                {/* Edit */}
                <Images
                  src="/images/edit1.svg"
                  alt="edit"
                  width={16}
                  height={16}
                  className="cursor-pointer"
                />
              </div>
            </div>

            {/* Border */}
            <div className="h-[1px] bg-gray-300 my-2"></div>
            <div className="text-[14px] mt-1 flex justify-between">
              <span className="text-[#636363]">Date</span>{" "}
              {row.getValue("date")}
            </div>

            <div className="text-[14px] mt-1 flex justify-between">
              <span className="text-[#636363]">Location</span>{" "}
              {row.getValue("location")}
            </div>
            <div className="text-[14px] mt-1 flex justify-between">
              <span className="text-[#636363]">User</span>{" "}
              {row.getValue("user")}
            </div>
            <div className="text-[14px] mt-1 flex justify-between">
              <span className="text-[#636363]">County</span>{" "}
              {row.getValue("county")}
            </div>
            <div className="text-[14px] mt-1 flex justify-between">
              <span className="text-[#636363]">Royalty</span>{" "}
              {row.getValue("royalty")}
            </div>
          </div>
        ))}

        {/* Add Store bottom */}
        <div className=" fixed bottom-[20px] below-lg:hidden right-3">
          {" "}
          <AddStore />
        </div>
      </div>

      {/* Desktop View */}
      <div className="overflow-x-auto shadow-md border-collapse border border-gray-200 rounded-lg flex-grow hidden flex-col md:block">
        <div className="overflow-hidden max-w-full">
          <table className="w-full border-collapse border-gray-200 table-fixed">
            <thead className="bg-[#334155] sticky top-0 z-10">
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
            style={{ maxHeight: "calc(100vh - 270px)" }}
          >
            <table className="w-full border-collapse border-gray-200 table-fixed">
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
                        className="px-4 py-1.5 text-[#636363] text-[14px]"
                        style={{ width: `${cell.column.getSize()}px` }} // Apply width to cells
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
        </div>
      </div>

      <div className="mt-4 flex gap-2 justify-between items-center below-md:hidden">
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
                    ? "bg-[#1AA47D] text-[#FFFFFF]"
                    : "text-gray-700"
                }`}
              >
                {pageIndex + 1}
              </button>
            );
          })}

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2 bg-[#EBEFF6] text-gray-700 rounded-md disabled:opacity-50"
          >
            <img src="/images/right.svg" />
          </button>

          <div>
            <div className="w-full">
              {/* Dropdown for Page Selection */}
              <select
                value={table.getState().pagination.pageIndex} // Sync with current page index
                onChange={(e) => table.setPageIndex(Number(e.target.value))} // Update page on selection
                className="pl-3 pr-8 py-[10px] rounded-md text-[12px] border-2 bg-[#f7f8f9] cursor-pointer border-[#D8D8DB6E] text-[#637381]"
              >
                {Array.from({ length: table.getPageCount() }, (_, index) => (
                  <option key={index} value={index}>
                    Page {index + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default Page;

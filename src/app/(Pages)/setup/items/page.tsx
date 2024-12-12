"use client";
import React, { FC, useState } from "react";
import DateRange from "@/Components/drawer/DateRangePicker";
import Image from "next/image";
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
  category: string;
  price: number;
  quantity: number;
  weight: string;
}

const data: TableRow[] = [
  {
    name: "Milk Packet",
    category: "Dairy",
    price: 80,
    quantity: 100,
    weight: "1 litre",
  },
  {
    name: "Bread Loaf",
    category: " Bakery",
    price: 100,
    quantity: 100,
    weight: "300 gm",
  },
  {
    name: "Butter Stick",
    category: "Dairy  ",
    price: 60,
    quantity: 100,
    weight: "100 gm",
  },
  {
    name: "Chocolate ",
    category: " Bakery",
    price: 120,
    quantity: 100,
    weight: "200 gm",
  },
  {
    name: "Chocolate ",
    category: " Bakery",
    price: 120,
    quantity: 100,
    weight: "200 gm",
  },
  {
    name: "Chocolate ",
    category: " Bakery",
    price: 120,
    quantity: 100,
    weight: "200 gm",
  },
  {
    name: "Chocolate ",
    category: " Bakery",
    price: 120,
    quantity: 100,
    weight: "200 gm",
  },
  {
    name: "Cheese Block",
    category: "Dairy",
    price: 250,
    quantity: 100,
    weight: "1 litre",
  },
  {
    name: "Milk Packet",
    category: " Bakery",
    price: 320,
    quantity: 100,
    weight: "300 gm",
  },
  {
    name: "Chocolate ",
    category: " Bakery",
    price: 120,
    quantity: 100,
    weight: "200 gm",
  },
  {
    name: "Cheese Block",
    category: "Dairy",
    price: 800,
    quantity: 100,
    weight: "1 litre",
  },
  {
    name: "Chocolate",
    category: " Bakery",
    price: 300,
    quantity: 100,
    weight: "300 gm",
  },
  {
    name: "Cheese Block",
    category: "Dairy",
    price: 250,
    quantity: 100,
    weight: "1 litre",
  },
  {
    name: "Milk Packet",
    category: " Bakery",
    price: 320,
    quantity: 100,
    weight: "300 gm",
  },
];

const columns: ColumnDef<TableRow>[] = [
  {
    accessorKey: "name",
    header: () => <div className="text-left">Name</div>,
    cell: (info) => <span>{info.getValue() as string}</span>,

    size: 160, 
  },
  {
    accessorKey: "category",
    header: () => <div className="text-left">Category</div>,
    cell: (info) => <span>{info.getValue() as string}</span>,

    size: 120,
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: (info) => (
      <div className="text-right">{info.getValue() as number}</div>
    ),

    size: 100,
  },
  {
    accessorKey: "quantity",
    header: () => <div className="text-right">Quantity</div>,
    cell: (info) => (
      <div className="text-right">{info.getValue() as string}</div>
    ),

    size: 120,
  },
  {
    accessorKey: "weight",
    header: () => <div className="text-left ml-12">Weight</div>,
    cell: (info) => (
      <div className="text-left ml-14">{info.getValue() as string}</div>
    ),

    size: 150,
  },
  {
    id: "edit",
    header: () => <div className="text-center">Edit</div>,
    cell: () => (
      <div className="flex justify-center cursor-pointer ml-5">
        <Image src="/images/edit.svg" alt="edit" width={32} height={32} />
      </div>
    ),

    size: 80,
  },
  {
    id: "delete",
    header: () => <div className="text-center">Delete</div>,
    cell: () => (
      <div className="flex justify-center cursor-pointer ml-5">
        <Image src="/images/delete.svg" alt="delete" width={32} height={32} />
      </div>
    ),

    size: 80,
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
    <main className="w-full h-screen flex flex-col overflow-hidden">
      <div className="mt-20 mx-6 flex-grow">
        <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center mt-4 mb-4 gap-4">
          <p className="text-[16px] font-bold text-[#334155] below-md:hidden">
            Items
          </p>
          <div className="flex flex-row gap-2">
            <AddNewItems />
            <AddCategories />
          </div>
        </div>

        <div className="overflow-hidden max-w-full ">
          {/* Mobile view */}
          <div
            className="block md:hidden"
            style={{
              maxHeight: "calc(100vh - 270px)",
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
                    {row.getValue("name")}
                  </span>
                  <div className="flex items-center gap-3">
                    {/* Edit */}
                    <Image
                      src="/images/edit1.svg"
                      alt="edit"
                      width={16}
                      height={16}
                      className="cursor-pointer"
                    />
                    {/* Delete */}
                    <Image
                      src="/images/delete2.svg"
                      alt="delete"
                      width={16}
                      height={16}
                      className="cursor-pointer"
                    />
                  </div>
                </div>

                {/* Border */}
                <div className="h-[1px] bg-gray-300 my-2"></div>

                {/* Category */}
                <div className="text-[14px]  flex justify-between">
                  <span className=" text-[#636363]">Category</span>{" "}
                  {row.getValue("category")}
                </div>

                {/* Price */}
                <div className="text-[14px]  mt-1 flex justify-between">
                  <span className=" text-[#636363]">Price</span>{" "}
                  {row.getValue("price")}
                </div>
                {/* Quantity */}
                <div className="text-[14px]  mt-1 flex justify-between">
                  <span className=" text-[#636363]">Quantity</span>{" "}
                  {row.getValue("quantity")}
                </div>
                {/* Weight */}
                <div className="text-[14px]  mt-1 flex justify-between">
                  <span className=" text-[#636363]">Weight</span>{" "}
                  {row.getValue("weight")}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View */}
          <div className="overflow-x-auto shadow-md rounded-lg flex-grow hidden flex-col md:block">
            <div className="overflow-hidden max-w-full">
              <table className="w-full border-collapse border-gray-200 table-fixed">
                <thead className="bg-[#334155] sticky top-0 z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="text-left px-4 py-3 text-[#FFFFFF] font-medium text-[15px] w-[100px]"
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
        </div>

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
      </div>
    </main>
  );
};
export default Page;

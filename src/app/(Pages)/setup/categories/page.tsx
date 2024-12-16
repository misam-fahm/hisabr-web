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
import EditCategories from "@/Components/Setup/EditCategories";
import DeleteCategories from "@/Components/Setup/DeleteCategories";

interface TableRow {
  name: string;
  description: string;
  noOfItems: number;
}

const data: TableRow[] = [
  { name: "Beverage", description: "Soft Drinks, Juices", noOfItems: 7327 },
  { name: "Bakery", description: "Cold drinks, Juices", noOfItems: 43643 },
  { name: "Dairy", description: "Chips, Cookies, Biscuits", noOfItems: 8979 },
  { name: "Snacks", description: "Soft Drinks, Juices", noOfItems: 7327 },
  { name: "Soft Serve", description: "Cold drinks, Juices", noOfItems: 7327 },
  {
    name: "Beverage",
    description: "Chips, Cookies, Biscuits",
    noOfItems: 76486,
  },
  { name: "Snacks", description: "Bread, Cakes, Pastries", noOfItems: 54787 },
  { name: "Soft Serve", description: "Milk, Butter, Cheese", noOfItems: 899 },
  { name: "Beverage", description: "Soft Drinks, Juices", noOfItems: 7327 },
  { name: "Bakery", description: "Cold drinks, Juices", noOfItems: 43643 },
  { name: "Dairy", description: "Chips, Cookies, Biscuits", noOfItems: 8979 },
  { name: "Snacks", description: "Soft Drinks, Juices", noOfItems: 7327 },
  { name: "Soft Serve", description: "Cold drinks, Juices", noOfItems: 7327 },
  {
    name: "Beverage",
    description: "Chips, Cookies, Biscuits",
    noOfItems: 76486,
  },
  { name: "Snacks", description: "Bread, Cakes, Pastries", noOfItems: 54787 },
  { name: "Soft Serve", description: "Milk, Butter, Cheese", noOfItems: 899 },
  { name: "Snacks", description: "Soft Drinks, Juices", noOfItems: 4214 },
  { name: "Snacks", description: "Soft Drinks, Juices", noOfItems: 4214 },
];

const columns: ColumnDef<TableRow>[] = [
  {
    accessorKey: "name",
    header: () => <div className="text-left">Name</div>,
    cell: (info) => <span>{info.getValue() as string}</span>,

    size: 200,
  },
  {
    accessorKey: "description",
    header: () => <div className="text-left">Description</div>,
    cell: (info) => <span>{info.getValue() as string}</span>,

    size: 250,
  },
  {
    accessorKey: "noOfItems",
    header: () => <div className="text-right mr-16">No. of Items</div>,
    cell: (info) => (
      <div className="text-right mr-14">{info.getValue() as number}</div>
    ),

    size: 150,
  },
  {
    id: "edit",
    header: () => <div className="text-center ">Edit</div>,
    cell: () => (
      <>
        <EditCategories />
      </>
    ),

    size: 50,
  },
  {
    id: "delete",
    header: () => <div className="text-center">Delete</div>,

    cell: () => (
      <>
        <DeleteCategories />
      </>
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
    <main className="w-full h-screen flex flex-col overflow-hidden">
      <div className="mt-20 mx-6 flex-grow  below-md:mx-3">
        <div className=" below-md:hidden flex flex-col-reverse md:flex-row justify-between items-start md:items-center mt-4 mb-4 gap-4">
          <p className="text-[16px] font-bold text-[#334155] hidden md:block">
            Item Categories
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
              maxHeight: "calc(100vh - 130px)",
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

                <div className="text-[14px]  flex justify-between">
                  <span className=" text-[#636363]">Description</span>{" "}
                  {row.getValue("description")}
                </div>

                <div className="text-[14px]  mt-1 flex justify-between">
                  <span className=" text-[#636363]">No. of Items</span>{" "}
                  {row.getValue("noOfItems")}
                </div>
              </div>
            ))}
            {/* Add NewItem bottom */}
            <div className=" fixed bottom-[20px] below-lg:hidden right-3">
              <AddNewItems />
            </div>
          </div>

          {/* Desktop View */}
          <div className="overflow-x-auto rounded-lg flex-grow hidden flex-col md:block">
            <div className="overflow-hidden max-w-full ">
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
                            className="px-4 py-1 text-[#636363] text-[14px]"
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

        <div className="mt-4 flex gap-2 justify-between items-center below-md:hidden">
          <div>
            <span className="text-[#8899A8] text-[12px] font-medium ml-3">
              {startItem} - {endItem} of {totalItems}
            </span>
          </div>

          <div className="flex flex-row gap-3">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-2 bg-[#EBEFF6] text-gray-700  rounded-md disabled:opacity-50"
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
              <select
                value={table.getState().pagination.pageIndex}
                onChange={(e) => table.setPageIndex(Number(e.target.value))}
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

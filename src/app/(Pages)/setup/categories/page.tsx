"use client";
import React, { FC, useState } from "react";
import Pagination from "@/Components/ui/Common/Pagination";
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
      <Image className="ml-8" src="/images/edit.svg" alt="edit" width={35} height={35} />
    ),

    size: 80,
  },
  {
    id: "delete",
    header: () => <div className="text-center">Delete</div>,
    cell: () => (
      <Image className="ml-10" src="/images/delete.svg" alt="delete" width={35} height={35} />
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

       <Pagination table={table}  />
      </div>
    </main>
  );
};

export default Page;

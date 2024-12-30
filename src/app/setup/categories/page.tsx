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
    header: () => <div className="text-right mr-14">No. of Items</div>,
    cell: (info) => (
      <div className="text-right mr-14">{info.getValue() as number}</div>
    ),

    size: 150,
  },
  {
    id: "edit",
    header: () => <div className=" flex justify-center items-center">Edit</div>,
    cell: () => (
      <span className="flex justify-center ml-2">
        <EditCategories />
      </span>
    ),

    size: 40,
  },
  {
    id: "delete",
    header: () => (
      <div className="flex justify-center items-center">Delete</div>
    ),

    cell: () => (
      <span className="flex justify-center ml-2">
        <DeleteCategories />
      </span>
    ),

    size: 60,
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
      <div className="flex justify-end gap-2 below-md:hidden my-6">
        <AddNewItems />
        <AddCategories />
      </div>

      <div className="overflow-hidden max-w-full">
        {/* Mobile view */}
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
              className={`border border-gray-200 p-5 bg-white rounded-lg mb-2`}
            >
              <div className="flex justify-between items-center">
                {/* Name */}
                <span className="font-bold text-[14px] text-[#334155]">
                  {row.getValue("name")}
                </span>
                <div className="flex items-center ">
                  {/* Edit */}
                  <EditCategories />
                  {/* Delete */}
                  <>
                    <DeleteCategories />
                  </>
                </div>
              </div>

              {/* Border */}
              <div className=" border-b bg-gray-200 my-3"></div>

              <div className=" flex justify-between ">
                <span className=" text-[#636363] text-[13px] mb-2">
                  Description
                </span>{" "}
                <span className="text-[14px]">
                  {" "}
                  {row.getValue("description")}
                </span>
              </div>

              <div className="mt-1 flex justify-between">
                <span className=" text-[#636363] text-[13px] mb-2">
                  No. of Items
                </span>{" "}
                <span className="text-[14px]">
                  {" "}
                  {row.getValue("noOfItems")}
                </span>
              </div>
            </div>
          ))}
          {/* Add NewItem bottom */}
          <div className=" fixed bottom-[20px] below-lg:hidden right-3">
            <AddNewItems />
          </div>
        </div>

        {/* Desktop View */}
        <div className="overflow-x-auto shadow-md border-collapse border border-gray-200 rounded-lg flex-grow hidden flex-col md:block">
          <div className="overflow-hidden max-w-full">
            <table className="w-full  table-fixed">
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
      </div>

      <Pagination table={table} />
    </main>
  );
};

export default Page;
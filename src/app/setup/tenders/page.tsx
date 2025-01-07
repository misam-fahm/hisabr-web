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
import AddTender from "@/Components/Setup/AddTender";
import DeleteTenders from "@/Components/Setup/DeleteTenders";
import EditTenders from "@/Components/Setup/EditTenders";
import Pagination from "@/Components/ui/Common/Pagination";

interface TableRow {
  commission: string;
  name: string;
  type: string;
}

const data: TableRow[] = [
  {
    name: "American Express",
    type: "VISA",
    commission: "2 %",
  },
  {
    name: "American Express",
    type: "Amex",
    commission: "1.5 %",
  },
  {
    name: "American Express",
    type: "Discovery  ",
    commission: "3 %",
  },
  {
    name: "American Express",
    type: "Master",
    commission: "3.5 %",
  },
  {
    name: "American Express",
    type: "Amex",
    commission: "10 %",
  },
  {
    name: "American Express",
    type: "Discovery",
    commission: "12 %",
  },
  {
    name: "American Express",
    type: "VISA",
    commission: "2.5 %",
  },
  {
    name: "American Express",
    type: "Amex",
    commission: "6.2 %",
  },
  {
    name: "American Express",
    type: "VISA",
    commission: "2 %",
  },
  {
    name: "American Express",
    type: "Amex",
    commission: "1.5 %",
  },
  {
    name: "American Express",
    type: "Discovery  ",
    commission: "3 %",
  },
  {
    name: "American Express",
    type: "Master",
    commission: "3.5 %",
  },
  {
    name: "American Express",
    type: "Amex",
    commission: "10 %",
  },
  {
    name: "American Express",
    type: "Discovery",
    commission: "12 %",
  },
  {
    name: "American Express",
    type: "VISA",
    commission: "2.5 %",
  },
  {
    name: "American Express",
    type: "Amex",
    commission: "6.2 %",
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
    accessorKey: "type",
    header: () => <div className="text-left">Type</div>,
    cell: (info) => <span>{info.getValue() as string}</span>,
    size: 120,
  },
  {
    accessorKey: "commission",
    header: () => <div className="text-right mr-16">Commission</div>,
    cell: (info) => (
      <div className="text-right mr-14">{info.getValue() as number}</div>
    ),
    size: 120,
  },
  {
    id: "edit",
    header: () => <div className="text-center  ">Edit</div>,
    cell: () => (
      <span className="flex justify-center">
        <EditTenders />
      </span>
    ),
    size: 50,
  },
  {
    id: "delete",
    header: () => <div className="text-center ">Delete</div>,
    cell: () => (
      <span className="flex justify-center">
        <DeleteTenders />
      </span>
    ),
    size: 50,
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
      className="max-h-[calc(100vh-60px)] px-6 below-md:px-3  below-md:py-4 overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <div className="flex  justify-between my-6">
      <div className="flex items-start cursor-pointer   below-md:hidden"onClick={() => window.history.back()}>
        <img
          src="/images/WebBackIcon.svg"
          alt="Back Arrow"
          className="w-7 h-7"
        />
      </div>
       <div className="gap-2 below-md:hidden"> <AddTender /></div>
      </div>

      {/* mobile view */}
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
            className={`border border-gray-200 p-5 bg-white rounded-lg mb-3`}
          >
            <div className="flex justify-between items-center">
              {/* Name */}
              <span className="font-bold text-[14px] text-[#334155]">
                {row.getValue("name")}
              </span>
              <div className="flex items-center">
                {/* Edit */}
                <>
                  <EditTenders />
                </>
                {/* Delete */}
                <>
                  <DeleteTenders />
                </>
              </div>
            </div>

            {/* Border */}
            <div className=" border-b bg-gray-200 my-3"></div>

            <div className="  flex justify-between">
              <span className=" text-[#636363] text-[13px] mb-2">Type</span>{" "}
              <span className=" text-[14px]">{row.getValue("type")}</span>
            </div>

            <div className=" mt-1 flex justify-between">
              <span className=" text-[#636363] text-[13px] mb-2">Commission</span>{" "}
              <span className=" text-[14px]">{row.getValue("commission")}</span>
            </div>
          </div>
        ))}
        {/* Add Tender bottom */}
        <div className="block pl-24 ">
          {" "}
          <AddTender />
        </div>
      </div>

      {/* Desktop View */}
      <div className="overflow-x-auto border-collapse border border-gray-200 rounded-lg flex-grow hidden flex-col md:block shadow-md">
        <div className="overflow-hidden max-w-full">
          <table className="w-full border-collapse border-gray-200 table-fixed shadow-lg">
            <thead className="bg-[#334155] sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-left px-4 py-2 text-[#FFFFFF] font-normal text-[15px] w-[100px]"
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

      <Pagination table={table} totalItems={totalItems} />
    </main>
  );
};
export default Page;

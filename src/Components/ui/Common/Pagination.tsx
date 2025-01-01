"use client";
import React from "react";
import { Table } from "@tanstack/react-table";

interface PaginationProps {
  table: Table<any>;
  totalItems: number;
}

const Pagination: React.FC<PaginationProps> = ({ table, totalItems }) => {
  const { pageIndex, pageSize } = table.getState().pagination;
  // const totalItems = table.getFilteredRowModel().rows.length;
  const startItem = pageIndex * pageSize + 1;
  const endItem = Math.min((pageIndex + 1) * pageSize, totalItems);
  const pageCount = table.getPageCount();

  return (
    <main>
      <div className="mt-4 flex gap-2 justify-between items-center below-md:hidden">
        {/* Page Range Display */}
        <div>
          <span className="text-[#8899A8] text-[12px] font-medium ml-3 ">
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

          {Array.from({ length: pageCount }, (_, index) => {
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
                {Array.from({ length: pageCount }, (_, index) => (
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

export default Pagination;

"use client";
import React from "react";
import { Table } from "@tanstack/react-table";

interface PaginationProps {
  table: Table<any>;
}

const Pagination: React.FC<PaginationProps> = ({ table }) => {
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalItems = table.getFilteredRowModel().rows.length;
  const startItem = pageIndex * pageSize + 1;
  const endItem = Math.min((pageIndex + 1) * pageSize, totalItems);

  return (
    <main>
      <div className="mt-4 flex gap-2 justify-between items-center below-md:hidden">
        {/* Page Range Display */}
        <div>
          <span className="text-[#8899A8] text-[12px] font-medium ml-3">
            {startItem} - {endItem} of {totalItems}
          </span>
        </div>

        {/* Pagination Numbers */}
        <div className="flex flex-row gap-3">
          {/* Previous Button */}
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="w-8 h-8 bg-[#EBEFF6] text-gray-700 rounded-md disabled:opacity-50 flex items-center justify-center"
          >
            <img src="/images/left.svg" />
          </button>

          {Array.from({ length: table.getPageCount() }, (_, index) => {
            const pageIndex = index;
            return (
              <button
                key={pageIndex}
                onClick={() => table.setPageIndex(pageIndex)}
                className={`w-8 h-8 rounded-md text-[12px] flex items-center justify-center ${
                  table.getState().pagination.pageIndex === pageIndex
                    ? "text-white bg-[#1AA47D]"
                    : "text-gray-700 bg-[#EBEFF6]"
                }`}
              >
                {pageIndex + 1}
              </button>
            );
          })}

          {/* Next Button */}
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="w-8 h-8 bg-[#EBEFF6] text-gray-700 rounded-md disabled:opacity-50 flex items-center justify-center"
          >
            <img src="/images/right.svg" />
          </button>

          {/* Dropdown for Page Selection */}
          <div>
            <div className="w-full">
              <select
                value={table.getState().pagination.pageIndex}
                onChange={(e) => table.setPageIndex(Number(e.target.value))}
                className="pl-3 pr-8 py-[6px] w-full rounded-md text-[12px] border-2 bg-[#f7f8f9] cursor-pointer border-[#D8D8DB6E] text-[#637381]"
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

export default Pagination;

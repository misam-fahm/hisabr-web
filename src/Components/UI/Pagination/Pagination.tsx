"use client";
import React, { useState, useRef, useEffect } from "react";
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const handlePageSelect = (index: number) => {
    table.setPageIndex(index);
    setIsDropdownOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return totalItems > 0 ? (
    <main>
      <div className="mt-4 flex gap-2 justify-between items-center below-md:hidden">
        {/* Page Range Display */}
        <div>
          <span className="text-[#8899A8] text-[12px] font-medium ml-3">
            {startItem} - {endItem} of {totalItems}
          </span>
        </div>

        {/* Pagination Numbers */}
        <div className="flex flex-row gap-3 items-center">
          {/* Previous Button */}
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="w-8 h-8 bg-[#EBEFF6] text-gray-700 rounded-md disabled:opacity-50 flex items-center justify-center"
          >
            <img src="/images/left.svg" alt="Previous" />
          </button>

          {Array.from({ length: Math.min(3, pageCount) }, (_, index) => {
            // Calculate the range of visible pages
            const startPage = Math.max(
              0,
              Math.min(
                table.getState().pagination.pageIndex - 1,
                pageCount - 3
              )
            );
            const pageIndex = startPage + index;
            return (
              <button
                key={pageIndex}
                onClick={() => table.setPageIndex(pageIndex)}
                className={`w-8 h-8 rounded-md text-[12px] flex items-center justify-center ${table.getState().pagination.pageIndex === pageIndex
                    ? "text-white bg-[#1AA47D]" // Green for active
                    : "text-gray-700 bg-[#EBEFF6]" // Grey for inactive
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
            <img src="/images/right.svg" alt="Next" />
          </button>

          {/* Dropdown for Page Selection */}
          <div>
            <div className="w-full relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="pl-2 pr-2 py-[6px] w-full rounded-md text-[12px] border-2 bg-[#f7f8f9] cursor-pointer border-[#D8D8DB6E] text-[#637381] flex items-center justify-between gap-9"
              >
                <span className="mr-2">Page {pageIndex + 1}</span>
                <svg
                  className={`w-4 h-4 transform transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isDropdownOpen && (
                <ul
                  className={`absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 scrollbar-thin overflow-y-auto ${isDropdownOpen ? "bottom-full mb-2" : "top-full mt-2"
                    }`}
                >
                  {Array.from({ length: pageCount }, (_, index) => (
                    <li
                      key={index}
                      onClick={() => handlePageSelect(index)}
                      className={`px-4 py-1.5 text-[12px] text-gray-700 cursor-pointer hover:bg-gray-100 ${pageIndex === index ? "text-gray-700" : ""
                        } ${index !== pageCount - 1 ? "border-b border-gray-300" : ""}`}
                    >
                      Page {index + 1}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  ) : null;
};

export default Pagination;

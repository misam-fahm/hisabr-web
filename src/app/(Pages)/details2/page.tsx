"use client";
import React, { useState } from "react";
import "../globals.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";

interface TableRow {
  name: string;
  type: string;
  percent: string;
}

const data: TableRow[] = [
  {
    name: "Discovery",
    type: "VISA",
    percent: "2%",
  },
  {
    name: "Discovery",
    type: "VISA",
    percent: "2%",
  },
  {
    name: "MasterCard",
    type: "VISA",
    percent: "1.5%",
  },
  {
    name: "American Express",
    type: "MasterCard",
    percent: "2.5%",
  },
  {
    name: "PayPal",
    type: "PayPal",
    percent: "3%",
  },
  {
    name: "Visa",
    type: "VISA",
    percent: "1.8%",
  },
  {
    name: "Bank of America",
    type: "MasterCard",
    percent: "1.2%",
  },
  {
    name: "Chase",
    type: "VISA",
    percent: "2.2%",
  },
  {
    name: "Capital One",
    type: "MasterCard",
    percent: "1.7%",
  },
  {
    name: "Citibank",
    type: "VISA",
    percent: "1.9%",
  },
  {
    name: "Barclaycard",
    type: "MasterCard",
    percent: "2.1%",
  },
  {
    name: "Discover",
    type: "Discover",
    percent: "2.3%",
  },
  {
    name: "Wells Fargo",
    type: "VISA",
    percent: "1.4%",
  },
  {
    name: "Synchrony",
    type: "MasterCard",
    percent: "2.6%",
  },
  {
    name: "Goldman Sachs",
    type: "VISA",
    percent: "3.1%",
  },
];

const columns: ColumnDef<TableRow>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "percent",
    header: "Percent",
  },

  {
    id: "pencil",
    header: "pencil",
    cell: () => (
      <button className="bg-[#FFFFFF] p-[9px] rounded-full shadow-[inset_-2px_-2px_2px_#E2F3F780,inset_2px_2px_3px_#F3F6FFAD]">
        <Image src="/images/pencil.svg" alt="pencil" width={14} height={14} />
      </button>
    ),
  },
  {
    id: "delete",
    header: "delete",
    cell: () => (
      <button className="bg-[#FFFFFF] p-[9px] rounded-full shadow-[inset_-2px_-2px_2px_#F7E2E259,inset_2px_2px_3px_#FFF3F396]">
        <Image src="/images/delete.svg" alt="delete" width={14} height={14} />
      </button>
    ),
  },
];

const DetailsPage: React.FC = () => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    initialState: {
      pagination: {
        pageSize: 5,
        pageIndex: 0,
      },
    },
  });

  //pagination range
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalItems = table.getFilteredRowModel().rows.length;
  const startItem = pageIndex * pageSize + 1;
  const endItem = Math.min((pageIndex + 1) * pageSize, totalItems);

  const [isTenderRowVisible, setTenderRowVisible] = useState(true); // State to control button and content visibility

  const handleAddTenderClick = () => {
    setTenderRowVisible(false); // Hide the button and tender label when clicked
  };

  /**go back button */
  const router = useRouter();
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <main>
      <div>
        <p className="text-[18px] font-bold text-defaultblack fixed top-0 z-30 mt-5 pl-6 pr-6">
          Tender Analysis
        </p>
      </div>

      {/* Hide button and Tender label once clicked */}
      {isTenderRowVisible ? (
        <div className="flex flex-row justify-between items-center mt-20 mb-4 mx-6">
          <div>
            <p className="text-[16px] font-bold text-[#334155] ml-3"> Tender</p>
          </div>
          <div>
            <button
              onClick={handleAddTenderClick}
              className="bg-[#1AA47D] [box-shadow:0px_3px_8px_0px_#00000026] w-[133px] h-[37px] rounded-md text-white text-[14px] font-semibold 
             hover:shadow-lg transition-shadow duration-300"
            >
              Add Tender
            </button>
          </div>
        </div>
      ) : (
        // This will show the new content when the button is clicked
        <div className="flex justify-between items-center bg-white mx-6 py-10 px-6 mt-24 mb-10 shadow-md rounded-md">
          {/* Add Tender  */}
          <div className="flex flex-col gap-6">
            <p className="text-[14px] text-[#5E6366] font-medium">
              Add Tender :
            </p>
            <p className="text-[14px] text-transparent font-medium">
              Add Tender :
            </p>
          </div>

          {/* Tender Name Input */}
          <div className="flex flex-col w-[23%]">
            <label className="text-[13px] mb-2 text-[#000000CC]">Name</label>
            <input
              type="text"
              placeholder="please Enter Tender name"
              className="p-2 border bg-[#f7f8f9] rounded-md text-[12px] text-[#8D98AA] border-none focus:outline-none focus:ring-2 focus:ring-[#f7f8f9]"
            />
          </div>
          {/* Type Input */}
          <div className="flex flex-col w-[23%]">
            <label className="text-[13px] mb-2 text-[#000000CC]">Type</label>
            <input
              type="text"
              placeholder="please Enter type"
              className="p-2 border bg-[#f7f8f9] rounded-md text-[12px] text-[#8D98AA] border-none focus:outline-none focus:ring-2 focus:ring-[#f7f8f9]"
            />
          </div>
          {/* Commission Input */}
          <div className="flex flex-col w-[23%]">
            <label className="text-[13px] mb-2 text-[#000000CC]">
              % of Commission
            </label>
            <input
              type="text"
              placeholder="Please Enter % Of Commission"
              className="p-2 border bg-[#f7f8f9] rounded-md text-[12px] text-[#8D98AA] border-none focus:outline-none focus:ring-2 focus:ring-[#f7f8f9]"
            />
          </div>
          {/* Save Button */}

          <div className="flex flex-col gap-1">
            <p className="text-[14px] text-transparent font-medium">
              Add Tender :
            </p>
            <button className="bg-[#1AA47D] [box-shadow:0px_3px_8px_0px_#00000026] px-9 py-2 rounded-md text-white text-sm font-semibold hover:shadow-lg transition-shadow duration-300">
              Save
            </button>
          </div>
        </div>
      )}

      {/* Table remains visible as is */}
      <div className="mb-10 mx-6">
        {/** Table */}

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

export default DetailsPage;

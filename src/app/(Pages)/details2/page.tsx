"use client";
import React, { useState } from "react";
import "../globals.css";
import { useRouter } from "next/navigation";
import Images from "@/Components/ui/Common/Image";
import Pagination from "@/Components/ui/Common/Pagination";

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
    size: 200,
  },
  {
    accessorKey: "type",
    header: "Type",
    size: 160,
  },
  {
    accessorKey: "percent",
    header: "Percent",
    size: 160,
  },

  {
    id: "pencil",
    header: "Edit",
    cell: () => (
      <button>
        <Images src="/images/pencil.svg" alt="pencil" width={15} height={15} />
      </button>
    ),
    size: 65,
  },
  {
    id: "delete",
    header: "Delete",
    cell: () => (
      <button>
        <Images src="/images/delete1.svg" alt="delete" width={15} height={15} />
      </button>
    ),
    size: 65,
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
        pageSize: 10,
        pageIndex: 0,
      },
    },
  });

  /**go back button */
  const router = useRouter();
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  //tooltip for mobile
  const [showTooltip, setShowTooltip] = useState(false);

  const handlePressStart = () => {
    setShowTooltip(true);
  };

  const handlePressEnd = () => {
    setShowTooltip(false);
  };

  return (
    <main
      className="max-h-[calc(100vh-60px)] below-md:max-h-[calc(100vh-1px)] tablet:max-h-[calc(100vh-1px)] below-md:mb-10 tablet:mb-10 overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <img
        onClick={handleBack}
        src="/images/backIcon.svg"
        className="fixed top-4 left-4 z-30 below-lg:hidden tablet:hidden"
      />
      {/* <div className="below-md:flex below-md:justify-center ">
        <p className="text-[18px] below-md:text-[16px] below-md:mr-8 font-bold text-defaultblack fixed top-0 z-30 mt-5 below-md:pl-0 below-md:pr-0 pl-6 pr-6">
          Tender Analysis
        </p>
      </div> */}

      <div className="flex flex-row gap-3 justify-end items-center mt-6 below-md:mt-0 below-md:mx-3 mb-6 mx-6">
        <div>
          <button className="below-md:hidden flex items-center justify-center bg-[#1AA47D] below-md:mt-3 w-[170px] h-[37px] rounded-md text-white text-[13px] font-semibold ">
            <img src="/images/addIcon.svg" alt="add Icon" className="mr-2" />
            Add Tender
          </button>
        </div>
        <div>
          <p
            onClick={handleBack}
            className="below-md:hidden cursor-pointer text-[14px] text-[#6F6F6F] bg-[#C8C8C87A] w-[104px] h-[37px] rounded-md flex items-center justify-center"
          >
            Back
          </p>
        </div>
      </div>

      {/* Table remains visible as is */}
      <div className=" mx-6 below-md:mx-3">
        {/** Table */}
        <div className="below-md:hidden">
          {/* Table */}
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-[#334155]">
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

        {/* Pagination */}
        <Pagination table={table} />

        <div className="below-lg:hidden tablet:hidden">
          <div className="flex flex-col">
            <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
              <div className="flex justify-between items-center border-b border-[#E4E4EF] pb-2 mb-4 mt-2 px-2 text-sm">
                <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                  <span>VISA</span>
                </div>
                <div className="flex gap-7">
                  <img src="/images/pencil.svg" className="w-4 h-4" />
                  <img src="/images/delete1.svg" className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-3 mb-2 px-2">
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Type</p>
                  <p className="text-[#1A1A1A] text-[12px]">VISA</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Percent</p>
                  <p className="text-[#1A1A1A] text-[12px]">1.5 %</p>
                </div>
              </div>
            </div>

            <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
              <div className="flex justify-between items-center border-b border-[#E4E4EF] pb-2 mb-4 mt-2 px-2 text-sm">
                <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                  <span>VISA</span>
                </div>
                <div className="flex gap-7">
                  <img src="/images/pencil.svg" className="w-4 h-4" />
                  <img src="/images/delete1.svg" className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-3 mb-2 px-2">
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Type</p>
                  <p className="text-[#1A1A1A] text-[12px]">VISA</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Percent</p>
                  <p className="text-[#1A1A1A] text-[12px]">1.5 %</p>
                </div>
              </div>
            </div>

            <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
              <div className="flex justify-between items-center border-b border-[#E4E4EF] pb-2 mb-4 mt-2 px-2 text-sm">
                <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                  <span>VISA</span>
                </div>
                <div className="flex gap-7">
                  <img src="/images/pencil.svg" className="w-4 h-4" />
                  <img src="/images/delete1.svg" className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-3 mb-2 px-2">
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Type</p>
                  <p className="text-[#1A1A1A] text-[12px]">VISA</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Percent</p>
                  <p className="text-[#1A1A1A] text-[12px]">1.5 %</p>
                </div>
              </div>
            </div>

            <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
              <div className="flex justify-between items-center border-b border-[#E4E4EF] pb-2 mb-4 mt-2 px-2 text-sm">
                <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                  <span>VISA</span>
                </div>
                <div className="flex gap-7">
                  <img src="/images/pencil.svg" className="w-4 h-4" />
                  <img src="/images/delete1.svg" className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-3 mb-2 px-2">
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Type</p>
                  <p className="text-[#1A1A1A] text-[12px]">VISA</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Percent</p>
                  <p className="text-[#1A1A1A] text-[12px]">1.5 %</p>
                </div>
              </div>
            </div>

            <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
              <div className="flex justify-between items-center border-b border-[#E4E4EF] pb-2 mb-4 mt-2 px-2 text-sm">
                <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                  <span>VISA</span>
                </div>
                <div className="flex gap-7">
                  <img src="/images/pencil.svg" className="w-4 h-4" />
                  <img src="/images/delete1.svg" className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-3 mb-2 px-2">
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Type</p>
                  <p className="text-[#1A1A1A] text-[12px]">VISA</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Percent</p>
                  <p className="text-[#1A1A1A] text-[12px]">1.5 %</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="below-lg:hidden flex justify-end fixed bottom-3 right-6 tablet:hidden">
        <button
          className="focus:outline-none flex items-center justify-center bg-[#1AA47D] w-[50px] h-[50px] rounded-md relative"
          onTouchStart={handlePressStart} // For mobile devices
          onMouseLeave={handlePressEnd} // Hide tooltip on mouse leave
        >
          <img src="/images/addIcon.svg" />
          {showTooltip && (
            <div className="absolute bottom-[70px] right-[80%] transform translate-x-1/2 bg-[#79747E] text-white text-[12px] px-5 py-2 rounded-md whitespace-nowrap">
              Add Tender
              {/* Tooltip Pointer */}
              <div className="absolute top-full right-[20%] transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#79747E]"></div>
            </div>
          )}
        </button>
      </div>
    </main>
  );
};

export default DetailsPage;

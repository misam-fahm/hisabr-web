"use client";
import React from "react";
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
    header: "Edit",
    cell: () => (
      <button className="bg-[#FFFFFF] p-[9px] rounded-full shadow-[inset_-2px_-2px_2px_#E2F3F780,inset_2px_2px_3px_#F3F6FFAD]">
        <Images src="/images/pencil.svg" alt="pencil" width={14} height={14} />
      </button>
    ),
  },
  {
    id: "delete",
    header: "Delete",
    cell: () => (
      <button className="bg-[#FFFFFF] p-[9px] rounded-full shadow-[inset_-2px_-2px_2px_#F7E2E259,inset_2px_2px_3px_#FFF3F396]">
        <Images src="/images/delete1.svg" alt="delete" width={14} height={14} />
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
    <main
      className="max-h-[calc(100vh-70px)] overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <img
        onClick={handleBack}
        src="/images/backIcon.svg"
        className="fixed top-6 left-4 z-30 below-lg:hidden"
      />
      <div className="below-md:flex below-md:justify-center ">
        <p className="text-[18px] below-md:text-[16px] below-md:mr-8 font-bold text-defaultblack fixed top-0 z-30 mt-5 below-md:pl-0 below-md:pr-0 pl-6 pr-6">
          Tender Analysis
        </p>
      </div>

      <div className="flex flex-row justify-between items-center mt-24 below-md:mt-16 below-md:mx-3 mb-4 mx-6">
        <div>
          <p className="text-[16px] font-bold text-[#334155] ml-3 below-md:ml-0">
            Tender
          </p>
        </div>
        <div>
          <button className="flex items-center justify-center bg-[#1AA47D] below-md:mt-3 [box-shadow:0px_3px_8px_0px_#00000026] w-[170px] h-[37px] rounded-md text-white text-[13px] font-semibold hover:shadow-lg transition-shadow duration-300">
            <img src="/images/addIcon.svg" alt="add Icon" className="mr-2" />
            Add Tender
          </button>
        </div>
      </div>

      {/* Table remains visible as is */}
      <div className="mb-10 mx-6 below-md:mx-3">
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
                        className="px-4 py-1 text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar"
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
          <Pagination table={table} />
        </div>
      </div>
    </main>
  );
};

export default DetailsPage;

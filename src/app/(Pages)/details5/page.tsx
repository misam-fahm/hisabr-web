"use client";
import React from "react";
import { useState } from "react";
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
  date: string;
  store: number;
  amount: number;
  description: string;
  type: string;
}

const data: TableRow[] = [
  {
    date: "2022-01-01",
    store: 13246,
    amount: 11800,
    description: "MORTGAGE",
    type: "MORTGAGE",
  },
  {
    date: "2022-01-01",
    store: 13246,
    amount: 11800,
    description: "MORTGAGE",
    type: "MORTGAGE",
  },
  {
    date: "2022-01-05",
    store: 14567,
    amount: 10250,
    description: "MORTGAGE",
    type: "MORTGAGE",
  },
  {
    date: "2022-01-10",
    store: 15678,
    amount: 12500,
    description: "MORTGAGE",
    type: "MORTGAGE",
  },
  {
    date: "2022-01-15",
    store: 16789,
    amount: 13500,
    description: "MORTGAGE",
    type: "MORTGAGE",
  },
  {
    date: "2022-01-20",
    store: 17890,
    amount: 11000,
    description: "MORTGAGE",
    type: "MORTGAGE",
  },
  {
    date: "2022-01-25",
    store: 18901,
    amount: 9800,
    description: "MORTGAGE",
    type: "MORTGAGE",
  },
  {
    date: "2022-02-01",
    store: 20012,
    amount: 15500,
    description: "MORTGAGE",
    type: "MORTGAGE",
  },
  {
    date: "2022-02-05",
    store: 21234,
    amount: 12500,
    description: "MORTGAGE",
    type: "MORTGAGE",
  },
  {
    date: "2022-02-10",
    store: 22345,
    amount: 8900,
    description: "MORTGAGE",
    type: "MORTGAGE",
  },
  {
    date: "2022-02-15",
    store: 23456,
    amount: 14000,
    description: "MORTGAGE",
    type: "MORTGAGE",
  },
  {
    date: "2022-02-20",
    store: 24567,
    amount: 9500,
    description: "MORTGAGE",
    type: "MORTGAGE",
  },
  {
    date: "2022-02-25",
    store: 25678,
    amount: 11500,
    description: "MORTGAGE",
    type: "MORTGAGE",
  },
  {
    date: "2022-03-01",
    store: 26789,
    amount: 10500,
    description: "MORTGAGE",
    type: "MORTGAGE",
  },
  {
    date: "2022-03-05",
    store: 27890,
    amount: 12000,
    description: "MORTGAGE",
    type: "MORTGAGE",
  },
];

const formattedData = data?.map((item) => {
  const rawDate = new Date(item?.date);

  // Format the date as MM-DD-YY
  const formattedDate = `${(rawDate?.getMonth() + 1)
    .toString()
    .padStart(
      2,
      "0"
    )}-${rawDate?.getDate().toString().padStart(2, "0")}-${rawDate
    .getFullYear()
    .toString()
    .slice(-2)}`;

  return { ...item, date: formattedDate };
});

console.log(formattedData);

const columns: ColumnDef<TableRow>[] = [
  { accessorKey: "date", header: "Date" },
  { accessorKey: "store", header: "Store" },
  { accessorKey: "amount", header: "Amount" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "type", header: "Type" },
  {
    id: "pencil",
    header: "pencil",
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
      <button className="bg-white p-2 rounded-full shadow-inner">
        <Images src="/images/delete1.svg" alt="Delete" width={14} height={14} />
      </button>
    ),
  },
];

const DetailsPage: React.FC = () => {
  const table = useReactTable({
    data: formattedData,
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

  /**first dropdown */
  const [selectedOption, setSelectedOption] = useState<string>("All stores");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const options = ["Store 1", "Store 2", "Store 3", "All Store"];

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  /**second dropdown */
  const [selectedOption2, setSelectedOption2] = useState<string>("2021");
  const [isOpen2, setIsOpen2] = useState<boolean>(false);

  const options2 = ["2024", "2023", "2022", "2021"];

  const handleSelect2 = (option2: string) => {
    setSelectedOption2(option2);
    setIsOpen2(false);
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
          Operating Expense Analysis
        </p>
      </div>
      <div className="pt-6 pb-6 below-md:pb-3 below-md:px-3 sticky z-10 top-16 bg-[#f7f8f9] pl-6 pr-6">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row below-md:flex-col gap-3  w-full">
            <div className="relative w-[30%] below-md:w-full">
              <p className="text-[#2D374880] text-[12px] mb-2 below-md:hidden">
                Select Store
              </p>
              {/* Dropdown Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-[#ffffff] text-[#4B4B4B] shadow-md px-4 py-[10px] rounded flex items-center justify-between w-full text-[12px]"
              >
                <span>{selectedOption}</span>
                <img
                  src="./images/icon.svg"
                  className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                    isOpen ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div
                  className="absolute left-0 w-full mt-2 bg-[#ffffff] text-[#4B4B4B] text-[12px] border rounded shadow-md"
                  style={{ zIndex: 50 }}
                >
                  {options.map((option, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelect(option)}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-100 border-b last:border-none"
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/*second dropdown */}

            <div className="relative w-[30%] below-md:w-full">
              <p className="text-[#2D374880] text-[12px] mb-2 below-md:hidden">
                Select Period
              </p>
              {/* Dropdown Button */}
              <button
                onClick={() => setIsOpen2(!isOpen2)}
                className="bg-[#ffffff] text-[#4B4B4B] shadow-md px-4 py-[10px] rounded flex items-center justify-between w-full text-[12px]"
              >
                <span>{selectedOption2}</span>
                <img
                  src="./images/icon.svg"
                  className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                    isOpen2 ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isOpen2 && (
                <div
                  className="absolute left-0 w-full mt-2 bg-[#ffffff] text-[#4B4B4B] text-[12px] border rounded shadow-md"
                  style={{ zIndex: 50 }}
                >
                  {options2.map((option, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelect2(option)}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-100 border-b last:border-none"
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
        <div />
      </div>

      {/* Table remains visible as is */}
      <div className="flex flex-row justify-between items-center mt-16 below-md:mt-14 mb-4 mx-6 below-md:mx-3">
        <div>
          <p className="text-[16px] font-bold text-[#334155] ml-3 below-md:ml-0">
            {" "}
            Expenses
          </p>
        </div>
        <div>
          <button className="flex items-center justify-center bg-[#1AA47D] below-md:mt-3 [box-shadow:0px_3px_8px_0px_#00000026] w-[170px] h-[37px] rounded-md text-white text-[13px] font-semibold hover:shadow-lg transition-shadow duration-300">
            <img src="/images/addIcon.svg" alt="add Icon" className="mr-2" />
            Add Expense
          </button>
        </div>
      </div>

      <div className="mb-5 mx-6 below-md:mx-3">
        {/** Table */}

        <div>
          {/* Table */}
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="w-full border-collapse border border-gray-200 ">
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

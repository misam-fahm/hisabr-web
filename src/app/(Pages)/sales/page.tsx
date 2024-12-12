"use client";
import React, { FC, useState } from "react";
import DateRange from "@/Components/drawer/DateRangePicker";
import Images from "@/Components/ui/Common/Image";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  orders: number;
  quantity: number;
  amount: string;
  net: string;
  average: string;
}

const data: TableRow[] = [
  {
    date: "2022-01-01",
    store: 13246,
    orders: 724,
    quantity: 1342,
    amount: "$3,484.84",
    net: "$3,124.54",
    average: "$11.26",
  },
  {
    date: "2022-01-02",
    store: 13576,
    orders: 812,
    quantity: 1500,
    amount: "$4,123.11",
    net: "$3,700.89",
    average: "$12.54",
  },
  {
    date: "2022-01-03",
    store: 14892,
    orders: 924,
    quantity: 1600,
    amount: "$5,124.90",
    net: "$4,520.12",
    average: "$13.11",
  },
  {
    date: "2022-01-03",
    store: 14892,
    orders: 924,
    quantity: 1600,
    amount: "$5,124.90",
    net: "$4,520.12",
    average: "$13.11",
  },
  {
    date: "2022-01-03",
    store: 14892,
    orders: 924,
    quantity: 1600,
    amount: "$5,124.90",
    net: "$4,520.12",
    average: "$13.11",
  },
  {
    date: "2022-01-03",
    store: 14892,
    orders: 924,
    quantity: 1600,
    amount: "$5,124.90",
    net: "$4,520.12",
    average: "$13.11",
  },
  {
    date: "2022-01-03",
    store: 14892,
    orders: 924,
    quantity: 1600,
    amount: "$5,124.90",
    net: "$4,520.12",
    average: "$13.11",
  },
  {
    date: "2022-01-03",
    store: 14892,
    orders: 924,
    quantity: 1600,
    amount: "$5,124.90",
    net: "$4,520.12",
    average: "$13.11",
  },
  {
    date: "2022-01-03",
    store: 14892,
    orders: 924,
    quantity: 1600,
    amount: "$5,124.90",
    net: "$4,520.12",
    average: "$13.11",
  },
  {
    date: "2022-01-03",
    store: 14892,
    orders: 924,
    quantity: 1600,
    amount: "$5,124.90",
    net: "$4,520.12",
    average: "$13.11",
  },
  {
    date: "2022-01-03",
    store: 14892,
    orders: 924,
    quantity: 1600,
    amount: "$5,124.90",
    net: "$4,520.12",
    average: "$13.11",
  },
  {
    date: "2022-01-03",
    store: 14892,
    orders: 924,
    quantity: 1600,
    amount: "$5,124.90",
    net: "$4,520.12",
    average: "$13.11",
  },
  {
    date: "2022-01-03",
    store: 14892,
    orders: 924,
    quantity: 1600,
    amount: "$5,124.90",
    net: "$4,520.12",
    average: "$13.11",
  },
  {
    date: "2022-01-03",
    store: 14892,
    orders: 924,
    quantity: 1600,
    amount: "$5,124.90",
    net: "$4,520.12",
    average: "$13.11",
  },
  {
    date: "2022-01-03",
    store: 14892,
    orders: 924,
    quantity: 1600,
    amount: "$5,124.90",
    net: "$4,520.12",
    average: "$13.11",
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

const Sales: FC = () => {
  const router = useRouter();

  const handleImageClick = () => {
    router.push("/sales/sales_view"); // Navigates to the 'details' page
  };

  const columns: ColumnDef<TableRow>[] = [
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "store",
      header: "Store ",
    },
    {
      accessorKey: "orders",
      header: "Orders",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "amount",
      header: "Amount",
    },
    {
      accessorKey: "net",
      header: "Net",
    },
    {
      accessorKey: "average",
      header: "Average",
    },
    {
      id: "view",
      header: "View",
      cell: () => (
        <button
          onClick={handleImageClick}
          className="bg-[#FFFFFF] p-[7px] rounded-full shadow-[inset_-2px_-2px_2px_#F3FFF3,inset_2px_2px_3px_#E2F7E380]"
        >
          <Images src="/images/eye.svg" alt="Eye Icon" width={20} height={20} />
        </button>
      ),
    },
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      console.log("Selected file:", file);
    }
  };

  const handleUploadClick = () => {
    document.getElementById("fileInput")?.click(); // Programmatically click the hidden input
  };

  const [globalFilter, setGlobalFilter] = React.useState("");
  const table = useReactTable({
    data: formattedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 5,
        pageIndex: 0,
      },
    },
  });

  /**dropdown */
  const [selectedOption, setSelectedOption] = useState<string>("All stores");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const options = ["Store 1", "Store 2", "Store 3", "All Store"];

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <main
      className="max-h-[calc(100vh-70px)] overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <div className="below-md:flex below-md:justify-center ">
        <p className="text-[18px] font-bold text-defaultblack fixed top-0 z-30 mt-5 below-md:pl-0 below-md:pr-0 pl-6 pr-6">
          Sales
        </p>
      </div>
      <div className="my-4 mx-6 mt-24 below-md:mx-3 below-md:mt-20">
        <div className="flex flex-row below-md:flex-col mb-6">
          <div className="flex flex-row below-md:flex-col  w-full gap-3">
            <div className="w-[40%] below-md:w-full relative">
              {/* Dropdown Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-[#ffffff] text-[#636363] shadow-md px-4 py-[10px] rounded flex items-center justify-between w-full text-[12px]"
              >
                <span>{selectedOption}</span>
                <Image
                  src="/images/icon.svg" // Updated path (use `/` instead of `./`)
                  alt="Dropdown Icon"
                  width={16} // Adjusted size for consistency
                  height={16}
                  className={`transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div
                  className="absolute left-0 w-full mt-2 bg-[#ffffff] text-[#4B4B4B] text-[12px] border rounded shadow-md"
                  style={{ zIndex: 20 }}
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

            <div className="w-[50%] below-md:w-full">
              <DateRange />
            </div>

            <div className="flex flex-row w-full gap-3">
              <div className="w-[50%] below-md:w-full relative">
                <input
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Search"
                  className=" py-[10px] px-[8] w-full shadow-md rounded-md text-[12px] placeholder:text-[#636363] border-none focus:outline-none focus:ring-1 focus:ring-[white]"
                />
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-[#636363]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35m2.6-6.4a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0z"
                    />
                  </svg>
                </div>
              </div>

              <div className="below-lg:hidden">
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />

                <button
                  onClick={handleUploadClick}
                  className="flex items-center justify-center bg-[#1AA47D] [box-shadow:0px_3px_8px_0px_#00000026] w-[170px] h-[37px] rounded-md text-white text-[13px] font-semibold hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src="/images/uploadIcon.svg"
                    alt="Upload Icon"
                    className="mr-2"
                  />
                  Upload Sale
                </button>
              </div>
            </div>
          </div>

          {/* button */}
          <div className=" below-md:w-full below-md:mt-3">
            <div className="below-md:hidden">
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              <button
                onClick={handleUploadClick}
                className="flex items-center justify-center bg-[#1AA47D] below-md:mt-3 [box-shadow:0px_3px_8px_0px_#00000026] w-[170px] h-[37px] rounded-md text-white text-[13px] font-semibold hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src="/images/uploadIcon.svg"
                  alt="Upload Icon"
                  className="mr-2"
                />
                Upload Sale
              </button>
            </div>
          </div>
        </div>

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
                        className="text-left px-4 py-3 below-md:px-10 text-[#FFFFFF] font-medium text-[15px]"
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
                        className="px-4 py-1 below-md:px-10 text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar"
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
export default Sales;

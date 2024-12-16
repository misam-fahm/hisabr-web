"use client";
import React, { FC, useState } from "react";
import DateRange from "@/Components/drawer/DateRangePicker";
import Images from "@/Components/ui/Common/Image";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Pagination from "@/Components/ui/Common/Pagination";
import Dropdown from "@/Components/ui/Common/DropDown";

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
  const toggleDropdown1 = () => setIsOpen(!isOpen);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const filteredData = data.filter((item) =>
    JSON.stringify(item)
      .toLowerCase()
      .includes(globalFilter?.toLowerCase() || "")
  );

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
      className="max-h-[calc(100vh-70px)] below-md:max-h-[calc(100vh-1px)] tablet:max-h-[calc(100vh-1px)] below-md:mb-10 tablet:mb-10 overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <div className="below-md:flex below-md:justify-center ">
        <p className="text-[18px] font-bold text-defaultblack fixed top-0 z-30 mt-5 below-md:pl-0 below-md:pr-0 pl-6 pr-6">
          Sales
        </p>
      </div>
      <div className="mx-6 mt-24 below-md:mx-3 below-md:mt-16 tablet:mt-16">
        <div className="flex flex-row below-md:flex-col pb-6 sticky top-16 below-md:pt-4 tablet:pt-4 bg-[#f7f8f9] below-md:pb-4  ">
          <div className="flex flex-row below-md:flex-col w-full gap-3">
            {/* Dropdown Button */}

            <Dropdown
              options={options}
              selectedOption={selectedOption}
              onSelect={handleSelect}
              isOpen={isOpen}
              toggleOpen={toggleDropdown1}
              widthchange="w-[40%] tablet:w-full"
            />

            <div className="w-[50%] below-md:w-full tablet:w-full">
              <DateRange />
            </div>

            <div className="flex flex-row w-full gap-3">
              <div className="w-[50%] below-md:w-full relative below-md:hidden tablet:hidden">
                <input
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Search"
                  className=" py-[10px] px-[8] w-full shadow rounded-md text-[12px] placeholder:text-[#636363] border-none focus:outline-none focus:ring-1 focus:ring-[white]"
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

              <div className="tablet:w-full below-md:w-full relative below-lg:hidden">
                <input
                  placeholder="Search"
                  className=" py-[10px] px-[8] w-full shadow rounded-md text-[12px] placeholder:text-[#636363] border-none focus:outline-none focus:ring-1 focus:ring-[white]"
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
            </div>
          </div>

          {/* button */}
          <div className=" below-md:w-full">
            <div className="below-md:hidden tablet:hidden">
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              <button
                onClick={handleUploadClick}
                className="flex items-center justify-center bg-[#1AA47D] below-md:mt-3 w-[170px] h-[37px] rounded-md text-white text-[13px] font-semibold"
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

        <div className="below-md:hidden tablet:hidden">
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

        <div className="below-lg:hidden">
          <div className="flex flex-col">
            <div className="w-full bg-white rounded-md p-3 mb-3">
              <div className="flex justify-between items-center border-b border-[#E4E4EF] pb-2 mb-4 mt-2 px-2 text-sm">
                <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                  <span>12-20-24</span>
                </div>
                <div>
                  <img onClick={handleImageClick} src="/images/eye.svg" />
                </div>
              </div>
              <div className="space-y-3 mb-2 px-2">
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Store</p>
                  <p className="text-[#1A1A1A] text-[12px]">13246</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Orders</p>
                  <p className="text-[#1A1A1A] text-[12px]">345</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Quantity</p>
                  <p className="text-[#1A1A1A] text-[12px]">145</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Amount</p>
                  <p className="text-[#1A1A1A] text-[12px]">$34,232</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Net</p>
                  <p className="text-[#1A1A1A] text-[12px]">$3,484.37</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Average</p>
                  <p className="text-[#1A1A1A] text-[12px]">$1,032</p>
                </div>
              </div>
            </div>

            <div className="w-full bg-white rounded-md p-3 mb-3">
              <div className="flex justify-between items-center border-b border-[#E4E4EF] pb-2 mb-4 mt-2 px-2 text-sm">
                <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                  <span>12-20-24</span>
                </div>
                <div>
                  <img onClick={handleImageClick} src="/images/eye.svg" />
                </div>
              </div>
              <div className="space-y-3 mb-2 px-2">
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Store</p>
                  <p className="text-[#1A1A1A] text-[12px]">78910</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Orders</p>
                  <p className="text-[#1A1A1A] text-[12px]">345</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Quantity</p>
                  <p className="text-[#1A1A1A] text-[12px]">145</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Amount</p>
                  <p className="text-[#1A1A1A] text-[12px]">$34,232</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Net</p>
                  <p className="text-[#1A1A1A] text-[12px]">$3,484.37</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Average</p>
                  <p className="text-[#1A1A1A] text-[12px]">$1,032</p>
                </div>
              </div>
            </div>

            <div className="w-full bg-white rounded-md p-3 mb-3">
              <div className="flex justify-between items-center border-b border-[#E4E4EF] pb-2 mb-4 mt-2 px-2 text-sm">
                <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                  <span>12-20-24</span>
                </div>
                <div>
                  <img onClick={handleImageClick} src="/images/eye.svg" />
                </div>
              </div>
              <div className="space-y-3 mb-2 px-2">
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Store</p>
                  <p className="text-[#1A1A1A] text-[12px]">13246</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Orders</p>
                  <p className="text-[#1A1A1A] text-[12px]">345</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Quantity</p>
                  <p className="text-[#1A1A1A] text-[12px]">145</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Amount</p>
                  <p className="text-[#1A1A1A] text-[12px]">$34,232</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Net</p>
                  <p className="text-[#1A1A1A] text-[12px]">$3,484.37</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Average</p>
                  <p className="text-[#1A1A1A] text-[12px]">$1,032</p>
                </div>
              </div>
            </div>

            <div className="w-full bg-white rounded-md p-3 mb-3">
              <div className="flex justify-between items-center border-b border-[#E4E4EF] pb-2 mb-4 mt-2 px-2 text-sm">
                <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                  <span>12-20-24</span>
                </div>
                <div>
                  <img onClick={handleImageClick} src="/images/eye.svg" />
                </div>
              </div>
              <div className="space-y-3 mb-2 px-2">
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Store</p>
                  <p className="text-[#1A1A1A] text-[12px]">13246</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Orders</p>
                  <p className="text-[#1A1A1A] text-[12px]">345</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Quantity</p>
                  <p className="text-[#1A1A1A] text-[12px]">145</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Amount</p>
                  <p className="text-[#1A1A1A] text-[12px]">$34,232</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Net</p>
                  <p className="text-[#1A1A1A] text-[12px]">$3,484.37</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Average</p>
                  <p className="text-[#1A1A1A] text-[12px]">$1,032</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="below-lg:hidden flex justify-end fixed bottom-3 right-6">
        <button
          className="focus:outline-none flex items-center justify-center bg-[#1AA47D] w-[50px] h-[50px] rounded-md relative"
          onTouchStart={handlePressStart} // For mobile devices
          onMouseLeave={handlePressEnd} // Hide tooltip on mouse leave
          onClick={handleUploadClick}
        >
          <img src="/images/uploadIcon.svg" alt="Upload Icon" />
          {showTooltip && (
            <div className="absolute bottom-[70px] right-[80%] transform translate-x-1/2 bg-[#79747E] text-white text-[12px] px-5 py-2 rounded-md whitespace-nowrap">
              Upload Sale
              {/* Tooltip Pointer */}
              <div className="absolute top-full right-[20%] transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#79747E]"></div>
            </div>
          )}
        </button>
      </div>
    </main>
  );
};
export default Sales;

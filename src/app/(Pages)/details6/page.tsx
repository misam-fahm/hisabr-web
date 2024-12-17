"use client";
import React from "react";
import { useState } from "react";
import "../globals.css";
import { useRouter } from "next/navigation";
import Images from "@/Components/ui/Common/Image";
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
  quantity: number;
  total: string;
  name: string;
}

const data: TableRow[] = [
  {
    date: "2022-01-01",
    store: 13246,
    quantity: 176,
    total: "$3,484.47",
    name: "GORDON",
  },
  {
    date: "2022-01-01",
    store: 13246,
    quantity: 176,
    total: "$3,484.47",
    name: "GORDON",
  },
  {
    date: "2022-01-02",
    store: 14567,
    quantity: 198,
    total: "$4,027.60",
    name: "SMITH",
  },
  {
    date: "2022-01-03",
    store: 12678,
    quantity: 150,
    total: "$3,112.30",
    name: "JOHNSON",
  },
  {
    date: "2022-01-04",
    store: 13789,
    quantity: 210,
    total: "$4,532.12",
    name: "WILLIAMS",
  },
  {
    date: "2022-01-05",
    store: 14900,
    quantity: 189,
    total: "$3,958.45",
    name: "BROWN",
  },
  {
    date: "2022-01-06",
    store: 14123,
    quantity: 175,
    total: "$3,672.80",
    name: "JONES",
  },
  {
    date: "2022-01-07",
    store: 15344,
    quantity: 162,
    total: "$3,391.50",
    name: "GARCIA",
  },
  {
    date: "2022-01-08",
    store: 16567,
    quantity: 185,
    total: "$3,854.70",
    name: "MARTINEZ",
  },
  {
    date: "2022-01-09",
    store: 17234,
    quantity: 200,
    total: "$4,189.30",
    name: "RODRIGUEZ",
  },
  {
    date: "2022-01-10",
    store: 18956,
    quantity: 192,
    total: "$3,978.12",
    name: "HERNANDEZ",
  },
  {
    date: "2022-01-11",
    store: 19478,
    quantity: 170,
    total: "$3,576.65",
    name: "MOORE",
  },
  {
    date: "2022-01-12",
    store: 20456,
    quantity: 215,
    total: "$4,672.40",
    name: "TAYLOR",
  },
  {
    date: "2022-01-13",
    store: 21345,
    quantity: 182,
    total: "$3,811.80",
    name: "ANDERSON",
  },
  {
    date: "2022-01-14",
    store: 22467,
    quantity: 199,
    total: "$4,112.50",
    name: "THOMAS",
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
  { accessorKey: "quantity", header: "Quantity" },
  { accessorKey: "total", header: "Total" },
  { accessorKey: "name", header: "Name" },
  {
    id: "view",
    header: "View",
    cell: () => (
      <button className="bg-[#FFFFFF] p-[7px] rounded-full shadow-[inset_-2px_-2px_2px_#F3FFF3,inset_2px_2px_3px_#E2F7E380]">
        <Images src="/images/eye.svg" alt="Eye Icon" width={20} height={20} />
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

  const [selectedOption, setSelectedOption] = useState<string>("All stores");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption2, setSelectedOption2] = useState<string>("2021");
  const [isOpen2, setIsOpen2] = useState<boolean>(false);

  const options = ["Store 1", "Store 2", "Store 3", "All Store"];
  const options2 = ["2024", "2023", "2022", "2021"];

  const toggleDropdown1 = () => setIsOpen(!isOpen);
  const toggleDropdown2 = () => setIsOpen2(!isOpen2);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleSelect2 = (option2: string) => {
    setSelectedOption2(option2);
    setIsOpen2(false);
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
        className="fixed top-6 left-4 z-30 below-lg:hidden"
      />
      {/* <div className="below-md:flex below-md:justify-center ">
        <p className="text-[18px] below-md:text-[16px] below-md:mr-8 font-bold text-defaultblack fixed top-0 z-30 mt-5 below-md:pl-0 below-md:pr-0 pl-6 pr-6">
          Cost Analysis
        </p>
      </div> */}
      <div className="pt-6 pb-6 below-md:pb-3 sticky z-10  bg-[#f7f8f9] pl-6 pr-6 below-md:px-3">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-3 below-md:flex-col w-full">
            <Dropdown
              label="Select Store"
              options={options}
              selectedOption={selectedOption}
              onSelect={handleSelect}
              isOpen={isOpen}
              toggleOpen={toggleDropdown1}
            />

            {/*second dropdown */}

            {/* Second Dropdown */}

            <Dropdown
              label="Select Period"
              options={options2}
              selectedOption={selectedOption2}
              onSelect={handleSelect2}
              isOpen={isOpen2}
              toggleOpen={toggleDropdown2}
            />
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
      <div className="flex flex-row justify-between items-center  mb-4 mx-6 below-md:mx-3">
        <div>
          <p className="text-[16px] font-bold text-[#334155] ml-3 below-md:ml-1">
            Invoices
          </p>
        </div>
        <div>
          <button className="below-md:hidden flex items-center justify-center bg-[#1AA47D] below-md:mt-3 w-[170px] h-[37px] rounded-md text-white text-[13px] font-semibold">
            <img
              src="/images/uploadIcon.svg"
              alt="Upload Icon"
              className="mr-2"
            />
            Upload Invoice
          </button>
        </div>
      </div>

      <div className="mx-6 below-md:mx-3">
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

        <div className="below-lg:hidden">
          <div className="flex flex-col">
            <div className="w-full bg-white rounded-md p-3 mb-3">
              <div className="flex justify-between items-center border-b border-[#E4E4EF] pb-2 mb-4 mt-2 px-2 text-sm">
                <div className="flex gap-3 text-[#1A1A1A] text-[14px] font-bold">
                  <span>12-20-24</span>
                  <span>Gordon</span>
                </div>
                <div>
                  <img src="/images/eye.svg" />
                </div>
              </div>
              <div className="space-y-3 mb-2 px-2">
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Store</p>
                  <p className="text-[#1A1A1A] text-[12px]">13246</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Quantity</p>
                  <p className="text-[#1A1A1A] text-[12px]">145</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Total</p>
                  <p className="text-[#1A1A1A] text-[12px]">$3,484.37</p>
                </div>
              </div>
            </div>

            <div className="w-full bg-white rounded-md p-3 mb-3">
              <div className="flex justify-between items-center border-b border-[#E4E4EF] pb-2 mb-4 mt-2 px-2 text-sm">
                <div className="flex gap-3 text-[#1A1A1A] text-[14px] font-bold">
                  <span>12-20-24</span>
                  <span>Gordon</span>
                </div>
                <div>
                  <img src="/images/eye.svg" />
                </div>
              </div>
              <div className="space-y-3 mb-2 px-2">
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Store</p>
                  <p className="text-[#1A1A1A] text-[12px]">13246</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Quantity</p>
                  <p className="text-[#1A1A1A] text-[12px]">145</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Total</p>
                  <p className="text-[#1A1A1A] text-[12px]">$3,484.37</p>
                </div>
              </div>
            </div>

            <div className="w-full bg-white rounded-md p-3 mb-3">
              <div className="flex justify-between items-center border-b border-[#E4E4EF] pb-2 mb-4 mt-2 px-2 text-sm">
                <div className="flex gap-3 text-[#1A1A1A] text-[14px] font-bold">
                  <span>12-20-24</span>
                  <span>Gordon</span>
                </div>
                <div>
                  <img src="/images/eye.svg" />
                </div>
              </div>
              <div className="space-y-3 mb-2 px-2">
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Store</p>
                  <p className="text-[#1A1A1A] text-[12px]">13246</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Quantity</p>
                  <p className="text-[#1A1A1A] text-[12px]">145</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Total</p>
                  <p className="text-[#1A1A1A] text-[12px]">$3,484.37</p>
                </div>
              </div>
            </div>

            <div className="w-full bg-white rounded-md p-3 mb-3">
              <div className="flex justify-between items-center border-b border-[#E4E4EF] pb-2 mb-4 mt-2 px-2 text-sm">
                <div className="flex gap-3 text-[#1A1A1A] text-[14px] font-bold">
                  <span>12-20-24</span>
                  <span>Gordon</span>
                </div>
                <div>
                  <img src="/images/eye.svg" />
                </div>
              </div>
              <div className="space-y-3 mb-2 px-2">
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Store</p>
                  <p className="text-[#1A1A1A] text-[12px]">13246</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Quantity</p>
                  <p className="text-[#1A1A1A] text-[12px]">145</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Total</p>
                  <p className="text-[#1A1A1A] text-[12px]">$3,484.37</p>
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
        >
          <img src="/images/uploadIcon.svg" />
          {showTooltip && (
            <div className="absolute bottom-[70px] right-[80%] transform translate-x-1/2 bg-[#79747E] text-white text-[12px] px-5 py-2 rounded-md whitespace-nowrap">
              Upload Invoice
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

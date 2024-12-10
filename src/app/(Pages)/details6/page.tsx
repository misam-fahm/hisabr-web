"use client";
import React from "react";
import { useState } from "react";
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

const formattedData = data.map((item) => {
  const rawDate = new Date(item.date);

  // Format the date as MM-DD-YY
  const formattedDate = `${(rawDate.getMonth() + 1)
    .toString()
    .padStart(
      2,
      "0"
    )}-${rawDate.getDate().toString().padStart(2, "0")}-${rawDate
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
        <Image src="/images/eye.svg" alt="Eye Icon" width={25} height={25} />
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

  //pagination range
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalItems = table.getFilteredRowModel().rows.length;
  const startItem = pageIndex * pageSize + 1;
  const endItem = Math.min((pageIndex + 1) * pageSize, totalItems);

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

  /**third dropdown */
  const [selectedOption3, setSelectedOption3] = useState<string>("2021");
  const [isOpen3, setIsOpen3] = useState<boolean>(false);

  const options3 = ["2024", "2023", "2022", "2021"];

  const handleSelect3 = (option3: string) => {
    setSelectedOption3(option3);
    setIsOpen3(false);
  };

  /**fourth dropdown */
  const [selectedOption4, setSelectedOption4] = useState<string>("2021");
  const [isOpen4, setIsOpen4] = useState<boolean>(false);

  const options4 = ["2024", "2023", "2022", "2021"];

  const handleSelect4 = (option4: string) => {
    setSelectedOption4(option4);
    setIsOpen4(false);
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
          Cost Analysis
        </p>
      </div>
      <div className="pt-6 pb-6 sticky z-10 top-16 bg-[#f7f8f9] pl-6 pr-6 below-md:px-3">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-3  w-full">
            <div className="relative w-[30%] below-md:w-full">
              <p className="text-[#2D374880] text-[12px] mb-2">Select Store</p>
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

            <div className="relative w-[30%]  below-md:w-full">
              <p className="text-[#2D374880] text-[12px] mb-2">Select Period</p>
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
      <div className="flex flex-row justify-between items-center mt-16 mb-4 mx-6">
        <div>
          <p className="text-[16px] font-bold text-[#334155] ml-3"> Invoices</p>
        </div>
        <div>
          <button className="flex items-center justify-center bg-[#1AA47D] below-md:mt-3 [box-shadow:0px_3px_8px_0px_#00000026] w-[170px] h-[37px] rounded-md text-white text-[13px] font-semibold hover:shadow-lg transition-shadow duration-300">
            <img
              src="/images/uploadIcon.svg"
              alt="Upload Icon"
              className="mr-2"
            />
            Upload Invoice
          </button>
        </div>
      </div>

      <div className="mb-5 mx-6 below-md:mx-3">
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
          <div className="mt-4 flex gap-2 justify-between items-center below-md:fixed below-md:right-5 below-md:left-0 below-md:bottom-5">
            {/* Page Range Display */}
            <div>
              <span className="text-[#8899A8] text-[12px] font-medium ml-3 below-md:hidden">
                {startItem} - {endItem} of {totalItems}
              </span>
            </div>

            {/* Pagination Numbers */}
            <div className="flex flex-row gap-3">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-4 py-2 below-md:px-2 below-md:py-1 bg-[#EBEFF6] text-gray-700 rounded-md disabled:opacity-50"
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
                    className={`px-4 py-2 below-md:px-2 below-md:py-1 rounded-md text-[12px] ${
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
                className="px-4 py-2 below-md:px-2 below-md:py-1 bg-[gray-200] text-gray-700 rounded-md disabled:opacity-50"
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

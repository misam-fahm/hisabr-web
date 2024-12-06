"use client";
import React from "react";
import { useState } from "react";
import "../globals.css";
import MultiLineChart from "@/Components/drawer/MultiLineChart";
import BarChart3 from "@/Components/drawer/BarChart3";
import PieChart2 from "@/Components/drawer/Piechart2";
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
    store: 14890,
    quantity: 1500,
    total: "$3,000.00",
    name: "GORDON",
  },
  {
    date: "2022-01-02",
    store: 14891,
    quantity: 1520,
    total: "$3,100.00",
    name: "SMITH",
  },
  {
    date: "2022-01-03",
    store: 14892,
    quantity: 1600,
    total: "$3,200.00",
    name: "JACKSON",
  },
  {
    date: "2022-01-04",
    store: 14893,
    quantity: 1400,
    total: "$2,900.00",
    name: "BROWN",
  },
  {
    date: "2022-01-05",
    store: 14894,
    quantity: 1350,
    total: "$2,700.00",
    name: "DAVIS",
  },
  {
    date: "2022-01-06",
    store: 14895,
    quantity: 1650,
    total: "$3,500.00",
    name: "MILLER",
  },
  {
    date: "2022-01-07",
    store: 14896,
    quantity: 1700,
    total: "$3,700.00",
    name: "WILSON",
  },
  {
    date: "2022-01-08",
    store: 14897,
    quantity: 1800,
    total: "$4,000.00",
    name: "MOORE",
  },
  {
    date: "2022-01-09",
    store: 14898,
    quantity: 1750,
    total: "$3,800.00",
    name: "TAYLOR",
  },
  {
    date: "2022-01-10",
    store: 14899,
    quantity: 1550,
    total: "$3,200.00",
    name: "ANDERSON",
  },
  {
    date: "2022-01-11",
    store: 14900,
    quantity: 1600,
    total: "$3,400.00",
    name: "THOMAS",
  },
  {
    date: "2022-01-12",
    store: 14901,
    quantity: 1450,
    total: "$3,000.00",
    name: "WHITE",
  },
  {
    date: "2022-01-13",
    store: 14902,
    quantity: 1500,
    total: "$3,100.00",
    name: "HARRIS",
  },
  {
    date: "2022-01-14",
    store: 14903,
    quantity: 1550,
    total: "$3,300.00",
    name: "MARTIN",
  },
  {
    date: "2022-01-15",
    store: 14904,
    quantity: 1600,
    total: "$3,500.00",
    name: "GARCIA",
  },
];

const columns: ColumnDef<TableRow>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "store",
    header: "Store",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "total",
    header: "Total",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
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

const dat = [
  { label: "Beverage", value: 10836, color: "#376066CC" },
  { label: "Cakes", value: 326460, color: "#DEC560" },
  { label: "Food", value: 1835, color: "#5B7993" },
  { label: "Novelties-Boxed", value: 231725, color: "#A6A69E" },
  { label: "Soft Serve", value: 234, color: "#796C72" },
  { label: "Donations", value: 234, color: "#796C72" },
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
    <main>
      <div>
        <p className="text-[18px] font-bold text-defaultblack fixed top-0 z-30 mt-5 pl-6 pr-6">
          Gross Revenue Analysis
        </p>
      </div>
      <div className="pt-6 pb-6 sticky z-10 top-16 bg-[#f7f8f9] pl-6 pr-6">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-3  w-full">
            <div className="relative w-[30%]">
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

            <div className="relative w-[30%]">
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
              className="cursor-pointer text-[14px] text-[#6F6F6F] bg-[#C8C8C87A] w-[104px] h-[37px] rounded-md flex items-center justify-center"
            >
              Back
            </p>
          </div>
        </div>
        <div />
      </div>

      <div className=" pl-6 pr-6">
        <div className="flex flex-row w-full h-full gap-6 pt-16 ">
          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#C2D1C3] border-b-4 w-full h-full min-h-[130px] p-4 justify-between">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">
                Total Gross Revenue
              </p>
              <p className="text-[18px] text-[#2D3748]">$ 2,680,153</p>
              <p className="text-[12px] text-[#388E3C] font-semibold">
                20%{" "}
                <span className="text-[#575F6D] font-medium">
                  more than last year
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#947F914D] border-b-4 w-full h-full min-h-[130px] p-4 justify-between">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">
                Revenue Growth
              </p>
              <p className="text-[18px] text-[#2D3748]">+ 15.3%</p>
              <p className="text-[12px] text-[#388E3C] font-semibold">
                <span className="text-[#575F6D] font-medium">
                  Increased compared to last year
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#9E8F503B] border-b-4 w-full h-full min-h-[130px] p-4 justify-between">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">
                Average Per Transaction
              </p>
              <p className="text-[18px] text-[#2D3748]">$ 161,358</p>
              <p className="text-[12px] text-[#388E3C] font-semibold">
                <span className="text-[#575F6D] font-medium">
                  Average revenue earned per sale
                </span>
              </p>
            </div>
          </div>

          <div className="bg-[#FFFFFF] rounded-lg shadow-sm border-[#9E8F503B] border-b-4 w-full h-full min-h-[130px] p-4 justify-between">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">
                Revenue Target Achievement
              </p>
              <p className="text-[18px] text-[#2D3748]">$ 161,358</p>
              <p className="text-[12px] text-[#388E3C] font-semibold">
                92%
                <span className="text-[#575F6D] font-medium">
                  of target met
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-row w-full mt-6 mb-9">
          <div className="flex flex-col w-[70%]">
            <div className="bg-white shadow-md rounded-md">
              <div>
                <p className="text-[#393E47] text-[16px] font-bold mt-3 ml-6 mb-3">
                  Detailed Revenue
                </p>
              </div>
              <div>
                <MultiLineChart />
              </div>
            </div>
            <div className="bg-white shadow-md rounded-md mt-6">
              <div className="flex flex-row justify-between mx-6 mt-5 mb-5">
                <div>
                  <p className="text-[#393E47] text-[16px] font-bold mb-3">
                    Monthyl Revenue
                  </p>
                </div>

                <div className="relative w-[30%]">
                  {/* Dropdown Button */}
                  <button
                    onClick={() => setIsOpen3(!isOpen3)}
                    className="bg-[#ffffff] text-[#4B4B4B] shadow-md px-4 py-[10px] rounded flex items-center justify-between w-full text-[12px]"
                  >
                    <span>{selectedOption3}</span>
                    <img
                      src="./images/icon.svg"
                      className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                        isOpen3 ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isOpen3 && (
                    <div
                      className="absolute left-0 w-full mt-2 bg-[#ffffff] text-[#4B4B4B] text-[12px] border rounded shadow-md"
                      style={{ zIndex: 50 }}
                    >
                      {options3.map((option3, index) => (
                        <div
                          key={index}
                          onClick={() => handleSelect3(option3)}
                          className="cursor-pointer px-4 py-2 hover:bg-gray-100 border-b last:border-none"
                        >
                          {option3}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <BarChart3 selectedYear={Number(selectedOption3)} />
              </div>
            </div>
          </div>
          <div className="w-[30%] bg-white ml-6 shadow-md rounded-md">
            <div className="flex flex-col ">
              <div className="flex flex-row justify-between px-6 pt-6">
                <div>
                  <p className="text-[#393E47] font-bold text-[16px]">
                    Product Revenue
                  </p>
                </div>
                <div className="relative w-[40%]">
                  {/* Dropdown Button */}
                  <button
                    onClick={() => setIsOpen4(!isOpen4)}
                    className="bg-[#ffffff] text-[#4B4B4B] shadow-md px-4 py-[5px] rounded flex items-center justify-between w-full text-[12px]"
                  >
                    <span>{selectedOption4}</span>
                    <img
                      src="./images/icon.svg"
                      className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                        isOpen4 ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isOpen4 && (
                    <div
                      className="absolute left-0 w-full mt-2 bg-[#ffffff] text-[#4B4B4B] text-[12px] border rounded shadow-md"
                      style={{ zIndex: 50 }}
                    >
                      {options4.map((option4, index) => (
                        <div
                          key={index}
                          onClick={() => handleSelect4(option4)}
                          className="cursor-pointer px-4 py-2 hover:bg-gray-100 border-b last:border-none"
                        >
                          {option4}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <PieChart2 />
              </div>
              <div>
                <div className="w-full max-w-sm mx-auto px-6">
                  <ul>
                    {dat.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between py-2"
                      >
                        {/* Color Circle */}
                        <div className="flex items-center">
                          <span
                            className="inline-block w-3 h-3 rounded-full mr-3"
                            style={{ backgroundColor: item.color }} // Apply dynamic hex color
                          ></span>
                          <span className="text-[#000000B2] text-[12px]">
                            {item.label}
                          </span>
                        </div>
                        {/* Value */}
                        <span className="font-semibold text-[#0A0A0A] text-[14px]">
                          {item.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/**table */}
        <div className="flex flex-row justify-between items-center mt-4 mb-4">
          <div>
            <p className="text-[16px] font-bold text-[#334155] ml-3">
              Invoices
            </p>
          </div>
          <div>
            <button
              className="bg-[#1AA47D] [box-shadow:0px_3px_8px_0px_#00000026] w-[133px] h-[37px] rounded-md text-white text-[14px] font-semibold 
             hover:shadow-lg transition-shadow duration-300"
            >
              Upload Invoice
            </button>
          </div>
        </div>
        <div className="mb-10">
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
                      onChange={(e) =>
                        table.setPageIndex(Number(e.target.value))
                      } // Update page on selection
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
      </div>
    </main>
  );
};

export default DetailsPage;

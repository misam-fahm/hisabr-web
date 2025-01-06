"use client";
import React from "react";
import { useState, useRef } from "react";
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
  {
    accessorKey: "date",
    header: "Date",
    size: 100,
  },
  {
    accessorKey: "store",
    header: "Store",
    size: 100,
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    size: 100,
  },
  {
    accessorKey: "total",
    header: "Total",
    size: 100,
  },
  {
    accessorKey: "name",
    header: "Name",
    size: 160,
  },
  {
    id: "view",
    header: () => <div className="text-center">View</div>,
    cell: () => (
      <span
        onClick={() => (window.location.href = "/invoicedetails")}
        className="flex justify-center"
      >
        <Images src="/images/eye.svg" alt="Eye Icon" width={25} height={25} />
      </span>
    ),
    size: 60,
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

  const [selectedOption, setSelectedOption] = useState<string>("Stores");
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

    setTimeout(() => {
      setShowTooltip(false);
    }, 2000);
  };

  const handlePressEnd = () => {
    setShowTooltip(false);
  };

  const fileInputRef: any = useRef(null);
  const handleButtonClick = () => {
    // Programmatically trigger the hidden file input
    fileInputRef.current.click();
  };
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file.name);
    }
  };

  return (
    <main
      className="max-h-[calc(100vh-70px)]  below-md:max-h-[calc(100vh-0)] tablet:max-h-[calc(100vh-0)] overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <img
        onClick={handleBack}
        src="/images/MobileBackIcon.svg"
        className="fixed top-4 left-4 z-30 below-lg:hidden tablet:hidden"
      />
      {/* <div className="below-md:flex below-md:justify-center ">
        <p className="text-[18px] below-md:text-[16px] below-md:mr-8 font-bold text-defaultblack fixed top-0 z-30 mt-5 below-md:pl-0 below-md:pr-0 pl-6 pr-6">
          Items Analysis
        </p>
      </div> */}
      <div className="pt-6 pb-6 below-md:pb-4 below-md:pt-4 sticky z-10  bg-[#f7f8f9] pl-6 pr-6 below-md:px-3">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row below-md:flex-col gap-3 w-full">
            <Dropdown
              options={options}
              selectedOption={selectedOption}
              onSelect={handleSelect}
              isOpen={isOpen}
              toggleOpen={toggleDropdown1}
            />

            {/*second dropdown */}

            {/* Second Dropdown */}

            <Dropdown
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
              className=" below-md:hidden cursor-pointer text-[14px] text-[#6F6F6F] bg-[#C8C8C87A] w-[104px] h-[37px] rounded-md flex items-center justify-center"
            >
              Back
            </p>
          </div>
        </div>
        <div />
      </div>
      {/* Table remains visible as is */}
      <div className="flex flex-row justify-between items-center mb-6 below-md:mb-3 mx-6 below-md:mx-3">
        <div>
          <p className="text-[16px] font-bold text-[#334155] ml-3 below-md:ml-2">
            Invoices
          </p>
        </div>
        <div>
          <button
            className="below-md:hidden flex items-center justify-center bg-[#1AA47D] hover:bg-[#168A68] shadow-lg below-md:mt-3 w-[170px] h-[35px] rounded-md text-white text-[14px] font-semibold"
            onClick={handleButtonClick}
          >
            <img
              src="/images/uploadIcon.svg"
              alt="Upload Icon"
              className="mr-1"
            />
            Upload Invoice
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
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
              style={{ maxHeight: "calc(100vh - 320px)" }}
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
        <Pagination table={table} totalItems={0} />
        <div className="below-lg:hidden tablet:hidden mb-5">
          <div className="flex flex-col">
            <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
              <div className=" items-center mb-4 mt-2 px-2">
                <div className="flex justify-between pb-1 w-[100%] border-b border-[#E4E4EF]">
                  <div className="flex gap-3 text-[#1A1A1A] text-[14px] font-bold">
                    <span>12-20-24</span>
                    <span>Gordon</span>
                  </div>
                  <div>
                    <button
                      onClick={() => (window.location.href = "/invoicedetails")}
                    >
                      <img src="/images/ViewEyeIcon.svg" className="w-7 h-7" />
                    </button>
                  </div>
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

            <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
              <div className=" items-center mb-4 mt-2 px-2">
                <div className="flex justify-between pb-1 w-[100%] border-b border-[#E4E4EF]">
                  <div className="flex gap-3 text-[#1A1A1A] text-[14px] font-bold">
                    <span>12-20-24</span>
                    <span>Gordon</span>
                  </div>
                  <div>
                    <button
                      onClick={() => (window.location.href = "/invoicedetails")}
                    >
                      <img src="/images/ViewEyeIcon.svg" className="w-7 h-7" />
                    </button>
                  </div>
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

            <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
              <div className=" items-center mb-4 mt-2 px-2">
                <div className="flex justify-between pb-1 w-[100%] border-b border-[#E4E4EF]">
                  <div className="flex gap-3 text-[#1A1A1A] text-[14px] font-bold">
                    <span>12-20-24</span>
                    <span>Gordon</span>
                  </div>
                  <div>
                    <button
                      onClick={() => (window.location.href = "/invoicedetails")}
                    >
                      <img src="/images/ViewEyeIcon.svg" className="w-7 h-7" />
                    </button>
                  </div>
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

            <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
              <div className=" items-center mb-4 mt-2 px-2">
                <div className="flex justify-between pb-1 w-[100%] border-b border-[#E4E4EF]">
                  <div className="flex gap-3 text-[#1A1A1A] text-[14px] font-bold">
                    <span>12-20-24</span>
                    <span>Gordon</span>
                  </div>
                  <div>
                    <button
                      onClick={() => (window.location.href = "/invoicedetails")}
                    >
                      <img src="/images/ViewEyeIcon.svg" className="w-7 h-7" />
                    </button>
                  </div>
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

      <div className="below-lg:hidden flex justify-end fixed bottom-5 right-5 tablet:hidden">
        <button
          className="focus:outline-none flex items-center justify-center bg-[#1AA47D] w-[56px] h-[56px] rounded-lg relative"
          onTouchStart={handlePressStart} // For mobile devices
          onMouseLeave={handlePressEnd} // Hide tooltip on mouse leave
          onClick={handleButtonClick}
        >
          <img src="/images/uploadIcon.svg" className="w-[18px]" />
          {showTooltip && (
            <div className="absolute bottom-[70px] right-[80%] transform translate-x-1/2 bg-[#79747E] text-white text-[12px] px-5 py-2 rounded-md whitespace-nowrap">
              Upload Invoice
              {/* Tooltip Pointer */}
              <div className="absolute top-full right-[20%] transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#79747E]"></div>
            </div>
          )}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </main>
  );
};

export default DetailsPage;

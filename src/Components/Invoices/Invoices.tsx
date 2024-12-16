'use client';
import { useRef, useState } from "react";
import React from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// import Image from "next/image"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import Pagination from "../ui/Common/Pagination";

interface TableRow {
  date: string;
  store: number;
  quantity: number;
  total: string;
  name: string;
}
const data: TableRow[] = [
  { date: "2022-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon" },
  { date: "2022-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon" },
  { date: "2022-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon" },
  { date: "2022-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon" },
  { date: "2022-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon" },
  { date: "2023-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon" },
  { date: "2023-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon" },
  { date: "2023-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon" },
  { date: "2023-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon" },
  { date: "2023-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon" },
  { date: "2024-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon" },
  { date: "2024-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon" },
  { date: "2024-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon" },
  { date: "2024-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon" },
  { date: "2024-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon" },
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
      <button onClick={() => (window.location.href = "/invoicedetails")} className="text-green-500 hover:text-green-700">
        <img src="/images/viewIcon.svg" alt='View Icon' width={35} height={35} />
      </button>
    )
  },
];
const Invoices = () => {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: 0,
      },
    },
  });
  //Card data
  const cardData = [
    { date: "2022-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon" },
    { date: "2022-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon" },
    { date: "2022-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon" },
    { date: "2022-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon" },
    { date: "2022-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon" },
  ]
  //pagination range
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalItems = table.getFilteredRowModel().rows.length;
  const startItem = pageIndex * pageSize + 1;
  const endItem = Math.min((pageIndex + 1) * pageSize, totalItems);

  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]); // From and To Date
  const [startDate, endDate] = dateRange;
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
  /**dropdown */
  const [selectedOption, setSelectedOption] = useState<string>("All stores");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const options = ["Store 1", "Store 2", "Store 3", "All Store"];

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const calendarRef = useRef<DatePicker | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    // Focus the input field when the image is clicked
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };


  return (
    <main
      className="max-h-[calc(100vh-50px)] px-3 overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <div className='flex justify-between below-md:flex-col items-center w-full below-md:item-start below-md:space-y-1 gap-2 mt-6 my-4'>
        <div className="flex  gap-2 w-full below-md:flex-col">
          <div className="flex">
            {/* Dropdown Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-[#ffffff] text-[#636363] shadow below-md:px-2 px-4 py-[10px] rounded flex items-center justify-between w-[265px] h-[35px] text-[12px] below-md:h-[35px] below-md:w-full below-md:text[11px] below-md:text[#474747]"
            >
              <span>{selectedOption}</span>
              <img
                src="./images/icon.svg"
                className={`w-3 h-3 ml-2 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""
                  }`}
              />
            </button>
            {/* Dropdown Menu */}
            {isOpen && (
              <div
                className="absolute left-[260px] below-md:left-[16px] below-md:w-[90%] w-[20%] mt-9 bg-[#ffffff] text-[#4B4B4B] text-[12px] border rounded-md shadow"
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





          <div className="relative flex below-md:w-full below-md:text-[11px] shadow  rounded w-[265px] h-[35px] text-[12px] bg-[#ffff] items-center ">
            <DatePicker
              selected={startDate}
              onChange={(dates: [Date | null, Date | null]) => {
                // Convert null values to undefined
                const updatedDates: [Date | undefined, Date | undefined] = [
                  dates[0] || undefined,
                  dates[1] || undefined,
                ];
                setDateRange(updatedDates);
              }}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              placeholderText="Select date range"
              className="flex-grow h-full below-md:text-[11px] pl-2 bg-transparent text-[12px] focus:outline-none"
              ref={calendarRef}// Add reference for the DatePicker
              maxDate={new Date()} // Prevent selecting future dates
              filterDate={(date) => {
                const today = new Date();
                const isFuture = date <= today; // Ensure no future dates

                // Disable the previous month's dates only when viewing the current month
                const isPreviousMonthInCurrentView =
                  date.getMonth() === today.getMonth() - 1 && date.getFullYear() === today.getFullYear();
                // Ensure dates are valid and not from the previous month
                return isFuture && !isPreviousMonthInCurrentView;
              }}
              dayClassName={(date) => {
                if (startDate && endDate) {
                  if (date >= startDate && date <= endDate) {
                    return "bg-blue-500 text-white"; // Highlight selected range
                  }
                }
                return "bg-gray-200 text-gray-600"; // Default style for other dates
              }}
            />
            <img className='absolute right-2 cursor-pointer items-center ' src='/images/CalenderIcon.svg'
              onClick={() => {
                if (calendarRef.current) {
                  (calendarRef.current as any).setOpen(true); // Open the calendar on icon click
                }
              }}
            />
          </div>
          <div className='flex shadow  below-md:w-full below-md:text-[11px] text-[12px] bg-[#ffff] items-center rounded w-[200px] h-[35px]'>
            <input type='search'
              onChange={(e) => setGlobalFilter(e.target.value)}
              ref={searchInputRef}
              placeholder='Search'
              className='w-full h-[35px] bg-transparent rounded-lg px-3 text-[#636363] focus:outline-none'>
            </input>
            <img className='pr-2 cursor-pointer items-center' src='/images/searchicon.svg'
              onClick={handleClick} />
          </div>
        </div>
        <div className='below-md:hidden mt-1'>
          <button className="w-[170px] h-[35px] bg-[#1AA47D] hover:bg-[#168A6F] text-white rounded-md text-[14px] flex items-center justify-center gap-1"
            onClick={handleButtonClick}
          >
             <img className ='' src="/images/UploadInvoice.svg" alt="" />
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
      {/* Card section */}
      <div>
                    {cardData.map((card, index) => (
                        <div key={index}
                            className='flex flex-col h-[167px] w-full shadow rounded-md bg-white border border-[#E4E4EF] below-lg:hidden my-4'>
                            <div className='flex justify-between items-start'>
                                <div className='flex gap-4 px-3 py-4'>
                                    <p className='text-[12px] font-semibold'>{card.date}</p>
                                    <p className='text-[12px] font-semibold'>{card.name}</p>
                                </div>

                                <div className='flex gap-4 mb-1 px-3 py-4'>
                                    <button className='text-green-500 hover:text-green-700'>
                                        <img className='below-md:w-5 below-md:h-5 h-4 w-4' src='/images/ViewIcon(1).svg' />
                                    </button>
                                </div>
                            </div>
                            {/* Divider */}
                            <div className="border-t border-gray-300 mb-2"> </div>
                            {/* Content Area */}
                            <div className='flex justify-between items-center mx-3 py-1'>
                                <div className='flex flex-col text-[12px] space-y-2'>
                                    <p className='text-[#636363]'>Store</p>
                                    <p className='text-[#636363]'>quantity</p>
                                    <p className='text-[#636363]'>total</p>
                                </div>
                                <div className='flex flex-col text-[12px] text-right space-y-2'>
                                    <p className='text-[#1A1A1A]'>{card.store}</p>
                                    <p className='text-[#000000]'>{card.quantity}</p>
                                    <p className='text-[#1A1A1A]'>{card.total}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className='fixed bottom-[20px] below-lg:hidden right-3'>
                    <button className="w-[50px] h-[50px] bg-[#1AA47D] hover:bg-[#168A6F] text-white rounded-md text-[14px] flex items-center justify-center gap-1"
                             onClick={handleButtonClick}>
                     <img src="/images/uploadinvoiceIcon.svg" alt='Upload Invoice' className="transition-opacity duration-10"/>
                    </button>

                    </div>
                
                </div>



      {/* Invoice Table */}
      <div className='overflow-x-auto bg-white shadow-lg rounded-lg py-3 flex-grow flex flex-col below-md:hidden'>
        <div className='overflow-hidden max-w-full' >
          <table className='w-full border-collapse text-[12px] text-white table-fixed'>
            <thead className='bg-[#334155] top-0 z-10'>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-left px-4 py-3 text-[#FFFFFF] font-medium text-[14px]  w-[100px]"
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
          <div className="w-full overflow-y-auto scrollbar-thin flex-grow"
            style={{ maxHeight: "calc(100vh - 270px)" }}>
            <table className='w-full border-collapse text-[12px] text-white table-fixed'>
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
                        className="px-4 py-1 text-[#636363] text-[14px]  w-[100px]"
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
      {/* Pagination Numbers */}
      <div className="mt-4  below-md:hidden">
       <Pagination table={table}/>
      </div>


    </main>
  )
}

export default Invoices
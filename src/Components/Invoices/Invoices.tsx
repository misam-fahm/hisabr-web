'use client';
import { useRef, useState } from "react";
import React from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DateRange from "@/Components/drawer/DateRangePicker";
import { useRouter } from "next/navigation";
import Dropdown from "@/Components/ui/Common/DropDown";


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
  { date: "2022-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon Gordon Gordon" },
  { date: "2022-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon Gordon Gordon" },
  { date: "2022-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon Gordon Gordon" },
  { date: "2022-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon Gordon Gordon" },
  { date: "2022-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon Gordon Gordon" },
  { date: "2023-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon Gordon Gordon" },
  { date: "2023-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon Gordon Gordon" },
  { date: "2023-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon Gordon Gordon" },
  { date: "2023-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon Gordon Gordon" },
  { date: "2023-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon Gordon Gordon" },
  { date: "2024-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon Gordon Gordon" },
  { date: "2024-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon Gordon Gordon" },
  { date: "2024-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon Gordon Gordon" },
  { date: "2024-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon Gordon Gordon" },
  { date: "2024-01-01", store: 13246, quantity: 176, total: "$3,484.47", name: "Gordon Gordon Gordon" },
];
const columns: ColumnDef<TableRow>[] = [
  {
    accessorKey: "date",
    header: () => <div className='text-left'>Date</div>,
    cell: (info) => <span>{info.getValue() as string}</span>,
    size: 60,

  },
  {
    accessorKey: "store",
    header: () => <div className='text-left'>Store</div>,
    cell: (info) => <span>{info.getValue() as number}</span>,
    size: 30,
  },
  {
    accessorKey: "quantity",
    header: () => <div className='text-right'>Quantity</div>,
    cell: (info) => <span className='flex justify-end '>{info.getValue() as string}</span>,
    size: 50,
  },
  {
    accessorKey: "total",
    header: () => <div className='text-right pr-8'>Total</div>,
    cell: (info) => <span className='flex justify-end pr-8'>{info.getValue() as string}</span>,
    size: 70,
  },
  {
    accessorKey: "name",
    header: () => <div className='text-left'>Name</div>,
    cell: (info) => <span className='text-left '>{info.getValue() as string}</span>,
    size: 80,
  },
  {
    id: "view",
    header: () => <div className='text-left'>View</div>,
    cell: () => (
      <button onClick={() => (window.location.href = "/invoicedetails")} className="text-green-500 hover:text-green-700 text-center ml-2">
        <img src="/images/View_duotone.svg" alt='View Icon' />
      </button>
    ),
    size: 30,
  },
];
const Invoices = () => {

  const router = useRouter();
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
  const [selectedOption, setSelectedOption] = useState<string>("Select Stores");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const options = ["Store 1", "Store 2", "Store 3", "All Store"];
  const toggleDropdown1 = () => setIsOpen(!isOpen);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  // const calendarRef = useRef<DatePicker | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    // Focus the input field when the image is clicked
    if (searchInputRef.current) {
      searchInputRef.current.focus();
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
      className="max-h-[calc(100vh-50px)] px-6 below-md:px-3 overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <div className='flex justify-between below-md:flex-col items-center w-full below-md:item-start below-md:mt-4 below-md:mb-4 mt-6 mb-6'>
        <div className="flex gap-3 below-md:gap-2 below-md:space-y-1 w-full below-md:flex-col">
          <div className="flex">
          <Dropdown
              options={options}
              selectedOption={selectedOption}
              onSelect={handleSelect}
              isOpen={isOpen}
              toggleOpen={toggleDropdown1}
              widthchange="tablet:w-full"
            />
          </div>



          <div className="w-[261px] tablet:w-full below-md:w-full">
            <DateRange />
          </div>


          <div className='flex shadow  below-md:w-full text-[12px] bg-[#ffff] items-center rounded w-[260px] h-[35px]'>
            <input type='search'
              onChange={(e) => setGlobalFilter(e.target.value)}
              ref={searchInputRef}
              placeholder='Search'
              className='w-full h-[35px] bg-transparent rounded-lg px-3 placeholder:text-[#636363] focus:outline-none'>
            </input>
            <img className='pr-2 cursor-pointer items-center' src='/images/searchicon.svg'
              onClick={handleClick} />
          </div>
        </div>
        <div className='below-md:hidden mt-1'>
          <button className="w-[170px] h-[35px] bg-[#1AA47D] hover:bg-[#168A6F] text-white  gap-[0.25rem] font-medium  rounded-md text-[14px] flex items-center justify-center "
            onClick={handleButtonClick}
          >
            <img className='' src="/images/UploadInvoice.svg" alt="" />
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
            className='flex flex-col w-full  rounded-md bg-white border border-b border-[#E4E4EF] below-lg:hidden my-3'>
            <div className='flex justify-between items-start'>
              <div className='flex gap-4 px-3 py-4'>
                <p className='text-[14px] font-bold'>{card.date}</p>
                <p className='text-[14px] font-bold'>{card.name}</p>
              </div>

              <div className='flex gap-4 mb-1 px-3 py-4'>
                <button onClick={() => (window.location.href = "/invoicedetails")} className='text-green-500 hover:text-green-700'>
                  <img className='below-md:w-7 below-md:h-7 h-4 w-4' src='/images/ViewIcon(1).svg' />
                </button>
              </div>
            </div>
            {/* Divider */}
            <div className="flex items-center px-3 -mt-4">
              <div className="border-t border-gray-200 w-full"></div>
            </div>


            {/* Content Area */}
            <div className='flex justify-between items-center px-3 py-4'>
              <div className='flex flex-col text-[13px] space-y-3'>
                <p className='text-[#636363]'>Store</p>
                <p className='text-[#636363]'>quantity</p>
                <p className='text-[#636363]'>total</p>
              </div>
              <div className='flex flex-col text-[14px] text-right space-y-3'>
                <p className='text-[#1A1A1A]'>{card.store}</p>
                <p className='text-[#000000]'>{card.quantity}</p>
                <p className='text-[#1A1A1A]'>{card.total}</p>
              </div>
            </div>

          </div>
        ))}
        <div className='below-lg:hidden flex justify-end fixed bottom-1 right-1'>

          <button className="focus:outline-none w-[80px] h-[80px] text-white rounded-md text-[14px] flex items-center justify-center relative"
            onTouchStart={handlePressStart} // For mobile devices
            onMouseLeave={handlePressEnd} // Hide tooltip on mouse leave
            onClick={handleButtonClick}

          >
            <img src="/images/uploadinvoiceIcon.svg" alt='Upload Invoice' />
            {showTooltip && (
              <div className="absolute bottom-[75px] right-[80%] transform translate-x-1/2 bg-[#79747E] text-white text-[12px] px-5 py-2 rounded-md whitespace-nowrap">
                Upload Invoice
                {/* Tooltip Pointer */}
                <div className="absolute top-full right-[20%] transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#79747E]"></div>
              </div>
            )}
          </button>

        </div>

      </div>



      {/* Invoice Table */}
      <div className='overflow-x-auto  shadow-md border-collapse border border-gray-200 rounded-lg  flex-grow flex flex-col below-md:hidden'>
        <div className='overflow-hidden max-w-full rounded-md' >
          <table className='w-full border-collapse text-[12px] rounded-md text-white table-fixed'>
            <thead className='bg-[#334155] top-0 z-10'>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-left px-4 py-3 text-[#FFFFFF] font-medium text-[14px]  w-[100px]"
                      style={{ width: `${header.column.getSize()}px` }}
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
                        className="px-4 py-1 text-[#636363] text-[14px]  "
                        style={{ width: `${cell.column.getSize()}px` }}
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
        <Pagination table={table} />
      </div>


    </main>
  )
}

export default Invoices
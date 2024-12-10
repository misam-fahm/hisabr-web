"use client";

import React, { FC, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AddExpenses from '@/Components/Expenses/AddExpenses';
import Images from "@/Components/ui/Common/Image";
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
    amount: string;
    description: string;
    type: string;

}


const data: TableRow[] = [
    { date: "2022-01-01", store: 13246, amount: "11,800", description: "Mortgage", type: "Mortgage" },
    { date: "2022-01-01", store: 13246, amount: "11,800", description: "Mortgage", type: "Mortgage" },
    { date: "2022-01-01", store: 13246, amount: "11,800", description: "Mortgage", type: "Mortgage" },
    { date: "2022-01-01", store: 13246, amount: "11,800", description: "Mortgage", type: "Mortgage" },
    { date: "2022-01-01", store: 13246, amount: "11,800", description: "Mortgage", type: "Mortgage" },
    { date: "2022-01-01", store: 13246, amount: "11,800", description: "Mortgage", type: "Mortgage" },
    { date: "2022-01-01", store: 13246, amount: "11,800", description: "Mortgage", type: "Mortgage" },
    { date: "2022-01-01", store: 13246, amount: "11,800", description: "Mortgage", type: "Mortgage" },
    { date: "2022-01-01", store: 13246, amount: "11,800", description: "Mortgage", type: "Mortgage" },
    { date: "2022-01-01", store: 13246, amount: "11,800", description: "Mortgage", type: "Mortgage" },
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
        accessorKey: "amount",
        header: "Amount",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "type",
        header: "Type",
    },
    {
        id: "edit",
        header: "Edit",
        cell: () => (
            <img src="/images/editIcon.svg" alt='Edit Icon' width={15} height={15} />
        )
    },
    {
        id: "delete",
        header: "Delete",
        cell: () => (
            <Images src="/images/DeleteIcon.svg" alt="Delete Icon" width={30} height={30} />
        ),
    },
];
const Expenses: FC = () => {
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

    const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]); // From and To Date
    const [startDate, endDate] = dateRange;
    const [isOpen, setIsOpen] = useState<boolean>(false); //control pop up vivibility
    const togglePopup = () => {
        setIsOpen(!isOpen);
    };
    /**dropdown */
    const [selectedOption, setSelectedOption] = useState<string>("All stores");
    //const [isOpen, setIsOpen] = useState<boolean>(false);

    const options = ["Store 1", "Store 2", "Store 3", "All Store"];

    const handleSelect = (option: string) => {
        setSelectedOption(option);
        setIsOpen(false);
    };


    return (
        <main className="my-4 mx-6 mt-24">
            <>
                <div className='flex flex-row w-full items-center gap-4 space-x-4 mt-4'>

                    <div className='flex'>
                        {/* Dropdown Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="bg-[#ffffff] text-[#636363] shadow px-4 py-[10px] rounded-md flex items-center justify-between w-[265px] h-[35px] text-[12px]"
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
                                className="absolute left-[260px] w-[20%] mt-9 bg-[#ffffff] text-[#4B4B4B] text-[12px] border rounded shadow-md"
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


                    <div className="flex shadow border rounded-lg w-[265px] h-[35px] text-[12px] bg-[#ffff] items-center ">
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
                            className="w-[246px] h-[35px] pl-2 bg-transparent text-[12px] focus:outline-none"
                        />
                        <img className='w-5 h-5 pr-2 cursor-pointer items-center ' src='/images/CalenderIcon.svg' />
                    </div>

                    <div className='flex shadow border text-[12px] bg-[#ffff] items-center  rounded-lg w-[200px] h-[35px]'>
                        <input type='search' placeholder='Search' className='w-full h-[35px] bg-transparent rounded-lg px-3 text-[#636363] focus:outline-none'>
                        </input>
                        <img className='w-5 h-5 pr-1 cursor-pointer items-center' src='/images/searchicon.svg' />
                    </div>
                </div>

                <div className='flex items-center justify-between my-3'>
                    <p className='text-[16px] font-bold text-[#334155] mt-2 '>Expenses</p>
                    <AddExpenses />
                </div>




                {/* Expenses Table */}
                <div className='bg-white  shadow-lg rounded-lg overflow-hidden'>
                    <div className='w-full' >
                        <table className='w-full border-collapse text-[12px] text-white'>
                            <thead className='bg-[#334155]' >
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
                </div>
                {/* Pagination Numbers */}
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
                                    className={`px-4 py-2 rounded-md text-[12px] ${table.getState().pagination.pageIndex === pageIndex
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

            </>
        </main>
    )
}

export default Expenses
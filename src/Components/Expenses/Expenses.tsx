"use client";

import React, { FC, useState, useRef } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AddExpenses from "@/Components/Expenses/AddExpenses";
import DateRange from "@/Components/drawer/DateRangePicker";

import Image from "next/image";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    flexRender,
    ColumnDef,
} from "@tanstack/react-table";
import Pagination from '../ui/Common/Pagination';
import DeleteExpense from './DeleteExpense';
import EditExpense from './EditExpense';

interface TableRow {
    date: string;
    store: number;
    amount: string;
    description: string;
    type: string;
}

const data: TableRow[] = [
    {
        date: "2022-01-01",
        store: 13246,
        amount: "11,800",
        description: "Mortgage Mortgage Mortgage Mortgage",
        type: "Mortgage",
    },
    {
        date: "2022-01-01",
        store: 13246,
        amount: "11,800",
        description: "Mortgage Mortgage Mortgage Mortgage",
        type: "Mortgage",
    },
    {
        date: "2022-01-01",
        store: 13246,
        amount: "11,800",
        description: "Mortgage Mortgage Mortgage Mortgage",
        type: "Mortgage",
    },
    {
        date: "2022-01-01",
        store: 13246,
        amount: "11,800",
        description: "Mortgage Mortgage Mortgage Mortgage",
        type: "Mortgage",
    },
    {
        date: "2022-01-01",
        store: 13246,
        amount: "11,800",
        description: "Mortgage Mortgage Mortgage Mortgage",
        type: "Mortgage",
    },
    {
        date: "2022-01-01",
        store: 13246,
        amount: "11,800",
        description: "Mortgage Mortgage Mortgage Mortgage",
        type: "Mortgage",
    },
    {
        date: "2022-01-01",
        store: 13246,
        amount: "11,800",
        description: "Mortgage Mortgage Mortgage Mortgage",
        type: "Mortgage",
    },
    {
        date: "2022-01-01",
        store: 13246,
        amount: "11,800",
        description: "Mortgage Mortgage Mortgage Mortgage",
        type: "Mortgage",
    },
    {
        date: "2022-01-01",
        store: 13246,
        amount: "11,800",
        description: "Mortgage Mortgage Mortgage Mortgage",
        type: "Mortgage",
    },
    {
        date: "2022-01-01",
        store: 13246,
        amount: "11,800",
        description: "Mortgage Mortgage Mortgage Mortgage",
        type: "Mortgage",
    },
];
const columns: ColumnDef<TableRow>[] = [
    {
        accessorKey: "date",
        header: () => <div className='text-left '>Date</div>,
        cell: (info) => <span>{info.getValue() as string}</span>,
        size: 100,
    },
    {
        accessorKey: "store",
        header: () => <div className='text-left'>Store</div>,
        cell: (info) => <span>{info.getValue() as number}</span>,
        size: 80,
    },
    {
        accessorKey: "amount",
        header: () => <div className='text-left'>Amount</div>,
        cell: (info) => <span className='text-right ml-5'>{info.getValue() as string}</span>,
        size: 100,
    },
    {
        accessorKey: "description",
        header: () => <div className='text-left'> Description</div>,
        cell: (info) => <span className="">{info.getValue() as string}</span>,
        size: 200,
    },
    {
        accessorKey: "type",
        header: () => <div className='text-left'>Type</div>,
        cell: (info) => <span className="">{info.getValue() as string}</span>,
        size: 80,
    },
    {
        id: "edit",
        header: () => <div className="text-center ">Edit</div>,
        cell: () => (
            <>
                <span className="flex justify-center">  <EditExpense expenseData={expenseData}
                    onUpdate={(updatedData) => {
                        console.log("Updated Data: ", updatedData);
                        // Example: update the state or send the updated data to an API
                    }} /></span>
            </>

        ),
        size: 50,
    },
    {
        id: "delete",
        header: () => <div className="text-center">Delete</div>,
        cell: () => (
            <>
                <span className="flex justify-center"> <DeleteExpense /></span>
            </>
        ),
        size: 50
    },
];
const expenseData = {
    store: "Store 1",
    expenseType: "Type 1",
    description: "Expense description",
    amount: 100,
    date: new Date(),
};


const Expenses: FC = () => {
    // const[selectedExpense,setSelectedExpense]=useState<Expense || null>({

    // })
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
        { date: "2022-01-01", type: "Mortgage", store: 13246, amount: "11,456 ", description: "Mortgage Mortgage Mortgage" },
        { date: "2022-01-01", type: "Mortgage", store: 13246, amount: "11,456", description: "Mortgage Mortgage Mortgage" },
        { date: "2022-01-01", type: "Mortgage", store: 13246, amount: "11,456", description: "Mortgage Mortgage Mortgage" },
        { date: "2022-01-01", type: "Mortgage", store: 13246, amount: "11,456", description: "Mortgage Mortgage Mortgage" },
        { date: "2022-01-01", type: "Mortgage", store: 13246, amount: "11,456", description: "Mortgage Mortgage Mortgage" },
        { date: "2022-01-01", type: "Mortgage", store: 13246, amount: "11,456", description: "Mortgage Mortgage Mortgage" },
        { date: "2022-01-01", type: "Mortgage", store: 13246, amount: "11,456", description: "Mortgage Mortgage Mortgage" },
        { date: "2022-01-01", type: "Mortgage", store: 13246, amount: "11,456", description: "Mortgage Mortgage Mortgage" },
        { date: "2022-01-01", type: "Mortgage", store: 13246, amount: "11,456", description: "Mortgage Mortgage Mortgage" },
        { date: "2022-01-01", type: "Mortgage", store: 13246, amount: "11,456", description: "Mortgage Mortgage Mortgage " },
        { date: "2022-01-01", type: "Mortgage", store: 13246, amount: "11,456", description: "Mortgage Mortgage Mortgage" },

    ];
    //pagination range
    const { pageIndex, pageSize } = table.getState().pagination;
    const totalItems = table.getFilteredRowModel().rows.length;
    const startItem = pageIndex * pageSize + 1;
    const endItem = Math.min((pageIndex + 1) * pageSize, totalItems);

    // const calendarRef = useRef<DatePicker | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        // Focus the input field when the image is clicked
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    const [isOpen, setIsOpen] = useState<boolean>(false); //control pop up vivibility
    const togglePopup = () => {
        setIsOpen(!isOpen);
    };
    /**dropdown */
    const [selectedOption, setSelectedOption] = useState<string>("All stores");

    const options = ["Store 1", "Store 2", "Store 3", "All Store"];

    const handleSelect = (option: string) => {
        setSelectedOption(option);
        setIsOpen(false);
    };
    return (
        <main
            className="max-h-[calc(100vh-50px)] px-6 overflow-auto"
            style={{ scrollbarWidth: "thin" }}
        >

            <>
                <div className='flex justify-between below-md:flex-col w-full below-md:item-start items-center below-md:space-y-1 gap-2 mt-6 mb-6'>
                    <div className='flex gap-3 w-full below-md:flex-col'>

                        <div className='flex'>
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
                                    className="absolute left-[260px] below-md:left-[16px] below-md:w-[90%] w-[20%] mt-9 bg-[#ffffff] text-[#4B4B4B] text-[12px] border rounded shadow-md"
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

                        <div className="w-[261px] tablet:w-full below-md:w-full h-[35px]">
                            <DateRange />
                        </div>

                        <div className='flex items-center justify-between below-md:flex-row below-md:gap-4'>
                            <div className='flex shadow  text-[12px] bg-[#ffff] items-center  rounded-md w-[200px]  h-[35px] below-md:w-full below-md:h-[35px] below-md:text-[11px]'>
                                <input type='search' ref={searchInputRef} placeholder='Search' className='w-full h-[35px] bg-transparent rounded-lg px-3 text-[#636363] focus:outline-none'>
                                </input>
                                <img className='pr-2 cursor-pointer items-center' src='/images/searchicon.svg'
                                    onClick={handleClick} />

                            </div>


                        </div>
                    </div>
                    <div className=' block below-md:hidden mt-1'><AddExpenses /></div>
                </div>




                {/* Card section */}
                <div className=''>
                    {cardData.map((card, index) => (
                        <div key={index}
                            className='flex flex-col  w-full shadow rounded bg-white border border-[#E4E4EF] below-lg:hidden my-4'>
                            <div className='flex justify-between items-start'>
                                <div className='flex gap-4 px-3 py-4'>
                                    <p className='text-[12px] font-semibold'>{card.date}</p>
                                    <p className='text-[12px] font-semibold'>{card.type}</p>
                                </div>

                                <div className='flex gap-4 mb-1 px-3 py-4'>
                                    <>
                                        <EditExpense expenseData={expenseData}
                                            onUpdate={(updatedData) => {
                                                console.log("Updated Data: ", updatedData);
                                                // Example: update the state or send the updated data to an API
                                            }} />
                                        <DeleteExpense />
                                    </>
                                </div>
                            </div>
                            {/* Divider */}
                            <div className="border-t border-gray-300 mb-2"> </div>
                            {/* Content Area */}
                            <div className='flex justify-between items-center mx-3 py-1'>
                                <div className='flex flex-col text-[12px] space-y-2'>
                                    <p className='text-[#636363]'>Store</p>
                                    <p className='text-[#636363]'>Amount</p>
                                    <p className='text-[#636363]'>Description</p>
                                </div>
                                <div className='flex flex-col text-[12px] text-right space-y-2'>
                                    <p className='text-[#1A1A1A]'>{card.store}</p>
                                    <p className='text-[#000000]'>{card.amount}</p>
                                    <p className='text-[#1A1A1A]'>{card.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className='fixed bottom-[20px] hidden below-md:block right-3'><AddExpenses /></div> 
                </div>
                
                







                {/* Expenses Table */}
                <div className='overflow-x-auto shadow-md border-collapse border border-gray-200  rounded-lg  flex-grow flex flex-col below-md:hidden'>
                    <div className='overflow-hidden max-w-full rounded-md'>
                        <table className='w-full border-collapse text-[12px] text-white table-fixed rounded-md'>
                            <thead className='bg-[#334155] top-0 z-10'>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                className="text-left px-4 py-3 text-[#FFFFFF] font-medium text-[15px] w-[100px]"
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
                                                    className="px-4  py-1.5 text-[#636363] text-[14px]"
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

            </>
        </main>
    )
}

export default Expenses;



"use client";

import React, { useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AddExpenses from './AddExpenses';

const Expenses = () => {
    const data = [
        { date: "2022-01-01", store: "13246", amount: "11,800", description: "Mortgage", type: "Mortgage" },
        { date: "2022-01-01", store: "13246", amount: "11,800", description: "Mortgage", type: "Mortgage" },
        { date: "2022-01-01", store: "13246", amount: "11,800", description: "Mortgage", type: "Mortgage" },
        { date: "2022-01-01", store: "13246", amount: "11,800", description: "Mortgage", type: "Mortgage" },
        { date: "2022-01-01", store: "13246", amount: "11,800", description: "Mortgage", type: "Mortgage" },
        { date: "2022-01-01", store: "13246", amount: "11,800", description: "Mortgage", type: "Mortgage" },
        { date: "2022-01-01", store: "13246", amount: "11,800", description: "Mortgage", type: "Mortgage" },
        { date: "2022-01-01", store: "13246", amount: "11,800", description: "Mortgage", type: "Mortgage" },
        { date: "2022-01-01", store: "13246", amount: "11,800", description: "Mortgage", type: "Mortgage" },
        { date: "2022-01-01", store: "13246", amount: "11,800", description: "Mortgage", type: "Mortgage" },
    ]
    const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]); // From and To Date
    const [startDate, endDate] = dateRange;
    const [isOpen, setIsOpen] = useState(false); //control pop up vivibility
    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    return (
        <main className="px-6 ">
        <> 
            <div className='flex flex-col'>

                <div className='flex w-full items-center gap-4 space-x-4 mt-4'>

                    <select className="border shadow-md w-[200px] text-[12px] font-light h-[35px] border-gray-300 rounded-lg px-2 py-2 text-[#636363] ">
                        <option>Store 1</option>
                        <option>Store 2</option>
                        <option>Store 3</option>
                        <option> All stores</option>
                    </select>

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
                        <img className='w-5 h-5 pr-2 cursor-pointer items-center ' src='/images/CalenderIcon.svg'/>
                    </div>

                    <div className='flex shadow border text-[12px] bg-[#ffff] items-center  rounded-lg w-[200px] h-[35px]'>
                        <input type='search' placeholder='Search' className='w-full h-[35px] bg-transparent rounded-lg px-3 text-[#636363] focus:outline-none'>
                        </input>
                        <img className='w-5 h-5 pr-1 cursor-pointer items-center' src='/images/searchicon.svg' />
                    </div>


                </div>

                <div className='flex items-center justify-between mb-2'>
                    <p className='text-[16px] font-bold text-[#334155] mt-2 '>Invoices</p>
                   <AddExpenses />
                </div>



            </div>
            {/* Expenses Table */}
            <div className='bg-white shadow-lg rounded-lg overflow-hidden'>
                <div className='w-full' >
                    <table className='w-full border-collapse text-[12px] text-white'>
                        <thead className='bg-[#334155]' >
                            <tr>
                                <th className='pl-10 py-2 text-left w-[100px] '>Date</th>
                                <th className='px-4 py-2 text-center w-[80px] '>Store</th>
                                <th className='px-4 py-2 text-right w-[80px] '>Amount</th>
                                <th className='px-4 py-2 text-left w-[140px] '>Description</th>
                                <th className='px-4 py-2 text-left w-[140px] '>Type</th>
                                <th className='px-4 py-2 text-center w-[140px] '>Edit</th>
                                <th className='px-4 py-2 text-center w-[140px] '>Delete</th>
                            </tr>
                        </thead>
                    </table>

                    <div className='h-[340px] overflow-auto' style={{ scrollbarWidth: "thin" }}>
                        <table className='w-full text-[12px]'>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr key={index}
                                        className={index % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FB]'}>
                                        <td className='pl-10 py-2 text-left w-[100px]'>{item.date}</td>
                                        <td className='px-4 py-2 text-center w-[80px]'>{item.store}</td>
                                        <td className='px-4 py-2 text-right w-[80px]'>{item.amount}</td>
                                        <td className='px-4 py-2 text-left w-[140px]'>{item.description}</td>
                                        <td className='px-4 py-2  text-left w-[140px]'>{item.type}</td>

                                        <td className='px-4 py-2 w-[140px] text-center'>
                                            <button className='text-blue-500 cursor-pointer'>✏️</button>
                                        </td>
                                        <td className='px-4 py-2 w-[140px] text-center'>
                                            <button className='text-red-500 cursor-pointer'>🗑️</button>
                                        </td>


                                    </tr>
                                ))}


                               
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
        </main>

       
    )
}

export default Expenses
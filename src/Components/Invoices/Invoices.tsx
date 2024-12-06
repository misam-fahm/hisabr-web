'use client';
import { useRef, useState } from "react";
import React from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



const Invoices = () => {
  const fileInputRef:any = useRef(null);
  const handleButtonClick = () => {
    // Programmatically trigger the hidden file input
    fileInputRef.current.click();
  };
  const handleFileChange = (event:any) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file.name);
    }
  };
  const data = [
    { date: "2022-01-01", store: "13246", quantity: "176", total: "$3,484.47", name: "Gordon" },
    { date: "2022-01-01", store: "13246", quantity: "176", total: "$3,484.47", name: "Gordon" },
    { date: "2022-01-01", store: "13246", quantity: "176", total: "$3,484.47", name: "Gordon" },
    { date: "2022-01-01", store: "13246", quantity: "176", total: "$3,484.47", name: "Gordon" },
    { date: "2022-01-01", store: "13246", quantity: "176", total: "$3,484.47", name: "Gordon" },
    { date: "2022-01-01", store: "13246", quantity: "176", total: "$3,484.47", name: "Gordon" },
    { date: "2022-01-01", store: "13246", quantity: "176", total: "$3,484.47", name: "Gordon" },
    { date: "2022-01-01", store: "13246", quantity: "176", total: "$3,484.47", name: "Gordon" },
    { date: "2022-01-01", store: "13246", quantity: "176", total: "$3,484.47", name: "Gordon" },
    { date: "2022-01-01", store: "13246", quantity: "176", total: "$3,484.47", name: "Gordon" },
  ]
  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]); // From and To Date
  const [startDate, endDate] = dateRange;
  return (
    <main className="px-6 ">
      <div className='flex flex-col'>
        <div className='flex w-full items-center gap-4 space-x-4 mt-4'>
          <select className="border shadow-md w-[200px] text-[12px] font-light h-[35px] border-gray-300 rounded-md px-2 py-2 text-[#636363]"
            defaultValue="">
            <option value="" disabled hidden>All stores</option>
            <option>Store 1</option>
            <option>Store 2</option>
            <option>Store 3</option>
            <option> All stores</option>
          </select>
          <div className="flex shadow border rounded-md w-[265px] h-[35px] text-[12px] bg-[#ffff] items-center ">
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
          <div className='flex shadow border text-[12px] bg-[#ffff] items-center rounded-md w-[200px] h-[35px]'>
            <input type='search' placeholder='Search' className='w-full h-[35px] bg-transparent rounded-lg px-3 text-[#636363] focus:outline-none'>
            </input>
            <img className='w-5 h-5 pr-1 cursor-pointer items-center' src='/images/searchicon.svg' />
          </div>

        </div>
        <div className='flex items-center justify-between mb-2'>
          <p className='text-[16px] font-bold text-[#334155] mt-2 '>Invoices</p>
          <button className="w-[170px] h-[37px] bg-[#1AA47D] hover:bg-[#168A6F] text-white rounded-md text-[14px]"
          onClick={handleButtonClick}
          >
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
      {/* Expenses Table */}
      <div className='bg-white shadow-lg rounded-lg overflow-hidden'>
        <div className='w-full' >
          <table className='w-full border-collapse text-[12px] text-white'>
            <thead className='bg-[#334155]' >
              <tr>
                <th className='px-6 py-3 text-left w-[100px] '>Date</th>
                <th className='px-6 py-3 text-center w-[140px] '>Store</th>
                <th className='px-6 py-3 text-center w-[70px] '>Quantity</th>
                <th className='px-6 py-3 text-center w-[140px] '>Total</th>
                <th className='px-6 py-3 text-center w-[150px] '>name</th>
                <th className='px-6 py-3 text-center w-[140px] '>View</th>

              </tr>
            </thead>
          </table>

          <div className='h-[340px] overflow-auto' style={{ scrollbarWidth: "thin" }}>
            <table className='w-full text-[12px]'>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FB]'}>
                    <td className='px-6 py-3 text-left w-[100px]'>{item.date}</td>
                    <td className='px-6 py-3 text-center w-[80px]'>{item.store}</td>
                    <td className='px-6 py-3 text-center w-[90px]'>{item.quantity}</td>
                    <td className='px-6 py-3 text-center w-[140px]'>{item.total}</td>
                    <td className='px-6 py-3 text-center w-[100px]'>{item.name}</td>
                    <td className="px-6 py-3  text-center w-[100px]">
                      <button onClick={() =>(window.location.href="/invoicedetails")} className="text-green-500 hover:text-green-700">
                        <svg xmlns="/images/ViewIcon.svg" className="h-[19px] w-[21px] inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </td>





                  </tr>
                ))}



              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Invoices
'use client';
import React from 'react'

const InvoiceDetails = () => {
  const tableData = [
  {
    itemCode: '67452', description: 'Cheese Amer Shrp 160C', brand: 'Dairy', category: 'DY', quantity: 2, units: 'CS',
    packSize: '4*2 LB', invtValue: 11.56, unitPrice: 46.30, tax: '-', total: '46.30'
  },
  {
    itemCode: '67452', description: 'Cheese Amer Shrp 160C', brand: 'Dairy', category: 'DY', quantity: 2, units: 'CS',
    packSize: '4*2 LB', invtValue: 11.56, unitPrice: 46.30, tax: '-', total: '46.30'
  },
  {
    itemCode: '67452', description: 'Cheese Amer Shrp 160C', brand: 'Dairy', category: 'DY', quantity: 2, units: 'CS',
    packSize: '4*2 LB', invtValue: 11.56, unitPrice: 46.30, tax: '-', total: '46.30'
  },
  {
    itemCode: '67452', description: 'Cheese Amer Shrp 160C', brand: 'Dairy', category: 'DY', quantity: 2, units: 'CS',
    packSize: '4*2 LB', invtValue: 11.56, unitPrice: 46.30, tax: '-', total: '46.30'
  },
  {
    itemCode: '67452', description: 'Cheese Amer Shrp 160C', brand: 'Dairy', category: 'DY', quantity: 2, units: 'CS',
    packSize: '4*2 LB', invtValue: 11.56, unitPrice: 46.30, tax: '-', total: '46.30'
  },
  {
    itemCode: '67452', description: 'Cheese Amer Shrp 160C', brand: 'Dairy', category: 'DY', quantity: 2, units: 'CS',
    packSize: '4*2 LB', invtValue: 11.56, unitPrice: 46.30, tax: '-', total: '46.30'
  },
 
  

];


  return (
    <main
    className="max-h-[calc(100vh-60px)] overflow-auto px-6"
    style={{ scrollbarWidth: "thin" }}
  >
      <div className="flex gap-8 pt-2 pb-5  below-md:flex below-md:flex-col below-md:gap-3">
        {/* Left Panel - Invoice Details */}
        <div className="space-y-2 shadow border rounded-lg w-[299px] below-md:w-full p-4 items-start">
          <div className="flex flex-col below-md:flex-row justify-between gap-[4px]">
            <p className="text-[#636363] text-[12px]">Date</p>
            <p className="text-[#636363] text-[14px]">2023/01/09</p>
          </div>
          <div className="flex flex-col below-md:flex-row justify-between gap-[4px]">
            <span className="text-[#636363] text-[12px]">Invoice Number</span>
            <span className="text-[#636363] text-[14px]">9003185975</span>
          </div>
          <div className="flex  flex-col below-md:flex-row justify-between gap-[4px]">
            <span className="text-[#636363] text-[12px]">Store Name</span>
            <span className="text-[#636363]  text-[14px]">13246</span>
          </div>
          <div className="flex flex-col below-md:flex-row justify-between gap-[4px]">
            <span className="text-[12px] text-[#636363]">Due Date</span>
            <span className="text-[14px] text-[#636363]">2023/08/30</span>
          </div>
        </div>
        <div className='flex justify-between w-full'>
          {/* Right Panel - Totals */}
          <div className="shadow border rounded-lg w-[369px]  below-md:w-full px-4 flex flex-col py-3 gap-3">
            <div className="flex justify-between">
              <span className="text-[#636363] text-[12px]">Product Total</span>
              <span className="text-[#636363] text-[14px]">$8,068.89</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#636363] text-[12px]">Sub Total</span>
              <span className="text-[#636363] text-[14px]">$8,076.39</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#636363] text-[12px]">Tax 1</span>
              <span className="text-[#636363] text-[14px]">$1.52</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#636363] text-[12px]">Tax 2</span>
              <span className="text-[#636363] text-[14px]">$1.52</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#636363] text-[12px]">Miscellaneous</span>
              <span className="text-[#636363] text-[14px]">$0</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="text-[#636363] text-[14px] font-semibold">Total</span>
              <span className="text-[#636363] text-[14px] font-semibold">$8,079.43</span>
            </div>
          </div>
          <div className='block below-md:hidden'>
          <div className="flex justify-end items-start mb-6 mt-1">
            <button
              onClick={() => window.history.back()}
              className=" py-2 w-[104px] h-[37px] text-[14px] text-[#6F6F6F] bg-[#C8C8C8] rounded-lg"
            >
              Back
            </button>
          </div>
          </div>
        </div>


      </div>
      {/*table content*/}
      <div className='bg-white shadow-lg rounded-lg block below-md:hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full table-auto border-collapse text-[12px] text-white'>
            <thead className='bg-[#334155]'>
              <tr>
                <th className="py-2 px-4 text-left w-[10%]">Item Code</th>
                <th className="py-2 px-4 text-left break-words whitespace-normal w-[10%]">Description</th>
                <th className="py-2 px-4 text-center">Brand</th>
                <th className="py-2 px-4 text-left w-[10%]">Category</th>
                <th className="py-2 px-4 text-center w-[6%]">Quantity</th>
                <th className="py-2 px-4 text-right">Units</th>
                <th className="py-2 px-4 text-right">Pack Size</th>
                <th className="py-2 px-4 text-right">Invt Value</th>
                <th className="py-2 px-4 text-right">Unit Price</th>
                <th className="py-2 px-4 text-right">Tax</th>
                <th className="py-2 px-4 text-right">Total</th>
              </tr>
            </thead>
            </table>
            <div className='max-h-[calc(100vh-380px)] overflow-auto' style={{ scrollbarWidth: "thin" }}>
            <table className='w-full text-[12px] table-auto'>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FB]'}>
                    <td className="py-2 px-4 w-[10%]">{row.itemCode}</td>
                    <td className="py-2 px-4 w-[10%]">{row.description}</td>
                    <td className="py-2 px-4 text-center w-[10%]">{row.brand}</td>
                    <td className="py-2 px-4 w-[10%] text-center">{row.category}</td>
                    <td className="py-2 px-4 text-right w-[9%] pr-8">{row.quantity}</td>
                    <td className="py-2 px-4 text-center w-[12%]">{row.units}</td>
                    <td className="py-2 px-4 text-center w-[11%] pr-10">{row.packSize}</td>
                    <td className="py-2 px-4 text-center w-[5%]">{row.invtValue}</td>
                    <td className="py-2 px-4 text-center w-[12%] pl-14">{row.unitPrice}</td>
                    <td className="py-2 px-4 text-right w-[8%]">{row.tax}</td>
                    <td className="py-2 px-4 text-center w-[10%]">{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          </div>
      </div>
     
      {/*card content for Mobile View*/}
<div className='hidden  below-md:block'>
{tableData.map((row, index) => (
        <>
      <div className='flex justify-between w-full mb-4  '>
     
          {/* Right Panel - Totals */}
          <div className="shadow border rounded-lg w-full gap-3 px-4 flex flex-col py-4 ">
        
          <div className='flex gap-12 px-1'>
        <span className="text-black text-[14px] font-bold">{row.itemCode}</span>
        <span className="text-black text-[16px] font-bold">{row.description}</span>
        </div>
        <hr className='w-full h-[1px] my-2' color='lightgrey'/>
            <div className="flex justify-between">
              <span className="text-[#636363] text-[12px]">Brand</span>
              <span className="text-[#636363] text-[14px]">$8,068.89</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#636363] text-[12px]">Category</span>
              <span className="text-[#636363] text-[14px]">$8,076.39</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#636363] text-[12px]">Quantity</span>
              <span className="text-[#636363] text-[14px]">$1.52</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#636363] text-[12px]">Units</span>
              <span className="text-[#636363] text-[14px]">$1.52</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#636363] text-[12px]">Pack Size</span>
              <span className="text-[#636363] text-[14px]">$0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#636363] text-[12px]">Invt Value</span>
              <span className="text-[#636363] text-[14px]">$0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#636363] text-[12px]">Unit Price</span>
              <span className="text-[#636363] text-[14px]">$0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#636363] text-[12px]">Tax</span>
              <span className="text-[#636363] text-[14px]">$0</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="text-[#636363] text-[14px] font-semibold">Total</span>
              <span className="text-[#636363] text-[14px] font-semibold">$8,079.43</span>
            </div>
           
          </div>
        
        </div>
        </>
      ))}
        </div>

    </main>
  )
}

export default InvoiceDetails
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
     <div className='block below-md:hidden'>
    <div className='flex items-start pt-4 cursor-pointer' onClick={() => window.history.back()}>
          <img src='/images/backArrow.svg' alt='Back Arrow' className='w-8 h-8'/>
          </div>
          </div>
      <div className="flex gap-8 pt-4 pb-4  below-md:flex below-md:flex-col below-md:gap-3">
        
        {/* Left Panel - Invoice Details */}
        <div className="space-y-2 shadow border bg-[#FFFFFF] rounded-lg w-[299px] below-md:w-full p-4 items-start">
          <div className="flex flex-col below-md:flex-row justify-between gap-[4px]">
            <p className="text-[#636363] text-[12px]">Date</p>
            <p className="text-[#636363] text-[13px] font-semibold">2023/01/09</p>
          </div>
          <div className="flex flex-col below-md:flex-row justify-between gap-[4px]">
            <span className="text-[#636363] text-[12px]">Invoice Number</span>
            <span className="text-[#636363] text-[13px] font-semibold">9003185975</span>
          </div>
          <div className="flex  flex-col below-md:flex-row justify-between gap-[4px]">
            <span className="text-[#636363] text-[12px]">Store Name</span>
            <span className="text-[#636363]  text-[13px] font-semibold">13246</span>
          </div>
          <div className="flex flex-col below-md:flex-row justify-between gap-[4px]">
            <span className="text-[12px] text-[#636363]">Due Date</span>
            <span className="text-[13px] text-[#636363] font-semibold">2023/08/30</span>
          </div>
        </div>
        <div className='flex justify-between w-full'>
          {/* Right Panel - Totals */}
          <div className="shadow border rounded-lg w-[369px] bg-[#FFFFFF] below-md:w-full px-4 flex flex-col py-3 gap-3">
            <div className="flex justify-between">
              <span className="text-[#636363] text-[12px]">Product Total</span>
              <span className="text-[#636363] text-[13px] font-semibold">$8,068.89</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#636363] text-[12px]">Sub Total</span>
              <span className="text-[#636363] text-[13px] font-semibold">$8,076.39</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#636363] text-[12px]">Tax 1</span>
              <span className="text-[#636363] text-[13px] font-semibold">$1.52</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#636363] text-[12px]">Tax 2</span>
              <span className="text-[#636363] text-[13px] font-semibold">$1.52</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#636363] text-[12px]">Miscellaneous</span>
              <span className="text-[#636363] text-[13px] font-semibold">$0</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="text-[#636363] text-[14px] font-semibold">Total</span>
              <span className="text-[#636363] text-[14px] font-semibold">$8,079.43</span>
            </div>
          </div>
          {/* <div className='block below-md:hidden'>
          <div className="flex justify-end items-start mb-6 mt-1">
            <button
              onClick={() => window.history.back()}
              className=" py-2 w-[104px] h-[37px] text-[14px] text-[#6F6F6F] bg-[#E4E4E4] rounded-lg"
            >
              Back
            </button>
          </div>
          </div> */}
        </div>


      </div>
      {/*table content*/}
      <div className='bg-white shadow-lg rounded-lg block below-md:hidden'>
        <div className='overflow-x-auto rounded-md '>
          <table className='w-full table-auto border-collapse text-[12px] text-white rounded-md'>
            <thead className='bg-[#334155]'>
              <tr>
                <th className="py-2 px-4 text-left w-[100px]">Item Code</th>
                <th className="py-2 px-4 text-left w-[100px]">Description</th>
                <th className="py-2 px-4 text-center w-[100px]">Brand</th>
                <th className="py-2 px-4 text-left w-[100px]">Category</th>
                <th className="py-2 px-4 text-center w-[100px]">Quantity</th>
                <th className="py-2 px-4 text-center w-[100px]">Units</th>
                <th className="py-2 px-4 text-center w-[100px]">Pack Size</th>
                <th className="py-2 px-4 text-right w-[100px]">Invt Value</th>
                <th className="py-2 px-4 text-right w-[100px]">Unit Price</th>
                <th className="py-2 px-4 text-right w-[100px]">Tax</th>
                <th className="py-2 px-4 text-right w-[100px]">Total</th>
                <th className="w-[8px]">{}</th>
              </tr>
            </thead>
            </table>
            <div className='max-h-[calc(100vh-420px)] rounded-md shadow overflow-auto' style={{ scrollbarWidth: "thin" }}>
            <table className='w-full text-[12px] table-auto shadow rounded-md '>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FB]'}>
                    <td className="py-2 px-4 w-[100px]">{row.itemCode}</td>
                    <td className="py-2 px-4 w-[100px]">{row.description}</td>
                    <td className="py-2 px-4 text-center w-[100px]">{row.brand}</td>
                    <td className="py-2 px-4 text-center w-[100px]">{row.category}</td>
                    <td className="py-2 px-4 text-right pr-8 w-[100px]">{row.quantity}</td>
                    <td className="py-2 px-4 text-center w-[100px] ">{row.units}</td>
                    <td className="py-2 px-4 text-center w-[100px] ">{row.packSize}</td>
                    <td className="py-2 px-4 text-right w-[100px]">{row.invtValue}</td>
                    <td className="py-2 px-4 text-right  w-[100px]">{row.unitPrice}</td>
                    <td className="py-2 px-4 text-right w-[100px]">{row.tax}</td>
                    <td className="py-2 px-4 text-right w-[100px]">{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          </div>
      </div>
     
      {/*card content for Mobile View*/}
<div className='hidden  below-md:block'>
{tableData?.map((items, index) => (
       <React.Fragment key={index}>
      <div className='flex justify-between w-full mb-4  '>
     
          {/* Right Panel - Totals */}
          <div className="shadow border rounded-lg w-full gap-3 px-4 flex flex-col py-4 ">
        
          <div className='flex gap-12 px-1'>
        <span className="text-black text-[14px] font-bold">{items?.itemCode}</span>
        <span className="text-black text-[16px] font-bold">{items?.description}</span>
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
        </React.Fragment>
      ))}
        </div>

    </main>
  )
}

export default InvoiceDetails
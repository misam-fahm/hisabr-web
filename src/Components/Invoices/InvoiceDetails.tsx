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
      className="max-h-[calc(100vh-50px)] px-5 py-3  overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <div className="flex gap-8 pt-2 pb-5 ">
        {/* Left Panel - Invoice Details */}
        <div className="space-y-2 shadow border rounded-lg w-[299px] p-4 items-start">
          <div className="flex flex-col justify-between gap-[4px]">
            <p className="text-[#636363] text-[12px]">Date</p>
            <p className="text-[#636363] text-[14px]">2023/01/09</p>
          </div>
          <div className="flex flex-col justify-between gap-[4px]">
            <span className="text-[#636363] text-[12px]">Invoice Number</span>
            <span className="text-[#636363] text-[14px]">9003185975</span>
          </div>
          <div className="flex  flex-col justify-between gap-[4px]">
            <span className="text-[#636363] text-[12px]">Store Name</span>
            <span className="text-[#636363]  text-[14px]">13246</span>
          </div>
          <div className="flex flex-col justify-between gap-[4px]">
            <span className="text-[12px] text-[#636363]">Due Date</span>
            <span className="text-[14px] text-[#636363]">2023/08/30</span>
          </div>
        </div>
        <div className='flex justify-between w-full'>
          {/* Right Panel - Totals */}
          <div className="shadow border rounded-lg w-[369px] px-4 flex flex-col py-3 gap-3">
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
          <div className="flex justify-end items-start mb-6 mt-1">
            <button
              onClick={() => window.history.back()}
              className=" py-2 w-[104px] h-[37px] text-[14px] text-[#6F6F6F] bg-[#E4E4E4] rounded-lg"
            >
              Back
            </button>
          </div>
        </div>


      </div>
      {/*table content*/}
      <div className='bg-white shadow-lg rounded-lg'>
        <div className='overflow-x-auto'>
          <table className='w-full table-auto border-collapse text-[12px] text-white'>
            <thead className='bg-[#334155]'>
              <tr>
                <th className="py-2 px-4 text-left w-[10%]">Item Code</th>
                <th className="py-2 px-4 text-left  w-[10%]">Description</th>
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
            <div className='h-[180px] overflow-auto' style={{ scrollbarWidth: "thin" }}>
            <table className='w-full text-[12px] table-auto'>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FB]'}>
                    <td className="py-2 px-4 w-[10%]">{row.itemCode}</td>
                    <td className="py-2 px-4 w-[22%]">{row.description}</td>
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
      {/* Pagination Numbers */}
      {/* <div className="mt-4 flex gap-2 justify-between items-center">
        {/* Page Range Display */}
        {/* <div>
          <span className="text-[#8899A8] text-[12px] font-medium ml-3">
            {startItem} - {endItem} of {totalItems}
          </span>
        </div> */} 

        {/* Pagination Numbers */}
        {/* <div className="flex flex-row gap-3">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 bg-[#EBEFF6] text-gray-700 rounded-md disabled:opacity-50"
            style={{ background: "#EBEFF6" }}
          >
            <img src="/images/left.svg" />
          </button> */}

          {/* {Array.from({ length: table.getPageCount() }, (_, index) => {
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
          })} */}

          {/* <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2 bg-[gray-200] text-gray-700 rounded-md disabled:opacity-50"
            style={{ background: "#EBEFF6" }}
          >
            <img src="/images/right.svg" />
          </button> */}

          {/* <div>
            <div className="w-full">
              {/* Dropdown for Page Selection */}
              {/* <select
                value={table.getState().pagination.pageIndex} // Sync with current page index
                onChange={(e) => table.setPageIndex(Number(e.target.value))} // Update page on selection
                className=" pl-3 pr-8 py-[10px] rounded-md text-[12px] border-2 bg-[#f7f8f9] cursor-pointer border-[#D8D8DB6E] text-[#637381]"
              > */}
                {/* {Array.from(
                  { length: table.getPageCount() },
                  (_, index) => (
                    <option key={index} value={index}>
                      Page {index + 1}
                    </option>
                  )
                )} */}
              {/* </select>
            </div>
          </div>
        </div>
      </div>  */}




    </main>
  )
}

export default InvoiceDetails
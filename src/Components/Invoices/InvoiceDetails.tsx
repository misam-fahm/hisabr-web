'use client';
import React from 'react'

const InvoiceDetails = () => {
  // const summaryData = {
  //   date: '2022/01/01',
  //   invoiceNumber: '9001389575',
  //   storeName: '13246',
  //   dueDate: '2023/08/30',
  //   productTotal: '8,068.89',
  //   subTotal: '8,076.39',
  //   tax1: '1.52',
  //   tax2: '1.52',
  //   miscellaneous: '0',
  //   total: '8,079.43',
  // };
  const tableData = [
    {
      itemCode: '67452', description: 'Cheese Amer Shrp 160C', brand: 'Dairy', category: 'DY', quantity: 2, units: 'CS',
      packSize: '4*2 LB', invtValue: '11.56', unitPrice: '46.30', tax: '-', total: '46.30'
    },
    {
      itemCode: '67452', description: 'Cheese Amer Shrp 160C', brand: 'Dairy', category: 'DY', quantity: 2, units: 'CS',
      packSize: '4*2 LB', invtValue: '11.56', unitPrice: '46.30', tax: '-', total: '46.30'
    },
    {
      itemCode: '67452', description: 'Cheese Amer Shrp 160C', brand: 'Dairy', category: 'DY', quantity: 2, units: 'CS',
      packSize: '4*2 LB', invtValue: '11.56', unitPrice: '46.30', tax: '-', total: '46.30'
    },
    {
      itemCode: '67452', description: 'Cheese Amer Shrp 160C', brand: 'Dairy', category: 'DY', quantity: 2, units: 'CS',
      packSize: '4*2 LB', invtValue: '11.56', unitPrice: '46.30', tax: '-', total: '46.30'
    },
    {
      itemCode: '67452', description: 'Cheese Amer Shrp 160C', brand: 'Dairy', category: 'DY', quantity: 2, units: 'CS',
      packSize: '4*2 LB', invtValue: '11.56', unitPrice: '46.30', tax: '-', total: '46.30'
    },
    {
      itemCode: '67452', description: 'Cheese Amer Shrp 160C', brand: 'Dairy', category: 'DY', quantity: 2, units: 'CS',
      packSize: '4*2 LB', invtValue: '11.56', unitPrice: '46.30', tax: '-', total: '46.30'
    },

  ]
  return (
    <main className="px-6">
      
      <div className="flex gap-8 py-6">
        {/* Left Panel - Invoice Details */}
        <div className="space-y-2 shadow-lg rounded-lg w-[299px] p-4 items-start">
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
        <div className="shadow-lg rounded-lg w-[369px] px-4 flex flex-col py-3 gap-3">
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
            className=" py-2 w-[104px] h-[37px] text-[14px] text-[#6F6F6F] bg-[#C8C8C8] rounded-lg"
          >
            Back
          </button>
        </div>
        </div>

        
      </div>
      {/*table content*/}
      <div className='bg-white shadow-lg rounded-lg'>
        <div className='overflow-x-auto' >
          <table className='w-full table-auto border-collapse text-[12px] text-white'>
            <thead className='bg-[#334155]'>
              <tr>
                <th className="py-2 px-4 text-left w-[10%]">Item Code</th>
                <th className="py-2 px-4 text-left break-words whitespace-normal w-[10%]">Description</th>
                <th className="py-2 px-4 text-center">Brand</th>
                <th className="py-2 px-4 text-left w-[10%]">Category</th>
                <th className="py-2 px-4 text-center w-[6%]">Quantity</th>
                <th className="py-2 px-4 text-right">Units</th>
                <th className="py-2 px-4 text-rightw">Pack Size</th>
                <th className="py-2 px-4 text-right">Invt Value</th>
                <th className="py-2 px-4 text-right">Unit Price</th>
                <th className="py-2 px-4 text-right">Tax</th>
                <th className="py-2 px-4 text-right">Total</th>
              </tr>
            </thead>
          </table>

          <div className='min-h-[180px] overflow-auto' style={{ scrollbarWidth: "thin" }}>
            <table className='w-full text-[12px] table-auto'>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FB]'}>
                    <td className="py-2 px-4 w-[10%]">{row.itemCode}</td>
                    <td className="py-2 px-4 w-[10%]">{row.description}</td>
                    <td className="py-2 px-4 text-center w-[10%]">{row.brand}</td>
                    <td className="py-2 px-4 w-[10%] text-center">{row.category}</td>
                    <td className="py-2 px-4 text-right w-[9%]">{row.quantity}</td>
                    <td className="py-2 px-4 text-center w-[12%]">{row.units}</td>
                    <td className="py-2 px-4 text-center w-[12%]">{row.packSize}</td>
                    <td className="py-2 px-4 text-center w-[12%]">{row.invtValue}</td>
                    <td className="py-2 px-4 text-center w-[12%]">{row.unitPrice}</td>
                    <td className="py-2 px-4 text-right w-[8%]">{row.tax}</td>
                    <td className="py-2 px-4 text-center w-[10%]">{row.total}</td>
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

export default InvoiceDetails
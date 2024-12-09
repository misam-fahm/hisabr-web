'use client';
import React from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";

interface TableRow {
  itemCode: string;
  description: string;
  brand: string;
  category: string;
  quantity: number;
  units: string;
  packSize: string;
  invtValue: number;
  unitPrice: number;
  tax: string;
  total: string;
}



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
const data: TableRow[] = [
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
const columns: ColumnDef<TableRow>[] = [
  {
    accessorKey: "itemCode",
    header: "ItemCode",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "units",
    header: "Units",
  },
  {
    accessorKey: "packSize",
    header: "PackSize",
  },
  {
    accessorKey: "invtValue",
    header: "InvtValue",
  },
  {
    accessorKey: "unitPrice",
    header: "UnitPrice",
  },
  {
    accessorKey: "total",
    header: "Total",
  },

];
const InvoiceDetails = () => {
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
            <thead className='bg-[#334155]' >
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-left px-4 py-3 text-[#FFFFFF] font-medium text-[14px]"
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
                      className="px-4 py-1 text-[#636363] text-[12px]"
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




    </main>
  )
}

export default InvoiceDetails
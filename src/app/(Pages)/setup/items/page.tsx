// "use client";

// import React, { useState } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// import AddCategories from "@/Components/Setup/AddCategories";
// import AddNewItems from "@/Components/Setup/AddNewItems";

// const page = () => {
//   const data = [
//     {
//       name: "Milk Packet",
//       category: "Dairy",
//       price: "2 %",
//       quantity: 100,
//       weight: "1 litre",

//       imgSrc: "/images/edit.svg",
//       imgsrc: "/images/delete.svg",
//     },
//     {
//       name: "Bread Loaf",
//       category: " Bakery",
//       price: "1.5 %",
//       quantity: 100,
//       weight: "300 gm",

//       imgSrc: "/images/edit.svg",
//       imgsrc: "/images/delete.svg",
//     },
//     {
//       name: "Butter Stick",
//       category: "Dairy  ",
//       price: "3 %",
//       quantity: 100,
//       weight: "100 gm",

//       imgSrc: "/images/edit.svg",
//       imgsrc: "/images/delete.svg",
//     },
//     {
//       name: "Chocolate ",
//       category: " Bakery",
//       price: "3.5 %",
//       quantity: 100,
//       weight: "200 gm",

//       imgSrc: "/images/edit.svg",
//       imgsrc: "/images/delete.svg",
//     },
//     {
//       name: "Cheese Block",
//       category: "Dairy",
//       price: "10 %",
//       quantity: 100,
//       weight: "1 litre",

//       imgSrc: "/images/edit.svg",
//       imgsrc: "/images/delete.svg",
//     },
//     {
//       name: "Chocolate",
//       category: " Bakery",
//       price: "12 %",
//       quantity: 100,
//       weight: "300 gm",

//       imgSrc: "/images/edit.svg",
//       imgsrc: "/images/delete.svg",
//     },
//     {
//       name: "Cheese Block",
//       category: "Dairy",
//       price: "2.5 %",
//       quantity: 100,
//       weight: "1 litre",

//       imgSrc: "/images/edit.svg",
//       imgsrc: "/images/delete.svg",
//     },
//     {
//       name: "Milk Packet",
//       category: " Bakery",
//       price: "6.2 %",
//       quantity: 100,
//       weight: "300 gm",
//       imgSrc: "/images/edit.svg",
//       imgsrc: "/images/delete.svg",
//     },
//   ];
//   const [dateRange, setDateRange] = useState<
//     [Date | undefined, Date | undefined]
//   >([undefined, undefined]); // From and To Date
//   const [startDate, endDate] = dateRange;
//   const [isOpen, setIsOpen] = useState(false); //control pop up vivibility
//   const togglePopup = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <main className="px-6 mt-20">
//       <>
//         <div className="flex flex-col mb-5">
//           <div className="flex justify-between">
//             <p className="font-bold text-[16px]">Items</p>
//             <div className="fle space-x-4">
//               <button className="font-semibold text-[14px] bg-[#1AA47D] hover:bg-[#168A68] px-5 h-[37px] text-[#FFFFFF] rounded-md">
//                 {/* Add New Item */}
//                 <AddNewItems />
//               </button>

//               <button className="font-semibold text-[14px] bg-[#1AA47D] px-6 hover:bg-[#168A68]  h-[37px] text-[#FFFFFF] rounded-md">
//                 <AddCategories />
//               </button>
//             </div>
//           </div>
//         </div>
//         {/* Items Table */}
//         <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//           <div className="w-full">
//             <table className="w-full border-collapse text-[12px] text-white">
//               <thead className="bg-[#334155]">
//                 <tr>
//                   <th className="py-3 px-4 text-[15px] text-left text-xs font-medium text-[#FFFFFF] tracking-wider w-[20%]">
//                     {" "}
//                     Name
//                   </th>
//                   <th className="py-3 px-3 text-[15px] text-left text-xs font-medium text-[#FFFFFF] tracking-wider w-[15%]">
//                     Category
//                   </th>
//                   <th className="py-3 px-3 text-[15px] text-left text-xs font-medium text-[#FFFFFF] tracking-wider w-[15%]">
//                     Price
//                   </th>
//                   <th className="py-3 px-2 text-[15px] text-left text-xs font-medium text-[#FFFFFF] tracking-wider w-[15%]">
//                     Quantity
//                   </th>
//                   <th className="py-3 px-2 text-[15px] text-left text-xs font-medium text-[#FFFFFF] tracking-wider w-[15%]">
//                     Weight
//                   </th>
//                   <th className="py-3 px-2 text-left text-[15px] text-xs font-medium text-[#FFFFFF] tracking-wider w-[10%]">
//                     Edit
//                   </th>
//                   <th className="py-3 px-2 text-left text-[15px] text-xs font-medium text-[#FFFFFF] tracking-wider w-[10%]">
//                     Delete
//                   </th>
//                 </tr>
//               </thead>
//             </table>

//             <div
//               className="h-[340px] overflow-auto"
//               style={{ scrollbarWidth: "thin" }}
//             >
//               <table className="min-w-full ">
//                 <tbody>
//                   {data.map((item, index) => (
//                     <tr key={index} className="border-b border-gray-300">
//                       <td className="py-3 px-4 text-sm text-left text-[#636363] w-[20%]">
//                         {item.name}
//                       </td>
//                       <td className="py-3 px-4 text-sm text-left text-[#636363] w-[15%]">
//                         {item.category}
//                       </td>
//                       <td className="py-3 px-4 text-left text-sm text-[#636363] w-[15%]">
//                         {item.price}
//                       </td>
//                       <td className="py-3 px-4 text-left text-sm text-[#636363] w-[15%]">
//                         {item.quantity}
//                       </td>
//                       <td className="py-3 px-4 text-left text-sm text-[#636363] w-[15%]">
//                         {item.weight}
//                       </td>
//                       <td className="py-1 px-4 text-sm text-center text-[#636363] w-[10%]">
//                         <img
//                           src={item.imgSrc}
//                           alt="Edit"
//                         />
//                       </td>
//                       <td className="py-1 px-4 text-sm text-center text-[#636363] w-[10%]">
//                         <img
//                           src={item.imgsrc}
//                           alt="Delete"
                          
//                         />
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </>
//     </main>
//   );
// };

// export default page;



"use client";
import React, { FC, useState } from "react";
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

import AddNewItems from "@/Components/Setup/AddNewItems";
import AddCategories from "@/Components/Setup/AddCategories";

interface TableRow {
  name: string;
  category:string;
  price: number;
  quantity:number;
  weight:string;
}

const data: TableRow[] = [
  {
    name: "Milk Packet",
    category: "Dairy",
    price: 80,
    quantity: 100,
    weight: "1 litre",

    
  },
  {
    name: "Bread Loaf",
    category: " Bakery",
    price: 100,
    quantity: 100,
    weight: "300 gm",

  },
  {
    name: "Butter Stick",
    category: "Dairy  ",
    price: 60,
    quantity: 100,
    weight: "100 gm",

    
  },
  {
    name: "Chocolate ",
    category: " Bakery",
    price: 120,
    quantity: 100,
    weight: "200 gm",

  
  },
  {
    name: "Cheese Block",
    category: "Dairy",
    price: 800,
    quantity: 100,
    weight: "1 litre",

  
  },
  {
    name: "Chocolate",
    category: " Bakery",
    price: 300,
    quantity: 100,
    weight: "300 gm",

 
  },
  {
    name: "Cheese Block",
    category: "Dairy",
    price: 250,
    quantity: 100,
    weight: "1 litre",

  },
  {
    name: "Milk Packet",
    category: " Bakery",
    price: 320,
    quantity: 100,
    weight: "300 gm",
    
  },
];

const columns: ColumnDef<TableRow>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "weight",
    header: "Weight",
  },

  {
    accessorKey: "edit",
    header: "Edit",
    cell: () => (
      <Image src="/images/edit.svg" alt="edit" width={35} height={35} />
    ),
  },

  {
    id: "delete",
    header: "Delete",
    cell: () => (
      <Image src="/images/delete.svg" alt="delete" width={35} height={35} />
    ),
  },
];
const Page: FC = () => {
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
        pageSize: 6,
        pageIndex: 0,
      },
    },
  });

  const { pageIndex, pageSize } = table.getState().pagination;
  const totalItems = table.getFilteredRowModel().rows.length;
  const startItem = pageIndex * pageSize + 1;
  const endItem = Math.min((pageIndex + 1) * pageSize, totalItems);

  return (
    <main
    className="max-h-[calc(100vh-10px)] overflow-auto"
    style={{ scrollbarWidth: "thin" }}>
      <div className="my-24  mx-6 below-md:my-24">
        <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center mt-4 mb-4 gap-4">
          <div>
            <p className="text-[16px] font-bold text-[#334155]">
              Items
            </p>
          </div>
          <div className="flex flex-row gap-2 ">
            <AddNewItems />

            <AddCategories />
          </div>
        </div>

        <div>
          {/* Table */}
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-[#334155]">
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

          {/* Pagination */}
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
                    className={`px-4 py-2 rounded-md text-[12px] ${
                      table.getState().pagination.pageIndex === pageIndex
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
        </div>
      </div>
    </main>
  );
};
export default Page;

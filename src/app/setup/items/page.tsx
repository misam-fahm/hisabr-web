"use client";

import Image from "next/image";

import React, { FC, useEffect, useState } from "react";
import DateRangePicker from "@/Components/ui/Common/DateRangePicker";
import { sendApiRequest } from "@/utils/apiUtils";
import ToastNotification, {
  ToastNotificationProps,
} from "@/Components/ui/ToastNotification/ToastNotification";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
import Pagination from "@/Components/ui/Common/Pagination";
import DeleteItems from "@/Components/Setup/DeleteItems";
import EditItem from "@/Components/Setup/EditItem";

interface TableRow {
  name: string;
  category: string;
  price: number;
  quantity: number;
  weight: string;
}

// const data: TableRow[] = [
//   {
//     name: "Milk Packet",
//     category: "Dairy",
//     price: 80,
//     quantity: 100,
//     weight: "1 litre",
//   },
//   {
//     name: "Bread Loaf",
//     category: " Bakery",
//     price: 100,
//     quantity: 100,
//     weight: "300 gm",
//   },
//   {
//     name: "Butter Stick",
//     category: "Dairy  ",
//     price: 60,
//     quantity: 100,
//     weight: "100 gm",
//   },
//   {
//     name: "Chocolate ",
//     category: " Bakery",
//     price: 120,
//     quantity: 100,
//     weight: "200 gm",
//   },
//   {
//     name: "Chocolate ",
//     category: " Bakery",
//     price: 120,
//     quantity: 100,
//     weight: "200 gm",
//   },
//   {
//     name: "Chocolate ",
//     category: " Bakery",
//     price: 120,
//     quantity: 100,
//     weight: "200 gm",
//   },
//   {
//     name: "Chocolate ",
//     category: " Bakery",
//     price: 120,
//     quantity: 100,
//     weight: "200 gm",
//   },
//   {
//     name: "Cheese Block",
//     category: "Dairy",
//     price: 250,
//     quantity: 100,
//     weight: "1 litre",
//   },
//   {
//     name: "Milk Packet",
//     category: " Bakery",
//     price: 320,
//     quantity: 100,
//     weight: "300 gm",
//   },
//   {
//     name: "Chocolate ",
//     category: " Bakery",
//     price: 120,
//     quantity: 100,
//     weight: "200 gm",
//   },
//   {
//     name: "Cheese Block",
//     category: "Dairy",
//     price: 800,
//     quantity: 100,
//     weight: "1 litre",
//   },
//   {
//     name: "Chocolate",
//     category: " Bakery",
//     price: 300,
//     quantity: 100,
//     weight: "300 gm",
//   },
//   {
//     name: "Cheese Block",
//     category: "Dairy",
//     price: 250,
//     quantity: 100,
//     weight: "1 litre",
//   },
//   {
//     name: "Milk Packet",
//     category: " Bakery",
//     price: 320,
//     quantity: 100,
//     weight: "300 gm",
//   },
// ];

const columns: ColumnDef<any>[] = [
  {
    accessorKey: "name",
    header: () => <div className="text-left">Name</div>,
    cell: (info) => <span>{info.getValue() as string}</span>,

    size: 160,
  },
  {
    accessorKey: "category",
    header: () => <div className="text-left">Category</div>,
    cell: (info) => <span>{info.getValue() as string}</span>,

    size: 120,
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: (info) => (
      <div className="text-right">{info.getValue() as number}</div>
    ),

    size: 100,
  },
  {
    accessorKey: "quantity",
    header: () => <div className="text-right">Quantity</div>,
    cell: (info) => (
      <div className="text-right">{info.getValue() as string}</div>
    ),

    size: 120,
  },
  {
    accessorKey: "weight",
    header: () => <div className="text-left ml-12">Weight</div>,
    cell: (info) => (
      <div className="text-left ml-14">{info.getValue() as string}</div>
    ),

    size: 150,
  },
  {
    id: "edit",
    header: () => <div className="text-center">Edit</div>,
    cell: () => (
      <span className="flex justify-center">
        <EditItem />
      </span>
    ),

    size: 50,
  },
  {
    id: "delete",
    header: () => <div className="text-center">Delete</div>,
    cell: () => (
      <span className="flex justify-center">
        <DeleteItems />
      </span>
    ),

    size: 60,
  },
];

const Page: FC = () => {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [data, setData] = useState<TableRow[]>([]); // Data state for table rows
  const [totalItems, setTotalItems] = useState<number>(0); // Total number of items from the API
  const [loading, setLoading] = useState<boolean>(true);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });

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

  const { pageIndex, pageSize } = table.getState().pagination;
  // const totalItems = table.getFilteredRowModel().rows.length;
  const startItem = pageIndex * pageSize + 1;
  const endItem = Math.min((pageIndex + 1) * pageSize, totalItems);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response: any = await sendApiRequest({
          mode: "getitems",
          page: table.getState().pagination.pageIndex + 1,
          limit: table.getState().pagination.pageSize,
        });

        if (response?.status === 200) {
          setData(response?.data?.categories || []);
          response?.data?.total > 0 &&
            setTotalItems(response?.data?.total || 0);
        } else {
          setCustomToast({
            ...customToast,
            message: response?.message,
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pageIndex, pageSize]);

  return (
    <main
      className="max-h-[calc(100vh-60px)] px-6 below-md:px-3 below-md:py-4 overflow-auto "
      style={{ scrollbarWidth: "thin" }}
    >
      <ToastNotification
        message={customToast.message}
        type={customToast.type}
      />
      <div className="flex flex-row justify-end gap-2 below-md:hidden my-6">
        <AddNewItems />
        <AddCategories />
      </div>

      <div className="overflow-hidden max-w-full ">
        {/* Mobile view */}
        <div
          className="block md:hidden"
          style={{
            maxHeight: "calc(100vh - 80px)",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch", // Enables smooth scrolling on mobile
            scrollbarWidth: "none", // Hide scrollbar
          }}
        >
          {table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className={`border border-gray-200 p-5 bg-white rounded-lg mb-3`}
            >
              <div className="flex justify-between items-center">
                {/* Name */}
                <span className="font-bold text-[14px] text-[#334155]">
                  {row.getValue("name")}
                </span>
                <div className="flex items-center">
                  <>
                    <EditItem />
                  </>
                  {/* Delete */}
                  <>
                    <DeleteItems />
                  </>
                </div>
              </div>

              {/* Border */}
              <div className=" border-b bg-gray-200 my-3"></div>

              {/* Category */}
              <div className="flex justify-between">
                <span className=" text-[#636363] text-[13px] mb-2">
                  Category
                </span>{" "}
                <span className="text-[14px]">{row.getValue("category")}</span>
              </div>

              {/* Price */}
              <div className="mt-1 flex justify-between">
                <span className=" text-[#636363] text-[13px] mb-2">Price</span>{" "}
                <span className="text-[14px]">{row.getValue("price")}</span>
              </div>
              {/* Quantity */}
              <div className=" mt-1 flex justify-between">
                <span className=" text-[#636363] text-[13px] mb-2">
                  Quantity
                </span>{" "}
                <span className="text-[14px]">{row.getValue("quantity")}</span>
              </div>
              {/* Weight */}
              <div className=" mt-1 flex justify-between">
                <span className=" text-[#636363] text-[13px] mb-2">Weight</span>{" "}
                <span className="text-[14px]">{row.getValue("weight")}</span>
              </div>
            </div>
          ))}
          {/* Add NewItems bottom */}
          <div className=" fixed bottom-[20px] below-lg:hidden right-3">
            <AddNewItems />
          </div>
        </div>

        {/* Desktop View */}
        <div className="overflow-x-auto shadow-md border-collapse border border-gray-200 rounded-lg  hidden flex-col md:block">
          <div className="overflow-hidden max-w-full">
            <table className="w-full  table-fixed">
              <thead className="bg-[#334155] sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="text-left px-4 py-2 text-[#FFFFFF] font-normal text-[15px] w-[100px]"
                        style={{ width: `${header.column.getSize()}px` }} // Applying dynamic width
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

            <div
              className="w-full overflow-y-auto scrollbar-thin flex-grow"
              style={{ maxHeight: "calc(100vh - 270px)" }}
            >
              <table className="w-full table-fixed">
                <tbody>
                  {loading
                    ? Array.from({ length: 10 }).map((_, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"
                          }
                        >
                          {columns.map((column, colIndex) => (
                            <td
                              key={colIndex}
                              className="px-4 py-1.5"
                              style={{ width: `${column.size}px` }}
                            >
                              <Skeleton height={30} />
                            </td>
                          ))}
                        </tr>
                      ))
                    : table.getRowModel().rows.map((row) => (
                        <tr
                          key={row.id}
                          className={
                            row.index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"
                          }
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className="px-4 py-1.5 text-[#636363] text-[14px]"
                              style={{ width: `${cell.column.getSize()}px` }} // Apply width to cells
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
      </div>

      <div className="mt-4   below-md:hidden">
        {/* Page Range Display */}
        {/* <div>
            <span className="text-[#8899A8] text-[12px] font-medium ml-3">
              {startItem} - {endItem} of {totalItems}
            </span>
          </div> */}

        <Pagination table={table} totalItems={0} />
      </div>
    </main>
  );
};
export default Page;

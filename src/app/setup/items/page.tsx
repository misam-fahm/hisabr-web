"use client";
import React, { FC, useEffect, useState } from "react";
import { sendApiRequest } from "@/utils/apiUtils";
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

import AddNewItems from "@/Components/Setup/ItemsPopup/AddNewItems";
import AddCategories from "@/Components/Setup/CategoriesPopup/AddCategories";
import Pagination from "@/Components/UI/Pagination/Pagination";
import DeleteItems from "@/Components/Setup/ItemsPopup/DeleteItems";
import EditItem from "@/Components/Setup/ItemsPopup/EditItem";
import ToastNotification, { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";
import DeletePopup from "@/Components/UI/Delete/DeletePopup";

interface TableRow {
  itemname: string;
  categoryname: string;
  packsize: number;
  units: number;
  weight: string;
  itemid?: number;
  categoryid?: number;
}

const Page: FC = () => {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [data, setData] = useState<TableRow[]>([]); // Data state for table rows
  const [totalItems, setTotalItems] = useState<number>(0); // Total number of items from the API
  const [loading, setLoading] = useState<boolean>(true);
  const [isOpenAddItems, setAddItems] = useState(false);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });
  
  const columns: ColumnDef<TableRow>[] = [
    {
      accessorKey: "itemname",
      header: () => <div className="text-left">Name</div>,
      cell: (info) => <span>{info.getValue() as string}</span>,
      size: 160,
    },
    {
      accessorKey: "categoryname",
      header: () => <div className="text-left">Category</div>,
      cell: (info) => <span>{info.getValue() as string}</span>,
      size: 120,
    },
    {
      accessorKey: "packsize",
      header: () => <div className="text-right">Pack Size</div>,
      cell: (info) => (
        <div className="text-right">{info.getValue() as number}</div>
      ),
      size: 100,
    },
    {
      accessorKey: "units",
      header: () => <div className="text-right">Units</div>,
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
      size: 120,
    },
    {
      id: "edit",
      header: () => <div className="text-center"></div>,
      cell: (info) => (
        <span className="flex justify-center">
          <EditItem rowData={info.row.original} setAddItems={setAddItems} />
        </span>
      ),
      size: 50,
    },
    {
      id: "delete",
      header: () => <div className="text-center"></div>,
      cell: (info) => (
        <span className="flex justify-center">
         <DeletePopup message={"Item"} jsonData={ {mode: "deleteitem",itemid:Number(info.row.original.itemid)}} setUpdatedData={setAddItems} />
        </span>
      ),
      size: 50,
    },
  ];

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
    manualPagination: true, // Enable manual pagination
    pageCount: Math.ceil(totalItems / 10),
  });

  const { pageIndex, pageSize } = table.getState().pagination;
  // const totalItems = table.getFilteredRowModel().rows.length;

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
          setData(response?.data?.items || []);
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
        setAddItems(false)
      }
    };

    fetchData();
  }, [pageIndex, pageSize , isOpenAddItems]);

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
        <AddNewItems setAddItems={setAddItems} />
        {/* <AddCategories /> */}
      </div>
      <div className="overflow-hidden max-w-full">
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
          {data && data?.length > 0 ? (
            data?.map((row) => (
            <div
              key={row?.itemid}
              className={`border border-gray-200 p-5 bg-white rounded-lg mb-3`}
            >
              <div className="flex justify-between items-center">
                {/* Name */}
                <span className="font-bold text-[14px] text-[#334155]">
                  {row?.itemname}
                </span>
                <div className="flex items-center gap-4">
                  <>
                    <EditItem rowData={row} setAddItems={setAddItems} />
                  </>
                  {/* Delete */}
                  <>
                  <DeletePopup message={"Item"} jsonData={ {mode: "deleteitem",itemid:Number(row.itemid)}} setUpdatedData={setAddItems} />
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
                <span className="text-[14px]">{row?.categoryname}</span>
              </div>
              {/* Price */}
              <div className="mt-1 flex justify-between">
                <span className=" text-[#636363] text-[13px] mb-2">Price</span>{" "}
                <span className="text-[14px]">{row?.packsize}</span>
              </div>
              {/* Quantity */}
              <div className=" mt-1 flex justify-between">
                <span className=" text-[#636363] text-[13px] mb-2">
                  Quantity
                </span>{" "}
                <span className="text-[14px]">{row?.units}</span>
              </div>
              {/* Weight */}
              <div className=" mt-1 flex justify-between">
                <span className=" text-[#636363] text-[13px] mb-2">Weight</span>{" "}
                <span className="text-[14px]">{row?.weight}</span>
              </div>
            </div>
          ))) : (
            <div>No data available</div>)}
          {/* Add NewItems bottom */}
          <div className=" block pl-24">
            <AddNewItems setAddItems={setAddItems} />
          </div>
          <div className="hidden below-md:block ">
          <Pagination table={table} totalItems={totalItems} />
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
                    : data && data.length > 0 ? (
                      table.getRowModel().rows.map((row) => (
                        <tr
                          key={row?.id}
                          className={
                            row.index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"
                          }
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell?.id}
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
                      ))
                    ) : (
                      <tr>
                        <td>No data available</td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 below-md:hidden">
        <Pagination table={table} totalItems={totalItems} />
      </div>
    </main>
  );
};
export default Page;

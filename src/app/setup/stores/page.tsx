"use client";
import React, { FC, useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import AddStore from "@/Components/Setup/StorePopup/AddStore";
import EditStore from "@/Components/Setup/StorePopup/EditStore";
import { format } from "date-fns";
import Pagination from "@/Components/UI/Pagination/Pagination";
import { sendApiRequest } from "@/utils/apiUtils";
import { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface TableRow {
  storename: string;
  createdate: string;
  location: string;
  owner: string;
  county: string;
  royalty: string;
}

const Page: FC = () => {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [data, setData] = useState<TableRow[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0); 
  const [loading, setLoading] = useState<boolean>(true);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });
  const [isOpenAddStore, setopenAddStore] = useState(false);

  const columns: ColumnDef<TableRow>[] = [
    {
      accessorKey: "store",
      header: () => <div className="text-left">Store</div>,
      cell: (info) => {
        const storeName = info.row.original.storename as string;
        return (
          <span>
            {storeName?.length > 23 ? storeName.substring(0, 20) + "..." : storeName}
          </span>
        );
      },
      size: 100,
    },
    
    {
      accessorKey: "date",
      header: () => <div className="text-left">Date</div>,
      cell: (info) => {
        const rawDate = info.row.original.createdate;
        const validDate = rawDate ? new Date(rawDate) : null;
      
        return (
          <span>
            {validDate && !isNaN(validDate.getTime())
              ? format(validDate, "MM-dd-yyyy")
              : ""}
          </span>
        );
      },
      size: 100,
    },
  
    {
      accessorKey: "location",
      header: () => <div className="text-left">Location</div>,
      cell: (info) => {
        const location = info.row.original.location as string;
        return (
          <div>
            {location?.length > 23 ? location.substring(0, 20) + "..." : location}
          </div>
        );
      },
      size: 120,
    },
    
    {
      accessorKey: "user",
      header: () => <div className="text-left">Owner</div>,
      cell: (info) => {
        const owner = info.row.original.owner as string;
        return (
          <div>
            {owner?.length > 23 ? owner.substring(0, 20) + "..." : owner}
          </div>
        );
      },
      size: 100,
    },
    
    {
      accessorKey: "county",
      header: () => <div className="text-right ">County</div>,
      cell: (info) => (
        <div className="text-right ">{info.row.original.county}</div>
      ),
      size: 100,
    },
    {
      accessorKey: "royalty",
      header: () => <div className="text-right">Royalty</div>,
      cell: (info) => <div className=" text-right ">{info.row.original.royalty}</div>,
      size: 80,
    },
    {
      id: "edit",
      header: () => <div className="text-center"></div>,
      cell: (info) => (
        <span className="flex justify-center">
          <EditStore initialData = {info.row.original} isOpenAddStore={isOpenAddStore} setAddStore={setopenAddStore} />
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
  const startItem = pageIndex * pageSize + 1;
  const endItem = Math.min((pageIndex + 1) * pageSize, totalItems);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response: any = await sendApiRequest({
        mode: "getstores",
        page: table.getState().pagination.pageIndex + 1,
        limit: table.getState().pagination.pageSize,
      });

      if (response?.status === 200) {
        setData(response?.data?.stores || []);
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
       setopenAddStore(false)
    }
  };

  
  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize , isOpenAddStore]);


  return (
    <main
      className="max-h-[calc(100vh-60px)] px-6 below-md:px-3  below-md:py-4 overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <div className="flex flex-row justify-end gap-2 below-md:hidden my-6">
        <AddStore setAddStore={setopenAddStore} />
      </div>

      {/* Mobile View */}
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
            className={`border border-gray-200 p-5 bg-white rounded-lg mb-2`}
          >
            <div className="flex justify-between items-center">
              {/* Name */}
              <span className="font-bold text-[14px] text-[#334155]">
                {row.getValue("store")}
              </span>
              <div className="flex items-center gap-3">
                {/* Edit */}
                <EditStore initialData = {row.original} isOpenAddStore={isOpenAddStore} setAddStore={setopenAddStore} />
              </div>
            </div>

            {/* Border */}
            <div className=" border-b bg-gray-200 my-3"></div>
            <div className="text-[14px] mt-1 flex justify-between">
              <span className="text-[#636363] text-[13px] mb-2">Date</span>
              <span className="text-[14px]"> {row.getValue("date")}</span>
            </div>

            <div className=" mt-1 flex justify-between">
              <span className="text-[#636363] text-[13px] mb-2">Location</span>{" "}
              <span className="text-[14px]">{row.getValue("location")}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-[#636363] text-[13px] mb-2">User</span>{" "}
              <span className="text-[14px]">{row.getValue("user")}</span>
            </div>
            <div className=" mt-1 flex justify-between">
              <span className="text-[#636363] text-[13px] mb-2">County</span>{" "}
              <span className="text-[14px]">{row.getValue("county")}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-[#636363] text-[13px] mb-2">Royalty</span>{" "}
              <span className="text-[14px]">{row.getValue("royalty")}</span>
            </div>
          </div>
        ))}

        {/* Add Store bottom */}
        <div className="block pl-24 ">
          {" "}
          <AddStore setAddStore={setopenAddStore} />
        </div>
        <div className="hidden below-md:block ">
          <Pagination table={table} totalItems={totalItems} />
          </div>
      </div>

      {/* Desktop View */}
      <div className="overflow-x-auto shadow-sm border-collapse border border-gray-200 rounded-lg flex-grow hidden flex-col md:block">
        <div className="overflow-hidden max-w-full">
          <table className="w-full border-collapse border-gray-200 table-fixed">
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
            <table className="w-full border-collapse border-gray-200 table-fixed">
              <tbody>
              {loading ? (
                    Array.from({ length: 10 })?.map((_, index) => (
                      <tr key={index} className={index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"}>
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
                  ) :
                  table.getRowModel().rows.map((row) => (
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
      <div className="mt-4 below-md:hidden">
      <Pagination table={table} totalItems={totalItems} />
      </div>
    </main>
  );
};
export default Page;

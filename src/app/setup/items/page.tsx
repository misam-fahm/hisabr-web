"use client";
import React, { FC, useEffect, useRef, useState } from "react";
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
import DeletePopup from "@/Components/UI/Delete/DeletePopup";
import EditItem from "@/Components/Setup/ItemsPopup/EditItem";
import ToastNotification, {
  ToastNotificationProps,
} from "@/Components/UI/ToastNotification/ToastNotification";
import NoDataFound from "@/Components/UI/NoDataFound/NoDataFound";
import Tooltip from "@/Components/UI/Toolstips/Tooltip";

interface TableRow {
  itemname: string;
  categoryname: string;
  packsize: number;
  units: number;
  weight: string;
  itemid?: number;
  categoryid?: number;
  itemcode: string;
  dqcategoryname: string;
  cogscategoryname: string;
}

const Page: FC = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [data, setData] = useState<TableRow[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOpenAddItems, setAddItems] = useState(false);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });

  const columns: ColumnDef<TableRow>[] = [
    {
      accessorKey: "itemcode",
      header: () => <div className="text-left">Code</div>,
      cell: (info) => <span>{info.getValue() as string}</span>,
      size: 80,
    },
    {
      accessorKey: "itemname",
      header: () => <div className="text-left">Name</div>,
      cell: (info) => {
        const value = info.getValue() as string;
        const truncatedValue =
          value.length > 40 ? value.slice(0, 40) + "..." : value;
        return (
          <Tooltip text={value} position="bottom">
            <span className="cursor-pointer">{truncatedValue}</span>
          </Tooltip>
        );
      },
      size: 170,
    },

    {
      accessorKey: "categoryname",
      header: () => <div className="text-left">Ctg</div>,
      cell: (info) => <span>{info.getValue() as string}</span>,
      size: 60,
    },

    {
      accessorKey: "dqcategoryname",
      header: () => <div className="text-left">DQ-Ctg</div>,
      cell: (info) => <span>{info.getValue() as string}</span>,
      size: 100,
    },

    {
      accessorKey: "cogscategoryname",
      header: () => <div className="text-left">COGS-Ctg</div>,
      cell: (info) => <span>{info.getValue() as string}</span>,
      size: 100,
    },

    {
      accessorKey: "packsize",
      header: () => <div className="text-right">Pack Size</div>,
      cell: (info) => (
        <div className="text-right">{info.getValue() as number}</div>
      ),
      size: 80,
    },
    {
      accessorKey: "units",
      header: () => <div className="text-right">Units</div>,
      cell: (info) => (
        <div className="text-right">{info.getValue() as string}</div>
      ),
      size: 60,
    },
    {
      accessorKey: "weight",
      header: () => <div className="text-left ">Weight</div>,
      cell: (info) => (
        <div className="text-left ml-3 ">{info.getValue() as string}</div>
      ),
      size: 60,
    },
    {
      id: "edit",
      header: () => <div className="text-center"></div>,
      cell: (info) => (
        <span className="flex justify-center">
          <EditItem rowData={info.row.original} setAddItems={setAddItems} />
        </span>
      ),
      size: 45,
    },
    {
      id: "delete",
      header: () => <div className="text-center"></div>,
      cell: (info) => (
        <span className="flex justify-center">
          <DeletePopup
            message={"Item"}
            jsonData={{
              mode: "deleteItem",
              itemid: Number(info.row.original.itemid),
            }}
            setUpdatedData={setAddItems}
          />
        </span>
      ),
      size: 40,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    initialState: {
      pagination: {
        pageSize: 25,
        pageIndex: 0,
      },
    },
    manualPagination: true, // Enable manual pagination
    pageCount: Math.ceil(totalItems / 10),
  });

  // useEffect(() => {
  //   const delayDebounceFn = setTimeout(() => {
  //     if (globalFilter.length >= 3 || globalFilter === "") {
  //       setSearchTerm(globalFilter);
  //     }
  //   }, 500);

  //   return () => clearTimeout(delayDebounceFn);
  // }, [globalFilter]);

  const { pageIndex, pageSize } = table.getState().pagination;
  // const totalItems = table.getFilteredRowModel().rows.length;
  const fetchData = async (search: string = "") => {
    setLoading(true);
    try {
      const response: any = await sendApiRequest({
        mode: "getItems",
        page: table.getState().pagination.pageIndex + 1,
        limit: table.getState().pagination.pageSize,
        search: search,
      });

      if (response?.status === 200) {
        setData(response?.data?.items || []);
        table.getState().pagination.pageIndex == 0 && setTotalItems(response?.data?.total || 0);
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
      setAddItems(false);
    }
  };

  // Handle initial load with search term from sessionStorage
  useEffect(() => {
    // Ensure sessionStorage access is client-side
    if (typeof window !== "undefined") {
      const searchTerm = sessionStorage.getItem("searchTerm") || "";
      if (searchTerm) {
        setGlobalFilter(searchTerm);
        table.setPageIndex(0);
        fetchData(searchTerm);
        // Clear sessionStorage to prevent persistence
        sessionStorage.removeItem("searchTerm");
      } else {
        fetchData("");
      }
    }
  }, []);

  // Handle pagination and manual search
  useEffect(() => {
    fetchData(globalFilter);
  }, [
    table.getState().pagination.pageIndex,
    table.getState().pagination.pageSize,
    isOpenAddItems,
    globalFilter,
  ]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      table.getState().pagination.pageIndex == 0 ? fetchData(globalFilter) : table.setPageIndex(0);
    }
  };

  const clearSearch = () => {
    setGlobalFilter("");
    table.setPageIndex(0);
    fetchData("");
  };

  const handleSearchClick = () => {
    if (table.getState().pagination.pageIndex === 0) {
      fetchData(globalFilter);
    } else {
      table.setPageIndex(0);
    }
  };

  return (
    <main
      className="max-h-[calc(100vh-60px)] px-4 below-md:px-3 below-md:py-4 overflow-auto "
      style={{ scrollbarWidth: "thin" }}
    >
      <ToastNotification
        message={customToast.message}
        type={customToast.type}
      />
      <div className="flex flex-row justify-between w-full items-center  my-6">
        <div className="flex  border border-gray-300 below-md:w-full relative text-[12px] bg-[#ffff] items-center rounded w-[40%] h-[35px]">
          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={searchInputRef}
            placeholder="Search"
            className="w-full h-[35px] bg-transparent  px-3 placeholder:text-[#636363] focus:outline-none"
          />
          {globalFilter && (
            <div className="  absolute right-8 cursor-pointer">
              <img
                className="  "
                src="/images/cancelicon.svg"
                onClick={clearSearch}
              />
            </div>
          )}
          <img
            className="pr-2 cursor-pointer items-center"
            src="/images/searchicon.svg"
            onClick={() => table.getState().pagination.pageIndex == 0 ? fetchData(globalFilter) : table.setPageIndex(0)}
          />
        </div>
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
                      <DeletePopup
                        message={"Item"}
                        jsonData={{
                          mode: "deleteItem",
                          itemid: Number(row.itemid),
                        }}
                        setUpdatedData={setAddItems}
                      />
                    </>
                  </div>
                </div>
                {/* Border */}
                <div className=" border-b bg-gray-200 my-3"></div>
                {/* Code */}
        <div className="flex justify-between">
          <span className=" text-[#636363] text-[13px] mb-2">Code</span>
          <span className="text-[14px]">{row?.itemcode}</span>
        </div>
                {/* Category */}
                <div className="flex justify-between">
                  <span className=" text-[#636363] text-[13px] mb-2">
                    Category
                  </span>{" "}
                  <span className="text-[14px]">{row?.categoryname}</span>
                </div>
                {/* DQ-CTG */}
        <div className="flex justify-between mt-1">
          <span className=" text-[#636363] text-[13px] mb-2">DQ-CTG</span>
          <span className="text-[14px]">{row?.dqcategoryname}</span>
        </div>
        {/* COGS-CTG */}
        <div className="flex justify-between mt-1">
          <span className=" text-[#636363] text-[13px] mb-2">COGS-CTG</span>
          <span className="text-[14px]">{row?.cogscategoryname}</span>
        </div>
                {/* packsize */}
                <div className="mt-1 flex justify-between">
                  <span className=" text-[#636363] text-[13px] mb-2">
                  packsize
                  </span>{" "}
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
                  <span className=" text-[#636363] text-[13px] mb-2">
                    Weight
                  </span>{" "}
                  <span className="text-[14px]">{row?.weight}</span>
                </div>
              </div>
            ))
          ) : (
            <div>No data available</div>
          )}
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
              <thead className="bg-[#0F1044] sticky top-0 z-10">
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
                  {loading ? (
                    Array.from({ length: 10 }).map((_, index) => (
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
                  ) : table.getRowModel().rows.length === 0 ? (
                    /* Show No Data Found Message If No Data Available */
                    <tr>
                      <td colSpan={columns.length} className="py-6 text-center">
                        <NoDataFound />
                      </td>
                    </tr>
                  ) : data && data.length > 0 ? (
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

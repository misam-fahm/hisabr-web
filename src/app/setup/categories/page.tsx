"use client";
import React, { FC, useEffect, useState } from "react";
import Pagination from "@/Components/UI/Pagination/Pagination";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AddNewItems from "@/Components/Setup/ItemsPopup/AddNewItems";
import AddCategories from "@/Components/Setup/CategoriesPopup/AddCategories";
import EditCategories from "@/Components/Setup/CategoriesPopup/EditCategories";
import DeleteCategories from "@/Components/Setup/CategoriesPopup/DeleteCategories";
import { sendApiRequest } from "@/utils/apiUtils";
import ToastNotification, { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";
import DeletePopup from "@/Components/UI/Delete/DeletePopup";
import NoDataFound from "@/Components/UI/NoDataFound/NoDataFound";

interface TableRow {
  categoryname: string;
  description: string;
  itemcount: number;
  categoryid?: number;
}

const Page: FC = () => {
  // const [globalFilter, setGlobalFilter] = React.useState("");
  const [data, setData] = useState<TableRow[]>([]); // Data state for table rows
  const [totalItems, setTotalItems] = useState<number>(0); // Total number of items from the API
  const [loading, setLoading] = useState<boolean>(true); // Loading state for API call
  const [isOpenAddCategories, setAddCategories] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });


  const columns: ColumnDef<TableRow>[] = [
    {
      accessorKey: "categoryname",
      header: () => <div className="text-left">Name</div>,
      cell: (info) => <span>{info.getValue() as string}</span>,
      size: 400,
    },
    {
      accessorKey: "description",
      header: () => <div className="text-left">Description</div>,
      cell: (info) => <span>{info.getValue() as string}</span>,
      size: 400,
    },
    // {
    //   accessorKey: "itemcount",
    //   header: () => <div className="text-right mr-14">No. of Items</div>,
    //   cell: (info) => (
    //     <div className="text-right mr-14">{info.getValue() as number}</div>
    //   ),
    //   size: 150,
    // },
    {
      id: "edit",
      header: () => <div className=" flex justify-center items-center"></div>,
      cell: (info) => (
        <span className="flex justify-center">
         <EditCategories rowData={info.row.original} setAddCategories={setAddCategories} />
        </span>
      ),
      size: 50,
    },
    {
      id: "delete",
      header: () => (
        <div className="flex justify-center items-center"></div>
      ),
      cell: (info) => (
        <span className="flex justify-center">
          <DeletePopup message={"Category"} jsonData={ {mode: "deleteCategory",categoryid:Number(info.row.original.categoryid)}} setUpdatedData={setAddCategories} />
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
    state: { globalFilter },
    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: 0,
      },
    },
    manualPagination: true, // Enable manual pagination
    pageCount: Math.ceil(totalItems / 10), // Calculate page count based on totalItems
  });
  const { pageIndex, pageSize } = table.getState().pagination;
   // const totalItems = table.getFilteredRowModel().rows.length;
 
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response: any = await sendApiRequest({
          mode: "getCategories",
          page: table.getState().pagination.pageIndex + 1,
          limit: 2000000,
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
        setAddCategories(false)
      }
    };

    fetchData();
  }, [pageIndex, pageSize ,isOpenAddCategories]);

  return (
    <main
      className="max-h-[calc(100vh-60px)] px-6 below-md:px-3   below-md:py-4 overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <ToastNotification
        message={customToast.message}
        type={customToast.type}
      />
      <div className="flex justify-end gap-2 below-md:hidden my-6">
        {/* <AddNewItems /> */}
        <AddCategories setAddCategories={setAddCategories} />
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
            data?.map((row: any) => (
              <div
                key={row?.categoryid}
                className={`border border-gray-200 p-5 bg-white rounded-lg mb-3`}
              >
                <div className="flex justify-between items-center">
                  {/* Name */}
                  <span className="font-bold text-[14px] text-[#334155]">
                    {row?.categoryname}
                  </span>
                  <div className="flex items-center ">
                    {/* Edit */}
                    <EditCategories rowData={row} setAddCategories={setAddCategories} />
                    {/* Delete */}
                    <>
                      <DeleteCategories />
                    </>
                  </div>
                </div>

                {/* Border */}
                <div className=" border-b bg-gray-200 my-3"></div>

                <div className=" flex justify-between ">
                  <span className=" text-[#636363] text-[13px] mb-2">
                    Description
                  </span>{" "}
                  <span className="text-[14px]"> {row?.description}</span>
                </div>

                {/* <div className="mt-1 flex justify-between">
                  <span className=" text-[#636363] text-[13px] mb-2">
                    No. of Items
                  </span>{" "}
                  <span className="text-[14px]"> {row?.noOfItems}</span>
                </div> */}
              </div>
            ))
          ) : (
            <div>No data available</div>
          )}
          {/* Add NewItem bottom */}
          <div className="block pl-24">
            <AddCategories setAddCategories={setAddCategories}/>
          </div>
          <div className="hidden below-md:block ">
          <Pagination table={table} totalItems={totalItems} />
          </div>
        </div>

        {/* Desktop View */}
        <div className="overflow-x-auto shadow-sm border-collapse border border-gray-200 rounded-lg flex-grow hidden flex-col md:block">
          <div className="overflow-hidden  max-w-full">
            <table className="w-full   table-fixed">
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
              <table className="w-full border-collapse  border-gray-200 table-fixed">
                <tbody>
                  {loading ? (
                    Array.from({ length: 10 }).map((_, index) => (
                      <tr key={`skeleton-row-${index}`} className={index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"}>
                        {columns.map((column, colIndex) => (
                          <td
                          key={`skeleton-col-${index}-${colIndex}`}
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
                  ) 
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
                          key={`cell-${cell?.id}`} 
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
      {/* <div className="mt-4 below-md:hidden">
      <Pagination table={table} totalItems={totalItems} />
      </div> */}
    </main>
  );
};

export default Page;

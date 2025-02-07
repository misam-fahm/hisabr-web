"use client";
import React, { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
//import { useSearchParams } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import AddTender from "@/Components/Setup/TendersPopup/AddTender";
import Skeleton from "react-loading-skeleton";
import DeleteTenders from "@/Components/Setup/TendersPopup/DeleteTenders";
import EditTenders from "@/Components/Setup/TendersPopup/EditTenders";
import Pagination from "@/Components/UI/Pagination/Pagination";
import { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";
import { sendApiRequest } from "@/utils/apiUtils";
import DeletePopup from "@/Components/UI/Delete/DeletePopup";
import NoDataFound from "@/Components/UI/NoDataFound/NoDataFound";

interface TableRow {
  commission: string;
  tendername: string;
  tendertypename: string;
  tenderid: any;
}

const Page: FC = () => {
  const router = useRouter();
  const [showBackIcon, setShowBackIcon] = useState(false);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [data, setData] = useState<TableRow[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOpenAddTender, setAddTender] = useState(false);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });

  const columns: ColumnDef<TableRow>[] = [
    {
      accessorKey: "name",
      header: () => <div className="text-left">Name</div>,
      cell: (info) => {
        const value = info?.row?.original?.tendername || "";
        const truncatedValue =
          value.length > 32 ? value.slice(0, 32) + "..." : value;
        return <span title={value}>{truncatedValue}</span>;
      },
      size: 160,
    },

    {
      accessorKey: "type",
      header: () => <div className="text-left">Type</div>,
      cell: (info) => <span>{info?.row?.original?.tendertypename}</span>,
      size: 120,
    },
    {
      accessorKey: "commission",
      header: () => <div className="text-right mr-16">Commission(%)</div>,
      cell: (info) => (
        <div className="text-right mr-14">
          {info?.row?.original?.commission}
        </div>
      ),
      size: 120,
    },
    {
      id: "edit",
      header: () => <div className="text-center  "></div>,
      cell: (info) => (
        <span className="flex justify-center">
          <EditTenders
            initialData={info.row.original}
            setAddTender={setAddTender}
          />
        </span>
      ),
      size: 30,
    },
    {
      id: "delete",
      header: () => <div className="text-center "></div>,
      cell: (info) => (
        <span className="flex justify-center">
          <DeletePopup
            message={"Tender"}
            jsonData={{
              mode: "deleteTender",
              tenderid: Number(info.row.original.tenderid),
            }}
            setUpdatedData={setAddTender}
          />
        </span>
      ),
      size: 30,
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const response: any = await sendApiRequest({
        mode: "getTenders",
        page: table.getState().pagination.pageIndex + 1,
        limit: table.getState().pagination.pageSize,
      });
      if (response?.status === 200) {
        setData(response?.data?.tenders || []);
        response?.data?.total > 0 && setTotalItems(response?.data?.total || 0);
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
      setAddTender(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize, isOpenAddTender]);

  const handleAddTender = (newExpense: any) => {
    setData((prevExpenses) => [...prevExpenses, newExpense]);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const fromHome = params.get("fromHome") === "true";
      if (fromHome) {
        setShowBackIcon(true);
        const currentUrl = window.location.pathname;
        window.history.replaceState({}, "", currentUrl);
      }
    }
  }, []);

  return (
    <main
      className="max-h-[calc(100vh-60px)] px-6 below-md:px-3  below-md:py-4 overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <div className="flex below-md:hidden justify-between my-6">
        <div>
          {showBackIcon && (
            <img
              onClick={() => router.back()}
              src="/images/webbackicon.svg"
              alt="Back Arrow"
              className="w-7 h-7"
            />
          )}
        </div>
        <div className="gap-2 below-md:hidden">
          {" "}
          <AddTender setAddTender={setAddTender} />
        </div>
      </div>
      {/* mobile view */}
      <div
        className="block md:hidden"
        style={{
          maxHeight: "calc(100vh - 80px)",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch", // Enables smooth scrolling on mobile
          scrollbarWidth: "none", // Hide scrollbar
        }}
      >
        {table?.getRowModel()?.rows?.map((row) => (
          <div
            key={row.id}
            className={`border border-gray-200 p-5 bg-white rounded-lg mb-3`}
          >
            <div className="flex justify-between items-center">
              {/* Name */}
              <span className="font-bold text-[14px] text-[#334155]">
                {row?.original?.tendername}
              </span>
              <div className="flex items-center gap-4">
                {/* Edit */}
                <>
                  <EditTenders
                    initialData={row.original}
                    setAddTender={setAddTender}
                  />
                </>
                {/* Delete */}
                <>
                  <DeletePopup
                    message={"Tender"}
                    jsonData={{
                      mode: "deleteTender",
                      tenderid: Number(row.original.tenderid),
                    }}
                    setUpdatedData={setAddTender}
                  />
                </>
              </div>
            </div>
            {/* Border */}
            <div className=" border-b bg-gray-200 my-3"></div>
            <div className="  flex justify-between">
              <span className=" text-[#636363] text-[13px] mb-2">Type</span>{" "}
              <span className=" text-[14px]">
                {row?.original?.tendertypename}
              </span>
            </div>
            <div className=" mt-1 flex justify-between">
              <span className=" text-[#636363] text-[13px] mb-2">
                Commission
              </span>{" "}
              <span className=" text-[14px]">{row?.original?.commission}</span>
            </div>
          </div>
        ))}
        {/* Add Tender bottom */}
        <div className="block pl-24">
          {" "}
          <AddTender setAddTender={setAddTender} />
        </div>
        <div className="hidden below-md:block ">
          <Pagination table={table} totalItems={totalItems} />
        </div>
      </div>
      {/* Desktop View */}
      <div className="overflow-x-auto border-collapse border border-gray-200 rounded-lg flex-grow hidden flex-col md:block shadow-sm">
        <div className="overflow-hidden max-w-full">
          <table className="w-full border-collapse border-gray-200 table-fixed shadow-lg">
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
                    )) : table.getRowModel().rows.length === 0 ? (
                      /* Show No Data Found Message If No Data Available */
                      <tr>
                        <td colSpan={columns.length} className="py-6 text-center">
                          <NoDataFound />
                        </td>
                      </tr>
                    )
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
      <div className="mt-4 below-md:hidden">
        <Pagination table={table} totalItems={totalItems} />
      </div>
    </main>
  );
};
export default Page;

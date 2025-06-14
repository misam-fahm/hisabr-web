"use client";
import React, { FC, useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AddDQCategories from "@/Components/Setup/DQCategoriesPopup/AddDQCategories";
import EditDQCategories from "@/Components/Setup/DQCategoriesPopup/EditDQCategories";
import DeleteDQCategories from "@/Components/Setup/DQCategoriesPopup/DeleteDQCategories";
import { sendApiRequest } from "@/utils/apiUtils";
import ToastNotification, { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";
import NoDataFound from "@/Components/UI/NoDataFound/NoDataFound";
import { useRouter } from "next/navigation"; // Import useRouter

interface TableRow {
  id: number;
  name: string;
  types: string; 
  count: number;
}

const Page: FC = () => {
  const [data, setData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOpenAddDQCategories, setAddDQCategories] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });
  const router = useRouter();

  const refreshData = () => {
    setAddDQCategories((prev) => !prev);
  };

  // Function to show toast notifications
  const showToast = (message: string, type: "success" | "error") => {
    setCustomToast({ message, type });
    // Clear the toast after 3 seconds
    setTimeout(() => {
      setCustomToast({ message: "", type: "" });
    }, 3000);
  };

  // In the columns definition, pass refreshData instead of setAddDQCategories
  const columns: ColumnDef<TableRow>[] = [
    {
      accessorKey: "name",
      header: () => <div className="text-left">Name</div>,
      cell: (info) => (
        <span
          className="cursor-pointer hover:underline"
          onClick={() => {
            // Store search term in sessionStorage
            sessionStorage.setItem("searchTerm", info.getValue() as string);
            router.push("/setup/items");
          }}
        >
          {info.getValue() as string}
        </span>
      ),
      size: 200,
    },
    {
      accessorKey: "count",
      header: () => <div className="text-right">Item Count</div>, // <-- right align header
      cell: (info) => <span className="text-right block">{info.getValue() as number}</span>, // <-- right align cell
      size: 800,
    },
    {
      id: "actions",
      header: () => <div className="text-right pr-4">Actions</div>,
      cell: (info) => (
        <div className="flex justify-end gap-11 pr-7">
          {info.row.original.types !== "S" && (
            <DeleteDQCategories
              rowData={info.row.original}
              setDataRefresh={refreshData}
            />
          )}
          <EditDQCategories
            rowData={info.row.original}
            setDataRefresh={refreshData}
          />
        </div>
      ),
      size: 200,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response: any = await sendApiRequest({
          mode: "getAllDQCategorys",
          page: 1,
          limit: 10,
        });

        if (response?.status === 200) {
          setData(response?.data?.dqcategory || []);
        } else {
          showToast(response?.message || "Failed to fetch data", "error");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast("An error occurred while fetching data", "error");
      } finally {
        setLoading(false);
        setAddDQCategories(false);
      }
    };

    fetchData();
  }, [isOpenAddDQCategories]);

  return (
    <main
      className="max-h-[calc(100vh-60px)] px-6 below-md:px-3 below-md:py-4 overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      {customToast.message && (
        <ToastNotification
          message={customToast.message}
          type={customToast.type}
        />
      )}

      <div className="flex justify-end gap-2 below-md:hidden my-6">
        <AddDQCategories
          setAddDQCategories={setAddDQCategories}
          showToast={showToast}
        />
      </div>

      <div className="overflow-hidden max-w-full">
        {/* Mobile view */}
        <div className="block md:hidden">
          {data && data?.length > 0 ? (
            data?.map((row: any) => (
              <div
                key={row?.id}
                className={`border border-gray-200 p-5 bg-white rounded-lg mb-3`}
              >
                <div className="flex justify-between items-center">
                  <span
                    className="font-bold text-[14px]  cursor-pointer hover:underline"
                    onClick={() => {
                      // Store search term in sessionStorage
                      sessionStorage.setItem("searchTerm", row.name);
                      router.push("/setup/items");
                    }}
                  >
                    {row?.name}
                  </span>
                  <div className="flex items-right gap-8">
                  <span className="text-gray-500 text-sm mr-4 text-right block">Item Count: {row.count}</span>
                  {row.types !== "S" && (
              <DeleteDQCategories
                rowData={row}
                setDataRefresh={refreshData}
              />
            )}
            <EditDQCategories
              rowData={row}
              setDataRefresh={refreshData}
            />
          </div>
                </div>
              </div>
            ))
          ) : (
            <div>No data available</div>
          )}
          <div className="block pl-24">
            <AddDQCategories
              setAddDQCategories={setAddDQCategories}
              showToast={showToast}
            />
          </div>
        </div>

        {/* Desktop View */}
        <div className="overflow-x-auto shadow-sm border-collapse border border-gray-200 rounded-lg hidden flex-col md:block">
          <div className="overflow-hidden max-w-full">
            <table className="w-full table-fixed">
              <thead className="bg-[#334155] sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className={`text-left px-4 py-2 text-[#FFFFFF] font-normal text-[15px] w-[100px] ${
                          header.id === "actions" ? "text-right" : ""
                        }`}
                        style={{ width: `${header.column.getSize()}px` }}
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
                            key={`cell-${cell?.id}`}
                            className={`px-4 py-1.5 text-[#636363] text-[14px] ${
                              cell.column.id === "actions" ? "text-right" : ""
                            }`}
                            style={{ width: `${cell.column.getSize()}px` }}
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
    </main>
  );
};

export default Page;
"use client";
import React, { FC, useState, useRef, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DateRangePicker from "@/Components/UI/Themes/DateRangePicker";
import Dropdown from "@/Components/UI/Themes/DropDown";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";
import { sendApiRequest } from "@/utils/apiUtils";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NoDataFound from "@/Components/UI/NoDataFound/NoDataFound";
import ToastNotification from "@/Components/UI/ToastNotification/ToastNotification";
import Tooltip from "@/Components/UI/Toolstips/Tooltip";
import Pagination from "@/Components/UI/Pagination/Pagination";
import { useGlobalContext } from "@/Components/Header/header";

interface TableRow {
  itemcode: string;
  itemname: string;
  dqcategory: string; // Added DQ Category
  avgrate: number;
  totalqty: number;
  totalcost: number;
  packsize: number;
  unit: string;
  rateperunit: number;
  totalunits: number;
  id: any;
}

const ItemMustReport: FC = () => {
  const router = useRouter();
  const [showBackIcon, setShowBackIcon] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef(null);
  const [isScrollbarVisible, setIsScrollbarVisible] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [data, setData] = useState<TableRow[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [isVerifiedUser, setIsVerifiedUser] = useState<boolean>(false);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });
  const [isDateRangeOpen, setIsDateRangeOpen] = useState<boolean>(false);

  // Get global context values
  const {
    storeOptions,
    dateRangeOptions,
    selectedDateRange,
    setSelectedDateRange,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    selectedStore,
    setSelectedStore,
  } = useGlobalContext();

  // Custom filter function for searching across Item Code, Item Name, Unit, and DQ Category
  const globalFilterFn = (row: any, columnId: string, value: string) => {
    const search = value.toLowerCase();
    const itemCode = String(row.original.itemcode || '').toLowerCase();
    const itemName = String(row.original.itemname || '').toLowerCase();
    const unit = String(row.original.unit || '').toLowerCase();
    const dqcategory = String(row.original.dqcategory || '').toLowerCase();
    
    return itemCode.includes(search) || 
           itemName.includes(search) || 
           unit.includes(search) ||
           dqcategory.includes(search);
  };

  const formatNumberWithCommas = (value: number, decimals = 2) => {
    if (typeof value !== "number" || isNaN(value)) return "-";
    // Show no decimals if .00, else show up to 2 decimals
    if (Number.isInteger(value) || Number(value.toFixed(decimals)) === Math.round(value)) {
      return Math.round(value).toLocaleString();
    }
    return value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  const formatValue = (value: any, decimals = 2) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      (typeof value === "number" && isNaN(value))
    ) {
      return "-";
    }
    if (typeof value === "number") {
      return formatNumberWithCommas(value, decimals);
    }
    return value;
  };

  const columns: ColumnDef<TableRow>[] = [
    {
      accessorKey: "itemcode",
      header: () => <div className="text-left">Item Code</div>,
      cell: (info) => (
        <span className="text-[#636363] text-left block">
          {formatValue(info.row.original.itemcode, 0)}
        </span>
      ),
      size: 100,
    },
    {
      accessorKey: "itemname",
      header: () => <div className="text-left">Item Name</div>,
      cell: (info) => {
        const itemname: any = info?.row?.original?.itemname;
        if (
          itemname === null ||
          itemname === undefined ||
          itemname === "" ||
          (typeof itemname === "number" && isNaN(itemname))
        ) {
          return <span className="text-[#636363]">-</span>;
        }
        const truncatedName =
          itemname?.length > 20 ? `${itemname?.slice(0, 15)}...` : itemname;
        return itemname?.length > 20 ? (
          <span className="text-[#636363]">
            <Tooltip text={itemname}>{truncatedName}</Tooltip>
          </span>
        ) : (
          <span className="text-[#636363]">{itemname}</span>
        );
      },
      size: 150,
    },
    {
      accessorKey: "totalqty",
      header: () => <div className="text-right">Total Qty</div>,
      cell: (info) => (
        <span className="flex justify-end text-[#636363] text-right w-full">
          {formatValue(info.row.original.totalqty)}
        </span>
      ),
      size: 100,
    },
    {
      accessorKey: "avgrate",
      header: () => <div className="text-right">Avg Rate</div>,
      cell: (info) => (
        <span className="flex justify-end text-[#636363] text-right w-full">
          {formatValue(info.row.original.avgrate)}
        </span>
      ),
      size: 90,
    },
    {
      accessorKey: "totalcost",
      header: () => <div className="text-right">Total Cost</div>,
      cell: (info) => (
        <span className="flex justify-end text-[#636363] font-semibold text-right w-full">
          {formatValue(info.row.original.totalcost)}
        </span>
      ),
      size: 100,
    },
    {
      accessorKey: "packsize",
      header: () => <div className="text-right">Pack Size</div>,
      cell: (info) => (
        <span className="flex justify-end text-[#636363] text-right w-full">
          {formatValue(info.row.original.packsize)}
        </span>
      ),
      size: 90,
    },
    {
      accessorKey: "rateperunit",
      header: () => <div className="text-right">Unit Rate</div>,
      cell: (info) => (
        <span className="flex justify-end text-[#636363] text-right w-full">
          {formatValue(info.row.original.rateperunit)}
        </span>
      ),
      size: 110,
    },
    {
      accessorKey: "unit",
      header: () => <div className="text-left">Unit</div>,
      cell: (info) => (
        <span className="text-[#636363] text-left block">
          {formatValue(info.row.original.unit, 0)}
        </span>
      ),
      size: 90,
    },
    {
      accessorKey: "totalunits",
      header: () => <div className="text-right">Total Units</div>,
      cell: (info) => (
        <span className="flex justify-end text-[#636363] text-right w-full">
          {formatValue(info.row.original.totalunits)}
        </span>
      ),
      size: 100,
    },
    {
      accessorKey: "dqcategory",
      header: () => <div className="text-left">DQ Categ.</div>,
      cell: (info) => {
        const dq = info.row.original.dqcategory;
        const display = (!dq || dq === "Uncategorized") ? "-" : dq;
        if (display === "-") {
          return <span className="text-[#636363]">-</span>;
        }
        const truncated = display.length > 13 ? `${display.slice(0, 13)}..` : display;
        return display.length > 13 ? (
            <span className="text-[#636363]">{truncated}</span>
        ) : (
          <span className="text-[#636363]">{display}</span>
        );
      },
      size: 120,
    },
  ];

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: 0,
      },
    },
    manualPagination: true,
    pageCount: Math.ceil(totalItems / 10),
  });

  const { pageIndex, pageSize } = table.getState().pagination;

  const fetchData = async (search: string = "") => {
    setLoading(true);
    try {
      const response = await sendApiRequest({
        mode: "reportitemmust",
        storeid: selectedStore?.id || 69,
        startdate: startDate && format(startDate, "yyyy-MM-dd"),
        enddate: endDate && format(endDate, "yyyy-MM-dd"),
        search: search,
        page: table.getState().pagination.pageIndex + 1,
        limit: table.getState().pagination.pageSize,
      });

      if (response?.status === 200) {
        const items = response?.data?.data || [];
        setData(items);
        if (response?.data?.total >= 0) {
          table.getState().pagination.pageIndex == 0 &&
            setTotalItems(response?.data?.total || 0);
        }
      } else {
        setCustomToast({
          message: response?.message || "Failed to fetch item must report",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setCustomToast({
        message: "An error occurred while fetching data",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate && selectedStore) {
      table.setPageIndex(0);
      fetchData(globalFilter);
    }
  }, [startDate, endDate, selectedStore, globalFilter]);

  useEffect(() => {
    fetchData(globalFilter);
  }, [pageIndex, pageSize]);

  const toggleDateRangeDropdown = () => {
    setIsDateRangeOpen((prev) => !prev);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      table.getState().pagination.pageIndex == 0
        ? fetchData(globalFilter)
        : table.setPageIndex(0);
    }
  };

  const verifyToken = async (token: string) => {
    try {
      const res: any = await sendApiRequest({ token }, `auth/verifyToken`);
      if (res?.status === 200) {
        setIsVerifiedUser(true);
      } else {
        router.replace("/login");
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      router.replace("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      verifyToken(token);
    }
  }, [router]);

  const handleClick = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const toggleStoreDropdown = () => {
    setIsStoreDropdownOpen((prev) => !prev);
  };

  const checkScrollbarVisibility = () => {
    const container: any = containerRef.current;
    if (container) {
      const hasScrollbar = container.scrollHeight > container.clientHeight;
      setIsScrollbarVisible(hasScrollbar);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    checkScrollbarVisibility();
    const observer = new MutationObserver(() => {
      checkScrollbarVisibility();
    });
    observer.observe(container, {
      childList: true,
      subtree: true,
    });

    window.addEventListener("resize", checkScrollbarVisibility);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", checkScrollbarVisibility);
    };
  }, [table]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const fromHome = params.get("fromHome") === "true";
      const fromLabourAnalysis = params.has("fromLabourAnalysis");
      if (fromHome || fromLabourAnalysis) {
        setShowBackIcon(true);
        const currentUrl = window.location.pathname;
        window.history.replaceState({}, "", currentUrl);
      }
    }
  }, []);

  const clearSearch = async () => {
    try {
      setLoading(true);
      setGlobalFilter("");
      table.getState().pagination.pageIndex == 0
        ? fetchData()
        : table.setPageIndex(0);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMobileData = data?.filter((item: TableRow) => {
    if (!globalFilter) return true;
    const search = globalFilter.toLowerCase();
    const itemCode = String(item.itemcode || '').toLowerCase();
    const itemName = String(item.itemname || '').toLowerCase();
    const unit = String(item.unit || '').toLowerCase();
    const dqcategory = String(item.dqcategory || '').toLowerCase();
    
    return itemCode.includes(search) || 
           itemName.includes(search) || 
           unit.includes(search) ||
           dqcategory.includes(search);
  }) || [];

  return (
    <main
      className="relative px-6 below-md:px-3 max-h-[calc(100vh-180px)] overflow-hidden"
      style={{ scrollbarWidth: "none" }}
    >
      <ToastNotification message={customToast.message} type={customToast.type} />
      <div className="sticky z-20 bg-[#f7f8f9] pb-6 pt-4 below-md:pt-4 below-md:pb-4 tablet:pt-4">
        <div className="flex flex-row flex-nowrap gap-3 w-full below-md:flex-col">
          <div className="flex flex-row gap-3 w-full below-md:flex-col below-laptop:w-4/5 small-laptop:w-full">
            <div className="flex items-center">
              {showBackIcon && (
                <img
                  onClick={() => router.back()}
                  alt="Back Arrow"
                  className="w-7 h-7 mt-1 below-md:hidden cursor-pointer"
                  src="/images/webbackicon.svg"
                />
              )}
            </div>

            <Dropdown
              options={storeOptions}
              selectedOption={selectedStore?.name || "Store"}
              onSelect={(option: any) => {
                setSelectedStore(option);
                setIsStoreDropdownOpen(false);
              }}
              isOpen={isStoreDropdownOpen}
              toggleOpen={toggleStoreDropdown}
              widthchange="flex-1 min-w-[180px] below-lg:min-w-[153.648px] w-full"
            />

            <Dropdown
              options={dateRangeOptions}
              selectedOption={selectedDateRange?.name}
              onSelect={(option: any) => {
                setSelectedDateRange(option);
                setIsDateRangeOpen(false);
              }}
              isOpen={isDateRangeOpen}
              toggleOpen={toggleDateRangeDropdown}
              widthchange="flex-1 min-w-[180px] below-lg:min-w-[153.648px] w-full"
            />

            <div className="flex-1 min-w-[300px] below-lg:min-w-[256.08px] h-[35px] below-lg:h-[29.876px] w-full">
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                fetchData={fetchData}
              />
            </div>

            <div className="flex-1 min-w-[150px] below-lg:min-w-[128.04px] h-[35px] below-lg:h-[29.876px] w-full relative">
              <input
                type="text"
                value={globalFilter ?? ""}
                onChange={(e) => {
                  setGlobalFilter(e.target.value);
                  table.setPageIndex(0); // Reset to first page on search
                }}
                onKeyDown={handleKeyDown}
                ref={searchInputRef}
                placeholder="Search Item Code, Name, Unit, or DQ Category" // Updated placeholder
                className="w-full rounded border border-gray-300 bg-white py-[10px] pr-7 pl-3 h-full text-[12px] below-lg:text-[10.2432px] placeholder:text-[#636363] focus:outline-none focus:ring-1 focus:ring-white"
              />
              {globalFilter && (
                <div className="absolute right-8 inset-y-0 flex items-center cursor-pointer">
                  <img
                    className="w-4 h-4"
                    src="/images/cancelicon.svg"
                    onClick={clearSearch}
                    alt="Clear Search"
                  />
                </div>
              )}
              <div className="absolute inset-y-0 right-2 flex items-center cursor-pointer">
                <img
                  src="/images/searchicon.svg"
                  alt="Search Icon"
                  className="below-lg:scale-[0.8536]"
                  onClick={() => searchInputRef.current?.focus()}
                />
              </div>
            </div>
          </div>
          <div className="below-md:hidden tablet:hidden pl-4 flex items-center"></div>
        </div>
      </div>

      <div className="block md:hidden mb-5">
        {filteredMobileData?.map((card, index) => (
          <div
            key={index}
            className="flex flex-col w-full rounded-lg bg-white border border-b border-[#E4E4EF] below-lg:hidden my-3"
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-4 px-3 py-4">
                <p className="text-[14px] font-bold">
                  {formatValue(card.itemcode, 0)}
                </p>
              </div>
            </div>
            <div className="flex items-center px-4 -mt-4">
              <div className="border-t border-gray-200 w-full"></div>
            </div>
            <div className="flex justify-between items-center px-4 py-3">
              <div className="flex flex-col text-[13px] space-y-3">
                <p className="text-[#636363]">Item Name</p>
                <p className="text-[#636363]">DQ Categ.</p>
                <p className="text-[#636363]">Total Qty</p>
                <p className="text-[#636363]">Avg Rate</p>
                <p className="text-[#636363]">Total Cost</p>
                <p className="text-[#636363]">Pack Size</p>
                <p className="text-[#636363]">Unit Rate</p>
                <p className="text-[#636363]">Unit</p>
                <p className="text-[#636363]">Total Units</p>
              </div>
              <div className="flex flex-col text-[14px] text-right space-y-3">
                <p className="text-[#1A1A1A]">
                  {
                    card.itemname === null ||
                    card.itemname === undefined ||
                    card.itemname === "" ||
                    (typeof card.itemname === "number" && isNaN(card.itemname))
                      ? "-"
                      : card.itemname
                  }
                </p>
                <p className="text-[#1A1A1A]">
                  {
                    (!card.dqcategory || card.dqcategory === "Uncategorized")
                      ? "-"
                      : card.dqcategory
                  }
                </p>
                <p className="text-[#1A1A1A]">{formatValue(card.totalqty)}</p>
                <p className="text-[#1A1A1A]">{formatValue(card.avgrate)}</p>
                <p className="text-[#000000]">{formatValue(card.totalcost)}</p>
                <p className="text-[#1A1A1A]">{formatValue(card.packsize)}</p>
                <p className="text-[#1A1A1A]">{formatValue(card.rateperunit)}</p>
                <p className="text-[#1A1A1A]">{formatValue(card.unit, 0)}</p>
                <p className="text-[#1A1A1A]">{formatValue(card.totalunits)}</p>
              </div>
            </div>
          </div>
        ))}
        {filteredMobileData?.length === 0 && !loading && (
          <div className="text-center py-8">
            <NoDataFound />
          </div>
        )}
        {/* Mobile Pagination */}
        <div className="mt-4 md:hidden">
          <Pagination table={table} totalItems={totalItems} />
        </div>
      </div>

      {/* Web Table */}
      <div className="shadow-sm border-collapse border border-b border-[#E4E4EF] rounded-md flex-grow flex flex-col below-md:hidden">
        <div className="rounded-md">
          <table className="w-full border-collapse text-white rounded-md">
            <thead className="bg-[#0F1044] top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2 text-[#FFFFFF] font-normal text-[15px]"
                      style={{
                        width: isScrollbarVisible
                          ? `${header.column.getSize() + 8}px`
                          : `${header.column.getSize()}px`,
                        textAlign: ["totalqty", "avgrate", "totalcost", "packsize", "rateperunit", "totalunits"].includes(header.column.id)
                          ? "right"
                          : "left",
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
          </table>
          <div
            ref={containerRef}
            className="w-full overflow-y-auto scrollbar-thin flex-grow"
            style={{
              maxHeight: "calc(100vh - 270px)",
              background: "transparent",
              marginBottom: 0,
              paddingBottom: 0,
            }}
          >
            <table className="w-full border-collapse text-[12px] text-white">
              <tbody>
                {loading ? (
                  Array.from({ length: 10 }).map((_, index) => (
                    <tr key={index} className={index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"}>
                      {columns.map((column, colIndex) => (
                        <td
                          key={colIndex}
                          className="px-4 py-1.5"
                          style={{ 
                            width: `${column.size}px`,
                            textAlign: ["totalqty", "avgrate", "totalcost", "packsize", "rateperunit", "totalunits"].includes(column.id as string)
                              ? "right"
                              : "left",
                          }}
                        >
                          <Skeleton height={18} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className={row.index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"}>
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-4 py-1.5 text-[#636363] text-[14px]"
                          style={{ 
                            width: `${cell.column.getSize()}px`,
                            textAlign: ["totalqty", "avgrate", "totalcost", "packsize", "rateperunit", "totalunits"].includes(cell.column.id)
                              ? "right"
                              : "left",
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="py-6 text-center">
                      <NoDataFound />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Pagination Numbers */}
      <div className="mt-4 below-md:hidden">
        <Pagination table={table} totalItems={totalItems} />
      </div>
    </main>
  );
};

export default ItemMustReport;
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
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import Pagination from "@/Components/UI/Pagination/Pagination";
import { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";
import { sendApiRequest } from "@/utils/apiUtils";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NoDataFound from "@/Components/UI/NoDataFound/NoDataFound";
import AddCashreconc from "@/Components/cashreconcpopup/AddCashreconc";
import Editcashreconc from "@/Components/cashreconcpopup/Editcashreconc";
import ToastNotification from "@/Components/UI/ToastNotification/ToastNotification";
import Deletecashreconc from "@/Components/cashreconcpopup/Deletecashreconc";

interface DateRangeOption {
  name: string;
  value?: string;
  id: number;
}

interface TableRow {
  recdate: string;
  storename: string;
  systembalance: string;
  actualbalance: string;
  id: any;
}

const CashReconciliations: FC = () => {
  const router = useRouter();
  const [showBackIcon, setShowBackIcon] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef(null);
  const [isScrollbarVisible, setIsScrollbarVisible] = useState(false);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [data, setData] = useState<any>();
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOption, setSelectedOption] = useState<any>();
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [store, setStore] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isVerifiedUser, setIsVerifiedUser] = useState<boolean>(false);
  const [isOpenAddReconciliation, setAddReconciliation] = useState(false);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });
  const [isDateRangeOpen, setIsDateRangeOpen] = useState<boolean>(false);
  const [selectedDateRange, setSelectedDateRange] =
    useState<string>("This Month (MTD)");

  const dateRangeOptions: DateRangeOption[] = [
    { name: "This Month (MTD)", value: "this_month", id: 1 },
    { name: "This Year (YTD)", value: "this_year", id: 2 },
    { name: "Last Month", value: "last_month", id: 3 },
    { name: "Last Year", value: "last_year", id: 4 },
  ];

  const columns: ColumnDef<TableRow>[] = [
    {
      accessorKey: "date",
      header: () => <div className="text-left">Date</div>,
      cell: (info) => (
        <span>
          {new Date(info.row.original.recdate).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "2-digit",
          })}
        </span>
      ),
      size: 80,
    },
    {
      accessorKey: "store",
      header: () => <div className="text-left">Store</div>,
      cell: (info) => {
        const storename: any = info?.row?.original?.storename;
        const truncatedDescription =
          storename?.length > 15 ? `${storename?.slice(0, 15)}...` : storename;
        return <span className="">{truncatedDescription}</span>;
      },
      size: 110,
    },
    {
      accessorKey: "systembalance",
      header: () => <div className="flex justify-end mr-3">System Balance</div>,
      cell: (info) => (
        <span className="flex justify-end mr-3">
          {Number(info.row.original.systembalance).toFixed(2)}
        </span>
      ),
      size: 100,
    },
    {
      accessorKey: "actualbalance",
      header: () => <div className="flex justify-end mr-3">Actual Balance</div>,
      cell: (info) => (
        <span className="flex justify-end mr-3">
          {Number(info.row.original.actualbalance).toFixed(2)}
        </span>
      ),
      size: 100,
    },
    {
      accessorKey: "difference",
      header: () => <div className="flex justify-end mr-3">Difference</div>,
      cell: (info) => {
        const difference =
          Number(info.row.original.systembalance) -
          Number(info.row.original.actualbalance);
        return (
          <span className="flex justify-end mr-3">
            {difference.toFixed(2)}
          </span>
        );
      },
      size: 100,
    },
    {
      id: "edit",
      header: () => <div className="text-center"></div>,
      cell: (info) => (
        <span className="flex justify-center">
          <Editcashreconc
            initialData={info?.row?.original}
            setAddReconciliation={setAddReconciliation}
          />
        </span>
      ),
      size: 40,
    },
    {
      id: "delete",
      header: () => <div className="text-center"></div>,
      cell: (info) => (
        <span className="flex justify-center">
          <Deletecashreconc
            initialData={info?.row?.original}
            setAddReconciliation={setAddReconciliation}
            selectedStoreId={selectedOption?.id || 69}
          />
        </span>
      ),
      size: 40,
    },
  ];

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await sendApiRequest({
        mode: "getCashReconciliations",
        page: table.getState().pagination.pageIndex + 1,
        limit: table.getState().pagination.pageSize,
        storeid: selectedOption?.id || 69,
        startdate: startDate && format(startDate, "yyyy-MM-dd"),
        enddate: endDate && format(endDate, "yyyy-MM-dd"),
        search: globalFilter,
      });

      if (response?.status === 200) {
        setData(response?.data?.reconciliations || []);
        if (table.getState().pagination.pageIndex === 0) {
          response?.data?.total >= 0 && setTotalItems(response?.data?.total || 0);
        }
      } else {
        setCustomToast({
          message: response?.message || "Failed to fetch reconciliations",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setAddReconciliation(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate && selectedOption) {
      fetchData();
    }
  }, [pageIndex, pageSize, isOpenAddReconciliation, selectedOption, startDate, endDate]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      fetchData();
    }
  };

  const getUserStore = async () => {
    try {
      const response = await sendApiRequest({ mode: "getUserStore" });
      if (response?.status === 200) {
        const stores = response?.data?.stores || [];
        // Map stores to the format expected by the Dropdown component
        const formattedStores = stores.map((store) => ({
          name: `${store.name} - ${store.location || "Unknown Location"}`, // Ensure location is handled
          id: store.id,
        }));

        setStore(formattedStores); // Update store state with formatted data

        if (stores.length > 0) {
          setSelectedOption({
            name: `${stores[0].name} - ${stores[0].location || "Unknown Location"}`,
            id: stores[0].id,
          });
        }
      } else {
        handleError(response?.message);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const verifyToken = async (token: string) => {
    try {
      const res: any = await sendApiRequest({ token }, `auth/verifyToken`);
      res?.status === 200 ? setIsVerifiedUser(true) : router.replace("/login");
    } catch (error) {
      router.replace('/login');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      verifyToken(token);
    }
  }, []);

  useEffect(() => {
    if (isVerifiedUser) {
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();
      setStartDate(new Date(currentYear, currentMonth, 1));
      setEndDate(new Date(currentYear, currentMonth + 1, 0)); // Last day of current month
      getUserStore();
    }
  }, [isVerifiedUser]);

  const handleClick = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const toggleStoreDropdown = () => {
    setIsStoreDropdownOpen((prev) => !prev);
  };

  const toggleDateRangeDropdown = () => {
    setIsDateRangeOpen((prev) => !prev);
  };

  const handleDateRangeSelect = (option: DateRangeOption) => {
    setSelectedDateRange(option.name);
    const now = new Date();
    let newStartDate: Date;
    let newEndDate: Date;

    switch (option.value) {
      case "this_month":
        newStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
        newEndDate = now;
        break;
      case "this_year":
        newStartDate = new Date(now.getFullYear(), 0, 1);
        newEndDate = now;
        break;
      case "last_month":
        newStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        newEndDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case "last_year":
        newStartDate = new Date(now.getFullYear() - 1, 0, 1);
        newEndDate = new Date(now.getFullYear() - 1, 11, 31);
        break;
      default:
        newStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
        newEndDate = now;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setIsDateRangeOpen(false);
  };

  const handleError = (message: string) => {
    setCustomToast({
      message,
      type: "error",
    });
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
    observer?.observe(container, {
      childList: true,
      subtree: true,
    });

    window?.addEventListener("resize", checkScrollbarVisibility);

    return () => {
      observer.disconnect();
      window?.removeEventListener("resize", checkScrollbarVisibility);
    };
  }, [table]);

  useEffect(() => {
    if (typeof window !== undefined) {
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
    setLoading(true);
    setGlobalFilter("");
    try {
      const response: any = await sendApiRequest({
        mode: "getCashReconciliations",
        page: table.getState().pagination.pageIndex + 1,
        limit: table.getState().pagination.pageSize,
        storeid: selectedOption?.id || 69,
        startdate: startDate && format(startDate, "yyyy-MM-dd"),
        enddate: endDate && format(endDate, "yyyy-MM-dd"),
        search: "",
      });

      if (response?.status === 200) {
        setData(response?.data?.reconciliations || []);
        if (table.getState().pagination.pageIndex === 0) {
          response?.data?.total >= 0 && setTotalItems(response?.data?.total || 0);
        }
      } else {
        setCustomToast({
          message: response?.message || "Failed to fetch reconciliations",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`relative px-6 below-md:px-3 overflow-auto border-none ${
        data?.length > 10 ? "max-h-[calc(100vh-50px)]" : "h-[500px]"
      }`}
      style={{ scrollbarWidth: "thin" }}
    >
      <ToastNotification message={customToast.message} type={customToast.type} />
      <>
      <div className="sticky z-20 bg-[#f7f8f9] pb-6 pt-4 below-md:pt-4 below-md:pb-4 tablet:pt-4">
  <div className="flex flex-row flex-nowrap gap-3 w-full below-md:flex-col">
    
    {/* Filter Controls: Back, Store, Date, Picker, Search */}
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
        options={store}
        selectedOption={selectedOption?.name || "Store"}
        onSelect={(selectedOption: any) => {
          setSelectedOption({
            name: selectedOption.name,
            id: selectedOption.id,
          });
          setIsStoreDropdownOpen(false);
        }}
        isOpen={isStoreDropdownOpen}
        toggleOpen={toggleStoreDropdown}
        widthchange="flex-1 min-w-[180px] below-lg:min-w-[153.648px] w-full"
      />

      <Dropdown
        options={dateRangeOptions}
        selectedOption={selectedDateRange}
        onSelect={(option: DateRangeOption) => handleDateRangeSelect(option)}
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
          onChange={(e) => setGlobalFilter(e.target.value)}
          onKeyDown={handleKeyDown}
          ref={searchInputRef}
          placeholder="Search"
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
            onClick={() =>
              table.getState().pagination.pageIndex === 0
                ? fetchData()
                : table.setPageIndex(0)
            }
          />
        </div>
      </div>
    </div>

    {/* Add Expenses Button */}
    <div className="below-md:hidden tablet:hidden pl-4 flex items-center">
    <AddCashreconc
              setAddReconciliation={setAddReconciliation}
              SelectedStore={selectedOption}
            />    </div>
  </div>
</div>

        {/* Mobile View: Card section */}
        <div className="block md:hidden mb-5">
          {data?.map((card, index) => (
            <div
              key={index}
              className="flex flex-col w-full rounded-lg bg-white border border-b border-[#E4E4EF] below-lg:hidden my-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4 px-3 py-4">
                  <p className="text-[14px] font-bold">
                    {new Date(card.recdate).toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex gap-5 mb-1 px-4 py-4">
                  <Editcashreconc
                    initialData={card}
                    setAddReconciliation={setAddReconciliation}
                  />
                  <Deletecashreconc
                    initialData={card}
                    setAddReconciliation={setAddReconciliation}
                    selectedStoreId={selectedOption?.id || 69}
                  />
                </div>
              </div>
              <div className="flex items-center px-4 -mt-4">
                <div className="border-t border-gray-200 w-full"></div>
              </div>
              <div className="flex justify-between items-center px-4 py-3">
                <div className="flex flex-col text-[13px] space-y-3">
                  <p className="text-[#636363]">Store</p>
                  <p className="text-[#636363]">System Balance</p>
                  <p className="text-[#636363]">Actual Balance</p>
                  <p className="text-[#636363]">Difference</p>
                </div>
                <div className="flex flex-col text-[14px] text-right space-y-3">
                  <p className="text-[#1A1A1A]">{card.storename}</p>
                  <p className="text-[#000000]">{Number(card.systembalance).toFixed(2)}</p>
                  <p className="text-[#1A1A1A]">{Number(card.actualbalance).toFixed(2)}</p>
                  <p className="text-[#1A1A1A]">
                    {(Number(card.systembalance) - Number(card.actualbalance)).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className="fixed hidden below-md:block bottom-[70px] right-3">
            <AddCashreconc
              setAddReconciliation={setAddReconciliation}
              SelectedStore={selectedOption}
            />
          </div>
          <div className="hidden below-md:block">
            <Pagination table={table} totalItems={totalItems} />
          </div>
        </div>

        {/* Web View: Reconciliations Table */}
        <div className="overflow-x-auto shadow-sm border-collapse border border-b border-[#E4E4EF] rounded-md flex-grow flex flex-col below-md:hidden">
          <div className="overflow-hidden max-w-full rounded-md">
            <table className="w-full border-collapse text-white table-fixed rounded-md">
              <thead className="bg-[#0F1044] top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="text-left px-4 py-2 text-[#FFFFFF] font-normal text-[15px] w-[100px]"
                        style={{
                          width: isScrollbarVisible
                            ? `${header.column.getSize() + 8}px`
                            : `${header.column.getSize()}px`,
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
              style={{ maxHeight: "calc(100vh - 270px)" }}
            >
              <table className="w-full border-collapse text-[12px] text-white table-fixed">
                <tbody>
                  {loading ? (
                    Array.from({ length: 10 }).map((_, index) => (
                      <tr key={index} className={index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"}>
                        {columns.map((column, colIndex) => (
                          <td key={colIndex} className="px-4 py-1.5" style={{ width: `${column.size}px` }}>
                            <Skeleton height={30} />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : data && data.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className={row.index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"}>
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="px-4 py-1.5 text-[#636363] text-[14px]"
                            style={{ width: `${cell.column.getSize()}px` }}
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
        <div className="mt-4 below-md:hidden">
          <Pagination table={table} totalItems={totalItems} />
        </div>
      </>
    </main>
  );
};

export default CashReconciliations;
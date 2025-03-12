"use client";
import React, { FC, useState, useRef, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import AddExpenses from "@/Components/ExpensesPopup/AddExpenses";
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
import DeleteExpense from "@/Components/ExpensesPopup/DeleteExpense";
import EditExpense from "@/Components/ExpensesPopup/EditExpense";
import { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";
import { sendApiRequest } from "@/utils/apiUtils";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import DeletePopup from "@/Components/UI/Delete/DeletePopup";
import NoDataFound from "@/Components/UI/NoDataFound/NoDataFound";
import Tooltip from "@/Components/UI/Toolstips/Tooltip";

interface TableRow {
  expensedate: string;
  storename: number;
  amount: string;
  description: string;
  expensename: string;
  id: any;
}

const Expenses: FC = () => {
  const router = useRouter();
  // const searchParams = useSearchParams() || new URLSearchParams();
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
  const [isOpenAddExpenses, setAddExpenses] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isVerifiedUser, setIsVerifiedUser] = useState<boolean>(false);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });

  useEffect(() => {
    if (startDate && endDate && selectedOption) {
      fetchData();
    }
  }, [selectedOption]);

  const columns: ColumnDef<TableRow>[] = [
    {
      accessorKey: "date",
      header: () => <div className="text-left ">Date</div>,
      cell: (info) => (
        <span>
          {new Date(info.row.original.expensedate).toLocaleDateString("en-US", {
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
        const Storename: any = info?.row?.original?.storename;
        const truncatedDescription =
          Storename?.length > 15 ? `${Storename?.slice(0, 15)}...` : Storename;
        return <span className="">{truncatedDescription}</span>;
      },
      // cell: (info) => <span>{info.row.original.storename}</span>,
      size: 110,
    },
    {
      accessorKey: "amount",
      header: () => <div className=" flex justify-end   mr-3">Amount</div>,
      cell: (info) => (
        <span className=" flex justify-end  mr-3">
          {info.row.original.amount}
        </span>
      ),
      size: 60,
    },
    {
      accessorKey: "description",
      header: () => <div className="text-left ml-2">Description</div>,
      cell: (info) => {
        const description = info?.row?.original?.description;
        const isTruncated = description?.length > 50;
        const truncatedDescription = isTruncated
          ? `${description?.slice(0, 55)}...`
          : description;

        return isTruncated ? (
          <Tooltip text={description} position="bottom">
            {" "}
            {/* Ensure 'text' is the correct prop for your Tooltip component */}
            <div className="text-left ml-3 cursor-pointer">
              {truncatedDescription}
            </div>
          </Tooltip>
        ) : (
          <div className="text-left ml-3">{description}</div>
        );
      },
      size: 190,
    },
    {
      accessorKey: "type",
      header: () => <div className="text-left">Type</div>,
      cell: (info) => {
        const expensename: any = info?.row?.original?.expensename;
        const isTruncated = expensename?.length > 15;
        const truncatedDescription = isTruncated
          ? `${expensename?.slice(0, 15)}...`
          : expensename;

        return isTruncated ? (
          <Tooltip text={expensename} position="bottom">
            <span className="cursor-pointer text-left">
              {truncatedDescription}
            </span>
          </Tooltip>
        ) : (
          <span className="text-left">{expensename}</span>
        );
      },
      size: 100,
    },
    {
      id: "edit",
      header: () => <div className="text-center"></div>,
      cell: (info) => (
        <>
          <span className="flex justify-center">
            <EditExpense
              initialData={info?.row?.original}
              setAddExpenses={setAddExpenses}
            />
          </span>
        </>
      ),
      size: 40,
    },
    {
      id: "delete",
      header: () => <div className="text-center"></div>,
      cell: (info) => (
        <>
          <span className="flex justify-center ">
            {" "}
            <DeletePopup
              message={"Expenses"}
              jsonData={{
                mode: "deleteExpense",
                id: Number(info?.row?.original?.id),
              }}
              setUpdatedData={setAddExpenses}
            />
          </span>
        </>
      ),
      size: 40,
    },
  ];

  const table = useReactTable({
    data: data,
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
    manualPagination: true, // Enable manual pagination
    pageCount: Math.ceil(totalItems / 10),
  });

  const { pageIndex, pageSize } = table.getState().pagination;

  const fetchData = async () => {
    setLoading(true);
    try {
      const response: any = await sendApiRequest({
        mode: "getExpenses",
        page: table.getState().pagination.pageIndex + 1,
        limit: table.getState().pagination.pageSize,
        storeid: selectedOption?.id || 69,
        startdate: startDate && format(startDate, "yyyy-MM-dd"),
        enddate: endDate && format(endDate, "yyyy-MM-dd"),
        search: globalFilter,
      });

      if (response?.status === 200) {
        setData(response?.data?.expenses);
        response?.data?.total >= 0 && setTotalItems(response?.data?.total || 0);
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
      setAddExpenses(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize, isOpenAddExpenses]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      fetchData();
    }
  };

  const getUserStore = async () => {
    try {
      const response = await sendApiRequest({ mode: "getUserStore" });
      if (response?.status === 200) {
        setStore(response?.data?.stores || []);
        if (response?.data?.stores) {
          setSelectedOption({
            name: response?.data?.stores[0]?.name,
            id: response?.data?.stores[0]?.id,
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
    const res: any = await sendApiRequest(
      {
        token: token,
      },
      `auth/verifyToken`
    );
    res?.status === 200 ? setIsVerifiedUser(true) : router.replace("/login");
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
      const currentYear = new Date().getFullYear();
      setStartDate(new Date(`${currentYear}-01-01`));
      setEndDate(new Date(`${currentYear}-12-31`));
      getUserStore();
      // fetchDropdownData();
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

  const handleError = (message: string) => {
    setCustomToast({
      message,
      type: "error",
    });
  };

  // useEffect(() => {
  //   const fetchDropdownData = async () => {
  //     try {
  //       const response = await sendApiRequest({ mode: "getAllStores" });
  //       if (response?.status === 200) {
  //         setStore(response?.data?.stores || []);
  //       } else {
  //         handleError(response?.message);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching stores:", error);
  //     }

  //   };

  //   fetchDropdownData();

  // }, []);

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
        mode: "getExpenses",
        page: table.getState().pagination.pageIndex + 1,
        limit: table.getState().pagination.pageSize,
        storeid: selectedOption?.id || 69,
        startdate: startDate && format(startDate, "yyyy-MM-dd"),
        enddate: endDate && format(endDate, "yyyy-MM-dd"),
        search: "",
      });

      if (response?.status === 200) {
        setData(response?.data?.expenses);
        response?.data?.total >= 0 && setTotalItems(response?.data?.total || 0);
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
      setAddExpenses(false);
    }
  };

  return (
    <main
      className={`relative px-6 below-md:px-3 overflow-auto border-none ${
        data?.length > 10 ? "max-h-[calc(100vh-50px)]" : "h-[500px]"
      }`}
      style={{ scrollbarWidth: "thin" }}
    >
      <>
        <div className="flex flex-row below-md:flex-col w-full below-md:item-start below-md:mt-4 below-md:mb-4 mt-6 mb-6">
          <div className="flex flex-row gap-3 below-md:gap-2 below-md:space-y-1 w-full below-md:flex-col">
            {showBackIcon && (
              <img
                onClick={() => router.back()}
                alt="Back Arrow"
                className="w-7 h-7 mt-1 below-md:hidden cursor-pointer"
                src="/images/webbackicon.svg"
              ></img>
            )}
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
              widthchange="w-[60%]"
            />
            <div className="w-full tablet:w-full below-md:w-full h-[35px]">
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                fetchData={fetchData}
              />
            </div>

            <div className="flex relative border border-gray-300 below-md:w-full text-[12px] bg-[#ffff] items-center rounded w-full h-[35px]">
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
                onClick={fetchData}
              />
            </div>
          </div>
          <div className="block pl-24 below-md:hidden">
            <AddExpenses
              setAddExpenses={setAddExpenses}
              SelectedStore={selectedOption}
            />
          </div>
        </div>

        {/*Mobile View : Card section */}
        <div className="block md:hidden mb-5">
          {data?.map((card, index) => (
            <div
              key={index}
              className="flex flex-col w-full rounded-lg bg-white border border-b border-[#E4E4EF] below-lg:hidden my-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4 px-3 py-4">
                  <p className="text-[14px] font-bold">
                    {new Date(card.expensedate).toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "2-digit",
                    })}
                  </p>
                  <p className="text-[14px] font-bold">{card.expensename}</p>
                </div>

                <div className="flex gap-5 mb-1 px-4 py-4">
                  <>
                    <EditExpense
                      initialData={card}
                      setAddExpenses={setAddExpenses}
                    />
                    <DeletePopup
                      message={"Expense"}
                      jsonData={{ mode: "deleteExpense", id: Number(card.id) }}
                      setUpdatedData={setAddExpenses}
                    />
                  </>
                </div>
              </div>
              {/* Divider */}
              <div className="flex items-center px-4 -mt-4">
                <div className="border-t border-gray-200 w-full"></div>
              </div>
              {/* Content Area */}
              <div className="flex justify-between items-center px-4 py-3">
                <div className="flex flex-col text-[13px] space-y-3">
                  <p className="text-[#636363]">Store</p>
                  <p className="text-[#636363]">Amount</p>
                  <p className="text-[#636363]">Description</p>
                </div>
                <div className="flex flex-col text-[14px] text-right space-y-3">
                  <p className="text-[#1A1A1A]">{card.storename}</p>
                  <p className="text-[#000000]">{card.amount}</p>
                  <p className="text-[#1A1A1A]">{card.description}</p>
                </div>
              </div>
            </div>
          ))}
          <div className=" fixed hidden below-md:block bottom-[70px] right-3">
            {" "}
            <AddExpenses setAddExpenses={setAddExpenses} />
          </div>
          <div className="hidden below-md:block ">
            <Pagination table={table} totalItems={totalItems} />
          </div>
        </div>

        {/*Web View :  Expenses Table */}
        <div className="overflow-x-auto shadow-sm border-collapse border border-b border-[#E4E4EF] rounded-md  flex-grow flex flex-col below-md:hidden">
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
                            ? `${header.column.getSize() + 8}px` // Add 10px if scrollbar is visible
                            : `${header.column.getSize()}px`,
                        }}
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
              ref={containerRef}
              className="w-full overflow-y-auto scrollbar-thin flex-grow"
              style={{ maxHeight: "calc(100vh - 270px)" }}
            >
              <table className="w-full border-collapse text-[12px] text-white table-fixed">
                <tbody>
                  {loading ? (
                    /* Show skeleton loaders while loading */
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
                  ) : data && data.length > 0 ? (
                    /* Render actual data */
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
                    /* Show No Data Found only when data is fully loaded and empty */
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
        <div className="mt-4  below-md:hidden">
          <Pagination table={table} totalItems={totalItems} />
        </div>
      </>
    </main>
  );
};

export default Expenses;

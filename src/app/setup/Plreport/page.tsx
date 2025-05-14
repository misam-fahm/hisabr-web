"use client";
import React, { FC, useState, useRef, useEffect } from "react";
import Dropdown from "@/Components/UI/Themes/DropDown";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";
import { sendApiRequest } from "@/utils/apiUtils";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NoDataFound from "@/Components/UI/NoDataFound/NoDataFound";

interface ExpensesPageData {
  storeid: string;
  startdate: string;
  enddate: string;
  months: number;
}

interface TableRow {
  label: string;
  value: number;
}

interface YearOption {
  name: string;
  value: string;
  id: number;
}

const PLReport: FC = () => {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isYearOpen, setIsYearOpen] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [isScrollbarVisible, setIsScrollbarVisible] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [data, setData] = useState<TableRow[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalCogsAmount, setTotalCogsAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStore, setSelectedStore] = useState<any>();
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState<boolean>(false);
  const [stores, setStores] = useState<any[]>([]);
  const [isVerifiedUser, setIsVerifiedUser] = useState<boolean>(false);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });
  const [netSales, setNetSales] = useState<number>(0);
  const [pageData, setPageData] = useState<ExpensesPageData | null>(null);
  const [months, setMonths] = useState<number>(12);

  const formatAmount = (value: number) => {
    return value
      ? `$${value.toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}`
      : "$0";
  };

  const columns: ColumnDef<TableRow>[] = [
    {
      accessorKey: "label",
      header: () => <div className="text-left">Operating Expenses</div>,
      cell: (info) => <span>{String(info.getValue() || "N/A")}</span>,
      size: 200,
    },
    {
      accessorKey: "value",
      header: () => <div className="text-right pr-3">Amount</div>,
      cell: (info) => (
        <span className="text-right block pr-3">
          {formatAmount(Number(info.getValue()))}
        </span>
      ),
      size: 100,
    },
    {
      accessorKey: "percentage",
      header: () => <div className="text-right pr-3">%</div>,
      cell: (info) => (
        <span className="text-right block pr-3">
          {Number((info.row.original.value / totalAmount) * 100).toFixed(2)}%
        </span>
      ),
      size: 100,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 1000,
        pageIndex: 0,
      },
    },
  });

  const yearOptions: YearOption[] = [
    { name: "2023", value: "2023", id: 1 },
    { name: "2024", value: "2024", id: 2 },
    { name: "2025", value: "2025", id: 3 },
    { name: "2026", value: "2026", id: 4 },
    { name: "2027", value: "2027", id: 5 },
  ];

  const toggleYearDropdown = () => {
    setIsYearOpen((prev) => !prev);
    setIsStoreDropdownOpen(false);
  };

  const handleYearSelect = (option: YearOption) => {
    setSelectedYear(option.name);
    setIsYearOpen(false);
  };

  useEffect(() => {
    const storedData = localStorage.getItem("expensesPageData");
    if (storedData) {
      try {
        const parsedData: ExpensesPageData = JSON.parse(storedData);
        if (
          parsedData.storeid &&
          parsedData.startdate &&
          parsedData.enddate &&
          parsedData.months
        ) {
          setPageData(parsedData);
          setMonths(parsedData.months);
        } else {
          setCustomToast({
            message: "Incomplete data in storage",
            type: "error",
          });
        }
      } catch (err) {
        setCustomToast({
          message: "Error parsing stored data",
          type: "error",
        });
      }
    } else {
      setCustomToast({
        message: "Missing required parameters",
        type: "error",
      });
    }
  }, []);

  const fetchData = async () => {
    if (!pageData && !selectedStore) return;
    setLoading(true);
    try {
      const response: any = await sendApiRequest({
        mode: "getplreport",
        storeid: selectedStore?.id || pageData?.storeid || 69,
        startdate: `${selectedYear}-01-01`,
        enddate: `${selectedYear}-12-31`,
        search: globalFilter,
      });

      if (response?.status === 200) {
        const saleskpi = response?.data?.expenses[0];
        const config = saleskpi?.config || {};
        const additionalExpenses = saleskpi?.additional_expense || [];
        const cogs = saleskpi?.cogs || [];

        const payrollTaxAmt =
          saleskpi?.labour_cost && config?.payroll_tax
            ? saleskpi.labour_cost * (config.payroll_tax / 100)
            : 0;

        const allExpenses: TableRow[] = [
          { label: "Payroll Tax", value: payrollTaxAmt },
          { label: "PAR", value: (config.par || 0) * months },
          { label: "NuCO2", value: (config.nuco2 || 0) * months },
          { label: "Trash", value: (config.trash || 0) * months },
          { label: "Repairs", value: (config.repair_exp || 0) * months },
          { label: "Gas Bill", value: (config.gas_bill_exp || 0) * months },
          { label: "Internet", value: (config.internet_exp || 0) * months },
          {
            label: "Insurance",
            value: ((config.insurance_exp || 0) / 12) * months,
          },
          { label: "Water Bill", value: (config.water_bill_exp || 0) * months },
          {
            label: "Property Tax",
            value: ((config.property_tax_exp || 0) / 12) * months,
          },
          {
            label: "Rent/Mortgage",
            value: (config.rent_mortgage_exp || 0) * months,
          },
          {
            label: "Labor Salary",
            value: (config.labor_operat_salary_exp || 0) * months,
          },
          ...(additionalExpenses || []).map((exp: any) => ({
            label: exp.expname,
            value: Number(exp.amount) || 0,
          })),
        ].filter((item) => item.value > 0);

        const sortedExpenses = allExpenses.sort((a, b) => b.value - a.value);

        const total = sortedExpenses.reduce(
          (sum: number, expense: TableRow) => sum + expense.value,
          0
        );

        const totalCogs = cogs.reduce(
          (sum: number, item: any) => sum + (Number(item.producttotal) || 0),
          0
        );

        setData(sortedExpenses);
        setNetSales(saleskpi.net_sales || 0);
        setTotalItems(sortedExpenses.length);
        setTotalAmount(total);
        setTotalCogsAmount(totalCogs);
      } else {
        setCustomToast({
          message: response?.message,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setCustomToast({
        message: "Error fetching expenses data",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ((selectedStore || pageData) && selectedYear) {
      fetchData();
    }
  }, [selectedStore, selectedYear, globalFilter, months, pageData]);

  const getUserStore = async () => {
    try {
      const response = await sendApiRequest({ mode: "getUserStore" });
      if (response?.status === 200) {
        const formattedStores = response?.data?.stores.map((store: any) => ({
          name: `${store.name} - ${store.location || "Unknown Location"}`,
          id: store.id,
        }));
        setStores(formattedStores);
        if (formattedStores.length > 0) {
          setSelectedStore(formattedStores[0]);
        }
      } else {
        setCustomToast({
          message: response?.message,
          type: "error",
        });
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
  }, []);

  useEffect(() => {
    if (isVerifiedUser) {
      getUserStore();
    }
  }, [isVerifiedUser]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      fetchData();
    }
  };

  const toggleStoreDropdown = () => {
    setIsStoreDropdownOpen((prev) => !prev);
    setIsYearOpen(false);
  };

  const clearSearch = async () => {
    setGlobalFilter("");
    fetchData();
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkScrollbarVisibility = () => {
      const hasScrollbar = container.scrollHeight > container.clientHeight;
      setIsScrollbarVisible(hasScrollbar);
    };

    checkScrollbarVisibility();
    const observer = new MutationObserver(checkScrollbarVisibility);
    observer.observe(container, { childList: true, subtree: true });
    window.addEventListener("resize", checkScrollbarVisibility);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", checkScrollbarVisibility);
    };
  }, [table]);

  // Extract store location from selectedStore.name (e.g., "13246 - Watkinsville" -> "Watkinsville")
  const storeLocation = selectedStore?.name
    ? selectedStore.name.split(" - ")[1] || "Unknown Location"
    : "Select a Store";

  return (
    <main
      className={`relative px-6 below-md:px-3 overflow-auto border-none h-full ${
        data.length > 10 ? "max-h-[calc(100vh-50px)]" : "min-h-[500px]"
      }`}
      style={{ scrollbarWidth: "thin" }}
    >
      <div className="sticky top-0 z-20 bg-[#f7f8f9] pb-6 pt-4 below-md:pt-3 below-md:pb-3 tablet:pt-3">
        <div className="flex flex-col gap-3 w-full below-md:flex-col tablet:flex-col tablet-home:flex-row">
          <div className="flex flex-row gap-2 w-full below-md:flex-col tablet:flex-row tablet-home:flex-row">
            <Dropdown
              options={stores}
              selectedOption={selectedStore?.name || "Store"}
              onSelect={(option: any) => {
                setSelectedStore(option);
                setIsStoreDropdownOpen(false);
              }}
              isOpen={isStoreDropdownOpen}
              toggleOpen={toggleStoreDropdown}
              widthchange="max-w-[200px] w-full below-md:min-w-full tablet:min-w-[140px] tablet-home:min-w-[161px]"
            />
            <Dropdown
              options={yearOptions}
              selectedOption={selectedYear}
              onSelect={handleYearSelect}
              isOpen={isYearOpen}
              toggleOpen={toggleYearDropdown}
              widthchange="max-w-[100px] w-full below-md:min-w-full tablet:min-w-[120px] tablet-home:min-w-[140px]"
            />
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold uppercase">Income Statement</h1>
        <p className="text-lg font-semibold">{storeLocation}</p>
        <p className="text-md">
          For the year ended December 31, {selectedYear}
        </p>
      </div>

      <div className="flex gap-6 below-md:grid below-md:grid-cols-1 below-md:gap-3 below-md:pl-3 below-md:pr-3 tablet:grid tablet:grid-cols-2">
        <div className="flex flex-row bg-[#FFFFFF] rounded-lg mb-8 shadow-sm border-[#7b7b7b] border-b-4 w-[20%] tablet:w-[100%] below-md:w-full p-3 below-md:p-3 justify-between items-stretch">
          <div className="flex flex-col gap-2">
            <p className="text-[14px] text-[#575F6DCC] font-bold">Net Sales</p>
            <p className="text-[18px] text-[#2D3748] font-bold">
              {loading ? <Skeleton width={100} /> : formatAmount(netSales)}
            </p>
          </div>
        </div>

        <div className="flex flex-row bg-[#FFFFFF] rounded-lg mb-8 shadow-sm border-[#7b7b7b] border-b-4 w-[20%] tablet:w-[100%] below-md:w-full p-3 below-md:p-3 justify-between items-stretch">
          <div className="flex flex-col gap-2">
            <p className="text-[14px] text-[#575F6DCC] font-bold">Cost of Goods</p>
            <p className="text-[18px] text-[#2D3748] font-bold">
              {loading ? <Skeleton width={100} /> : formatAmount(totalCogsAmount)}
            </p>
          </div>
        </div>
      </div>

      <div className="shadow-sm border border-[#E4E4EF] rounded-md flex-grow flex flex-col">
        <div className="w-full rounded-md">
          <table className="w-full border-collapse text-[12px] below-md:text-[11px] tablet:text-[11px] table-auto rounded-md">
            <thead className="bg-[#0F1044]">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-left px-4 py-2 text-[#FFFFFF] font-normal text-[14px] below-md:text-[12px] tablet:text-[13px]"
                      style={{
                        minWidth: `${header.column.getSize()}px`,
                        width: `${header.column.getSize()}px`, // Removed isScrollbarVisible logic
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"}
                  >
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className="px-4 py-1.5"
                        style={{ minWidth: `${column.size}px` }}
                      >
                        <Skeleton height={30} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data.length > 0 ? (
                <>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className={
                        row.index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"
                      }
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-4 py-1.5 text-[#636363] text-[13px] below-md:text-[11px] tablet:text-[12px]"
                          style={{ minWidth: `${cell.column.getSize()}px` }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {data.length > 0 && !loading && (
                    <tr className="bg-[#0F1044] text-white border-t border-[#E4E4EF]">
                      <td
                        className="px-4 py-1.5 text-[13px] font-bold below-md:text-[11px] tablet:text-[12px]"
                        style={{ minWidth: `${columns[0].size}px` }}
                      >
                        Total
                      </td>
                      <td
                        className="px-4 py-1.5 text-[13px] text-right pr-3 below-md:text-[11px] tablet:text-[12px]"
                        style={{ minWidth: `${columns[1].size}px` }}
                      >
                        {formatAmount(totalAmount)}
                      </td>
                      <td
                        className="px-4 py-1.5 text-[13px] text-right pr-3 below-md:text-[11px] tablet:text-[12px]"
                        style={{ minWidth: `${columns[2].size}px` }}
                      >
                        100.00%
                      </td>
                    </tr>
                  )}
                </>
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-6 text-center text-[13px] below-md:text-[11px] tablet:text-[12px]"
                  >
                    <NoDataFound />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default PLReport;
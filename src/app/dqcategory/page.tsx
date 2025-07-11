"use client";
import React, { FC, useEffect, useState } from "react";
import DateRangePicker from "@/Components/UI/Themes/DateRangePicker";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Pagination from "@/Components/UI/Pagination/Pagination";
import Dropdown from "@/Components/UI/Themes/DropDown";
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
import { sendApiRequest } from "@/utils/apiUtils";
import ToastNotification, {
  ToastNotificationProps,
} from "@/Components/UI/ToastNotification/ToastNotification";
import moment from "moment";
import Loading from "@/Components/UI/Themes/Loading";
import NoDataFound from "@/Components/UI/NoDataFound/NoDataFound";
import Tooltip from "@/Components/UI/Toolstips/Tooltip";

interface TableRow {
  name: string;
  totalqty: any;
  totalextprice: any;
  subtotal: number;
}

interface DateRangeOption {
  name: string;
  value?: string;
  id: number;
}

const Exceldata = [
  [
    "Store Number",
    "Store Address",
    "Dairy Queen",
    "DQ Food",
    "Beverages",
    "Breakfast",
    "Cakes",
    "OJ Beverages",
    "Mix Gall\\Litre",
    "Meat Lbs\\Kg",
    "8 Round",
    "10 Round",
    "Sheet",
    "Dilly",
    "Starkiss",
    "NF/NSA Bars",
    "NSA/Non Dairy Dilly",
    "Buster Bar",
    "Transaction Count",
    "Inventory Purchases",
    "Ending Inventory",
  ],
  [
    "13246",
    "2342 Hog Mounta Watkinsville GA",
    "65542.00",
    "99285.00",
    "0.00",
    "0.00",
    "0.00",
    "0.00",
    "1200.00",
    "1000.00",
    "0.00",
    "2.00",
    "0.00",
    "0.00",
    "0.00",
    "0.00",
    "0.00",
    "0.00",
    "0.00",
    "0.00",
    "0.00",
  ],
  [
    "",
    "",
    "softserve",
    "Food",
    "Beverages",
    "BF",
    "Cakes",
    "static 0",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "ORDER COUNT",
    "COGS AMOUNT",
    "LAST SYSCO & GORDON INVOICE",
    "AMOUNT",
  ],
];

const Sales: FC = () => {
  const router = useRouter();
  const [items, setItems] = useState<any>([]);
  const [Sitems, setSItems] = useState<any>([]);
  const [address, setAddress] = useState<any>();

  const [subtotal, setSubtotal] = useState<number | null>(null);
  const [totalOrders, setTotalOrders] = useState<number>();
  const [totalsalecount, setTotalSaleCount] = useState<number>(0);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState<boolean>(false);
const [selectedDateRange, setSelectedDateRange] = useState<string>("This Month (MTD)");
  const [productTotal, setProductTotal] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [uploadPdfloading, setUploadPdfLoading] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<any>();
  const [isVerifiedUser, setIsVerifiedUser] = useState<boolean>(false);
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [store, setStore] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });
  const [globalFilter, setGlobalFilter] = React.useState("");

  // const navigateToSalesView = (salesId: any) => {
  //   const encodedId = btoa(salesId);
  //   const urlSafeEncodedId = encodedId?.replace(/\+/g, '-')?.replace(/\//g, '_')?.replace(/=+$/, '');
  //   router.push(`/sales/${urlSafeEncodedId}`);
  // };

  // const columns: ColumnDef<TableRow>[] = [
  //   {
  //     accessorKey: "name",
  //     header: () => <div className="text-left">Name</div>,
  //     cell: (info) => <span>{info.getValue() as string}</span>,
  //     size: 100,
  //   },

  //   {
  //     accessorKey: "totalqty",
  //     header: () => <div className="text-right mr-10">Quantity</div>,
  //     cell: (info) => (
  //       <div className="text-right mr-10">{info.getValue() as number}</div>
  //     ),
  //     size: 120,
  //   },
  //   {
  //     accessorKey: "totalextprice",
  //     header: () => <div className="text-right mr-10">Amount</div>,
  //     cell: (info) => (
  //       <div className="text-right mr-10">{info.getValue() as number}</div>
  //     ),
  //     size: 120,
  //   },
  // ];

  // const table = useReactTable({
  //   data: items,
  //   columns,
  //   getCoreRowModel: getCoreRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  //   getFilteredRowModel: getFilteredRowModel(),
  //   state: {
  //     globalFilter,
  //   },
  //   initialState: {
  //     pagination: {
  //       pageSize: 10,
  //       pageIndex: 0,
  //     },
  //   },
  //   manualPagination: true, // Enable manual pagination
  //   // pageCount: Math.ceil(totalItems / 10),
  // });

  // const { pageIndex, pageSize } = table.getState().pagination;

  const mergeCategories = (categories: any[]) => {
    // Initialize the merged category
    let dqIceCream = {
        name: "DQ (Ice Cream)",
        totalqty: 0,
        totalextprice: 0,
    };

    // Filter out categories to merge and calculate totals, then map for renaming
    const filteredCategories = categories
        .filter((category) => {
            if (category.name === "Soft Serve" || category.name === "Novelties-Boxed") {
                dqIceCream.totalqty += Number(category.totalqty || 0); // Handle undefined/null
                dqIceCream.totalextprice += Number(category.totalextprice || 0); // Handle undefined/null
                return false; // Exclude from final array
            }
            return true; // Keep other categories
        })
        .map((category) => {
            if (category.name === "Mix Ice Cream") {
                return { ...category, name: "Mix Gall\\Litre" };
            }
            return category;
        });

    // Only add "DQ (Ice Cream)" if it has non-zero values
    if (dqIceCream.totalqty > 0 || dqIceCream.totalextprice > 0) {
        filteredCategories.push(dqIceCream);
    }

    return filteredCategories;
};  

  const dateRangeOptions: DateRangeOption[] = [
    { name: "This Month (MTD)", value: "this_month", id: 1 },
    { name: "This Year (YTD)", value: "this_year", id: 2 },
    { name: "Last Month", value: "last_month", id: 3 },
    { name: "Last Year", value: "last_year", id: 4 },
  ];
  
  // Add handler functions within the Sales component
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

  const fetchData2 = async () => {
    setLoading(true);
    try {
      const response: any = await sendApiRequest({
        mode: "getDqRevCenterData",
        storeid: selectedOption?.id || 69,
        startdate: startDate && format(startDate, "yyyy-MM-dd"),
        enddate: endDate && format(endDate, "yyyy-MM-dd"),
      });

      if (response?.status === 200) {
        const dqcategories = response?.data?.result?.dqcategories || [];
        const mergedCategories = mergeCategories(dqcategories);
        setSItems(mergedCategories);
        setTotalOrders(response?.data?.result?.totalorders);
        setTotalSaleCount(response?.data?.result?.totalsalecount || 0);
      } else {
        setCustomToast({
          message: response?.message || "Failed to fetch sales.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setCustomToast({
        message: "An error occurred while fetching data.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response: any = await sendApiRequest({
        mode: "getDqRevCenterData",
        sp: "GetDQCategoryData",
        storeid: selectedOption?.id || 69,
        startdate: startDate && format(startDate, "yyyy-MM-dd"),
        enddate: endDate && format(endDate, "yyyy-MM-dd"),
      });

      if (response?.status === 200) {
        setItems(response?.data?.result.dqcategories);
        setProductTotal(response?.data?.result?.producttotal);
        setSubtotal(response?.data?.result?.subtotal || 0);
      } else {
        setCustomToast({
          message: response?.message || "Failed to fetch sales.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataForAddress = async () => {
    setLoading(true);
    try {
      const response: any = await sendApiRequest({
        mode: "getStoreByName",
        storename: selectedOption?.name || "13246",
      });

      if (response?.status === 200) {
        response?.data?.store ? setAddress(response?.data?.store[0]) : [];
      } else {
        setCustomToast({
          message: response?.message || "Failed to fetch sales.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate && selectedOption) {
      fetchData2();
      fetchData();
      // fetchDataForAddress();
    }
    1;
  }, [selectedOption]);

  const getUserStore = async () => {
    try {
      const response = await sendApiRequest({ mode: "getUserStore" });
      if (response?.status === 200) {
        const stores = response?.data?.stores || [];
        // Map stores to the format expected by the Dropdown component
        const formattedStores = stores?.map((store) => ({
          name: `${store?.name} - ${store?.location || "Unknown Location"}`,
          id: store?.id,
        }));

        setStore(formattedStores);

        if (stores.length > 0) {
          setSelectedOption({
            name: `${stores[0]?.name} - ${stores[0]?.location || "Unknown Location"}`,
            id: stores[0]?.id,
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
      const res: any = await sendApiRequest(
        {
          token: token,
        },
        `auth/verifyToken`
      );
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

 // ...existing code...
useEffect(() => {
  if (isVerifiedUser) {
    // Calculate last month's start and end dates
    const today = new Date();
    const lastMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
    const lastMonthYear = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
    const lastMonthStart = new Date(lastMonthYear, lastMonth, 1);
    const lastMonthEnd = new Date(lastMonthYear, lastMonth + 1, 0);

    setStartDate(lastMonthStart);
    setEndDate(lastMonthEnd);
    setSelectedDateRange("Last Month"); // Set the dropdown to "Last Month"
    getUserStore();
  }
}, [isVerifiedUser]);
// ...existing code...
  
  useEffect(() => {
    if (startDate && endDate && selectedOption) {
      fetchData2();
      fetchData();
    }
  }, [selectedOption, startDate, endDate]);

  const toggleStoreDropdown = () => {
    setIsStoreDropdownOpen((prev) => !prev);
  };

  const handleError = (message: string) => {
    setCustomToast({
      message,
      type: "error",
    });
  };

  //   const totalQty = items?.reduce((acc:any, row:any) => acc + Number(row.totalqty), 0);
  // const totalExtPrice = items?.reduce((acc:any, row:any) => acc + Number(row.totalextprice), 0);

  // Ensure there's no error when `items` is empty
  // const hasItems = items && items.length > 0;

  const categoryMap = {
    "8 Round": "8\" Round Cake",
    "10 Round": "10\" Round Cake",
    "Sheet Cake": "Sheet",
    "Dilly Bar": "Dilly",
    "NF/NSA Bars (No sugar added)": "NF/NSA Bars",
    "Buster Bar": "Buster Bar",
    Beverage: "Beverages",
    Cakes: "Cakes",
    Food: "DQ Food",
    Starkiss: "Starkiss",
    "Soft Serve": "Dairy Queen",
    "Mix Ice Cream": "Mix Gall\\Litre",
    "DQ (Ice Cream)": "Dairy Queen", // Map "Dairy Queen" to "DQ (Ice Cream)"
    Meat: "Meat Lbs\\Kg",
    "8\" Round Cake": "8 Round",
    "10\" Round Cake": "10 Round",
  };

  const getTotalByCategory = (name) => {
    const allData = [...(items || []), ...(Sitems || [])];
    const category = allData.find((item) => item.name === name);
    return category && category.totalextprice !== undefined && category.totalextprice !== null
      ? Math.round(category.totalextprice)
      : 0;
  };

  const mapData = () => {
    const header = [
      "Store Number",
      "Store Address",
      "Dairy Queen",
      "DQ Food",
      "Beverages",
      "Breakfast",
      "Cakes",
      "OJ Beverages",
      "Mix Gall\\Litre",
      "Meat Lbs\\Kg",
      "8 Round",
      "10 Round",
      "Sheet",
      "Dilly",
      "Starkiss",
      "NF/NSA Bars",
      "NSA/Non Dairy Dilly",
      "Buster Bar",
      "Transaction Count",
      "Inventory Purchases",
      "Ending Inventory",
    ];

    const allData = [...(items || []), ...(Sitems || [])];
    const nameMapping = allData.reduce((acc, item) => {
      const mappedName = categoryMap[item.name] || item.name;
      acc[mappedName] = item.name;
      return acc;
    }, {});

    let storeNumber = "";
    let storeAddress = "";
    if (selectedOption?.name) {
      const [number, ...locationParts] = selectedOption.name.split(" - ");
      storeNumber = number || "";
      storeAddress = locationParts.join(" - ") || "";
    }

    const firstRow = header.map((category) => {
      if (category === "Store Number") return storeNumber;
      if (category === "Store Address") return storeAddress;
      if (category === "Transaction Count") return totalOrders || 0;
      if (category === "Inventory Purchases") return productTotal ? Math.round(productTotal) : 0;
      if (category === "Ending Inventory") return Math.round(subtotal || 0);

      const originalName = nameMapping[category] || category;
      if (category === "Cakes") {
        const cakesItem = allData.find((item) => item.name === "Cakes");
        let totalCakes = (cakesItem?.totalextprice || 0);
        return Math.round(totalCakes);
      }
      if (category === "Meat Lbs\\Kg") {
        const meatItem = allData.find((item) => item.name === "Meat");
        return meatItem?.totalqty ? Math.round(meatItem.totalqty * 20) : 0;
      }
      return getTotalByCategory(originalName);
    });

    const secondRow = header.map((category) => {
      const originalName = nameMapping[category] || category;
      const item = allData.find((item) => item.name === originalName);
      if (["8 Round", "10 Round", "Sheet"].includes(category)) {
        return item?.qty_times_pieces ? Math.round(item.qty_times_pieces) : 0;
      }
      if (["Dilly", "Starkiss", "NF/NSA Bars", "Buster Bar"].includes(category)) {
        return item?.totalqty ? Math.round(item.totalqty) : 0;
      }
      return "";
    });

    return [header, firstRow, secondRow];
  };

  const exportToExcel = () => {
    const [headers, firstRow, secondRow] = mapData();
    const worksheet = XLSX.utils.aoa_to_sheet([headers, firstRow, secondRow]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Define column widths to match the uploaded Excel file
    const wscols = [
      { wch: 20 },
      { wch: 35 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 15 },
      { wch: 15 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
    ];
    worksheet["!cols"] = wscols;

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "data.xlsx");
  };

  return (
    <main
      className={`relative px-6 below-md:px-3  overflow-auto ${
        items?.length > 6 || Sitems?.length > 6
          ? "max-h-[calc(100vh-60px)]"
          : "h-[620px]"
      }`}
      style={{ scrollbarWidth: "thin" }}
    >
      <ToastNotification
        message={customToast?.message}
        type={customToast?.type}
      />
      {uploadPdfloading && <Loading />}
      <div className="px-6 mt-3 below-md:px-3 below-md:mt-0 tablet:mt-4">
      <div className="flex flex-row justify-between below-md:flex-col pb-2 sticky z-20 w-full below-md:pt-4 tablet:pt-4 bg-[#f7f8f9] below-md:pb-4 gap-6 tablet:grid tablet:grid-cols-2">
  <div className="flex flex-row below-md:flex-col w-[70%] tablet:w-[100%] below-md:w-full gap-3 below-md:gap-4 tablet:col-span-2">
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
      widthchange="w-[35%] tablet:w-full below-md:w-full"
      />
    <Dropdown
      options={dateRangeOptions}
      selectedOption={selectedDateRange}
      onSelect={(option: DateRangeOption) => handleDateRangeSelect(option)}
      isOpen={isDateRangeOpen}
      toggleOpen={toggleDateRangeDropdown}
      widthchange="w-[30%] tablet:w-full below-md:w-full"
    />
    <div className="w-[300px] tablet:w-full below-md:w-full">
    <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        fetchData={fetchData}
        fetchDataForTender={fetchData2}
      />
    </div>
  </div>

          {/* Export Button with padding */}
          <div className="flex below-md:w-full below-md:pt-4 gap-6 items-center below-md:justify-center">
            <button
              className="w-[159px] below-md:w-[90%]  h-[35px] bg-[#168A6F] hover:bg-[#11735C] text-white font-medium rounded-md text-[13px] flex items-center justify-center px-4 py-2 gap-[0.25rem]"
              onClick={exportToExcel}
            >
              <img
                className="rotate-180"
                src="/images/webuploadicon.svg"
                alt=""
              />
              Export File
            </button>
          </div>
        </div>

        {/** Table */}

        {/* Table */}
        {/* Desktop View */}
        {/* <div className="tablet:hidden overflow-x-auto border-collapse border border-[#E4E4EF] rounded-lg flex-grow hidden flex-col md:block shadow-sm">
          <div className="overflow-hidden max-w-full">
            <table className="w-full border-collapse border-gray-200 table-fixed shadow-lg">
              <thead className="bg-[#0F1044] top-0 z-10">
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
                  Array.from({ length: 8 })?.map((_, index) => (
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
                ) : items === null ? (
                  
                  <tr>
                    <td colSpan={columns.length} className="py-6 text-center">
                      <NoDataFound />
                    </td>
                  </tr>
                )
                :
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
                  ))}
                </tbody>
                {hasItems && (
      <tfoot className="-bottom-1 bg-white sticky">
        <tr className="text-[black] text-[14px]">
          <td className="px-4 py-1.5 border-t text-left border-gray-200 font-medium">
            Total
          </td>
          <td className="px-4 py-1.5 border-t  pr-14 text-right border-gray-200 text-[14px] font-medium">
            {totalQty}
          </td>
          <td className="px-4 py-1.5 border-t pr-14 text-right border-gray-200 text-[14px] font-medium">
            ${totalExtPrice.toFixed(2)}
          </td>
        </tr>
      </tfoot>
    )}
              </table>  
            </div>
          </div>
        </div> */}

<div className="flex gap-6 below-md:grid below-md:grid-cols-1 below-md:gap-3 below-md:pl-3 below-md:pr-3 tablet:grid tablet:grid-cols-2">
  {/* COGS */}
  <div className="flex flex-row bg-[#FFFFFF] rounded-lg mb-8 shadow-sm border-[#7b7b7b] border-b-4 w-[20%] tablet:w-[100%] below-md:w-full p-3 below-md:p-3 justify-between items-stretch">
    <div className="flex flex-col gap-2">
      <p className="text-[14px] text-[#575F6DCC] font-bold">COGS</p>
      <p className="text-[18px] text-[#2D3748] font-bold">
        {productTotal
          ? `$${productTotal.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
          : "$0"}
      </p>
    </div>
  </div>

  {/* Order Counts */}
  <div className="flex flex-row bg-[#FFFFFF] rounded-lg mb-8 shadow-sm border-[#7b7b7b] border-b-4 w-[20%]  tablet:w-[100%] below-md:w-full p-3 below-md:p-3 justify-between items-stretch">
    <div className="flex flex-col gap-2">
      <p className="text-[14px] text-[#575F6DCC] font-bold">Order Counts</p>
      <p className="text-[18px] text-[#2D3748] font-bold">
        {totalOrders ? totalOrders.toLocaleString("en-US") : "0"}
      </p>
    </div>
  </div>

  {/* Ending Inventory (always visible) */}
  <div className="flex flex-row bg-[#FFFFFF] rounded-lg mb-8 shadow-sm border-[#7b7b7b] border-b-4 w-[20%] tablet:w-[100%] below-md:w-full p-3 below-md:p-3 justify-between items-stretch">
    <div className="flex flex-col gap-2">
      <p className="text-[14px] text-[#575F6DCC] font-bold">Ending Inventory</p>
      <p className="text-[18px] text-[#2D3748] font-bold">
        ${subtotal
          ? subtotal.toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })
          : "0"}
      </p>
    </div>
  </div>
</div>

   <div className="grid grid-cols-5 ipad-pro:grid-cols-4 ipad-air:grid-cols-4 tablet:grid-cols-2 below-md:grid-cols-1 w-full h-full gap-6 below-md:gap-3 below-md:pl-3 below-md:pr-3 items-stretch tablet:flex-wrap tablet:gap-3">
  {["DQ (Ice Cream)", "Food", "Cakes", "Beverage"].map((categoryName, index) => {
    const item = Sitems?.find((i: any) => i.name === categoryName);
    return (
      <div
        key={index}
        className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#b1d0b3] border-b-4 p-2 justify-between items-stretch w-full ipad-air:w-[105%]"
      >
        <div className="flex flex-col gap-2">
          <Tooltip position="left" text={categoryName?.length > 15 ? categoryName : ""}>
            <p className="text-[16px] text-[#575F6DCC] font-bold h-7">
              {categoryName?.length > 15 ? categoryName.substring(0, 15) + "..." : categoryName || "--"}
            </p>
          </Tooltip>
          <p className="text-[20px] text-[#2D3748] font-bold">
            {item?.totalextprice ? `$${Math.round(item.totalextprice).toLocaleString()}` : "$0"}
          </p>
        </div>
      </div>
    );
  })}
</div>

        {/* Item Cards */}
        <div className="grid grid-cols-5 ipad-pro:grid-cols-4 ipad-air:grid-cols-4 tablet:grid-cols-2 below-md:grid-cols-1 w-full h-full gap-6 below-md:gap-3 below-md:pl-3 below-md:pr-3 mt-6 items-stretch tablet:flex-wrap tablet:gap-3">
          {items?.map((Items, index) => (
            <div
              key={index}
              className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#cf4040] border-b-4 p-3 justify-between items-center w-full ipad-air:w-[105%] gap-6 relative"
            >
              <div className="flex flex-col gap-2">
                {" "}
                {/* Changed from gap-3 to gap-2 */}
                <Tooltip
                  position="left"
                  text={Items?.name?.length > 9 ? Items.name : ""} // Tooltip shows full name if longer than 9 characters
                >
                  <p className="text-[16px] text-[#575F6DCC] font-bold h-7 whitespace-nowrap">
                    {Items?.name
                      ? Items.name === "NF/NSA Bars (No sugar added)"
                        ? "NF/NSA"
                        : Items.name.length > 14
                          ? `${Items.name.slice(0, 14)}..`
                          : Items.name
                      : "--"}
                  </p>
                </Tooltip>
                <div className="w-[60px]">
                  <p className="text-[16px] text-[#2D3748] font-bold text-left">
                    {Items?.totalextprice
                      ? `$${Math.round(Items?.totalextprice)?.toLocaleString()}`
                      : "$0"}
                  </p>
                </div>
                {/* Align all 3 values in one line */}
                <div className="flex flex-row gap-2 items-baseline">
                  {Items?.qty_times_pieces > 0 && (
                    <p className="text-[11px] text-[#000000] font-semibold">
                      {Items.name?.toLowerCase() === "meat" ? (
                        <>{(Items.totalqty * 20).toLocaleString()} Lbs</>
                      ) : (
                        <>
                          {`${Items.qty_times_pieces.toLocaleString()} ${(() => {
                            const unit = Items?.unit?.toLowerCase();
                            if (unit === "piece" || unit === "pieces") return "pcs";
                            if (unit === "burger") return "bgr";
                            if (unit === "cakes") return "cks";
                            if (unit === "gallons") return "gal";
                            return unit || "unit";
                          })()}`}
                        </>
                      )}
                    </p>
                  )}
                  {Items?.per_piece_price > 0 && (
                    <p className="text-[11px] text-[#000000] font-semibold">
                      ${Items.per_piece_price.toFixed(2)}/
                      {Items?.unit?.toLowerCase() === "piece" ||
                      Items?.unit?.toLowerCase() === "pieces"
                        ? "pcs"
                        : Items?.unit || "unit"}
                    </p>
                  )}
                </div>
              </div>
              {/* Horizontal right, vertical center */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="flex items-center justify-center bg-[#0F1044] rounded-full w-[60px] h-[60px]">
                  <p className="text-[21px] text-[#f0f1f0] font-bold">
                    {Items.totalqty}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* <div className="below-lg:hidden mb-8">
          <div className="flex flex-col">
            {data?.map((items,index)=> 
            <div key={index} className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
              <div className=" items-center mb-4 mt-2 px-2">
                <div className="flex justify-between pb-2 w-[100%] border-b border-[#E4E4EF]">
                
                  <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                    <span>{items.sales_date}</span>
                  </div>
                  <div>
                    <img
                      onClick={() => navigateToSalesView(items.salesid)}
                      src="/images/vieweyeicon.svg"
                      className="w-5 h-5"
                    />
                  </div>
                </div>               
              </div>            
              <div className="space-y-3 mb-2 px-2">
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[13px]">Store</p>
                  <p className="text-[#1A1A1A] text-[14px]">{items.store_name}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[13px]">Orders</p>
                  <p className="text-[#1A1A1A] text-[14px]">{items.orders_count}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[13px]">Quantity</p>
                  <p className="text-[#1A1A1A] text-[14px]">{items.total_sales_count}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[13px]">Amount</p>
                  <p className="text-[#1A1A1A] text-[14px]">${items.total_item_sales_amt}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[13px]">Net</p>
                  <p className="text-[#1A1A1A] text-[14px]">${items.net_sales_amt}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[13px]">Average</p>
                  <p className="text-[#1A1A1A] text-[14px]">${items.order_average_amt}</p>
                </div>
              </div>
            </div>
       )}
          </div>
        </div> */}
      </div>
    </main>
  );
};
export default Sales;

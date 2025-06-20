"use client";
import React, { FC, useEffect, useState, useRef } from "react";
import DateRangePicker from "@/Components/UI/Themes/DateRangePicker";
import { Dialog, DialogPanel, DialogTitle, Button } from "@headlessui/react";
import Images from "@/Components/UI/Themes/Image";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
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

interface TableRow {
  sales_date: string;
  store_name: number;
  orders_count: number;
  total_sales_count: number;
  total_item_sales_amt: any;
  net_sales_amt: string;
  uploaddate: string;
  salesid: number;
  order_average_amt: any;
}
interface DateRangeOption {
  name: string;
  value?: string;
  id: number;
}
const Sales: FC = () => {
  const router = useRouter();
  const [data, setData] = useState<TableRow[]>([]);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState<boolean>(false);
  const [selectedDateRange, setSelectedDateRange] = useState<string>("This Month (MTD)");
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploadPdfloading, setUploadPdfLoading] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<any>();
  const [isVerifiedUser, setIsVerifiedUser] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [store, setStore] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });
  const [globalFilter, setGlobalFilter] = React.useState("");
  const fileInputRef: any = useRef(null);
  const navigateToSalesView = (salesId: any) => {
    const encodedId = btoa(salesId);
    const urlSafeEncodedId = encodedId
      ?.replace(/\+/g, "-")
      ?.replace(/\//g, "_")
      ?.replace(/=+$/, "");
    router.push(`/sales/${urlSafeEncodedId}`);
  };
  const handleDeleteSale = async () => {
    if (!selectedSaleId) return;
  
    try {
      const response: any = await sendApiRequest({
        mode: "deleteSales",
        salesid: selectedSaleId
      });
  
      if (response?.status === 200) {
        setCustomToast({
          message: "Sale deleted successfully",
          type: "success",
        });
        fetchData();
      } else {
        setCustomToast({
          message: response?.message || "Failed to delete sale",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting sale:", error);
      setCustomToast({
        message: "An error occurred while deleting the sale",
        type: "error",
      });
    } finally {
      setIsDeleteOpen(false);
      setSelectedSaleId(null);
    }
  };
  
  
  const columns: ColumnDef<TableRow>[] = [
    {
      accessorKey: "sales_date",
      header: () => <div className="text-left">Date</div>,
      cell: (info) => <span>{info.getValue() as string}</span>,
      size: 100,
    },
    {
      accessorKey: "store_name",
      header: () => <div>Store</div>,
      cell: (info) => <span>{info.getValue() as string}</span>,
      size: 100,
    },
    {
      accessorKey: "orders_count",
      header: () => <div className="text-right mr-10">Orders</div>,
      cell: (info) => (
        <div className="text-center">{info.getValue() as number}</div>
      ),
      size: 80,
    },
   
    {
      accessorKey: "total_item_sales_amt",
      header: () => <div className="text-right mr-12">Amount</div>,
      cell: (info) => (
        <div className="text-right mr-12">
          ${(info.getValue() as number).toFixed(2)}
        </div>
      ),
      size: 133,
    },
    {
      accessorKey: "net_sales_amt",
      header: () => <div className="ext-right mr-12">Net</div>,
      cell: (info) => (
        <div className="text-right mr-10">
          ${(info.getValue() as number).toFixed(2)}
        </div>
      ),
      size: 80,
    },
      {
        accessorKey: "order_average_amt",
        header: () => <div className="text-right mr-8">Average</div>,
        cell: (info) => {
          const { total_item_sales_amt, orders_count } = info.row.original;
          const average =
          orders_count > 0 ? total_item_sales_amt / orders_count : 0;

          return <div className="text-right mr-8">${average.toFixed(2)}</div>;
        },
        size: 120,
      },
    {
      accessorKey: "uploaddate",
      header: () => <div className="text-left "> Uploaded On</div>,
      cell: (info) => (
        <span className="text-left ">
          {format(info.getValue() as any, "MM-dd-yyyy")}
        </span>
      ),
      size: 120,
    },
    {
      id: "view",
      header: () => <div className="text-center"></div>,
      cell: (info) => (
        <span className="flex justify-center">
          <button
            onClick={() => navigateToSalesView(info.row.original.salesid)}
          >
            <Images
              src="/images/vieweyeicon.svg"
              alt="Eye Icon"
              className="w-4 h-4"
            />
          </button>
        </span>
      ),
      size: 60,
    },
    {
      id: "delete",
      header: () => <div className="text-center"></div>,
      cell: (info) => (
        <span className="flex justify-center">
          <button
            onClick={() => {
              setSelectedSaleId(info.row.original.salesid);
              setIsDeleteOpen(true);
            }}
          >
            <Images
              src="/images/deletebinicon.svg"
              alt="Delete"
              className="w-4 h-4"
            />
          </button>
        </span>
      ),
      size: 60,
    },
  ];

  useEffect(() => {
    if (startDate && endDate && selectedOption) {
      table.setPageIndex(0); // reset to first page
      fetchData();
    }
  }, [startDate, endDate, selectedOption, globalFilter]);

  const table = useReactTable({
    data: data,
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
        mode: "getSales",
        page: table.getState().pagination.pageIndex + 1,
        limit: table.getState().pagination.pageSize,
        storeid: selectedOption?.id || 69,
        startdate: startDate && format(startDate, "yyyy-MM-dd"),
        enddate: endDate && format(endDate, "yyyy-MM-dd"),
        search: globalFilter,
      });

      if (response?.status === 200) {
        setData(response?.data?.sales);
        if (response?.data?.total >= 0) {
          table.getState().pagination.pageIndex == 0 &&
            setTotalItems(response?.data?.total || 0);
        }
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
    fetchData();
  }, [pageIndex, pageSize]);

  const getUserStore = async () => {
    try {
      const response = await sendApiRequest({ mode: "getUserStore" });
      if (response?.status === 200) {
        const stores = response?.data?.stores || [];
        // Map stores to the format expected by the Dropdown component
        const formattedStores = stores?.map((store: any) => ({
          storeno: store?.name,
          name: `${store?.name} - ${store?.location || "Unknown Location"}`, // Ensure location is handled
          id: store?.id,
        }));
        
        setStore(formattedStores); // Update store state with formatted data
        
        if (stores?.length > 0) {
          setSelectedOption({
            storeno: stores[0]?.name,
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

  useEffect(() => {
    if (isVerifiedUser) {
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();
      setStartDate(new Date(currentYear, currentMonth, 1));
      setEndDate(new Date(currentYear, currentMonth + 1, 0)); // Last day of current month
      getUserStore();
      // fetchDropdownData();
    }
  }, [isVerifiedUser]);

  // const fetchDropdownData = async () => {
  //   try {
  //     const response = await sendApiRequest({ mode: "getAllStores" });
  //     if (response?.status === 200) {
  //       setStore(response?.data?.stores || []);
  //     } else {
  //       handleError(response?.message);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching stores:", error);
  //   }
  // };
  const dateRangeOptions: DateRangeOption[] = [
    { name: "This Month (MTD)", value: "this_month", id: 1 },
    { name: "This Year (YTD)", value: "this_year", id: 2 },
    { name: "Last Month", value: "last_month", id: 3 },
    { name: "Last Year", value: "last_year", id: 4 },
  ];

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


  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomToast({
      message: "",
      type: "",
    });
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setUploadPdfLoading(true);
      if (file && file.type === "application/pdf") {
        const formData = new FormData();
        formData.append("file", file);
        try {
          const response = await fetch(
            "https://hisabr-pdf-extractor.vercel.app/process-sales",
            {
              method: "POST",
              body: formData,
            }
          );

          const responseData = await response.json();
          if (response.ok) {
            let getStore: any = [];
            if (selectedOption?.storeno == responseData?.store_name) {
              if (responseData?.store_name !== "Not Found") {
                getStore = await sendApiRequest({
                  mode: "getStoreByName",
                  storename: responseData?.store_name,
                });
              }
              const convertDate = new Date(responseData?.sales_date);
              const formattedDate =
                convertDate?.getFullYear() +
                "-" +
                (convertDate?.getMonth() + 1)?.toString()?.padStart(2, "0") +
                "-" +
                convertDate?.getDate()?.toString()?.padStart(2, "0");
              const checkSalesUpload: any = await sendApiRequest({
                mode: "checkSalesExist",
                salesdate: formattedDate,
                storename: responseData?.store_name,
              });
              if (checkSalesUpload?.status === 200) {
                const jsonData: any = {
                  mode: "insertSales",
                  sales_date: formattedDate,
                  store_name: responseData?.store_name,
                  gross_sales_amt: responseData?.gross_sales,
                  net_sales_amt: responseData?.net_sales,
                  total_sales_count: responseData?.total_no_sales_count,
                  total_item_sales_amt: responseData?.total_item_sales,
                  taxable_item_sales_amt: responseData?.taxable_item_sales,
                  non_taxable_item_sales_amt:
                    responseData?.non_taxable_item_sales,
                  orders_count: responseData?.order_count,
                  order_average_amt: responseData?.order_average,
                  guests_count: responseData?.guest_count,
                  tax_amt: responseData?.tax_amt,
                  surcharges_amt: responseData?.surcharges,
                  deposits_accepted_amt: responseData?.deposits_accepted_amount,
                  deposits_redeemed_amt: responseData?.deposits_redeemed_amount,
                  cash_deposits_accepted_amt:
                    responseData?.cash_deposits_accepted,
                  non_cash_payments_amt: responseData?.non_cash_payments,
                  cash_tips_received_amt: responseData?.cash_tips_received,
                  total_cash_amt: responseData?.total_cash_amount,
                  cash_back_amt: responseData?.cash_back_amount,
                  paid_in_amt: responseData?.paid_in,
                  paid_out_amt: responseData?.paid_out,
                  discounts_amt: responseData?.discounts,
                  promotions_amt: responseData?.promotions,
                  refunds_amt: responseData?.refunds,
                  labor_cost_amt: responseData?.labor_cost,
                  labor_hours: responseData?.labor_hours,
                  labor_percent: responseData?.labor_percent,
                  sales_per_labor_hour_amt: responseData?.sales_per_labor_hour,
                  gift_card_issue_count: responseData?.gift_card_issue_count,
                  gift_card_issue_amt: responseData?.gift_card_issue_amount,
                  gift_card_reload_count: responseData?.gift_card_reload_count,
                  gift_card_reload_amt: responseData?.gift_card_reload_amount,
                  gift_card_promotions_amt: responseData?.gift_card_promotions,
                  gift_card_cash_out_count:
                    responseData?.gift_card_cash_out_count,
                  gift_card_cash_out_amt:
                    responseData?.gift_card_cash_out_amount,
                  voids_amt: responseData?.voids,
                  non_revenue_items_amt: responseData?.non_revenue_items,
                  donation_count: responseData?.donation_count,
                  donation_total_amt: responseData?.donation_total_amount,
                  storeid: getStore?.data?.store[0]?.storeid
                    ? getStore?.data?.store[0]?.storeid
                    : null,
                };

                const result: any = await sendApiRequest(jsonData);
                if (result?.status === 200) {
                  const newTenderTxns: any = [];
                  const tenderTxns = responseData?.tenders;
                  const uniqueTenders = responseData?.tenders?.reduce(
                    (acc: any, item: any) => {
                      if (!acc.includes(item?.name)) {
                        acc.push(item?.name);
                      }
                      return acc;
                    },
                    []
                  );

                  // if (uniqueTenders) {
                  // const tendersString = uniqueTenders?.map((item: any) => `"${item}"`).join(", ");
                  const responseTenders: any = await sendApiRequest({
                    mode: "getTendersByNames",
                    tenders: uniqueTenders,
                  });

                  for (let item of tenderTxns) {
                    const match = responseTenders?.data?.tenders?.find(
                      (i: any) => i?.tendername === item?.name
                    );

                    if (match) {
                      newTenderTxns.push({
                        ...item,
                        tenderid: match.tenderid,
                        salesid: result?.data?.salesid,
                        storeid: getStore?.data?.store[0]?.storeid
                          ? getStore?.data?.store[0]?.storeid
                          : null,
                        tender_date: formattedDate,
                      });
                    } else {
                      const insertTender: any = await sendApiRequest({
                        mode: "insertTender",
                        tendername: item.name,
                      });
                      newTenderTxns.push({
                        ...item,
                        tenderid: insertTender?.data?.tenderid,
                        salesid: result?.data?.salesid,
                        storeid: getStore?.data?.store[0]?.storeid
                          ? getStore?.data?.store[0]?.storeid
                          : null,
                        tender_date: formattedDate,
                      });
                    }
                  }
                  // };
                  await sendApiRequest(newTenderTxns, `insertBulkTenders`);
                  const res: any = await sendApiRequest(
                    responseData?.revenue_centers,
                    `insertBulkDQRevenueCenters?salesid=${result?.data?.salesid}`
                  );
                  if (res?.status === 200) {
                    setCustomToast({
                      message: "Sales uploaded successfully",
                      type: "success",
                    });
                  } else {
                    setCustomToast({
                      message: "Failed to upload sales",
                      type: "error",
                    });
                  }
                  // const val: any = {
                  //   invoiceDetails: responseData?.invoice_items || [],
                  // };
                  // const res: any = await sendApiRequest(val, `insertBulkInvoiceItems?invoiceid=${result?.data?.invoiceid}`);
                  fetchData();
                } else {
                  setTimeout(() => {
                    setCustomToast({
                      message: "Failed to insert sales details",
                      type: "error",
                    });
                  }, 0);
                }
              } else {
                setTimeout(() => {
                  setCustomToast({
                    message: "Sales already uploaded",
                    type: "error",
                  });
                }, 0);
              }
            } else {
              setTimeout(() => {
                setCustomToast({
                  message: "Unauthorized",
                  type: "error",
                });
              }, 0);
            }
          } else {
            setTimeout(() => {
              setCustomToast({
                message: "Failed to upload file.",
                type: "error",
              });
            }, 0);
            // alert("Failed to upload file.");
          }
        } catch (error) {
          // console.error("Error uploading file:", error);
          // alert("An error occurred.");
          setCustomToast({
            // message: "An error occurred while uploading the file.",
            message: "Invalid PDF format.",
            type: "error",
          });
        } finally {
          setUploadPdfLoading(false); // Hide loader after upload
        }
      } else {
        setTimeout(() => {
          setCustomToast({
            message: "Please upload a PDF file.",
            type: "error",
          });
        }, 0);
        // alert("Please upload a PDF file.");
      }
    } else {
      setTimeout(() => {
        setCustomToast({
          message: "Please select a file.",
          type: "error",
        });
      }, 0);
      // alert("Please select a file.");
      return;
    }
  };

  const handleImageClick = () => {
    router.push("/sales/sales_view");
  };

  const handleUploadClick = () => {
    // document.getElementById("fileInput")?.click(); // Programmatically click the hidden input
    fileInputRef.current.value = "";
    fileInputRef.current?.click();
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

  //tooltip for mobile
  const [showTooltip, setShowTooltip] = useState(false);

  const handlePressStart = () => {
    setShowTooltip(true);

    setTimeout(() => {
      setShowTooltip(false);
    }, 2000);
  };

  const handlePressEnd = () => {
    setShowTooltip(false);
  };

  return (
    <main
      className={`relative px-6 below-md:px-3  overflow-auto ${
        data?.length > 8 ? "max-h-[calc(100vh-60px)]" : "h-[600px]"
      }`}
      style={{ scrollbarWidth: "thin" }}
    >
      <ToastNotification
        message={customToast?.message}
        type={customToast?.type}
      />
      {uploadPdfloading && <Loading />}
      <div className="sticky z-20 bg-[#f7f8f9] pb-6 pt-4 below-md:pt-4 below-md:pb-4 tablet:pt-4">
  <div className="flex flex-row flex-nowrap gap-3 pb-6 w-full below-md:flex-col">
    {/* Store and Date Range Dropdowns */}
    <div className="flex flex-row flex-wrap gap-3 w-full below-md:flex-col">
      <Dropdown
        options={store}
        selectedOption={selectedOption?.name || "Store"}
        onSelect={(selectedOption: any) => {
          setSelectedOption({
            storeno: selectedOption.storeno,
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
    </div>

    {/* Date Picker and Search */}
    <div className="flex flex-row gap-3 w-full below-md:flex-col below-laptop:w-3/5 small-laptop:w-1/2">
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
          type="search"
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search"
          className="w-full rounded border border-gray-300 bg-white py-[10px] pr-7 pl-3 h-full text-[12px] below-lg:text-[10.2432px] placeholder:text-[#636363] focus:outline-none focus:ring-1 focus:ring-white"
        />
        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
          <img src="/images/searchicon.svg" alt="Search Icon" className="cursor-pointer below-lg:scale-[0.8536]" />
        </div>
      </div>
    </div>

    {/* Upload Button */}
    <div className="below-md:hidden tablet:hidden">
      <input
        type="file"
        ref={fileInputRef}
        id="fileInput"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <button
        onClick={handleUploadClick}
        className="flex items-center justify-center bg-[#168A6F] hover:bg-[#11735C] shadow-lg w-[159px] below-lg:w-[135.7224px] h-[35px] below-lg:h-[29.876px] rounded-md text-white text-[13px] below-lg:text-[11.0968px] font-medium"
      >
        <img src="/images/uploadIcon.svg" alt="Upload Icon" className="mr-1 below-lg:scale-[0.8536]" />
        Upload Sale
      </button>
  </div>
</div>

        {/** Table */}

        {/* Table */}
        {/* Desktop View */}
        <div className="tablet:hidden overflow-x-auto border-collapse border border-[#E4E4EF] rounded-lg flex-grow hidden flex-col below-lg:block shadow-sm">
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
                  ) : data === null ? (
                    /* Show No Data Found Message If No Data Available */
                    <tr>
                      <td colSpan={columns.length} className="py-6 text-center">
                        <NoDataFound />
                      </td>
                    </tr>
                  ) : (
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {/* <div className="block below-md:hidden">
          <Pagination table={table} totalItems={totalItems} />
        </div> */}

        <div className="below-lg:hidden mb-8">
          <div className="flex flex-col">
            {data?.map((items, index) =>
            {
              // Calculate average for mobile view
              const average =
                items.total_sales_count > 0
                  ? items.total_item_sales_amt / items.total_sales_count
                  : 0;
        
              return (
              <div
                key={index}
                className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3"
              >
                <div className=" items-center mb-4 mt-2 px-2">
                  <div className="flex justify-between pb-2 w-[100%] border-b border-[#E4E4EF]">
                    <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                      <span>{items.sales_date}</span>
                    </div>
                    <div className="flex gap-2">
                    <div>
                      <img
                        onClick={() => navigateToSalesView(items.salesid)}
                        src="/images/vieweyeicon.svg"
                        className="w-5 h-5"
                      />
                    </div>
                    <div>
    <img
      onClick={() => {
        setSelectedSaleId(items.salesid);
        setIsDeleteOpen(true);
      }}
      src="/images/deletebinicon.svg"
      className="w-5 h-4 cursor-pointer"
    />
  </div>
</div>
                  </div>
                </div>

                <div className="space-y-3 mb-2 px-2">
                  <div className="flex justify-between text-sm">
                    <p className="text-[#808080] text-[13px]">Store</p>
                    <p className="text-[#1A1A1A] text-[14px]">
                      {items.store_name}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-[#808080] text-[13px]">Orders</p>
                    <p className="text-[#1A1A1A] text-[14px]">
                      {items.orders_count}
                    </p>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <p className="text-[#808080] text-[13px]">Amount</p>
                    <p className="text-[#1A1A1A] text-[14px]">
                      ${items.total_item_sales_amt}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-[#808080] text-[13px]">Net</p>
                    <p className="text-[#1A1A1A] text-[14px]">
                      ${items.net_sales_amt}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-[#808080] text-[13px]">Average</p>
                    <p className="text-[#1A1A1A] text-[14px]">${average.toFixed(2)}</p>                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>

      <div className="below-lg:hidden flex justify-end fixed bottom-16 right-3">
        <button
          className="focus:outline-none flex items-center justify-center bg-[#168A6F] hover:bg-[#11735C] w-[56px] h-[56px] rounded-xl relative"
          onTouchStart={handlePressStart} // For mobile devices
          onMouseLeave={handlePressEnd} // Hide tooltip on mouse leave
          onClick={handleUploadClick}
        >
          <img
            src="/images/uploadIcon.svg"
            alt="Upload Icon"
            className="w-[18px]"
          />
          {showTooltip && (
            <div className="absolute bottom-[70px] right-[80%] transform translate-x-1/2 bg-[#79747E] text-white text-[12px] px-5 py-2 rounded-md whitespace-nowrap">
              Upload Sale
              {/* Tooltip Pointer */}
              <div className="absolute top-full right-[20%] transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#79747E]"></div>
            </div>
          )}
        </button>
      </div>
      <div className="">
        <Pagination table={table} totalItems={totalItems} />
      </div>
      <Dialog
  open={isDeleteOpen}
  as="div"
  className="relative z-50"
  onClose={() => setIsDeleteOpen(false)}
>
  <div className="fixed inset-0 bg-black bg-opacity-50" />
  <div className="fixed inset-0 flex items-center justify-center p-4">
    <DialogPanel className="w-[420px] below-md:w-[335px] h-auto px-6 py-6 bg-white rounded-lg shadow-lg">
      <div>
        <DialogTitle
          as="h3"
          className="flex justify-center text-[#5E6366] font-semibold text-[16px]"
        >
          Delete Sale
        </DialogTitle>
        <div className="flex flex-col mt-4 justify-center items-center text-[#5E6366] font-medium text-[15px]">
          <p className="below-md:text-[12px] below-md:placeholder:font-normal">
            Are you sure you want to delete this sale?
          </p>
          <p className="below-md:text-[12px] below-md:font-normal">
            This action cannot be undone.
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex mt-7 justify-between">
          <button
            type="button"
            onClick={() => setIsDeleteOpen(false)}
            className="mr-4 px-4 py-2 h-[35px] w-[165px] bg-[#E4E4E4] hover:bg-[#C9C9C9] font-semibold text-[14px] rounded-md text-[#6F6F6F]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeleteSale}
            className="font-semibold text-[14px] bg-[#CD6D6D] w-[165px] px-6 h-[35px] text-[#FFFFFF] rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </DialogPanel>
  </div>
</Dialog>

    </main>
  );
};
export default Sales;

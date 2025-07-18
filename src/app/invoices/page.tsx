"use client";
import { useEffect, useRef, useState } from "react";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DateRangePicker from "@/Components/UI/Themes/DateRangePicker";
import { useRouter } from "next/navigation";
//import { useSearchParams } from "next/navigation";
import Dropdown from "@/Components/UI/Themes/DropDown";
import { Dialog, DialogPanel, DialogTitle, Button } from "@headlessui/react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import moment from "moment";
// import Image from "next/image"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import Pagination from "@/Components/UI/Pagination/Pagination";
import { sendApiRequest } from "@/utils/apiUtils";
import { format } from "date-fns";
import ToastNotification, {
  ToastNotificationProps,
} from "@/Components/UI/ToastNotification/ToastNotification";
import UploadInvoicepopup from "@/Components/Invoice/UploadInvoicePopup";
import Loading from "@/Components/UI/Themes/Loading";
import NoDataFound from "@/Components/UI/NoDataFound/NoDataFound";
interface TableRow {
  invoicedate: string;
  storename: string;
  sellername: string;
  invoiceid: number;
  quantity: number;
  duedate: string;
  uploaddate: string;
  total: any;
  invoicenumber: string;
}
interface DateRangeOption {
  name: string;
  value?: string;
  id: number;
}
const Invoices = () => {
  const router = useRouter();
  const [showBackIcon, setShowBackIcon] = useState(false);
  const [data, setData] = useState<TableRow[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState<boolean>(false);
  const [selectedDateRange, setSelectedDateRange] = useState<string>("This Month (MTD)");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [uploadPdfloading, setUploadPdfLoading] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [selectedOption, setSelectedOption] = useState<any>();
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [store, setStore] = useState<any[]>([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const fileInputRef: any = useRef(null);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });
  const [isVerifiedUser, setIsVerifiedUser] = useState<boolean>(false);
  const handleDeleteInvoice = async () => {
    if (!selectedInvoiceId) return;

    try {
      const response: any = await sendApiRequest({
        mode: "deleteInvoice",
        invoiceid: selectedInvoiceId,
      });

      if (response?.status === 200) {
        setCustomToast({
          message: "Invoice deleted successfully",
          type: "success",
        });
        fetchData(globalFilter);
      } else {
        setCustomToast({
          message: response?.message || "Failed to delete invoice",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      setCustomToast({
        message: "An error occurred while deleting the invoice",
        type: "error",
      });
    } finally {
      setIsDeleteOpen(false);
      setSelectedInvoiceId(null);
    }
  };
  const columns: ColumnDef<TableRow>[] = [
    {
      accessorKey: "invoicedate",
      header: () => <div className="text-left">Date</div>,
      cell: (info) => <span>{info.getValue() as string}</span>,
      size: 60,
    },
    {
      accessorKey: "storename",
      header: () => <div className="text-left">Store</div>,
      cell: (info) => <span>{info.getValue() as string}</span>,
      size: 55,
    },
    {
      accessorKey: "invoicenumber",
      header: () => <div className="text-left">Invoice</div>,
      cell: (info) => (
        <span className="text-left pl-1">{info.getValue() as string}</span>
      ),
      size: 30,
    },
    {
      accessorKey: "quantity",
      header: () => <div className="text-right">Quantity</div>,
      cell: (info) => (
        <span className="flex justify-end"> {info.getValue() as number}</span>
      ),
      size: 70,
    },
    {
      accessorKey: "total",
      header: () => <div className="text-right pr-9">Total</div>,
      cell: (info) => (
        <span className="flex justify-end pr-8">
          ${info.row.original.total?.toFixed(2)}
        </span>
      ),
      size: 70,
    },
    {
      accessorKey: "sellername",
      header: () => <div className="text-left">Name</div>,
      cell: (info) => (
        <span className="text-left ">{info.getValue() as string}</span>
      ),
      size: 100,
    },
    {
      accessorKey: "uploaddate",
      header: () => <div className="text-left "> Uploaded On</div>,
      cell: (info) => (
        <span className="text-left ml-5">
          {format(info.getValue() as any, "MM-dd-yyyy")}
        </span>
      ),
      size: 80,
    },
    {
      id: "view",
      header: () => <div className="text-left"></div>,
      cell: (info) => (
        <button
          onClick={() => navigateToInvoice(info.row.original.invoiceid)}
          className="text-green-500 hover:text-green-700 text-center ml-2"
        >
          <img
            src="/images/vieweyeicon.svg"
            alt="View Icon"
            className=" w-4 h-4 below-md:h-5 below-md:w-5 "
          />
        </button>
      ),
      size: 30,
    },
    // In the columns array, update the delete cell:
    {
      id: "delete",
      header: () => <div className="text-left"></div>,
      cell: (info) => (
        <button
          onClick={() => {
            setSelectedInvoiceId(info.row.original.invoiceid);
            setIsDeleteOpen(true);
          }}
          className="text-red-500 hover:text-red-700 text-center ml-2"
        >
          <img
            src="/images/deletebinicon.svg"
            alt="Delete"
            className="w-4 h-4 below-md:h-5 below-md:w-5"
          />
        </button>
      ),
      size: 30,
    },
  ];

  const navigateToInvoice = (invoiceId: any) => {
    const navigationId = Date.now().toString();
    sessionStorage.setItem(
      "invoicesState",
      JSON.stringify({
        selectedOption: selectedOption ? { name: selectedOption.name, id: selectedOption.id } : null,
        selectedDateRange,
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null,
        globalFilter,
        pageIndex: table.getState().pagination.pageIndex,
        navigationId,
      })
    );
    sessionStorage.setItem("fromInvoiceDetails", navigationId);

    const encodedId = btoa(invoiceId);
    const urlSafeEncodedId = encodedId
      ?.replace(/\+/g, "-")
      ?.replace(/\//g, "_")
      ?.replace(/=+$/, "");
    router.push(`/invoices/${urlSafeEncodedId}`);
  };

  useEffect(() => {
    if (startDate && endDate && selectedOption) {
      table.setPageIndex(0); // reset to first page
      fetchData(globalFilter);
    }
  }, [startDate, endDate, selectedOption, globalFilter]);

  // useEffect(() => {
  //   if (startDate && endDate && selectedOption) {
  //     fetchData(globalFilter);
  //   }
  // }, [selectedOption]);
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

  // Function to fetch data and update state
  const fetchData = async (search: string = "") => {
    setLoading(true);
    try {
      const response: any = await sendApiRequest({
        mode: "getInvoices",
        page: table.getState().pagination.pageIndex + 1,
        limit: table.getState().pagination.pageSize,
        storeid: selectedOption?.id || 69,
        startdate: startDate && format(startDate, "yyyy-MM-dd"),
        enddate: endDate && format(endDate, "yyyy-MM-dd"),
        search: search,
      });

      if (response?.status === 200) {
        setData(response?.data?.invoices);
        if (response?.data?.total >= 0) {
          table.getState().pagination.pageIndex == 0 &&
            setTotalItems(response?.data?.total || 0);
        }
      } else {
        setCustomToast({
          message: response?.message || "Failed to fetch invoices.",
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
    fetchData(globalFilter);
  }, [pageIndex, pageSize]);

  const getUserStore = async (restoredSelectedOption: { name: string; id: number } | null) => {
    try {
      const response = await sendApiRequest({ mode: "getUserStore" });
      if (response?.status === 200) {
        const stores = response?.data?.stores || [];
        // Map stores to the format expected by the Dropdown component
        const formattedStores = stores.map((store) => ({
          name: `${store.name} - ${store.location || "Unknown Location"}`, // Ensure location is handled
          id: store.id,
        }));

        setStore(formattedStores);

        if (restoredSelectedOption && formattedStores.some((store: any) => store.id === restoredSelectedOption.id)) {
          setSelectedOption({
            name: restoredSelectedOption.name,
            id: restoredSelectedOption.id,
          });
        } else if (formattedStores.length > 0) {
          setSelectedOption({
            name: `${stores[0].name} - ${stores[0].location || "Unknown Location"}`,
            id: stores[0].id,
          });
        } else {
          setSelectedOption(null);
        }
      } else {
        handleError(response?.message);
        setSelectedOption(null);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
      handleError("Failed to fetch stores");
      setSelectedOption(null);
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
      const fromInvoiceDetails = sessionStorage.getItem("fromInvoiceDetails");
      const savedState = sessionStorage.getItem("invoicesState");

      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();
      const defaultStartDate = new Date(currentYear, currentMonth, 1);
      const defaultEndDate = new Date(currentYear, currentMonth + 1, 0);

      let restoredSelectedOption: { name: string; id: number } | null = null;

      if (fromInvoiceDetails && savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          if (parsedState.navigationId === fromInvoiceDetails) {
            setSelectedDateRange(parsedState.selectedDateRange || "This Month (MTD)");
            setGlobalFilter(parsedState.globalFilter || "");
            setStartDate(
              parsedState.startDate ? new Date(parsedState.startDate) : defaultStartDate
            );
            setEndDate(
parsedState.endDate ? new Date(parsedState.endDate) : defaultEndDate
            );
            if (parsedState.selectedOption && parsedState.selectedOption.id && parsedState.selectedOption.name) {
              restoredSelectedOption = {
                name: parsedState.selectedOption.name,
                id: parsedState.selectedOption.id,
              };
            }
            if (parsedState.pageIndex) {
              table.setPageIndex(parsedState.pageIndex);
            }
          } else {
            setSelectedDateRange("This Month (MTD)");
            setGlobalFilter("");
            setStartDate(defaultStartDate);
            setEndDate(defaultEndDate);
            table.setPageIndex(0);
          }
        } catch (error) {
          console.error("Error parsing saved state:", error);
          setSelectedDateRange("This Month (MTD)");
          setGlobalFilter("");
          setStartDate(defaultStartDate);
          setEndDate(defaultEndDate);
          table.setPageIndex(0);
        }
      } else {
        setSelectedDateRange("This Month (MTD)");
        setGlobalFilter("");
        setStartDate(defaultStartDate);
        setEndDate(defaultEndDate);
        table.setPageIndex(0);
      }

      sessionStorage.removeItem("invoicesState");
      sessionStorage.removeItem("fromInvoiceDetails");

      getUserStore(restoredSelectedOption);
    }
  }, [isVerifiedUser]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const fromHome = params.get("fromHome") === "true";
      const fromItemsAnalysis = params.has("fromItemsAnalysis");
      const fromSaleItems = params.has("fromSaleItems");

      if (fromHome || fromItemsAnalysis || fromSaleItems) {
        setShowBackIcon(true);
        const currentUrl = window.location.pathname;
        window.history.replaceState({}, "", currentUrl); // Update the URL without the query parameter
      }
    }
  }, []);

  const handleButtonClick = () => {
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  const handleFileChange = async (event: any) => {
    setCustomToast({
      message: "",
      type: "",
    });
    const file = event.target.files[0];

    if (!file) {
      alert("Please select a file.");
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    setUploadPdfLoading(true); // Show loader during upload

    try {
      // console.log("Selected file:", file.name);
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(
        "https://hisabr-pdf-extractor.vercel.app/process-invoice",
        {
          method: "POST",
          body: formData,
        }
      );

      const responseData = await response.json();
      // console.log("Response:", responseData);

      if (!response.ok) {
        throw new Error("Failed to upload file.");
      }

      let getStore: any = [];
      if (responseData?.invoice_details?.store_name !== "Not Found") {
        getStore = await sendApiRequest({
          mode: "getStoreByName",
          storename: responseData?.invoice_details?.store_name,
        });
      }

      const checkInvoiceUpload: any = await sendApiRequest({
        mode: "checkInvoiceExist",
        invoiceno: responseData?.invoice_details?.invoice_number,
        storename: responseData?.invoice_details?.store_name,
      });

      if (checkInvoiceUpload?.status === 200) {
        const jsonData: any = {
          mode: "insertInvoice",
          invoicenumber: responseData?.invoice_details?.invoice_number,
          invoicedate: moment(
            moment(
              responseData?.invoice_details?.invoice_date,
              "MM/DD/YYYY"
            ).toDate()
          ).format("YYYY-MM-DD"),
          storename: responseData?.invoice_details?.store_name,
          duedate: moment(
            moment(
              responseData?.invoice_details?.due_date,
              "MM/DD/YYYY"
            ).toDate()
          ).format("YYYY-MM-DD"),
          total: responseData?.invoice_details?.invoice_total,
          sellername: responseData?.invoice_details?.seller_name,
          quantity: responseData?.invoice_details?.qty_ship_total,
          producttotal:
            responseData?.invoice_details?.product_total ??
            responseData?.invoice_details?.sub_total,
          subtotal: responseData?.invoice_details?.sub_total,
          misc: responseData?.invoice_details?.misc,
          tax: responseData?.invoice_details?.tax,
          storeid: getStore?.data?.store[0]?.storeid
            ? getStore?.data?.store[0]?.storeid
            : null,
        };

        const result: any = await sendApiRequest(jsonData);
        if (result?.status === 200) {
          const val: any = {
            invoiceDetails: responseData?.invoice_items || [],
          };
          const res: any = await sendApiRequest(
            val,
            `insertBulkInvoiceItems?invoiceid=${result?.data?.invoiceid}`
          );
          if (res?.status === 200) {
            setCustomToast({
              message: "Invoice uploaded successfully",
              type: "success",
            });
          } else {
            setCustomToast({
              message: "Failed to upload invoice",
              type: "error",
            });
          }
          fetchData();
        } else {
          setCustomToast({
            message: "Failed to insert invoice details",
            type: "error",
          });
        }
      } else {
        setTimeout(() => {
          setCustomToast({
            message: "Invoice already uploaded",
            type: "error",
          });
        }, 0);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setCustomToast({
        // message: "An error occurred while uploading the file.",
        message: "Invalid PDF format.",
        type: "error",
      });
    } finally {
      setUploadPdfLoading(false); // Hide loader after upload
    }
  };

  const toggleStoreDropdown = () => {
    setIsStoreDropdownOpen((prev) => !prev);
  };

  const handleError = (message: string) => {
    setCustomToast({
      message: message,
      type: "error",
    });
  };

  const searchInputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    // Focus the input field when the image is clicked
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handlePressStart = () => {
    setShowTooltip(true);

    setTimeout(() => {
      setShowTooltip(false);
    }, 2000);
  };

  const handlePressEnd = () => {
    setShowTooltip(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      table.getState().pagination.pageIndex == 0
        ? fetchData(globalFilter)
        : table.setPageIndex(0);
    }
  };
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

return (
    <main
      className="relative px-6 below-md:px-3 max-h-[calc(100vh-180px)] overflow-hidden" 
      style={{ scrollbarWidth: "none" }}
    >
      <ToastNotification
        message={customToast?.message}
        type={customToast?.type}
      />
      {uploadPdfloading && <Loading />}
      <div className="sticky z-20 bg-[#f7f8f9] pb-6 pt-4 below-md:pt-4 below-md:pb-4 tablet:pt-4">
  <div className="flex flex-row flex-nowrap gap-3 w-full below-md:flex-col">
    
    {/* Store, Date Range, Date Picker, and Search */}
    <div className="flex flex-row flex-wrap gap-3 w-full below-md:flex-col">
      {showBackIcon && (
        <img
          onClick={() => router.back()}
          alt="Back Arrow"
          className="w-7 h-7 mt-1 below-md:hidden cursor-pointer"
          src="/images/webbackicon.svg"
        />
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
          <div className="absolute inset-y-0 right-7 flex items-center cursor-pointer" onClick={clearSearch}>
            <img src="/images/cancelicon.svg" alt="Clear" />
          </div>
        )}
        <div className="absolute inset-y-0 right-2 flex items-center cursor-pointer">
          <img
            src="/images/searchicon.svg"
            alt="Search Icon"
            onClick={() =>
              table.getState().pagination.pageIndex == 0
                ? fetchData(globalFilter)
                : table.setPageIndex(0)
            }
            className="below-lg:scale-[0.8536]"
          />
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
        onClick={handleButtonClick}
        className="flex items-center justify-center bg-[#168A6F] hover:bg-[#11735C] shadow-lg w-[159px] below-lg:w-[135.7224px] h-[35px] below-lg:h-[29.876px] rounded-md text-white text-[13px] below-lg:text-[11.0968px] font-medium"
      >
        <img src="/images/webuploadicon.svg" alt="Upload Icon" className="mr-1 below-lg:scale-[0.8536]" />
        Upload Invoice
      </button>
    </div>
  </div>
</div>


      {/* Mobile View : Card section */}
      <div className="block md:hidden relative">
        {data?.map((card, index) => (
          <div
            key={index}
            className="flex flex-col w-full  rounded-lg bg-white border border-b border-[#E4E4EF] below-lg:hidden my-3"
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-4 px-4 py-4 text-[#334155]">
                <p className="text-[14px] font-bold">{card.invoicedate}</p>
                <p className="text-[14px] font-bold">
                  {card.sellername.length > 13
                    ? card.sellername.slice(0, 13) + "..."
                    : card.sellername}
                </p>
              </div>

              <div className="flex py-4">
                <button
                  onClick={() => navigateToInvoice(card?.invoiceid)}
                  className="text-green-500 hover:text-green-700"
                >
                  <div className="flex gap-2">
                    <img
                      className=" w-4 h-4 below-md:h-5 below-md:w-5"
                      src="/images/vieweyeicon.svg"
                    />
                  </div>
                </button>
                <div className="px-2">
                  <img src="/images/deletebinicon.svg" className="w-5 h-4" />
                </div>
              </div>
            </div>
            {/* Divider */}
            <div className="flex items-center px-4 -mt-2">
              <div className="border-t border-gray-200 w-full"></div>
            </div>

            {/* Content Area */}
            <div className="flex justify-between items-center px-4 py-3">
              <div className="flex flex-col text-[13px] space-y-3">
                <p className="text-[#636363]">Store</p>
                <p className="text-[#636363]">Invoice</p>
                <p className="text-[#636363]">quantity</p>
                <p className="text-[#636363]">total</p>
              </div>
              <div className="flex flex-col text-[14px] text-right space-y-3">
                <p className="text-[#1A1A1A]">{card.storename}</p>
                <p className="text-[#1A1A1A]">{card.invoicenumber}</p>
                <p className="text-[#000000]">{card.quantity}</p>
                <p className="text-[#1A1A1A]">${card.total}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="fixed bottom-[70px] right-3">
          <button
            className="focus:outline-none flex items-center bg-[#168A6F]  justify-center  w-[56px] h-[56px] rounded-xl relative"
            onTouchStart={handlePressStart} // For mobile devices
            onMouseLeave={handlePressEnd} // Hide tooltip on mouse leave
            onClick={handleButtonClick}
          >
            <img
              src="/images/mobileuploadicon.svg"
              alt="Upload Invoice"
              className="w-[18px] h-[18px]"
            />
            {showTooltip && (
              <div className="absolute bottom-[75px] right-[80%] transform translate-x-1/2 bg-[#79747E] text-white text-[12px] px-5 py-2 rounded-md whitespace-nowrap">
                Upload Invoice
                {/* Tooltip Pointer */}
                <div className="absolute top-full right-[20%] transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#79747E]"></div>
              </div>
            )}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <div className="hidden below-md:block ">
          <Pagination table={table} totalItems={totalItems} />
        </div>
      </div>

      {/*Web View : Invoice Table */}
      <div className="overflow-x-auto relative shadow-sm border-collapse border border-b border-[#E4E4EF] rounded-md  flex-grow flex flex-col below-md:hidden">
        <div className="overflow-hidden max-w-full rounded-md">
          <table className="w-full border-collapse text-[12px] rounded-md text-white table-fixed">
            <thead className="bg-[#0F1044] top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-left px-4 py-2 text-[#FFFFFF] font-normal text-[15px] w-[100px]"
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
            className="w-full relative overflow-y-auto scrollbar-thin flex-grow"
            style={{ maxHeight: "calc(100vh - 320px)" }}
            >
            <table className="w-full border-collapse text-[12px] text-white table-fixed">
              <tbody>
                {loading ? (
                  Array.from({ length: 10 })?.map((_, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"}
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
                Delete Invoice
              </DialogTitle>
              <div className="flex flex-col mt-4 justify-center items-center text-[#5E6366] font-medium text-[15px]">
                <p className="below-md:text-[12px] below-md:placeholder:font-normal">
                  Are you sure you want to delete this invoice?
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
                  onClick={handleDeleteInvoice}
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

export default Invoices;

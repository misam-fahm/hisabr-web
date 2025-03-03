"use client";
import { useEffect, useRef, useState } from "react";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DateRangePicker from "@/Components/UI/Themes/DateRangePicker";
import { useRouter } from "next/navigation";
//import { useSearchParams } from "next/navigation";
import Dropdown from "@/Components/UI/Themes/DropDown";
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
import { format } from 'date-fns';
import ToastNotification, { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";
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
  uploaddate:string,
  total: any;
  invoicenumber: string;
}

const Invoices = () => {
  const router = useRouter();
  const [showBackIcon, setShowBackIcon] = useState(false);
  const [data, setData] = useState<TableRow[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
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
      header: () => <div className="text-left">Invoice#</div>,
      cell: (info) => <span className="text-left pl-1">{info.getValue() as string}</span>,
      size:30
    },
    {
      accessorKey: "quantity",
      header: () => <div className="text-right">Quantity</div>,
      cell: (info) =>
        <span className="flex justify-end"> {info.getValue() as number}</span>,
      size: 90,
    },
    {
      accessorKey: "total",
      header: () => <div className="text-right pr-9">Total</div>,
      cell: (info) => (
        <span className="flex justify-end pr-8">{( info.row.original.total)?.toFixed(2)}</span>
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
        <span className="text-left ">{ format(info.getValue() as any ,'MM-dd-yyyy' )}</span>
      ),
      size: 80,
    },
    {
      id: "view",
      header: () => <div className="text-left"></div>,
      cell: (info) => (
        
        <button
        onClick={() =>   navigateToInvoice(info.row.original.invoiceid)}
          className="text-green-500 hover:text-green-700 text-center ml-2"
        >
          <img src="/images/vieweyeicon.svg" alt="View Icon"
            className=" w-4 h-4 below-md:h-5 below-md:w-5 " />
        </button>
      ),
      size: 30,
    },
    
  ];

  const navigateToInvoice = (invoiceId: any) => {
    const encodedId = btoa(invoiceId);
    const urlSafeEncodedId = encodedId?.replace(/\+/g, '-')?.replace(/\//g, '_')?.replace(/=+$/, '');
    router.push(`/invoices/${urlSafeEncodedId}`);
  };

  useEffect(() => {
    if (startDate && endDate && selectedOption ) {
      fetchData();
    }
  }, [selectedOption , globalFilter]);
  
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

   // Function to fetch data and update state
   const fetchData = async () => {
    setLoading(true);
    try {
      const response: any = await sendApiRequest({
        mode: "getInvoices",
        page: table.getState().pagination.pageIndex + 1,
        limit: table.getState().pagination.pageSize,
        storeid: selectedOption?.id || 69,
        startdate: startDate && format(startDate, 'yyyy-MM-dd'),
        enddate: endDate && format(endDate, 'yyyy-MM-dd'),
        search:globalFilter
      });
  
      if (response?.status === 200) {
        setData(response?.data?.invoices);
        if (response?.data?.total >= 0) {
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
    fetchData();
  }, [pageIndex, pageSize]);

  const getUserStore = async () => {
    try {
      const response = await sendApiRequest({ mode: "getUserStore" });
      if (response?.status === 200) {
        setStore(response?.data?.stores || []);
        if (response?.data?.stores){
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
    const res: any = await sendApiRequest({
      token: token
    }, `auth/verifyToken`);
    res?.status === 200 
      ? setIsVerifiedUser(true) 
      : router.replace('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
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
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const fromHome = params.get("fromHome") === "true";
      const fromItemsAnalysis = params.has("fromItemsAnalysis");
      const fromSaleItems = params.has("fromSaleItems")

      if (fromHome || fromItemsAnalysis || fromSaleItems) {
        setShowBackIcon(true);
        const currentUrl = window.location.pathname;
        window.history.replaceState({},"",currentUrl) // Update the URL without the query parameter
      }
    }
  }, []);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = async (event: any) => {
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
        "https://hisabr-pdf-extractor.vercel.app/convert-pdf",
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
          storename: responseData?.invoice_details?.store_name
        });
      }

      const checkInvoiceUpload: any = await sendApiRequest({
        mode: "checkInvoiceExist",
        invoiceno: responseData?.invoice_details?.invoice_number,
        storename: responseData?.invoice_details?.store_name
      });

      if (checkInvoiceUpload?.status === 200) {
        const jsonData: any = {
          mode: "insertInvoice",
          invoicenumber: responseData?.invoice_details?.invoice_number,
          invoicedate: moment(moment(responseData?.invoice_details?.invoice_date, "MM/DD/YYYY").toDate()).format("YYYY-MM-DD"),
          storename: responseData?.invoice_details?.store_name,
          duedate: moment(moment(responseData?.invoice_details?.due_date, "MM/DD/YYYY").toDate()).format("YYYY-MM-DD"),
          total: responseData?.invoice_details?.invoice_total,
          sellername: responseData?.invoice_details?.seller_name,
          quantity: responseData?.invoice_details?.qty_ship_total,
          producttotal: responseData?.invoice_details?.product_total ?? responseData?.invoice_details?.sub_total,
          subtotal: responseData?.invoice_details?.sub_total,
          misc: responseData?.invoice_details?.misc,
          tax: responseData?.invoice_details?.tax,
          storeid: getStore?.data?.store[0]?.storeid ? getStore?.data?.store[0]?.storeid : null
        };
    
        const result: any = await sendApiRequest(jsonData);    
        if (result?.status === 200) {
          const val: any = {
            invoiceDetails: responseData?.invoice_items || [],
          };
          await sendApiRequest(val, `insertBulkInvoiceItems?invoiceid=${result?.data?.invoiceid}`);
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
        message: "An error occurred while uploading the file.",
        type: "error",
      });
    } finally {
      setUploadPdfLoading(false); // Hide loader after upload
    }
  };
  
  const toggleStoreDropdown = () => {
    setIsStoreDropdownOpen((prev) => !prev);
  }

  const handleError = (message: string) => {
    setCustomToast({
      message,
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

  return (
    <main
    className={`relative px-6 below-md:px-3 overflow-auto ${
      data?.length > 10 ? "max-h-[calc(100vh-80px)]" : "h-[500px]"
    }`}
    style={{ scrollbarWidth: "thin" }}
  >
      <ToastNotification
        message={customToast?.message}
        type={customToast?.type}
      />
      {uploadPdfloading && ( <Loading /> )}
      <div className="flex flex-row below-md:flex-col justify-between w-full below-md:item-start below-md:mt-4 below-md:mb-4 mt-6 mb-6">
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
          <div className="below-lg:w-full  tablet:w-full below-md:w-full">
          <DateRangePicker 
                startDate = {startDate}
                endDate = {endDate}
                setStartDate = {setStartDate}
                setEndDate = {setEndDate}
                fetchData = {fetchData}
                />
          </div>
          <div className="flex border border-gray-300 below-md:w-full text-[12px] bg-[#ffff] items-center rounded w-full h-[35px]">
            <input
              type="search"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              ref={searchInputRef}
              placeholder="Search"
              className="w-full h-[35px] bg-transparent rounded-lg px-3 placeholder:text-[#636363] focus:outline-none"
            ></input>
            <img
              className="pr-2 cursor-pointer items-center"
              src="/images/searchicon.svg"
              onClick={handleClick}
            />
          </div>
        </div>
        <div className="pl-24 below-md:hidden">
          <button
            className="w-[159px] h-[35px] bg-[#168A6F] hover:bg-[#11735C] text-white  gap-[0.25rem] font-medium  rounded-md text-[13px] flex items-center justify-center "
            onClick={handleButtonClick}
          >
            <img className="" src="/images/webuploadicon.svg" alt="" />
            Upload Invoice
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          {/* <UploadInvoicepopup /> */}
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
                <p className="text-[14px] font-bold">{card.sellername}</p>
              </div>

              <div className="flex px-4 py-4">
                <button
                  onClick={() =>   navigateToInvoice(card.invoiceid)}
                  className="text-green-500 hover:text-green-700"
                >
                  <img
                    className=" w-4 h-4 below-md:h-5 below-md:w-5"
                    src="/images/vieweyeicon.svg"
                  />
                </button>
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
                <p className="text-[#636363]">Invoice#</p>
                <p className="text-[#636363]">quantity</p>
                <p className="text-[#636363]">total</p>
              </div>
              <div className="flex flex-col text-[14px] text-right space-y-3">
                <p className="text-[#1A1A1A]">{card.storename}</p>
                <p className="text-[#1A1A1A]">{card.invoicenumber}</p>
                <p className="text-[#000000]">{card.quantity}</p>
                <p className="text-[#1A1A1A]">{card.total}</p>
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
            style={{ maxHeight: "calc(100vh - 270px)" }}
          >
            <table className="w-full border-collapse text-[12px] text-white table-fixed">
              <tbody>
                {loading ? (
                  Array.from({ length: 10 })?.map((_, index) => (
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
                ) : data === null ? (
                  /* Show No Data Found Message If No Data Available */
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
            </table>
          </div>
        </div>
      </div>
      {/* Pagination Numbers */}
      <div className="mt-4  below-md:hidden">
        <Pagination table={table} totalItems={totalItems} />
      </div>
    </main>
  );
};

export default Invoices;
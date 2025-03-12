"use client";
import React, { FC, useEffect, useState, useRef } from "react";
import DateRangePicker from "@/Components/UI/Themes/DateRangePicker";
import Images from "@/Components/UI/Themes/Image";
import { useRouter } from "next/navigation";
import { format } from 'date-fns';
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
import ToastNotification, { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";
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
  uploaddate:string;
  salesid:number;
  order_average_amt: any;
}

const Sales: FC = () => {
  const router = useRouter();
  const [data, setData] = useState<TableRow[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
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
  const fileInputRef: any = useRef(null);
  const navigateToSalesView = (salesId: any) => {
    const encodedId = btoa(salesId);
    const urlSafeEncodedId = encodedId?.replace(/\+/g, '-')?.replace(/\//g, '_')?.replace(/=+$/, '');
    router.push(`/sales/${urlSafeEncodedId}`);
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
        <div className="text-right mr-10">{info.getValue() as number}</div>
      ),
      size: 120,
    },
    {
      accessorKey: "total_sales_count",
      header: () => <div className="text-right mr-10">Quantity</div>,
      cell: (info) => (
        <div className="text-right mr-10">{info.getValue() as number}</div>
      ),
      size: 120,
    },
    {
      accessorKey: "total_item_sales_amt",
      header: () => <div className="text-right mr-12">Amount</div>,
      cell: (info) => (
        <div className="text-right mr-12">{(info.getValue() as number).toFixed(2)}</div>
      ),
      size: 133,
    },
    {
      accessorKey: "net_sales_amt",
      header: () => <div className="text-right mr-10">Net</div>,
      cell: (info) => (
        <div className="text-right mr-10">{(info.getValue() as number).toFixed(2)}</div>
      ),
      size: 120,
    },
    {
      accessorKey: "order_average_amt",
      header: () => <div className="text-right mr-8">Average</div>,
      cell: (info) => {
        const { total_item_sales_amt, total_sales_count } = info.row.original;
        const average =
          total_sales_count > 0 ? total_item_sales_amt / total_sales_count : 0;
          
        return <div className="text-right mr-8">{average.toFixed(2)}</div>;
      },
      size: 120,
    },
    {
      accessorKey: "uploaddate",
      header: () => <div className="text-left "> Uploaded On</div>,
      cell: (info) => (
        <span className="text-left ">{ format(info.getValue() as any ,'MM-dd-yyyy' )}</span>
      ),
      size: 120,
    },
    {
      id: "view",
      header: () => <div className="text-center"></div>,
      cell: (info) => (
        <span className="flex justify-center">
          <button   onClick={() =>   navigateToSalesView(info.row.original.salesid)}>
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
  ];

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
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const response: any = await sendApiRequest({
        mode: "getSales",
        page: table.getState().pagination.pageIndex + 1,
        limit: table.getState().pagination.pageSize,
        storeid: selectedOption?.id || 69,
        startdate: startDate && format(startDate, 'yyyy-MM-dd'),
        enddate: endDate && format(endDate, 'yyyy-MM-dd'),
        search:globalFilter
      });
  
      if (response?.status === 200) {
        setData(response?.data?.sales);
        if (response?.data?.total > 0) {
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
          const response = await fetch("https://hisabr-pdf-extractor.vercel.app/process-sales", {
            method: "POST",
            body: formData,
          });

          const responseData = await response.json();
          if (response.ok) {
            let getStore: any = [];
            if (selectedOption.name == responseData?.store_name) {
              if (responseData?.store_name !== "Not Found") {
                getStore = await sendApiRequest({
                  mode: "getStoreByName",
                  storename: responseData?.store_name
                });
              }
              const convertDate = new Date(responseData?.sales_date);
              const formattedDate = convertDate?.getFullYear() + '-' +
                (convertDate?.getMonth() + 1)?.toString()?.padStart(2, '0') + '-' +
                convertDate?.getDate()?.toString()?.padStart(2, '0');
              const checkSalesUpload: any = await sendApiRequest({
                mode: "checkSalesExist",
                salesdate: formattedDate,
                storename: responseData?.store_name
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
                  non_taxable_item_sales_amt: responseData?.non_taxable_item_sales,
                  orders_count: responseData?.order_count,
                  order_average_amt: responseData?.order_average,
                  guests_count: responseData?.guest_count,
                  tax_amt: responseData?.tax_amt,
                  surcharges_amt: responseData?.surcharges,
                  deposits_accepted_amt: responseData?.deposits_accepted_amount,
                  deposits_redeemed_amt: responseData?.deposits_redeemed_amount,
                  cash_deposits_accepted_amt: responseData?.cash_deposits_accepted,
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
                  gift_card_cash_out_count: responseData?.gift_card_cash_out_count,
                  gift_card_cash_out_amt: responseData?.gift_card_cash_out_amount,
                  voids_amt: responseData?.voids,
                  non_revenue_items_amt: responseData?.non_revenue_items,
                  donation_count: responseData?.donation_count,
                  donation_total_amt: responseData?.donation_total_amount,
                  storeid: getStore?.data?.store[0]?.storeid ? getStore?.data?.store[0]?.storeid : null
                };
                
                const result: any = await sendApiRequest(jsonData);
                if (result?.status === 200) {
                  const newTenderTxns: any = [];
                  const tenderTxns = responseData?.tenders;
                  const uniqueTenders = responseData?.tenders?.reduce((acc: any, item: any) => {
                    if (!acc.includes(item?.name)) {
                      acc.push(item?.name);
                    }
                    return acc;
                  }, []);

                  // if (uniqueTenders) {
                    // const tendersString = uniqueTenders?.map((item: any) => `"${item}"`).join(", ");
                    const responseTenders: any = await sendApiRequest({
                      mode: "getTendersByNames",
                      tenders: uniqueTenders
                    });

                    for (let item of tenderTxns) {
                      const match = responseTenders?.data?.tenders?.find((i: any) => i?.tendername === item?.name);
                  
                      if (match) {
                        newTenderTxns.push({ ...item, 
                          tenderid: match.tenderid, 
                          salesid: result?.data?.salesid,
                          storeid: getStore?.data?.store[0]?.storeid ? getStore?.data?.store[0]?.storeid : null,
                          tender_date: formattedDate 
                        });
                      } else {
                        const insertTender: any = await sendApiRequest({
                          mode: "insertTender",
                          tendername: item.name
                        });
                        newTenderTxns.push({ ...item, 
                          tenderid: insertTender?.data?.tenderid, 
                          salesid: result?.data?.salesid,
                          storeid: getStore?.data?.store[0]?.storeid ? getStore?.data?.store[0]?.storeid : null,
                          tender_date: formattedDate 
                        });                    
                      }
                    }
                  // };
                  await sendApiRequest(newTenderTxns, `insertBulkTenders`);
                  await sendApiRequest(responseData?.revenue_centers, `insertBulkDQRevenueCenters?salesid=${result?.data?.salesid}`);
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
      data?.length > 8 ? "max-h-[calc(100vh-60px)]" : "h-[500px]"
    }`}
    style={{ scrollbarWidth: "thin" }}
  >
    
      <ToastNotification
        message={customToast?.message}
        type={customToast?.type}
      />
      {uploadPdfloading && ( <Loading /> )}
      <div className="px-6 mt-6 below-md:px-3 below-md:mt-0 tablet:mt-4">
        <div className="flex flex-row below-md:flex-col pb-6 sticky z-20  below-md:pt-4 tablet:pt-4 bg-[#f7f8f9] below-md:pb-4">
          <div className="flex flex-row below-md:flex-col w-full  gap-3">
            {/* Dropdown Button */}
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
            <div className="w-full tablet:w-full below-md:w-full">
            <DateRangePicker 
                startDate = {startDate}
                endDate = {endDate}
                setStartDate = {setStartDate}
                setEndDate = {setEndDate}
                fetchData = {fetchData}
                />
            </div>
            <div className="flex flex-row gap-3 w-full ">
              <div className=" w-full rounded border border-gray-300 below-md:w-full bg-[#ffff] relative below-md:hidden tablet:w-full">
                <input
                  type="search"
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Search"
                  className="w-full rounded  py-[10px] pr-7 pl-3 h-[35px] text-[12px] placeholder:text-[#636363]  focus:outline-none "
                />
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <img
                    className="cursor-pointer items-center"
                    src="/images/searchicon.svg"
                  />
                </div>
              </div>

              <div className="tablet:hidden rounded below-md:w-full relative below-lg:hidden border border-gray-300">
                <input
                  type="search"
                  placeholder="Search"
                  className=" py-[10px] rounded px-3 h-[35px] w-full pr-7 pl-3 text-[12px] placeholder:text-[#636363]  focus:outline-none focus:ring-1 focus:ring-[white]"
                />
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <img
                    className="cursor-pointer items-center"
                    src="/images/searchicon.svg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* button */}
          <div className="below-lg:pl-24 below-md:w-full">
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
                className="flex items-center justify-center bg-[#168A6F] hover:bg-[#11735C] shadow-lg below-md:mt-3 w-[159px] h-[35px] rounded-md text-white text-[13px] font-medium"
              >
                <img
                  src="/images/uploadIcon.svg"
                  alt="Upload Icon"
                  className="mr-1"
                />
                Upload Sale
              </button>
            </div>
          </div>
        </div>

        {/** Table */}

        {/* Table */}
        {/* Desktop View */}
        <div className="tablet:hidden overflow-x-auto border-collapse border border-[#E4E4EF] rounded-lg flex-grow hidden flex-col md:block shadow-sm">
          <div className="overflow-hidden max-w-full">
            <table className="w-full border-collapse border-gray-200 table-fixed shadow-lg">
              <thead className="bg-[#334155]  top-0 z-10">
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

        {/* Pagination */}
        <div className="block below-md:hidden">
          <Pagination table={table} totalItems={totalItems} />
        </div>

        <div className="below-lg:hidden mb-8">
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
      <div className="hidden below-md:block">
          <Pagination table={table} totalItems={totalItems} />
        </div>
    </main>
  );
};
export default Sales;

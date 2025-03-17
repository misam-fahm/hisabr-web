"use client";
import React, { FC, useEffect, useState } from "react";
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
import Tooltip from "@/Components/UI/Toolstips/Tooltip";

interface TableRow {
  name: string;
  totalqty: any;
  totalextprice: any;
  
}

const Sales: FC = () => {
  const router = useRouter();
  const [items, setItems] = useState<any>([]);
  const [Sitems, setSItems] = useState<any>([]);
  const [totalOrders, setTotalOrders] = useState<number>();
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

  const columns: ColumnDef<TableRow>[] = [
    {
      accessorKey: "name",
      header: () => <div className="text-left">Name</div>,
      cell: (info) => <span>{info.getValue() as string}</span>,
      size: 100,
    },
    
    {
      accessorKey: "totalqty",
      header: () => <div className="text-right mr-10">Quantity</div>,
      cell: (info) => (
        <div className="text-right mr-10">{info.getValue() as number}</div>
      ),
      size: 120,
    },
    {
      accessorKey: "totalextprice",
      header: () => <div className="text-right mr-10">Amount</div>,
      cell: (info) => (
        <div className="text-right mr-10">{info.getValue() as number}</div>
      ),
      size: 120,
    },   
  ];

  useEffect(() => {
    if (startDate && endDate && selectedOption ) {
      fetchData2();
      fetchData();

    }
  }, [selectedOption , globalFilter]);

  const table = useReactTable({
    data: items,
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
    // pageCount: Math.ceil(totalItems / 10),
  });

  const { pageIndex, pageSize } = table.getState().pagination;

  const fetchData2 = async () => {
    setLoading(true);
    try {
      const response: any = await sendApiRequest({
        mode: "getDqRevCenterData",
        storeid: selectedOption?.id || 69,
        startdate: startDate && format(startDate, 'yyyy-MM-dd'),
        enddate: endDate && format(endDate, 'yyyy-MM-dd'),
      });
  
      if (response?.status === 200) {
         setSItems(response?.data?.result?.dqcategories);
        setTotalOrders(response?.data?.result?.totalorders)
       
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
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const response: any = await sendApiRequest({
        mode: "getDqRevCenterData",
        sp: "GetDQCategoryData",
        storeid: selectedOption?.id || 69,
        startdate: startDate && format(startDate, 'yyyy-MM-dd'),
        enddate: endDate && format(endDate, 'yyyy-MM-dd'),
      });
  
      if (response?.status === 200) {
        setItems(response?.data?.result.dqcategories);
         setProductTotal(response?.data?.result?.producttotal)
       
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
    fetchData2();
    fetchData();
  }, []);

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



  const toggleStoreDropdown = () => {
    setIsStoreDropdownOpen((prev) => !prev);
  };

  const handleError = (message: string) => {
    setCustomToast({
      message,
      type: "error",
    });
  };

  const totalQty = items?.reduce((acc:any, row:any) => acc + Number(row.totalqty), 0);
const totalExtPrice = items?.reduce((acc:any, row:any) => acc + Number(row.totalextprice), 0);

// Ensure there's no error when `items` is empty
const hasItems = items && items.length > 0;

  return (
    <main
    className={`relative px-6 below-md:px-3  overflow-auto ${
      items?.length > 6  || Sitems?.length > 6  ? "max-h-[calc(100vh-60px)]" : "h-[620px]"
    }`}
    style={{ scrollbarWidth: "thin" }}
  >
    
      <ToastNotification
        message={customToast?.message}
        type={customToast?.type}
      />
      {uploadPdfloading && ( <Loading /> )}
      <div className="px-6 mt-6 below-md:px-3 below-md:mt-0 tablet:mt-4">
        <div className="flex flex-row below-md:flex-col pb-6 sticky z-20  w-[50%] below-md:pt-4 tablet:pt-4 bg-[#f7f8f9] below-md:pb-4">
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
                fetchDataForTender={fetchData2}
                />
            </div>         
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
        <div className="flex gap-10">

<div className="flex flex-row bg-[#FFFFFF] rounded-lg mb-8 shadow-sm border-[#7b7b7b] border-b-4 w-[17%] ml-6 p-4 justify-between items-stretch">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">COGS</p>
              <p className="text-[16px] text-[#2D3748] font-bold">{productTotal}</p>
              
            </div>
            {/* <div className="bg-[#EFF6EFA1] rounded-full w-[40px] h-[40px] flex items-center justify-center">
            <p className="text-[14px]  font-medium">{}</p>
            </div> */}
          </div>

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg mb-8 shadow-sm border-[#7b7b7b] border-b-4 w-[17%] ml-6 p-4 justify-between items-stretch">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">Total No. Of Orders</p>
              <p className="text-[16px] text-[#2D3748] font-bold">{totalOrders}</p>
              
            </div>
            {/* <div className="bg-[#EFF6EFA1] rounded-full w-[40px] h-[40px] flex items-center justify-center">
            <p className="text-[14px]  font-medium">{}</p>
            </div> */}
          </div>
          </div>

           <div className="grid grid-cols-5  below-md:grid-cols-1 tablet:grid-cols-2 w-full h-full gap-6 below-md:gap-3 below-md:pl-3 below-md:pr-3  pl-6 pr-6 items-stretch tablet:flex-wrap tablet:gap-3">
           {Sitems?.map((Items:any , index:any) => 
          
            // 
           
        <div key={index} className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#b1d0b3] border-b-4  p-4 justify-between items-stretch">
            <div>
            <Tooltip position="left" text= {Items?.name?.length > 15 ? Items.name : ""}>
            <p className="text-[14px] text-[#575F6DCC] font-medium">        {Items?.name?.length > 15 ? Items.name.substring(0, 15) + "..." : Items.name || "--"}</p>
                      </Tooltip>
              <p className="text-[16px] text-[#2D3748] font-bold">{Items?.totalextprice ? `$${Math.round(Items?.totalextprice)?.toLocaleString()}` : '$00,000'}</p>
              {/* <p className="text-[11px] text-[#388E3C] font-semibold">
                20%{" "}
                <span className="text-[#575F6D] font-normal">
                  increase in sales
                </span>
              </p> */}
            </div>
            <div className="bg-[#EFF6EFA1] rounded-full w-[40px] h-[40px] flex items-center justify-center">
            <p className="text-[14px]  font-medium">{Items.totalqty}</p>
            </div>
          </div>

          
          
           )}
           </div>

           <div className="grid grid-cols-5 mt-8 below-md:grid-cols-1 tablet:grid-cols-2 w-full h-full gap-6 below-md:gap-3 below-md:pl-3 below-md:pr-3  pl-6 pr-6 items-stretch tablet:flex-wrap tablet:gap-3">
           {items?.map((Items:any , index:any) => 
          
            // 
           
        <div key={index} className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#cf4040] border-b-4  p-4 justify-between items-stretch">
            <div>
            <Tooltip position="left" text= {Items?.name?.length > 15 ? Items.name : ""}>
            <p className="text-[14px] text-[#575F6DCC] font-medium">        {Items?.name?.length > 15 ? Items.name.substring(0, 15) + "..." : Items.name || "--"}</p>
                      </Tooltip>
         
              <p className="text-[16px] text-[#2D3748] font-bold">{Items?.totalextprice ? `$${Math.round(Items?.totalextprice)?.toLocaleString()}` : '$00,000'}</p>
              {/* <p className="text-[11px] text-[#388E3C] font-semibold">
                20%{" "}
                <span className="text-[#575F6D] font-normal">
                  increase in sales
                </span>
              </p> */}
            </div>
            <div className="bg-[#EFF6EFA1] rounded-full w-[40px] h-[40px] flex items-center justify-center">
            <p className="text-[14px]  font-medium">{Items.totalqty}</p>
            </div>
          </div>

          
          
           )}
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

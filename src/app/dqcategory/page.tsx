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
    "Mix GallLitre",
    "Meat LbsKg",
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
        setSItems(response?.data?.result?.dqcategories);
        setTotalOrders(response?.data?.result?.totalorders);
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
        setAddress(response?.data?.store[0]);
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
      fetchDataForAddress();
    }
    1;
  }, [selectedOption]);

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
    "8 Round": '8" Round Cake',
    "10 Round": '10" Round Cake',
    "Sheet Cake": "Sheet",
    "Dilly Bar": "Dilly",
    "NF/NSA Bars (No sugar added)": "NF/NSA Bars",
    "Buster Bar": "Buster Bar",
    Beverage: "Beverages",
    Cakes: "Cakes",
    Food: "DQ Food",
    Starkiss: "Starkiss",
    "Soft Serve": "Dairy Queen",
    "Mix Ice Cream": "Mix GallLitre",
  };

  const getTotalByCategory = (name) => {
    const allData = [...(items || []), ...(Sitems || [])];

    const category = allData.find((item) => item.name === name);

    return category &&
      category.totalextprice !== undefined &&
      category.totalextprice !== null
      ? `$${Math.round(category.totalextprice).toLocaleString()}`
      : `$0`;
  };

  const mapData = () => {
    const header = ["Store Number", "Store Address"];
    const allData = [...(items || []), ...(Sitems || [])];

    // Create a mapping of original names to mapped names for display
    const nameMapping = allData.reduce((acc, item) => {
      const mappedName = categoryMap[item.name] || item.name;
      acc[mappedName] = item.name; // Mapped name as key, original name as value
      return acc;
    }, {});

    // Display the mapped names in the header and filter unwanted items
    const itemNames = Object.keys(nameMapping).filter(
      (name) =>
        name !== "Novelties-Boxed" &&
        name !== "Chx Strip" &&
        name !== "French Fries"
    );

    const footer = [
      "Transaction Count",
      "Inventory Purchases",
      "Ending Inventory",
    ];

    const data = header.concat(itemNames, footer);

    const values = data.map((category) => {
      if (category === "Store Number") return address?.storename || "";
      if (category === "Store Address") return address?.location || "";
      if (footer.includes(category)) return "$" + 0;

      // Use the original name to fetch the value
      const originalName = nameMapping[category] || category;

      return getTotalByCategory(originalName);
    });

    console.log("Final Data:", data);
    console.log("Final Values:", values);

    return [data, values];
  };

  const exportToExcel = () => {
    const [headers, values] = mapData();
    const worksheet = XLSX.utils.aoa_to_sheet([headers, values]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Set column widths
    const wscols = [
      { wch: 20 }, // Store Number
      { wch: 35 }, // Store Address
      { wch: 15 }, // Dairy Queen
      { wch: 15 }, // DQ Food
      { wch: 15 }, // Beverages
      // { wch: 15 }, // Breakfast
      { wch: 15 }, // Cakes
      // { wch: 15 }, // OJ Beverages
      { wch: 15 }, // Mix Gall\Litre
      // { wch: 15 }, // Meat Lbs\Kg
      { wch: 15 }, // 8 Round
      { wch: 10 }, // 10 Round
      { wch: 10 }, // Sheet
      { wch: 10 }, // Dilly
      { wch: 10 }, // Starkiss
      { wch: 10 }, // NF/NSA Bars
      // { wch: 20 }, // NSA/Non Dairy Dilly
      { wch: 15 }, // Buster Bar
      { wch: 30 }, // Transaction Count
      { wch: 30 }, // Inventory Purchases
      { wch: 30 }, // Ending Inventory
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
      <div className="px-6 mt-6 below-md:px-3 below-md:mt-0 tablet:mt-4">
      <div className="flex flex-row justify-between below-md:flex-col pb-6 sticky z-20 w-full below-md:pt-4 tablet:pt-4 bg-[#f7f8f9] below-md:pb-4 gap-3 tablet:grid tablet:grid-cols-3">
      {/* Store & Date Picker */}
    <div className="flex flex-row below-md:flex-col w-[50%] tablet:w-full below-md:w-full gap-3 below-md:gap-4 tablet:col-span-2">
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
        widthchange="w-[60%] below-md:w-full tablet:w-[50%]"
        className="h-[35px] p-2 below-md:px-4"
      />
    <div className="w-full below-md:w-full tablet:w-[40%] h-[40px] p-2 below-md:px-4">
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
    <div className="flex below-md:w-full below-md:pt-4 gap-4 items-center below-md:justify-center">
  <button
    className="w-[159px] below-md:w-[90%] h-[35px] bg-[#168A6F] hover:bg-[#11735C] text-white font-medium rounded-md text-[13px] flex items-center justify-center px-4 py-2 gap-[0.25rem]"
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
  <div className="flex flex-row bg-[#FFFFFF] rounded-lg mb-8 shadow-sm border-[#7b7b7b] border-b-4 w-[20%] tablet:w-[100%] below-md:w-full p-3 below-md:p-3 justify-between items-stretch">
    <div className="flex flex-col gap-6">
      <p className="text-[14px] text-[#575F6DCC] font-bold">COGS</p>
      <p className="text-[18px] text-[#2D3748] font-bold">
        {productTotal
          ? `$${productTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          : "$0.00"}
      </p>
    </div>
    {/* Uncomment and update if you want to add the circular count
    <div className="flex items-center justify-center bg-[#EFF6EFA1] rounded-full w-[60px] h-[60px]">
      <p className="text-[18px] font-medium">{}</p>
    </div>
    */}
  </div>

  <div className="flex flex-row bg-[#FFFFFF] rounded-lg mb-8 shadow-sm border-[#7b7b7b] border-b-4 w-[20%]  tablet:w-[100%] below-md:w-full p-3 below-md:p-3 justify-between items-stretch">
    <div className="flex flex-col gap-6">
      <p className="text-[14px] text-[#575F6DCC] font-bold">Order Counts</p>
      <p className="text-[18px] text-[#2D3748] font-bold">
          {totalOrders ? totalOrders.toLocaleString("en-US") : "0"}

      </p>
    </div>
    {/* Uncomment and update if you want to add the circular count
    <div className="flex items-center justify-center bg-[#EFF6EFA1] rounded-full w-[60px] h-[60px]">
      <p className="text-[18px] font-medium">{}</p>
    </div>
    */}
  </div>
</div>

<div className="grid grid-cols-5 below-md:grid-cols-1 tablet:grid-cols-2 w-full h-full gap-6 below-md:gap-3 below-md:pl-3 below-md:pr-3 items-stretch tablet:flex-wrap tablet:gap-3">          {Sitems?.map((Items: any, index: any) => (
            <div
              key={index}
              className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#b1d0b3] border-b-4  p-3 justify-between items-stretch"
            >
              <div className="flex flex-col gap-6">
                <Tooltip
                  position="left"
                  text={Items?.name?.length > 15 ? Items.name : ""}
                >
                  <p className="text-[16px] text-[#575F6DCC] font-bold h-7">
                    {" "}
                    {Items?.name?.length > 15
                      ? Items.name.substring(0, 15) + "..."
                      : Items.name || "--"}
                  </p>
                </Tooltip>
                <p className="text-[16px] text-[#2D3748] font-bold">
                  {Items?.totalextprice
                    ? `$${Math.round(Items?.totalextprice)?.toLocaleString()}`
                    : "$00,000"}
                </p>
                {/* <p className="text-[11px] text-[#388E3C] font-semibold">
                20%{" "}
                <span className="text-[#575F6D] font-normal">
                  increase in sales
                </span>
              </p> */}
              </div>
              <div className="flex items-center">
    <div className="flex items-center justify-center bg-[#EFF6EFA1] rounded-full w-[60px] h-[60px]">
      <p className="text-[20px] font-medium">{Items.totalqty}</p>
    </div>
  </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 mt-8 below-md:grid-cols-1 tablet:grid-cols-2 w-full h-full gap-6 below-md:gap-3 below-md:pl-3 below-md:pr-3 items-stretch tablet:flex-wrap tablet:gap-3">          {items?.map((Items: any, index: any) => (
            <div
              key={index}
              className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#cf4040] border-b-4 p-3 justify-between items-stretch"
            >
              <div className="flex flex-col gap-6">
                <Tooltip
                  position="left"
                  text={Items?.name?.length > 15 ? Items.name : ""}
                >
                  <p className="text-[16px] text-[#575F6DCC] font-bold h-7">
                    {Items?.name?.length > 15
                      ? Items.name.substring(0, 15) + "..."
                      : Items.name || "--"}
                  </p>
                </Tooltip>

                <p className="text-[16px] text-[#2D3748] font-bold">
                  {Items?.totalextprice
                    ? `$${Math.round(Items?.totalextprice)?.toLocaleString()}`
                    : "$00,000"}
                </p>
              </div>
               <div className="flex items-center">
    <div className="flex items-center justify-center bg-[#EFF6EFA1] rounded-full w-[60px] h-[60px]">
      <p className="text-[20px] font-medium">{Items.totalqty}</p>
    </div>
  </div>

            </div>
          ))}
          {subtotal && subtotal !== 0 && (
            <div className="flex flex-col bg-[#FFFFFF] rounded-lg shadow-sm border-[#cf4040] border-b-4 p-3 justify-between items-stretch">
              <p className="text-[14px] text-[#575F6DCC] font-bold h-7">
                Ending Inventory
              </p>
              <p className="text-[16px] text-[#2D3748] font-bold">
                ${subtotal.toLocaleString()}
              </p>
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

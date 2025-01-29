"use client";
import { useEffect, useRef, useState } from "react";
import "../globals.css";
import MultiLineChart from "@/Components/Charts-Graph/MultiLineChart";
import BarChart3 from "@/Components/Charts-Graph/BarChart3";
import PieChart2 from "@/Components/Charts-Graph/Piechart2";
import { useRouter } from "next/navigation";
import Pagination from "@/Components/UI/Pagination/Pagination";
import Dropdown from "@/Components/UI/Themes/DropDown";
import Images from "@/Components/UI/Themes/Image";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";
import { sendApiRequest } from "@/utils/apiUtils";
import Skeleton from "react-loading-skeleton";
import React from "react";
import moment from "moment";
import UploadInvoicepopup from "@/Components/Invoice/UploadInvoicePopup";

interface TableRow {
  invoicedate: string;
  storename: string;
  sellername: string;
  invoiceid: number;
  quantity: number;
  duedate: string;
  total: string;
  invoicenumber: string;
}

// const data: TableRow[] = [
//   {
//     date: "2022-01-01",
//     store: 14890,
//     quantity: 1500,
//     total: "$3,000.00",
//     name: "GORDON",
//   },
//   {
//     date: "2022-01-02",
//     store: 14891,
//     quantity: 1520,
//     total: "$3,100.00",
//     name: "SMITH",
//   },
//   {
//     date: "2022-01-03",
//     store: 14892,
//     quantity: 1600,
//     total: "$3,200.00",
//     name: "JACKSON",
//   },
//   {
//     date: "2022-01-04",
//     store: 14893,
//     quantity: 1400,
//     total: "$2,900.00",
//     name: "BROWN",
//   },
//   {
//     date: "2022-01-05",
//     store: 14894,
//     quantity: 1350,
//     total: "$2,700.00",
//     name: "DAVIS",
//   },
//   {
//     date: "2022-01-06",
//     store: 14895,
//     quantity: 1650,
//     total: "$3,500.00",
//     name: "MILLER",
//   },
//   {
//     date: "2022-01-07",
//     store: 14896,
//     quantity: 1700,
//     total: "$3,700.00",
//     name: "WILSON",
//   },
//   {
//     date: "2022-01-08",
//     store: 14897,
//     quantity: 1800,
//     total: "$4,000.00",
//     name: "MOORE",
//   },
//   {
//     date: "2022-01-09",
//     store: 14898,
//     quantity: 1750,
//     total: "$3,800.00",
//     name: "TAYLOR",
//   },
//   {
//     date: "2022-01-10",
//     store: 14899,
//     quantity: 1550,
//     total: "$3,200.00",
//     name: "ANDERSON",
//   },
//   {
//     date: "2022-01-11",
//     store: 14900,
//     quantity: 1600,
//     total: "$3,400.00",
//     name: "THOMAS",
//   },
//   {
//     date: "2022-01-12",
//     store: 14901,
//     quantity: 1450,
//     total: "$3,000.00",
//     name: "WHITE",
//   },
//   {
//     date: "2022-01-13",
//     store: 14902,
//     quantity: 1500,
//     total: "$3,100.00",
//     name: "HARRIS",
//   },
//   {
//     date: "2022-01-14",
//     store: 14903,
//     quantity: 1550,
//     total: "$3,300.00",
//     name: "MARTIN",
//   },
//   {
//     date: "2022-01-15",
//     store: 14904,
//     quantity: 1600,
//     total: "$3,500.00",
//     name: "GARCIA dasjhdjkh",
//   },
// ];

// const formattedData = data?.map((item) => {
//   const rawDate = new Date(item?.date);

//   // Format the date as MM-DD-YY
//   const formattedDate = `${(rawDate?.getMonth() + 1)
//     .toString()
//     .padStart(
//       2,
//       "0"
//     )}-${rawDate?.getDate().toString().padStart(2, "0")}-${rawDate
//     .getFullYear()
//     .toString()
//     .slice(-2)}`;

//   return { ...item, date: formattedDate };
// });

// const columns: ColumnDef<TableRow>[] = [
//   {
//     accessorKey: "date",
//     header: "Date",
//     size: 100,
//   },
//   {
//     accessorKey: "store",
//     header: "Store",
//     size: 100,
//   },
//   {
//     accessorKey: "quantity",
//     header: "Quantity",
//     size: 100,
//   },
//   {
//     accessorKey: "total",
//     header: "Total",
//     size: 100,
//   },
//   {
//     accessorKey: "name",
//     header: "Name",
//     size: 160,
//   },
//   {
//     id: "view",
//     header: () => <div className="text-center"></div>,
//     cell: () => (
//       <span className="flex justify-center">
//         <Images
//           src="/images/vieweyeicon.svg"
//           alt="Eye Icon"
//           className="w-4 h-4"
//         />
//       </span>
//     ),
//     size: 60,
//   },
// ];

const dat = [
  { label: "Beverage", value: 10836, color: "#376066CC" },
  { label: "Cakes", value: 326460, color: "#DEC560" },
  { label: "Food", value: 1835, color: "#5B7993" },
  { label: "Novelties-Boxed", value: 231725, color: "#A6A69E" },
  { label: "Soft Serve", value: 234, color: "#796C72" },
  { label: "Donations", value: 234, color: "#796C72" },
];

const DetailsPage: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState<TableRow[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [selectedOption, setSelectedOption] = useState<any>();
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [store, setStore] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });

  const navigateToInvoice = (invoiceId: any) => {
    const encodedId = btoa(invoiceId);
    // Make the Base64 URL-safe by replacing `+` with `-`, `/` with `_`, and removing the padding (`=`):
    const urlSafeEncodedId = encodedId.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    router.push(`/invoices/${urlSafeEncodedId}`);
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
      size: 30,
    },
    {
      accessorKey: "quantity",
      header: () => <div className="text-right">Quantity</div>,
      cell: (info) =>
        <span className="flex justify-end"> {info.getValue() as number}</span>,
      size: 100,
    },
    {
      accessorKey: "total",
      header: () => <div className="text-right pr-8">Total</div>,
      cell: (info) => (
        <span className="flex justify-end pr-8">{info.getValue() as string}</span>
      ),
      size: 70,
    },
    {
      accessorKey: "sellername",
      header: () => <div className="text-left">Name</div>,
      cell: (info) => (
        <span className="text-left ">{info.getValue() as string}</span>
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
          <img src="/images/vieweyeicon.svg" alt="View Icon"
            className=" w-4 h-4 below-md:h-5 below-md:w-5 " />
        </button>
      ),
      size: 30,
    },
  ];

  const formattedData = data?.map((item) => {
    const rawDate = new Date(item?.invoicedate);

    // Format the date as MM-DD-YY
    const formattedDate = `${(rawDate?.getMonth() + 1)
      .toString()
      .padStart(
        2,
        "0"
      )}-${rawDate?.getDate().toString().padStart(2, "0")}-${rawDate
        .getFullYear()
        .toString()
        .slice(-2)}`;

    return { ...item, date: formattedDate };
  });

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
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response: any = await sendApiRequest({
          mode: "getinvoices",
          page: table.getState().pagination.pageIndex + 1,
          limit: table.getState().pagination.pageSize,
        });

        if (response?.status === 200) {
          setData(response?.data?.invoices || []);
          response?.data?.total > 0 &&
            setTotalItems(response?.data?.total || 0);
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
      }
    };

    fetchData();
  }, [pageIndex, pageSize]);


  const fileInputRef: any = useRef(null);
  const handleButtonClick = () => {
    // Programmatically trigger the hidden file input
    fileInputRef.current.click();
  };
  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file.name);
      if (file && file.type === "application/pdf") {
        const formData = new FormData();
        formData.append("file", file);
        try {
          const response = await fetch("https://hisabr-pdf-extractor.vercel.app/convert-pdf", {
            method: "POST",
            body: formData,
          });

          const responseData = await response.json();
          console.log("Response:", responseData);
          if (response.ok) {
            const jsonData: any = {
              mode: "insertinvoice",
              invoicenumber: responseData?.invoice_details?.invoice_number,
              invoicedate: moment(moment(responseData?.invoice_details?.invoice_date, 'MM/DD/YYYY').toDate()).format('YYYY-MM-DD'),
              storename: "13246",
              duedate: moment(moment(responseData?.invoice_details?.due_date, 'MM/DD/YYYY').toDate()).format('YYYY-MM-DD'),
              total: responseData?.invoice_details?.invoice_total,
              sellername: responseData?.invoice_details?.seller_name,
              quantity: responseData?.invoice_details?.qty_ship_total,
              producttotal: responseData?.invoice_details?.product_total,
              subtotal: responseData?.invoice_details?.sub_total,
              misc: responseData?.invoice_details?.misc,
              tax: responseData?.invoice_details?.tax
            };
            const result: any = await sendApiRequest(jsonData);
            if (result?.status === 200) {
              const val: any = {
                invoiceDetails: responseData?.invoice_items || [],
              };
              const res: any = await sendApiRequest(val, `insertBulkInvoiceItems?invoiceid=${result?.data?.invoiceid}`);
            } else {
              setTimeout(() => {
                setCustomToast({
                  message: "Failed to insert invoice details",
                  type: "error",
                });
              }, 0);
            }

          } else {
            alert("Failed to upload file.");
          }
        } catch (error) {
          console.error("Error uploading file:", error);
          alert("An error occurred.");
        }
      } else {
        alert("Please upload a PDF file.");
      }
    } else {
      alert("Please select a file.");
      return;
    }
  };

  const handleBack = () => {
    router.back();
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

  const fetchDropdownData = async () => {
    try {
      const response = await sendApiRequest({ mode: "getallstores" });
      if (response?.status === 200) {
        setStore(response?.data?.stores || []);
      } else {
        handleError(response?.message);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };
  useEffect(() => {
    fetchDropdownData();
  }, []);

  /**main dropdown */
  const [selectedYearOption1, setSelectedYearOption1] =
    useState<string>("2021");
  const [isYearOpen1, setIsYearOpen1] = useState<boolean>(false);

  /**Monthly revenue */
  const [selectedYearOption2, setSelectedYearOption2] =
    useState<string>("2021");
  const [isYearOpen2, setIsYearOpen2] = useState<boolean>(false);

  /**product revenue */
  const [selectedYearOption3, setSelectedYearOption3] =
    useState<string>("2021");
  const [isYearOpen3, setIsYearOpen3] = useState<boolean>(false);

  const Yearoptions = [
    { id: 1, name: "2024" },
    { id: 2, name: "2023" },
    { id: 3, name: "2022" },
    { id: 4, name: "2021" },
  ];

  const toggleYearDropdown = (id: number) => {
    switch (id) {
      case 1:
        setIsYearOpen1(!isYearOpen1);
        break;
      case 2:
        setIsYearOpen2(!isYearOpen2);
        break;
      case 3:
        setIsYearOpen3(!isYearOpen3);
        break;

      default:
        break;
    }
  };

  const handleYearSelect = (
    option: { id: number; name: string },
    dropdownId: number
  ) => {
    switch (dropdownId) {
      case 1:
        setSelectedYearOption1(option.name);
        setIsYearOpen1(false);
        break;
      case 2:
        setSelectedYearOption2(option.name);
        setIsYearOpen2(false);
        break;
      case 3:
        setSelectedYearOption3(option.name);
        setIsYearOpen3(false);
        break;
      default:
        break;
    }
  };


  return (
    <main
      className="max-h-[calc(100vh-60px)] overflow-auto px-6 below-md:px-3"
      style={{ scrollbarWidth: "thin" }}
    >
      <img
        onClick={handleBack}
        src="/images/mobilebackicon.svg"
        className="fixed top-4 left-4 z-50 below-lg:hidden tablet:hidden"
      />

      {/* <div className="below-md:flex below-md:justify-center ">
        <p className="text-[18px] below-md:text-[16px] below-md:mr-8 font-bold text-defaultblack fixed top-0 z-30 mt-5 below-md:pl-0 below-md:pr-0 pl-6 pr-6">
          Gross Revenue Analysis
        </p>
      </div> */}
      <div className="mt-6 mb-6 below-md:mt-4 below-md:mb-4 sticky z-10  bg-[#f7f8f9]">
        <div>
          <img
            onClick={handleBack}
            alt="Back Arrow"
            className="w-7 h-7 my-3 below-md:hidden cursor-pointer"
            src="/images/webbackicon.svg"
          ></img>
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row below-md:flex-col gap-3 w-full">
            {/* First Dropdown */}

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
            />

            {/* Second Dropdown */}

            <Dropdown
              options={Yearoptions}
              selectedOption={selectedYearOption1}
              onSelect={(option) => handleYearSelect(option, 1)}
              isOpen={isYearOpen1}
              toggleOpen={() => toggleYearDropdown(1)}
            />
          </div>
        </div>
      </div>

      <div className="">
        <div className="grid grid-cols-4 below-md:grid-cols-1 tablet:grid-cols-2 w-full h-full gap-6 below-md:gap-3  items-stretch">
          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#C2D1C3] border-b-4 w-full items-stretch p-4 justify-between">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">
                Total Gross Revenue
              </p>
              <p className="text-[16px] text-[#2D3748] font-bold">
                $ 2,680,153
              </p>
              <p className="text-[11px] text-[#388E3C] font-semibold">
                20%{" "}
                <span className="text-[#575F6D] font-normal">
                  more than last year
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#947F914D] border-b-4 w-full items-stretch p-4 justify-between">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">
                Revenue Growth
              </p>
              <p className="text-[16px] text-[#2D3748] font-bold">+ 15.3%</p>
              <p className="text-[11px] text-[#388E3C] font-semibold">
                <span className="text-[#575F6D] font-normal">
                  Increased compared to last year
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#9E8F503B] border-b-4 w-full items-stretch p-4 justify-between">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">
                Average Per Transaction
              </p>
              <p className="text-[16px] text-[#2D3748] font-bold">$ 161,358</p>
              <p className="text-[11px] text-[#388E3C] font-semibold">
                <span className="text-[#575F6D] font-normal">
                  Average revenue earned per sale
                </span>
              </p>
            </div>
          </div>

          <div className="bg-[#FFFFFF] rounded-lg shadow-sm border-[#9E8F503B] border-b-4 w-full items-stretch p-4 justify-between">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">
                Revenue Target Achievement
              </p>
              <p className="text-[16px] text-[#2D3748] font-bold">$ 161,358</p>
              <p className="text-[11px] text-[#388E3C] font-semibold">
                92%
                <span className="text-[#575F6D] font-normal">
                  of target met
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-row below-md:flex-col w-full mt-6 below-md:mt-3 mb-6 below-md:mb-3">
          <div className="flex flex-col w-[70%] below-md:w-full">
            <div className="bg-white shadow-md rounded-md">
              <div>
                <p className="text-[#393E47] text-[16px] font-bold mt-3 ml-6 mb-3">
                  Detailed Revenue
                </p>
              </div>
              <div>
                <MultiLineChart />
              </div>
            </div>
            <div className="bg-white shadow-md rounded-md mt-6 below-md:mt-3">
              <div className="flex flex-row justify-between mx-6 mt-5 mb-5">
                <div>
                  <p className="text-[#393E47] text-[16px] font-bold mb-3">
                    Monthly Revenue
                  </p>
                </div>
                <div className="relative below-md:w-[35%]">
                  <Dropdown
                    className="relative below-md:w-full"
                    shadowclassName="shadow-none border border-gray-200"
                    options={Yearoptions}
                    selectedOption={selectedYearOption2}
                    onSelect={(option) => handleYearSelect(option, 2)}
                    toggleOpen={() => toggleYearDropdown(2)}
                    isOpen={isYearOpen2}
                    widthchange="below-lg:w-[130px] tablet:w-[130px]"
                  />
                </div>
              </div>
              <div className="-mb-2 below-md:mb-3">
                <BarChart3 selectedYear={Number(selectedYearOption2)} />
              </div>
            </div>
          </div>
          <div className="w-[30%] below-md:w-full below-md:ml-0 below-md:mt-3 bg-white ml-6 shadow-md rounded-md">
            <div className="flex flex-col ">
              <div className="flex flex-row justify-between px-6 pt-6">
                <div>
                  <p className="text-[#393E47] font-bold text-[16px]">
                    Product Revenue
                  </p>
                </div>
                <div className="relative below-md:w-[35%] z-[60]">
                  <Dropdown
                    className="relative w-full"
                    shadowclassName="shadow-none border border-gray-200"
                    options={Yearoptions}
                    selectedOption={selectedYearOption3}
                    onSelect={(option) => handleYearSelect(option, 3)}
                    toggleOpen={() => toggleYearDropdown(3)}
                    isOpen={isYearOpen3}
                    widthchange="below-lg:w-[130px] tablet:w-[85px]"
                  />
                </div>
              </div>
              <div>
                <PieChart2 />
              </div>
              <div>
                <div className="w-full max-w-sm mx-auto px-6 below-md:mb-6">
                  <ul>
                    {dat?.map((item, index) => (
                      <li
                        key={index}
                        className="flex px-[9%] items-center justify-between py-2"
                      >
                        {/* Color Circle */}
                        <div className="flex items-center">
                          <span
                            className="inline-block w-3 h-3 rounded-full mr-3"
                            style={{ backgroundColor: item.color }} // Apply dynamic hex color
                          ></span>
                          <span className="text-[#000000B2] text-[12px]">
                            {item.label}
                          </span>
                        </div>
                        {/* Value */}
                        <span className="font-semibold text-[#0A0A0A] text-[14px]">
                          {item.value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/**table */}
        <div className="flex flex-row justify-between  items-end mb-6 below-md:mb-3">
          <div>
            <p className="text-[16px] font-bold text-[#334155] ml-3">
              Invoices
            </p>
          </div>
          <div>
            <button
              className="flex items-center justify-center bg-[#168A6F] hover:bg-[#11735C] shadow-lg below-md:mt-3 [box-shadow:0px_3px_8px_0px_#00000026] w-[170px]  h-[37px] rounded-md text-white text-[13px] font-semibold hover:shadow-lg transition-shadow duration-300"
              onClick={handleButtonClick}
            >
              <img
                src="/images/uploadIcon.svg"
                alt="Upload Icon"
                className="mr-2"
              />
              Upload Invoice
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/*Web View : Invoice Table */}
        <div className="below-md:hidden">
          <div className="overflow-x-auto  shadow-sm border-collapse border border-b border-[#E4E4EF] rounded-md  flex-grow flex flex-col below-md:hidden">
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
                className="w-full overflow-y-auto scrollbar-thin flex-grow"
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
                    ) :
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
        </div>

        {/* Pagination
          <Pagination table={table} totalItems={0} /> */}
        {/* Mobile View : Card section */}
        <div className="block md:hidden">
          {formattedData.map((card, index) => (
            <div
              key={index}
              className="flex flex-col w-full  rounded-lg bg-white border border-b border-[#E4E4EF] below-lg:hidden my-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4 px-4 py-4 text-[#334155]">
                  <p className="text-[14px] font-bold">{card.date}</p>
                  <p className="text-[14px] font-bold">{card.sellername}</p>
                </div>

                <div className="flex px-4 py-4">
                  <button
                    onClick={() => (window.location.href = "/invoices/invoicedetails")}
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
                  <p className="text-[#636363]">quantity</p>
                  <p className="text-[#636363]">total</p>
                </div>
                <div className="flex flex-col text-[14px] text-right space-y-3">
                  <p className="text-[#1A1A1A]">{card.storename}</p>
                  <p className="text-[#000000]">{card.quantity}</p>
                  <p className="text-[#1A1A1A]">{card.total}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="hidden below-md:block justify-end fixed bottom-5 right-5">
            <UploadInvoicepopup />
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

export default DetailsPage;

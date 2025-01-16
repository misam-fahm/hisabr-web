"use client";

import React, { FC, useState, useRef, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import AddExpenses from "@/Components/ExpensesPopup/AddExpenses";
import DateRangePicker from "@/Components/UI/Themes/DateRangePicker";
import Dropdown from "@/Components/UI/Themes/DropDown";
import { useRouter } from "next/navigation";
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

interface TableRow {
  expensedate: string;
  storename: number;
  amount: string;
  description: string;
  expensename: string;
}

const Expenses: FC = () => {

  const router = useRouter();
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [data, setData] = useState<TableRow[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0); 
  const [loading, setLoading] = useState<boolean>(true);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });


  const columns: ColumnDef<TableRow>[] = [
    {
      accessorKey: "date",
      header: () => <div className="text-left ">Date</div>,
      cell: (info) => <span>{info.row.original.expensedate}</span>,
      size: 60,
    },
    {
      accessorKey: "store",
      header: () => <div className="text-left">Store</div>,
      cell: (info) => <span>{info.row.original.storename}</span>,
      size: 120,
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Amount</div>,
      cell: (info) => (
        <div className="text-right ">{info.getValue() as string}</div>
      ),
      size: 40,
    },
    {
      accessorKey: "description",
      header: () => <div className="text-left">Description</div>,
      cell: (info) => {
        const description = info.row.original.description;
        const truncatedDescription =
          description.length > 50 ? `${description.slice(0, 55)}...` : description;
        return <span className="">{truncatedDescription}</span>;
      },
      size: 190,
    },
    {
      accessorKey: "type",
      header: () => <div className="text-left">Type</div>,
      cell: (info) => <span className="">{info.row.original.expensename}</span>,
      size: 100,
    },
    {
      id: "edit",
      header: () => <div className="text-center"></div>,
      cell: (info) => (
        <>
          <span className="flex justify-center">
            <EditExpense initialData={info.row.original}  />
          </span>
        </>
      ),
      size: 30,
    },
    {
      id: "delete",
      header: () => <div className="text-center"></div>,
      cell: () => (
        <>
          <span className="flex justify-center mr-4">
            {" "}
            <DeleteExpense />
          </span>
        </>
      ),
      size: 50,
    },
  ];
 
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
          mode: "getexpenses",
          page: table.getState().pagination.pageIndex + 1,
          limit: table.getState().pagination.pageSize,
        });

        if (response?.status === 200) {
          setData(response?.data?.expenses || []);
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
 
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    // Focus the input field when the image is clicked
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const [isOpen, setIsOpen] = useState<boolean>(false); 
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };
  /**dropdown */
  const [selectedOption, setSelectedOption] = useState<string>("Stores");

  const options = ["Store 1", "Store 2", "Store 3", "All Store"];
  const toggleDropdown1 = () => setIsOpen(!isOpen);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    //handleSelect(option); // Call the passed handler
  };
  const handleBack = () => {
    router.push("/");
  };
  const handleAddExpense = (newExpense:any) => {
    setData((prevExpenses) => [...prevExpenses, newExpense]);
  };


  return (
    <main
      className="max-h-[calc(100vh-50px)] px-6 below-md:px-3 overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <>
        <div>
          <img
            onClick={handleBack}
            alt="Back Arrow"
            className="w-7 h-7 my-4 below-md:hidden cursor-pointer"
            src="/images/webbackicon.svg"
          ></img>
        </div>
        <div className="flex flex-row below-md:flex-col w-full below-md:item-start below-md:mt-4 below-md:mb-4 mt-4 mb-6">
          <div className="flex flex-row gap-3 below-md:gap-2 below-md:space-y-1 w-full below-md:flex-col">
            <Dropdown
              options={options}
              selectedOption={selectedOption}
              onSelect={handleSelect}
              isOpen={isOpen}
              toggleOpen={toggleDropdown1}
              widthchange="w-full"
            />

            <div className="w-full tablet:w-full below-md:w-full h-[35px]">
              <DateRangePicker />
            </div>

            <div className="flex shadow  below-md:w-full text-[12px] bg-[#ffff] items-center rounded w-full h-[35px]">
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
          <div className="block pl-24 below-md:hidden">
            <AddExpenses onAddExpense={handleAddExpense} />
          </div>
        </div>

        {/*Mobile View : Card section */}
        <div className="block md:hidden mb-16">
          {data?.map((card, index) => (
            <div
              key={index}
              className="flex flex-col w-full rounded-lg bg-white border border-b border-[#E4E4EF] below-lg:hidden my-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4 px-3 py-4">
                  <p className="text-[14px] font-bold">{card.expensedate}</p>
                  <p className="text-[14px] font-bold">{card.expensename}</p>
                </div>

                <div className="flex gap-5 mb-1 px-4 py-4">
                  <>
                    <EditExpense initialData={card}
                      onSubmit={(updatedData) => console.log("Updated Expense:", updatedData)}
                      onClose={() => console.log("Modal Closed")} />
                    <DeleteExpense />
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
          <div className=" fixed hidden below-md:block">
            {" "}
            <AddExpenses onAddExpense={handleAddExpense} />
          </div>
        </div>

        {/*Web View :  Expenses Table */}
        <div className="overflow-x-auto shadow-sm border-collapse border border-b border-[#E4E4EF] rounded-md  flex-grow flex flex-col below-md:hidden">
          <div className="overflow-hidden max-w-full rounded-md">
            <table className="w-full border-collapse text-white table-fixed rounded-md">
              <thead className="bg-[#334155] top-0 z-10">
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
        {/* Pagination Numbers */}
        <div className="mt-4  below-md:hidden">
        <Pagination table={table} totalItems={totalItems} />
        </div>
      </>
    </main>
  );
};

export default Expenses;

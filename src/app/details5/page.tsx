"use client";
import React from "react";
import { useState } from "react";
import "../globals.css";
import { useRouter } from "next/navigation";
import Images from "@/Components/ui/Common/Image";
import Pagination from "@/Components/ui/Common/Pagination";
import Dropdown from "@/Components/ui/Common/DropDown";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import AddExpenses from "@/Components/Expenses/AddExpenses";
import DeleteExpense from "@/Components/Expenses/DeleteExpense";
import EditExpense from "@/Components/Expenses/EditExpense";

interface TableRow {
  date: string;
  store: number;
  amount: number;
  description: string;
  type: string;
}

const data: TableRow[] = [
  {
    date: "2022-01-01",
    store: 13246,
    amount: 11800,
    description: "MORTGAGE",
    type: "MORTGAGE",
  },
  {
    date: "2022-01-01",
    store: 13246,
    amount: 11800,
    description: "MORTGAGE",
    type: "MORTGAGE",
  },
  {
    date: "2022-01-05",
    store: 14567,
    amount: 10250,
    description: "MORTGAGE",
    type: "MORTGAGE",
  },
  {
    date: "2022-01-10",
    store: 15678,
    amount: 12500,
    description: "MORTGAGE",
    type: "MORTGAGE",
  },
  {
    date: "2022-01-15",
    store: 16789,
    amount: 13500,
    description: "MORTGAGE",
    type: "MORTGAGE",
  },
  {
    date: "2022-01-20",
    store: 17890,
    amount: 11000,
    description: "MORTGAGE",
    type: "MORTGAGE",
  },
  {
    date: "2022-01-25",
    store: 18901,
    amount: 9800,
    description: "MORTGAGE",
    type: "MORTGAGE",
  },
  {
    date: "2022-02-01",
    store: 20012,
    amount: 15500,
    description: "MORTGAGE",
    type: "MORTGAGE",
  },
  {
    date: "2022-02-05",
    store: 21234,
    amount: 12500,
    description: "MORTGAGE",
    type: "MORTGAGE",
  },
  {
    date: "2022-02-10",
    store: 22345,
    amount: 8900,
    description: "MORTGAGE",
    type: "MORTGAGE",
  },
  {
    date: "2022-02-15",
    store: 23456,
    amount: 14000,
    description: "MORTGAGE",
    type: "MORTGAGE",
  },
  {
    date: "2022-02-20",
    store: 24567,
    amount: 9500,
    description: "MORTGAGE",
    type: "MORTGAGE",
  },
  {
    date: "2022-02-25",
    store: 25678,
    amount: 11500,
    description: "MORTGAGE",
    type: "MORTGAGE",
  },
  {
    date: "2022-03-01",
    store: 26789,
    amount: 10500,
    description: "MORTGAGE",
    type: "MORTGAGE",
  },
  {
    date: "2022-03-05",
    store: 27890,
    amount: 12000,
    description: "MORTGAGE",
    type: "MORTGAGE",
  },
];

const formattedData = data?.map((item) => {
  const rawDate = new Date(item?.date);

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

console.log(formattedData);

const columns: ColumnDef<TableRow>[] = [
  { accessorKey: "date", header: "Date", size: 100 },
  { accessorKey: "store", header: "Store", size: 80 },
  { accessorKey: "amount", header: "Amount", size: 80 },
  { accessorKey: "description", header: "Description", size: 160 },
  { accessorKey: "type", header: "Type", size: 140 },
  {
    id: "edit",
    header: () => <div className="text-center">Edit</div>,
    cell: () => (
      // <button>
      //   <Images src="/images/pencil.svg" alt="pencil" width={15} height={15} />
      // </button>
      <>
        <span className="flex justify-center">
          <EditExpense
            expenseData={expenseData}
            onUpdate={(updatedData) => {
              console.log("Updated Data: ", updatedData);
              // Example: update the state or send the updated data to an API
            }}
          />
        </span>
      </>
    ),
    size: 70,
  },
  {
    id: "delete",
    header: "Delete",
    cell: () => (
      // <button>
      //   <Images src="/images/delete1.svg" alt="Delete" width={15} height={15} />
      // </button>
      <>
        <span className="flex justify-center">
          {" "}
          <DeleteExpense />
        </span>
      </>
    ),
    size: 70,
  },
];
const expenseData = {
  store: "Store 1",
  expenseType: "Type 1",
  description: "Expense description",
  amount: 100,
  date: new Date(),
};

const DetailsPage: React.FC = () => {
  const table = useReactTable({
    data: formattedData,
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
  });

  /**go back button */
  const router = useRouter();
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const [selectedOption, setSelectedOption] = useState<string>("All stores");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption2, setSelectedOption2] = useState<string>("2021");
  const [isOpen2, setIsOpen2] = useState<boolean>(false);

  const options = ["Store 1", "Store 2", "Store 3", "All Store"];
  const options2 = ["2024", "2023", "2022", "2021"];

  const toggleDropdown1 = () => setIsOpen(!isOpen);
  const toggleDropdown2 = () => setIsOpen2(!isOpen2);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleSelect2 = (option2: string) => {
    setSelectedOption2(option2);
    setIsOpen2(false);
  };

  //tooltip for mobile
  const [showTooltip, setShowTooltip] = useState(false);

  const handlePressStart = () => {
    setShowTooltip(true);
  };

  const handlePressEnd = () => {
    setShowTooltip(false);
  };

  return (
    <main
      className="max-h-[calc(100vh-60px)] below-md:max-h-[calc(100vh-1px)] tablet:max-h-[calc(100vh-1px)] below-md:mb-10 tablet:mb-10 overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <img
        onClick={handleBack}
        src="/images/backIcon.svg"
        className="fixed top-4 left-4 z-30 below-lg:hidden tablet:hidden"
      />
      {/* <div className="below-md:flex below-md:justify-center ">
        <p className="text-[18px] below-md:text-[16px] below-md:mr-8 font-bold text-defaultblack fixed top-0 z-30 mt-5 below-md:pl-0 below-md:pr-0 pl-6 pr-6">
          Operating Expense Analysis
        </p>
      </div> */}
      <div className="pt-6 pb-6 below-md:pb-3 below-md:pt-3 below-md:px-3 sticky z-10  bg-[#f7f8f9] pl-6 pr-6">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row below-md:flex-col gap-3  w-full">
            <Dropdown
              options={options}
              selectedOption={selectedOption}
              onSelect={handleSelect}
              isOpen={isOpen}
              toggleOpen={toggleDropdown1}
            />

            {/*second dropdown */}

            {/* Second Dropdown */}

            <Dropdown
              options={options2}
              selectedOption={selectedOption2}
              onSelect={handleSelect2}
              isOpen={isOpen2}
              toggleOpen={toggleDropdown2}
            />
          </div>
          <div>
            <p
              onClick={handleBack}
              className="below-md:hidden cursor-pointer text-[14px] text-[#6F6F6F] bg-[#C8C8C87A] w-[104px] h-[37px] rounded-md flex items-center justify-center"
            >
              Back
            </p>
          </div>
        </div>
        <div />
      </div>

      {/* Table remains visible as is */}
      <div className="flex flex-row justify-between items-center  mb-6 below-md:mb-3 mx-6 below-md:mx-3">
        <div>
          <p className="text-[16px] font-bold text-[#334155] ml-3 below-md:ml-2">
            Expenses
          </p>
        </div>
        <div className="below-md:hidden flex items-center justify-center bg-[#1AA47D] below-md:mt-3 w-[170px] h-[35px] rounded-md text-white text-[14px] font-medium">
          <AddExpenses />
          {/* <button className="below-md:hidden flex items-center justify-center bg-[#1AA47D] below-md:mt-3 w-[170px] h-[35px] rounded-md text-white text-[14px] font-medium">
            <img src="/images/addIcon.svg" alt="add Icon" className="mr-1" />
            Add Expense
          </button> */}
        </div>
      </div>

      <div className="mx-6 below-md:mx-3">
        {/** Table */}

        <div className="below-md:hidden">
          {/* Table */}
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-[#334155]">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="text-left px-4 py-2.5 text-[#FFFFFF] font-medium text-[15px] w-[100px]"
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
              style={{ maxHeight: "calc(100vh - 320px)" }}
            >
              <table className="w-full border-collapse border-gray-200 table-fixed">
                <tbody>
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
        <Pagination table={table} totalItems={0} />

        <div className="below-lg:hidden tablet:hidden">
          <div className="flex flex-col">
            <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
              <div className=" items-center mb-4 mt-2 px-2">
                <div className="flex justify-between pb-2 w-[100%] border-b border-[#E4E4EF]">
                  <div className="flex gap-3 text-[#1A1A1A] text-[14px] font-bold">
                    <span>12-20-24</span>
                    <span>Mortgage</span>
                  </div>
                  <div className="flex gap-7">
                    <>
                      <EditExpense
                        expenseData={expenseData}
                        onUpdate={(updatedData) => {
                          console.log("Updated Data: ", updatedData);
                          // Example: update the state or send the updated data to an API
                        }}
                      />
                      <DeleteExpense />
                    </>
                  </div>
                </div>
              </div>
              <div className="space-y-3 mb-2 px-2">
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Store</p>
                  <p className="text-[#1A1A1A] text-[12px]">13246</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Amount</p>
                  <p className="text-[#1A1A1A] text-[12px]">11,345</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Description</p>
                  <p className="text-[#1A1A1A] text-[12px]">Mortgage</p>
                </div>
              </div>
            </div>

            <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
              <div className=" items-center mb-4 mt-2 px-2">
                <div className="flex justify-between pb-2 w-[100%] border-b border-[#E4E4EF]">
                  <div className="flex gap-3 text-[#1A1A1A] text-[14px] font-bold">
                    <span>12-20-24</span>
                    <span>Mortgage</span>
                  </div>
                  <div className="flex gap-7">
                    <>
                      <EditExpense
                        expenseData={expenseData}
                        onUpdate={(updatedData) => {
                          console.log("Updated Data: ", updatedData);
                          // Example: update the state or send the updated data to an API
                        }}
                      />
                      <DeleteExpense />
                    </>
                  </div>
                </div>
              </div>
              <div className="space-y-3 mb-2 px-2">
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Store</p>
                  <p className="text-[#1A1A1A] text-[12px]">13246</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Amount</p>
                  <p className="text-[#1A1A1A] text-[12px]">11,345</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Description</p>
                  <p className="text-[#1A1A1A] text-[12px]">Mortgage</p>
                </div>
              </div>
            </div>

            <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
              <div className=" items-center mb-4 mt-2 px-2">
                <div className="flex justify-between pb-2 w-[100%] border-b border-[#E4E4EF]">
                  <div className="flex gap-3 text-[#1A1A1A] text-[14px] font-bold">
                    <span>12-20-24</span>
                    <span>Mortgage</span>
                  </div>
                  <div className="flex gap-7">
                    <>
                      <EditExpense
                        expenseData={expenseData}
                        onUpdate={(updatedData) => {
                          console.log("Updated Data: ", updatedData);
                          // Example: update the state or send the updated data to an API
                        }}
                      />
                      <DeleteExpense />
                    </>
                  </div>
                </div>
              </div>
              <div className="space-y-3 mb-2 px-2">
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Store</p>
                  <p className="text-[#1A1A1A] text-[12px]">13246</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Amount</p>
                  <p className="text-[#1A1A1A] text-[12px]">11,345</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Description</p>
                  <p className="text-[#1A1A1A] text-[12px]">Mortgage</p>
                </div>
              </div>
            </div>

            <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
              <div className=" items-center mb-4 mt-2 px-2">
                <div className="flex justify-between pb-2 w-[100%] border-b border-[#E4E4EF]">
                  <div className="flex gap-3 text-[#1A1A1A] text-[14px] font-bold">
                    <span>12-20-24</span>
                    <span>Mortgage</span>
                  </div>
                  <div className="flex gap-7">
                    <>
                      <EditExpense
                        expenseData={expenseData}
                        onUpdate={(updatedData) => {
                          console.log("Updated Data: ", updatedData);
                          // Example: update the state or send the updated data to an API
                        }}
                      />
                      <DeleteExpense />
                    </>
                  </div>
                </div>
              </div>
              <div className="space-y-3 mb-2 px-2">
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Store</p>
                  <p className="text-[#1A1A1A] text-[12px]">13246</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Amount</p>
                  <p className="text-[#1A1A1A] text-[12px]">11,345</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Description</p>
                  <p className="text-[#1A1A1A] text-[12px]">Mortgage</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="below-lg:hidden flex justify-end fixed bottom-0 right-0 tablet:hidden">
        <AddExpenses />
      </div>
    </main>
  );
};

export default DetailsPage;
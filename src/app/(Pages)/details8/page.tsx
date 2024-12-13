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

interface TableRow {
  date: string;
  store: number;
  quantity: number;
  total: string;
  name: string;
}

const data: TableRow[] = [
  {
    date: "2022-01-01",
    store: 14890,
    quantity: 1500,
    total: "$3,000.00",
    name: "GORDON",
  },
  {
    date: "2022-01-02",
    store: 14891,
    quantity: 1520,
    total: "$3,100.00",
    name: "SMITH",
  },
  {
    date: "2022-01-03",
    store: 14892,
    quantity: 1600,
    total: "$3,200.00",
    name: "JACKSON",
  },
  {
    date: "2022-01-04",
    store: 14893,
    quantity: 1400,
    total: "$2,900.00",
    name: "BROWN",
  },
  {
    date: "2022-01-05",
    store: 14894,
    quantity: 1350,
    total: "$2,700.00",
    name: "DAVIS",
  },
  {
    date: "2022-01-06",
    store: 14895,
    quantity: 1650,
    total: "$3,500.00",
    name: "MILLER",
  },
  {
    date: "2022-01-07",
    store: 14896,
    quantity: 1700,
    total: "$3,700.00",
    name: "WILSON",
  },
  {
    date: "2022-01-08",
    store: 14897,
    quantity: 1800,
    total: "$4,000.00",
    name: "MOORE",
  },
  {
    date: "2022-01-09",
    store: 14898,
    quantity: 1750,
    total: "$3,800.00",
    name: "TAYLOR",
  },
  {
    date: "2022-01-10",
    store: 14899,
    quantity: 1550,
    total: "$3,200.00",
    name: "ANDERSON",
  },
  {
    date: "2022-01-11",
    store: 14900,
    quantity: 1600,
    total: "$3,400.00",
    name: "THOMAS",
  },
  {
    date: "2022-01-12",
    store: 14901,
    quantity: 1450,
    total: "$3,000.00",
    name: "WHITE",
  },
  {
    date: "2022-01-13",
    store: 14902,
    quantity: 1500,
    total: "$3,100.00",
    name: "HARRIS",
  },
  {
    date: "2022-01-14",
    store: 14903,
    quantity: 1550,
    total: "$3,300.00",
    name: "MARTIN",
  },
  {
    date: "2022-01-15",
    store: 14904,
    quantity: 1600,
    total: "$3,500.00",
    name: "GARCIA",
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
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "store",
    header: "Store",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "total",
    header: "Total",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "view",
    header: "View",
    cell: () => (
      <button className="bg-[#FFFFFF] p-[7px] rounded-full shadow-[inset_-2px_-2px_2px_#F3FFF3,inset_2px_2px_3px_#E2F7E380]">
        <Images src="/images/eye.svg" alt="Eye Icon" width={20} height={20} />
      </button>
    ),
  },
];

const DetailsPage: React.FC = () => {
  const table = useReactTable({
    data: formattedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    initialState: {
      pagination: {
        pageSize: 5,
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

  return (
    <main
      className="max-h-[calc(100vh-70px)] overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <img
        onClick={handleBack}
        src="/images/backIcon.svg"
        className="fixed top-6 left-4 z-30 below-lg:hidden"
      />
      <div className="below-md:flex below-md:justify-center ">
        <p className="text-[18px] below-md:text-[16px] below-md:mr-8 font-bold text-defaultblack fixed top-0 z-30 mt-5 below-md:pl-0 below-md:pr-0 pl-6 pr-6">
          Items Analysis
        </p>
      </div>
      <div className="pt-6 pb-6 below-md:pb-3 sticky z-10 top-16 bg-[#f7f8f9] pl-6 pr-6 below-md:px-3">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row below-md:flex-col gap-3 w-full">
            <Dropdown
              label="Select Store"
              options={options}
              selectedOption={selectedOption}
              onSelect={handleSelect}
              isOpen={isOpen}
              toggleOpen={toggleDropdown1}
            />

            {/*second dropdown */}

            {/* Second Dropdown */}

            <Dropdown
              label="Select Period"
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
              className=" below-md:hidden cursor-pointer text-[14px] text-[#6F6F6F] bg-[#C8C8C87A] w-[104px] h-[37px] rounded-md flex items-center justify-center"
            >
              Back
            </p>
          </div>
        </div>
        <div />
      </div>

      {/* Table remains visible as is */}
      <div className="flex flex-row justify-between items-center mt-16 below-md:mt-14 mb-4 mx-6 below-md:mx-3">
        <div>
          <p className="text-[16px] font-bold text-[#334155] ml-3 below-md:ml-0">
            {" "}
            Invoices
          </p>
        </div>
        <div>
          <button className="flex items-center justify-center bg-[#1AA47D] below-md:mt-3 [box-shadow:0px_3px_8px_0px_#00000026] w-[170px] h-[37px] rounded-md text-white text-[13px] font-semibold hover:shadow-lg transition-shadow duration-300">
            <img
              src="/images/uploadIcon.svg"
              alt="Upload Icon"
              className="mr-2"
            />
            Upload Invoice
          </button>
        </div>
      </div>

      <div className="mb-5 mx-6 below-md:mx-3">
        {/** Table */}

        <div>
          {/* Table */}
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-[#334155]">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="text-left px-4 py-3 text-[#FFFFFF] font-medium text-[15px]"
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
                        className="px-4 py-1 text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar"
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

          {/* Pagination */}
          <Pagination table={table} />
        </div>
      </div>
    </main>
  );
};

export default DetailsPage;

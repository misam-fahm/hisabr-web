"use client";
import React, { FC, useState } from "react";
import DateRangePicker from "@/Components/UI/Thems/DateRangePicker";
import Images from "@/Components/UI/Thems/Image";
import { useRouter } from "next/navigation";
import Pagination from "@/Components/UI/Pagination/Pagination";
import Dropdown from "@/Components/UI/Thems/DropDown";

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
  orders: number;
  quantity: number;
  amount: string;
  net: string;
  average: string;
}

const data: TableRow[] = [
  {
    date: "2022-01-01",
    store: 13246,
    orders: 724,
    quantity: 1342,
    amount: "$3,484.84",
    net: "$3,124.54",
    average: "$11.26",
  },
  {
    date: "2022-01-02",
    store: 13576,
    orders: 812,
    quantity: 1500,
    amount: "$4,123.11",
    net: "$3,700.89",
    average: "$12.54",
  },
  {
    date: "2022-01-03",
    store: 14892,
    orders: 924,
    quantity: 1600,
    amount: "$5,124.90",
    net: "$4,520.12",
    average: "$13.11",
  },
  {
    date: "2022-01-03",
    store: 14892,
    orders: 924,
    quantity: 1600,
    amount: "$5,124.90",
    net: "$4,520.12",
    average: "$13.11",
  },
  {
    date: "2022-01-03",
    store: 14892,
    orders: 924,
    quantity: 1600,
    amount: "$5,124.90",
    net: "$4,520.12",
    average: "$13.11",
  },
  {
    date: "2022-01-03",
    store: 14892,
    orders: 924,
    quantity: 1600,
    amount: "$5,124.90",
    net: "$4,520.12",
    average: "$13.11",
  },
  {
    date: "2022-01-03",
    store: 14892,
    orders: 924,
    quantity: 1600,
    amount: "$5,124.90",
    net: "$4,520.12",
    average: "$13.11",
  },
  {
    date: "2022-01-03",
    store: 14892,
    orders: 924,
    quantity: 1600,
    amount: "$5,124.90",
    net: "$4,520.12",
    average: "$13.11",
  },
  {
    date: "2022-01-03",
    store: 14892,
    orders: 924,
    quantity: 1600,
    amount: "$5,124.90",
    net: "$4,520.12",
    average: "$13.11",
  },
  {
    date: "2022-01-03",
    store: 14892,
    orders: 924,
    quantity: 1600,
    amount: "$5,124.90",
    net: "$4,520.12",
    average: "$13.11",
  },
  {
    date: "2022-01-03",
    store: 14892,
    orders: 924,
    quantity: 1600,
    amount: "$5,124.90",
    net: "$4,520.12",
    average: "$13.11",
  },
  {
    date: "2022-01-03",
    store: 14892,
    orders: 924,
    quantity: 1600,
    amount: "$5,124.90",
    net: "$4,520.12",
    average: "$13.11",
  },
  {
    date: "2022-01-03",
    store: 14892,
    orders: 924,
    quantity: 1600,
    amount: "$5,124.90",
    net: "$4,520.12",
    average: "$13.11",
  },
  {
    date: "2022-01-03",
    store: 14892,
    orders: 924,
    quantity: 1600,
    amount: "$5,124.90",
    net: "$4,520.12",
    average: "$13.11",
  },
  {
    date: "2022-01-03",
    store: 14892,
    orders: 924,
    quantity: 1600,
    amount: "$5,124.90",
    net: "$4,520.12",
    average: "$13.11",
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

const Sales: FC = () => {
  const router = useRouter();

  const handleImageClick = () => {
    router.push("/sales/sales_view"); // Navigates to the 'details' page
  };

  const columns: ColumnDef<TableRow>[] = [
    {
      accessorKey: "date",
      header: () => <div className="text-left">Date</div>,
      cell: (info) => <span>{info.getValue() as string}</span>,
      size: 160,
    },
    {
      accessorKey: "store",
      header: () => <div>Store</div>,
      cell: (info) => <span>{info.getValue() as string}</span>,
      size: 100,
    },
    {
      accessorKey: "orders",
      header: () => <div className="text-right mr-10">Orders</div>,
      cell: (info) => (
        <div className="text-right mr-10">{info.getValue() as number}</div>
      ),
      size: 120,
    },
    {
      accessorKey: "quantity",
      header: () => <div className="text-right mr-10">Quantity</div>,
      cell: (info) => (
        <div className="text-right mr-10">{info.getValue() as number}</div>
      ),
      size: 120,
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right mr-12">Amount</div>,
      cell: (info) => (
        <div className="text-right mr-12">{info.getValue() as number}</div>
      ),
      size: 133,
    },
    {
      accessorKey: "net",
      header: () => <div className="text-right mr-10">Net</div>,
      cell: (info) => (
        <div className="text-right mr-10">{info.getValue() as number}</div>
      ),
      size: 120,
    },
    {
      accessorKey: "average",
      header: () => <div className="text-right mr-8">Average</div>,
      cell: (info) => (
        <div className="text-right mr-8">{info.getValue() as number}</div>
      ),
      size: 120,
    },
    {
      id: "view",
      header: () => <div className="text-center"></div>,
      cell: () => (
        <span className="flex justify-center">
          <button onClick={handleImageClick}>
            <Images
              src="/images/ViewEyeIcon.svg"
              alt="Eye Icon"
              className="w-4 h-4"
            />
          </button>
        </span>
      ),
      size: 60,
    },
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      console.log("Selected file:", file);
    }
  };

  const handleUploadClick = () => {
    document.getElementById("fileInput")?.click(); // Programmatically click the hidden input
  };

  const [globalFilter, setGlobalFilter] = React.useState("");
  const table = useReactTable({
    data: formattedData,
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
  });

  /**dropdown */
  const [selectedOption, setSelectedOption] = useState<string>("Stores");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const options = ["Store 1", "Store 2", "Store 3", "All Store"];
  const toggleDropdown1 = () => setIsOpen(!isOpen);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const filteredData = data.filter((item) =>
    JSON.stringify(item)
      .toLowerCase()
      .includes(globalFilter?.toLowerCase() || "")
  );

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
      className="max-h-[calc(100vh-60px)] below-md:max-h-[calc(100vh-0)] tablet:max-h-[calc(100vh-0)] overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <div className="mx-6 mt-6 below-md:mx-3 below-md:mt-0 tablet:mt-4">
        <div className="flex flex-row below-md:flex-col pb-6 sticky z-20  below-md:pt-4 tablet:pt-4 bg-[#f7f8f9] below-md:pb-4">
          <div className="flex flex-row below-md:flex-col w-full  gap-3">
            {/* Dropdown Button */}
            <Dropdown
              options={options}
              selectedOption={selectedOption}
              onSelect={handleSelect}
              isOpen={isOpen}
              toggleOpen={toggleDropdown1}
              widthchange="w-full below-lg:w-[260px]"
            />
            <div className="w-[260px] tablet:w-full below-md:w-full">
              <DateRangePicker />
            </div>
            <div className="flex flex-row gap-3 w-full">
              <div className=" w-full below-md:w-full below-lg:w-[260px] relative below-md:hidden tablet:w-full">
                <input
                  type="search"
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Search"
                  className="below-lg:w-[260px] cursor-pointer py-[10px] pr-7 pl-3 h-[35px] w-full shadow rounded-md text-[12px] placeholder:text-[#636363] border-none focus:outline-none focus:ring-1 focus:ring-[white]"
                />
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <img
                    className="cursor-pointer  items-center"
                    src="/images/searchicon.svg"
                  />
                </div>
              </div>

              <div className="tablet:hidden below-md:w-full relative below-lg:hidden">
                <input
                  type="search"
                  placeholder="Search"
                  className=" py-[10px] px-3 h-[35px] w-full shadow pr-7 pl-3 rounded-md text-[12px] placeholder:text-[#636363] border-none focus:outline-none focus:ring-1 focus:ring-[white]"
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
          <div className=" below-md:w-full">
            <div className="below-md:hidden tablet:hidden">
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              <button
                onClick={handleUploadClick}
                className="flex items-center justify-center bg-[#1AA47D] hover:bg-[#168A68] shadow-lg below-md:mt-3 w-[170px] h-[35px] rounded-md text-white text-[14px] font-semibold"
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
              <thead className="bg-[#334155] sticky top-0 z-10">
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
        <div className="tablet:hidden">
          <Pagination table={table} totalItems={0} />
        </div>

        <div className="below-lg:hidden mb-8">
          <div className="flex flex-col">
            <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
              <div className=" items-center mb-4 mt-2 px-2">
                <div className="flex justify-between pb-2 w-[100%] border-b border-[#E4E4EF]">
                  <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                    <span>12-20-24</span>
                  </div>
                  <div>
                    <img
                      onClick={handleImageClick}
                      src="/images/ViewEyeIcon.svg"
                      className="w-5 h-5"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-3 mb-2 px-2">
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[13px]">Store</p>
                  <p className="text-[#1A1A1A] text-[14px]">13246</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[13px]">Orders</p>
                  <p className="text-[#1A1A1A] text-[14px]">345</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[13px]">Quantity</p>
                  <p className="text-[#1A1A1A] text-[14px]">145</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[13px]">Amount</p>
                  <p className="text-[#1A1A1A] text-[14px]">$34,232</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[13px]">Net</p>
                  <p className="text-[#1A1A1A] text-[14px]">$3,484.37</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[13px]">Average</p>
                  <p className="text-[#1A1A1A] text-[14px]">$1,032</p>
                </div>
              </div>
            </div>

            <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
              <div className=" items-center mb-4 mt-2 px-2">
                <div className="flex justify-between pb-2 w-[100%] border-b border-[#E4E4EF]">
                  <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                    <span>12-20-24</span>
                  </div>
                  <div>
                    <img
                      onClick={handleImageClick}
                      src="/images/ViewEyeIcon.svg"
                      className="w-5 h-5"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-3 mb-2 px-2">
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Store</p>
                  <p className="text-[#1A1A1A] text-[12px]">78910</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Orders</p>
                  <p className="text-[#1A1A1A] text-[12px]">345</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Quantity</p>
                  <p className="text-[#1A1A1A] text-[12px]">145</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Amount</p>
                  <p className="text-[#1A1A1A] text-[12px]">$34,232</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Net</p>
                  <p className="text-[#1A1A1A] text-[12px]">$3,484.37</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Average</p>
                  <p className="text-[#1A1A1A] text-[12px]">$1,032</p>
                </div>
              </div>
            </div>

            <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
              <div className=" items-center mb-4 mt-2 px-2">
                <div className="flex justify-between pb-2 w-[100%] border-b border-[#E4E4EF]">
                  <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                    <span>12-20-24</span>
                  </div>
                  <div>
                    <img
                      onClick={handleImageClick}
                      src="/images/ViewEyeIcon.svg"
                      className="w-5 h-5"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-3 mb-2 px-2">
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Store</p>
                  <p className="text-[#1A1A1A] text-[12px]">13246</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Orders</p>
                  <p className="text-[#1A1A1A] text-[12px]">345</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Quantity</p>
                  <p className="text-[#1A1A1A] text-[12px]">145</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Amount</p>
                  <p className="text-[#1A1A1A] text-[12px]">$34,232</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Net</p>
                  <p className="text-[#1A1A1A] text-[12px]">$3,484.37</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Average</p>
                  <p className="text-[#1A1A1A] text-[12px]">$1,032</p>
                </div>
              </div>
            </div>

            <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
              <div className=" items-center mb-4 mt-2 px-2">
                <div className="flex justify-between pb-2 w-[100%] border-b border-[#E4E4EF]">
                  <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                    <span>12-20-24</span>
                  </div>
                  <div>
                    <img
                      onClick={handleImageClick}
                      src="/images/ViewEyeIcon.svg"
                      className="w-5 h-5"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-3 mb-2 px-2">
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Store</p>
                  <p className="text-[#1A1A1A] text-[12px]">13246</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Orders</p>
                  <p className="text-[#1A1A1A] text-[12px]">345</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Quantity</p>
                  <p className="text-[#1A1A1A] text-[12px]">145</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Amount</p>
                  <p className="text-[#1A1A1A] text-[12px]">$34,232</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Net</p>
                  <p className="text-[#1A1A1A] text-[12px]">$3,484.37</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-[#808080] text-[14px]">Average</p>
                  <p className="text-[#1A1A1A] text-[12px]">$1,032</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="below-lg:hidden flex justify-end fixed bottom-5 right-5">
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
    </main>
  );
};
export default Sales;

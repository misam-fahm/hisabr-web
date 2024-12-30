"use client";
import { useRef, useState } from "react";
import "../globals.css";
import MultiLineChart from "@/Components/drawer/MultiLineChart";
import BarChart3 from "@/Components/drawer/BarChart3";
import PieChart2 from "@/Components/drawer/Piechart2";
import { useRouter } from "next/navigation";
import Pagination from "@/Components/ui/Common/Pagination";
import Dropdown from "@/Components/ui/Common/DropDown";
import Images from "@/Components/ui/Common/Image";

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
    name: "GARCIA dasjhdjkh",
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

const columns: ColumnDef<TableRow>[] = [
  {
    accessorKey: "date",
    header: "Date",
    size: 100,
  },
  {
    accessorKey: "store",
    header: "Store",
    size: 100,
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    size: 100,
  },
  {
    accessorKey: "total",
    header: "Total",
    size: 100,
  },
  {
    accessorKey: "name",
    header: "Name",
    size: 160,
  },
  {
    id: "view",
    header: () => <div className="text-center">View</div>,
    cell: () => (
      <span className="flex justify-center">
        <Images src="/images/eye.svg" alt="Eye Icon" width={25} height={25} />
      </span>
    ),
    size: 60,
  },
];

const dat = [
  { label: "Beverage", value: 10836, color: "#376066CC" },
  { label: "Cakes", value: 326460, color: "#DEC560" },
  { label: "Food", value: 1835, color: "#5B7993" },
  { label: "Novelties-Boxed", value: 231725, color: "#A6A69E" },
  { label: "Soft Serve", value: 234, color: "#796C72" },
  { label: "Donations", value: 234, color: "#796C72" },
];

const DetailsPage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("All stores");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption2, setSelectedOption2] = useState<string>("2021");
  const [isOpen2, setIsOpen2] = useState<boolean>(false);
  const [selectedOption3, setSelectedOption3] = useState<string>("2021");
  const [isOpen3, setIsOpen3] = useState<boolean>(false);
  const [selectedOption4, setSelectedOption4] = useState<string>("2021");
  const [isOpen4, setIsOpen4] = useState<boolean>(false);

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
    router.back();
  };

  const options = ["Store 1", "Store 2", "Store 3", "All Store"];
  const options2 = ["2024", "2023", "2022", "2021"];
  const options3 = ["2024", "2023", "2022", "2021"];
  const options4 = ["2024", "2023", "2022", "2021"];

  const toggleDropdown1 = () => setIsOpen(!isOpen);
  const toggleDropdown2 = () => setIsOpen2(!isOpen2);
  const toggleDropdown3 = () => setIsOpen3(!isOpen3);
  const toggleDropdown4 = () => setIsOpen4(!isOpen4);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleSelect2 = (option2: string) => {
    setSelectedOption2(option2);
    setIsOpen2(false);
  };

  const handleSelect3 = (option3: string) => {
    setSelectedOption3(option3);
    setIsOpen3(false);
  };

  const handleSelect4 = (option4: string) => {
    setSelectedOption4(option4);
    setIsOpen4(false);
  };
  const fileInputRef: any = useRef(null);
  const handleButtonClick = () => {
    // Programmatically trigger the hidden file input
    fileInputRef.current.click();
  };
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected file:", file.name);
    }
  };

  return (
    <main
      className="max-h-[calc(100vh-60px)] overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <img
        onClick={handleBack}
        src="/images/backIcon.svg"
        className="fixed top-4 left-4 z-50 below-lg:hidden tablet:hidden"
      />
      {/* <div className="below-md:flex below-md:justify-center ">
        <p className="text-[18px] below-md:text-[16px] below-md:mr-8 font-bold text-defaultblack fixed top-0 z-30 mt-5 below-md:pl-0 below-md:pr-0 pl-6 pr-6">
          Gross Revenue Analysis
        </p>
      </div> */}
      <div className="pt-6 pb-6 below-md:pt-3 below-md:pb-3 sticky z-10  bg-[#f7f8f9] pl-6 pr-6 below-md:px-3">
        <div>
          <Images
            className="below-md:hidden cursor-pointer h-5 w-5 bg-white rounded-full p-1 mb-3"
            onClick={handleBack}
            src="./images/back-arrow.svg"
          />
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row below-md:flex-col gap-3 w-full">
            {/* First Dropdown */}

            <Dropdown
              options={options}
              selectedOption={selectedOption}
              onSelect={handleSelect}
              isOpen={isOpen}
              toggleOpen={toggleDropdown1}
            />

            {/* Second Dropdown */}

            <Dropdown
              options={options2}
              selectedOption={selectedOption2}
              onSelect={handleSelect2}
              isOpen={isOpen2}
              toggleOpen={toggleDropdown2}
            />
          </div>
        </div>
      </div>

      <div className=" pl-6 pr-6 below-md:px-3">
        <div className="flex flex-row below-md:flex-col w-full h-full gap-6 below-md:gap-3  items-stretch">
          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#C2D1C3] border-b-4 w-full items-stretch p-4 justify-between">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">
                Total Gross Revenue
              </p>
              <p className="text-[16px] text-[#2D3748] font-bold">
                $ 2,680,153
              </p>
              <p className="text-[12px] text-[#388E3C] font-semibold">
                20%{" "}
                <span className="text-[#575F6D] font-medium">
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
              <p className="text-[12px] text-[#388E3C] font-semibold">
                <span className="text-[#575F6D] font-medium">
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
              <p className="text-[12px] text-[#388E3C] font-semibold">
                <span className="text-[#575F6D] font-medium">
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
              <p className="text-[12px] text-[#388E3C] font-semibold">
                92%
                <span className="text-[#575F6D] font-medium">
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
                    Monthyl Revenue
                  </p>
                </div>
                <div className="relative below-md:w-[35%]">
                  <Dropdown
                    className="relative below-md:w-full"
                    shadowclassName="shadow-sm"
                    options={options3}
                    selectedOption={selectedOption3}
                    onSelect={handleSelect3}
                    isOpen={isOpen3}
                    toggleOpen={toggleDropdown3}
                    widthchange="below-lg:w-[130px] tablet:w-[130px]"
                  />
                </div>
              </div>
              <div>
                <BarChart3 selectedYear={Number(selectedOption3)} />
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
                <div className="relative below-md:w-[35%] ">
                  <Dropdown
                    className="relative w-full"
                    shadowclassName="shadow-sm"
                    options={options4}
                    selectedOption={selectedOption4}
                    onSelect={handleSelect4}
                    isOpen={isOpen4}
                    toggleOpen={toggleDropdown4}
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
                        className="flex px-[12%] items-center justify-between py-2"
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
              className="flex items-center justify-center bg-[#1AA47D] below-md:mt-3 [box-shadow:0px_3px_8px_0px_#00000026] w-[170px]  h-[37px] rounded-md text-white text-[13px] font-semibold hover:shadow-lg transition-shadow duration-300"
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
        <div>
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
          <Pagination table={table} />

          <div className="below-lg:hidden tablet:hidden">
            <div className="flex flex-col">
              <div className="border-[#E4E4EF] border w-full bg-white rounded-md p-3 mb-3">
                <div className=" items-center mb-4 mt-2 px-2">
                  <div className="flex justify-between pb-2 w-[100%] border-b border-[#E4E4EF]">
                    <div className="flex gap-3 text-[#1A1A1A] text-[14px] font-bold">
                      <span>12-20-24</span>
                      <span>Gordon</span>
                    </div>
                    <div>
                      <img src="/images/eye.svg" width={26} />
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mb-2 px-2">
                  <div className="flex justify-between text-sm">
                    <p className="text-[#808080] text-[14px]">Store</p>
                    <p className="text-[#1A1A1A] text-[12px]">13246</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-[#808080] text-[14px]">Quantity</p>
                    <p className="text-[#1A1A1A] text-[12px]">145</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-[#808080] text-[14px]">Total</p>
                    <p className="text-[#1A1A1A] text-[12px]">$3,484.37</p>
                  </div>
                </div>
              </div>

              <div className="border-[#E4E4EF] border w-full bg-white rounded-md p-3 mb-3">
                <div className=" items-center mb-4 mt-2 px-2">
                  <div className="flex justify-between pb-2 w-[100%] border-b border-[#E4E4EF]">
                    <div className="flex gap-3 text-[#1A1A1A] text-[14px] font-bold">
                      <span>12-20-24</span>
                      <span>Gordon</span>
                    </div>
                    <div>
                      <img src="/images/eye.svg" width={26} />
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mb-2 px-2">
                  <div className="flex justify-between text-sm">
                    <p className="text-[#808080] text-[14px]">Store</p>
                    <p className="text-[#1A1A1A] text-[12px]">13246</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-[#808080] text-[14px]">Quantity</p>
                    <p className="text-[#1A1A1A] text-[12px]">145</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-[#808080] text-[14px]">Total</p>
                    <p className="text-[#1A1A1A] text-[12px]">$3,484.37</p>
                  </div>
                </div>
              </div>

              <div className="border-[#E4E4EF] border w-full bg-white rounded-md p-3 mb-3">
                <div className=" items-center mb-4 mt-2 px-2">
                  <div className="flex justify-between pb-2 w-[100%] border-b border-[#E4E4EF]">
                    <div className="flex gap-3 text-[#1A1A1A] text-[14px] font-bold">
                      <span>12-20-24</span>
                      <span>Gordon</span>
                    </div>
                    <div>
                      <img src="/images/eye.svg" width={26} />
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mb-2 px-2">
                  <div className="flex justify-between text-sm">
                    <p className="text-[#808080] text-[14px]">Store</p>
                    <p className="text-[#1A1A1A] text-[12px]">13246</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-[#808080] text-[14px]">Quantity</p>
                    <p className="text-[#1A1A1A] text-[12px]">145</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-[#808080] text-[14px]">Total</p>
                    <p className="text-[#1A1A1A] text-[12px]">$3,484.37</p>
                  </div>
                </div>
              </div>

              <div className="border-[#E4E4EF] border w-full bg-white rounded-md p-3 mb-3">
                <div className=" items-center mb-4 mt-2 px-2">
                  <div className="flex justify-between pb-2 w-[100%] border-b border-[#E4E4EF]">
                    <div className="flex gap-3 text-[#1A1A1A] text-[14px] font-bold">
                      <span>12-20-24</span>
                      <span>Gordon</span>
                    </div>
                    <div>
                      <img src="/images/eye.svg" width={26} />
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mb-2 px-2">
                  <div className="flex justify-between text-sm">
                    <p className="text-[#808080] text-[14px]">Store</p>
                    <p className="text-[#1A1A1A] text-[12px]">13246</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-[#808080] text-[14px]">Quantity</p>
                    <p className="text-[#1A1A1A] text-[12px]">145</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-[#808080] text-[14px]">Total</p>
                    <p className="text-[#1A1A1A] text-[12px]">$3,484.37</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DetailsPage;
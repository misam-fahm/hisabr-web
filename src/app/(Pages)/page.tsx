"use client";
import "./globals.css";
import { FC, useState } from "react";
import Linechart from "@/Components/drawer/LineChart";
import React from "react";
import { useRouter } from "next/navigation";

interface TableRow {
  name: string;
  revenue: number;
  commission?: string;
  amount?: number;
}

const tableData: TableRow[] = [
  { name: "Cash", revenue: 10000, commission: "", amount: 0 },
  { name: "Amex", revenue: 15000, commission: "3.0%", amount: 450.0 },
  { name: "Master", revenue: 20000, commission: "2.5%", amount: 500.0 },
  { name: "VISA", revenue: 18000, commission: "2.0%", amount: 360.0 },
];

interface TableRow2 {
  name: string;
  revenue: number;
  commission?: string;
}

const tableData2: TableRow2[] = [
  { name: "Beverage", revenue: 93, commission: "248.00" },
  { name: "Cakes", revenue: 77, commission: "350.00" },
  { name: "Food", revenue: 56, commission: "450.00" },
];

const Home: FC = () => {
  /**first dropdown */
  const [selectedOption, setSelectedOption] = useState<string>("All stores");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const options = ["Store 1", "Store 2", "Store 3", "All Store"];

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  /**second dropdown */
  const [selectedOption2, setSelectedOption2] = useState<string>("2021");
  const [isOpen2, setIsOpen2] = useState<boolean>(false);

  const options2 = ["2024", "2023", "2022", "2021"];

  const handleSelect2 = (option2: string) => {
    setSelectedOption2(option2);
    setIsOpen2(false);
  };

  const totalRevenue = tableData.reduce((sum, row) => sum + row.revenue, 0);
  const totalAmount = tableData.reduce(
    (sum, row) => sum + (row.amount ?? 0),
    0
  );

  /**first link(gross revenue) */
  const router = useRouter();

  const handleClick = () => {
    router.push("/details1"); // Navigates to the 'details' page
  };

  /**second link(tender) */

  const handleClick2 = () => {
    router.push("/details2"); // Navigates to the 'details' page
  };

  //forth link(customer count)

  const handleClick4 = () => {
    router.push("/details4"); // Navigates to the 'details' page
  };

  //fifth link(customer count)

  const handleClick5 = () => {
    router.push("/details5"); // Navigates to the 'details' page
  };

  //sixth link(customer count)

  const handleClick6 = () => {
    router.push("/details6"); // Navigates to the 'details' page
  };

  //seventh link(customer count)

  const handleClick7 = () => {
    router.push("/details7"); // Navigates to the 'details' page
  };

  //eighth link(customer count)

  const handleClick8 = () => {
    router.push("/details8"); // Navigates to the 'details' page
  };

  return (
    <main
      className="max-h-[calc(100vh-10px)] overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <div className="below-md:flex below-md:justify-center ">
        <p className="text-[18px] font-bold text-defaultblack fixed top-0 z-30 mt-5 below-md:pl-0 below-md:pr-0 pl-6 pr-6">
          Home
        </p>
      </div>

      <div className="flex flex-row items-center gap-3 pt-4 pb-3 sticky top-16 bg-[#f7f8f9] pl-6 pr-6 below-md:px-3">
        {/* Dropdowns grouped together */}
        <div className="flex flex-row gap-3 w-full below-md:flex-col">
          {/* Dropdown 1 */}
          <div className="relative w-[30%] below-md:w-full">
            <p className="text-[#2D374880] text-[12px] mb-2 below-md:hidden">
              Select Store
            </p>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-[#ffffff] text-[#4B4B4B] shadow-md px-4 py-[10px] rounded flex items-center justify-between w-full text-[12px]"
            >
              <span>{selectedOption}</span>
              <img
                src="./images/icon.svg"
                className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                  isOpen ? "transform rotate-180" : ""
                }`}
              />
            </button>
            {isOpen && (
              <div
                className="absolute left-0 w-full mt-2 bg-[#ffffff] text-[#4B4B4B] text-[12px] border rounded shadow-md"
                style={{ zIndex: 50 }}
              >
                {options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelect(option)}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100 border-b last:border-none"
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown 2 */}
          <div className="relative w-[30%] below-md:w-full">
            <p className="text-[#2D374880] text-[12px] mb-2 below-md:hidden">
              Select Period
            </p>
            <button
              onClick={() => setIsOpen2(!isOpen2)}
              className="bg-[#ffffff] text-[#4B4B4B] shadow-md px-4 py-[10px] rounded flex items-center justify-between w-full text-[12px]"
            >
              <span>{selectedOption2}</span>
              <img
                src="./images/icon.svg"
                className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                  isOpen2 ? "transform rotate-180" : ""
                }`}
              />
            </button>
            {isOpen2 && (
              <div
                className="absolute left-0 w-full mt-2 bg-[#ffffff] text-[#4B4B4B] text-[12px] border rounded shadow-md"
                style={{ zIndex: 50 }}
              >
                {options2.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelect2(option)}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100 border-b last:border-none"
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tooltip positioned at the end of the screen */}
        <div className="relative ml-auto mt-8 below-md:hidden">
          <div className="group relative">
            <img
              src="/images/tooltip.svg"
              className="max-w-[100%] max-h-[100%] mx-auto cursor-pointer"
            />

            {/* Tooltip Box */}
            <div className="absolute top-full left-[calc(50%-180px)] transform -translate-x-1/2 mt-2 w-[419px] h-fit bg-[white] text-[#2D3748B2] text-sm px-6 py-6 rounded-lg border-l-[5px] border-[#F2921599] opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-20 pointer-events-none group-hover:pointer-events-auto">
              {/* Tooltip Arrow */}
              <div className="absolute bottom-full left-[calc(50%+180px)] transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-b-white border-l-transparent border-r-transparent" />

              {/* Tooltip Content */}
              <p className="text-[12px]">
                <span className="text-[12px] font-semibold text-[#334155CC]">
                  Year-To-Date (YTD){" "}
                </span>
                The accumulated value from January 1 to today, providing insight
                into year’s current performance.
              </p>
              <br />
              <p className="text-[12px]">
                <span className="text-[12px] font-semibold text-[#334155CC]">
                  One Year{" "}
                </span>
                The accumulated value from January 1 to today, providing insight
                into year’s current performance.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className=" pr-6 pl-6 below-md:px-3 mt-12">
        <div className="flex flex-row gap-7 below-md:gap-0 w-full below-md:flex-col">
          <div className=" bg-white mt-6 border-t-4 border-[#1F4372] border-opacity-30 rounded-md shadow-md w-[50%] below-md:w-full below-md:min-h-[213px] h-auto min-h-[51vh]">
            <div className="flex flex-row mt-4 justify-between px-3">
              <div className="flex flex-row gap-2 ">
                <img src="/images/groce.svg" />
                <p className="text-[#334155] text-[18px] font-extrabold">
                  Gross Revenue
                </p>
              </div>
              <div className="cursor-pointer">
                <img src="/images/under_details.svg" onClick={handleClick} />
              </div>
            </div>
            <div>
              <Linechart />
            </div>
          </div>

          <div className="bg-white mt-6 below-md:mt-3 border-t-4 border-[#1F4372] border-opacity-30 rounded-md shadow-md w-[50%] below-md:w-full h-auto min-h-[51vh]  below-md:min-h-[213px]">
            <div className="flex flex-row mt-4 justify-between px-3 ">
              <div className="flex flex-row gap-2 ">
                <img src="/images/persentage.svg" />
                <p className="text-[#334155] text-[18px] font-extrabold">
                  Tender
                </p>
              </div>
              <div className="cursor-pointer">
                <img onClick={handleClick2} src="/images/under_details.svg" />
              </div>
            </div>
            <div className=" overflow-hidden overflow-y-auto below-md:overflow-x-auto max-h-[42vh] below-md:max-h-[30vh] custom-scrollbar">
              <table className="w-full bg-white border border-gray-200 mt-6 ">
                <thead className="top-0 bg-[#FAFBFB] shadow-md">
                  <tr className="text-left text-gray-600 font-semibold">
                    <th className="px-4 py-2 border-b border-gray-200">Name</th>
                    <th className="px-4 py-2 border-b border-gray-200">
                      Revenue
                    </th>
                    <th className="px-4 py-2 border-b border-gray-200">
                      Commission
                    </th>
                    <th className="px-4 py-2 border-b border-gray-200">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-[#FAFBFB]"
                      }`}
                    >
                      <td className="px-4 py-2 border-b border-gray-200 text-gray-700">
                        {row.name}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-200 text-[#334155] text-[15px] font-semibold">
                        ${row.revenue.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-200 text-[#202224B2] text-[15px] font-semibold text-center">
                        {row.commission}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-200 text-[#3F526D] text-[15px] font-semibold">
                        {row.amount ? `$${row.amount.toFixed(2)}` : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bottom-0 bg-white">
                  <tr className="font-semibold text-[#E31212] text-[15px]">
                    <td className="px-4 py-2 border-t border-gray-200">
                      Total
                    </td>
                    <td className="px-4 py-2 border-t border-gray-200">
                      ${totalRevenue.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 border-t border-gray-200"></td>
                    <td className="px-4 py-2 border-t border-gray-200">
                      ${totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* grid 1*/}

        <div className="flex flex-row gap-7 below-md:gap-0 below-md:flex-col">
          <div className=" bg-white mt-6 below-md:mt-3 pb-6 border-t-4 border-[#C2D1C3]  rounded-md shadow-md w-full  h-48 min-h-auto">
            <div className="flex flex-row mt-4 justify-between px-3">
              <div className="flex flex-row gap-2 ">
                <img src="/images/groce.svg" />
                <p className="text-[#334155] text-[18px] font-extrabold">
                  Gross Revenue
                </p>
              </div>
              <div className="cursor-pointer">
                <img src="/images/under_details.svg" onClick={handleClick} />
              </div>
            </div>

            <div className="mt-4 mx-4">
              <div className="flex justify-between items-center mb-2 gap-[2px]">
                <div className="text-gray-600 text-transparent">
                  Current year
                </div>
                <div className="font-bold text-[#2D3748B2] text-[14px]">
                  YTD <span className="text-[#E31212] text-[12px]">10.5%</span>
                </div>
                <div className="font-bold text-[#2D3748B2] text-[14px]">
                  One Year{" "}
                  <span className="text-[#388E3C] text-[12px]">20%</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-2 gap-[2px]">
                <div className="text-gray-600">Current Year</div>
                <div className="font-bold text-gray-800">$85,000</div>
                <div className="font-bold text-gray-800">$120,000</div>
              </div>

              <div className="flex justify-between items-center gap-[2px]">
                <div className="text-gray-600">Previous Year</div>
                <div className="font-bold text-gray-800">$95,000</div>
                <div className="font-bold text-gray-800">$100,000</div>
              </div>
            </div>
          </div>

          {/** second grid  */}
          <div className=" bg-white mt-6 below-md:mt-3 border-t-4 border-[#C2D1C3]  rounded-md shadow-md w-full pb-6  h-48 min-h-auto">
            <div className="flex flex-row mt-4 justify-between px-3">
              <div className="flex flex-row gap-2 ">
                <img src="/images/plus.svg" />
                <p className="text-[#334155] text-[18px] font-extrabold">
                  Customer Count
                </p>
              </div>
              <div className="cursor-pointer">
                <img src="/images/under_details.svg" onClick={handleClick4} />
              </div>
            </div>
            <div className="mt-4 mx-4">
              <div className="flex justify-between items-center mb-2 gap-[2px]">
                <div className="text-gray-600 text-transparent">
                  Current year
                </div>
                <div className="font-bold text-[#2D3748B2] text-[14px]">
                  YTD <span className="text-[#388E3C] text-[12px]">8.3%</span>
                </div>
                <div className="font-bold text-[#2D3748B2] text-[14px]">
                  One Year{" "}
                  <span className="text-[#E31212] text-[12px]">6.7%</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-2 gap-[2px]">
                <div className="text-gray-600">Current Year</div>
                <div className="font-bold text-gray-800">11,000</div>
                <div className="font-bold text-gray-800">16,000</div>
              </div>

              <div className="flex justify-between items-center gap-[2px]">
                <div className="text-gray-600">Previous Year</div>
                <div className="font-bold text-gray-800">12,000</div>
                <div className="font-bold text-gray-800">15,000</div>
              </div>
            </div>
          </div>

          {/** third grid  */}
          <div className=" bg-white mt-6 below-md:mt-3 border-t-4 border-[#C2D1C3]  rounded-md shadow-md w-full pb-6  h-48 min-h-auto">
            <div className="flex flex-row mt-4 justify-between px-3">
              <div className="flex flex-row gap-2 ">
                <img src="/images/net.svg" />
                <p className="text-[#334155] text-[18px] font-extrabold">
                  Net Margin
                </p>
              </div>
            </div>
            <div className="mt-4 mx-4">
              <div className="flex justify-between items-center mb-2 gap-[2px]">
                <div className="text-gray-600 text-transparent">
                  Current year
                </div>
                <div className="font-bold text-[#2D3748B2] text-[14px]">
                  YTD <span className="text-[#E31212] text-[12px]">3.8%</span>
                </div>
                <div className="font-bold text-[#2D3748B2] text-[14px]">
                  One Year
                  <span className="text-[#388E3C] text-[12px]">2.9%</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-2 gap-[2px]">
                <div className="text-gray-600">Current Year</div>
                <div className="font-bold text-gray-800">$60,000</div>
                <div className="font-bold text-gray-800">$90,000</div>
              </div>

              <div className="flex justify-between items-center gap-[2px]">
                <div className="text-gray-600">Previous Year</div>
                <div className="font-bold text-gray-800">$65,000</div>
                <div className="font-bold text-gray-800">$85,000</div>
              </div>
            </div>
          </div>
        </div>

        {/* grid 2*/}

        <div className="flex flex-row gap-7 below-md:gap-0 below-md:flex-col">
          <div className=" bg-white mt-6 below-md:mt-3 pb-6 border-t-4 border-[#E5D5D5]  rounded-md shadow-md w-full  h-48 min-h-auto">
            <div className="flex flex-row mt-4 justify-between px-3">
              <div className="flex flex-row gap-1 ">
                <img src="/images/operating.svg" />
                <p className="text-[#334155] text-[16px] font-extrabold">
                  Operating Expense{" "}
                  <span className="text-[12px] font-semibold text-[#B25209] ">
                    29% of total
                  </span>
                </p>
              </div>
              <div className="cursor-pointer">
                <img src="/images/under_details.svg" onClick={handleClick5} />
              </div>
            </div>

            <div className="mt-4 mx-4">
              <div className="flex justify-between items-center mb-2 gap-[2px]">
                <div className="text-gray-600 text-transparent">
                  Current year
                </div>
                <div className="font-bold text-[#2D3748B2] text-[14px]">
                  YTD <span className="text-[#388E3C] text-[12px]">10.5%</span>
                </div>
                <div className="font-bold text-[#2D3748B2] text-[14px]">
                  One Year{" "}
                  <span className="text-[#E31212] text-[12px]">20%</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-2 gap-[2px]">
                <div className="text-gray-600">Current Year</div>
                <div className="font-bold text-gray-800">$85,000</div>
                <div className="font-bold text-gray-800">$120,000</div>
              </div>

              <div className="flex justify-between items-center gap-[2px]">
                <div className="text-gray-600">Previous Year</div>
                <div className="font-bold text-gray-800">$95,000</div>
                <div className="font-bold text-gray-800">$100,000</div>
              </div>
            </div>
          </div>

          {/** second grid  */}
          <div className=" bg-white mt-6 below-md:mt-3 border-t-4 border-[#E5D5D5]  rounded-md shadow-md w-full pb-6  h-48 min-h-auto">
            <div className="flex flex-row mt-4 justify-between px-3">
              <div className="flex flex-row gap-2 ">
                <img src="/images/cost.svg" />
                <p className="text-[#334155] text-[18px] font-extrabold">
                  Cost{" "}
                  <span className="text-[12px] font-semibold text-[#B25209] ">
                    31% of total cost
                  </span>
                </p>
              </div>
              <div className="cursor-pointer">
                <img src="/images/under_details.svg" onClick={handleClick6} />
              </div>
            </div>
            <div className="mt-4 mx-4">
              <div className="flex justify-between items-center mb-2 gap-[2px]">
                <div className="text-gray-600 text-transparent">
                  Current year
                </div>
                <div className="font-bold text-[#2D3748B2] text-[14px]">
                  YTD <span className="text-[#388E3C] text-[12px]">8.3%</span>
                </div>
                <div className="font-bold text-[#2D3748B2] text-[14px]">
                  One Year{" "}
                  <span className="text-[#E31212] text-[12px]">6.7%</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-2 gap-[2px]">
                <div className="text-gray-600">Current Year</div>
                <div className="font-bold text-gray-800">11,000</div>
                <div className="font-bold text-gray-800">16,000</div>
              </div>

              <div className="flex justify-between items-center gap-[2px]">
                <div className="text-gray-600">Previous Year</div>
                <div className="font-bold text-gray-800">12,000</div>
                <div className="font-bold text-gray-800">15,000</div>
              </div>
            </div>
          </div>

          {/** third grid  */}
          <div className=" bg-white mt-6 below-md:mt-3 border-t-4 border-[#E5D5D5]  rounded-md shadow-md w-full pb-6  h-48 min-h-auto">
            <div className="flex flex-row mt-4 justify-between px-3">
              <div className="flex flex-row gap-2 ">
                <img src="/images/labor.svg" />
                <p className="text-[#334155] text-[18px] font-extrabold">
                  Labor{" "}
                  <span className="text-[12px] font-semibold text-[#B25209] ">
                    13% of total cost
                  </span>
                </p>
              </div>
              <div className="cursor-pointer">
                <img src="/images/under_details.svg" onClick={handleClick7} />
              </div>
            </div>
            <div className="mt-4 mx-4">
              <div className="flex justify-between items-center mb-2 gap-[2px]">
                <div className="text-gray-600 text-transparent">
                  Current year
                </div>
                <div className="font-bold text-[#2D3748B2] text-[14px]">
                  YTD <span className="text-[#388E3C] text-[12px]">3.8%</span>
                </div>
                <div className="font-bold text-[#2D3748B2] text-[14px]">
                  One Year
                  <span className="text-[#E31212] text-[12px]">2.9%</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-2 gap-[2px]">
                <div className="text-gray-600">Current Year</div>
                <div className="font-bold text-gray-800">$60,000</div>
                <div className="font-bold text-gray-800">$90,000</div>
              </div>

              <div className="flex justify-between items-center gap-[2px]">
                <div className="text-gray-600">Previous Year</div>
                <div className="font-bold text-gray-800">$65,000</div>
                <div className="font-bold text-gray-800">$85,000</div>
              </div>
            </div>
          </div>
        </div>

        {/* grid 3*/}

        <div className="flex flex-row gap-7 below-md:gap-0 mb-1 below-md:flex-col">
          <div className=" bg-white mt-6 below-md:mt-3 pb-6 border-t-4 border-[#E5D5D5]  rounded-md shadow-md w-full  h-48 min-h-auto">
            <div className="flex flex-row mt-4 justify-between px-3">
              <div className="flex flex-row gap-1 ">
                <img src="/images/crown.svg" />
                <p className="text-[#334155] text-[16px] font-extrabold">
                  Royalties{" "}
                  <span className="text-[12px] font-semibold text-[#B25209] ">
                    19% of total cost
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-4 mx-4">
              <div className="flex justify-between items-center mb-2 gap-[2px]">
                <div className="text-gray-600 text-transparent">
                  Current year
                </div>
                <div className="font-bold text-[#2D3748B2] text-[14px]">
                  YTD <span className="text-[#388E3C] text-[12px]">10.5%</span>
                </div>
                <div className="font-bold text-[#2D3748B2] text-[14px]">
                  One Year{" "}
                  <span className="text-[#E31212] text-[12px]">20%</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-2 gap-[2px]">
                <div className="text-gray-600">Current Year</div>
                <div className="font-bold text-gray-800">$85,000</div>
                <div className="font-bold text-gray-800">$120,000</div>
              </div>

              <div className="flex justify-between items-center gap-[2px]">
                <div className="text-gray-600">Previous Year</div>
                <div className="font-bold text-gray-800">$95,000</div>
                <div className="font-bold text-gray-800">$100,000</div>
              </div>
            </div>
          </div>

          {/** second grid  */}
          <div className=" bg-white mt-6 below-md:mt-3 border-t-4 border-[#E5D5D5]  rounded-md shadow-md w-full pb-6  h-48 min-h-auto">
            <div className="flex flex-row mt-4 justify-between px-3">
              <div className="flex flex-row gap-2 ">
                <img src="/images/persentage.svg" />
                <p className="text-[#334155] text-[18px] font-extrabold">
                  Sales Tax{" "}
                  <span className="text-[12px] font-semibold text-[#B25209] ">
                    8% of total cost
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-4 mx-4">
              <div className="flex justify-between items-center mb-2 gap-[2px]">
                <div className="text-gray-600 text-transparent">
                  Current year
                </div>
                <div className="font-bold text-[#2D3748B2] text-[14px]">
                  YTD <span className="text-[#388E3C] text-[12px]">8.3%</span>
                </div>
                <div className="font-bold text-[#2D3748B2] text-[14px]">
                  One Year{" "}
                  <span className="text-[#E31212] text-[12px]">6.7%</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-2 gap-[2px]">
                <div className="text-gray-600">Current Year</div>
                <div className="font-bold text-gray-800">11,000</div>
                <div className="font-bold text-gray-800">16,000</div>
              </div>

              <div className="flex justify-between items-center gap-[2px]">
                <div className="text-gray-600">Previous Year</div>
                <div className="font-bold text-gray-800">12,000</div>
                <div className="font-bold text-gray-800">15,000</div>
              </div>
            </div>
          </div>

          {/** third grid  */}
          <div className=" bg-white mt-6 below-md:mt-3 border-t-4 border-[#BCC7D5]  rounded-md shadow-md w-full pb-6 h-48 min-h-auto">
            <div className="flex flex-row mt-4 justify-between px-3">
              <div className="flex flex-row gap-2 ">
                <img src="/images/items.svg" />
                <p className="text-[#334155] text-[18px] font-extrabold">
                  Items
                </p>
              </div>
              <div className="cursor-pointer">
                <img src="/images/under_details.svg" onClick={handleClick8} />
              </div>
            </div>

            <div className="w-full overflow-hidden overflow-y-auto below-md:overflow-x-auto max-h-[135px] custom-scrollbar ">
              <table className="w-full bg-white border border-gray-200 mt-6 ">
                <tbody>
                  {tableData2.map((row, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 1 ? "bg-white" : "bg-[#FAFBFB]"
                      }`}
                    >
                      <td className="px-3 py-2 border-b border-gray-200 text-gray-700">
                        {row.name}
                      </td>
                      <td className="px-3 py-2 border-b border-gray-200 text-[#334155] text-[15px] font-bold text-center">
                        {row.revenue.toLocaleString()}
                      </td>
                      <td className="px-3 py-2 border-b border-gray-200 text[15px] font-bold text-[#334155]">
                        ${row.commission}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bottom-0 bg-white">
                  <tr className="font-bold text-[#E31212]">
                    <td className="px-3 py-2 border-t border-gray-200">
                      Total
                    </td>
                    <td className="px-3 py-2 border-t border-gray-200">
                      ${totalRevenue.toLocaleString()}
                    </td>

                    <td className="px-3 py-2 border-t border-gray-200">
                      ${totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;

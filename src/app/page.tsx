"use client";
import "./globals.css";
import { FC, useState } from "react";
import Linechart from "@/Components/Charts-Graph/LineChart";
import React from "react";
import { useRouter } from "next/navigation";
import Dropdown from "@/Components/ui/Themes/DropDown";
import { useEffect } from "react";

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
  { name: "Novelties-Boxed", revenue: 93, commission: "248.00" },
  { name: "Soft Serve", revenue: 77, commission: "350.00" },
  { name: "Donations", revenue: 56, commission: "450.00" },
];

const Home: FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("Stores");
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

  const totalRevenue = tableData.reduce((sum, row) => sum + row.revenue, 0);
  const totalAmount = tableData.reduce(
    (sum, row) => sum + (row.amount ?? 0),
    0
  );

  /**first link(gross revenue) */
  const router = useRouter();

  const [grossrevenue, setgrossrevenue] = useState(false);

  useEffect(() => {
    // Ensure the back icon is hidden on the home page
    sessionStorage.setItem("showBackIcon", "false");
  }, []);

  const handleClick = () => {
    setgrossrevenue(true);
    router.push("/grossrevenue");
  };

  /**second link(tender) */

  const handleClick2 = () => {
    router.push("/setup/tenders"); // Navigates to the 'details' page
  };

  //forth link(customer count)

  const handleClick4 = () => {
    router.push("/customercount"); // Navigates to the 'details' page
  };

  //fifth link(customer count)

  const handleClick5 = () => {
    // localStorage.setItem('showBackIcon', 'true');
    router.push("/expenses");
  };

  //sixth link(customer count)

  const handleClick6 = () => {
    router.push("/invoices"); // Navigates to the 'details' page
  };

  //seventh link(customer count)//

  const handleClick7 = () => {
    router.push("/expenses"); // Navigates to the 'details' page
  };

  //eighth link(customer count)

  const handleClick8 = () => {
    router.push("/invoices"); // Navigates to the 'details' page
  };

  return (
    <main
      className="max-h-[calc(100vh-60px)] overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      {/* <div className="below-md:flex below-md:justify-center ">
        <p className="text-[18px] font-bold text-defaultblack fixed top-0 z-30 mt-5 below-md:pl-0 below-md:pr-0 pl-6 pr-6">
          Home
        </p>
      </div> */}

      <div className="flex flex-row items-center gap-3 pt-6 below-md:pt-4 sticky  bg-[#f7f8f9] px-6 below-md:px-3">
        {/* Dropdowns grouped together */}
        <div className="flex flex-row gap-3 w-full below-md:flex-col ">
          {/* Dropdown 1 */}
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

      <div className=" px-6 below-md:px-3 pt-3 below-md:pt-0">
        <div className="grid grid-cols-2 gap-7 below-md:grid-cols-1 tablet:grid-cols-1 tablet:gap-3 tablet:grid-rows-2 below-md:grid-rows-2 below-md:gap-1 below-md:mt-1 w-full items-stretch ">
          {/* Gross Revenue Card */}
          <div className="bg-white mt-3 border-t-4 border-[#1F4372] border-opacity-30 rounded-md shadow-md below-md:shadow-none w-full items-stretch">
            <div className="flex flex-row mt-4 justify-between px-3">
              <div className="flex flex-row gap-2">
                <img src="/images/groce.svg" alt="Gross Revenue" />
                <p className="text-[#334155] text-[16px] font-bold">
                  Gross Revenue
                </p>
              </div>
              <div className="cursor-pointer">
                <img
                  src="/images/under_details.svg"
                  onClick={handleClick}
                  alt="Details"
                />
              </div>
            </div>
            <div>
              <Linechart />
            </div>
          </div>

          {/* Tender Table */}
          <div className="bg-white mt-3 border-t-4 border-[#1F4372] border-opacity-30 rounded-md shadow-md below-md:shadow-none w-full items-stretch">
            <div className="flex flex-row mt-4 justify-between px-3">
              <div className="flex flex-row gap-2">
                <img src="/images/persentage.svg" alt="Tender" />
                <p className="text-[#334155] text-[16px] font-bold">Tender</p>
              </div>
              <div className="cursor-pointer">
                <img
                  onClick={handleClick2}
                  src="/images/under_details.svg"
                  alt="Details"
                />
              </div>
            </div>
            <div className="overflow-hidden overflow-x-auto overflow-y-auto max-h-[42vh] below-md:max-h-[27vh] custom-scrollbar">
              <table className="w-full bg-white border border-gray-200 mt-6">
                <thead className="bg-[#FAFBFB] shadow-md">
                  <tr className="text-left text-gray-600 font-semibold">
                    <th className="px-4 py-1.5 border-b border-gray-200 text-[14px]">
                      Name
                    </th>
                    <th className="px-4 py-1.5 border-b border-gray-200 text-[14px]">
                      Revenue
                    </th>
                    <th className="px-4 py-1.5 border-b border-gray-200 text-[14px]">
                      Commission
                    </th>
                    <th className="px-4 py-1.5 border-b border-gray-200 text-[14px]">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-[#FAFBFB]"}
                    >
                      <td className="px-4 py-1.5 text-[14px] border-b border-gray-200 text-gray-700">
                        {row.name}
                      </td>
                      <td className="px-4 py-1.5 text-[14px] border-b border-gray-200 text-[#334155] font-medium">
                        ${row.revenue.toLocaleString()}
                      </td>
                      <td className="px-4 py-1.5 border-b border-gray-200 text-[#202224B2] text-[14px] font-medium text-center">
                        {row.commission}
                      </td>
                      <td className="px-4 py-1.5 border-b border-gray-200 text-[#3F526D] text-[14px] font-medium">
                        {row.amount ? `$${row.amount.toFixed(2)}` : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-white">
                  <tr className="font-medium text-[#E31212] text-[14px]">
                    <td className="px-4 py-1.5 border-t border-gray-200">
                      Total
                    </td>
                    <td className="px-4 py-1.5 border-t border-gray-200">
                      ${totalRevenue.toLocaleString()}
                    </td>
                    <td className="px-4 py-1.5 border-t border-gray-200"></td>
                    <td className="px-4 py-1.5 border-t border-gray-200">
                      ${totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* 1st grid*/}

        <div className="grid  grid-cols-3 below-md:grid-cols-1 tablet:grid-cols-2 gap-7 mb-4 below-md:gap-1 below-md:mt-1  below-md:flex-col items-stretch">
          <div className=" bg-white mt-6 below-md:mt-3 pb-6 border-t-4 border-[#C2D1C3]  rounded-md shadow-md below-md:shadow-none w-full items-stretch">
            <div className="flex flex-row mt-4 justify-between px-6">
              <div className="flex flex-row gap-2 ">
                <img src="/images/groce.svg" />
                <p className="text-[#334155]  text-[16px] font-bold">
                  Gross Revenue
                </p>

                <div className="relative z-0">
                  <div className="group relative">
                    <img
                      src="/images/tooltip.svg"
                      className=" mt-[3px] w-5 tablet:w-6 below-md:w-6 cursor-pointer"
                    />

                    {/* Tooltip Box */}
                    <div className="absolute border-r-[1px] border-t-[1px] border-b-[1px] border-r-[#E4E4EF] border-t-[#E4E4EF] border-b-[#E4E4EF] top-full left-[calc(50%-20px)] transform -translate-x-1/2 mt-2 w-[350px] h-fit bg-[white] text-[#2D3748B2] text-sm px-6 py-6 rounded-lg border-l-[5px] border-[#F2921599] opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-20 pointer-events-none group-hover:pointer-events-auto">
                      {/* Tooltip Arrow */}

                      {/* Tooltip Content */}
                      <p className="text-[12px]">
                        <span className="text-[12px] font-semibold text-[#334155CC]">
                          Year-To-Date (YTD)
                        </span>
                        The accumulated value from January 1 to today, providing
                        insight into year’s current performance.
                      </p>
                      <br />
                      <p className="text-[12px]">
                        <span className="text-[12px] font-semibold text-[#334155CC]">
                          One Year{" "}
                        </span>
                        The accumulated value from January 1 to today, providing
                        insight into year’s current performance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cursor-pointer">
                <img src="/images/under_details.svg" onClick={handleClick} />
              </div>
            </div>

            <div className="mt-5 mx-6">
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

              <div className="flex justify-between items-center mb-3 gap-[2px]">
                <div className="text-gray-600 text-[14px]">Current Year</div>
                <div className="font-bold text-gray-800">$85,000</div>
                <div className="font-bold text-gray-800">$120,000</div>
              </div>

              <div className="flex justify-between items-center gap-[2px]">
                <div className="text-gray-600 text-[14px]">Previous Year</div>
                <div className="font-bold text-gray-800">$95,000</div>
                <div className="font-bold text-gray-800">$100,000</div>
              </div>
            </div>
          </div>

          {/** second grid  */}
          <div className=" bg-white mt-6 below-md:mt-3 border-t-4 border-[#C2D1C3]  rounded-md shadow-md below-md:shadow-none w-full pb-6 items-stretch">
            <div className="flex flex-row mt-4 justify-between px-6">
              <div className="flex flex-row gap-2">
                <img src="/images/plus.svg" />
                <p className="text-[#334155]  text-[16px] font-bold">
                  Customer Count
                </p>
              </div>
              <div className="cursor-pointer">
                <img src="/images/under_details.svg" onClick={handleClick4} />
              </div>
            </div>
            <div className="mt-5 mx-6">
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

              <div className="flex justify-between items-center mb-3 gap-[2px]">
                <div className="text-gray-600 text-[14px]">Current Year</div>
                <div className="font-bold text-gray-800">11,000</div>
                <div className="font-bold text-gray-800">16,000</div>
              </div>

              <div className="flex justify-between items-center gap-[2px]">
                <div className="text-gray-600 text-[14px]">Previous Year</div>
                <div className="font-bold text-gray-800">12,000</div>
                <div className="font-bold text-gray-800">15,000</div>
              </div>
            </div>
          </div>

          {/** third grid  */}
          <div className=" bg-white mt-6 tablet:mt-0 below-md:mt-3 border-t-4 border-[#C2D1C3]  rounded-md shadow-md below-md:shadow-none w-full pb-6 items-stretch">
            <div className="flex flex-row mt-4 justify-between px-6">
              <div className="flex flex-row gap-2 ">
                <img src="/images/net.svg" />
                <p className="text-[#334155]  text-[16px] font-bold">
                  Net Margin
                </p>
              </div>
            </div>
            <div className="mt-5 mx-6">
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

              <div className="flex justify-between items-center mb-3 gap-[2px]">
                <div className="text-gray-600 text-[14px]">Current Year</div>
                <div className="font-bold text-gray-800">$60,000</div>
                <div className="font-bold text-gray-800">$90,000</div>
              </div>

              <div className="flex justify-between items-center gap-[2px]">
                <div className="text-gray-600 text-[14px]">Previous Year</div>
                <div className="font-bold text-gray-800">$65,000</div>
                <div className="font-bold text-gray-800">$85,000</div>
              </div>
            </div>
          </div>

          {/**2nd grid */}
          <div className=" bg-white   below-md:mt-3 border-t-4 border-[#C2D1C3]  rounded-md shadow-md below-md:shadow-none w-full pb-6 items-stretch">
            <div className="flex flex-row mt-4 justify-between px-6">
              <div className="flex flex-row gap-2 ">
                <img src="/images/operating.svg" />
                <p className="text-[#334155]  text-[16px] font-bold">
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

            <div className="mt-5 mx-6">
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

              <div className="flex justify-between items-center mb-3 gap-[2px]">
                <div className="text-gray-600 text-[14px]">Current Year</div>
                <div className="font-bold text-gray-800">$85,000</div>
                <div className="font-bold text-gray-800">$120,000</div>
              </div>

              <div className="flex justify-between items-center gap-[2px]">
                <div className="text-gray-600 text-[14px]">Previous Year</div>
                <div className="font-bold text-gray-800">$95,000</div>
                <div className="font-bold text-gray-800">$100,000</div>
              </div>
            </div>
          </div>

          {/** second grid  */}
          <div className=" bg-white below-md:mt-3 border-t-4 border-[#E5D5D5]  rounded-md shadow-md below-md:shadow-none w-full pb-6  items-stretch">
            <div className="flex flex-row mt-4 justify-between px-6">
              <div className="flex flex-row gap-2 ">
                <img src="/images/cost.svg" />
                <p className="text-[#334155]  text-[16px] font-bold">
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
            <div className="mt-5 mx-6">
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

              <div className="flex justify-between items-center mb-3 gap-[2px]">
                <div className="text-gray-600 text-[14px]">Current Year</div>
                <div className="font-bold text-gray-800">11,000</div>
                <div className="font-bold text-gray-800">16,000</div>
              </div>

              <div className="flex justify-between items-center gap-[2px]">
                <div className="text-gray-600 text-[14px]">Previous Year</div>
                <div className="font-bold text-gray-800">12,000</div>
                <div className="font-bold text-gray-800">15,000</div>
              </div>
            </div>
          </div>

          {/** third grid  */}
          <div className=" bg-white below-md:mt-3 border-t-4 border-[#E5D5D5]  rounded-md shadow-md below-md:shadow-none w-full pb-6  items-stretch">
            <div className="flex flex-row mt-4 justify-between px-6">
              <div className="flex flex-row gap-2 ">
                <img src="/images/labor.svg" />
                <p className="text-[#334155]  text-[16px] font-bold">
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
            <div className="mt-5 mx-6">
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

              <div className="flex justify-between items-center mb-3 gap-[2px]">
                <div className="text-gray-600 text-[14px]">Current Year</div>
                <div className="font-bold text-gray-800">$60,000</div>
                <div className="font-bold text-gray-800">$90,000</div>
              </div>

              <div className="flex justify-between items-center gap-[2px]">
                <div className="text-gray-600 text-[14px]">Previous Year</div>
                <div className="font-bold text-gray-800">$65,000</div>
                <div className="font-bold text-gray-800">$85,000</div>
              </div>
            </div>
          </div>

          {/**3rd greed */}
          <div className=" bg-white  below-md:mt-3 pb-6 border-t-4 border-[#E5D5D5]  rounded-md shadow-md below-md:shadow-none w-full items-stretch">
            <div className="flex flex-row mt-4 justify-between px-6">
              <div className="flex flex-row gap-2 ">
                <img src="/images/crown.svg" />
                <p className="text-[#334155]  text-[16px] font-bold">
                  Royalties{" "}
                  <span className="text-[12px] font-semibold text-[#B25209] ">
                    19% of total cost
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-5 mx-6">
              <div className="flex justify-between items-center mb-2 gap-[2px]">
                <div className="text-gray-600 text-transparent">
                  Current year
                </div>
                <div className="font-bold text-[#2D3748B2] text-[14px]">
                  YTD <span className="text-[#388E3C] text-[12px]">10.5%</span>
                </div>
                <div className="font-bold text-[#2D3748B2] text-[14px]">
                  One Year
                  <span className="text-[#E31212] text-[12px]">20%</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-3 gap-[2px]">
                <div className="text-gray-600 text-[14px]">Current Year</div>
                <div className="font-bold text-gray-800">$85,000</div>
                <div className="font-bold text-gray-800">$120,000</div>
              </div>

              <div className="flex justify-between items-center gap-[2px]">
                <div className="text-gray-600 text-[14px]">Previous Year</div>
                <div className="font-bold text-gray-800">$95,000</div>
                <div className="font-bold text-gray-800">$100,000</div>
              </div>
            </div>
          </div>

          {/** second grid  */}
          <div className=" bg-white below-md:mt-3 border-t-4 border-[#E5D5D5]  rounded-md shadow-md below-md:shadow-none w-full pb-6 items-stretch">
            <div className="flex flex-row mt-4 justify-between px-6">
              <div className="flex flex-row gap-2 ">
                <img src="/images/persentage.svg" />
                <p className="text-[#334155]  text-[16px] font-bold">
                  Sales Tax{" "}
                  <span className="text-[12px] font-semibold text-[#B25209] ">
                    8% of total cost
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-5 mx-6">
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

              <div className="flex justify-between items-center mb-3 gap-[2px]">
                <div className="text-gray-600 text-[14px]">Current Year</div>
                <div className="font-bold text-gray-800">11,000</div>
                <div className="font-bold text-gray-800">16,000</div>
              </div>

              <div className="flex justify-between items-center gap-[2px]">
                <div className="text-gray-600 text-[14px]">Previous Year</div>
                <div className="font-bold text-gray-800">12,000</div>
                <div className="font-bold text-gray-800">15,000</div>
              </div>
            </div>
          </div>

          {/** third grid  */}
          <div className=" bg-white below-md:mt-3 border-t-4 border-[#BCC7D5]  rounded-md shadow-md below-md:shadow-none w-full items-stretch">
            <div className="flex flex-row mt-4 justify-between px-6">
              <div className="flex flex-row gap-2 ">
                <img src="/images/items.svg" />
                <p className="text-[#334155]  text-[16px] font-bold">Items</p>
              </div>
              <div className="cursor-pointer">
                <img src="/images/under_details.svg" onClick={handleClick8} />
              </div>
            </div>

            <div className="w-full overflow-hidden overflow-y-auto overflow-x-auto  max-h-[130px] custom-scrollbar ">
              <table className="w-full  bg-white border border-gray-200 mt-6">
                <tbody>
                  {tableData2.map((row, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 1
                          ? "bg-white"
                          : "bg-[#FAFBFB] text-[14px]"
                      }`}
                    >
                      <td className="pl-6 px-2 py-1 border-b border-gray-200 text-gray-700 font-medium text-[14px]">
                        {row.name}
                      </td>
                      <td className="px-2 py-1 border-b font-medium border-gray-200 text-[#334155] text-[14px] text-center">
                        {row.revenue.toLocaleString()}
                      </td>
                      <td className="px-2 py-1 border-b border-gray-200 text-[14px] font-medium text-[#334155]">
                        ${row.commission}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="-bottom-1 bg-white sticky">
                  <tr className=" text-[#E31212] text-[14px]">
                    <td className="pl-6 px-2 py-1 border-t border-gray-200 font-medium">
                      Total
                    </td>
                    <td className=" px-2 py-1 border-t border-gray-200 text-[14px] font-medium">
                      ${totalRevenue.toLocaleString()}
                    </td>

                    <td className="px-2 py-1 border-t border-gray-200 text-[14px] font-medium">
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

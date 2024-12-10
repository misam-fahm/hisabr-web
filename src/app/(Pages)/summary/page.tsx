"use client";
import { FC, useState } from "react";
import dynamic from "next/dynamic";

const ComposedChart = dynamic(
  () => import("@/Components/drawer/ComposedChart"),
  { ssr: false }
);
const PieChart = dynamic(() => import("@/Components/drawer/PieChart"), {
  ssr: false,
});
const BartChart1 = dynamic(() => import("@/Components/drawer/BarChart1"), {
  ssr: false,
});
const BartChart2 = dynamic(() => import("@/Components/drawer/BarChart2"), {
  ssr: false,
});
const DateRangePicker = dynamic(
  () => import("@/Components/drawer/DateRangePicker"),
  {
    ssr: false,
  }
);

const data = [
  { label: "Beverage", value: 10836, color: "#376066CC" },
  { label: "Cakes", value: 326460, color: "#DEC560" },
  { label: "Food", value: 1835, color: "#5B7993" },
  { label: "Novelties-Boxed", value: 231725, color: "#A6A69E" },
  { label: "Soft Serve", value: 234, color: "#796C72" },
  { label: "Donations", value: 234, color: "#796C72" },
];

const summary: FC = () => {
  /**dropdown */
  const [selectedOption, setSelectedOption] = useState<string>("All stores");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const options = ["Store 1", "Store 2", "Store 3", "All Store"];

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  /**year */
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [isOpen0, setIsOpen0] = useState<boolean>(false);

  const years: number[] = [];
  for (let year = 2021; year <= new Date().getFullYear(); year++) {
    years.push(year);
  }

  const handleYearChange0 = (year: string | number) => {
    setSelectedYear(year.toString());
    setIsOpen0(false);
  };

  /**sales */
  const [selectedYear1, setSelectedYear1] = useState("");
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false); // State for year dropdown
  const years1 = [];
  for (let year = 2021; year <= new Date().getFullYear(); year++) {
    years1.push(year);
  }
  const handleYearChange1 = (year: string | number) => {
    setSelectedYear1(year.toString());
    setIsYearDropdownOpen(false); // Close the dropdown after selection
  };

  /**yearly, quarterly.. */
  const [selectedPeriod, setSelectedPeriod] = useState(""); // State for selected period
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false); // State for period dropdown
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    setIsPeriodDropdownOpen(false); // Close the dropdown after selection
  };

  /**invoices */

  const [selectedYear2, setSelectedYear2] = useState("");
  const [isYearDropdownOpen2, setIsYearDropdownOpen2] = useState(false); // State for year dropdown
  const years2 = [];
  for (let year = 2021; year <= new Date().getFullYear(); year++) {
    years2.push(year);
  }
  const handleYearChange2 = (year: string | number) => {
    setSelectedYear2(year.toString());
    setIsYearDropdownOpen2(false); // Close the dropdown after selection
  };

  /**yearly, quarterly.. */
  const [selectedPeriod2, setSelectedPeriod2] = useState(""); // State for selected period
  const [isPeriodDropdownOpen2, setIsPeriodDropdownOpen2] = useState(false); // State for period dropdown
  const handlePeriodChange2 = (period: string) => {
    setSelectedPeriod2(period);
    setIsPeriodDropdownOpen2(false); // Close the dropdown after selection
  };

  /**yearly sales */

  const [selectedYear3, setSelectedYear3] = useState("");
  const [isYearDropdownOpen3, setIsYearDropdownOpen3] = useState(false); // State for year dropdown
  const years3 = [];
  for (let year = 2021; year <= new Date().getFullYear(); year++) {
    years3.push(year);
  }
  const handleYearChange3 = (year: string | number) => {
    setSelectedYear3(year.toString());
    setIsYearDropdownOpen3(false); // Close the dropdown after selection
  };

  return (
    <main
      className="max-h-[calc(100vh-10px)] overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <div className="below-md:flex below-md:justify-center">
        <p className="text-[18px] below-md:pl-0 below-md:pr-0 font-bold text-defaultblack fixed top-0 z-20 mt-5 pl-6 pr-6">
          Summary
        </p>
      </div>

      <div>
        <div className="z-[11] pb-6 bg-[#f7f8f9] sticky top-16 pt-6 pl-6 pr-6 below-md:px-3">
          <div className="flex flex-row w-full gap-3">
            <div className="w-[20%] below-md:w-full relative">
              {/* Dropdown Button */}
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

              {/* Dropdown Menu */}
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
            <div className="w-[25%] below-md:w-full">
              <DateRangePicker />
            </div>
          </div>
        </div>

        <div className=" pl-6 pr-6 below-md:px-3">
          <div className="flex flex-row below-md:flex-col w-full h-full gap-6 below-md:gap-3 pt-16 ">
            <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#C2D1C3] border-b-4 w-full h-full min-h-[120px] p-4 justify-between">
              <div>
                <p className="text-[14px] text-[#575F6DCC] font-medium">
                  Total Sales
                </p>
                <p className="text-[18px] text-[#2D3748]">$ 2,680,153</p>
                <p className="text-[12px] text-[#388E3C] font-semibold">
                  20%{" "}
                  <span className="text-[#575F6D] font-medium">
                    more than last year
                  </span>
                </p>
              </div>
              <div className="bg-[#EFF6EFA1] rounded-full w-[40px] h-[40px] flex items-center justify-center">
                <img src="./images/summary1.svg" />
              </div>
            </div>

            <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#E5D5D5] border-b-4 w-full h-full min-h-[120px] p-4 justify-between">
              <div>
                <p className="text-[14px] text-[#575F6DCC] font-medium">
                  Total Expenses
                </p>
                <p className="text-[18px] text-[#2D3748]">$ 861,148</p>
                <p className="text-[12px] text-[#388E3C] font-semibold">
                  12%{" "}
                  <span className="text-[#575F6D] font-medium">
                    more than last year
                  </span>
                </p>
              </div>
              <div className="bg-[#F6F1F1] rounded-full w-[40px] h-[40px] flex items-center justify-center">
                <img src="./images/summary2.svg" />
              </div>
            </div>

            <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#C2D1C3] border-b-4 w-full h-full min-h-[120px] p-4 justify-between">
              <div>
                <p className="text-[14px] text-[#575F6DCC] font-medium">
                  Total Profits
                </p>
                <p className="text-[18px] text-[#2D3748]">$ 161,358</p>
                <p className="text-[12px] text-[#388E3C] font-semibold">
                  40%{" "}
                  <span className="text-[#575F6D] font-medium">
                    increase compare to last year
                  </span>
                </p>
              </div>
              <div className="bg-[#EFF6EFA1] rounded-full w-[40px] h-[40px] flex items-center justify-center">
                <img src="./images/summary3.svg" />
              </div>
            </div>
          </div>

          <div className="bg-white mt-6 below-md:mt-3 shadow-md py-4 rounded-md ">
            <div className="flex flex-row justify-end mx-7 below-md:mx-3 gap-4">
              <div className="mt-2 cursor-pointer below-md:hidden">
                <img src="/images/download.svg" />
              </div>
              <div className="mb-6 relative w-full max-w-[20%] below-md:max-w-[40%]">
                {/* Dropdown Button */}
                <button
                  onClick={() => setIsOpen0(!isOpen0)}
                  className="bg-[#ffffff] text-[#4B4B4B] shadow-md px-4 py-[10px] rounded flex items-center justify-between w-full text-[12px]"
                >
                  <span>{selectedYear || "Year"}</span>
                  <img
                    src="/images/icon.svg"
                    alt="Dropdown Icon"
                    className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                      isOpen0 ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isOpen0 && (
                  <div
                    className="absolute left-0 w-full mt-2 bg-[#ffffff] text-[#4B4B4B] text-[12px] border rounded shadow-md"
                    style={{ zIndex: 50 }}
                  >
                    {years.map((year, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          handleYearChange0(year);
                          setIsOpen(false);
                        }}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100 border-b last:border-none"
                      >
                        {year}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <ComposedChart />
          </div>

          <div className="flex flex-row below-md:flex-col w-full mt-6 below-md:mt-3 mb-9">
            <div className="flex flex-col w-[65%] below-md:w-[100%]">
              <div className="bg-white shadow-md rounded-md">
                <div className="flex flex-row justify-between below-md:mx-3 mx-7 mt-6">
                  {/* Sales Text */}
                  <div>
                    <p className="text-[#2D3748] text-[16px] font-bold">
                      Sales
                    </p>
                  </div>

                  {/* Dropdown Group */}
                  <div className="flex flex-row gap-3 w-[60%] justify-end">
                    {/* Download Icon */}
                    <div className="mt-2 cursor-pointer below-md:hidden">
                      <img src="/images/download.svg" alt="Download" />
                    </div>

                    {/* Period Dropdown */}
                    <div className="relative w-[35%] below-md:w-full">
                      <button
                        onClick={() =>
                          setIsPeriodDropdownOpen(!isPeriodDropdownOpen)
                        } // Toggle Period Dropdown
                        className="bg-[#ffffff] text-[#636363] shadow-md px-4 py-[10px] rounded flex items-center justify-between w-full text-[12px]"
                      >
                        <span>{selectedPeriod || "Yearly"}</span>
                        <img
                          src="/images/icon.svg"
                          className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                            isPeriodDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isPeriodDropdownOpen && (
                        <div
                          className="absolute left-0 w-full mt-2 bg-[#ffffff] text-[#636363] text-[12px] border rounded shadow-md"
                          style={{ zIndex: 50 }}
                        >
                          {["Yearly", "Quarterly", "Monthly", "Weekly"].map(
                            (period) => (
                              <div
                                key={period}
                                onClick={() => handlePeriodChange(period)}
                                className="cursor-pointer px-4 py-2 hover:bg-gray-100 border-b last:border-none"
                              >
                                {period}
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>

                    {/* Year Dropdown */}
                    <div className="relative w-[35%] below-md:w-full">
                      <button
                        onClick={() =>
                          setIsYearDropdownOpen(!isYearDropdownOpen)
                        } // Toggle Year Dropdown
                        className="bg-[#ffffff] text-[#636363] shadow-md px-4 py-[10px] rounded flex items-center justify-between w-full text-[12px]"
                      >
                        <span>{selectedYear1 || "2021"}</span>
                        <img
                          src="/images/icon.svg"
                          className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                            isYearDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isYearDropdownOpen && (
                        <div
                          className="absolute left-0 w-full mt-2 bg-[#ffffff] text-[#636363] text-[12px] border rounded shadow-md"
                          style={{ zIndex: 50 }}
                        >
                          {years1.map((year) => (
                            <div
                              key={year}
                              onClick={() => handleYearChange1(year)}
                              className="cursor-pointer px-4 py-2 hover:bg-gray-100 border-b last:border-none"
                            >
                              {year}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <BartChart2 />
              </div>
              <div className="bg-white shadow-md rounded-md mt-6  below-md:mt-3">
                <div className="flex flex-row justify-between mx-7 below-md:mx-3 mt-6">
                  {/* Sales Text */}
                  <div>
                    <p className="text-[#2D3748] text-[16px] font-bold">
                      Invoices
                    </p>
                  </div>

                  {/* Dropdown Group */}
                  <div className="flex flex-row gap-3 w-[60%] justify-end">
                    <div className="mt-2 cursor-pointer below-md:hidden">
                      <img src="/images/download.svg" />
                    </div>
                    {/* Period Dropdown */}
                    <div className="relative w-[35%] below-md:w-full">
                      <button
                        onClick={() =>
                          setIsPeriodDropdownOpen2(!isPeriodDropdownOpen2)
                        } // Toggle Period Dropdown
                        className="bg-[#ffffff] text-[#636363] shadow-md px-4 py-[10px] rounded flex items-center justify-between w-full text-[12px]"
                      >
                        <span>{selectedPeriod2 || "Yearly"}</span>
                        <img
                          src="/images/icon.svg"
                          className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                            isPeriodDropdownOpen2 ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isPeriodDropdownOpen2 && (
                        <div
                          className="absolute left-0 w-full mt-2 bg-[#ffffff] text-[#636363] text-[12px] border rounded shadow-md"
                          style={{ zIndex: 50 }}
                        >
                          {["Yearly", "Quarterly", "Monthly", "Weekly"].map(
                            (period) => (
                              <div
                                key={period}
                                onClick={() => handlePeriodChange2(period)}
                                className="cursor-pointer px-4 py-2 hover:bg-gray-100 border-b last:border-none"
                              >
                                {period}
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>

                    {/* Year Dropdown */}
                    <div className="relative w-[35%] below-md:w-full">
                      <button
                        onClick={() =>
                          setIsYearDropdownOpen2(!isYearDropdownOpen2)
                        } // Toggle Year Dropdown
                        className="bg-[#ffffff] text-[#636363] shadow-md px-4 py-[10px] rounded flex items-center justify-between w-full text-[12px]"
                      >
                        <span>{selectedYear2 || "2021"}</span>
                        <img
                          src="/images/icon.svg"
                          className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                            isYearDropdownOpen2 ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isYearDropdownOpen2 && (
                        <div
                          className="absolute left-0 w-full mt-2 bg-[#ffffff] text-[#636363] text-[12px] border rounded shadow-md"
                          style={{ zIndex: 50 }}
                        >
                          {years2.map((year) => (
                            <div
                              key={year}
                              onClick={() => handleYearChange2(year)}
                              className="cursor-pointer px-4 py-2 hover:bg-gray-100 border-b last:border-none"
                            >
                              {year}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <BartChart1 />
              </div>
            </div>
            <div className="w-[35%] below-md:w-[100%] bg-white ml-6 below-md:ml-0 below-md:mt-3 shadow-md rounded-md">
              <div className="flex flex-col">
                {/* Header Section */}
                <div className="flex flex-row justify-between px-6 pt-6 items-start">
                  {/* Sales Information */}
                  <div>
                    <p className="text-[#393E47] font-bold text-[16px]">
                      Yearly Sales
                    </p>
                    <p className="text-[#0A0A0A] font-bold text-[24px] mt-1">
                      $ 591,187
                    </p>
                    <div className="flex flex-row gap-2 bg-[#ECFDF5] p-1 w-20 rounded-sm mt-2 items-center">
                      <img
                        src="/images/112.svg"
                        alt="Growth Icon"
                        className="w-4 h-4"
                      />
                      <p className="text-[rgba(55, 96, 102, 0.8)] text-[12px]">
                        11.2%
                      </p>
                    </div>
                  </div>

                  {/* Dropdown */}
                  <div className="mb-6 relative w-[100%] max-w-[35%]">
                    <button
                      onClick={() =>
                        setIsYearDropdownOpen3(!isYearDropdownOpen3)
                      } // Toggle Year Dropdown
                      className="bg-[#ffffff] text-[#636363] shadow-md px-4 py-[10px] rounded flex items-center justify-between w-full text-[12px]"
                    >
                      <span>{selectedYear3 || "2021"}</span>
                      <img
                        src="/images/icon.svg"
                        className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                          isYearDropdownOpen3 ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isYearDropdownOpen3 && (
                      <div
                        className="absolute left-0 w-full mt-2 bg-[#ffffff] text-[#636363] text-[12px] border rounded shadow-md"
                        style={{ zIndex: 50 }}
                      >
                        {years3.map((year) => (
                          <div
                            key={year}
                            onClick={() => handleYearChange3(year)}
                            className="cursor-pointer px-4 py-2 hover:bg-gray-100 border-b last:border-none"
                          >
                            {year}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Pie Chart Section */}
                <div className="mt-4 px-6">
                  <PieChart />
                </div>

                <div>
                  <div className="w-full max-w-sm mx-auto px-6 below-md:pb-12">
                    <ul>
                      {data.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between py-2"
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
        </div>
      </div>
    </main>
  );
};
export default summary;

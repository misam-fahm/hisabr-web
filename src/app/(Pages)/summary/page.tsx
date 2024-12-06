"use client";
import { FC, useState } from "react";
import dynamic from 'next/dynamic';

const ComposedChart = dynamic(() => import('@/Components/drawer/ComposedChart'), { ssr: false });
const PieChart = dynamic(() => import('@/Components/drawer/PieChart'), { ssr: false });
const BartChart1 = dynamic(() => import('@/Components/drawer/BarChart1'), { ssr: false });
const BartChart2 = dynamic(() => import('@/Components/drawer/BarChart2'), { ssr: false });

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
  const [selectedYear, setSelectedYear] = useState(
    `${new Date().getFullYear()}`
  );

  // Generate years from 2000 to the current year
  const years = [];
  for (let year = 2000; year <= new Date().getFullYear(); year++) {
    years.push(year);
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  return (
    <main className="max-h-[calc(100vh-70px)] overflow-auto" style={{scrollbarWidth:"thin"}}>
      <div>
        <p className="text-[18px] font-bold text-defaultblack fixed top-0 z-30 mt-5 pl-6 pr-6">
          Summary
        </p>
      </div>

      <div>
        <div className=" pb-3 bg-[#f7f8f9] pt-3 pl-6 pr-6">
          <div className="w-[20%]">
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
                className="absolute left-0 w-[20%] mt-2 bg-[#ffffff] text-[#4B4B4B] text-[12px] border rounded shadow-md"
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
        </div>

        <div className=" pl-6 pr-6">
          <div className="flex flex-row w-full h-full gap-6 pt-3 ">
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

          <div className="bg-white mt-6 shadow-md py-4 rounded-md">
            <div className="ml-6 mb-6 relative w-full max-w-[20%]">
              {/* Dropdown */}
              <select
                className="shadow-md appearance-none pr-8 w-full"
                id="year-select"
                value={selectedYear}
                onChange={handleYearChange}
                style={{
                  padding: "0.5em 1em",
                  borderRadius: "5px",
                  background: "white",
                }}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              {/* Custom Icon */}
              <img
                src="/images/icon.svg"
                alt="Dropdown Icon"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                style={{ width: "1em", height: "1em" }}
              />
            </div>

            <ComposedChart />
          </div>

          <div className="flex flex-row w-full mt-6 mb-9">
            <div className="flex flex-col w-[65%]">
              <div className="bg-white shadow-md rounded-md">
                <BartChart2 />
              </div>
              <div className="bg-white shadow-md rounded-md mt-6">
                <BartChart1 />
              </div>
            </div>
            <div className="w-[35%] bg-white ml-6 shadow-md rounded-md">
              <div className="flex flex-col ">
                <div className="flex flex-row justify-between px-6 pt-6">
                  <div>
                    <p className="text-[#393E47] font-bold text-[16px]">
                      Yearly Sales
                    </p>
                    <p className="text-[#0A0A0A] font-bold text-[24px]">
                      $ 591,187
                    </p>
                    <div className="flex flex-row gap-3 bg-[#ECFDF5] p-1 w-16 rounded-sm">
                      <img src="/images/112.svg" />
                      <p className="text-[rgba(55, 96, 102, 0.8)] text-[12px]">
                        11.2%
                      </p>
                    </div>
                  </div>
                  <div>hello</div>
                </div>
                <div>
                  <PieChart />
                </div>
                <div>
                  <div className="w-full max-w-sm mx-auto px-6">
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

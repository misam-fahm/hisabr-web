"use client";
import { FC, useState } from "react";
import DonutChart from "@/Components/drawer/DonutChart";
import DateRange from "@/Components/drawer/DateRangePicker";

const SalesKPI: FC = () => {
  const tableData = [
    { label: "Profit", amount: "10,000", per: "65%", color: "#53755599" },
    { label: "Labor Cost", amount: "2,000", per: "20%", color: "#DAB777" },
    { label: "Sales Tax", amount: "50,000", per: "75%", color: "#653C597A" },
    { label: "Royalty", amount: "20,000", per: "25%", color: "#79AFC7" },
    {
      label: "Operating Expenses",
      amount: "50,000",
      per: "75%",
      color: "#29507B",
    },
    { label: "COGS", amount: "30,000", per: "45%", color: "#AC8892" },
  ];

  /**dropdown */
  const [selectedOption, setSelectedOption] = useState<string>("All stores");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const options = ["Store 1", "Store 2", "Store 3", "All Store"];

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <main
      className="max-h-[calc(100vh-70px)] overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <div className="below-md:flex below-md:justify-center">
        <p className="text-[18px] font-bold text-defaultblack fixed top-0 z-20 mt-5 below-md:pl-0 below-md:pr-0 pl-6 pr-6">
          Sales KPI
        </p>
      </div>

      <div className=" mb-10">
        <div className="flex flex-row below-md:flex-col below-md:items-end sticky top-16 justify-between pt-6 below-md:px-3  pl-6 pr-6 pb-6 below-md:pb-3 bg-[#f7f8f9] ">
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
            <div className="w-[30%] below-md:w-full">
              <DateRange />
            </div>
          </div>
          <div className="below-md:w-full below-md:flex below-md:justify-end below-md:pl-3">
            <button
              className="bg-[#1AA47D] below-md:mt-3 [box-shadow:0px_3px_8px_0px_#00000026] w-[133px] below-md:w-[50%]  h-[37px] rounded-md text-white text-[14px] font-semibold 
             hover:shadow-lg transition-shadow duration-300"
            >
              PI Report
            </button>
          </div>
        </div>

        {/* grid 1 */}

        <div className="flex flex-row below-md:flex-col w-full h-full gap-6 below-md:gap-3 below-md:pl-3 below-md:pr-3 pt-16 pl-6 pr-6">
          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#C2D1C3] border-b-4 w-full h-full min-h-[120px] p-4 justify-between">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">Sales</p>
              <p className="text-[18px] text-[#2D3748]">$ 161,358</p>
              <p className="text-[12px] text-[#388E3C] font-semibold">
                20%{" "}
                <span className="text-[#575F6D] font-medium">
                  more than last year
                </span>
              </p>
            </div>
            <div className="bg-[#EFF6EFA1] rounded-full w-[40px] h-[40px] flex items-center justify-center">
              <img src="./images/dollar.svg" />
            </div>
          </div>

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#C2D1C3] border-b-4 w-full h-full min-h-[120px] p-4 justify-between">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">Profit</p>
              <p className="text-[18px] text-[#2D3748]">$ 161,358</p>
              <p className="text-[12px] text-[#388E3C] font-semibold">
                65.2%{" "}
                <span className="text-[#575F6D] font-medium">
                  of total revenue achieved
                </span>
              </p>
            </div>
            <div className="bg-[#EFF6EFA1] rounded-full w-[40px] h-[40px] flex items-center justify-center">
              <img src="./images/dollar2.svg" />
            </div>
          </div>

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#C2D1C3] border-b-4 w-full h-full min-h-[120px] p-4 justify-between">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">
                Customer Count
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
              <img src="./images/dollar3.svg" />
            </div>
          </div>

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#E5D5D5] border-b-4 w-full h-full min-h-[120px] p-4 justify-between">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">
                Labor Cost
              </p>
              <p className="text-[18px] text-[#2D3748]">$ 161,358</p>
              <p className="text-[12px] text-[#388E3C] font-semibold">
                16%{" "}
                <span className="text-[#575F6D] font-medium">
                  of total expenses
                </span>
              </p>
            </div>
            <div className="bg-[#F5EBEBA1] rounded-full w-[40px] h-[40px] flex items-center justify-center">
              <img src="./images/dollar4.svg" />
            </div>
          </div>
        </div>

        {/* grid 2 */}
        <div className="flex flex-row below-md:flex-col w-full h-full gap-6 below-md:gap-3 below-md:px-3 mt-6 below-md:mt-3  pl-6 pr-6">
          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#E5D5D5] border-b-4 w-full h-full min-h-[120px] p-4 justify-between">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">
                Sales Tax
              </p>
              <p className="text-[18px] text-[#2D3748]">$ 161,358</p>
              <p className="text-[12px] text-[#388E3C] font-semibold">
                <span className="text-[#575F6D] font-medium">
                  Estimated tax liablity
                </span>
              </p>
            </div>
            <div className="bg-[#F5EBEBA1] rounded-full w-[40px] h-[40px] flex items-center justify-center">
              <img src="./images/dollar5.svg" />
            </div>
          </div>

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#E5D5D5] border-b-4 w-full h-full min-h-[120px] p-4 justify-between">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">
                Royalty
              </p>
              <p className="text-[18px] text-[#2D3748]">$ 161,358</p>
              <p className="text-[12px] text-[#388E3C] font-semibold">
                9.0%{" "}
                <span className="text-[#575F6D] font-medium">
                  of total expenses
                </span>
              </p>
            </div>
            <div className="bg-[#F5EBEBA1] rounded-full w-[40px] h-[40px] flex items-center justify-center">
              <img src="./images/dollar6.svg" />
            </div>
          </div>

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#E5D5D5] border-b-4 w-full h-full min-h-[120px] p-4 justify-between">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">
                Operating Expenses
              </p>
              <p className="text-[18px] text-[#2D3748]">$ 161,358</p>
              <p className="text-[12px] text-[#388E3C] font-semibold">
                0%{" "}
                <span className="text-[#575F6D] font-medium">
                  of total expenses
                </span>
              </p>
            </div>
            <div className="bg-[#F5EBEBA1] rounded-full w-[40px] h-[40px] flex items-center justify-center">
              <img src="./images/dollar7.svg" />
            </div>
          </div>

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#C2D1C3] border-b-4 w-full h-full min-h-[120px] p-4 justify-between">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">COGS</p>
              <p className="text-[18px] text-[#2D3748]">$ 161,358</p>
              <p className="text-[12px] text-[#388E3C] font-semibold">
                9.8%{" "}
                <span className="text-[#575F6D] font-medium">
                  of total total expenses
                </span>
              </p>
            </div>
            <div className="bg-[#EFF6EFA1] rounded-full w-[40px] h-[40px] flex items-center justify-center">
              <img src="./images/dollar8.svg" />
            </div>
          </div>
        </div>

        <div className="flex flex-row below-md:flex-col justify-between items-center rounded-lg bg-white mt-6 below-md:mt-3 below-md:mx-3 shadow-md px-10 ml-6 mr-6">
          <div>
            <DonutChart />
          </div>
          <div className="overflow-x-auto w-full custom-scrollbar">
            <table className="items-center bg-transparent w-full below-md:mb-12">
              <thead>
                <tr>
                  <th className="px-6 below-md:px-2 bg-blueGray-50 text-[#737373] text-left border border-solid border-blueGray-300 py-1 text-sm  border-l-0 border-r-0 border-t-0 whitespace-nowrap font-medium ">
                    Label
                  </th>
                  <th className="px-6 below-md:px-2 bg-blueGray-50 text-[#737373] text-center border border-solid border-blueGray-300 py-1 text-sm border-l-0 border-r-0 border-t-0 whitespace-nowrap font-medium ">
                    Amount
                  </th>
                  <th className="px-6 below-md:px-2 bg-blueGray-50 text-[#737373] text-center border border-solid border-blueGray-300 py-1 text-sm border-l-0 border-r-0 border-t-0 whitespace-nowrap font-medium">
                    %
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}>
                    <td className="border-t-0 px-6 below-md:px-2 text-left border-l-0 border-r-0 text-xs whitespace-nowrap p-2 flex items-center text-[#404040] text-[13px]">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: row.color }}
                      ></div>
                      {row.label}
                    </td>
                    <td className="text-[14px] font-medium border-t-0 px-6 below-md:px-2 text-center border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                      $ {row.amount}
                    </td>
                    <td className="text-[14px] font-medium border-t-0 px-6 below-md:px-2 text-center border-l-0 border-r-0 text-xs whitespace-nowrap p-2">
                      {row.per}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SalesKPI;

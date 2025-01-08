"use client";
import { FC, useState } from "react";
import DonutChart from "@/Components/drawer/DonutChart";
import DateRangePicker from "@/Components/ui/Common/DateRangePicker";
import Dropdown from "@/Components/ui/Common/DropDown";

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
  const [selectedOption, setSelectedOption] = useState<string>("Stores");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const options = ["Store 1", "Store 2", "Store 3", "All Store"];

  const toggleDropdown1 = () => setIsOpen(!isOpen);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

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
      className="max-h-[calc(100vh-60px)] below-md:max-h-[calc(100vh-0)] overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      {/* <div className="below-md:flex below-md:justify-center">
        <p className="text-[18px] font-bold text-defaultblack fixed top-0 z-20 mt-5 below-md:pl-0 below-md:pr-0 pl-6 pr-6">
          Sales KPI
        </p>
      </div> */}

      <div>
        <div className="flex flex-row below-md:flex-col below-md:items-end sticky  justify-between pt-6 below-md:pt-4 below-md:px-3  pl-6 pr-6 pb-6 below-md:pb-4 bg-[#f7f8f9] ">
          <div className="flex flex-row below-md:flex-col w-full gap-3">
            <Dropdown
              options={options}
              selectedOption={selectedOption}
              onSelect={handleSelect}
              isOpen={isOpen}
              toggleOpen={toggleDropdown1}
            />

            <div className="w-[260px] tablet:w-full below-md:w-full">
              <DateRangePicker />
            </div>
          </div>
          <div className="below-md:hidden tablet:hidden">
            <button className="flex items-center justify-center bg-[#1AA47D] hover:bg-[#168A68] shadow-lg w-[170px] h-[35px] rounded-md text-white text-[14px] font-semibold">
              <img
                src="/images/uploadIcon.svg"
                alt="Upload Icon"
                className="mr-1"
              />
              PI Report
            </button>
          </div>
        </div>

        {/* grid 1 */}

        <div className="grid grid-cols-4 below-md:grid-cols-1 tablet:grid-cols-2 w-full h-full gap-6 below-md:gap-3 below-md:pl-3 below-md:pr-3  pl-6 pr-6 items-stretch tablet:flex-wrap tablet:gap-3">
          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#C2D1C3] border-b-4 w-full p-4 justify-between items-stretch">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">Sales</p>
              <p className="text-[16px] text-[#2D3748] font-bold">$161,358</p>
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

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#C2D1C3] border-b-4 w-full p-4 justify-between items-stretch">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">Profit</p>
              <p className="text-[16px] text-[#2D3748] font-bold">$161,358</p>
              <p className="text-[12px] text-[#388E3C] font-semibold">
                65.2%{" "}
                <span className="text-[#575F6D] font-medium">
                  of total revenue <br />
                  achieved
                </span>
              </p>
            </div>
            <div className="bg-[#EFF6EFA1] rounded-full w-[40px] h-[40px] flex items-center justify-center">
              <img src="./images/dollar2.svg" />
            </div>
          </div>

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#C2D1C3] border-b-4 w-full p-4 justify-between items-stretch">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">
                Customer Count
              </p>
              <p className="text-[16px] text-[#2D3748] font-bold">$161,358</p>
              <p className="text-[12px] text-[#388E3C] font-semibold">
                40%{" "}
                <span className="text-[#575F6D] font-medium">
                  increase compare <br /> to last year
                </span>
              </p>
            </div>
            <div className="bg-[#EFF6EFA1] rounded-full w-[40px] h-[40px] flex items-center justify-center">
              <img src="./images/dollar3.svg" />
            </div>
          </div>

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#E5D5D5] border-b-4 w-full p-4 justify-between items-stretch">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">
                Labor Cost
              </p>
              <p className="text-[16px] text-[#2D3748] font-bold">$161,358</p>
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

          {/* grid 2 */}

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#E5D5D5] border-b-4 w-full p-4 justify-between items-stretch">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">
                Sales Tax
              </p>
              <p className="text-[16px] text-[#2D3748] font-bold">$161,358</p>
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

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#E5D5D5] border-b-4 w-full p-4 justify-between items-stretch">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">
                Royalty
              </p>
              <p className="text-[16px] text-[#2D3748] font-bold">$161,358</p>
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

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#E5D5D5] border-b-4 w-full p-4 justify-between items-stretch">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">
                Operating Expenses
              </p>
              <p className="text-[16px] text-[#2D3748] font-bold">$161,358</p>
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

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#C2D1C3] border-b-4 w-full p-4 justify-between items-stretch">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">COGS</p>
              <p className="text-[16px] text-[#2D3748] font-bold">$161,358</p>
              <p className="text-[12px] text-[#388E3C] font-semibold">
                9.8%{" "}
                <span className="text-[#575F6D] font-medium">
                  of total expenses
                </span>
              </p>
            </div>
            <div className="bg-[#EFF6EFA1] rounded-full w-[40px] h-[40px] flex items-center justify-center">
              <img src="./images/dollar8.svg" />
            </div>
          </div>
        </div>

        <div className="flex flex-col below-md:flex-col tablet:flex-col justify-between rounded-lg below-md:mb-6 bg-white mt-6 below-md:mt-3 below-md:mx-3 shadow-md ml-6 mr-6">
          <div className="w-full text-left font-bold mx-4 mt-6 text-[16px] text-[#334155]">
            Expense Distribution
          </div>
          <div className="flex flex-row items-center below-md:flex-col tablet:flex-col mx-3">
            <div className="-my-12">
              <DonutChart />
            </div>
            <div className="overflow-x-auto w-full custom-scrollbar">
              <table className="items-center bg-transparent w-full below-md:mb-12 tablet:mb-12">
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
      </div>

      <div className="below-lg:hidden flex justify-end fixed bottom-5 right-5">
        <button
          className="focus:outline-none flex items-center justify-center bg-[#168A6F] hover:bg-[#11735C] w-[56px] h-[56px] rounded-xl relative"
          onTouchStart={handlePressStart} // For mobile devices
          onMouseLeave={handlePressEnd} // Hide tooltip on mouse leave
        >
          <img
            src="/images/uploadIcon.svg"
            alt="Upload Icon"
            className="w-[18px]"
          />
          {showTooltip && (
            <div className="absolute bottom-[70px] right-[80%] transform translate-x-1/2 bg-[#79747E] text-white text-[12px] px-5 py-2 rounded-md whitespace-nowrap">
              PI Report
              {/* Tooltip Pointer */}
              <div className="absolute top-full right-[20%] transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#79747E]"></div>
            </div>
          )}
        </button>
      </div>
    </main>
  );
};

export default SalesKPI;

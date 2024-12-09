"use client";
import React from "react";
import { useState } from "react";
import "../globals.css";
import MultiLineChart from "@/Components/drawer/MultiLineChart";
import BarChart4 from "@/Components/drawer/BarChart4";
import PieChart3 from "@/Components/drawer/Piechart3";
import { useRouter } from "next/navigation";

const dat = [
  { label: "New Customers", value: 10836, per: "2%", color: "#376066CC" },
  { label: "Returning Customers", value: 326460, per: "10%", color: "#DEC560" },
];

const DetailsPage: React.FC = () => {
  /**go back button */
  const router = useRouter();
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

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

  /**third dropdown */
  const [selectedOption3, setSelectedOption3] = useState<string>("2021");
  const [isOpen3, setIsOpen3] = useState<boolean>(false);

  const options3 = ["2024", "2023", "2022", "2021"];

  const handleSelect3 = (option3: string) => {
    setSelectedOption3(option3);
    setIsOpen3(false);
  };

  /**fourth dropdown */
  const [selectedOption4, setSelectedOption4] = useState<string>("2021");
  const [isOpen4, setIsOpen4] = useState<boolean>(false);

  const options4 = ["2024", "2023", "2022", "2021"];

  const handleSelect4 = (option4: string) => {
    setSelectedOption4(option4);
    setIsOpen4(false);
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
          Customer Count Analysis
        </p>
      </div>
      <div className="pt-6 pb-6 sticky z-10 top-16 bg-[#f7f8f9] pl-6 pr-6 below-md:px-3">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-3  w-full">
            <div className="relative w-[30%] below-md:w-full">
              <p className="text-[#2D374880] text-[12px] mb-2">Select Store</p>
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

            {/*second dropdown */}

            <div className="relative w-[30%]  below-md:w-full">
              <p className="text-[#2D374880] text-[12px] mb-2">Select Period</p>
              {/* Dropdown Button */}
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

              {/* Dropdown Menu */}
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

      <div className=" pl-6 pr-6 below-md:px-3">
        <div className="flex flex-row below-md:flex-col w-full h-full gap-6 below-md:gap-3 pt-16 ">
          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#C2D1C3] border-b-4 w-full h-full min-h-[130px] p-4 justify-between">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">
                Total Customer Count
              </p>
              <p className="text-[18px] text-[#2D3748]">50,000</p>
              <p className="text-[12px] text-[#388E3C] font-semibold">
                20%{" "}
                <span className="text-[#575F6D] font-medium">
                  more than last year
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#947F914D] border-b-4 w-full h-full min-h-[130px] p-4 justify-between">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">
                New Customers
              </p>
              <p className="text-[18px] text-[#2D3748]">33,000</p>
              <p className="text-[12px] text-[#388E3C] font-semibold">
                13%{" "}
                <span className="text-[#575F6D] font-medium">
                  Increased compared to last year
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#9E8F503B] border-b-4 w-full h-full min-h-[130px] p-4 justify-between">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">
                Returning Customers
              </p>
              <p className="text-[18px] text-[#2D3748]">12,000</p>
              <p className="text-[12px] text-[#388E3C] font-semibold">
                35%{" "}
                <span className="text-[#575F6D] font-medium">
                  of Total Customers
                </span>
              </p>
            </div>
          </div>

          <div className="bg-[#FFFFFF] rounded-lg shadow-sm border-[#9E8F503B] border-b-4 w-full h-full min-h-[130px] p-4 justify-between">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">
                Customer Retention Rate
              </p>
              <p className="text-[18px] text-[#2D3748]">52% </p>
              <p className="text-[12px] text-[#388E3C] font-semibold">
                <span className="text-[#575F6D] font-medium">
                  of target met
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-row w-full mt-6 mb-9 below-md:flex-col below-md:mt-3">
          <div className=" w-[70%] below-md:w-full">
            <div className="bg-white shadow-md rounded-md">
              <div className="flex flex-row justify-between mx-6 pt-5  mb-5">
                <div>
                  <p className="text-[#393E47] text-[16px] font-bold mb-3">
                    Customer Count
                  </p>
                </div>

                <div className="relative w-[30%]">
                  {/* Dropdown Button */}
                  <button
                    onClick={() => setIsOpen3(!isOpen3)}
                    className="bg-[#ffffff] text-[#4B4B4B] shadow-md px-4 py-[10px] rounded flex items-center justify-between w-full text-[12px]"
                  >
                    <span>{selectedOption3}</span>
                    <img
                      src="./images/icon.svg"
                      className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                        isOpen3 ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isOpen3 && (
                    <div
                      className="absolute left-0 w-full mt-2 bg-[#ffffff] text-[#4B4B4B] text-[12px] border rounded shadow-md"
                      style={{ zIndex: 50 }}
                    >
                      {options3.map((option3, index) => (
                        <div
                          key={index}
                          onClick={() => handleSelect3(option3)}
                          className="cursor-pointer px-4 py-2 hover:bg-gray-100 border-b last:border-none"
                        >
                          {option3}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <BarChart4 selectedYear={Number(selectedOption3)} />
              </div>
            </div>
          </div>
          <div className="w-[30%] bg-white ml-6 shadow-md rounded-md below-md:w-full below-md:ml-0 below-md:mt-3 below-md:pb-9">
            <div className="flex flex-col ">
              <div>
                <p className="text-[#393E47] font-bold text-[16px] px-4 pt-6">
                  Customer Segmentation
                </p>
              </div>

              <div>
                <PieChart3 />
              </div>
              <div>
                <div className="w-full max-w-sm mx-auto px-6">
                  <ul>
                    {dat.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between py-1"
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

                        <span className="font-medium text-[#0A0A0A] text-[14px]">
                          {item.per}
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
    </main>
  );
};

export default DetailsPage;

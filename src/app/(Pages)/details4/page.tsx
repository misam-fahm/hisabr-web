"use client";
import React from "react";
import { useState } from "react";
import "../globals.css";
import BarChart4 from "@/Components/drawer/BarChart4";
import PieChart3 from "@/Components/drawer/Piechart3";
import { useRouter } from "next/navigation";
import Dropdown from "@/Components/ui/Common/DropDown";

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

  const [selectedOption, setSelectedOption] = useState<string>("All stores");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption2, setSelectedOption2] = useState<string>("2021");
  const [isOpen2, setIsOpen2] = useState<boolean>(false);
  const [selectedOption3, setSelectedOption3] = useState<string>("2021");
  const [isOpen3, setIsOpen3] = useState<boolean>(false);

  const options = ["Store 1", "Store 2", "Store 3", "All Store"];
  const options2 = ["2024", "2023", "2022", "2021"];
  const options3 = ["2024", "2023", "2022", "2021"];

  const toggleDropdown1 = () => setIsOpen(!isOpen);
  const toggleDropdown2 = () => setIsOpen2(!isOpen2);
  const toggleDropdown3 = () => setIsOpen3(!isOpen3);

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
      <div className="pt-6 pb-6 below-md:pb-3 sticky z-10 top-16 bg-[#f7f8f9] pl-6 pr-6 below-md:px-3">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row below-md:flex-col gap-3 w-full">
            <Dropdown
              label="  Select Store"
              options={options}
              selectedOption={selectedOption}
              onSelect={handleSelect}
              isOpen={isOpen}
              toggleOpen={toggleDropdown1}
            />

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

      <div className=" pl-6 pr-6 below-md:px-3">
        <div className="flex flex-row below-md:flex-col w-full h-full gap-6 below-md:gap-3 pt-16 items-stretch">
          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#C2D1C3] border-b-4 w-full items-stretch p-4 justify-between">
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

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#947F914D] border-b-4 w-full items-stretch p-4 justify-between">
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

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#9E8F503B] border-b-4 w-full items-stretch p-4 justify-between">
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

          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#9E8F503B] border-b-4 w-full items-stretch p-4 justify-between">
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

                <div className="relative w-[20%]">
                  <Dropdown
                    className="relative w-full below-md:w-full"
                    shadowclassName="shadow-sm"
                    options={options3}
                    selectedOption={selectedOption3}
                    onSelect={handleSelect3}
                    isOpen={isOpen3}
                    toggleOpen={toggleDropdown3}
                  />
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

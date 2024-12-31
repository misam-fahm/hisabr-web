"use client";
import { FC, useState } from "react";
import dynamic from "next/dynamic";
import Dropdown from "@/Components/ui/Common/DropDown";

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
  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  /**year composed chart*/

  const [selectedOption2, setSelectedOption2] = useState<string | undefined>(
    undefined
  );
  const [isOpen2, setIsOpen2] = useState<boolean>(false);

  const options2 = ["2024", "2023", "2022", "2021"];
  const toggleDropdown2 = () => setIsOpen2(!isOpen2);

  const handleSelect2 = (option2: string) => {
    setSelectedOption2(option2);
    setIsOpen2(false);
  };

  /**sales */
  const [selectedOption3, setSelectedOption3] = useState<string>("2021");
  const [isOpen3, setIsOpen3] = useState<boolean>(false);

  const options3 = ["2024", "2023", "2022", "2021"];
  const toggleDropdown3 = () => setIsOpen3(!isOpen3);

  const handleSelect3 = (option3: string) => {
    setSelectedOption3(option3);
    setIsOpen3(false);
  };

  /**yearly, quarterly.. */
  const [selectedOption4, setSelectedOption4] = useState<string>("Yearly");
  const [isOpen4, setIsOpen4] = useState<boolean>(false);

  const options4 = ["Yearly", "Quarterly", "Monthly", "Weekly"];
  const toggleDropdown4 = () => setIsOpen4(!isOpen4);

  const handleSelect4 = (option4: string) => {
    setSelectedOption4(option4);
    setIsOpen4(false);
  };

  /**invoices */

  const [selectedOption5, setSelectedOption5] = useState<string>("2021");
  const [isOpen5, setIsOpen5] = useState<boolean>(false);

  const options5 = ["2024", "2023", "2022", "2021"];
  const toggleDropdown5 = () => setIsOpen5(!isOpen5);

  const handleSelect5 = (option5: string) => {
    setSelectedOption5(option5);
    setIsOpen5(false);
  };

  /**yearly, quarterly.. */
  const [selectedOption6, setSelectedOption6] = useState<string>("Yearly");
  const [isOpen6, setIsOpen6] = useState<boolean>(false);

  const options6 = ["Yearly", "Quarterly", "Monthly", "Weekly"];
  const toggleDropdown6 = () => setIsOpen6(!isOpen6);

  const handleSelect6 = (option6: string) => {
    setSelectedOption6(option6);
    setIsOpen6(false);
  };

  /**yearly sales */

  const [selectedOption7, setSelectedOption7] = useState<string>("2021");
  const [isOpen7, setIsOpen7] = useState<boolean>(false);

  const options7 = ["2024", "2023", "2022", "2021"];
  const toggleDropdown7 = () => setIsOpen7(!isOpen7);

  const handleSelect7 = (option7: string) => {
    setSelectedOption7(option7);
    setIsOpen7(false);
  };
  return (
    <main
      className="max-h-[calc(100vh-60px)] overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      {/* <div className="below-md:flex below-md:justify-center">
        <p className="text-[18px] below-md:pl-0 below-md:pr-0 font-bold text-defaultblack fixed top-0 z-20 mt-5 pl-6 pr-6">
          Summary
        </p>
      </div> */}

      <div>
        <div className="z-[11] pb-6 below-md:pb-4 bg-[#f7f8f9] sticky pt-6 below-md:pt-4 pl-6 pr-6 below-md:px-3">
          <div className="flex flex-row below-md:flex-col w-full gap-3">
            {/* First Dropdown */}

            <Dropdown
              options={options}
              selectedOption={selectedOption}
              onSelect={handleSelect}
              isOpen={isOpen}
              toggleOpen={toggleDropdown}
            />
            <div className="below-md:w-full tablet:w-full">
              <DateRangePicker />
            </div>
          </div>
        </div>

        <div className=" pl-6 pr-6 below-md:px-3 ">
          <div className="flex flex-row below-md:flex-col tablet:flex-col w-full h-full gap-6 below-md:gap-3 tablet:gap-3  items-stretch">
            <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#C2D1C3] border-b-4 w-full  p-4 justify-between items-stretch">
              <div>
                <p className="text-[14px] text-[#575F6DCC] font-medium">
                  Total Sales
                </p>
                <p className="text-[16px] text-[#2D3748] font-bold">
                  $2,680,153
                </p>
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

            <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#E5D5D5] border-b-4 w-full p-4 justify-between items-stretch">
              <div>
                <p className="text-[14px] text-[#575F6DCC] font-medium">
                  Total Expenses
                </p>
                <p className="text-[16px] text-[#2D3748] font-bold">$861,148</p>
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

            <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#C2D1C3] border-b-4 w-full p-4 justify-between items-stretch">
              <div>
                <p className="text-[14px] text-[#575F6DCC] font-medium">
                  Total Profits
                </p>
                <p className="text-[16px] text-[#2D3748] font-bold">$161,358</p>
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
            <div className="flex flex-row justify-end mx-7 below-md:mx-3 gap-5">
              <div className="mt-2 cursor-pointer below-md:hidden">
                <img src="/images/download.svg" />
              </div>
              <div className="mb-6 relative below-md:w-full below-md:max-w-[40%]">
                <Dropdown
                  options={options2}
                  shadowclassName="shadow-sm"
                  selectedOption={selectedOption2}
                  onSelect={handleSelect2}
                  isOpen={isOpen2}
                  toggleOpen={toggleDropdown2}
                  className="below-md:w-full"
                  widthchange="below-lg:w-[130px] tablet:w-[130px]"
                />
              </div>
            </div>
            <ComposedChart />
          </div>

          <div className="flex flex-row below-md:flex-col tablet:flex-col w-full mt-6 below-md:mt-3 mb-9">
            <div className="flex flex-col w-[65%] below-md:w-[100%] tablet:w-[100%]">
              <div className="bg-white shadow-md rounded-md">
                <div className="flex flex-row justify-between below-md:mx-3 mx-7 mt-6 mb-2">
                  {/* Sales Text */}
                  <div>
                    <p className="text-[#2D3748] text-[16px] font-bold">
                      Sales
                    </p>
                  </div>

                  {/* Dropdown Group */}
                  <div className="flex flex-row gap-5 w-[60%] justify-end">
                    {/* Download Icon */}
                    <div className="mt-2 cursor-pointer below-md:hidden">
                      <img src="/images/download.svg" alt="Download" />
                    </div>

                    {/* Period Dropdown */}
                    <div className="relative below-md:w-full">
                      <Dropdown
                        className="relative below-md:w-full"
                        shadowclassName="shadow-sm"
                        options={options4}
                        selectedOption={selectedOption4}
                        onSelect={handleSelect4}
                        isOpen={isOpen4}
                        toggleOpen={toggleDropdown4}
                        widthchange="below-lg:w-[130px] tablet:w-[130px]"
                      />
                    </div>

                    {/* Year Dropdown */}
                    <div className="relative below-md:w-full">
                      <Dropdown
                        className="relative w-full below-md:w-full"
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
                </div>
                <div className="below-md:mb-2">
                  <BartChart2 />
                </div>
              </div>
              <div className="bg-white shadow-md rounded-md mt-6  below-md:mt-3">
                <div className="flex flex-row justify-between mx-7 below-md:mx-3 mt-6 mb-2">
                  <div>
                    <p className="text-[#2D3748] text-[16px] font-bold">
                      Invoices
                    </p>
                  </div>

                  {/* Dropdown Group */}
                  <div className="flex flex-row gap-5 w-[60%] justify-end">
                    <div className="mt-2 cursor-pointer below-md:hidden">
                      <img src="/images/download.svg" />
                    </div>
                    {/* Period Dropdown */}
                    <div className="relative below-md:w-full">
                      <Dropdown
                        className="relative below-md:w-full"
                        shadowclassName="shadow-sm"
                        options={options6}
                        selectedOption={selectedOption6}
                        onSelect={handleSelect6}
                        isOpen={isOpen6}
                        toggleOpen={toggleDropdown6}
                        widthchange="below-lg:w-[130px] tablet:w-[130px]"
                      />
                    </div>

                    {/* Year Dropdown */}
                    <div className="relative below-md:w-full">
                      <Dropdown
                        className="relative w-full below-md:w-full"
                        shadowclassName="shadow-sm"
                        options={options5}
                        selectedOption={selectedOption5}
                        onSelect={handleSelect5}
                        isOpen={isOpen5}
                        toggleOpen={toggleDropdown5}
                        widthchange="below-lg:w-[130px] tablet:w-[130px]"
                      />
                    </div>
                  </div>
                </div>
                <div className="below-md:mb-2">
                  <BartChart1 />
                </div>
              </div>
            </div>
            <div className="w-[35%] below-md:w-[100%] bg-white ml-6 below-md:ml-0 tablet:ml-0 tablet:mt-6 tablet:w-full below-md:mt-3 shadow-md rounded-md">
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
                  <div className="mb-6 relative below-md:w-[100%] below-md:max-w-[35%]">
                    <Dropdown
                      className="relative below-md:w-full"
                      shadowclassName="shadow-sm"
                      options={options7}
                      selectedOption={selectedOption7}
                      onSelect={handleSelect7}
                      isOpen={isOpen7}
                      toggleOpen={toggleDropdown7}
                      widthchange="below-lg:w-[130px] tablet:w-[130px]"
                    />
                  </div>
                </div>

                {/* Pie Chart Section */}
                <div className="-my-5">
                  <PieChart />
                </div>

                <div>
                  <div className="w-full px-6 below-md:pb-12 tablet:pb-12">
                    <ul>
                      {data.map((item, index) => (
                        <li
                          key={index}
                          className="flex px-[18%] items-center justify-between py-2"
                        >
                          {/* Color Circle */}
                          <div className="flex items-center">
                            <span
                              className="inline-block w-3 h-3 rounded-full mr-3"
                              style={{ backgroundColor: item.color }}
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

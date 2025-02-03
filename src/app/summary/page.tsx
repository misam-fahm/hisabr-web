"use client";
import { FC, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Dropdown from "@/Components/UI/Themes/DropDown";
import { sendApiRequest } from "@/utils/apiUtils";
import { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";

const SummaryGraph = dynamic(
  () => import("@/Components/Charts-Graph/SummaryGraph"),
  {
    ssr: false,
  }
);
const YearlySalesGraph = dynamic(
  () => import("@/Components/Charts-Graph/YearlySalesGraph"),
  {
    ssr: false,
  }
);
const InvoiceGraph = dynamic(
  () => import("@/Components/Charts-Graph/InvoiceGraph"),
  {
    ssr: false,
  }
);
const SalesGraph = dynamic(
  () => import("@/Components/Charts-Graph/salesGraph"),
  {
    ssr: false,
  }
);
const DateRangePicker = dynamic(
  () => import("@/Components/UI/Themes/DateRangePicker"),
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
  const [selectedOption, setSelectedOption] = useState<any>();
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [store, setStore] = useState<any[]>([]);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });
  /**year composed chart*/
  const [selectedYearOption1, setSelectedYearOption1] =
    useState<string>("Year");
  const [isYearOpen1, setIsYearOpen1] = useState<boolean>(false);
  /**sales */
  const [selectedYearOption2, setSelectedYearOption2] =
    useState<string>("Year");
  const [isYearOpen2, setIsYearOpen2] = useState<boolean>(false);
  /**invoices */
  const [selectedYearOption3, setSelectedYearOption3] =
    useState<string>("Year");
  const [isYearOpen3, setIsYearOpen3] = useState<boolean>(false);
  /**yearly sales */
  const [selectedYearOption4, setSelectedYearOption4] =
    useState<string>("Year");
  const [isYearOpen4, setIsYearOpen4] = useState<boolean>(false);
  /**sales ..yearly, quarterly.. */
  const [selectedDurationOption1, setSelectedDurationOption1] =
    useState<string>("Yearly");
  const [isDurationOpen1, setIsDurationOpen1] = useState<boolean>(false);
  /**invoices.. yearly, quarterly.. */
  const [selectedDurationOption2, setSelectedDurationOption2] =
    useState<string>("Yearly");
  const [isDurationOpen2, setIsDurationOpen2] = useState<boolean>(false);

  const Yearoptions = [
    { id: 1, name: "2024" },
    { id: 2, name: "2023" },
    { id: 3, name: "2022" },
    { id: 4, name: "2021" },
  ];
  const DurationOptions = [
    { id: 1, name: "Yearly" },
    { id: 2, name: "Quarterly" },
    { id: 3, name: "Monthly" },
    { id: 4, name: "Weekly" },
  ];

  const toggleYearDropdown = (id: number) => {
    switch (id) {
      case 1:
        setIsYearOpen1(!isYearOpen1);
        break;
      case 2:
        setIsYearOpen2(!isYearOpen2);
        break;
      case 3:
        setIsYearOpen3(!isYearOpen3);
        break;
      case 4:
        setIsYearOpen4(!isYearOpen4);
        break;
      default:
        break;
    }
  };
  const toggleDurationDropdown = (id: number) => {
    switch (id) {
      case 1:
        setIsDurationOpen1(!isDurationOpen1);
        break;
      case 2:
        setIsDurationOpen2(!isDurationOpen2);
        break;
      default:
        break;
    }
  };
  const handleYearSelect = (
    option: { id: number; name: string },
    dropdownId: number
  ) => {
    switch (dropdownId) {
      case 1:
        setSelectedYearOption1(option.name);
        setIsYearOpen1(false);
        break;
      case 2:
        setSelectedYearOption2(option.name);
        setIsYearOpen2(false);
        break;
      case 3:
        setSelectedYearOption3(option.name);
        setIsYearOpen3(false);
        break;
      case 4:
        setSelectedYearOption4(option.name);
        setIsYearOpen4(false);
        break;
      default:
        break;
    }
  };
  const handleDurationSelect = (
    option: { id: number; name: string },
    dropdownId: number
  ) => {
    switch (dropdownId) {
      case 1:
        setSelectedDurationOption1(option.name);
        setIsDurationOpen1(false);
        break;
      case 2:
        setSelectedDurationOption2(option.name);
        setIsDurationOpen2(false);
        break;
      default:
        break;
    }
  };
  const toggleStoreDropdown = () => {
    setIsStoreDropdownOpen((prev) => !prev);
  };
  const handleError = (message: string) => {
    setCustomToast({
      message,
      type: "error",
    });
  };
  const fetchDropdownData = async () => {
    try {
      const response = await sendApiRequest({ mode: "getallstores" });
      if (response?.status === 200) {
        setStore(response?.data?.stores || []);
      } else {
        handleError(response?.message);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };
  useEffect(() => {
    fetchDropdownData();
  }, []);


  return (
    <main
      className="max-h-[calc(100vh-60px)] overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <div>
        <div className="z-[11] pb-6 below-md:pb-4 bg-[#f7f8f9] sticky pt-6 below-md:pt-4 pl-6 pr-6 below-md:px-3">
          <div className="flex flex-row below-md:flex-col below-lg:w-[50%] w-[100%] gap-3">
            {/* First Dropdown */}
            <Dropdown
              options={store}
              selectedOption={selectedOption?.name || "Store"}
              onSelect={(selectedOption: any) => {
                setSelectedOption({
                  name: selectedOption.name,
                  id: selectedOption.id,
                });
                setIsStoreDropdownOpen(false);
              }}
              isOpen={isStoreDropdownOpen}
              toggleOpen={toggleStoreDropdown}
              widthchange="w-full"
            />
            <div className=" w-full">
              <DateRangePicker widthchang="w-full" />
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
                <p className="text-[11px] text-[#388E3C] font-semibold">
                  20%{" "}
                  <span className="text-[#575F6D] font-normal">
                    more than last year
                  </span>
                </p>
              </div>
              <div className="bg-[#EFF6EFA1] rounded-full w-[40px] h-[40px] flex items-center justify-center">
                <img src="./images/summarytotalsales.svg" />
              </div>
            </div>
            <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#E5D5D5] border-b-4 w-full p-4 justify-between items-stretch">
              <div>
                <p className="text-[14px] text-[#575F6DCC] font-medium">
                  Total Expenses
                </p>
                <p className="text-[16px] text-[#2D3748] font-bold">$861,148</p>
                <p className="text-[11px] text-[#388E3C] font-semibold">
                  12%{" "}
                  <span className="text-[#575F6D] font-normal">
                    more than last year
                  </span>
                </p>
              </div>
              <div className="bg-[#F6F1F1] rounded-full w-[40px] h-[40px] flex items-center justify-center">
                <img src="./images/summarytotalexpenses.svg" />
              </div>
            </div>

            <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#C2D1C3] border-b-4 w-full p-4 justify-between items-stretch">
              <div>
                <p className="text-[14px] text-[#575F6DCC] font-medium">
                  Total Profits
                </p>
                <p className="text-[16px] text-[#2D3748] font-bold">$161,358</p>
                <p className="text-[11px] text-[#388E3C] font-semibold">
                  40%{" "}
                  <span className="text-[#575F6D] font-normal">
                    increase compare to last year
                  </span>
                </p>
              </div>
              <div className="bg-[#EFF6EFA1] rounded-full w-[40px] h-[40px] flex items-center justify-center">
                <img src="./images/summarytotalprofits.svg" />
              </div>
            </div>
          </div>

          <div className="bg-white mt-6 below-md:mt-3 shadow-md py-4 rounded-md ">
            <div className="flex flex-row justify-end mx-7 below-md:mx-3 gap-5">
              <div className="mt-2 cursor-pointer below-md:hidden">
                <img src="/images/download.svg" />
              </div>
              <div className="mb-6 relative below-md:w-full below-md:max-w-[40%]  rounded ">
                <Dropdown
                  options={Yearoptions}
                  shadowclassName="shadow-none border border-gray-200"
                  selectedOption={selectedYearOption1}
                  onSelect={(option) => handleYearSelect(option, 1)}
                  isOpen={isYearOpen1}
                  toggleOpen={() => toggleYearDropdown(1)}
                  className="below-md:w-full"
                  widthchange="below-lg:w-[130px] tablet:w-[130px]"
                />
              </div>
            </div>
            <SummaryGraph />
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
                    <div className="relative below-md:w-full rounded">
                      <Dropdown
                        className="relative below-md:w-full"
                        shadowclassName="shadow-none border border-gray-200"
                        options={DurationOptions}
                        selectedOption={selectedDurationOption1}
                        onSelect={(option) => handleDurationSelect(option, 1)}
                        isOpen={isDurationOpen1}
                        toggleOpen={() => toggleDurationDropdown(1)}
                        widthchange="below-lg:w-[130px] tablet:w-[130px]"
                      />
                    </div>

                    {/* Year Dropdown */}
                    <div className="relative below-md:w-full rounded">
                      <Dropdown
                        className="relative w-full below-md:w-full"
                        shadowclassName="shadow-none border border-gray-200"
                        options={Yearoptions}
                        selectedOption={selectedYearOption2}
                        onSelect={(option) => handleYearSelect(option, 2)}
                        isOpen={isYearOpen2}
                        toggleOpen={() => toggleYearDropdown(2)}
                        widthchange="below-lg:w-[130px] tablet:w-[130px]"
                      />
                    </div>
                  </div>
                </div>
                <div className="below-md:mb-2">
                  <SalesGraph />
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
                    <div className="relative below-md:w-full rounded">
                      <Dropdown
                        className="relative below-md:w-full"
                        shadowclassName="shadow-none border border-gray-200"
                        options={DurationOptions}
                        selectedOption={selectedDurationOption2}
                        onSelect={(option) => handleDurationSelect(option, 2)}
                        isOpen={isDurationOpen2}
                        toggleOpen={() => toggleDurationDropdown(2)}
                        widthchange="below-lg:w-[130px] tablet:w-[130px]"
                      />
                    </div>
                    {/* Year Dropdown */}
                    <div className="relative below-md:w-full rounded">
                      <Dropdown
                        className="relative w-full below-md:w-full"
                        shadowclassName="shadow-none border border-gray-200"
                        options={Yearoptions}
                        selectedOption={selectedYearOption3}
                        onSelect={(option) => handleYearSelect(option, 3)}
                        isOpen={isYearOpen3}
                        toggleOpen={() => toggleYearDropdown(3)}
                        widthchange="below-lg:w-[130px] tablet:w-[130px]"
                      />
                    </div>
                  </div>
                </div>
                <div className="below-md:mb-2">
                  <InvoiceGraph />
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
                        src="/images/direction.svg"
                        alt="Growth Icon"
                        className="w-4 h-4"
                      />
                      <p className="text-[rgba(55, 96, 102, 0.8)] text-[12px]">
                        11.2%
                      </p>
                    </div>
                  </div>

                  {/* Dropdown */}
                  <div className="mb-6 relative z-[40] below-md:w-[100%] below-md:max-w-[35%]">
                    <Dropdown
                      className="relative below-md:w-full rounded"
                      shadowclassName="shadow-none border border-gray-200"
                      options={Yearoptions}
                      selectedOption={selectedYearOption4}
                      onSelect={(option) => handleYearSelect(option, 4)}
                      isOpen={isYearOpen4}
                      toggleOpen={() => toggleYearDropdown(4)}
                      widthchange="below-lg:w-[130px] tablet:w-[130px]"
                    />
                  </div>
                </div>

                {/* Pie Chart Section */}
                <div className="-my-5">
                  <YearlySalesGraph />
                </div>

                <div>
                  <div className="w-full px-6 below-md:pb-12 tablet:pb-12">
                    <ul>
                      {data.map((item, index) => (
                        <li
                          key={index}
                          className="flex px-[15%] items-center justify-between py-2"
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

"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import "../globals.css";
import BarChart4 from "@/Components/Charts-Graph/BarChart4";
import PieChart3 from "@/Components/Charts-Graph/Piechart3";
import { useRouter } from "next/navigation";
import Dropdown from "@/Components/UI/Themes/DropDown";
import Images from "@/Components/UI/Themes/Image";
import { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";
import { sendApiRequest } from "@/utils/apiUtils";

const dat = [
  { label: "New Customers", value: 10836, per: "2%", color: "#376066CC" },
  { label: "Returning Customers", value: 326460, per: "10%", color: "#DEC560" },
];

const DetailsPage: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<any>();
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [store, setStore] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });
  /**go back button */
  const router = useRouter();
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  /**main dropdown */
  const [selectedYearOption1, setSelectedYearOption1] =
    useState<string>("2021");
  const [isYearOpen1, setIsYearOpen1] = useState<boolean>(false);

  /**Customer Count */
  const [selectedYearOption2, setSelectedYearOption2] =
    useState<string>("2021");
  const [isYearOpen2, setIsYearOpen2] = useState<boolean>(false);

  const Yearoptions = [
    { id: 1, name: "2024" },
    { id: 2, name: "2023" },
    { id: 3, name: "2022" },
    { id: 4, name: "2021" },
  ];

  const toggleYearDropdown = (id: number) => {
    switch (id) {
      case 1:
        setIsYearOpen1(!isYearOpen1);
        break;
      case 2:
        setIsYearOpen2(!isYearOpen2);
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
      const response = await sendApiRequest({ mode: "getAllStores" });
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
      <img
        onClick={handleBack}
        src="/images/mobilebackicon.svg"
        className="fixed top-4 left-4 z-30 below-lg:hidden tablet:hidden"
      />
      {/* <div className="below-md:flex below-md:justify-center ">
        <p className="text-[18px] below-md:text-[16px] below-md:mr-8 font-bold text-defaultblack fixed top-0 z-30 mt-5 below-md:pl-0 below-md:pr-0 pl-6 pr-6">
          Customer Count Analysis
        </p>
      </div> */}
      <div className="pt-4 pb-6 below-md:pb-4 below-md:pt-4 sticky z-10  bg-[#f7f8f9] pl-6 pr-6 below-md:px-3">
        <div>
          <img
            onClick={handleBack}
            alt="Back Arrow"
            className="w-7 h-7 mb-3 below-md:hidden cursor-pointer"
            src="/images/webbackicon.svg"
          ></img>
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row below-md:flex-col gap-3 w-full">
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
            />

            {/* Second Dropdown */}

            <Dropdown
              options={Yearoptions}
              selectedOption={selectedYearOption1}
              onSelect={(option) => handleYearSelect(option, 1)}
              isOpen={isYearOpen1}
              toggleOpen={() => toggleYearDropdown(1)}
            />
          </div>
        </div>
        <div />
      </div>

      <div className=" pl-6 pr-6 below-md:px-3">
        <div className="grid grid-cols-4 below-md:grid-cols-1 tablet:grid-cols-2 w-full h-full gap-6 below-md:gap-3  items-stretch">
          <div className="flex flex-row bg-[#FFFFFF] rounded-lg shadow-sm border-[#C2D1C3] border-b-4 w-full items-stretch p-4 justify-between">
            <div>
              <p className="text-[14px] text-[#575F6DCC] font-medium">
                Total Customer Count
              </p>
              <p className="text-[16px] text-[#2D3748] font-bold">50,000</p>
              <p className="text-[11px] text-[#388E3C] font-semibold">
                20%{" "}
                <span className="text-[#575F6D] font-normal">
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
              <p className="text-[16px] text-[#2D3748] font-bold">33,000</p>
              <p className="text-[11px] text-[#388E3C] font-semibold">
                13%{" "}
                <span className="text-[#575F6D] font-normal">
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
              <p className="text-[16px] text-[#2D3748] font-bold">12,000</p>
              <p className="text-[11px] text-[#388E3C] font-semibold">
                35%{" "}
                <span className="text-[#575F6D] font-normal">
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
              <p className="text-[16px] text-[#2D3748] font-bold">52% </p>
              <p className="text-[11px] text-[#388E3C] font-semibold">
                <span className="text-[#575F6D] font-normal">
                  of target met
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-row w-full mt-6 mb-9 below-md:flex-col below-md:mt-3">
          <div className=" w-[70%] tablet:w-[60%] below-md:w-full">
            <div className="bg-white shadow-md rounded-md">
              <div className="flex flex-row justify-between mx-6 pt-5  mb-5">
                <div>
                  <p className="text-[#393E47] text-[16px] font-bold mb-3">
                    Customer Count
                  </p>
                </div>

                <div className="relative below-md:w-[35%]">
                  <Dropdown
                    className="relative below-md:w-full"
                    shadowclassName="shadow-none border border-gray-200"
                    options={Yearoptions}
                    selectedOption={selectedYearOption2}
                    onSelect={(option) => handleYearSelect(option, 2)}
                    toggleOpen={() => toggleYearDropdown(2)}
                    isOpen={isYearOpen2}
                    widthchange="below-lg:w-[130px]"
                  />
                </div>
              </div>
              <div className="pb-2">
                <BarChart4 selectedYear={Number(selectedYearOption2)} />
              </div>
            </div>
          </div>
          <div className="w-[30%] tablet:w-[40%] bg-white ml-6 shadow-md rounded-md below-md:w-full below-md:ml-0 below-md:mt-3 below-md:pb-9">
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

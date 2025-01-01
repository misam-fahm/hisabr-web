"use client";
import SalesDetails from "../components/sales_details/page";
import Tenders from "../components/tenders/page";
import Revenue from "../components/revenue-center/page";
import Taxes from "../components/taxes/page";
import Discounts from "../components/discounts/page";
import Destinations from "../components/destinations/page";
import Promotions from "../components/promotions/page";
import CashSkims from "../components/cash-skims/page";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

// Define the tabs and their corresponding content
const tabContent: Record<string, JSX.Element> = {
  "Sales Details": (
    <div>
      <SalesDetails />
    </div>
  ),
  Tenders: (
    <div>
      <Tenders />
    </div>
  ),
  "Revenue Center": (
    <div>
      <Revenue />
    </div>
  ),
  Taxes: (
    <div>
      <Taxes />
    </div>
  ),
  Discounts: (
    <div>
      <Discounts />
    </div>
  ),
  Destinations: (
    <div>
      <Destinations />
    </div>
  ),
  Promotions: (
    <div>
      <Promotions />
    </div>
  ),
  "Cash Skims": (
    <div>
      <CashSkims />
    </div>
  ),
};

const DetailsPage: React.FC = () => {
  const [activeTab, setActiveTab] =
    useState<keyof typeof tabContent>("Sales Details");

  const tabs = Object.keys(tabContent) as Array<keyof typeof tabContent>;

  const handleTabClick = (tab: keyof typeof tabContent) => {
    setActiveTab(tab); // Set the active tab
  };

  const router = useRouter();

  const handleBack = () => {
    router.push("/sales");
  };

  //mobile scroll
  const scrollTabs = (direction: "left" | "right") => {
    const container = document.getElementById("tabContainer");

    if (container) {
      // This check ensures container is not null
      const scrollAmount = 150; // Adjust as needed
      if (direction === "left") {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    } else {
      console.error('Element with id "tabContainer" not found.');
    }
  };

  return (
    <main
      className="max-h-[calc(100vh-80px)] tablet:max-h-[calc(100vh-10px)] overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      <img
        onClick={handleBack}
        src="/images/MobileBackIcon.svg"
        className="fixed top-4 left-4 z-30 below-lg:hidden tablet:hidden"
      />
      {/* <div className="below-md:flex below-md:justify-center ">
        <p className="text-[18px] font-bold text-defaultblack fixed top-0 z-30 mt-5 below-md:pl-0 below-md:pr-0 pl-6 pr-6">
          Sales Details
        </p>
      </div> */}

       {/* Back Button */}
       <div className="below-md:hidden py-3 px-6 ">
          <img src="/images/WebBackIcon.svg"  className=" cursor-pointer"  onClick={handleBack}/>
          </div>

      {/* Tabs Navigation */}
      <div className=" pb-6 bg-[#f7f8f9] pl-6 pr-6 below-md:px-4">
        <div className="flex flex-row justify-between items-center gap-6 tablet:pr-32">
          {/* Tab Buttons with Arrows */}
          <div className="below-md:w-full tablet:w-full border-b-[2px] border-[#E1E0E0D1] relative flex items-center">
            {/* Left Arrow  */}
            <img
              onClick={() => scrollTabs("left")}
              className={`below-md:block tablet:block hidden ${activeTab === tabs[0] ? " " : "px-2"} text-[#334155] text-xl ${activeTab === tabs[0] ? "opacity-0 pointer-events-none" : ""}`}
              src="/images/leftArrow.svg"
            />

            {/* Scrollable Tabs */}
            <div
              id="tabContainer"
              className="flex-1  flex below-md:overflow-x-auto below-md:scrollbar-none tablet:overflow-x-auto space-x-8 px-0 below-md:space-x-6 tablet:space-x-6 whitespace-nowrap scroll-smooth"
            >
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`relative py-2 px-[1px] outline-none font-medium ${
                    activeTab === tab
                      ? "text-[#334155] text-[14px] after:content-[''] after:absolute after:w-full after:h-[2px] below-md:after:h-[3px] tablet:after:h-[3px] after:bg-[#334155] after:bottom-[-2px] after:left-0 after:rounded-full"
                      : "text-[#334155B2] text-[14px] hover:text-[#334155]"
                  }`}
                  style={{
                    borderBottom:
                      activeTab === tab ? "none" : "2px solid transparent",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Right Arrow */}
            <img
              onClick={() => scrollTabs("right")}
              className={`below-md:block tablet:block hidden px-2 text-[#334155] text-xl ${activeTab === tabs[tabs.length - 1] ? "opacity-0 pointer-events-none" : ""}`}
              src="/images/rightArrow.svg"
            />
          </div>

         
        </div>
      </div>

      <div className="px-6 below-md:px-4 ">{tabContent[activeTab]}</div>
    </main>
  );
};

export default DetailsPage;

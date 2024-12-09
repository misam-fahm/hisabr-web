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
  return (
    <main
      className="max-h-[calc(100vh-70px)] overflow-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      {/* Top Navigation Bar */}
      <div>
        <p className="text-[18px] font-bold text-defaultblack fixed top-0 z-30 mt-5 pl-6 pr-6">
          Sales Details
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="pt-20 pb-6 bg-[#f7f8f9] pl-6 pr-6">
        <div className="flex flex-row justify-between items-center gap-6">
          {/* Tab Buttons */}
          <div className="w-full border-b-[2px] border-[#E1E0E0D1]">
            <nav className="flex justify-start space-x-8 px-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`py-2 outline-none font-medium ${
                    activeTab === tab
                      ? "text-[#334155] border-b-2 border-[#334155] text-[14px]"
                      : "text-[#334155B2] text-[14px] hover:text-[#334155]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Back Button */}
          <div>
            <p
              onClick={handleBack}
              className="cursor-pointer text-[14px] text-[#6F6F6F] bg-[#C8C8C87A] w-[104px] h-[37px] rounded-md flex items-center justify-center"
            >
              Back
            </p>
          </div>
        </div>
      </div>

      <div className="px-6">{tabContent[activeTab]}</div>
    </main>
  );
};

export default DetailsPage;

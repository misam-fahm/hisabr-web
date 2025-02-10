"use client";
import SalesDetails from "../components/sales_details/page";
import Tenders from "../components/tenders/page";
import Revenue from "../components/revenue-center/page";
import Taxes from "../components/taxes/page";
import Discounts from "../components/discounts/page";
import Destinations from "../components/destinations/page";
import Promotions from "../components/promotions/page";
import CashSkims from "../components/cash-skims/page";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";



const DetailsPage: React.FC = () => {

  const { salesid }: any = useParams(); // Extract the encoded ID from the URL
  const decodedSalesId = atob(salesid);

  const tabContent: Record<any, JSX.Element> = {
    "Sales Details": <SalesDetails SalesId={decodedSalesId} />,
    Tenders: <Tenders SalesId={decodedSalesId} />,
    // "Revenue Center": <Revenue />,
    // Taxes: <Taxes />,
    // Discounts: <Discounts />,
    // Destinations: <Destinations />,
    // Promotions: <Promotions />,
    // "Cash Skims": <CashSkims />,
  };

  const [activeTab, setActiveTab] =
    useState<keyof typeof tabContent>("Sales Details");
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const router = useRouter();

  const tabs = Object.keys(tabContent) as Array<keyof typeof tabContent>;

  useEffect(() => {
    const container = document.getElementById("tabContainer");

    const handleScroll = () => {
      if (container) {
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        setShowLeftArrow(container.scrollLeft > 0);
        setShowRightArrow(container.scrollLeft < maxScrollLeft - 1);
      }
    };

    if (container) {
      handleScroll();
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleTabClick = (tab: keyof typeof tabContent) => {
    setActiveTab(tab);
  };

  const handleBack = () => {
    router.push("/sales");
  };

  const scrollTabs = (direction: "left" | "right") => {
    const container = document.getElementById("tabContainer");

    if (container) {
      const scrollAmount = 150;

      if (direction === "left") {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else if (direction === "right") {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  return (
    <main className="max-h-[calc(100vh-80px)] tablet:max-h-[calc(100vh-10px)] overflow-auto">
      <img
        onClick={handleBack}
        src="/images/mobilebackicon.svg"
        className="fixed top-4 left-4 z-30 below-lg:hidden tablet:hidden"
      />

      <div className="py-3 pb-6 bg-[#f7f8f9] pl-6 pr-6 below-md:px-4">
        <div className="flex items-center gap-4">
          <img
            onClick={handleBack}
            alt="Back Arrow"
            className="w-7 h-7 below-md:hidden cursor-pointer"
            src="/images/webbackicon.svg"
          ></img>
          <div className="flex flex-row justify-between items-center gap-6">
            <div className="below-md:w-full tablet:w-full border-b-[2px] border-[#E1E0E0D1] relative flex items-center">
              {/* Left Arrow */}
              {showLeftArrow && (
                <img
                  onClick={() => scrollTabs("left")}
                  className="below-md:block tablet:block hidden px-2 text-[#334155] text-xl"
                  src="/images/leftarrow.svg"
                />
              )}

              {/* Scrollable Tabs */}
              <div
                id="tabContainer"
                className="flex-1 flex scrollable-container
             below-md:overflow-y-hidden  tablet:overflow-y-hidden space-x-8 
             px-0 below-md:space-x-6 tablet:space-x-6 whitespace-nowrap scroll-smooth"
              >
                {tabs.map((tab, index) => (
                  <button
                    key={tab}
                    onClick={() => handleTabClick(tab)}
                    className={`relative py-2 px-[1px] outline-none font-medium ${activeTab === tab
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
              {showRightArrow && (
                <img
                  onClick={() => scrollTabs("right")}
                  className="below-md:block tablet:block hidden px-2 cursor-pointer"
                  src="/images/rightarrow.svg"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 below-md:px-4">{tabContent[activeTab]}</div>
    </main>
  );
};

export default DetailsPage;

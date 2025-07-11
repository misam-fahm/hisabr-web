"use client";

import NoDataFound from "@/Components/UI/NoDataFound/NoDataFound";
import { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";
import { sendApiRequest } from "@/utils/apiUtils";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface TableData {
  category: string;
  rows: { description: string; value: any }[];
}


const TableComponent: React.FC<any> = ({SalesId}:any) => {

  const [saleDetails, setDataApi] = useState<any>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });

  
const data: TableData[] = [
  {
    category: "General Information",
    rows: [
      { description: "Date", value: saleDetails?.sales_date},
      { description: "Store", value: saleDetails?.store_name},
    ],
  },  
  {
    category: "Sales Data",
    rows: [
      { description: "Gross", value: "$" + saleDetails?.gross_sales_amt },
      { description: "Net", value: saleDetails?.net_sales_amt ? "$" + saleDetails?.net_sales_amt : "$0"},
      { description: "Order Count", value: saleDetails?.orders_count },
      { description: "Guest Count", value: saleDetails?.guests_count },
      { description: "Total Sales Count", value:saleDetails?.total_sales_count ? saleDetails?.total_sales_count : "--" },
      { description: "Average", value:"$" + saleDetails?.order_average_amt},
    ],
  },
  {
    category: "Item Sales",
    rows: [
      { description: "Total Item Sales", value: "$" + (saleDetails?.total_item_sales_amt === null ? "0" :saleDetails?.total_item_sales_amt )  },
      { description: "Taxable Item Sales", value: "$" +  (saleDetails?.total_item_sales_amt === null ? "0" :saleDetails?.taxable_item_sales_amt )},
      { description: "Non-Taxable Item Sales", value: "$" + saleDetails?.non_taxable_item_sales_amt },
    ],
  },
  {
    category: "Tips",
    rows: [{ description: "Cash Tips Received", value: "$" + saleDetails?.cash_tips_received_amt }],
  },
  {
    category: "Taxes",
    rows: [{ description: "Tax", value: "$" + saleDetails?.tax_amt }],
  },
  {
    category: "Deposits",
    rows: [
      { description: "Deposits Accepted Amount", value: "$" + saleDetails?.deposits_accepted_amt },
      { description: "Deposits Redeemed Amount", value: "$" + saleDetails?.deposits_redeemed_amt },
      { description: "Cash Deposits Accepted", value: "$" + saleDetails?.cash_deposits_accepted_amt },
      { description: "Deposits Redeemed", value: "$" + saleDetails?.deposits_redeemed_amt },
    ],
  },
  {
    category: "Labor Costs",
    rows: [
      { description: "Labour Cost", value: "$" + saleDetails?.labor_cost_amt},
      { description: "Labour Hours", value:  saleDetails?.labor_hours },
      { description: "Labor Percent", value: saleDetails?.labor_percent + "%"  },
      { description: "Sales Per Labor Hour", value: "$" + saleDetails?.sales_per_labor_hour_amt },
    ],
  },
  {
    category: "Payments",
    rows: [
      { description: "Paid In", value: "$" + saleDetails?.paid_in_amt },
      { description: "Paid Out", value: "$" + saleDetails?.paid_out_amt },
    ],
  },
  {
    category: "Discounts & Promotions",
    rows: [
      { description: "Discounts", value: saleDetails?.discounts_amt ? "$" + saleDetails?.discounts_amt : "--" },
      { description: "Promotions", value:saleDetails?.promotions_amt ? "$" +  saleDetails?.promotions_amt : "--" },
      { description: "Gift Card Promotions", value: saleDetails?.gift_card_promotions_amt ? "$" + saleDetails?.gift_card_promotions_amt : "--" },
    ],
  },
  {
    category: "Refunds",
    rows: [
      { description: "Refunds",value:saleDetails?.refunds_amt ? "$" +  saleDetails?.refunds_amt : "--" } ,
      { description: "Voids",value: saleDetails?.voids_amt ? "$" + saleDetails?.voids_amt : "--" } ,
    ],
  },
  {
    category: "Gift Card Details",
    rows: [
      { description: "Gift Card Issue Count", value: saleDetails?.gift_card_issue_count ? saleDetails?.gift_card_issue_count : "--" },
      { description: "Gift Card Issue Amount", value: saleDetails?.gift_card_issue_amt ?"$" + saleDetails?.gift_card_issue_amt : "$0" },
      { description: "Gift Card Reload Count", value: saleDetails?.gift_card_reload_count ? saleDetails?.gift_card_reload_count : "--" },
      { description: "Gift Card Reload Amount", value: saleDetails?.gift_card_reload_amt ? "$" + saleDetails?.gift_card_reload_amt : "$0" },
      { description: "Gift Card Cash Out Count", value: saleDetails?.gift_card_cash_out_count ? saleDetails?.gift_card_cash_out_count :"--" },
      { description: "Gift Card Cash Out Amount", value: saleDetails?.gift_card_cash_out_amt ? "$" + saleDetails?.gift_card_cash_out_amt : "$0" },
    ],
  },
  {
    category: "Non-Revenue Items",
    rows: [{ description: "Non-Revenue Items", value: "$"+ saleDetails?.non_revenue_items_amt == null  ? 0 :  saleDetails?.non_revenue_items_amt  }],
  },
  {
    category: "Cash Details",
    rows: [{ description: "Total Cash", value:  saleDetails?.total_cash_amt ? "$" + saleDetails?.total_cash_amt : "0" }],
  },
  {
    category: "Donations",
    rows: [
      { description: "Donation Count", value: saleDetails?.donation_count },
      { description: "Donation Total",  value: "$" + saleDetails?.donation_total_amt},
    ],
  },
];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {


        const response: any = await sendApiRequest({
          mode: "getSalesDetails",
          salesid: Number(SalesId)
        });

        if (response?.status === 200) {
          setDataApi(response?.data?.sales[0] || []);
          // response?.data?.total > 0 &&
          //   setTotalItems(response?.data?.total || 0);
        } else {
          setCustomToast({
            ...customToast,
            message: response?.message,
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);




  return (
    <main>
      {/* Web view table (remains unchanged) */}
      <div className="below-md:hidden overflow-x-auto rounded-lg shadow-sm border border-[#E4E4EF]">
        <div
          className="overflow-y-auto scrollbar-hide"
          style={{ maxHeight: "calc(100vh - 192px)" }}
        >
          <table className="min-w-full bg-white table-fixed">
            <thead className="bg-[#334155] text-white sticky top-0 z-[2]">
              <tr>
                <th className="px-4 py-2 text-left text-[15px] font-normal">
                  Category
                </th>
                <th className="px-4 py-2 text-left text-[15px] font-normal">
                  Description
                </th>
                <th className="px-4 py-2 text-right text-[15px] font-normal">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, sectionIndex) => (
                  <React.Fragment key={sectionIndex}>
                    {Array.from({ length: 3 }).map((_, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className={`${rowIndex === 0 ? "bg-[#F8F9FCFA]" : ""}`}
                      >
                        <td className="px-4 py-1.5">
                          {rowIndex === 0 ? (
                            <Skeleton width={100} height={20} />
                          ) : (
                            ""
                          )}
                        </td>
                        <td className="px-4 py-1.5">
                          <Skeleton width={150} height={20} />
                        </td>
                        <td className="px-4 py-1.5 text-right">
                          <Skeleton width={80} height={20} />
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center">
                    <NoDataFound />
                  </td>
                </tr>
              ) : (
                data.map((section, index) => (
                  <React.Fragment key={index}>
                    {section.rows.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className={`${rowIndex === 0 ? "bg-[#F8F9FCFA]" : ""}`}
                      >
                        <td className="px-4 py-1.5 text-left text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
                          {rowIndex === 0 ? section.category : ""}
                        </td>
                        <td className="px-4 py-1.5 text-left text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
                          {row.description}
                        </td>
                        <td className="px-4 py-1.5 text-right text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile view with dynamic data */}
      <div className="below-lg:hidden tablet:hidden">
        <div className="flex flex-col">
          {loading ? (
            // Skeleton for mobile view
            Array.from({ length: 3 }).map((_, sectionIndex) => (
              <div
                key={sectionIndex}
                className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3"
              >
                <div className="items-center mb-4 mt-2 px-2">
                  <div className="flex justify-between pb-2 w-[100%] border-b border-[#E4E4EF]">
                    <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                      <Skeleton width={100} height={20} />
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mb-2 px-2">
                  {Array.from({ length: 5 }).map((_, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="flex justify-between text-sm"
                    >
                      <Skeleton width={120} height={16} />
                      <Skeleton width={80} height={16} />
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : data.length === 0 ? (
            // No data found
            <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
              <NoDataFound />
            </div>
          ) : (
            // Dynamic data rendering
            data.map((section, index) => (
              <div
                key={index}
                className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3"
              >
                <div className="items-center mb-4 mt-2 px-2">
                  <div className="flex justify-between pb-2 w-[100%] border-b border-[#E4E4EF]">
                    <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                      <span>{section.category}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mb-2 px-2">
                  {section.rows.map((row, rowIndex) => (
                    <div
                      key={rowIndex}
                      className="flex justify-between text-sm"
                    >
                      <p className="text-[#808080] text-[14px]">
                        {row.description}
                      </p>
                      <p className="text-[#1A1A1A] text-[12px]">
                        {row.value || "--"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default TableComponent;

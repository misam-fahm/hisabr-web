"use client";

import NoDataFound from "@/Components/UI/NoDataFound/NoDataFound";
import { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";
import { sendApiRequest } from "@/utils/apiUtils";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const paymentData = [
  {
    name: "American Express",
    quantity: 10,
    total: "$223.27",
    percent: "5.99%",
  },
  {
    name: "Cash",
    quantity: 75,
    total: "$772.21",
    percent: "20.71%",
  },
  {
    name: "Delivery Doordash Integrated",
    quantity: 6,
    total: "$112.36",
    percent: "3.01%",
  },
  {
    name: "Discover",
    quantity: 4,
    total: "$49.63",
    percent: "1.33%",
  },
  {
    name: "Gift Card",
    quantity: 26,
    total: "$209.31",
    percent: "5.61%",
  },
  {
    name: "Master Card",
    quantity: 37,
    total: "$510.31",
    percent: "13.6%",
  },
];

const PaymentTable: React.FC<any> = ( {SalesId}:any) => {

  const [data, setDataApi] = useState<any>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {


        const response: any = await sendApiRequest({
          mode: "getRevenueCenterBySalesid",
          salesid: Number(SalesId)
        });

        if (response?.status === 200) {
          setDataApi(response?.data?.revenuecenter || []);
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
      <div className="overflow-x-auto below-md:hidden rounded-lg shadow-sm border border-[#E4E4EF]">
        <table className="min-w-full">
          <thead className="bg-[#334155] text-white">
            <tr className="text-[15px] font-medium">
              <th className="px-4 py-2 text-left font-normal">Name</th>
              <th className="px-4 py-2 text-right font-normal">Quantity</th>
              <th className="px-4 py-2 text-right font-normal">Total</th>
              <th className="px-4 py-2 text-right font-normal">Percent</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <tr
                  key={index}
                  className={index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"}
                >
                  {Array.from({ length: 4 }).map((_, colIndex) => (
                    <td key={colIndex} className="px-4 py-1.5">
                      <Skeleton height={30} />
                    </td>
                  ))}
                </tr>
              ))
            ) : data?.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center">
                  <NoDataFound />
                </td>
              </tr>
            ) : (
              data?.map((row: any, index: any) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-[#F8F9FB]" : "bg-white"}`}
                >
                  <td className="px-4 py-1.5 text-left text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
                    {row.name}
                  </td>
                  <td className="px-5 py-1.5 text-right text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
                    {row.quantity}
                  </td>
                  <td className="px-4 py-1.5 text-right text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
                    {row.total}
                  </td>
                  <td className="px-4 py-1.5 text-right text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
                    {row.percent}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
                  {Array.from({ length: 3 }).map((_, rowIndex) => (
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
          ) : data?.length === 0 ? (
            // No data found
            <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
              <NoDataFound />
            </div>
          ) : (
            // Dynamic data rendering
            data.map((row: any, index: any) => (
              <div
                key={index}
                className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3"
              >
                <div className="items-center mb-4 mt-2 px-2">
                  <div className="flex justify-between pb-2 w-[100%] border-b border-[#E4E4EF]">
                    <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                      <span>{row.name || "Unknown Revenue Center"}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mb-2 px-2">
                  <div className="flex justify-between text-sm">
                    <p className="text-[#808080] text-[14px]">Quantity</p>
                    <p className="text-[#1A1A1A] text-[12px]">
                      {row.quantity || "--"}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-[#808080] text-[14px]">Total</p>
                    <p className="text-[#1A1A1A] text-[12px]">
                      {row.total || "--"}
                    </p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-[#808080] text-[14px]">Percent</p>
                    <p className="text-[#1A1A1A] text-[12px]">
                      {row.percent || "--"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default PaymentTable;

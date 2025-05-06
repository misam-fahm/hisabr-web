"use client";

import NoDataFound from "@/Components/UI/NoDataFound/NoDataFound";
import { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";
import { sendApiRequest } from "@/utils/apiUtils";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";



const PaymentTable: React.FC<any> = ( {SalesId} : any) => {

  const [SaleTender, setDataApi] = useState<any>([]);
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
          mode: "getTendersBySalesid",
          salesid: Number(SalesId)
        });

        if (response?.status === 200) {
          setDataApi(response?.data?.tenders || []);
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
      <div className="overflow-x-auto rounded-lg mb-16 shadow-sm border border-[#E4E4EF] below-md:hidden">
        <table className="min-w-full below-md:hidden">
          <thead className="bg-[#334155] text-white">
            <tr className=" text-[15px] font-medium">
              <th className="px-4 py-2 text-left font-normal">Name</th>
              <th className="px-4 py-2 text-right font-normal">Quantity</th>
              <th className="px-4 py-2 text-right font-normal">Payment</th>
              <th className="px-4 py-2 text-right font-normal">Tips</th>
              <th className="px-4 py-2 text-right font-normal">Total</th>
              <th className="px-4 py-2 text-right font-normal">Percent</th>
            </tr>
          </thead>
          <tbody>
  {loading ? (
    Array.from({ length: 8 }).map((_, index) => (
      <tr key={index} className={index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"}>
        {/* Ensure skeleton cells match the number of columns */}
        {SaleTender?.length > 0 ? (
          SaleTender.map((_, colIndex) => (
            <td key={colIndex} className="px-4 py-1.5">
              <Skeleton height={30} />
            </td>
          ))
        ) : (
          /* If SaleTender is empty, assume default columns */
          Array.from({ length: 6 }).map((_, colIndex) => (
            <td key={colIndex} className="px-4 py-1.5">
              <Skeleton height={30} />
            </td>
          ))
        )}
      </tr>
    ))
  ) : SaleTender?.length === 0 ? (
    <tr>
      <td colSpan={6} className="py-6 text-center">
        <NoDataFound />
      </td>
    </tr>
  ) : (
    SaleTender.map((row, index) => (
      <tr key={index} className={index % 2 === 0 ? "bg-[#F8F9FB]" : "bg-white"}>
        <td className="px-4 py-1.5 text-left text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
          {row.tendername}
        </td>
        <td className="px-5 py-1.5 text-right text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
          {row.quantity}
        </td>
        <td className="px-4 py-1.5 text-right text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
          ${row.payments}
        </td>
        <td className="px-4 py-1.5 text-right text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
          ${row.tips}
        </td>
        <td className="px-4 py-1.5 text-right text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
          ${row.total}
        </td>
        <td className="px-4 py-1.5 text-right text-[#636363] text-[14px] whitespace-nowrap overflow-x-auto custom-scrollbar">
          {row.percent}%
        </td>
      </tr>
    ))
  )}
</tbody>

        </table>
      </div>

      <div className="below-lg:hidden tablet:hidden">
        <div className="flex flex-col">
          <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
            <div className=" items-center mb-4 mt-2 px-2">
              <div className="flex justify-between pb-2 w-[100%] border-b border-[#E4E4EF]">
                <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                  <span>American Express</span>
                </div>
              </div>
            </div>
            <div className="space-y-3 mb-2 px-2">
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">American Express</p>
                <p className="text-[#1A1A1A] text-[12px]"> 10</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Payment</p>
                <p className="text-[#1A1A1A] text-[12px]">$3201</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Tips</p>
                <p className="text-[#1A1A1A] text-[12px]">$0</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Total</p>
                <p className="text-[#1A1A1A] text-[12px]">$3201</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Percent</p>
                <p className="text-[#1A1A1A] text-[12px]">10%</p>
              </div>
            </div>
          </div>

          <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
            <div className=" items-center mb-4 mt-2 px-2">
              <div className="flex justify-between pb-2 w-[100%] border-b border-[#E4E4EF]">
                <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                  <span>American Express</span>
                </div>
              </div>
            </div>
            <div className="space-y-3 mb-2 px-2">
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">American Express</p>
                <p className="text-[#1A1A1A] text-[12px]"> 10</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Payment</p>
                <p className="text-[#1A1A1A] text-[12px]">$3201</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Tips</p>
                <p className="text-[#1A1A1A] text-[12px]">$0</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Total</p>
                <p className="text-[#1A1A1A] text-[12px]">$3201</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Percent</p>
                <p className="text-[#1A1A1A] text-[12px]">10%</p>
              </div>
            </div>
          </div>

          <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
            <div className=" items-center mb-4 mt-2 px-2">
              <div className="flex justify-between pb-2 w-[100%] border-b border-[#E4E4EF]">
                <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                  <span>American Express</span>
                </div>
              </div>
            </div>
            <div className="space-y-3 mb-2 px-2">
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">American Express</p>
                <p className="text-[#1A1A1A] text-[12px]"> 10</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Payment</p>
                <p className="text-[#1A1A1A] text-[12px]">$3201</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Tips</p>
                <p className="text-[#1A1A1A] text-[12px]">$0</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Total</p>
                <p className="text-[#1A1A1A] text-[12px]">$3201</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Percent</p>
                <p className="text-[#1A1A1A] text-[12px]">10%</p>
              </div>
            </div>
          </div>

          <div className="border border-[#E4E4EF] w-full bg-white rounded-md p-3 mb-3">
            <div className=" items-center mb-4 mt-2 px-2">
              <div className="flex justify-between pb-2 w-[100%] border-b border-[#E4E4EF]">
                <div className="flex text-[#1A1A1A] text-[14px] font-bold">
                  <span>American Express</span>
                </div>
              </div>
            </div>
            <div className="space-y-3 mb-2 px-2">
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">American Express</p>
                <p className="text-[#1A1A1A] text-[12px]"> 10</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Payment</p>
                <p className="text-[#1A1A1A] text-[12px]">$3201</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Tips</p>
                <p className="text-[#1A1A1A] text-[12px]">$0</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Total</p>
                <p className="text-[#1A1A1A] text-[12px]">$3201</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-[#808080] text-[14px]">Percent</p>
                <p className="text-[#1A1A1A] text-[12px]">10%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaymentTable;

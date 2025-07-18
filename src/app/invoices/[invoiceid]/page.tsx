"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { sendApiRequest } from "@/utils/apiUtils";
import ToastNotification, {
  ToastNotificationProps,
} from "@/Components/UI/ToastNotification/ToastNotification";
import Loading from "@/Components/UI/Themes/Loading";
import NoDataFound from "@/Components/UI/NoDataFound/NoDataFound";

interface InvoiceDetail {
  itemcode: string;
  description: string;
  brand: string;
  category: string;
  quantity: number;
  unit: string;
  packsize: string;
  invtvalue: number;
  unitprice: number;
  tax: string;
  extendedprice: string;
}

interface InvoiceData {
  invoicedate: string;
  invoicenumber: string;
  storename: string;
  duedate: string;
  producttotal: number;
  misc: number;
  subtotal: number;
  tax: number;
  total: number;
  invoicedetail: InvoiceDetail[];
}

const InvoiceDetails = () => {
  const { invoiceid }: any = useParams();
  const router = useRouter();
  const decodedInvoiceId = atob(invoiceid.replace(/-/g, "+").replace(/_/g, "/"));
  const [data, setData] = useState<InvoiceData | null>(null);
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
          mode: "getInvoiceDetails",
          invoiceid: Number(decodedInvoiceId),
        });

        if (response?.status === 200) {
          setData(response?.data?.invoice[0] || null);
        } else {
          setCustomToast({
            message: response?.message || "Failed to fetch invoice details.",
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setCustomToast({
          message: "An error occurred while fetching invoice details.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [decodedInvoiceId]);

  return (
    <main
      className="max-h-[calc(100vh-80px)] overflow-auto px-6 below-md:px-3"
      style={{ scrollbarWidth: "thin" }}
    >
      <ToastNotification message={customToast.message} type={customToast.type} />
      {loading && <Loading />}
      <div className="flex w-full items-start mt-6 mb-6 below-md:mt-4 below-md:mb-4">
        <div
          className="w-[14%] below-md:hidden items-start cursor-pointer"
          onClick={() => router.back()}
        >
          <img src="/images/webbackicon.svg" alt="Back Arrow" className="w-7 h-7" />
        </div>
        <div className="flex justify-center gap-6  w-[70%] below-md:w-[100%] below-md:flex below-md:flex-col below-md:gap-4">

          {/* Left Panel - Invoice Details */}
          <div className="space-y-2 shadow border bg-[#FFFFFF] rounded-lg w-full  below-md:w-full p-4  items-start ">
            <div className="flex  justify-between ">
              <p className="text-[#636363] text-[12px]">Date</p>
              <p className="text-[#636363] text-[13px] font-semibold">{data?.invoicedate}</p>
            </div>
            <div className="flex  justify-between pt-2">
              <span className="text-[#636363] text-[12px]">Invoice Number</span>
              <span className="text-[#636363] text-[13px] font-semibold">{data?.invoicenumber}</span>
            </div>
            <div className="flex   justify-between pt-2">
              <span className="text-[#636363] text-[12px]">Store Name</span>
              <span className="text-[#636363]  text-[13px] font-semibold">{data?.storename}</span>
            </div>
            <div className="flex   justify-between pt-2">
              <span className="text-[12px] text-[#636363]">Due Date</span>
              <span className="text-[13px] text-[#636363] font-semibold">{data?.duedate}</span>
            </div>
          </div>
          <div className='flex justify-between w-full'>
            {/* Right Panel - Totals */}
            <div className="shadow border rounded-lg w-full  bg-[#FFFFFF] below-md:w-full p-4 flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-[#636363] text-[12px]">Product Total</span>
                <span className="text-[#636363] text-[13px] font-semibold">${data?.producttotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#636363] text-[12px]">Miscellaneous</span>
                <span className="text-[#636363] text-[13px] font-semibold">${data?.misc}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#636363] text-[12px]">Sub Total</span>
                <span className="text-[#636363] text-[13px] font-semibold">${data?.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#636363] text-[12px]">Total Tax </span>
                <span className="text-[#636363] text-[13px] font-semibold">${data?.tax}</span>
              </div>
              {/* <div className="flex justify-between">
              <span className="text-[#636363] text-[12px]">Tax 2</span>
              <span className="text-[#636363] text-[13px] font-semibold"></span>
            </div> */}
              <div className="flex justify-between border-t pt-2">
                <span className="text-[#636363] text-[12px] font-semibold">Total</span>
                <span className="text-[#636363] text-[12px] font-semibold">${data?.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*table content*/}
      <div className=' shadow-sm  border border-b border-[#E4E4EF] block below-md:hidden rounded-md '>
        <div className='overflow-x-auto  rounded-md'>
          <table className='w-full table-auto border-collapse text-[15px] text-white'>
            <thead className='bg-[#0F1044] '>
              <tr>
                <th className="w-[150px] px-4 py-2 text-start font-normal ">Item Code</th>
                <th className="py-2 w-[180px] px-4 text-start font-normal ">Description</th>
                <th className="py-2 w-[100px]  text-start font-normal ">Brand</th>
                <th className="py-2 w-[100px] text-start   font-normal ">Category</th>
                <th className="py-2 w-[100px] text-start  font-normal ">Quantity</th>
                <th className="py-2 w-[100px] text-start  font-normal ">Units</th>
                <th className="py-2 w-[100px] text-start whitespace-nowrap font-normal">Pack Size</th>
                <th className="py-2 w-[100px] text-start whitespace-nowrap font-normal">Invt Value</th>
                <th className="py-2 w-[100px] text-start    whitespace-nowrap font-normal">Unit Price</th>
                <th className="py-2 w-[100px] text-end px-4  font-normal">Tax</th>
                <th className="py-2 w-[100px] text-end px-4  font-normal">Total</th>

              </tr>
            </thead>
          </table>
          <div className='max-h-[calc(100vh-340px)] overflow-x-auto overflow-y-auto' style={{ scrollbarWidth: "thin" }}>
            <table className='w-full  text-[14px] table-auto shadow rounded-md'>
              <tbody>
                {data?.invoicedetail?.map((row: any, index: any) => (
                  <tr key={index}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-[#F3F3F6]'}>
                    <td className="w-[140px] py-1.5 text-start px-4 text-[#636363]">{row?.itemcode}</td>
                    <td className="py-1.5 w-[180px] text-start px-4 text-[#636363] break-all whitespace-normal overflow-hidden">{row?.description}</td>
                    <td className="py-1.5 w-[100px] text-center px-4 text-[#636363]">{row?.brand}</td>
                    <td className="py-1.5 w-[100px] text-center px-2 text-[#636363]">{row?.category}</td>
                    <td className="py-1.5 w-[100px] text-end px-5 text-[#636363] ">{row?.quantity}</td>
                    <td className="py-1.5 w-[100px] text-center px-4 text-[#636363] ">{row?.unit}</td>
                    <td className="py-1.5 w-[100px] text-end px-4 text-[#636363]">{row?.packsize}</td>
                    <td className="py-1.5 w-[100px] text-end px-4 text-[#636363]">{row?.invtvalue}</td>
                    <td className="py-1.5 w-[100px] text-end  px-4 text-[#636363]">{row?.unitprice}</td>
                    <td className="py-1.5 w-[100px] text-end px-4 text-[#636363]">{row?.tax}</td>
                    <td className="py-1.5 w-[100px] text-end px-4 text-[#636363]">{row?.extendedprice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/*card content for Mobile View*/}
      <div className='hidden  below-md:block'>
        {data?.invoicedetail?.map((row: any, index: any) => (
          <React.Fragment key={index}>
            <div className='flex justify-between w-full mb-4'>
              {/* Right Panel - Totals */}
              <div className="shadow border rounded-lg w-full gap-3 px-4 flex flex-col py-4 ">
                <div className='flex gap-12 px-1'>
                  <span className="text-black text-[14px] font-bold">{row?.itemCode}</span>
                  <span className="text-black text-[16px] font-bold">{row?.description}</span>
                </div>
                <hr className='w-full h-[1px] my-2' color='lightgrey' />
                <div className="flex justify-between">
                  <span className="text-[#636363] text-[12px]">Brand</span>
                  <span className="text-[#636363] text-[14px]">{row?.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#636363] text-[12px]">Category</span>
                  <span className="text-[#636363] text-[14px]">{row?.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#636363] text-[12px]">Quantity</span>
                  <span className="text-[#636363] text-[14px]">{row?.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#636363] text-[12px]">Units</span>
                  <span className="text-[#636363] text-[14px]">{row?.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#636363] text-[12px]">Pack Size</span>
                  <span className="text-[#636363] text-[14px]">{row?.packsize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#636363] text-[12px]">Invt Value</span>
                  <span className="text-[#636363] text-[14px]">${row?.invtvalue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#636363] text-[12px]">Unit Price</span>
                  <span className="text-[#636363] text-[14px]">${row?.unitprice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#636363] text-[12px]">Tax</span>
                  <span className="text-[#636363] text-[14px]">${row?.tax}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="text-[#636363] text-[14px] font-semibold">Total</span>
                  <span className="text-[#636363] text-[14px] font-semibold">${row?.extendedprice}</span>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </main>
  )
}

export default InvoiceDetails

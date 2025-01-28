'use client';
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import { sendApiRequest } from '@/utils/apiUtils';
import { ToastNotificationProps } from '@/Components/UI/ToastNotification/ToastNotification';

interface TableRow {
  invoicedate: string;
  itemCode: string;
  description: string;
  brand: string;
  category: string;
  quantity: number;
  units: string;
  packSize: string;
  invtValue: number;
  unitPrice: number;
  tax: string;
  total: string;
}
const InvoiceDetails = () => {

  const {invoiceid} = useParams(); 
  const [data, setData] = useState<any>({});
  const [totalItems, setTotalItems] = useState<number>(0); 
  const [loading, setLoading] = useState<boolean>(true);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });

  const tableData = [
    {
      itemCode: '67452', description: 'Cheese Amer Shrp 160C', brand: 'Dairy', category: 'DY', quantity: 2, units: 'CS',
      packSize: '4*2 LB', invtValue: 11.56, unitPrice: 46.30, tax: '-', total: '46.30'
    },
    {
      itemCode: '67452', description: 'Cheese Amer Shrp 160C', brand: 'Dairy', category: 'DY', quantity: 2, units: 'CS',
      packSize: '4*2 LB', invtValue: 11.56, unitPrice: 46.30, tax: '-', total: '46.30'
    },
    {
      itemCode: '67452', description: 'Cheese Amer Shrp 160C', brand: 'Dairy', category: 'DY', quantity: 2, units: 'CS',
      packSize: '4*2 LB', invtValue: 11.56, unitPrice: 46.30, tax: '-', total: '46.30'
    },
    {
      itemCode: '67452', description: 'Cheese Amer Shrp 160C', brand: 'Dairy', category: 'DY', quantity: 2, units: 'CS',
      packSize: '4*2 LB', invtValue: 11.56, unitPrice: 46.30, tax: '-', total: '46.30'
    },
    {
      itemCode: '67452', description: 'Cheese Amer Shrp 160C', brand: 'Dairy', category: 'DY', quantity: 2, units: 'CS',
      packSize: '4*2 LB', invtValue: 11.56, unitPrice: 46.30, tax: '-', total: '46.30'
    },
    {
      itemCode: '67452', description: 'Cheese Amer Shrp 160C', brand: 'Dairy', category: 'DY', quantity: 2, units: 'CS',
      packSize: '4*2 LB', invtValue: 11.56, unitPrice: 46.30, tax: '-', total: '46.30'
    },
    {
      itemCode: '67452', description: 'Cheese Amer Shrp 160C', brand: 'Dairy', category: 'DY', quantity: 2, units: 'CS',
      packSize: '4*2 LB', invtValue: 11.56, unitPrice: 46.30, tax: '-', total: '46.30'
    },
    {
      itemCode: '67452', description: 'Cheese Amer Shrp 160C', brand: 'Dairy', category: 'DY', quantity: 2, units: 'CS',
      packSize: '4*2 LB', invtValue: 11.56, unitPrice: 46.30, tax: '-', total: '46.30'
    },
    {
      itemCode: '67452', description: 'Cheese Amer Shrp 160C', brand: 'Dairy', category: 'DY', quantity: 2, units: 'CS',
      packSize: '4*2 LB', invtValue: 11.56, unitPrice: 46.30, tax: '-', total: '46.30'
    },
    {
      itemCode: '67452', description: 'Cheese Amer Shrp 160C', brand: 'Dairy', category: 'DY', quantity: 2, units: 'CS',
      packSize: '4*2 LB', invtValue: 11.56, unitPrice: 46.30, tax: '-', total: '46.30'
    },
    {
      itemCode: '67452', description: 'Cheese Amer Shrp 160C', brand: 'Dairy', category: 'DY', quantity: 2, units: 'CS',
      packSize: '4*2 LB', invtValue: 11.56, unitPrice: 46.30, tax: '-', total: '46.30'
    },
    {
      itemCode: '67452', description: 'Cheese Amer Shrp 160C', brand: 'Dairy', category: 'DY', quantity: 2, units: 'CS',
      packSize: '4*2 LB', invtValue: 11.56, unitPrice: 46.30, tax: '-', total: '46.30'
    },
    {
      itemCode: '67452', description: 'Cheese Amer Shrp 160C', brand: 'Dairy', category: 'DY', quantity: 2, units: 'CS',
      packSize: '4*2 LB', invtValue: 11.56, unitPrice: 46.30, tax: '-', total: '46.30'
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response: any = await sendApiRequest({
          mode: "getinvoicedetails",
          invoiceid:Number(invoiceid)
        });

        if (response?.status === 200) {
          setData(response?.data?.invoice[0] || []);
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
    <main
      className="max-h-[calc(100vh-80px)] w-full overflow-auto px-4 below-md:px-3"
      style={{ scrollbarWidth: "thin" }}
    >
      <div className='block below-md:hidden'>
        <div className='flex items-start pt-4 cursor-pointer' onClick={() => window.history.back()}>
          <img src='/images/webbackicon.svg' alt='Back Arrow' className='w-7 h-7' />
        </div>
      </div>
      <div className="flex gap-6 pt-4 pb-4 w-full below-md:flex below-md:flex-col below-md:gap-3">

        {/* Left Panel - Invoice Details */}
        <div className="space-y-2 shadow border bg-[#FFFFFF] rounded-lg w-full max-w-[299px] below-md:w-full p-4 items-start">
          <div className="flex flex-col below-md:flex-row justify-between gap-[4px]">
            <p className="text-[#636363] text-[12px]">Date</p>
            <p className="text-[#636363] text-[13px] font-semibold">{data?.invoicedate}</p>
          </div>
          <div className="flex flex-col below-md:flex-row justify-between gap-[4px]">
            <span className="text-[#636363] text-[12px]">Invoice Number</span>
            <span className="text-[#636363] text-[13px] font-semibold">{data?.invoicenumber}</span>
          </div>
          <div className="flex  flex-col below-md:flex-row justify-between gap-[4px]">
            <span className="text-[#636363] text-[12px]">Store Name</span>
            <span className="text-[#636363]  text-[13px] font-semibold">{data?.storename}</span>
          </div>
          <div className="flex flex-col below-md:flex-row justify-between gap-[4px]">
            <span className="text-[12px] text-[#636363]">Due Date</span>
            <span className="text-[13px] text-[#636363] font-semibold">{data?.duedate}</span>
          </div>
        </div>
        <div className='flex justify-between w-full'>
          {/* Right Panel - Totals */}
          <div className="shadow border rounded-lg w-full max-w-[369px] bg-[#FFFFFF] below-md:w-full p-4 flex flex-col gap-3">
            <div className="flex justify-between">
              <span className="text-[#636363] text-[12px]">Product Total</span>
              <span className="text-[#636363] text-[13px] font-semibold">${data?.producttotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#636363] text-[12px]">Sub Total</span>
              <span className="text-[#636363] text-[13px] font-semibold">${data?.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#636363] text-[12px]">Tax 1</span>
              <span className="text-[#636363] text-[13px] font-semibold">${data?.tax}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#636363] text-[12px]">Tax 2</span>
              <span className="text-[#636363] text-[13px] font-semibold"></span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#636363] text-[12px]">Miscellaneous</span>
              <span className="text-[#636363] text-[13px] font-semibold">${data?.misc}</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="text-[#636363] text-[14px] font-semibold">Total</span>
              <span className="text-[#636363] text-[14px] font-semibold">${data?.total}</span>
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
                <th className="px-4 py-2 text-left font-normal w-[10%]">Item Code</th>
                <th className="py-2 text-left font-normal w-[15%]">Description</th>
                <th className="px-4 py-2 text-left font-normal w-[10%]">Brand</th>
                <th className="px-4 py-2 text-left font-normal  w-[100px]">Category</th>
                <th className="px-4 py-2 text-left font-normal w-[8%]">Quantity</th>
                <th className="px-3 py-2 text-left font-normal w-[5%]">Units</th>
                <th className="px-4 py-2 text-center whitespace-nowrap w-[100px] font-normal">Pack Size</th>
                <th className="px-4 py-2 text-right  w-[120px] whitespace-nowrap font-normal">Invt Value</th>
                <th className="px-4 py-2 text-right  w-[100px] whitespace-nowrap font-normal">Unit Price</th>
                <th className="px-4 py-2 text-right  w-[100px] font-normal">Tax</th>
                <th className="px-4 py-2 text-right  w-[100px] font-normal">Total</th>
                <th className="w-[8px]">{ }</th>
              </tr>
            </thead>
          </table>
          <div className='max-h-[calc(100vh-420px)] overflow-x-auto overflow-y-auto' style={{ scrollbarWidth: "thin" }}>
            <table className='w-full  text-[14px] table-auto shadow rounded-md'>
              <tbody>
                {data?.invoicedetail?.map((row: any, index: any) => (
                  <tr key={index}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-[#F3F3F6]'}>
                    <td className="px-4 py-1.5 w-[10%] text-left text-[#636363]">{row?.itemcode}</td>
                    <td className="py-1.5 text-left text-[#636363] break-all whitespace-normal overflow-hidden w-[15%]">{row?.description}</td>
                    <td className="py-1.5  w-[10%] px-4 text-left text-[#636363]">{row?.brand}</td>
                    <td className="py-1.5 px-4 text-center w-[100px] text-[#636363]">{row?.category}</td>
                    <td className="py-1.5 px-6 text-right text-[#636363] w-[8%]">{row?.quantity}</td>
                    <td className="py-1.5 px-4 text-center text-[#636363] w-[5%]">{row?.unit}</td>
                    <td className="py-1.5 px-4  w-[100px] text-center text-[#636363]">{row?.packsize}</td>
                    <td className="py-1.5 px-4  w-[120px] text-right text-[#636363]">{row?.invtvalue}</td>
                    <td className="py-1.5 px-4  w-[100px] text-right text-[#030202]">{row?.unitprice}</td>
                    <td className="py-1.5 px-4  w-[100px] text-right text-[#636363]">{row?.tax}</td>
                    <td className="py-1.5 px-4  w-[100px] text-right text-[#636363]">{row?.producttotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/*card content for Mobile View*/}
      <div className='hidden  below-md:block'>
        {data?.invoicedetail?.map((items: any, index: any) => (
          <React.Fragment key={index}>
            <div className='flex justify-between w-full mb-4'>
              {/* Right Panel - Totals */}
              <div className="shadow border rounded-lg w-full gap-3 px-4 flex flex-col py-4 ">
                <div className='flex gap-12 px-1'>
                  <span className="text-black text-[14px] font-bold">{items?.itemCode}</span>
                  <span className="text-black text-[16px] font-bold">{items?.description}</span>
                </div>
                <hr className='w-full h-[1px] my-2' color='lightgrey' />
                <div className="flex justify-between">
                  <span className="text-[#636363] text-[12px]">Brand</span>
                  <span className="text-[#636363] text-[14px]">{items?.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#636363] text-[12px]">Category</span>
                  <span className="text-[#636363] text-[14px]">{items?.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#636363] text-[12px]">Quantity</span>
                  <span className="text-[#636363] text-[14px]">{items?.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#636363] text-[12px]">Units</span>
                  <span className="text-[#636363] text-[14px]">{items?.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#636363] text-[12px]">Pack Size</span>
                  <span className="text-[#636363] text-[14px]">{items?.packsize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#636363] text-[12px]">Invt Value</span>
                  <span className="text-[#636363] text-[14px]">${items?.invtvalue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#636363] text-[12px]">Unit Price</span>
                  <span className="text-[#636363] text-[14px]">${items?.unitprice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#636363] text-[12px]">Tax</span>
                  <span className="text-[#636363] text-[14px]">${items?.tax}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="text-[#636363] text-[14px] font-semibold">Total</span>
                  <span className="text-[#636363] text-[14px] font-semibold">${items?.producttotal}</span>
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
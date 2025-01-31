"use client";

import React, {useRef, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { sendApiRequest } from "@/utils/apiUtils";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ToastNotificationProps } from "../UI/ToastNotification/ToastNotification";



const UploadInvoicepopup = () => {

const [isOpen, setIsOpen] = useState(false);
const [data, setData] = useState<any[]>([]);
const [showTooltip, setShowTooltip] = useState(false);
const [loading, setLoading] = useState<boolean>(true);
const [customToast, setCustomToast] = useState<ToastNotificationProps>({
  message: "",
  type: "",
});


  
const openModal = async () => {
    setIsOpen(true);
    try {
        setLoading(true);
        const response: any = await sendApiRequest({ mode: "getinvoicepdftemplates" });
        if (response?.status === 200) {
            setData(response?.data?.templates || []);
          // setIsStoreFetched(true);
        } else {
          setCustomToast({
            ...customToast,
            message: response?.message,
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
      }finally {
        setLoading(false);
      }
    
}

const closeModal = () => setIsOpen(false);

  return (
    <>
      <div className="block below-md:hidden">
        <button
          onClick={openModal}
          className="bg-[#168A6F] hover:bg-[#11735C] shadow-lg text-white w-[159px] text-[13px] gap-[0.25rem] font-medium h-[35px] rounded-md flex items-center justify-center "
        >
           <img
              src="/images/webuploadicon.svg"
              alt="Upload Invoice"
             
            />
          Upload Invoice
        </button>
      </div>

    
      {/* Dialog for the modal */}
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-50"
        onClose={closeModal}
      >
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-[335px] max-h-[430px] overflow-auto scrollbar-thin below-md:w-[94%] below-md:h-[450px] px-6 below-md:px-4 py-3 bg-white rounded-lg shadow-lg flex flex-col">
            <div className="relative">
              <img
                onClick={closeModal}
                src="/images/cancelicon.svg"
                alt="Cancel"
                className="absolute top-0 right-0 cursor-pointer"
              />
              <div className="flex justify-center mt-1">
                <DialogTitle
                  as="h3"
                  className="text-[16px]  font-bold leading-custom text-[#3D3D3D]"
                >
                  Invoice Format
                </DialogTitle> 
                           
                          
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-3">
            {
                data?.map((items:any , index:any) =>
               <div key={items?.id} className={` ${ index % 2 === 1 ? "bg-[#F3F3F6]" : "bg-white"}`}>
                 {loading ? (
                              <Skeleton height={30} />):
                     items.name}
               </div>
            )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default UploadInvoicepopup;

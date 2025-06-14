"use client";

import { sendApiRequest } from "@/utils/apiUtils";
import { Dialog, DialogPanel, DialogTitle, Button } from "@headlessui/react";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import ToastNotification, { ToastNotificationProps } from "../UI/ToastNotification/ToastNotification";

interface JsonData {
  mode: string;
  id:number | null
}

const DeleteExpense = ({ initialData , setAddExpenses}:any) => {


  const [isOpen, setIsOpen] = useState(false);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });

  const openModal = () => setIsOpen(true);
  const closeModal = () => {setIsOpen(false); };
 

  const handleSubmit = async () => {

    const jsonData: JsonData = {
      mode: "deleteExpense",
      id:Number(initialData?.id)
    };
  
    try {
      const result: any = await sendApiRequest(jsonData);
      const { status, data: responseData } = result; 

      if (status === 200) {
        setCustomToast({
          message: status === 200 ? "Item delete successfully!" : "Failed to delete item.",
          type: status === 200 ? "success" : "error",
        });
        setTimeout(() => {
          setAddExpenses(true);
          closeModal();
        }, 300);
      };

    } catch (error) {
      setCustomToast({ message: "Error delete item", type: "error" });
      console.error("Error submitting form:", error);
    }
  };





  return (
    <>
     <ToastNotification
        message={customToast.message}
        type={customToast.type}
      />
      <div>
        <Button onClick={openModal}>
          <img
            src="/images/deletebinicon.svg"
            className="flex justify-center w-4 h-4  below-md:w-5 below-md:h-5 text-left"
          />
        </Button>
      </div>
      {/* Dialog for the modal */}
      <Dialog open={isOpen} as="div" className="relative z-50" onClose={closeModal}>
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className=" h-auto below-md:w-[335px]  px-6 py-6 bg-white rounded-lg shadow-lg flex flex-col">
            <div>
              <DialogTitle as="h3" className=" flex justify-center text-[16px] font font-semibold leading-4 text-[#5E6366] ">
                Delete Item
              </DialogTitle>
              <div className="flex flex-col mt-4 justify-center items-center text-[#5E6366] font-medium  text-[15px]">
                <p className=" below-md:text-[12px]  below-md:font-normal">
                  Are you sure you want to delete this item?
                </p>
                <p className=" below-md:text-[12px] below-md:font-normal">
                  This action cannot be undone.
                  </p>
              </div>
            </div>
            <div className="mt-4">
                <div className="flex mt-7 justify-between">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mr-4 px-4 py-2 h-[35px] w-[165px] bg-[#E4E4E4] font-semibold text-[14px] rounded-md text-[#6F6F6F]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="font-semibold text-[14px]  bg-[#CD6D6D] w-[165px] px-6 h-[35px] text-[#FFFFFF] rounded-md"
                    onClick={handleSubmit}
                  >
                    Delete
                  </button>
                </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>


  )
}

export default DeleteExpense
"use client";
import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Button } from "@headlessui/react";
import { sendApiRequest } from "@/utils/apiUtils";
import ToastNotification, { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";
import { toast } from "react-toastify"; // Ensure toast is called in this file

interface DeleteDQCategoriesProps {
  rowData: { id: number; name: string; types?: string };
  setDataRefresh: (value: boolean | ((prev: boolean) => boolean)) => void;
}

const DeleteDQCategories: React.FC<DeleteDQCategoriesProps> = ({ rowData, setDataRefresh }) => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleDelete = async () => {
    try {
      const response: any = await sendApiRequest({
        mode: "deleteDQCategory", // Updated mode name
        dqcategoryid: rowData.id, // Updated to match the API parameter
      });

      if (response?.status === 200) {
        toast.success("DQ Category deleted successfully!"); // Trigger toast
        setDataRefresh(prev => !prev); // Refresh data
      } else {
        toast.error(response?.error_message || "Failed to delete DQ Category.");
      }
    } catch (error) {
      console.error("Error deleting DQ Category:", error);
      toast.error("An error occurred while deleting the DQ Category.");
    } finally {
      setTimeout(() => closeModal(), 500); // Delay modal close for better UX
    }
  };

  // Hide delete button if types === "S"
  if (rowData.types === "S") {
    return null;
  }

  return (
    <>
      <div>
        <Button>
          <img
            onClick={openModal}
            src="/images/deletebinicon.svg"
            alt="Delete icon"
            className="flex justify-center items-center w-4 h-4 below-md:w-5 below-md:h-5 below-md:ml-5"
          />
        </Button>
      </div>

      <Dialog open={isOpen} as="div" className="relative z-50" onClose={closeModal}>
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-[420px] below-md:w-[335px] h-auto px-6 py-6 bg-white rounded-lg shadow-lg">
            <div>
              <DialogTitle as="h3" className="flex justify-center text-[#5E6366] font-semibold text-[16px]">
                Delete DQ Category
              </DialogTitle>
              <div className="flex flex-col mt-4 justify-center items-center text-[#5E6366] font-medium text-[15px]">
                <p className="below-md:text-[12px] below-md:placeholder:font-normal">
                  Are you sure you want to delete this DQ Category?
                </p>
                <p className="below-md:text-[12px] below-md:font-normal">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex mt-7 justify-between">
                <button
                  type="button"
                  onClick={closeModal}
                  className="mr-4 px-4 py-2 h-[35px] w-[165px] bg-[#E4E4E4] hover:bg-[#C9C9C9] font-semibold text-[14px] rounded-md text-[#6F6F6F]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="font-semibold text-[14px] bg-[#CD6D6D] w-[165px] px-6 h-[35px] text-[#FFFFFF] rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* ToastNotification component should be present */}
      <ToastNotification message="" />
    </>
  );
};

export default DeleteDQCategories;

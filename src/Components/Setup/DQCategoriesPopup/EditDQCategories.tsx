"use client";
import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Button } from "@headlessui/react";
import { sendApiRequest } from "@/utils/apiUtils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface EditDQCategoriesProps {
  rowData: { id: number; name: string; types?: string };
  setDataRefresh: (value: boolean) => void;
}

const EditDQCategories: React.FC<EditDQCategoriesProps> = ({ rowData, setDataRefresh }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dqCategoryName, setDQCategoryName] = useState(rowData.name);

  const handleSubmit = async () => {
    try {
      const response = await sendApiRequest({
        mode: "updateDQCategory",
        dqcategoryid: rowData.id,
        dqcategoryname: dqCategoryName
      });

      if (response?.status === 200) {
        toast.success("DQ Category updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeButton: true,
          draggable: true,
        });
        setDataRefresh(true); // This will trigger the data refresh in the parent component
      } else if (response?.error_message) {
        toast.error(response.error_message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeButton: true,
          draggable: true,
        });
      } else {
        toast.error("Update failed. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeButton: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("An error occurred during update", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeButton: true,
        draggable: true,
      });
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <img src="/images/editpencilicon.svg" alt="Edit" className="w-4 h-4" />
      </Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md bg-white rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <DialogTitle className="text-lg font-semibold">Edit DQ Category</DialogTitle>
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>

            <input
              value={dqCategoryName}
              onChange={(e) => setDQCategoryName(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Category Name"
            />

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-white bg-[#1AA47D] rounded"
              >
                Save Changes
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default EditDQCategories;
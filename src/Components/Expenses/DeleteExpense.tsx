"use client";

import { Dialog, DialogPanel, DialogTitle, Button } from "@headlessui/react";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

const DeleteExpense = () => {
  const [startDate, setStartDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setFormData({
      store: "",
      expenseType: "",
      description: "",
      amount: "",
      date: null,
    });// Reset form data
    setErrors({
      store: "",
      expenseType: "",
      description: "",
      amount: "",
      date: "",
    }); // Clear validation errors

  };
  type FormData = {
    store: string;
    date: Date | null;
    expenseType: string;
    description: string;
    amount: number | string;
  };

  const [formData, setFormData] = useState<FormData>({
    store: "",
    expenseType: "",
    description: "",
    amount: "",
    date: null,
  });
  const [errors, setErrors] = useState({
    store: "",
    expenseType: "",
    description: "",
    amount: "",
    date: "",
  });

  const handleValidation = () => {
    let isValid = true;
    let newErrors = { ...errors };

    // Validate each field
    if (!formData.store) {
      newErrors.store = "Store is required.";
      isValid = false;
    } else {
      newErrors.store = "";
    }

    if (!formData.expenseType) {
      newErrors.expenseType = "Expense Type is required.";
      isValid = false;
    } else {
      newErrors.expenseType = "";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
      isValid = false;
    } else {
      newErrors.description = "";
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required.";
      isValid = false;
    } else if (parseFloat(String(formData.amount)) <= 0) {
      newErrors.amount = "Amount must be greater than 0.";
      isValid = false;
    } else {
      newErrors.amount = "";
    }

    if (!formData.date) {
      newErrors.date = "Date is required.";
      isValid = false;
    } else {
      newErrors.date = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handleValidation()) {
      console.log("Form submitted successfully:", formData);
      closeModal(); // Close modal if validation passes
    }
  };





  return (
    <>
      <div>
        <Button onClick={openModal}>
          <img
            src="/images/deleteIcon(1).svg"
            className="flex justify-center w-4 h-4 text-left"
          />
        </Button>
      </div>
      {/* Dialog for the modal */}
      <Dialog open={isOpen} as="div" className="relative z-50" onClose={closeModal}>
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-[410px] h-auto below-md:w-[310px] below-md:h-[213px] px-6 below-md:px-3 below-md:py-8 py-6 bg-white rounded-lg shadow-lg flex flex-col">
            <div>
              <DialogTitle as="h3" className=" flex justify-center below-md:text-[18px] text-[20px]  font-bold leading-4 text-[#5E6366] ">
                Delete Item
              </DialogTitle>
              <div className="flex flex-col mt-4 justify-center items-center text-[#5E6366] font-medium below-md:text-[12px] text-[15px]">
                <p>Are you sure you want to delete this item?</p>
                <p>This action cannot be undone.</p>
              </div>
            </div>
            <div className="mt-4">
              <form onSubmit={handleSubmit}>
                {/* Submit Button */}
                <div className="flex mt-7 justify-between below-md:mx-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mr-2 px-4 py-2 h-[37px] below-md:w-[120px] w-[165px] bg-[#E4E4E4] font-semibold text-[14px] rounded-md text-[#6F6F6F]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="font-semibold text-[14px] below-md:w-[120px]  bg-[#CD6D6D] w-[165px] px-6  h-[37px] text-[#FFFFFF] rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </form>

            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>


  )
}

export default DeleteExpense

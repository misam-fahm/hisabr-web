"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditExpense = ({
  expenseData,
  onUpdate,
}: {
  expenseData: any;
  onUpdate: (updatedData: any) => void;
}) => {
  const [startDate, setStartDate] = useState<Date | null>(
    expenseData.date || null
  );
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Added state for dropdown visibility
  const [expenseDropdownOpen, setExpenseDropdownOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setFormData({
      selectedType: expenseData.store || "",
      expenseType: expenseData.expenseType || "",
      description: expenseData.description || "",
      amount: expenseData.amount || "",
      date: expenseData.date || null,
    }); // Reset form data
    setErrors({
      selectedType: "",
      expenseType: "",
      description: "",
      amount: "",
      date: "",
    });
    setDropdownOpen(false); // Reset dropdown visibility when closing the modal // Clear validation errors
    setExpenseDropdownOpen(false);
  };

  type FormData = {
    selectedType: string;
    date: Date | null;
    expenseType: string;
    description: string;
    amount: number | string;
  };

  const [formData, setFormData] = useState<FormData>({
    selectedType: expenseData.store || "",
    expenseType: expenseData.expenseType || "",
    description: expenseData.description || "",
    amount: expenseData.amount || "",
    date: expenseData.date || null,
  });
  const [errors, setErrors] = useState({
    selectedType: "",
    expenseType: "",
    description: "",
    amount: "",
    date: "",
  });

  const handleValidation = () => {
    let isValid = true;
    let newErrors = { ...errors };

    // Validate each field
    if (!formData.selectedType) {
      newErrors.selectedType = "Store is required.";
      isValid = false;
    } else {
      newErrors.selectedType = "";
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
      console.log("Form updated successfully:", formData);
      onUpdate(formData); // Call the onUpdate function passed as prop
      closeModal(); // Close modal if validation passes
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    setFormData({
      selectedType: expenseData.store || "",
      expenseType: expenseData.expenseType || "",
      description: expenseData.description || "",
      amount: expenseData.amount || "",
      date: expenseData.date || null,
    });
  }, [expenseData]);

  return (
    <>
      <div>
        <button onClick={openModal}>
          <img
            src="/images/editpencilicon.svg"
            className="flex justify-center w-4 h-4 md:h-5 md:w-5 text-left"
          />
        </button>
      </div>

     

            {/* Dialog for the modal */}
            <Dialog open={isOpen} as="div" className="relative z-50" onClose={closeModal}>
                <div className="fixed inset-0 bg-black bg-opacity-50" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="w-[410px] h-[518px] below-md:w-[94%] below-md:h-[450px] px-6 below-md:px-3 py-6 bg-white rounded-lg shadow-lg flex flex-col">
                        <div className='flex items-center justify-between mb-5 mr-1'>
                            <DialogTitle as="h3" className="text-[16px] font-semibold leading-4 text-[#5E6366]">
                                Edit Expense
                            </DialogTitle>
                            <button type="button" onClick={closeModal} className="text-[#5E6366] focus:outline-none">
                                <svg xmlns="/images/CancelIcon.svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        {/* EditExpense Form */}
                        <form onSubmit={handleSubmit}>
                            <div className="relative overflow-y-auto h-[380px] below-md:h-[300px] overflow-x-hidden scrollbar-thin scrollbar-thumb-[#A9A5CA33] scrollbar-track-transparent">
                                {/* Store */}
                                <div className="flex flex-col">
                                    <label className="text-[13px] text-[#5E6366] mb-1 block">Store</label>
                                    <button
                                        type="button"
                                        onClick={() => setDropdownOpen((prev) => !prev)}
                                        className={`h-[42px] mt-1 pl-2 pr-4 w-full text-[13px] font-normal rounded-lg border ${errors.selectedType ? "border-red-500" : "border-gray-300"
                                            } bg-white text-[#8D98AA] flex justify-between items-center`}
                                    >
                                        {formData.selectedType || "Please select store"}
                                        <img src="/images/dropdown1.svg" alt="dropdown1" />
                                    </button>
                                    {dropdownOpen && (
                                        <ul className="absolute z-10 w-full mt-20 text-[#8D98AA] bg-white border border-gray-300 rounded-lg shadow-lg">
                                            {["Store1", "Store2", "Store3", "Store4", "Store5"].map(
                                                (store) => (
                                                    <li
                                                        key={store}
                                                        onClick={() => {
                                                            setFormData((prevData) => ({
                                                                ...prevData,
                                                                selectedType: store,
                                                            }));
                                                            setErrors((prevErrors) => ({
                                                                ...prevErrors,
                                                                selectedType: "",
                                                            }));
                                                            setDropdownOpen(false);
                                                        }}
                                                        className="px-4 py-2 cursor-pointer border-b text-sm hover:text-white hover:bg-[#334155]"
                                                    >
                                                        {store}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                                    {errors.selectedType && (
                                        <p className="text-red-500 text-[12px]">{errors.selectedType}</p>
                                    )}
                                </div>

                                {/* Expense Type and Description */}
                                <div className="grid grid-cols-1 gap-2 mb-4">
                                    <div>
                                        <label className="text-[13px] text-[#5E6366] mb-2 my-2 block">Expense Type</label>
                                        <button
                                            type="button"
                                            onClick={() => setExpenseDropdownOpen((prev) => !prev)}
                                            className={`h-[40px] mt-1 pl-2 pr-4 w-full text-[13px] font-normal rounded-lg border ${errors.expenseType ? "border-red-500" : "border-gray-300"
                                                } bg-white text-[#8D98AA] flex justify-between items-center`}
                                        >
                                            {formData.expenseType || "Please Select Expense Type"}
                                            <img src="/images/dropdown1.svg" alt="dropdown icon" />
                                        </button>
                                        {expenseDropdownOpen && (
                                            <ul className="absolute z-10 w-full mt-2 text-[13px] text-[#8D98AA] bg-white border border-gray-300 rounded-lg shadow-lg">
                                                {["Type 1", "Type 2", "Type 3", "Type 4"].map((type) => (
                                                    <li
                                                        key={type}
                                                        onClick={() => {
                                                            setFormData((prevData) => ({
                                                                ...prevData,
                                                                expenseType: type,
                                                            }));
                                                            setErrors((prevErrors) => ({
                                                                ...prevErrors,
                                                                expenseType: "",
                                                            }));
                                                            setExpenseDropdownOpen(false);
                                                        }}
                                                        className="px-4 py-2 cursor-pointer border-b text-sm hover:text-white hover:bg-[#334155]"
                                                    >
                                                        {type}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        {errors.expenseType && <p className="text-red-500 text-[12px]">{errors.expenseType}</p>}
                                    </div>
                                    <div>
                                        <label className="text-[13px] text-[#5E6366] mb-2 block">Description</label>
                                        <input
                                            type="text"
                                            name="description"
                                            className={`border h-[40px] w-full below-md:w-full pl-2 text-[#8D98AA] text-[13px] rounded-lg ${errors.description ? "border-red-500" : "border-gray-300"}`}
                                            placeholder="Please enter Expense Description"
                                            value={formData.description}
                                            onChange={handleChange}
                                        />
                                        {errors.description && <p className="text-red-500 text-[12px]">{errors.description}</p>}
                                    </div>
                                    <div>
                                        <label className="text-[13px] text-[#5E6366] mb-2 block">Amount</label>
                                        <input
                                            type="number"
                                            name="amount"
                                            className={`border h-[40px] w-full below-md:w-full pl-2 text-[#8D98AA] text-[13px] rounded-lg ${errors.amount ? "border-red-500" : "border-gray-300"}`}
                                            placeholder="Please enter Expense Amount"
                                            value={formData.amount}
                                            onChange={handleChange}
                                        />
                                        {errors.amount && <p className="text-red-500 text-[12px]">{errors.amount}</p>}
                                    </div>
                                    <div className='flex flex-col mt-1 mb-2'>
                                        <label className="text-[13px] text-[#5E6366] mb-2 block">Date</label>
                                        <div className='relative w-full'>
                                            <DatePicker
                                                selected={formData.date}
                                                onChange={(date: any) => setFormData({ ...formData, date })}
                                                placeholderText="Please enter expense date"
                                                className={`border h-[40px] w-[350px] below-md:w-[124%]  pl-3 pr-10 text-[#8D98AA] text-[13px] rounded-lg ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                                            />
                                            <img className='absolute top-1/2 right-3 transform -translate-y-1/2 w-4 h-4 cursor-pointer' src='/images/CalenderIcon.svg' alt="Calendar Icon" />
                                        </div>
                                        {errors.date && <p className="text-red-500 text-[12px]">{errors.date}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center mt-3 md:w-full justify-between md:gap-2 space-x-3">
                                <button type="button"
                                    className="px-4 py-2 below-md:px-2 md:py-1 text-[14px] text-[#6F6F6F] md:h-[35px] w-[165px] hover:bg-[#C9C9C9] bg-[#E4E4E4] rounded-md"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white md:text[13px] text-[14px] md:h-[35px] w-[165px] bg-[#1AA47D] rounded-md hover:bg-green-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </DialogPanel>
                </div>

                </Dialog>
    </>
  );
};


export default EditExpense;

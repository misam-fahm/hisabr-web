'use client';

import React, { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddExpenses = () => {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };





    return (
        <>
            {/* Button to open dialog */}
            <button
                onClick={openModal}
                className='bg-[#1AA47D] hover:bg-[#168A6F] text-white py-[10px] px-[35px] rounded-md font-normal text-[12px]'
            >
                Add Expense
            </button>

            {/* Dialog for the modal */}
            <Dialog open={isOpen} as="div" className="relative z-50" onClose={closeModal}>
                <div className="fixed inset-0 bg-black bg-opacity-50" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="w-[410px] h-[518px] px-6 py-6 bg-white rounded-lg shadow-lg flex flex-col">
                        <div className='flex items-center justify-between mb-5 mr-1'>

                            <DialogTitle as="h3" className="text-[16px]  font-medium leading-4 text-[#5E6366]">
                                Add Expense

                            </DialogTitle>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="text-[#5E6366] focus:outline-none"
                            >
                                <svg
                                    xmlns="/images/CancelIcon.svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>


                       
                            {/* AddExpense Form */}
                            <form onSubmit={handleSubmit}>
                            <div className="overflow-y-auto h-[380px] overflow-x-hidden scrollbar-thin scrollbar-thumb-[#A9A5CA33] scrollbar-track-transparent" >
                                {/* Store */}
                                <div className="flex flex-col gap-1 mb-3">
                                    <label className="text-[13px] text-[#5E6366] mb-1 block">Store</label>
                                    <select name="store"
                                        className={`border h-[40px] w-[345px] pl-2 text-[#8D98AA] text-[12px] rounded-lg ${errors.store ? "border-red-500" : "border-gray-300"
                                            }`}
                                        value={formData.store}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled hidden>Please Select Store</option>
                                        <option>Store 1</option>
                                        <option>Store 2</option>
                                    </select>
                                    {errors.store && <p className="text-red-500 text-[12px]">{errors.store}</p>}

                                </div>

                                {/* Expense Type and Description */}
                                <div className="grid grid-cols-1 gap-2 mb-4">
                                    <div>
                                        <label className="text-[13px] text-[#5E6366] mb-2 block">Expense Type</label>
                                        <select name="expenseType"
                                            className={`border h-[40px] w-[345px] pl-2 text-[#8D98AA] text-[12px] rounded-lg ${errors.expenseType ? "border-red-500" : "border-gray-300"
                                                }`}
                                            value={formData.expenseType}
                                            onChange={handleChange}
                                        >
                                            <option value="" disabled hidden>
                                                Please Select Expense Type
                                            </option>
                                            <option>Type 1</option>
                                            <option>Type 2</option>
                                        </select>
                                        {errors.expenseType && (
                                            <p className="text-red-500 text-[12px]">{errors.expenseType}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-[13px] text-[#5E6366] mb-2 block">Description</label>
                                        <input
                                            type="text"
                                            name="description"
                                            className={`border h-[40px] w-[345px] pl-2 text-[#8D98AA] text-[12px] rounded-lg ${errors.description ? "border-red-500" : "border-gray-300"
                                                }`}
                                            placeholder="Please enter Expense Description"
                                            value={formData.description}
                                            onChange={handleChange}
                                        />
                                        {errors.description && (
                                            <p className="text-red-500 text-[12px]">{errors.description}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-[13px] text-[#5E6366] mb-2 block">Amount</label>
                                        <input
                                            type="number"
                                            name="amount"
                                            className={`border h-[40px] w-[345px] pl-2 text-[#8D98AA] text-[12px] rounded-lg ${errors.amount ? "border-red-500" : "border-gray-300"
                                                }`}
                                            placeholder="Please enter Expense Amount"
                                            value={formData.amount}
                                            onChange={handleChange}
                                        />
                                        {errors.amount && <p className="text-red-500 text-[12px]">{errors.amount}</p>}
                                    </div>
                                    <div className='flex flex-col mt-1 mb-2'>
                                        <label className="text-[13px] text-[#5E6366] mb-2 block">Date</label>
                                        <div className='relative'>
                                            <DatePicker
                                                selected={formData.date}
                                                onChange={(date) => setFormData({ ...formData, date })}
                                                placeholderText="Please enter expense date"
                                                className={`border h-[40px] w-[345px] pl-3 pr-10 text-[#8D98AA] text-[12px] rounded-lg ${errors.date ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                            <img className='absolute top-1/2 right-3 transform -translate-y-1/2 w-5 h-5 cursor-pointer ' src='/images/CalenderIcon.svg'
                                                alt="Calendar Icon"
                                            />
                                        </div>
                                        {errors.date && <p className="text-red-500 text-[12px]">{errors.date}</p>}
                                    </div>
                                    </div>
                                    </div>
                                    {/* Submit Button */}
                                    <div className="flex items-center mt-3 justify-start gap-8">
                                        <button type="button"
                                            className="px-4 py-2 text-[14px] text-[#6F6F6F] w-[158px] h-[37px] bg-[#C8C8C8] rounded-md"
                                            onClick={closeModal}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 text-white text-[14px] w-[156px] h-[37px] bg-[#1AA47D] rounded-md hover:bg-green-700"
                                        >
                                            Add Expense
                                        </button>
                                    </div>
                                
                            </form>
                      
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
};

export default AddExpenses;

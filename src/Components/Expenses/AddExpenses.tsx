'use client';

import React, { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddExpenses = () => {
    const [startDate, setStartDate] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);


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
                    <DialogPanel className="w-[410px] h-[518px] px-6 py-6 bg-white rounded-lg shadow-lg">
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


                        <div className="mt-4">
                            {/* AddExpense Form */}
                            <form>
                                {/* Store */}
                                <div className="flex flex-col gap-1 mb-3">
                                    <label className="text-[13px] text-[#5E6366] mb-1 block">Store</label>
                                    <select className="border h-[40px] w-[355px] pl-2 text-[#8D98AA] text-[12px] rounded-lg border-gray-300"
                                        defaultValue=""
                                    >

                                        <option value="" disabled hidden>Please Select Store</option>
                                        <option>Store 1</option>
                                        <option>Store 2</option>
                                    </select>
                                </div>

                                {/* Expense Type and Description */}
                                <div className="grid grid-cols-1 gap-2 mb-4">
                                    <div>
                                        <label className="text-[13px] text-[#5E6366] mb-2 block">Expense Type</label>
                                        <select className="border h-[40px] pl-2 w-[355px] text-[#8D98AA] text-[12px] rounded-lg border-gray-300"
                                            defaultValue=""
                                        >
                                            <option value="" disabled hidden>Please Select Expense Type</option>
                                            <option>Type 1</option>
                                            <option>Type 2</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[13px] text-[#5E6366] mb-2 block">Description</label>
                                        <input
                                            type="text"
                                            className="border h-[40px] pl-2 w-[355px] text-[#8D98AA] text-[12px] rounded-lg border-gray-300"
                                            placeholder="Please enter Expense Description"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[13px] text-[#5E6366] mb-2 block">Amount</label>
                                        <input
                                            type="number"
                                            className="border h-[40px] w-[355px] pl-2 text-[#8D98AA] text-[12px] rounded-lg border-gray-300"
                                            placeholder="Please enter Expense Amount"
                                        />
                                    </div>
                                    <div className='flex flex-col mt-1 mb-2'>
                                        <label className="text-[13px] text-[#5E6366] mb-2 block">Date</label>
                                        <div className='relative'>
                                            <DatePicker
                                                selected={startDate}
                                                onChange={(date: any) => setStartDate(date)}
                                                placeholderText="Please enter expense date"
                                                className="border h-[40px] w-[355px] pl-3 pr-10 text-[#8D98AA] text-[12px] rounded-lg border-gray-300"
                                            />
                                            <img className='absolute top-1/2 right-3 transform -translate-y-1/2 w-5 h-5 cursor-pointer ' src='/images/CalenderIcon.svg'
                                            alt="Calendar Icon" 
                                             />
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex items-center justify-start gap-8">
                                    <button type="button"
                                        className="px-4 py-2 text-[14px] text-[#6F6F6F] w-[165px] h-[37px] bg-[#C8C8C8] rounded-md"
                                        onClick={closeModal}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-white text-[14px] w-[165px] h-[37px] bg-[#1AA47D] rounded-md hover:bg-green-700"
                                    >
                                        Add Expense
                                    </button>
                                </div>
                            </form>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
};

export default AddExpenses;
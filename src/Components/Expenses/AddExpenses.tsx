"use client";

import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import "react-datepicker/dist/react-datepicker.css";
import Dropdown from "@/Components/ui/Common/DropDown";
import { FormProvider, useForm, Controller, FieldError } from "react-hook-form";
import { Inputtext } from "../ui/InputText";
import DateRange from "@/Components/drawer/DateRangePicker";




const AddExpenses = () => {
  const methods = useForm();
  const { setValue, watch } = methods;


  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };
  const { control } = useForm(); // Initialize React Hook Form
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  //tooltip for mobile
  const [showTooltip, setShowTooltip] = useState(false);

  const handlePressStart = () => {
    setShowTooltip(true);

    setTimeout(() => {
      setShowTooltip(false);
    }, 2000);
  };

  const handlePressEnd = () => {
    setShowTooltip(false);
  };




  //Dropdown
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [isExpenseDropdownOpen, setIsExpenseDropdownOpen] = useState(false);
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown1 = () => {
    setIsStoreDropdownOpen((prev) => !prev);
    setIsExpenseDropdownOpen(false); // Close the other dropdown
  }
  const options = ["Store 1", "Store 2", "Store 3", "All Store"];
  const selectedStore = watch("store"); // Watch the "store" field for changes

  const toggleExpenseDropdown = () => {
    setIsExpenseDropdownOpen((prev) => !prev);
    setIsStoreDropdownOpen(false); // Close the other dropdown
  };
  const expenseTypes = ["Travel", "Food", "Accommodation", "Miscellaneous"];
  const selectedExpense = watch("Expense Type"); // Watch the "store" field for changes




  return (
    <>
      <div className="hidden below-md:block justify-end fixed bottom-5 right-5">
        <button
          onClick={openModal}
          onTouchStart={handlePressStart} // For mobile devices
          onMouseLeave={handlePressEnd} // Hide tooltip on mouse leave
          className="focus:outline-none flex items-center justify-center bg-[#168A6F]  w-[56px] h-[56px] rounded-xl relative"
        >
          <img
            src="/images/webaddicon.svg"
            alt="AddExpense"
            className="w-[18px] h-[18px]"
          />
          {showTooltip && (
            <div className="absolute bottom-[75px] right-[80%] transform translate-x-1/2 bg-[#79747E] text-white text-[12px] px-5 py-2 rounded-md whitespace-nowrap">
              Add Expenses
              {/* Tooltip Pointer */}
              <div className="absolute top-full right-[20%] transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#79747E]"></div>
            </div>
          )}
        </button>
      </div>
      <div className="block below-md:hidden">
        <button
          onClick={openModal}
          className="bg-[#168A6F] hover:bg-[#11735C] shadow-lg text-white w-[159px] text-[14px] gap-[0.25rem] font-medium h-[35px] rounded-md flex items-center justify-center "
        >
          <img className="" src="/images/webaddicon.svg" alt="" />
          Add Expenses
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
          <DialogPanel className="w-[335px] h-[421px] below-md:w-[94%] below-md:h-[450px] px-6 below-md:px-3 py-6 bg-white rounded-lg shadow-lg flex flex-col">
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
                  Add Expense
                </DialogTitle>
              </div>
            </div>

            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
              >
                <div className="flex flex-col mt-4 gap-4">
                  <div className="flex w-full h-[38px]">
                    {/* Store Input Field */}
                    <Dropdown
                    options={options}
                    selectedOption={selectedStore || "Store"} // Watch the selected value
                    onSelect={(selectedOption) => {
                        setValue("store", selectedOption); // Update the form value
                        setIsStoreDropdownOpen(false);// Close dropdown after selection
                      }}
                      isOpen={isStoreDropdownOpen}
                      toggleOpen={toggleDropdown1}
                      widthchange="w-full"
                    />
                  </div>
                  <div className="flex w-full h-[38px]">
                    {/* Expense Type Input Field */}
                    <Dropdown
                      options={expenseTypes}
                      selectedOption={selectedExpense || "Expense Type"} // Watch the selected value
                      onSelect={(selectedOption) => {
                        setValue("Expense Type", selectedOption); // Update the form value
                        setIsExpenseDropdownOpen(false); // Close dropdown after selection
                      }}
                      isOpen={isExpenseDropdownOpen}
                      toggleOpen={toggleExpenseDropdown}
                      widthchange="w-full"
                    />
                  </div>
                  <div className="w-full h-[38px]">
                    <DateRange />
                  </div>

                  <div className="w-full flex">
                    {/* Description Input Field */}
                    <Inputtext
                      type="text"
                      label="Description"
                      borderClassName=" border border-gray-400"
                      labelBackgroundColor="bg-white"
                      textColor="text-gray-500"
                      {...methods?.register("description", {
                        required: "Description is required",
                      })}
                      errors={methods.formState.errors.description}
                      placeholder="Description"
                      variant="outline" />
                  </div>
                  <div className="flex w-[286px] h-[38px]">
                    {/* Amount Input Field */}
                    <Inputtext
                      type="number" // Use type="number" for numeric input
                      label="Amount"
                      borderClassName="border border-gray-400"
                      labelBackgroundColor="bg-white"
                      textColor="text-gray-500"
                      {...methods?.register("amount", {
                        required: "Amount is required",
                        min: {
                          value: 0,
                          message: "Amount must be a positive number",
                        },
                      })}
                      errors={methods.formState.errors.amount}
                      placeholder="Enter Amount"
                      variant="outline"
                    />
                  </div>
                  <div className="flex flex-col items-center py-3">
                    <div className="flex justify-between gap-3 items-center w-full">
                      <button type="button"
                        className="px-4 py-2 below-md:px-2 md:py-1 text-[14px] text-[#6F6F6F] md:h-[35px] w-[165px] hover:bg-[#C9C9C9] bg-[#E4E4E4] rounded-md"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-white md:text[13px] text-[14px] md:h-[35px] w-[165px] bg-[#168A6F] hover:bg-[#11735C] rounded-md "
                      >
                        Save
                      </button>


                    </div>
                  </div>



                </div>

              </form>





            </FormProvider>

          </DialogPanel>
        </div>
      </Dialog>

    </>
  );
};


export default AddExpenses;

 "use client";

import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import "react-datepicker/dist/react-datepicker.css";
import Dropdown from "@/Components/ui/Common/DropDown";
import { FormProvider, useForm,Controller} from "react-hook-form";
import { Inputtext } from "../ui/InputText";

const AddExpenses = () => {
  const methods = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
  };



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

  /**dropdown */
  const [selectedOption, setSelectedOption] = useState<string>("Select Stores");
  
  const options = ["Store 1", "Store 2", "Store 3", "All Store"];
  const toggleDropdown1 = () => setIsOpen(!isOpen);
  
  const handleSelect = (option: string) => {
      setSelectedOption(option);
      setIsOpen(false); // Close dropdown after selection
      handleSelect(option); // Call the passed handler
    };
// const [selectedOption, setSelectedOption] = useState<string>("Please Select Expense Type");

// const options = ["Type 1", "Type 2", "Type 3", "Type 4"];
// const toggleDropdown1 = () => setIsOpen(!isOpen);

// const handleSelect = (option: string) => {
//   setSelectedOption(option);
//   setIsOpen(false); // Close dropdown after selection
//   handleSelect(option); // Call the passed handler

// };


return (
  <>
    <div className="hidden below-md:block justify-end fixed bottom-5 right-5">
      <button
        onClick={openModal}
        onTouchStart={handlePressStart} // For mobile devices
        onMouseLeave={handlePressEnd} // Hide tooltip on mouse leave
        className="focus:outline-none flex items-center justify-center bg-[#1AA47D] w-[56px] h-[56px] rounded-lg relative"
      >
        <img
          src="/images/WebAddIcon.svg"
          alt="AddExpense"
          className="w-[18px]"
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
        className="bg-[#1AA47D] hover:bg-[#168A68] shadow-lg text-white w-[159px] text-[14px] gap-[0.25rem] font-medium h-[35px] rounded-md flex items-center justify-center "
      >
        <img className="" src="/images/WebAddIcon.svg" alt="" />
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
              src="/images/CancelIcon.svg"
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
              <div className="mt-4">
                <div className="flex w-[286px] h-[38px]">
                  <Dropdown
                    options={options}
                    selectedOption={selectedOption}
                    onSelect={handleSelect}
                    isOpen={isOpen}
                    toggleOpen={toggleDropdown1}
                    widthchange="w-full"
                  />
                </div>

                <div className="w-full  flex">
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
                    variant="outline"                  />
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

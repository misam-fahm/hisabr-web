"use client";

import React, { useState } from "react";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import "react-datepicker/dist/react-datepicker.css";
import Dropdown from "@/Components/ui/Common/DropDown";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { Inputtext } from "../ui/InputText";
import DateRange from "@/Components/drawer/DateRangePicker";

const AddStore = () => {
  const methods = useForm();

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };
  const { control } = useForm(); // Initialize React Hook Form
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
            <div>
         <Button onClick={openModal}>
           <img
            src="/images/EditPencilIcon.svg"
            alt="Add icon"
            className="flex justify-center items-center  w-4 h-4 below-md:w-5 below-md:h-5"
          />
        </Button>
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
          <DialogPanel className="w-[335px] h-auto below-md:w-[94%] below-md:h-auto px-6 below-md:px-3 py-6 bg-white rounded-lg shadow-lg flex flex-col">
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
                  className=" font-medium  text-[#3D3D3D] opacity-80"
                >
                  Edit Store
                </DialogTitle>
              </div>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="flex flex-col mt-4 gap-4">
                  <div className="w-full flex">
                    {/* Description Input Field */}
                    <Inputtext
                      type="text"
                      label="Store Name"
                      borderClassName=" border border-gray-400"
                      labelBackgroundColor="bg-white"
                      textColor="text-gray-500"
                      {...methods?.register("storename", {
                        required: "Store Name is required",
                      })}
                      errors={methods.formState.errors.storename}
                      placeholder="Storename"
                      variant="outline"
                    />
                  </div>
                  <div className="w-full flex mt-4">
                    {/* Description Input Field */}
                    <Inputtext
                      type="text"
                      label="Location"
                      borderClassName=" border border-gray-400"
                      labelBackgroundColor="bg-white"
                      textColor="text-gray-500"
                      {...methods?.register("location", {
                        required: "Location is required",
                      })}
                      errors={methods.formState.errors.location}
                      placeholder="Location"
                      variant="outline"
                    />
                  </div>
                  <div className="w-full flex mt-4">
                    {/* Description Input Field */}
                    <Inputtext
                      type="text"
                      label="User"
                      borderClassName=" border border-gray-400"
                      labelBackgroundColor="bg-white"
                      textColor="text-gray-500"
                      {...methods?.register("user", {
                        required: "User is required",
                      })}
                      errors={methods.formState.errors.user}
                      placeholder="User"
                      variant="outline"
                    />
                  </div>
                  <div className="w-full flex mt-4">
                    {/* Description Input Field */}
                    <Inputtext
                      type="text"
                      label="County"
                      borderClassName=" border border-gray-400"
                      labelBackgroundColor="bg-white"
                      textColor="text-gray-500"
                      {...methods?.register("county", {
                        required: "County is required",
                      })}
                      errors={methods.formState.errors.county}
                      placeholder="County"
                      variant="outline"
                    />
                  </div>
                  <div className="w-full flex mt-4">
                    {/* Description Input Field */}
                    <Inputtext
                      type="text"
                      label="Royalty"
                      borderClassName=" border border-gray-400"
                      labelBackgroundColor="bg-white"
                      textColor="text-gray-500"
                      {...methods?.register("royalty", {
                        required: "Royalty is required",
                      })}
                      errors={methods.formState.errors.royalty}
                      placeholder="Royalty"
                      variant="outline"
                    />
                  </div>
           

                  <div className="flex flex-col items-center py-4">
                    <div className="flex justify-between gap-3 items-center w-full">
                      <button
                        type="button"
                        className="px-4 py-2 below-md:px-2 md:py-1 text-[14px] text-[#6F6F6F] md:h-[35px] w-[165px] hover:bg-[#C9C9C9] bg-[#E4E4E4] rounded-md"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-white md:text[13px] text-[14px] md:h-[35px] w-[165px] bg-[#168A6F] hover:bg-[#11735C] rounded-md "
                      >
                        Update
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

export default AddStore;

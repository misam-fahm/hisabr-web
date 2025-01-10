"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle, Button } from "@headlessui/react";
import { FormProvider, useForm } from "react-hook-form";
import { InputField } from "../../UI/Themes/InputField";

const EditCategories = ({ rowData }: { rowData: any }) => {
  const methods = useForm({
    defaultValues: {
      categoryname: rowData?.categoryname || "",
      description: rowData?.description || "",
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    // Update default values when rowData changes
    methods.reset({
      categoryname: rowData?.categoryname || "",
      description: rowData?.description || "",
    });
  }, [rowData, methods]);

  const onSubmit = (data: any) => {
    console.log("Form Data Submitted:", data);
    closeModal();
  };

  return (
    <>
      {/* Edit Button */}
      <div>
        <Button onClick={openModal}>
          <img
            src="/images/editpencilicon.svg"
            alt="Edit icon"
            className="w-4 h-4 below-md:w-5 below-md:h-5"
          />
        </Button>
      </div>

      {/* Dialog for the Modal */}
      <Dialog open={isOpen} as="div" className="relative z-50" onClose={closeModal}>
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-[335px] below-md:w-[345px] h-auto px-6 py-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-end">
              <DialogTitle as="h3" className="font-medium text-gray-900">
                Edit Category
              </DialogTitle>
              <img
                onClick={closeModal}
                src="/images/cancelicon.svg"
                alt="Close"
                className="cursor-pointer"
              />
            </div>
            <div>
            <DialogTitle as="h3" className=" flex justify-center font-medium  text-[#3D3D3D] opacity-80">
                Edit  Category
              </DialogTitle>
            </div>

            {/* Form Section */}
            <div className="mt-4">
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                  <div className="flex flex-col gap-4">
                    {/* Category Name Input */}
                    <InputField
                      type="text"
                      label="Category Name"
                      borderClassName="border border-gray-400"
                      labelBackgroundColor="bg-white"
                      value={methods.watch("categoryname")}
                      textColor="text-gray-500"
                      {...methods.register("categoryname", {
                        required: "Category name is required",
                      })}
                      errors={methods.formState.errors.categoryname}
                      placeholder="Category Name"
                      variant="outline"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        methods.setValue("categoryname", e.target.value)
                      }
                    />

                    {/* Description Input */}
                    <InputField
                      type="text"
                      label="Description"
                      borderClassName="border border-gray-400"
                      labelBackgroundColor="bg-white"
                      value={methods.watch("description")}
                      textColor="text-gray-500"
                      {...methods.register("description", {
                        required: "Description is required",
                      })}
                      errors={methods.formState.errors.description}
                      placeholder="Description"
                      variant="outline"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        methods.setValue("description", e.target.value)
                      }
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex mt-7 justify-between">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="mr-4 px-4 py-2 h-[35px] w-[165px] bg-[#E4E4E4] hover:bg-[#C9C9C9] font-semibold text-[14px] rounded-md text-[#6F6F6F]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="font-semibold text-[14px] bg-[#1AA47D] w-[165px] px-6 hover:bg-[#168A68] h-[35px] text-[#FFFFFF] rounded-md"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </FormProvider>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default EditCategories;

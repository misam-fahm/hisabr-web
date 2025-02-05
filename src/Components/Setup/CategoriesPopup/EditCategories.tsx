"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle, Button } from "@headlessui/react";
import { FormProvider, useForm } from "react-hook-form";
import { InputField } from "../../UI/Themes/InputField";
import ToastNotification, { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";
import { sendApiRequest } from "@/utils/apiUtils";

interface JsonData {
  mode: string;
  categoryname: string;
  description: string;
  categoryid: number;
}

const EditCategories = ({ rowData, setAddCategories }: any) => {
  const methods = useForm<any>({
    defaultValues: rowData,
  });

  const [categoryNameData, setCategoryName] = useState(rowData?.categoryname);
  const [descriptionData, setDescription] = useState(rowData?.description);
  const [isOpen, setIsOpen] = useState(false);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleChange = (data: any) => {
    setCategoryName(data);
    methods.setValue("categoryname", data);
  };

  const handleChangeName = (data: any) => {
    setDescription(data); // Update local state
    methods.setValue("description", data);
  };

  const onSubmit = async (data: any) => {

    const jsonData: JsonData = {
      mode: "updateCategory",
      categoryname: data?.categoryname,
      description: data?.description,
      categoryid: Number(data?.categoryid)
    };


    try {
      const result: any = await sendApiRequest(jsonData);
      const { status } = result;
      setCustomToast({
        message:
          status === 200 ? "Item updated successfully!" : "Failed to add item.",
        type: status === 200 ? "success" : "error",
      });

      if (status === 200) {
        setCustomToast({
          message: status === 200 ? "Item updated successfully!" : "Failed to add item.",
          type: status === 200 ? "success" : "error",
        });
        setTimeout(() => {
          setAddCategories(true);
          closeModal();
        }, 300);
      };


    } catch (error) {
      setCustomToast({ message: "Error adding item", type: "error" });
      console.error("Error submitting form:", error);
    }

  };

  return (
    <>
      <ToastNotification
        message={customToast.message}
        type={customToast.type}
      />
      {/* Edit Button */}
      <div>
        <Button onClick={openModal}>
          <img
            src="/images/editpencilicon.svg"
            alt="Edit icon"
            className="flex justify-center items-center w-4 h-4 below-md:w-5 below-md:h-5"
          />
        </Button>
      </div>

      {/* Dialog for the Modal */}
      <Dialog open={isOpen} as="div" className="relative z-50" onClose={closeModal}>
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-[335px] below-md:w-[345px] h-auto px-6 py-6 bg-white rounded-lg shadow-lg">
            <div className="relative">
              <div className="flex justify-center">
                <DialogTitle
                  as="h3"
                  className="text-[16px]  font-bold leading-custom text-[#3D3D3D]"
                >
                  Edit Category
                </DialogTitle>
              </div>
              <img
                onClick={closeModal}
                src="/images/cancelicon.svg"
                alt="Cancel"
                className="absolute top-1.5 right-0 cursor-pointer"
              />

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
                      borderClassName="border border-gray-300"
                      labelBackgroundColor="bg-white"
                      value={categoryNameData}
                      textColor="text-[#636363]"
                      {...methods.register("categoryname", {
                        required: "Category name is required",
                      })}
                      errors={methods.formState.errors.categoryname}
                      placeholder="Category Name"
                      variant="outline"
                      onChange={(e: any) => handleChange(e.target.value)}
                    />

                    {/* Description Input */}
                    <InputField
                      type="text"
                      label="Description"
                      borderClassName="border border-gray-300"
                      labelBackgroundColor="bg-white"
                      value={descriptionData}
                      textColor="text-[#636363]"
                      {...methods.register("description", {
                        required: "Description is required",
                      })}
                      errors={methods.formState.errors.description}
                      placeholder="Description"
                      variant="outline"
                      onChange={(e: any) => handleChangeName(e.target.value)}
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

"use client";

import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { sendApiRequest } from "@/utils/apiUtils";
import ToastNotification, { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";
import { FormProvider, useForm } from "react-hook-form";
import { InputField } from "@/Components/UI/Themes/InputField";

interface JsonData {
  mode: string;
  dq_category_name: string;
}

interface CustomToast {
  toastMessage: string;
  toastType: string;
}

const AddDQCategories = ({ setAddDQCategories }: any) => {
  const methods = useForm();
  const [dqCategoryName, setDqCategoryName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [customToast, setCustomToast] = useState<CustomToast>({
    toastMessage: "",
    toastType: "",
  });

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setDqCategoryName(""); // Reset the input field when modal is closed
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDqCategoryName(e.target.value); // Update state with the new value
  };

  const onSubmit = async (data: any) => {
    try {
      setCustomToast({ toastMessage: "", toastType: "" });
      const jsonData: JsonData = {
        mode: "insertDQCategory",
        dq_category_name: dqCategoryName.trim(),
      };

      const result: any = await sendApiRequest(jsonData);
      setTimeout(() => {
        setCustomToast({
          toastMessage: result?.status === 200 ? "DQ Category added successfully!" : "Failed to add DQ category.",
          toastType: result?.status === 200 ? "success" : "error",
        });
      }, 0);

      if (result?.status === 200) {
        setDqCategoryName("");
        closeModal();
        setAddDQCategories(true); // Trigger data refresh in the parent component
      }
    } catch (error: any) {
      setTimeout(() => {
        setCustomToast({
          toastMessage: error?.message,
          toastType: "error",
        });
      }, 0);
    }
  };

  return (
    <>
      <ToastNotification
        message={customToast.toastMessage}
        type={customToast.toastType}
      />
      <div className="hidden below-md:block justify-end fixed bottom-16 right-5">
        <button
          onClick={openModal}
          className="focus:outline-none flex items-center justify-center bg-[#168A6F] w-[56px] h-[56px] rounded-xl relative"
        >
          <img
            src="/images/webaddicon.svg"
            alt="Add Button"
            className="w-[18px]"
          />
        </button>
      </div>
      <div className="block below-md:hidden">
        <button
          onClick={openModal}
          className="shadow-lg bg-[#168A6F] hover:bg-[#11735C] text-white w-[159px] text-[13px] gap-[0.25rem] font-medium h-[35px] rounded-md flex items-center justify-center"
        >
          <img src="/images/plus1.svg" alt="Add icon" />
          Add DQ Category
        </button>
      </div>

      <Dialog
        open={isOpen}
        as="div"
        className="relative z-50"
        onClose={closeModal}
      >
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-[335px] below-md:w-[345px] h-auto px-6 py-6 bg-white rounded-lg shadow-lg">
            <div className="relative">
              <div className="flex justify-center">
                <DialogTitle
                  as="h3"
                  className="text-[16px] font-bold leading-custom text-[#3D3D3D]"
                >
                  Add DQ Category
                </DialogTitle>
              </div>
              <img
                onClick={closeModal}
                src="/images/cancelicon.svg"
                alt="Cancel"
                className="absolute top-1.5 right-0 cursor-pointer"
              />
            </div>

            <div className="mt-4">
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                  <div className="flex flex-col gap-5">
                    <InputField
                      type="text"
                      label="DQ Category Name"
                      borderClassName="border border-gray-300"
                      labelBackgroundColor="bg-white"
                      value={dqCategoryName} // Bind value to state
                      textColor="text-[#636363]"
                      {...methods.register("dq_category_name", {
                        required: "DQ Category name is required",
                      })}
                      errors={methods.formState.errors.dq_category_name}
                      placeholder="DQ Category Name"
                      variant="outline"
                      onChange={handleChange} // Use the correct onChange handler
                    />
                  </div>

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
                      Save
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

export default AddDQCategories; 
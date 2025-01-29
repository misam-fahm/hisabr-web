"use client";

import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Button } from "@headlessui/react";
import { sendApiRequest } from "@/utils/apiUtils";
import ToastNotification, { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";
import { FormProvider, useForm } from "react-hook-form";
import { InputField } from "@/Components/UI/Themes/InputField";

interface JsonData {
  mode: string;
  categoryname: string;
  description: string;
}

interface CustomToast {
  toastMessage: string;
  toastType: string;
}

const AddCategories = ({ setAddCategories }:any) => {
  const methods = useForm();
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  //const [errors, setErrors] = useState({ categoryName: "", description: "" });
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const [customToast, setCustomToast] = useState<CustomToast>({
    toastMessage: "",
    toastType: "",
  });


  const handleChange = (data: any) => {
    setCategoryName(data); 
    methods.setValue("categoryname", data); 
  };
  const handleChangeName = (data: any) => {
    setDescription(data); // Update local state
    methods.setValue("description", data);
  };

  // const handleInputChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   field: string
  // ) => {
  //   const { value } = e.target;

  //   if (field === "categoryName") {
  //     setCategoryName(value);
  //     if (value.trim())
  //       setErrors((prevErrors) => ({ ...prevErrors, categoryName: "" }));
  //   } else if (field === "description") {
  //     setDescription(value);
  //     if (value.trim())
  //       setErrors((prevErrors) => ({ ...prevErrors, description: "" }));
  //   }
  // };

  // const validateForm = () => {
  //   let isValid = true;
  //   const newErrors = { categoryName: "", description: "" };

  //   if (!categoryName.trim()) {
  //     newErrors.categoryName = "Category name is required";
  //     isValid = false;
  //   }

  //   if (!description.trim()) {
  //     newErrors.description = "Description is required";
  //     isValid = false;
  //   }

  //   setErrors(newErrors);
  //   return isValid;
  // };
 const onSubmit = async (data: any) => {
    try {
            setCustomToast({ toastMessage: "", toastType: "" });
            const jsonData: JsonData = {
              mode: "insertcategory",
              categoryname: categoryName.trim(),
              description: description.trim(),
            };
    
            const result: any = await sendApiRequest(jsonData);
            setTimeout(() => {
              setCustomToast({
                toastMessage: result?.status === 200 ? "Category added successfully!" : "Failed to add category.",
                toastType: result?.status === 200 ? "success" : "error",
              });
            }, 0);
    
            if (result?.status === 200) {
              setCategoryName("");
              setDescription("");
              closeModal();
              setAddCategories(true)
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
 
  
  //   if (validateForm()) {
  //     // Prepare JSON object to send
  //     try {
  //       setCustomToast({ toastMessage: "", toastType: "" });
  //       const jsonData: JsonData = {
  //         mode: "insertcategory",
  //         categoryname: categoryName.trim(),
  //         description: description.trim(),
  //       };

  //       const result: any = await sendApiRequest(jsonData);
  //       // Delay setting the actual toast message to force re-render
  //       setTimeout(() => {
  //         setCustomToast({
  //           toastMessage: result?.status === 200 ? "Category added successfully!" : "Failed to add category.",
  //           toastType: result?.status === 200 ? "success" : "error",
  //         });
  //       }, 0); // Set delay to 0 to immediately execute after state change

  //       if (result?.status === 200) {
  //         setCategoryName("");
  //         setDescription("");
  //         closeModal();
  //       }
  //     } catch (error: any) {
  //       // Handle errors by displaying a toast with the error message
  //       setTimeout(() => {
  //         setCustomToast({
  //           toastMessage: error?.message,
  //           toastType: "error",
  //         });
  //       }, 0);
  //     }
  //   }
   

  return (
    <>
      <ToastNotification
        message={customToast.toastMessage}
        type={customToast.toastType}
      />
      <div className="hidden below-md:block justify-end fixed bottom-5 right-5">
        <button
          onClick={openModal}
          className="focus:outline-none flex items-center justify-center bg-[#1AA47D] w-[56px] h-[56px] rounded-lg relative"
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
          className=" shadow-lg bg-[#168A6F] hover:bg-[#11735C] text-white  w-[159px] text-[13px] gap-[0.25rem] font-medium h-[35px] rounded-md flex items-center justify-center "
        >
          <img src="/images/plus1.svg" alt="Add icon" />
          Add Category
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
          <DialogPanel className="w-[335px] below-md:w-[345px] h-auto px-6 py-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-end">

              <img
                onClick={closeModal}
                src="/images/cancelicon.svg"
                alt=""
                className="cursor-pointer"
              />
            </div>
            <div>
              <DialogTitle as="h3" className="flex justify-center font-medium  text-[#3D3D3D] opacity-80">
                Add Category
              </DialogTitle>
            </div>

            <div className="mt-4">
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                  <div className="flex flex-col gap-5">
                    {/* Category Name Input */}
                    <InputField
                      type="text"
                      label="Category Name"
                      borderClassName="border border-gray-300"
                      labelBackgroundColor="bg-white"
                      value={categoryName}
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
                      value={description}
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

export default AddCategories;

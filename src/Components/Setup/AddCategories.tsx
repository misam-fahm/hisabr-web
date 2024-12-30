"use client";

import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Button } from "@headlessui/react";
import { sendApiRequest } from '../../utils/apiUtils';
import ToastNotification from "../ui/ToastNotification/ToastNotification";

interface JsonData {
  mode: string;
  categoryname: string;
  description: string;
}

interface CustomToast {
  toastMessage: string;
  toastType: string;
}

const AddCategories = () => {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({ categoryName: "", description: "" });

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const [customToast, setCustomToast] = useState<CustomToast>({ toastMessage: "", toastType: "" });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const { value } = e.target;

    if (field === "categoryName") {
      setCategoryName(value);
      if (value.trim())
        setErrors((prevErrors) => ({ ...prevErrors, categoryName: "" }));
    } else if (field === "description") {
      setDescription(value);
      if (value.trim())
        setErrors((prevErrors) => ({ ...prevErrors, description: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { categoryName: "", description: "" };

    if (!categoryName.trim()) {
      newErrors.categoryName = "Category name is required";
      isValid = false;
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Prepare JSON object to send
    const jsonData: JsonData = {
      mode: "insertcategory",
      categoryname: categoryName.trim(),
      description: description.trim(),
    };

    const result: any = await sendApiRequest(jsonData);
    result?.status === 200 ?
      setCustomToast({ ...customToast, toastMessage: "Category added successfully!", toastType: "success" }) :
      setCustomToast({ ...customToast, toastMessage: "Failed to add category.", toastType: "error" });
      setCategoryName("");
      setDescription("");
      closeModal();
    }
  };

  return (
    <>
    <ToastNotification message={customToast.toastMessage} type={customToast.toastType} />
      <div className="block below-md:hidden">
        <button
          onClick={openModal}
          className="bg-[#1AA47D] text-white  w-[159px] text-[14px] gap-[0.25rem] font-medium h-[35px] rounded-md flex items-center justify-center "
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
          <DialogPanel className="w-[420px] below-md:w-[345px] h-auto px-6 py-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between">
              <DialogTitle as="h3" className="font-medium text-gray-900">
                Add Category
              </DialogTitle>
              <img
                onClick={closeModal}
                src="/images/cancelicon.svg"
                alt=""
                className="cursor-pointer"
              />
            </div>

            <div className="mt-4">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm text-gray-600">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={categoryName}
                      onChange={(e) => handleInputChange(e, "categoryName")}
                      className={`h-[42px] mt-2 pl-2 w-full text-gray-700 text-sm font-medium rounded-lg border ${
                        errors.categoryName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Please enter Category Name"
                    />
                    {errors.categoryName && (
                      <p className="text-xs text-red-500">
                        {errors.categoryName}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm text-gray-600">Description</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => handleInputChange(e, "description")}
                      className={`h-[42px] mt-2 pl-2 w-full text-gray-700 text-sm font-medium rounded-lg border ${
                        errors.description
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Please enter Description"
                    />
                    {errors.description && (
                      <p className="text-xs text-red-500">
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex mt-7 justify-between">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mr-4 px-4 py-2 h-[37px] w-[165px] bg-[#E4E4E4] font-semibold text-[14px] rounded-md text-[#6F6F6F]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="font-semibold text-[14px] bg-[#1AA47D] w-[165px] px-6 hover:bg-[#168A68] h-[37px] text-[#FFFFFF] rounded-md"
                  >
                    Add Category
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

export default AddCategories;
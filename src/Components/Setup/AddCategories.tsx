"use client";

import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Button } from "@headlessui/react";
import "react-datepicker/dist/react-datepicker.css";

const AddCategories = () => {
  const [categoryName, setCategoryName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({ categoryName: "" });

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleInputChange = (e: { target: { value: any } }) => {
    const { value } = e.target;
    setCategoryName(value);

    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, categoryName: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!categoryName.trim()) {
      newErrors.categoryName = "Category name is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (validateForm()) {
      // Form is valid, proceed with submission
      console.log("Category added:", categoryName);
      closeModal();
    }
  };

  return (
    <>
      <div>
        <Button
          onClick={openModal}
          className="font-semibold text-[14px] bg-[#1AA47D] px-6 hover:bg-[#168A68]  h-[37px] text-[#FFFFFF] rounded-md"
        >
          Add New Category
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
          <DialogPanel className="w-[420px] h-auto px-6 py-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between">
              <DialogTitle as="h3" className="font-medium text-gray-900">
                Add Item Category
              </DialogTitle>
              <img onClick={closeModal} src="/images/cancelicon.svg" alt="" />
            </div>

            <div className="mt-4">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-8 mb-4">
                  <div className="col-span-2">
                    <label className="text-sm text-gray-600">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={categoryName}
                      onChange={handleInputChange}
                      className={`h-[42px] mt-2 pl-2 w-full text-gray-700 text-sm font-medium rounded-lg border ${
                        errors.categoryName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Please enter Category name"
                    />
                    {errors.categoryName && (
                      <p className="text-xs text-red-500">
                        {errors.categoryName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex mt-7 justify-between">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mr-4 px-4 py-2 h-[37px] w-[165px] bg-[#c8c8c8] font-semibold text-[14px] rounded-md text-[#6F6F6F]"
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

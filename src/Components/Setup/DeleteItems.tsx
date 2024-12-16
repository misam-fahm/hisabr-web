"use client";

import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Button } from "@headlessui/react";
import "react-datepicker/dist/react-datepicker.css";

const DeleteItems = () => {
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
        <Button onClick={openModal}>
          <img
            src="/images/delete.svg"
            alt="Add icon"
            className="flex justify-center ml-5"
            width={35}
            height={35}
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
          <DialogPanel className="w-[420px]  below-md:w-[345px] h-auto px-6 py-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-end">
              <img
                onClick={closeModal}
                src="/images/cancelicon.svg"
                alt=""
                className="cursor-pointer"
              />
            </div>
            <div>
              <DialogTitle
                as="h3"
                className=" flex justify-center text-[#5E6366] font font-bold text-[20px]"
              >
                Delete Item
              </DialogTitle>
              <div className="flex flex-col mt-4 justify-center items-center text-[#5E6366] font-medium text-[15px]">
                <p>Are you sure you want to delete this item?</p>
                <p>This action cannot be undone.</p>
              </div>
            </div>

            <div className="mt-4">
              <form onSubmit={handleSubmit}>
                

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
                    onClick={closeModal}
                    className="font-semibold text-[14px]  bg-[#CD6D6D] w-[165px] px-6  h-[37px] text-[#FFFFFF] rounded-md"
                  >
                    Delete
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

export default DeleteItems;

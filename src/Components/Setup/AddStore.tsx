"use client";

import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Button } from "@headlessui/react";

import "react-datepicker/dist/react-datepicker.css";

const AddStore = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    storeName: "",
    location: "",
    user: "",
    county: "",
    royalty: "",
  });
  const [errors, setErrors] = useState({
    storeName: "",
    location: "",
    user: "",
    county: "",
    royalty: "",
  });

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setFormData({
      storeName: "",
      location: "",
      user: "",
      county: "",
      royalty: "",
    });
    setErrors({
      storeName: "",
      location: "",
      user: "",
      county: "",
      royalty: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error dynamically
    if (value.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      storeName: "",
      location: "",
      county: "",
      user: "",
      royalty: "",
    };

    if (!formData.storeName.trim()) {
      newErrors.storeName = "Store name is required";
      isValid = false;
    }

    if (!formData.location.trim()) {
      newErrors.location = "Store location is required";
      isValid = false;
    }
    if (!formData.county.trim()) {
      newErrors.county = "Store county is required";
      isValid = false;
    }

    if (!formData.user.trim()) {
      newErrors.user = "Store description is required";
      isValid = false;
    }

    if (!formData.royalty.trim()) {
      newErrors.royalty = "Store royalty is required";
      isValid = false;
    } else {
      const royaltyValue = Number(formData.royalty);
      if (isNaN(royaltyValue) || royaltyValue <= 0) {
        newErrors.royalty = "Royalty must be a positive number";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      // Form is valid, process the data
      const finalData = {
        ...formData,
        royalty: Number(formData.royalty), // Ensure royalty is a number
      };
      console.log("Store added:", finalData);
      closeModal();
    }
  };

  return (
    <>
      <div className="hidden below-md:block   ">
        <button
          onClick={openModal}
          className=" hover:gap-2 text-white w-[50px] hover:w-[159px] h-[50px] rounded-md  items-center justify-center overflow-hidden transition-all duration-10 group"
        >
          <img
            src="/images/addButton.svg"
            alt="Add Button"
            className="transition-opacity duration-10"
          />
        </button>
      </div>

      <div className=" below-md:hidden">
        <Button
          onClick={openModal}
          className="flex items-center justify-center font-semibold text-[14px] bg-[#1AA47D] w-[140px] below-md:w-[150px] hover:bg-[#168A68] h-[37px] text-[#FFFFFF] rounded-md gap-x-2"
        >
          <img src="/images/plus1.svg" alt="Add icon" className="w-3 h-3  " />
          Add Store
        </Button>
      </div>
      {/* Dialog for the modal */}
      <Dialog
        open={isOpen}
        as="div"
        className="relative z-50"
        onClose={closeModal}
      >
        <div className="fixed inset-0 bg-black bg-opacity-50 " />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-[420px] below-md:w-[345px] h-auto px-6 py-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between mb-4">
              <DialogTitle
                as="h3"
                className="font-medium border-none text-gray-900"
              >
                Add Store
              </DialogTitle>
              <img
                onClick={closeModal}
                src="/images/cancelicon.svg"
                alt=""
                className="cursor-pointer"
              />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="col-span-2">
                  <label className="text-sm text-gray-600">Store Name</label>
                  <input
                    type="text"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleInputChange}
                    className={`h-[42px] mt-1 pl-2 w-full text-gray-700 text-sm font-medium rounded-lg border ${
                      errors.storeName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Please enter Store name"
                  />
                  {errors.storeName && (
                    <p className="text-xs text-red-500">{errors.storeName}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="text-sm text-gray-600">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`h-[42px] mt-1 pl-2 w-full text-gray-700 text-sm font-medium rounded-lg border ${
                      errors.location ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Please enter Store Location"
                  />
                  {errors.location && (
                    <p className="text-xs text-red-500">{errors.location}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="text-sm text-gray-600">User</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.user}
                    onChange={handleInputChange}
                    className={`h-[42px] mt-1 pl-2 w-full text-gray-700 text-sm font-medium rounded-lg border ${
                      errors.user ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Please enter Store User"
                  />
                  {errors.user && (
                    <p className="text-xs text-red-500">{errors.user}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="text-sm text-gray-600">County</label>
                  <input
                    type="text"
                    name="royalty"
                    value={formData.royalty}
                    onChange={handleInputChange}
                    className={`h-[42px] mt-1 pl-2 w-full text-gray-700 text-sm font-medium rounded-lg border ${
                      errors.royalty ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Please enter Store County"
                  />
                  {errors.royalty && (
                    <p className="text-xs text-red-500">{errors.county}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-600">Royalty</label>
                  <input
                    type="text"
                    name="royalty"
                    value={formData.royalty}
                    onChange={handleInputChange}
                    className={`h-[42px] mt-1 pl-2 w-full text-gray-700 text-sm font-medium rounded-lg border ${
                      errors.royalty ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Please enter Store Royalty"
                  />
                  {errors.royalty && (
                    <p className="text-xs text-red-500">{errors.royalty}</p>
                  )}
                </div>
              </div>

              <div className="flex mt-5 justify-between">
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
                  Add Item
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default AddStore;

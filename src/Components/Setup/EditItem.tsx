"use client";

import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Button } from "@headlessui/react";

const EditItems = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    itemName: "",
    price: "",
    quantity: "",
    weight: "",
    selectedType: "",
  });

  const [errors, setErrors] = useState({
    itemName: "",
    price: "",
    quantity: "",
    weight: "",
    selectedType: "",
  });

  const [dropdownOpen, setDropdownOpen] = useState(false); // Added state for dropdown visibility

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setFormData({
      itemName: "",
      price: "",
      quantity: "",
      weight: "",
      selectedType: "",
    });
    setErrors({
      itemName: "",
      price: "",
      quantity: "",
      weight: "",
      selectedType: "",
    });
    setDropdownOpen(false); // Reset dropdown visibility when closing the modal
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (value) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      itemName: "",
      price: "",
      quantity: "",
      weight: "",
      selectedType: "",
    };
    let isValid = true;

    if (!formData.itemName) {
      newErrors.itemName = "Item name is required";
      isValid = false;
    }

    if (!formData.price || isNaN(Number(formData.price))) {
      newErrors.price = "Valid price is required";
      isValid = false;
    }

    if (!formData.quantity || isNaN(Number(formData.quantity))) {
      newErrors.quantity = "Valid quantity is required";
      isValid = false;
    }

    if (!formData.weight || isNaN(Number(formData.weight))) {
      newErrors.weight = "Valid weight is required";
      isValid = false;
    }

    if (!formData.selectedType) {
      newErrors.selectedType = " Categories is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Form submitted:", formData);
      closeModal();
    }
  };

  return (
    <>
      <div>
        <Button onClick={openModal}>
          <img
            src="/images/EditPencilIcon.svg"
            alt="Add icon"
            className="flex justify-center items-center w-4 h-4"
          />
        </Button>
      </div>

      <Dialog
        open={isOpen}
        as="div"
        className="relative z-50"
        onClose={closeModal}
      >
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-[420px] below-md:w-[344px] h-auto px-6 py-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between">
              <DialogTitle as="h3" className=" font-semibold text-gray-900">
                Edit Item
              </DialogTitle>
              <img
                onClick={closeModal}
                src="/images/cancelicon.svg"
                alt="Close"
                className="cursor-pointer"
              />
            </div>

            <form onSubmit={handleSubmit} className="pt-5">
              {/* Category dropdown */}
              <div className="mb-2 relative">
                <label className="text-sm text-gray-600">Category</label>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className={`h-[42px] mt-1 pl-2 pr-4 w-full text-sm font-normal rounded-lg border ${
                    errors.selectedType ? "border-red-500" : "border-gray-300"
                  } bg-white text-[#8D98AA] flex justify-between items-center`}
                >
                  {formData.selectedType || "Please select  Category"}
                  <img src="/images/dropdown1.svg" alt="dropdown1" />
                </button>
                {dropdownOpen && (
                  <ul className="absolute z-10 w-full text-[#8D98AA] mt-1 bg-white border  border-gray-300 rounded-lg shadow-lg">
                    {["Dairy", "Bakery", "Beverages", "Frozen Foods"].map(
                      (category) => (
                        <li
                          key={category}
                          onClick={() => {
                            setFormData((prevData) => ({
                              ...prevData,
                              selectedType: category,
                            }));
                            setErrors((prevErrors) => ({
                              ...prevErrors,
                              selectedType: "",
                            }));
                            setDropdownOpen(false);
                          }}
                          className="px-4 py-2 cursor-pointer border-b text-sm hover:text-white hover:bg-[#334155]"
                        >
                          {category}
                        </li>
                      )
                    )}
                  </ul>
                )}
                {errors.selectedType && (
                  <p className="text-xs text-red-500">{errors.selectedType}</p>
                )}
              </div>

              {/* Item Name */}
              <div className="mb-2">
                <label className="text-sm text-gray-600">Item Name</label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  className={`h-[42px] mt-1 pl-2 w-full text-sm  font-normal rounded-lg border ${
                    errors.itemName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Please enter Item Name"
                />
                {errors.itemName && (
                  <p className="text-xs text-red-500">{errors.itemName}</p>
                )}
              </div>

              {/* Price */}
              <div className="mb-2">
                <label className="text-sm text-gray-600">Price</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`h-[42px] mt-1 pl-2 w-full text-sm font-normal rounded-lg border ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Please enter Price"
                />
                {errors.price && (
                  <p className="text-xs text-red-500">{errors.price}</p>
                )}
              </div>

              {/* Quantity */}
              <div className="mb-2">
                <label className="text-sm text-gray-600">Quantity</label>
                <input
                  type="text"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className={`h-[42px] mt-1 pl-2 w-full text-sm font-normal rounded-lg border ${
                    errors.quantity ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Please enter Quantity"
                />
                {errors.quantity && (
                  <p className="text-xs text-red-500">{errors.quantity}</p>
                )}
              </div>

              {/* Weight */}
              <div className="mb-2">
                <label className="text-sm text-gray-600">Weight</label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className={`h-[42px] mt-1 pl-2 w-full text-sm font-normal rounded-lg border ${
                    errors.weight ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Please enter Weight"
                />
                {errors.weight && (
                  <p className="text-xs text-red-500">{errors.weight}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex mt-8 justify-between">
                <button
                  type="button"
                  onClick={closeModal}
                  className="mr-4 px-4 py-2 h-[35px] w-[165px] bg-[#E4E4E4] hover:bg-[#C9C9C9]  font-semibold text-[14px] rounded-md text-[#6F6F6F]"
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
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default EditItems;

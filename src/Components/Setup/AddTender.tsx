"use client";

import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Button } from "@headlessui/react";
import "react-datepicker/dist/react-datepicker.css";

const AddTender = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    commission: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    type: "",
    commission: "",
  });

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setFormData({ name: "", type: "", commission: "" });
    setErrors({ name: "", type: "", commission: "" });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear errors dynamically
    if (value.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", type: "", commission: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Tender name is required";
      isValid = false;
    }

    if (!formData.type.trim()) {
      newErrors.type = "Tender type is required";
      isValid = false;
    }

    if (!formData.commission.trim()) {
      newErrors.commission = "Commission is required";
      isValid = false;
    } else {
      const commissionValue = Number(formData.commission);
      if (isNaN(commissionValue) || commissionValue <= 0) {
        newErrors.commission = "Commission must be a positive number";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      // Form is valid, process submission
      const commissionValue = Number(formData.commission); // Ensure commission is a number
      const finalFormData = {
        ...formData,
        commission: commissionValue,
      };
      console.log("Tender added:", finalFormData);
      closeModal();
    }
  };

  return (
    <>
      <div>
        <Button
          onClick={openModal}
          className="font-semibold text-[14px] bg-[#1AA47D] hover:bg-[#168A68] h-[37px] text-[#FFFFFF] rounded-md"
        >
          Add Tender
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
          <DialogPanel className="w-[420px] h-auto px-6 py-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between">
              <DialogTitle as="h3" className="font-medium text-gray-900">
                Add Tender
              </DialogTitle>
              <img onClick={closeModal} src="/images/cancelicon.svg" alt="" />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="col-span-2">
                  <label className="text-sm text-gray-600">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`h-[42px] mt-1 pl-2 w-full text-gray-700 text-sm font-medium rounded-lg border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Please enter Tender name"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="text-sm text-gray-600">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className={`h-[42px] mt-1 pl-2 w-full text-sm font-medium rounded-lg border ${
                      errors.type ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="" disabled>
                      Please select Tender Type
                    </option>
                    <option value="visa">VISA</option>
                    <option value="amtex">Amtex</option>
                    <option value="discovery">Discovery</option>
                    <option value="mastercard">Mastercard</option>
                  </select>
                  {errors.type && (
                    <p className="text-xs text-red-500">{errors.type}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="text-sm text-gray-600">Commission</label>
                  <input
                    type="text"
                    name="commission"
                    value={formData.commission}
                    onChange={handleInputChange}
                    className={`h-[42px] mt-1 pl-2 w-full text-gray-700 text-sm font-medium rounded-lg border ${
                      errors.commission ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Please enter % of Commission"
                  />
                  {errors.commission && (
                    <p className="text-xs text-red-500">{errors.commission}</p>
                  )}
                </div>
              </div>

              <div className="flex mt-5 justify-between">
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
                  Add Tender
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default AddTender;

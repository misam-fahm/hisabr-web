"use client";

import React, { useState } from "react";

const Page = () => {
  const [formData, setFormData] = useState({
    selectedStore: "",
    monthlyRoyalty: "",
    laborSalary: "",
    rent: "",
    electricity: "",
    mortgage: "",
    otherExpenses: "",
  });

  const [errors, setErrors] = useState({
    selectedStore: "",
    monthlyRoyalty: "",
    laborSalary: "",
    rent: "",
    electricity: "",
    mortgage: "",
    otherExpenses: "",
  });

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
      selectedStore: "",
      monthlyRoyalty: "",
      laborSalary: "",
      rent: "",
      electricity: "",
      mortgage: "",
      otherExpenses: "",
    };
    let isValid = true;

    if (!formData.selectedStore) {
      newErrors.selectedStore = "Store selection is required.";
      isValid = false;
    }
    if (!formData.monthlyRoyalty || isNaN(Number(formData.monthlyRoyalty))) {
      newErrors.monthlyRoyalty = "Valid monthly royalty is required.";
      isValid = false;
    }
    if (!formData.laborSalary || isNaN(Number(formData.laborSalary))) {
      newErrors.laborSalary = "Valid labor/salary is required.";
      isValid = false;
    }
    if (!formData.rent || isNaN(Number(formData.rent))) {
      newErrors.rent = "Valid rent is required.";
      isValid = false;
    }
    if (!formData.electricity || isNaN(Number(formData.electricity))) {
      newErrors.electricity = "Valid electricity value is required.";
      isValid = false;
    }
    if (!formData.mortgage || isNaN(Number(formData.mortgage))) {
      newErrors.mortgage = "Valid mortgage is required.";
      isValid = false;
    }
    if (!formData.otherExpenses || isNaN(Number(formData.otherExpenses))) {
      newErrors.otherExpenses = "Valid other expenses value is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Form submitted successfully:", formData);
      setFormData({
        selectedStore: "",
        monthlyRoyalty: "",
        laborSalary: "",
        rent: "",
        electricity: "",
        mortgage: "",
        otherExpenses: "",
      });
      setErrors({
        selectedStore: "",
        monthlyRoyalty: "",
        laborSalary: "",
        rent: "",
        electricity: "",
        mortgage: "",
        otherExpenses: "",
      });
    }
  };

  return (
    <main className=" p-1">
      {/* Mobile View */}
      <div className="flex justify-center items-center my-16 p-4 md:hidden">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-xl">
          <p className="font-medium text-[#5E6366]">Add Configuration:</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Store Select */}
            <div className="w-full mt-4">
              <label className="block text-sm font-medium text-[#5E6366]">
                Store
              </label>
              <select
                name="selectedStore"
                value={formData.selectedStore}
                onChange={handleInputChange}
                className={`mt-1 block w-full border p-2 border-gray-300 rounded-md shadow-sm sm:text-sm ${
                  !formData.selectedStore ? "text-gray-400" : "text-gray-700"
                } ${errors.selectedStore ? "border-red-500" : ""}`}
              >
                <option value="" disabled>
                  Please select Store name
                </option>
                <option value="Store1">Store 1</option>
                <option value="Store2">Store 2</option>
                <option value="Store3">Store 3</option>
              </select>
              {errors.selectedStore && (
                <p className="text-xs text-red-500">{errors.selectedStore}</p>
              )}
            </div>

            {/* Monthly Royalty */}
            <div className="w-full">
              <label className="block text-sm font-medium text-[#5E6366]">
                Monthly Royalty
              </label>
              <input
                type="text"
                name="monthlyRoyalty"
                value={formData.monthlyRoyalty}
                onChange={handleInputChange}
                placeholder="Enter Monthly Royalty"
                className={`mt-1 block w-full border p-2 border-gray-300 rounded-md shadow-sm sm:text-sm ${
                  errors.monthlyRoyalty ? "border-red-500" : ""
                }`}
              />
              {errors.monthlyRoyalty && (
                <p className="text-xs text-red-500">{errors.monthlyRoyalty}</p>
              )}
            </div>

            {/* Labor Salary */}
            <div className="w-full">
              <label className="block text-sm font-medium text-[#5E6366]">
                Labor/Salary
              </label>
              <input
                type="text"
                name="laborSalary"
                value={formData.laborSalary}
                onChange={handleInputChange}
                placeholder="Enter Labor/Salary"
                className={`mt-1 block w-full border p-2 border-gray-300 rounded-md shadow-sm sm:text-sm ${
                  errors.laborSalary ? "border-red-500" : ""
                }`}
              />
              {errors.laborSalary && (
                <p className="text-xs text-red-500">{errors.laborSalary}</p>
              )}
            </div>

            {/* Rent */}
            <div className="w-full">
              <label className="block text-sm font-medium text-[#5E6366]">
                Rent
              </label>
              <input
                type="text"
                name="rent"
                value={formData.rent}
                onChange={handleInputChange}
                placeholder="Enter Rent"
                className={`mt-1 block w-full border p-2 border-gray-300 rounded-md shadow-sm sm:text-sm ${
                  errors.rent ? "border-red-500" : ""
                }`}
              />
              {errors.rent && (
                <p className="text-xs text-red-500">{errors.rent}</p>
              )}
            </div>

            {/* Electricity */}
            <div className="w-full">
              <label className="block text-sm font-medium text-[#5E6366]">
                Electricity
              </label>
              <input
                type="text"
                name="electricity"
                value={formData.electricity}
                onChange={handleInputChange}
                placeholder="Enter Electricity"
                className={`mt-1 block w-full border p-2 border-gray-300 rounded-md shadow-sm sm:text-sm ${
                  errors.electricity ? "border-red-500" : ""
                }`}
              />
              {errors.electricity && (
                <p className="text-xs text-red-500">{errors.electricity}</p>
              )}
            </div>

            {/* Mortgage */}
            <div className="w-full">
              <label className="block text-sm font-medium text-[#5E6366]">
                Mortgage
              </label>
              <input
                type="text"
                name="mortgage"
                value={formData.mortgage}
                onChange={handleInputChange}
                placeholder="Enter Mortgage"
                className={`mt-1 block w-full border p-2 border-gray-300 rounded-md shadow-sm sm:text-sm ${
                  errors.mortgage ? "border-red-500" : ""
                }`}
              />
              {errors.mortgage && (
                <p className="text-xs text-red-500">{errors.mortgage}</p>
              )}
            </div>

            {/* Other Expenses */}
            <div className="w-full">
              <label className="block text-sm font-medium text-[#5E6366]">
                Other Expenses
              </label>
              <input
                type="text"
                name="otherExpenses"
                value={formData.otherExpenses}
                onChange={handleInputChange}
                placeholder="Enter Other Expenses"
                className={`mt-1 block w-full border p-2 border-gray-300 rounded-md shadow-sm sm:text-sm ${
                  errors.otherExpenses ? "border-red-500" : ""
                }`}
              />
              {errors.otherExpenses && (
                <p className="text-xs text-red-500">{errors.otherExpenses}</p>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="w-full sm:w-auto bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#1AA47D] hover:bg-[#168A68] text-white font-medium py-2 px-4 rounded-md"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Web View */}
      <div className="justify-center items-center  p-8 hidden md:block">
        <div className="bg-white shadow-md rounded-lg p-6 w-full px-7">
          <div>
            <p className="font-medium text-[#5E6366]">Add Configuration:</p>
            <form onSubmit={handleSubmit}>
              <div className="flex gap-10 mt-4 py-4">
                <div className="w-[30%]">
                  <label className="block text-sm font-medium text-[#5E6366]">
                    Store
                  </label>
                  <select
                    name="selectedStore"
                    value={formData.selectedStore}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border p-2 border-gray-300 rounded-md  sm:text-sm ${
                      !formData.selectedStore
                        ? "text-gray-400"
                        : "text-gray-700"
                    } ${errors.selectedStore ? "border-red-500" : ""}`}
                  >
                    <option value="" disabled hidden>
                      Please select Store name
                    </option>
                    <option value="Store1">Store 1</option>
                    <option value="Store2">Store 2</option>
                    <option value="Store3">Store 3</option>
                  </select>

                  {errors.selectedStore && (
                    <p className="text-xs text-red-500">
                      {errors.selectedStore}
                    </p>
                  )}
                </div>

                {[
                  {
                    name: "monthlyRoyalty",
                    label: "Monthly Royalty",
                    placeholder: "Please enter Monthly Royalty",
                  },
                  {
                    name: "laborSalary",
                    label: "Labor/Salary",
                    placeholder: "Please enter Labor/Salary",
                  },
                ].map(({ name, label, placeholder }) => (
                  <div key={name} className="w-[30%]">
                    <label className="block text-sm font-medium text-[#5E6366]">
                      {label}
                    </label>
                    <input
                      type="text"
                      name={name}
                      value={formData[name as keyof typeof formData]}
                      onChange={handleInputChange}
                      placeholder={placeholder}
                      className={`mt-1 block w-full border p-2 border-gray-300 rounded-md shadow-sm sm:text-sm ${
                        errors[name as keyof typeof errors]
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    {errors[name as keyof typeof errors] && (
                      <p className="text-xs text-red-500">
                        {errors[name as keyof typeof errors]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-10 py-4">
                {[
                  {
                    name: "rent",
                    label: "Rent",
                    placeholder: "Please enter Rent",
                  },
                  {
                    name: "electricity",
                    label: "Electricity",
                    placeholder: "Please enter Electricity",
                  },
                  {
                    name: "mortgage",
                    label: "Mortgage",
                    placeholder: "Please enter Mortgage",
                  },
                ].map(({ name, label, placeholder }) => (
                  <div key={name} className="w-[30%]">
                    <label className="block text-sm font-medium text-[#5E6366]">
                      {label}
                    </label>
                    <input
                      type="text"
                      name={name}
                      value={formData[name as keyof typeof formData]}
                      onChange={handleInputChange}
                      placeholder={placeholder}
                      className={`mt-1 block w-full border p-2 border-gray-300 rounded-md shadow-sm sm:text-sm ${
                        errors[name as keyof typeof errors]
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    {errors[name as keyof typeof errors] && (
                      <p className="text-xs text-red-500">
                        {errors[name as keyof typeof errors]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-between py-4">
                <div className="w-[30%]">
                  <label className="block text-sm font-medium text-[#5E6366]">
                    Other Expenses
                  </label>
                  <input
                    type="text"
                    name="otherExpenses"
                    value={formData.otherExpenses}
                    onChange={handleInputChange}
                    placeholder="Please enter Other Expenses"
                    className={`mt-1 block w-full border p-2 border-gray-300 rounded-md shadow-sm sm:text-sm ${
                      errors.otherExpenses ? "border-red-500" : ""
                    }`}
                  />
                  {errors.otherExpenses && (
                    <p className="text-xs text-red-500">
                      {errors.otherExpenses}
                    </p>
                  )}
                </div>
                <div className="flex gap-4 mt-3 p-2 px-4">
                  <div>
                    <button
                      type="submit"
                      className="w-[145px] bg-[#1AA47D] hover:bg-[#168A68] text-white font-medium py-2 px-4 rounded-md"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;

"use client";
import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import "react-datepicker/dist/react-datepicker.css";
import Dropdown from "@/Components/UI/Themes/DropDown";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { InputField } from "@/Components/UI/Themes/InputField";

const AddNewItems = () => {
  const methods = useForm();

  const [packsize, setPacksize] = useState("");
  const [name, setName] = useState("");
  const [units, setUnits] = useState("");
  const [wight, setWeight] = useState("");

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  
  const handleChange = (field:any  , value:any) => {
    if (field === "packsize") setPacksize(value);
    if (field === "name") setName(value);
    if (field === "units") setUnits(value);
    if (field === "weight") setWeight(value);
    methods.setValue(field, value);
  };

  //Dropdown
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [isdqCategoryDropdownOpen, setIsDQCategoryDropdownOpen] = useState(false);
  const [iscogstrackingDropdownOpen, setIsCOGSTrackingDropdownOpen] = useState(false);
  const { register, setValue, handleSubmit, watch ,clearErrors,trigger} = methods;
  const toggleDropdownStore = () => {
    setIsStoreDropdownOpen((prev) => !prev);
  };
  const toggleDropdownDQCategory = () => {
    setIsDQCategoryDropdownOpen((prev) => !prev);
  };

  const toggleDropdownCOGSTracking = () => {
    setIsCOGSTrackingDropdownOpen((prev) => !prev);
  };
  const options = ["Dairy", "Bakery", "Beverages", "Frozen Foods"];
  const selectedStore = watch("category"); 
  const selectedDqCategory = watch("dqcategory"); 
  const selectedCOGSTracking = watch("cogstrackingcategory"); 


  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <div className="hidden below-md:block justify-end fixed bottom-5 right-5">
        <button
          onClick={openModal}
          className="focus:outline-none flex items-center justify-center bg-[#168A6F]  w-[56px] h-[56px] rounded-xl relative"
        >
          <img
            src="/images/WebAddIcon.svg"
            alt=" Add Store"
            className="w-[18px] h-[18px]"
          />
        </button>
      </div>
      <div className="block below-md:hidden">
        <button
          onClick={openModal}
          className="bg-[#168A6F] hover:bg-[#11735C] shadow-lg text-white w-[159px] text-[14px] gap-[0.25rem] font-medium h-[35px] rounded-md flex items-center justify-center"
        >
          <img className="" src="/images/WebAddIcon.svg" alt="" />
          Add Item
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
          <DialogPanel className="w-[335px] h-auto below-md:w-[94%] below-md:h-auto px-6 below-md:px-3 py-6 bg-white rounded-lg shadow-lg flex flex-col">
            <div className="relative">
              <img
                onClick={closeModal}
                src="/images/CancelIcon.svg"
                alt="Cancel"
                className="absolute top-0 right-0 cursor-pointer"
              />
              <div className="flex justify-center mt-1">
                <DialogTitle
                  as="h3"
                  className=" font-medium  text-[#3D3D3D] opacity-80"
                >
                  Add Item
                </DialogTitle>
              </div>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="flex flex-col mt-4 gap-6">
                <div className="w-full flex ">
                    <Dropdown
                      options={options}
                      selectedOption={selectedStore || "Category"} 
                      onSelect={(selectedOption) => {
                        setValue("category", selectedOption); 
                        setIsStoreDropdownOpen(false); 
                        clearErrors("type"); 
                      }}
                      isOpen={isStoreDropdownOpen}
                      toggleOpen={toggleDropdownStore}
                      widthchange="w-full"
                      {...methods.register("category", {
                        required: "Category is required",
                      })}
                      errors={methods.formState.errors.category} 
                    />
                  </div>
                  <div className="w-full flex ">
                    <Dropdown
                      options={options}
                      selectedOption={selectedDqCategory || "DQ Category"} 
                      onSelect={(selectedOption) => {
                        setValue("dqcategory", selectedOption); 
                        setIsStoreDropdownOpen(false); 
                        clearErrors("type"); 
                      }}
                      isOpen={isdqCategoryDropdownOpen}
                      toggleOpen={toggleDropdownDQCategory}
                      widthchange="w-full"
                      {...methods.register("dqcategory", {
                        required: "DQ Category should not be empty",
                      })}
                      // errors={methods.formState.errors.dqcategory} 
                    />
                  </div>
                  <div className="w-full flex ">
                    <Dropdown
                      options={options}
                      selectedOption={ selectedCOGSTracking || "COGS Tracking Category"} 
                      onSelect={(selectedOption) => {
                        setValue("cogstrackingcategory", selectedOption); 
                        setIsStoreDropdownOpen(false); 
                        clearErrors("type"); 
                      }}
                      isOpen={iscogstrackingDropdownOpen}
                      toggleOpen={toggleDropdownCOGSTracking}
                      widthchange="w-full"
                      {...methods.register("cogstrackingcategory", {
                        required: "COGS Tracking Category should not be empty",
                      })}
                      // errors={methods.formState.errors.cogstrackingcategory} 
                    />
                  </div>
                  <div className="w-full flex ">
                    {/* Description Input Field */}
                    <InputField
                      type="text"
                      label="Item Name"
                      borderClassName=" border border-gray-400"
                      labelBackgroundColor="bg-white"
                      value={name}
                      textColor="text-gray-500"
                      {...methods?.register("name", {
                        required: "Item Name is required",
                      })}
                      errors={methods.formState.errors.name}
                      placeholder="Name"
                      variant="outline"
                      onChange={(e:any) => handleChange("name", e.target.value)}
                    />
                  </div>
             
                  <div className="w-full flex ">
                    <InputField
                      type="text"
                      label="Pack Size"
                      borderClassName=" border border-gray-400"
                      labelBackgroundColor="bg-white"
                      value={packsize}
                      textColor="text-gray-500"
                      {...methods?.register("packsize", {
                        required: "Pack Size is required",
                      })}
                      // errors={methods.formState.errors.packsize}
                      placeholder="Pack Size"
                      variant="outline"
                      onChange={(e: any) =>handleChange("packsize", e.target.value)}
                    />
                  </div>
                  <div className="w-full flex ">
                    {/* Description Input Field */}
                    <InputField
                      type="text"
                      label="Units"
                      borderClassName=" border border-gray-400"
                      labelBackgroundColor="bg-white"
                      value={units}
                      textColor="text-gray-500"
                      {...methods?.register("units", {
                        required: "Units is required",
                      })}
                      // errors={methods.formState.errors.units}
                      placeholder="Units"
                      variant="outline"
                      onChange={(e: any) => handleChange("units", e.target.value)}
                    />
                  </div>

                  <div className="w-full flex">
                    {/* Description Input Field */}
                    <InputField
                      type="text"
                      label="Weight"
                      borderClassName=" border border-gray-400"
                      labelBackgroundColor="bg-white"
                      value={wight}
                      textColor="text-gray-500"
                      {...methods?.register("weight", {
                        required: "Weight is required",
                      })}
                      // errors={methods.formState.errors.weight}
                      placeholder="Weight"
                      variant="outline"
                      onChange={(e:any) => handleChange("weight", e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col items-center py-4">
                    <div className="flex justify-between gap-3 items-center w-full">
                      <button
                        type="button"
                        className="px-4 py-2 below-md:px-2 md:py-1 text-[14px] text-[#6F6F6F] md:h-[35px] w-[165px] hover:bg-[#C9C9C9] bg-[#E4E4E4] rounded-md"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-white md:text[13px] text-[14px] md:h-[35px] w-[165px] bg-[#168A6F] hover:bg-[#11735C] rounded-md "
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </FormProvider>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default AddNewItems;
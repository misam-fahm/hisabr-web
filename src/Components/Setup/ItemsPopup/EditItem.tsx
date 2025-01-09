// "use client";

// import React, { useState } from "react";
// import { Dialog, DialogPanel, DialogTitle, Button } from "@headlessui/react";

// const AddNewItems = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     itemName: "",
//     price: "",
//     quantity: "",
//     weight: "",
//     selectedType: "",
//   });

//   const [errors, setErrors] = useState({
//     itemName: "",
//     price: "",
//     quantity: "",
//     weight: "",
//     selectedType: "",
//   });

//   const [dropdownOpen, setDropdownOpen] = useState(false); // Added state for dropdown visibility

//   const openModal = () => setIsOpen(true);
//   const closeModal = () => {
//     setIsOpen(false);
//     setFormData({
//       itemName: "",
//       price: "",
//       quantity: "",
//       weight: "",
//       selectedType: "",
//     });
//     setErrors({
//       itemName: "",
//       price: "",
//       quantity: "",
//       weight: "",
//       selectedType: "",
//     });
//     setDropdownOpen(false); // Reset dropdown visibility when closing the modal
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));

//     if (value) {
//       setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {
//       itemName: "",
//       price: "",
//       quantity: "",
//       weight: "",
//       selectedType: "",
//     };
//     let isValid = true;

//     if (!formData.itemName) {
//       newErrors.itemName = "Item name is required";
//       isValid = false;
//     }

//     if (!formData.price || isNaN(Number(formData.price))) {
//       newErrors.price = "Valid price is required";
//       isValid = false;
//     }

//     if (!formData.quantity || isNaN(Number(formData.quantity))) {
//       newErrors.quantity = "Valid quantity is required";
//       isValid = false;
//     }

//     if (!formData.weight || isNaN(Number(formData.weight))) {
//       newErrors.weight = "Valid weight is required";
//       isValid = false;
//     }

//     if (!formData.selectedType) {
//       newErrors.selectedType = " Categories is required";
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (validateForm()) {
//       console.log("Form submitted:", formData);
//       closeModal();
//     }
//   };

//   return (
//     <>
//       <div className="hidden below-md:block justify-end fixed bottom-5 right-5">
//         <button
//           onClick={openModal}
//           className="focus:outline-none flex items-center justify-center bg-[#1AA47D] w-[56px] h-[56px] rounded-lg relative"
//         >
//           <img
//             src="/images/WebAddIcon.svg"
//             alt="Add Button"
//             className="w-[18px]"
//           />
//         </button>
//       </div>

//       <div className="block below-md:hidden">
//         <button
//           onClick={openModal}
//           className="bg-[#1AA47D] hover:bg-[#168A68] text-white w-[159px] text-[14px] gap-[0.25rem] font-medium h-[35px] rounded-md flex items-center justify-center"
//         >
//           <img src="/images/plus1.svg" alt="Add icon" />
//           Add Item
//         </button>
//       </div>
//       <Dialog
//         open={isOpen}
//         as="div"
//         className="relative z-50"
//         onClose={closeModal}
//       >
//         <div className="fixed inset-0 bg-black bg-opacity-50" />
//         <div className="fixed inset-0 flex items-center justify-center p-4">
//           <DialogPanel className="w-[420px] below-md:w-[344px] h-auto px-6 py-6 bg-white rounded-lg shadow-lg">
//             <div className="flex justify-between">
//               <DialogTitle as="h3" className=" font-semibold text-gray-900">
//                 Add Item
//               </DialogTitle>
//               <img
//                 onClick={closeModal}
//                 src="/images/cancelicon.svg"
//                 alt="Close"
//                 className="cursor-pointer"
//               />
//             </div>

//             <form onSubmit={handleSubmit} className="pt-5">
//               {/* Category dropdown */}
//               <div className="mb-2 relative">
//                 <label className="text-sm text-gray-600">Category</label>
//                 <button
//                   type="button"
//                   onClick={() => setDropdownOpen((prev) => !prev)}
//                   className={`h-[42px] mt-1 pl-2 pr-4 w-full text-sm font-normal rounded-lg border ${
//                     errors.selectedType ? "border-red-500" : "border-gray-300"
//                   } bg-white text-[#8D98AA] flex justify-between items-center`}
//                 >
//                   {formData.selectedType || "Please select  Category"}
//                   <img src="/images/dropdown1.svg" alt="dropdown1" />
//                 </button>
//                 {dropdownOpen && (
//                   <ul className="absolute z-10 w-full text-[#8D98AA] mt-1 bg-white border  border-gray-300 rounded-lg shadow-lg">
//                     {["Dairy", "Bakery", "Beverages", "Frozen Foods"].map(
//                       (category) => (
//                         <li
//                           key={category}
//                           onClick={() => {
//                             setFormData((prevData) => ({
//                               ...prevData,
//                               selectedType: category,
//                             }));
//                             setErrors((prevErrors) => ({
//                               ...prevErrors,
//                               selectedType: "",
//                             }));
//                             setDropdownOpen(false);
//                           }}
//                           className="px-4 py-2 cursor-pointer border-b text-sm hover:text-white hover:bg-[#334155]"
//                         >
//                           {category}
//                         </li>
//                       )
//                     )}
//                   </ul>
//                 )}
//                 {errors.selectedType && (
//                   <p className="text-xs text-red-500">{errors.selectedType}</p>
//                 )}
//               </div>

//               {/* Item Name */}
//               <div className="mb-2">
//                 <label className="text-sm text-gray-600">Item Name</label>
//                 <input
//                   type="text"
//                   name="itemName"
//                   value={formData.itemName}
//                   onChange={handleInputChange}
//                   className={`h-[42px] mt-1 pl-2 w-full text-sm  font-normal rounded-lg border ${
//                     errors.itemName ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="Please enter Item Name"
//                 />
//                 {errors.itemName && (
//                   <p className="text-xs text-red-500">{errors.itemName}</p>
//                 )}
//               </div>

//               {/* Price */}
//               <div className="mb-2">
//                 <label className="text-sm text-gray-600">Price</label>
//                 <input
//                   type="text"
//                   name="price"
//                   value={formData.price}
//                   onChange={handleInputChange}
//                   className={`h-[42px] mt-1 pl-2 w-full text-sm font-normal rounded-lg border ${
//                     errors.price ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="Please enter Price"
//                 />
//                 {errors.price && (
//                   <p className="text-xs text-red-500">{errors.price}</p>
//                 )}
//               </div>

//               {/* Quantity */}
//               <div className="mb-2">
//                 <label className="text-sm text-gray-600">Quantity</label>
//                 <input
//                   type="text"
//                   name="quantity"
//                   value={formData.quantity}
//                   onChange={handleInputChange}
//                   className={`h-[42px] mt-1 pl-2 w-full text-sm font-normal rounded-lg border ${
//                     errors.quantity ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="Please enter Quantity"
//                 />
//                 {errors.quantity && (
//                   <p className="text-xs text-red-500">{errors.quantity}</p>
//                 )}
//               </div>

//               {/* Weight */}
//               <div className="mb-2">
//                 <label className="text-sm text-gray-600">Weight</label>
//                 <input
//                   type="text"
//                   name="weight"
//                   value={formData.weight}
//                   onChange={handleInputChange}
//                   className={`h-[42px] mt-1 pl-2 w-full text-sm font-normal rounded-lg border ${
//                     errors.weight ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="Please enter Weight"
//                 />
//                 {errors.weight && (
//                   <p className="text-xs text-red-500">{errors.weight}</p>
//                 )}
//               </div>

//               {/* Buttons */}
//               <div className="flex mt-8 justify-between">
//                 <button
//                   type="button"
//                   onClick={closeModal}
//                   className="mr-4 px-4 py-2 h-[35px] w-[165px] bg-[#E4E4E4] hover:bg-[#C9C9C9]  font-semibold text-[14px] rounded-md text-[#6F6F6F]"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="font-semibold text-[14px] bg-[#1AA47D] w-[165px] px-6 hover:bg-[#168A68] h-[35px] text-[#FFFFFF] rounded-md"
//                 >
//                  Save
//                 </button>
//               </div>
//             </form>
//           </DialogPanel>
//         </div>
//       </Dialog>
//     </>
//   );
// };

// export default AddNewItems;


"use client";

import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import "react-datepicker/dist/react-datepicker.css";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { InputField } from "@/Components/UI/Themes/InputField";
import Dropdown from "@/Components/UI/Themes/DropDown";
const EditItems = () => {
  const methods = useForm();

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  const [price, setPrice] = useState("");
  const handleChange = (data: any) => {
    setPrice(data); // Update local state
    methods.setValue("price", data); // Update form state in react-hook-form
  };

  const [name, setName] = useState("");
  const handleChangeName = (data: any) => {
    setName(data); // Update local state
    methods.setValue("name", data); // Update form state in react-hook-form
  };


  const [quantity, setQuantity] = useState("");
  const handleChangeQuantity = (data: any) => {
    setQuantity(data); // Update local state
    methods.setValue("quantity", data); // Update form state in react-hook-form
  };

  const [wight, setWeight] = useState("");
  const handleChangeWeight = (data: any) => {
    setWeight(data); // Update local state
    methods.setValue("wight", data); // Update form state in react-hook-form
  };

  //Dropdown
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const { register, setValue, handleSubmit, watch ,clearErrors,trigger} = methods;
  const toggleDropdown1 = () => {
    setIsStoreDropdownOpen((prev) => !prev);
  };
  const options = ["Dairy", "Bakery", "Beverages", "Frozen Foods"];
  const selectedStore = watch("category"); // Watch the "store" field for changes

  const { control } = useForm(); // Initialize React Hook Form
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <div>
        <button onClick={openModal}>
          <img
            src="/images/EditPencilIcon.svg"
            alt="Add icon"
            className="flex justify-center items-center  w-4 h-4 below-md:w-5 below-md:h-5"
          />
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
                  Edit Item
                </DialogTitle>
              </div>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="flex flex-col mt-4 gap-4">
                <div className="w-full flex mt-4">
                    <Dropdown
                      options={options}
                      selectedOption={selectedStore || "Category"} // Watch the selected value
                      onSelect={(selectedOption) => {
                        setValue("category", selectedOption); // Update the form value
                        setIsStoreDropdownOpen(false); // Close dropdown after selection
                        clearErrors("type"); // Clear errors for this field
                      }}
                      isOpen={isStoreDropdownOpen}
                      toggleOpen={toggleDropdown1}
                      widthchange="w-full"
                      {...methods.register("category", {
                        required: "Category  is required",
                      })}
                      errors={methods.formState.errors.category} // Explicitly cast the type
                    />
                  </div>
                  <div className="w-full flex mt-4">
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
                      onChange={(e: any) => handleChangeName(e.target.value)}
                    />
                  </div>
             
                  <div className="w-full flex mt-4">
                    <InputField
                      type="text"
                      label="Price"
                      borderClassName=" border border-gray-400"
                      labelBackgroundColor="bg-white"
                      value={price}
                      textColor="text-gray-500"
                      {...methods?.register("price", {
                        required: "Price is required",
                      })}
                      errors={methods.formState.errors.price}
                      placeholder="Price"
                      variant="outline"
                      onChange={(e: any) => handleChange(e.target.value)}
                    />
                  </div>
                  <div className="w-full flex mt-4">
                    {/* Description Input Field */}
                    <InputField
                      type="text"
                      label="Quantity"
                      borderClassName=" border border-gray-400"
                      labelBackgroundColor="bg-white"
                      value={name}
                      textColor="text-gray-500"
                      {...methods?.register("quantity", {
                        required: "Quantity is required",
                      })}
                      errors={methods.formState.errors.quantity}
                      placeholder="Quantity"
                      variant="outline"
                      onChange={(e: any) => handleChangeQuantity(e.target.value)}
                    />
                  </div>

                  <div className="w-full flex mt-4">
                    {/* Description Input Field */}
                    <InputField
                      type="text"
                      label="Weight"
                      borderClassName=" border border-gray-400"
                      labelBackgroundColor="bg-white"
                      value={name}
                      textColor="text-gray-500"
                      {...methods?.register("weight", {
                        required: "Weight is required",
                      })}
                      errors={methods.formState.errors.weight}
                      placeholder="Weight"
                      variant="outline"
                      onChange={(e: any) => handleChangeWeight(e.target.value)}
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
                      Update
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

export default EditItems;

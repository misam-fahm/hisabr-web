// "use client";

// import React, { useState } from "react";
// import { Dialog, DialogPanel, DialogTitle, Button } from "@headlessui/react";

// const EditTender = () => {
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

//     if (!formData.selectedType) {
//       newErrors.selectedType = "Tender type is required";
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
//       <div>
//         <Button onClick={openModal}>
//           <img
//             src="/images/EditPencilIcon.svg"
//             alt="Add icon"
//             className="flex justify-center items-center w-4 h-4"
//           />
//         </Button>
//       </div>

//       <Dialog
//         open={isOpen}
//         as="div"
//         className="relative z-50"
//         onClose={closeModal}
//       >
//         <div className="fixed inset-0 bg-black bg-opacity-50" />
//         <div className="fixed inset-0 flex items-center justify-center p-4">
//           <DialogPanel className="w-[420px]  below-md:w-[344px] h-auto px-6 py-6 bg-white rounded-lg shadow-lg">
//             <div className="flex justify-between">
//               <DialogTitle as="h3" className="font-medium text-gray-900">
//                 Edit Tender
//               </DialogTitle>
//               <img
//                 onClick={closeModal}
//                 src="/images/cancelicon.svg"
//                 alt="Close"
//                 className="cursor-pointer"
//               />
//             </div>

//             <form onSubmit={handleSubmit} className="mt-4">
//               <div className="mb-2">
//                 <label className="text-sm text-gray-600">Name</label>
//                 <input
//                   type="text"
//                   name="itemName"
//                   value={formData.itemName}
//                   onChange={handleInputChange}
//                   className={`h-[42px] mt-1 pl-2 w-full text-sm font-medium rounded-lg border ${
//                     errors.itemName ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="Please enter Tender Name"
//                 />
//                 {errors.itemName && (
//                   <p className="text-xs text-red-500">{errors.itemName}</p>
//                 )}
//               </div>
//               <div className="mb-2">
//                 <label className="text-sm text-gray-600">Type</label>
//                 <select
//                   name="selectedType"
//                   value={formData.selectedType}
//                   onChange={handleInputChange}
//                   className={`h-[42px] mt-1 pl-2 w-full text-sm font-medium rounded-lg border ${
//                     errors.selectedType ? "border-red-500" : "border-gray-300"
//                   }`}
//                 >
//                   <option value="" disabled>
//                     Please enter Tender Type
//                   </option>
//                   <option value="dairy">VISA</option>
//                   <option value="	bakery"> Amex</option>
//                   <option value="dairy">Discovery</option>
//                   <option value="	bakery"> Master</option>
//                 </select>
//                 {errors.selectedType && (
//                   <p className="text-xs text-red-500">{errors.selectedType}</p>
//                 )}
//               </div>

//               <div className="mb-2">
//                 <label className="text-sm text-gray-600">Commission</label>
//                 <input
//                   type="text"
//                   name="price"
//                   value={formData.price}
//                   onChange={handleInputChange}
//                   className={`h-[42px] mt-1 pl-2 w-full text-sm font-medium rounded-lg border ${
//                     errors.price ? "border-red-500" : "border-gray-300"
//                   }`}
//                   placeholder="Please enter % of Commission "
//                 />
//                 {errors.price && (
//                   <p className="text-xs text-red-500">{errors.price}</p>
//                 )}
//               </div>

//               <div className="flex mt-5 justify-between">
//                 <button
//                   type="button"
//                   onClick={closeModal}
//                   className="mr-4 px-4 py-2 h-[37px] w-[165px] bg-[#E4E4E4] font-semibold text-[14px] rounded-md text-[#6F6F6F]"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="font-semibold text-[14px] bg-[#1AA47D] w-[165px] px-6 hover:bg-[#168A68] h-[37px] text-[#FFFFFF] rounded-md"
//                 >
//                   Save
//                 </button>
//               </div>
//             </form>
//           </DialogPanel>
//         </div>
//       </Dialog>
//     </>
//   );
// };

// export default EditTender;

"use client";

import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Button } from "@headlessui/react";

const EditTender = () => {
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
      newErrors.itemName = "Name is required";
      isValid = false;
    }

    if (!formData.weight || isNaN(Number(formData.weight))) {
      newErrors.weight = "Commission is required";
      isValid = false;
    }

    if (!formData.selectedType) {
      newErrors.selectedType = " Tender type is required";
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
                Edit Tender
              </DialogTitle>
              <img
                onClick={closeModal}
                src="/images/cancelicon.svg"
                alt="Close"
                className="cursor-pointer"
              />
            </div>

            {/* Item Name */}
            <div className="mb-2 pt-4">
              <label className="text-sm text-gray-600">Name</label>
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

            <form onSubmit={handleSubmit}>
              {/* Category dropdown */}
              <div className="mb-2 relative">
                <label className="text-sm text-gray-600">Type</label>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className={`h-[42px] mt-1 pl-2 pr-4 w-full text-sm font-normal rounded-lg border ${
                    errors.selectedType ? "border-red-500" : "border-gray-300"
                  } bg-white text-[#8D98AA] flex justify-between items-center`}
                >
                  {formData.selectedType || "Please enter Tender Type"}
                  <img src="/images/dropdown1.svg" alt="dropdown1" />
                </button>
                {dropdownOpen && (
                  <ul className="absolute z-10 w-full text-[#8D98AA] mt-1 bg-white border  border-gray-300 rounded-lg shadow-lg">
                    {["VISA", "Amex", "Discovery", "Master"].map((category) => (
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
                    ))}
                  </ul>
                )}
                {errors.selectedType && (
                  <p className="text-xs text-red-500">{errors.selectedType}</p>
                )}
              </div>

              {/* Commission */}
              <div className="mb-2">
                <label className="text-sm text-gray-600">Commission</label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className={`h-[42px] mt-1 pl-2 w-full text-sm font-normal rounded-lg border ${
                    errors.weight ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Please enter % of Commission"
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
                  className="mr-4 px-4 py-2 h-[37px] w-[165px] bg-[#E4E4E4] font-semibold text-[14px] rounded-md text-[#6F6F6F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="font-semibold text-[14px] bg-[#168A6F] w-[165px] px-6 hover:bg-[#168A68] h-[37px] text-[#FFFFFF] rounded-md"
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

export default EditTender;

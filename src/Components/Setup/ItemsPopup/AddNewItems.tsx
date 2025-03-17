"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import "react-datepicker/dist/react-datepicker.css";
import Dropdown from "@/Components/UI/Themes/DropDown";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { InputField } from "@/Components/UI/Themes/InputField";
import { sendApiRequest } from "@/utils/apiUtils";
import ToastNotification, {
  ToastNotificationProps,
} from "@/Components/UI/ToastNotification/ToastNotification";

interface Category {
  id: number;
  name: string;
}

interface JsonData {
  mode: string;
  categoryid: number | null;
  itemname: string;
  itemcode: string;
  packsize: string;
  units: string ;
  weight: string;
  cogstrackcategoryid: number | null;
  dqcategoryid: number | null;
}

interface CustomToast {
  toastMessage: string;
  toastType: string;
}

const AddNewItems =  ({rowData , setAddItems}:any) => {
  const methods = useForm<any>();
  const { register, setValue, handleSubmit, watch, clearErrors, trigger, formState: { errors } } = methods;
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dqCategory, setDqCategory] = useState<Category[]>([]);
  const [cogstracking, setCogstracking] = useState<Category[]>([]);
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [isdqCategoryDropdownOpen, setIsDQCategoryDropdownOpen] = useState(false);
  const [iscogstrackingDropdownOpen, setIsCOGSTrackingDropdownOpen] = useState(false);
 const [customToast, setCustomToast] = useState<CustomToast>({
     toastMessage: "",
     toastType: "",
   });

     const [categorySearchTerm, setCategorySearchTerm] = useState("");
     const [dqCategorySearchTerm, setDqCategorySearchTerm] = useState("");
     const [cogsTrackingSearchTerm, setCogsTrackingSearchTerm] = useState("");
   
  const name = watch("name");
  const itemcode = watch("code");
  const units = watch("units");
  const weight = watch("weight");
  const packsize = watch("packsize");
  const selectedCategory = watch("category");
  const selectedDqCategory = watch("dqcategory");
  const selectedCOGSTracking = watch("cogstrackingcategory");

    // Filtered options for each dropdown
    const filteredCategories = categories.filter((option) =>
      option.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
    );
    const filteredDqCategories = dqCategory.filter((option) =>
      option.name.toLowerCase().includes(dqCategorySearchTerm.toLowerCase())
    );
    const filteredCogsTracking = cogstracking.filter((option) =>
      option.name.toLowerCase().includes(cogsTrackingSearchTerm.toLowerCase())
    );
  
  const openModal = () => setIsOpen(true);
  const closeModal = async () => {
    setIsOpen(false);
    methods.reset({
      categoryId: null,
      dqcategoryId: null,
      cogstrackingcategoryId: null,
      category: "",
      dqcategory: "",
      cogstrackingcategory: "",
      name: "",
      packsize: "",
      units: "",
      weight: "",
      itemcode: ""
    });
    setCategorySearchTerm("");
    setDqCategorySearchTerm("");
    setCogsTrackingSearchTerm("");
    
  };

  const onSubmit = async (data: any) => {
    setCustomToast({ toastMessage: "", toastType: "" });
    const jsonData: JsonData = {
      mode: "insertItem",
      categoryid: data?.categoryId,
      itemname: data?.name?.trim(),
      packsize: data?.packsize,
      units: data?.units,
      weight: data?.weight,
      cogstrackcategoryid: data?.cogstrackingcategoryId,
      dqcategoryid: data?.dqcategoryId,
      itemcode: data?.code
    };

    try {
      const result: any = await sendApiRequest(jsonData);
      const { status } = result;
      setTimeout(() => {
        setCustomToast({
          toastMessage:
            status === 200 ? "Item added successfully!" : "Failed to add item.",
            toastType: status === 200 ? "success" : "error",
        });
      }, 0);
      if (result?.status === 200) {
        closeModal();
        setAddItems(true)
      }
    } catch (error: any) {
      setTimeout(() => {
        setCustomToast({
          toastMessage: error?.message,
          toastType: "error",
        });
      }, 0);
    }
  }

  const toggleDropdownStore = () => {
    setIsStoreDropdownOpen((prev) => !prev);
  };

  const toggleDropdownDQCategory = () => {
    setIsDQCategoryDropdownOpen((prev) => !prev);
  };

  const toggleDropdownCOGSTracking = () => {
    setIsCOGSTrackingDropdownOpen((prev) => !prev);
  };

    // Handle keyboard input for filtering
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (isStoreDropdownOpen) {
          if (e.key === "Escape") {
            setIsStoreDropdownOpen(false);
            setCategorySearchTerm("");
          } else if (e.key.length === 1) {
            setCategorySearchTerm((prev) => prev + e.key);
          } else if (e.key === "Backspace") {
            setCategorySearchTerm((prev) => prev.slice(0, -1));
          }
        } else if (isdqCategoryDropdownOpen) {
          if (e.key === "Escape") {
            setIsDQCategoryDropdownOpen(false);
            setDqCategorySearchTerm("");
          } else if (e.key.length === 1) {
            setDqCategorySearchTerm((prev) => prev + e.key);
          } else if (e.key === "Backspace") {
            setDqCategorySearchTerm((prev) => prev.slice(0, -1));
          }
        } else if (iscogstrackingDropdownOpen) {
          if (e.key === "Escape") {
            setIsCOGSTrackingDropdownOpen(false);
            setCogsTrackingSearchTerm("");
          } else if (e.key.length === 1) {
            setCogsTrackingSearchTerm((prev) => prev + e.key);
          } else if (e.key === "Backspace") {
            setCogsTrackingSearchTerm((prev) => prev.slice(0, -1));
          }
        }
      };
  
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [isStoreDropdownOpen, isdqCategoryDropdownOpen, iscogstrackingDropdownOpen]);
  
    // Reset search terms when dropdowns close
    useEffect(() => {
      if (!isStoreDropdownOpen) setCategorySearchTerm("");
      if (!isdqCategoryDropdownOpen) setDqCategorySearchTerm("");
      if (!iscogstrackingDropdownOpen) setCogsTrackingSearchTerm("");
    }, [isStoreDropdownOpen, isdqCategoryDropdownOpen, iscogstrackingDropdownOpen]);
  
   useEffect(() => {
     const fetchDataCategoriesDropdown = async () => {
       try {
         const response: any = await sendApiRequest({ mode: "getAllCategories" });
         if (response?.status === 200) {
           setCategories(response?.data?.categories || []);
         } else {
           setCustomToast({
             ...customToast,
             toastMessage: response?.message,
             toastType: "error",
           });
         }
       } catch (error) {
         console.error("Error fetching data:", error);
       }
     };
 
     const fetchDataDQcategoryDropdown = async () => {
       try {
         const response: any = await sendApiRequest({ mode: "getAllDQCategory" });
         if (response?.status === 200) {
           setDqCategory([{ id: null, name: "None" }, ...(response?.data?.dqcategory || [])]);
         } else {
           setCustomToast({
             ...customToast,
             toastMessage: response?.message,
             toastType: "error",
           });
         }
       } catch (error) {
         console.error("Error fetching data:", error);
       }
     };
 
     const fetchDataCogstrackcategoryDropdown = async () => {
       try {
         const response: any = await sendApiRequest({ mode: "getAllCogsTrackCategory" });
         if (response?.status === 200) {
           setCogstracking([{ id: null, name: "None" }, ...(response?.data?.cogstrackcategory || [])]);
         } else {
           setCustomToast({
             ...customToast,
             toastMessage: response?.message,
             toastType: "error",
           });
         }
       } catch (error) {
         console.error("Error fetching data:", error);
       }
     };
 
    if(isStoreDropdownOpen ) {
      fetchDataCategoriesDropdown();
    }

    if( isdqCategoryDropdownOpen ) {
      fetchDataDQcategoryDropdown();
    }

    if( iscogstrackingDropdownOpen) {
      fetchDataCogstrackcategoryDropdown();
    }
  }, [isStoreDropdownOpen , isdqCategoryDropdownOpen , iscogstrackingDropdownOpen]);

  return (
    <>
      <ToastNotification
        message={customToast.toastMessage}
        type={customToast.toastType}
      />
      <div className="hidden below-md:block justify-end fixed bottom-16 right-5">
        <button
          onClick={openModal}
          className="focus:outline-none flex items-center justify-center bg-[#168A6F]  w-[56px] h-[56px] rounded-xl relative"
        >
          <img
            src="/images/webaddicon.svg"
            alt=" Add Store"
            className="w-[18px] h-[18px]"
          />
        </button>
      </div>
      <div className="block below-md:hidden">
        <button
          onClick={openModal}
          className="bg-[#168A6F] hover:bg-[#11735C] shadow-lg text-white w-[159px] text-[13px] gap-[0.25rem] font-medium h-[35px] rounded-md flex items-center justify-center"
        >
          <img className="" src="/images/webaddicon.svg" alt="" />
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
                <div className="flex justify-center">
                  <DialogTitle
                    as="h3"
                    className="text-[16px]  font-bold leading-custom text-[#3D3D3D]"
                  >
                    Add Item
                  </DialogTitle>
                </div>
                <img
                  onClick={closeModal}
                  src="/images/cancelicon.svg"
                  alt="Cancel"
                  className="absolute top-1.5 right-0 cursor-pointer"
                />  
              </div>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex flex-col mt-2 gap-3">
                    <div className="w-full flex ">
                    <Dropdown
                      options={filteredCategories}
                      label={selectedCategory ? "Category" : ""}
                      selectedOption={selectedCategory || "Category"}
                      onSelect={(selectedValue) => {
                        setValue("category", selectedValue?.name || "");
                        setValue("categoryId", selectedValue?.id);
                        setIsStoreDropdownOpen(false);
                        clearErrors("category");
                      }}
                      isOpen={isStoreDropdownOpen}
                      toggleOpen={toggleDropdownStore}
                      widthchange="w-full"
                      {...register("category", { required: "Category is required" })}
                      errors={errors.category}
                    />
                    </div>
                    <div className="w-full flex ">
                    <Dropdown
                      options={filteredDqCategories}
                      label={selectedDqCategory ? "DQ Category" : ""}
                      selectedOption={selectedDqCategory || "DQ Category"}
                      onSelect={(selectedOption: any) => {
                        setValue("dqcategory", selectedOption?.name || "");
                        setValue("dqcategoryId", selectedOption?.id);
                        setIsDQCategoryDropdownOpen(false);
                        clearErrors("dqcategory");
                      }}
                      isOpen={isdqCategoryDropdownOpen}
                      toggleOpen={toggleDropdownDQCategory}
                      widthchange="w-full"
                      {...methods.register("dqcategory")}
                      errors={errors.dqcategory}
                    />
                    </div>
                    <div className="w-full">
                    <Dropdown
                      options={filteredCogsTracking}
                      label={selectedCOGSTracking ? "COGS Category" : ""}
                      selectedOption={selectedCOGSTracking || "COGS Category"}
                      onSelect={(selected: any) => {
                        setValue("cogstrackingcategory", selected?.name || "");
                        setValue("cogstrackingcategoryId", selected?.id);
                        setIsCOGSTrackingDropdownOpen(false);
                        clearErrors("cogstrackingcategory");
                      }}
                      isOpen={iscogstrackingDropdownOpen}
                      toggleOpen={toggleDropdownCOGSTracking}
                      widthchange="w-full"
                      {...methods.register("cogstrackingcategory")}
                      errors={errors.cogstrackingcategory}
                    />
                    </div>
                    <div className="w-full flex">
                      <InputField
                        type="text"
                        label="Item Name"
                        borderClassName=" border border-gray-300"
                        labelBackgroundColor="bg-white"
                        value={name || ""}
                        
                        textColor="text-[#636363]"
                        {...register("name", {
                          required: "Item Name is required",
                        })}
                        errors={errors.name}
                        placeholder="Name"
                        variant="outline"
                        // onChange={(e:any) => handleChange("name", e.target.value)}
                      />
                    </div>
                    <div className="w-full flex">
                      <InputField
                        type="text"
                        label="Item Code"
                        borderClassName=" border border-gray-300"
                        labelBackgroundColor="bg-white"
                        value={itemcode || ""}
                        
                        textColor="text-[#636363]"
                        {...register("code", {
                          required: "Item code is required",
                        })}
                        errors={errors.code}
                        placeholder="Item code"
                        variant="outline"
                        // onChange={(e:any) => handleChange("name", e.target.value)}
                      />
                    </div>
                    <div className="w-full flex ">
                      <InputField
                        type="text"
                        label="Pack Size"
                        borderClassName=" border border-gray-300"
                        labelBackgroundColor="bg-white"
                        value={packsize || ""}
                        textColor="text-[#636363]"
                        {...register("packsize", {
                          //required: "Pack Size is required",
                        })}
                        errors={errors.packsize}
                        placeholder="Pack Size"
                        variant="outline"
                        // onChange={(e: any) =>handleChange("packsize", e.target.value)}
                      />
                    </div>
                    <div className="w-full flex ">
                      <InputField
                        type="text"
                        label="Units"
                        borderClassName=" border border-gray-300"
                        labelBackgroundColor="bg-white"
                        value={units || ""}
                        textColor="text-[#636363]"
                        {...methods?.register("units", {
                        // required: "Units is required",
                        })}
                        errors={errors.units}
                        placeholder="Units"
                        variant="outline"
                        // onChange={(e: any) => handleChange("units", e.target.value)}
                      />
                    </div>
                    <div className="w-full flex">
                      <InputField
                        type="text"
                        label="Weight"
                        borderClassName=" border border-gray-300"
                        labelBackgroundColor="bg-white"
                        value={weight || ""}
                        textColor="text-[#636363]"
                        {...methods?.register("weight", {
                        // required: "Weight is required",
                        })}
                        errors={errors.weight}
                        placeholder="Weight"
                        variant="outline"
                        // onChange={(e:any) => handleChange("weight", e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col items-center ">
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

"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import "react-datepicker/dist/react-datepicker.css";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { InputField } from "@/Components/UI/Themes/InputField";
import Dropdown from "@/Components/UI/Themes/DropDown";
import { sendApiRequest } from "@/utils/apiUtils";
import ToastNotification, { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";

interface JsonData {
  mode: string;
  categoryid: number | null;
  itemname: string;
  itemcode:any;
  packsize: string ;
  units:string ;
  weight: string | null;
  cogstrackcategoryid:number | null
  dqcategoryid:number | null
  itemid:number | null
}


const EditItems = ({rowData , setAddItems}:any) => {
  const methods = useForm<any>();

  const { register, setValue, handleSubmit, watch, clearErrors, trigger, formState: { errors } } = methods;
 
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [dqCategory, setDqCategory] = useState<any[]>([]);
  const [cogstracking, setCogstracking] = useState<any[]>([]); 
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [isdqCategoryDropdownOpen, setIsDQCategoryDropdownOpen] =
    useState(false);
  const [iscogstrackingDropdownOpen, setIsCOGSTrackingDropdownOpen] =
    useState(false);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });

  const [name, setName] = useState(rowData?.itemname || "");
  const [itemcode, setItemcode] = useState(rowData?.itemcode  || "");
  const [weight, setWeight] = useState(rowData?.weight  || ""); 
  const [packsize, setPacksize] = useState(rowData?.packsize  || "");
  const [units, setUnits] = useState(rowData?.units  || "");
  const [defaultOption, setDefaultOption] = React.useState("DQ Category");
  const [defaultOptionForCoges, setDefaultOptionForCoges] = React.useState("COGS Tracking Category");
  const [selectedCategoryName, setSelectedCategoryName] = useState(rowData?.categoryname || "Category");
  const selectedCategory = watch("category");
  const selectedDqCategory = watch("dqcategory");
  const selectedCOGSTracking = watch("cogstrackingcategory");


  const closeModal = () => setIsOpen(false);

  const handleChangeName = (data: any) => {
    setName(data); // Update local state
    methods.setValue("name", data); // Update form state in react-hook-form
  };

  const handleChangeItemcode = (data: any) => {
    setItemcode(data); // Update local state
    methods.setValue("code", data); // Update form state in react-hook-form
  };

  const handleChangeweight = (data: any) => {
    setWeight(data); // Update local state
    methods.setValue("weight", data); // Update form state in react-hook-form
  };

  const handleChangepacksize = (data: any) => {
    setPacksize(data); // Update local state
    methods.setValue("packsize", data); // Update form state in react-hook-form
  };

  const handleChangeunits = (data: any) => {
    setUnits(data); // Update local state
    methods.setValue("units", data); // Update form state in react-hook-form
  };

  const onSubmit = async (data: any) => {
   console.log("data",data)
    const jsonData: JsonData = {
      mode: "updateItem",
      categoryid: data?.categoryId  ? data?.categoryId :  rowData?.categoryid,
      itemname: data?.name?.trim(),
      itemcode:data?.code,
      packsize: data?.packsize,
      units: data?.units,
      weight:data?.weight,
      cogstrackcategoryid: data?.cogstrackingcategoryId === null ? null : (data?.cogstrackingcategoryId ? data?.cogstrackingcategoryId : rowData?.cogstrackcategoryid || null),
      dqcategoryid: data?.dqcategoryId === null ? null : (data?.dqcategoryId ? data?.dqcategoryId : rowData?.dqcategoryid || null),
     itemid: Number(rowData?.itemid)
    };

    try {
      const result: any = await sendApiRequest(jsonData);
      const { status } = result;
      setCustomToast({
        message:
          status === 200 ? "Item updated successfully!" : "Failed to add item.",
        type: status === 200 ? "success" : "error",
      });

      if (status === 200) {
        setCustomToast({
          message: status === 200 ? "Item updated successfully!" : "Failed to add item.",
          type: status === 200 ? "success" : "error",
        });
        setTimeout(() => {
          setAddItems(true)
          closeModal();
        }, 300);
      };
      
    } catch (error) {
      setCustomToast({ message: "Error adding item", type: "error" });
      console.error("Error submitting form:", error);
    }
  };

  const toggleDropdownStore = () => {
    setIsStoreDropdownOpen((prev) => !prev);
  };

  const toggleDropdownDQCategory = () => {
    setIsDQCategoryDropdownOpen((prev) => !prev);
  };

  const toggleDropdownCOGSTracking = () => {
    setIsCOGSTrackingDropdownOpen((prev) => !prev);
  };



 
  const fetchDataCategoriesDropdown = async () => {
    try {
      const response: any = await sendApiRequest({
        mode: "getAllCategories",
      });
  
      if (response?.status === 200) {
        setCategories(response?.data?.categories || []);
        // Set the full category name when data loads if rowData exists
        if (rowData?.categoryid) {
          const category = response?.data?.categories.find(
            (cat: any) => cat.id === rowData?.categoryid
          );
          setSelectedCategoryName(category?.name || rowData?.categoryname);
          setValue("category", category?.name || rowData?.categoryname);
          setValue("categoryId", category?.id || rowData?.categoryid);
        }
      } else {
        setCustomToast({
          ...customToast,
          message: response?.message,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  const fetchDataDQcategoryDropdown = async () => {
    try {
      const response: any = await sendApiRequest({
        mode: "getAllDQCategory",
      });

      if (response?.status === 200) {
        const dqData = response?.data?.dqcategory || [];
        setDqCategory([{ id: null, name: "None" }, ...dqData]);
      } else {
        setCustomToast({
          ...customToast,
          message: response?.message,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDataCogstrackcategoryDropdown = async () => {
    try {
      const response: any = await sendApiRequest({
        mode: "getAllCogsTrackCategory",
      });

      if (response?.status === 200) {
        const cogsData = response?.data?.cogstrackcategory || [];
        setCogstracking([{ id: null, name: "None" }, ...cogsData]);
      } else {
        setCustomToast({
          ...customToast,
          message: response?.message,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
   const openModal = () => {
    setIsOpen(true);
    fetchDataCategoriesDropdown();
    fetchDataDQcategoryDropdown();
    fetchDataCogstrackcategoryDropdown();}
  
    useEffect(() => {
      if (dqCategory && rowData?.dqcategoryid) {
        const option = dqCategory.find(option => option.id === rowData?.dqcategoryid);
        setDefaultOption(option?.name || "DQ Category");
      } else if (dqCategory && !rowData?.dqcategoryid) {
        setDefaultOption("None");
      }
      if (cogstracking && rowData?.cogstrackcategoryid) {
        const option = cogstracking.find(option => option.id === rowData?.cogstrackcategoryid);
        setDefaultOptionForCoges(option?.name || "COGS Tracking Category");
      } else if (cogstracking && !rowData?.cogstrackcategoryid) {
        setDefaultOptionForCoges("None");
      }
    }, [dqCategory, cogstracking]);





  return (
    <>
     <ToastNotification
        message={customToast.message}
        type={customToast.type}
      />
      <div>
        <button onClick={openModal}>
          <img
            src="/images/editpencilicon.svg"
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
                         <div className="flex justify-center">
                           <DialogTitle
                             as="h3"
                             className="text-[16px]  font-bold leading-custom text-[#3D3D3D]"
                           >
                             Edit Item
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
                <div className="flex flex-col mt-4 gap-6">
                  <div className="w-full flex mt-4 ">
                  <Dropdown
    options={categories}
    selectedOption={selectedCategoryName}
    onSelect={(selectedValue) => {
      setSelectedCategoryName(selectedValue?.name);
      setValue("category", selectedValue?.name);
      setValue("categoryId", selectedValue?.id);
      setIsStoreDropdownOpen(false);
      clearErrors("category");
    }}
    isOpen={isStoreDropdownOpen}
    toggleOpen={toggleDropdownStore}
    widthchange="w-full flex justify-end"
  />
                  </div>
                  <div className="w-full flex ">
                  <Dropdown
                      options={dqCategory}
                      selectedOption={
                        selectedDqCategory
                          ? selectedDqCategory
                          : defaultOption
                      }
                      onSelect={(selectedOption : any) => {
                        setValue("dqcategory", selectedOption?.name ? selectedOption?.name : rowData?.dqCategoryname); 
                        setValue("dqcategoryId", selectedOption?.id !== undefined ? selectedOption?.id : rowData?.dqcategoryid ); 
                        setIsDQCategoryDropdownOpen(false); 
                        clearErrors("dqcategory"); 
                      }}
                      isOpen={isdqCategoryDropdownOpen}
                      toggleOpen={toggleDropdownDQCategory}
                      widthchange="w-full "
                      {...methods.register("dqcategory", {
                      })}
                      errors={errors.dqcategory}
                    />
                  </div>
                  <div className="w-full">
                  <Dropdown
                      options={cogstracking} 
                      selectedOption={ selectedCOGSTracking ? selectedCOGSTracking ||  "COGS Tracking Category"  : defaultOptionForCoges  } 
                      onSelect={(selected : any) => {
                        setValue("cogstrackingcategory", selected?.name ? selected?.name : rowData?.cogstrackingcategoryname ); 
                        setValue("cogstrackingcategoryId", selected?.id !== undefined ? selected?.id : rowData?.cogstrackcategoryid); 
                        setIsCOGSTrackingDropdownOpen(false); 
                        clearErrors("cogstrackingcategory"); 
                      }}
                      isOpen={iscogstrackingDropdownOpen}
                      toggleOpen={toggleDropdownCOGSTracking}
                      widthchange="w-full "
                      {...methods.register("cogstrackingcategory", {
                      })}
                      errors={errors.cogstrackingcategory}
                    />
                  </div>
                  <div className="w-full flex">
                    <InputField
                      type="text"
                      label="Item Name"
                      borderClassName=" border border-gray-200"
                      labelBackgroundColor="bg-white"
                      value={name}
                      textColor="text-[#4B4B4B]"
                      {...register("name", {
                        required: "Item Name is required",
                      })}
                      errors={errors.name}
                      placeholder="Name"
                      variant="outline"
                      onChange={(e: any) => handleChangeName(e.target.value)}
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
                        onChange={(e:any) => handleChangeItemcode(e.target.value)}
                      />
                    </div>

                  <div className="w-full flex ">
                    <InputField
                      type="text"
                      label="Packsize"
                      borderClassName=" border border-gray-200"
                      labelBackgroundColor="bg-white"
                      value={packsize || "" }
                      textColor="text-[#4B4B4B]"
                      {...register("packsize", {
                        //required: "Pack Size is required",
                      })}
                      errors={errors.packsize}
                      placeholder="Packsize"
                      variant="outline"
                      onChange={(e: any) => handleChangepacksize(e.target.value)}
                    />
                  </div>
                  <div className="w-full flex ">
                    <InputField
                      type="text"
                      label="Units"
                      borderClassName=" border border-gray-200"
                      labelBackgroundColor="bg-white"
                      value={units || ""}
                      textColor="text-[#4B4B4B]"
                      {...methods?.register("units", {
                       // required: "Units is required",
                      })}
                      errors={errors.units}
                      placeholder="Units"
                      variant="outline"
                      onChange={(e: any) => handleChangeunits(e.target.value)}
                    />
                  </div>

                  <div className="w-full flex">
                    <InputField
                      type="text"
                      label="Weight"
                      borderClassName=" border border-gray-200"
                      labelBackgroundColor="bg-white"
                      value={weight }
                      textColor="text-[#4B4B4B]"
                      {...methods?.register("weight", {
                       // required: "Weight is required",
                      })}
                      errors={errors.weight}
                      placeholder="Weight"
                      variant="outline"
                      onChange={(e: any) => handleChangeweight(e.target.value)}
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

export default EditItems;

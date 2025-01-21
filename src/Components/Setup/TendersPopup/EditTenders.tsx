"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import "react-datepicker/dist/react-datepicker.css";
import Dropdown from "@/Components/UI/Themes/DropDown";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { InputField } from "@/Components/UI/Themes/InputField";
import { sendApiRequest } from "@/utils/apiUtils";
import ToastNotification, { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";

interface JsonData {
  mode: string;
  tendertypeid: number | null;
  tendername: string;
  commission: number | null;
  tenderid: number | null;
}

const EditTender = ({ initialData ,setAddTender}:any) => {
  const methods = useForm<any>({
    defaultValues: initialData, // Prepopulate form with existing data
  });

  const [commission, setCommission] = useState( initialData?.commission);
  const [name, setName] = useState(initialData?.tendername);
  const [isTenderDropdownOpen, setIsTenderDropdownOpen] = useState(false);
  const [tenderType, setTenderType] = useState<any[]>([]);
  const { register, setValue, handleSubmit, watch ,clearErrors,trigger} = methods;
  const selectedTenderType = watch("tendertype");  
  const { control } = useForm(); // Initialize React Hook Form
  const [isOpen, setIsOpen] = useState(false);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleChange = (data: any) => {
    setCommission(data); // Update local state
    methods.setValue("commission", data); // Update form state in react-hook-form
  };

  const handleChangeName = (data: any) => {
    setName(data); // Update local state
    methods.setValue("county", name); // Update form state in react-hook-form
  };

  const toggleDropdownTenderType = () => {
    setIsTenderDropdownOpen((prev) => !prev);
  };

  const fetchData = async () => {
    try {
      const response: any = await sendApiRequest({
        mode: "getalltendertypes",
      });

      if (response?.status === 200) {
        setTenderType(response?.data?.tendertypes || []);
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

  useEffect(() => {
    if (isOpen) {
    fetchData();
    }
  }, [isOpen]);

 
  const onSubmit = async (data: any) => {
   
    const jsonData: JsonData = {
      mode: "updatetender",
      tendertypeid: data?.tendertypeId ? data?.tendertypeId : initialData?.tendertypeid,
      tendername: data?.name?.trim(),
      commission: Number(data?.commission),
      tenderid:Number(initialData?.tenderid)
    };
    
    try {
      const result: any = await sendApiRequest(jsonData);
      const { status , data: responseData  } = result;
    

      if (status === 200) {
        setCustomToast({
          message: status === 200 ? "Item updated successfully!" : "Failed to add item.",
          type: status === 200 ? "success" : "error",
        });
        setTimeout(() => {
          setAddTender(true);
          closeModal();
        }, 300);
      };
    } catch (error) {
      setCustomToast({ message: "Error adding item", type: "error" });
      console.error("Error submitting form:", error);
    }
  };
  
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
              <img
                onClick={closeModal}
                src="/images/cancelicon.svg"
                alt="Cancel"
                className="absolute top-0 right-0 cursor-pointer"
              />
              <div className="flex justify-center mt-1">
                <DialogTitle
                  as="h3"
                  className=" font-medium  text-[#3D3D3D] opacity-80"
                >
                  Edit Tender
                </DialogTitle>
              </div>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col mt-4 gap-4">
                 
                  <div className="w-full flex mt-4">
                    {/* Description Input Field */}
                    <InputField
                      type="text"
                      label="Name"
                      borderClassName=" border border-gray-400"
                      labelBackgroundColor="bg-white"
                      value={name}
                      textColor="text-gray-500"
                      {...methods?.register("name", {
                        required: "Name is required",
                      })}
                      errors={methods.formState.errors.name}
                      placeholder="Name"
                      variant="outline"
                      onChange={(e: any) => handleChangeName(e.target.value)}
                    />
                  </div>
                  <div className="w-full flex mt-4">
                  <Dropdown
                      options={tenderType}
                      selectedOption={selectedTenderType ? selectedTenderType  :  initialData?.tendertypename ? initialData?.tendertypename  : "Tender Type" } 
                      onSelect={(selectedValue) => {
                        setValue( "tendertype", selectedValue ? selectedValue?.name : initialData?.tendertypename );
                        setValue("tendertypeId", selectedValue ? selectedValue?.id : initialData?.tendertypeid  );
                        setIsTenderDropdownOpen(false); 
                        clearErrors("tendertype"); 
                      }}
                      
                      isOpen={isTenderDropdownOpen}
                      toggleOpen={toggleDropdownTenderType}
                      widthchange="w-full"
                      // {...register("tendertype", {
                      //   required: "Tender Type is required",
                      // })}
                      // errors={methods.formState.errors.tendertype} 
                    />
                  </div>
                  <div className="w-full flex mt-4">
                    <InputField
                      type="text"
                      label="Commission"
                      borderClassName=" border border-gray-400"
                      labelBackgroundColor="bg-white"
                      value={commission}
                      textColor="text-gray-500"
                      {...methods?.register("commission", {
                        required: "Royalty is required",
                      })}
                      errors={methods.formState.errors.commission}
                      placeholder="Commission"
                      variant="outline"
                      onChange={(e: any) => handleChange(e.target.value)}
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

export default EditTender;

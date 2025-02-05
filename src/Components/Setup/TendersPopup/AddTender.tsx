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
  tendertypeid: number | null;
  tendername: string;
  commission: number | null;

}
interface CustomToast {
  toastMessage: string;
  toastType: string;
}

const AddTender = ({ setAddTender }: any) => {

  const methods = useForm();
  const [commission, setCommission] = useState("");
  const [name, setName] = useState("");
  const [isTenderDropdownOpen, setIsTenderDropdownOpen] = useState(false);
  const [tenderType, setTenderType] = useState<any[]>([]);
  const { register, setValue, watch, clearErrors } = methods;
  const [isOpen, setIsOpen] = useState(false);
  const [customToast, setCustomToast] = useState<CustomToast>({
    toastMessage: "",
    toastType: "",
  });

  const selectedTenderType = watch("tendertype");
  const openModal = async () => {
    setIsOpen(true);

    methods.reset({
      tendertypeId: null,
      tendertype: "",

    });
    setName("");
    setCommission("");
  };
  const closeModal = () => { setIsOpen(false) };

  const handleChange = (data: any) => {
    setCommission(data);
    methods.setValue("commission", data);
  };

  const handleChangeName = (data: any) => {
    setName(data);
    methods.setValue("county", name);
  };

  const toggleDropdownTenderType = () => {
    setIsTenderDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await sendApiRequest({
          mode: "getAllTenderTypes",
        });

        if (response?.status === 200) {
          setTenderType(response?.data?.tendertypes || []);
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

    fetchData();
  }, []);


  const onSubmit = async (data: any) => {
    setCustomToast({ toastMessage: "", toastType: "" });
    const jsonData: JsonData = {
      mode: "insertTender",
      tendertypeid: data?.tendertypeId,
      tendername: data?.name?.trim(),
      commission: Number(data?.commission),
    };

    try {
      const result: any = await sendApiRequest(jsonData);
      const { status, data: responseData } = result;
      setTimeout(() => {
        setCustomToast({
          toastMessage: status === 200 ? "Item added successfully!" : "Failed to add item.",
          toastType: status === 200 ? "success" : "error",
        });
      }, 0);
      if (status === 200) {
        setAddTender(true)
        closeModal();
      };
    } catch (error: any) {
      setTimeout(() => {
        setCustomToast({
          toastMessage: error?.message,
          toastType: "error",
        });
      }, 0);
    }
  };


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
          className="bg-[#168A6F] hover:bg-[#11735C] shadow-lg text-white w-[159px] text-[13px] gap-[0.25rem] font-medium h-[35px] rounded-md flex items-center justify-center "
        >
          <img className="" src="/images/webaddicon.svg" alt="" />
          Add Tender
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
                  Add Tender
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
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="flex flex-col mt-4 gap-4">

                  <div className="w-full flex mt-4">
                    {/* Description Input Field */}
                    <InputField
                      type="text"
                      label="Name"
                      borderClassName=" border border-gray-300"
                      labelBackgroundColor="bg-white"
                      value={name}
                      textColor="text-[#636363]"
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
                      selectedOption={selectedTenderType || "Tender Type"}
                      onSelect={(selectedValue) => {
                        setValue("tendertype", selectedValue?.name);
                        setValue("tendertypeId", selectedValue?.id);
                        setIsTenderDropdownOpen(false);
                        clearErrors("tendertype");
                      }}
                      isOpen={isTenderDropdownOpen}
                      toggleOpen={toggleDropdownTenderType}
                      widthchange="w-full"
                      {...register("tendertype", {
                        required: "Tender Type is required",
                      })}
                      errors={methods.formState.errors.type}
                    />

                  </div>
                  <div className="w-full flex mt-4">
                    <InputField
                      type="text"
                      label="Commission"
                      borderClassName=" border border-gray-300"
                      labelBackgroundColor="bg-white"
                      value={commission}
                      textColor="text-[#636363]"
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

export default AddTender;

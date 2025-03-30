"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import "react-datepicker/dist/react-datepicker.css";
import { FormProvider, useForm, Controller } from "react-hook-form";
import Dropdown from "../UI/Themes/DropDown";
import { format } from "date-fns";
import CustomDatePicker from "../UI/Themes/CustomDatePicker";
import { InputField } from "@/Components/UI/Themes/InputField";
import { sendApiRequest } from "@/utils/apiUtils";
import ToastNotification, { ToastNotificationProps } from "../UI/ToastNotification/ToastNotification";

interface JsonData {
  mode: string;
  storeid: number | null;
  recdate: string;
  systembalance: number | null;
  actualbalance: number | null;
  id: number | null;
}

const EditCashReconciliation = ({ initialData, setAddReconciliation }: any) => {
  const methods = useForm<any>({
    defaultValues: {
      store: "",
      storeId: null,
      date: null,
      systembalance: null,
      actualbalance: null,
    },
  });
  const { setValue, watch, control, register, formState, handleSubmit } = methods;
  const { errors } = formState;
  const [isOpen, setIsOpen] = useState(false);
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [store, setStore] = useState<any[]>([]);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });

  const selectedStore = watch("store");
  const selectedDate = watch("date");

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const toggleStoreDropdown = () => {
    setIsStoreDropdownOpen((prev) => !prev);
  };

  const fetchDropdownData = async () => {
    try {
      const response = await sendApiRequest({ mode: "getAllStores" });
      if (response?.status === 200) {
        setStore(response?.data?.stores || []);
      } else {
        handleError(response?.message);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const handleError = (message: string) => {
    setCustomToast({
      message,
      type: "error",
    });
  };

  useEffect(() => {
    if (isOpen) {
      fetchDropdownData();
    }
  }, [isOpen]);

  const onSubmit = async (data: any) => {
    const formattedDate = data?.date ? format(data?.date, "yyyy-MM-dd") : null;
    if (!formattedDate || isNaN(Date.parse(formattedDate))) {
      setCustomToast({
        message: "Invalid date",
        type: "error",
      });
      return;
    }

    // Validate all required fields
    const storeId = Number(data?.storeId);
    const systemBalance = Number(data?.systembalance);
    const actualBalance = Number(data?.actualbalance);
    const id = Number(initialData?.id);

    if (isNaN(storeId) || isNaN(systemBalance) || isNaN(actualBalance) || isNaN(id)) {
      setCustomToast({
        message: "All fields (Store, System Balance, Actual Balance, ID) must be valid numbers",
        type: "error",
      });
      console.error("Invalid data:", { storeId, systemBalance, actualBalance, id });
      return;
    }

    const jsonData: JsonData = {
      mode: "updateCashReconciliation",
      storeid: storeId,
      recdate: formattedDate,
      systembalance: systemBalance,
      actualbalance: actualBalance,
      id: id,
    };

    console.log("Sending jsonData:", jsonData); // Debug log

    try {
      const result: any = await sendApiRequest(jsonData);
      const { status } = result;

      setCustomToast({
        message: status === 200 ? "Cash Reconciliation updated successfully!" : "Failed to update reconciliation.",
        type: status === 200 ? "success" : "error",
      });

      if (status === 200) {
        setTimeout(() => {
          setAddReconciliation(true);
          closeModal();
        }, 300);
      }
    } catch (error: any) {
      setCustomToast({ message: error?.message || "Error updating reconciliation", type: "error" });
      console.error("Error submitting form:", error);
    }
    closeModal();
  };

  useEffect(() => {
    if (initialData) {
      setValue("store", initialData.storename || "");
      setValue("storeId", initialData.storeid || null);
      setValue("date", initialData.recdate ? new Date(initialData.recdate) : null);
      setValue("systembalance", initialData.systembalance ?? null);
      setValue("actualbalance", initialData.actualbalance ?? null);
    }
  }, [initialData, setValue, isOpen]);

  return (
    <>
      <ToastNotification message={customToast.message} type={customToast.type} />
      <div>
        <button onClick={openModal}>
          <img
            src="/images/editpencilicon.svg"
            className="flex justify-center w-4 h-4 below-md:w-5 below-md:h-5 text-left"
          />
        </button>
      </div>

      <Dialog open={isOpen} as="div" className="relative z-50" onClose={closeModal}>
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-[335px] h-auto below-md:w-[94%] below-md:h-[450px] px-6 below-md:px-4 py-6 bg-white rounded-lg shadow-lg flex flex-col">
            <div className="relative">
              <div className="flex justify-center">
                <DialogTitle as="h3" className="text-[16px] font-bold leading-custom text-[#3D3D3D]">
                  Edit Cash Reconciliation
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
                  {/* Store Dropdown */}
                  <Dropdown
                    options={store}
                    selectedOption={selectedStore || initialData?.storename || "Store"}
                    onSelect={(selectedOption) => {
                      setValue("store", selectedOption.name);
                      setValue("storeId", selectedOption.id);
                      setIsStoreDropdownOpen(false);
                    }}
                    isOpen={isStoreDropdownOpen}
                    toggleOpen={toggleStoreDropdown}
                    widthchange="w-full"
                    {...register("store", {
                      required: "Store selection is required",
                    })}
                    errors={errors.store}
                  />

                  {/* Date Input Field */}
                  <CustomDatePicker
                    value={selectedDate || (initialData?.recdate ? new Date(initialData.recdate) : null)}
                    onChange={(date) => setValue("date", date, { shouldValidate: true })}
                    placeholder="Date"
                    errors={errors.date?.message}
                  />

                  {/* System Balance Field */}
                  <Controller
                    control={control}
                    name="systembalance"
                    rules={{
                      required: "System Balance is required",
                      min: { value: 0, message: "System Balance must be positive" },
                    }}
                    render={({ field: { ref, ...field } }) => (
                      <InputField
                        type="number"
                        label="System Balance"
                        borderClassName="border border-gray-300"
                        labelBackgroundColor="bg-white"
                        textColor="text-[#636363]"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                        ref={ref}
                        errors={errors.systembalance}
                        placeholder="Enter System Balance"
                        variant="outline"
                      />
                    )}
                  />

                  {/* Actual Balance Field */}
                  <Controller
                    control={control}
                    name="actualbalance"
                    rules={{
                      required: "Actual Balance is required",
                      min: { value: 0, message: "Actual Balance must be positive" },
                    }}
                    render={({ field: { ref, ...field } }) => (
                      <InputField
                        type="number"
                        label="Actual Balance"
                        borderClassName="border border-gray-300"
                        labelBackgroundColor="bg-white"
                        textColor="text-[#636363]"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                        ref={ref}
                        errors={errors.actualbalance}
                        placeholder="Enter Actual Balance"
                        variant="outline"
                      />
                    )}
                  />

                  {/* Buttons */}
                  <div className="flex justify-between gap-3 items-center w-full">
                    <button
                      type="button"
                      className="px-4 below-md:px-2 md:py-1 text-[14px] text-[#6F6F6F] h-[35px] w-[165px] hover:bg-[#C9C9C9] bg-[#E4E4E4] rounded-md"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 text-white md:text[13px] text-[14px] h-[35px] w-[165px] bg-[#168A6F] hover:bg-[#11735C] rounded-md"
                    >
                      Save
                    </button>
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

export default EditCashReconciliation;
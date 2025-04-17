"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import "react-datepicker/dist/react-datepicker.css";
import Dropdown from "@/Components/UI/Themes/DropDown";
import { FormProvider, useForm } from "react-hook-form";
import { format } from "date-fns";
import { InputField } from "../UI/Themes/InputField";
import CustomDatePicker from "../UI/Themes/CustomDatePicker";
import { sendApiRequest } from "@/utils/apiUtils";
import ToastNotification, { ToastNotificationProps } from "../UI/ToastNotification/ToastNotification";
import router from "next/router";

type CashReconciliationFormInputs = {
  store: string;
  storeId: number | null;
  date: Date | null;
  systemBalance: number | null;
  actualBalance: number | null;
};

interface JsonData {
  mode: string;
  storeid: number | null;
  recdate?: string;
  salesdate?: string;
  systembalance?: number | null;
  actualbalance?: number | null;
}

const AddCashReconciliation = ({ setAddReconciliation, SelectedStore }: any) => {
  const methods = useForm<CashReconciliationFormInputs>({
    defaultValues: {
      store: "",
      storeId: null,
      date: new Date(),
      systemBalance: null,
      actualBalance: null,
    },
  });

  const { setValue, watch, handleSubmit, register, formState: { errors } } = methods;
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [stores, setStores] = useState<any[]>([]);
  const [isVerifiedUser, setIsVerifiedUser] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });

  const currentDate = watch("date");
  const storeId = watch("storeId");
  const systemBalance = watch("systemBalance");
  const actualBalance = watch("actualBalance");

  const toggleStoreDropdown = () => {
    setIsStoreDropdownOpen((prev) => !prev);
  };

  const handleError = (message: string) => {
    setToast({
      message,
      type: "error",
    });
  };

  const handlePressStart = () => {
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
    }, 2000);
  };

  const handlePressEnd = () => {
    setShowTooltip(false);
  };

  const verifyToken = async (token: string) => {
    const res: any = await sendApiRequest({ token: token }, `auth/verifyToken`);
    res?.status === 200 ? setIsVerifiedUser(true) : router.replace("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      verifyToken(token);
    }
  }, []);

  const getUserStore = async () => {
    try {
      const response = await sendApiRequest({ mode: "getUserStore" });
      if (response?.status === 200) {
        const storeList = response?.data?.stores || [];
        setStores(storeList);

        const defaultStore = SelectedStore || storeList[0];
        if (defaultStore) {
          setSelectedStore(defaultStore);
          setValue("store", defaultStore.name);
          setValue("storeId", defaultStore.id);
        }
      } else {
        handleError(response?.message);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  useEffect(() => {
    if (isVerifiedUser) {
      getUserStore();
    }
  }, [isVerifiedUser]);

  // Fetch system balance when storeId or date changes
  const fetchSystemBalance = async () => {
    if (!storeId || !currentDate) return;

    const jsonData: JsonData = {
      mode: "getCashTendersByStore",
      storeid: storeId,
      salesdate: format(currentDate, "yyyy-MM-dd"),
    };

    try {
      const response: any = await sendApiRequest(jsonData);
      if (response?.status === 200 && response?.data?.Cashamt?.length > 0) {
        const cashAmount = response.data.Cashamt[0]?.total || 0;
        setValue("systemBalance", Number(cashAmount), { shouldValidate: true });
      } else {
        setValue("systemBalance", 0, { shouldValidate: true });
      }
    } catch (error) {
      console.error("Error fetching system balance:", error);
      setValue("systemBalance", 0, { shouldValidate: true });
    }
  };

  useEffect(() => {
    fetchSystemBalance();
  }, [storeId, currentDate]);

  const openModal = () => {
    setIsOpen(true);
    methods.reset({
      store: SelectedStore?.name || "",
      storeId: SelectedStore?.id || null,
      date: new Date(),
      systemBalance: null,
      actualBalance: null,
    });
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const onSubmit = async (data: CashReconciliationFormInputs) => {
    if (!data.storeId) {
      handleError("Please select a store");
      return;
    }

    const jsonData: JsonData = {
      mode: "insertCashReconciliation",
      storeid: Number(data.storeId),
      recdate: format(data.date || new Date(), "yyyy-MM-dd"),
      systembalance: Number(data.systemBalance) || 0,
      actualbalance: Number(data.actualBalance) || 0,
    };

    try {
      const result: any = await sendApiRequest(jsonData);
      const { status } = result;

      setToast({
        message: status === 200
          ? "Cash Reconciliation added successfully!"
          : result.message || "Failed to add reconciliation.",
        type: status === 200 ? "success" : "error",
      });

      if (status === 200) {
        setAddReconciliation(true); // Notify parent to refresh data
        closeModal();
      }
    } catch (error: any) {
      console.error("Error adding reconciliation:", error);
      setToast({
        message: error?.message || "An error occurred while adding reconciliation.",
        type: "error",
      });
    }
  };

  return (
    <>
      <ToastNotification message={toast.message} type={toast.type} />
      <div className="hidden below-md:block sticky">
        <button
          onClick={openModal}
          onTouchStart={handlePressStart}
          onMouseLeave={handlePressEnd}
          className="focus:outline-none flex items-center justify-center bg-[#168A6F] w-[56px] h-[56px] rounded-xl relative"
        >
          <img
            src="/images/webaddicon.svg"
            alt="Add Reconciliation"
            className="w-[18px] h-[18px]"
          />
          {showTooltip && (
            <div className="absolute bottom-[75px] right-[80%] transform translate-x-1/2 bg-[#79747E] text-white text-[12px] px-5 py-2 rounded-md whitespace-nowrap">
              Add Reconciliation
              <div className="absolute top-full right-[20%] transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#79747E]"></div>
            </div>
          )}
        </button>
      </div>
      <div className="block below-md:hidden">
        <button
          onClick={openModal}
          className="bg-[#168A6F] hover:bg-[#11735C] shadow-lg text-white w-[159px] text-[13px] gap-[0.25rem] font-medium h-[35px] rounded-md flex items-center justify-center"
        >
          <img className="" src="/images/webaddicon.svg" alt="" />
          Add Reconciliation
        </button>
      </div>
      <Dialog open={isOpen} as="div" className="relative z-50" onClose={closeModal}>
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-[335px] h-auto below-md:w-[94%] below-md:h-[450px] px-6 below-md:px-4 py-6 bg-white rounded-lg shadow-lg flex flex-col">
            <div className="relative">
              <div className="flex justify-center">
                <DialogTitle
                  as="h3"
                  className="text-[16px] font-bold leading-custom text-[#3D3D3D]"
                >
                  Add Cash Reconciliation
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
                    options={stores}
                    selectedOption={selectedStore?.name || "Store"}
                    onSelect={(selectedOption: any) => {
                      setSelectedStore(selectedOption);
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

                  {/* Date Picker */}
                  <CustomDatePicker
                    value={currentDate || new Date()}
                    onChange={(date: Date | null) =>
                      setValue("date", date, { shouldValidate: true })
                    }
                    placeholder="Date"
                    errors={errors.date?.message}
                  />

                  {/* System Balance Field (Read-Only) */}
                  <InputField
                    type="number"
                    label="System Balance"
                    borderClassName="border border-gray-300"
                    labelBackgroundColor="bg-white"
                    textColor="text-[#636363]"
                    value={systemBalance ?? ""}
                    readOnly // Make the field read-only
                    {...register("systemBalance", {
                      required: "System Balance is required",
                      min: { value: 0, message: "System Balance must be positive" },
                    })}
                    errors={errors.systemBalance}
                    placeholder="System Balance"
                    variant="outline"
                  />

                  {/* Actual Balance Field */}
                  <InputField
                    type="number"
                    label="Actual Balance"
                    borderClassName="border border-gray-300"
                    labelBackgroundColor="bg-white"
                    textColor="text-[#636363]"
                    value={actualBalance ?? ""}
                    {...register("actualBalance", {
                      required: "Actual Balance is required",
                      min: { value: 0, message: "Actual Balance must be positive" },
                    })}
                    onChange={(e) =>
                      setValue("actualBalance", e.target.value ? Number(e.target.value) : null)
                    }
                    errors={errors.actualBalance}
                    placeholder="Enter Actual Balance"
                    variant="outline"
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

export default AddCashReconciliation;
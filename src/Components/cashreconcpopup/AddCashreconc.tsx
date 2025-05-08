"use client";

import React, { useEffect, useState, useCallback } from "react";
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

  const { setValue, watch, handleSubmit, register, reset, formState: { errors } } = methods;
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [stores, setStores] = useState<any[]>([]);
  const [isVerifiedUser, setIsVerifiedUser] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastNotificationProps>({ message: "", type: "" });
  const [showBalanceWarning, setShowBalanceWarning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorDisplayed, setErrorDisplayed] = useState(false); // Prevent multiple error toasts

  const currentDate = watch("date");
  const storeId = watch("storeId");
  const systemBalance = watch("systemBalance");
  const actualBalance = watch("actualBalance");

  const toggleStoreDropdown = () => setIsStoreDropdownOpen((prev) => !prev);

  const handleError = useCallback((message: string) => {
    if (!errorDisplayed) {
      setToast({ message, type: "error" });
      setErrorDisplayed(true);
    }
  }, [errorDisplayed]);

  const handlePressStart = () => {
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };

  const handlePressEnd = () => setShowTooltip(false);

  const verifyToken = async (token: string) => {
    try {
      const res: any = await sendApiRequest({ token }, `auth/verifyToken`);
      res?.status === 200 ? setIsVerifiedUser(true) : router.replace("/login");
    } catch (error) {
      router.replace("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.replace("/login");
    else verifyToken(token);
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
        handleError(response?.message || "Failed to fetch stores.");
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
      handleError("An error occurred while fetching stores.");
    }
  };

  useEffect(() => {
    if (isVerifiedUser) getUserStore();
  }, [isVerifiedUser]);

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
      handleError("An error occurred while fetching system balance.");
    }
  };

  useEffect(() => {
    if (isOpen && storeId && currentDate) fetchSystemBalance();
  }, [isOpen, storeId, currentDate]);

  useEffect(() => {
    if (systemBalance !== null && actualBalance !== null) {
      const difference = Math.abs(Number(systemBalance) - Number(actualBalance));
      setShowBalanceWarning(difference > 50 && systemBalance !== 0);
    } else {
      setShowBalanceWarning(false);
    }
  }, [systemBalance, actualBalance]);

  // Auto-clear toast after 5 seconds
  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => {
        setToast({ message: "", type: "" });
        setErrorDisplayed(false); // Allow new errors after clearing
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const openModal = () => {
    setIsOpen(true);
    reset({
      store: SelectedStore?.name || "",
      storeId: SelectedStore?.id || null,
      date: new Date(),
      systemBalance: null,
      actualBalance: null,
    });
    const defaultStore = SelectedStore || stores[0];
    if (defaultStore) {
      setSelectedStore(defaultStore);
      setValue("store", defaultStore.name);
      setValue("storeId", defaultStore.id);
    }
    setErrorDisplayed(false); // Reset error state
  };

  const closeModal = () => {
    setIsOpen(false);
    setShowBalanceWarning(false);
    setToast({ message: "", type: "" });
    setErrorDisplayed(false); // Reset error state
  };

  const checkDuplicateReconciliation = async (storeId: number, recDate: string) => {
    try {
      const response = await sendApiRequest({
        mode: "getCashReconciliations",
        storeid: storeId,
        startdate: recDate,
        enddate: recDate,
      });
      return response?.data?.reconciliations?.length > 0;
    } catch (error) {
      console.error("Error checking duplicate:", error);
      return false;
    }
  };

  const submitReconciliation = async (data: CashReconciliationFormInputs) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorDisplayed(false); // Reset for this submission

    const recDate = format(data.date || new Date(), "yyyy-MM-dd");

    // Check for duplicate reconciliation
    const isDuplicate = await checkDuplicateReconciliation(Number(data.storeId), recDate);
    if (isDuplicate) {
      handleError("Duplicate entry not allowed: A reconciliation for this store and date already exists.");
      setIsSubmitting(false);
      return;
    }

    // Check balance difference (warning, not error)
    const difference = Math.abs(Number(data.systemBalance) - Number(data.actualBalance));
    const hasWarning = difference > 50 && systemBalance !== 0;

    const jsonData: JsonData = {
      mode: "insertCashReconciliation",
      storeid: Number(data.storeId),
      recdate: recDate,
      systembalance: Number(data.systemBalance) || 0,
      actualbalance: Number(data.actualBalance) || 0,
    };

    try {
      const result: any = await sendApiRequest(jsonData);
      const { status } = result;
      // Show success message, even if there’s a warning
      setToast({
        message: status === 200
          ? "Cash Reconciliation added successfully!"
          : result.message || "Failed to add reconciliation.",
        type: status === 200 ? "success" : "error",
      });

      // Show warning if applicable (after success message)
      if (status === 200 && hasWarning) {
        setTimeout(() => {
          setToast({
            message: "Warning: Difference between System Balance and Actual Balance exceeds $50.",
            type: "warning",
          });
        }, 2000); // Delay warning to show after success
      }

      if (status === 200) {
        setAddReconciliation(true);
        // Delay modal closure to show success toast
        setTimeout(closeModal, 2000);
      }
    } catch (error: any) {
      console.error("Error adding reconciliation:", error);
      handleError(error?.message || "An error occurred while adding reconciliation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data: CashReconciliationFormInputs) => {
    if (isSubmitting) return;
    if (!data.storeId) {
      handleError("Please select a store");
      return;
    }
    if (data.systemBalance === 0 || data.systemBalance === null) {
      handleError("Sales bill is not uploaded or might be 0.");
      return;
    }
    submitReconciliation(data);
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
              Add Recon.
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
                  <CustomDatePicker
                    value={currentDate || new Date()}
                    onChange={(date: Date | null) =>
                      setValue("date", date, { shouldValidate: true })
                    }
                    placeholder="Date"
                    errors={errors.date?.message}
                  />
                  {/* System Balance with inline CSS for red circle arrow on hover */}
                  <div style={{ position: "relative", width: "100%" }}>
                    <InputField
                      type="number"
                      label="System Balance"
                      borderClassName="border border-gray-300"
                      labelBackgroundColor="bg-white"
                      textColor="text-[#636363]"
                      value={systemBalance ?? ""}
                      readOnly
                      style={{ cursor: "not-allowed" }} // Inline cursor style
                      {...register("systemBalance", {
                        required: "System Balance is required",
                        min: { value: 0, message: "System Balance must be positive" },
                      })}
                      errors={errors.systemBalance}
                      placeholder="System Balance"
                      variant="outline"
                    />
                    <div
                      style={{
                        display: "none", // Hidden by default
                        position: "absolute",
                        top: "50%",
                        right: "10px",
                        transform: "translateY(-50%)",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        border: "2px solid red",
                        background: "transparent",
                        pointerEvents: "none", // Prevent interaction
                      }}
                      className="not-editable-indicator"
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%) rotate(45deg)",
                          width: "8px",
                          height: "2px",
                          background: "red",
                        }}
                      />
                    </div>
                  </div>
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
                  {showBalanceWarning && (
                    <div className="text-yellow-600 text-[12px]">
                      Warning: Difference between System Balance and Actual Balance exceeds $50.
                    </div>
                  )}
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
                      disabled={isSubmitting || systemBalance === 0 || systemBalance === null}
                    >
                      {isSubmitting ? "Saving..." : "Save"}
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
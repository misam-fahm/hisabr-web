"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { FormProvider, useForm, Controller } from "react-hook-form";
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
      actualbalance: null,
    },
  });
  const { setValue, control, formState, handleSubmit } = methods;
  const { errors } = formState;
  const [isOpen, setIsOpen] = useState(false);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Format date from "YYYY-MM-DD HH:mm:ss.SSSSSS" to "MM-DD-YYYY"
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    try {
      const datePart = dateString.split(" ")[0]; // Get "YYYY-MM-DD"
      const [year, month, day] = datePart.split("-");
      return `${month}-${day}-${year}`; // Format as "MM-DD-YYYY"
    } catch {
      return "N/A";
    }
  };

  useEffect(() => {
    if (initialData) {
      setValue("actualbalance", initialData.actualbalance ?? null);
    }
  }, [initialData, setValue]);

  const onSubmit = async (data: any) => {
    const actualBalance = Number(data?.actualbalance);
    const storeId = Number(initialData?.storeid);
    const systemBalance = Number(initialData?.systembalance);
    const id = Number(initialData?.id);

    if (isNaN(actualBalance) || isNaN(storeId) || isNaN(systemBalance) || isNaN(id)) {
      setCustomToast({
        message: "Invalid data in fields",
        type: "error",
      });
      return;
    }

    if (!initialData?.recdate || isNaN(Date.parse(initialData.recdate))) {
      setCustomToast({
        message: "Invalid date",
        type: "error",
      });
      return;
    }

    const jsonData: JsonData = {
      mode: "updateCashReconciliation",
      storeid: storeId,
      recdate: initialData.recdate,
      systembalance: systemBalance,
      actualbalance: actualBalance,
      id: id,
    };

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
  };

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
                  {/* Store Display */}
                  <div>
                    <label className="block text-[#636363] bg-white px-1 text-sm absolute -mt-2 ml-2">Store</label>
                    <div className="border border-gray-300 rounded-md px-3 py-2 text-[#636363] cursor-not-allowed">
                      {initialData?.storename || "N/A"}
                    </div>
                  </div>

                  {/* Date Display */}
                  <div>
                    <label className="block text-[#636363] bg-white px-1 text-sm absolute -mt-2 ml-2">Date</label>
                    <div className="border border-gray-300 rounded-md px-3 py-2 text-[#636363] cursor-not-allowed">
                      {formatDate(initialData?.recdate)}
                    </div>
                  </div>

                  {/* System Balance Display */}
                  <div>
                    <label className="block text-[#636363] bg-white px-1 text-sm absolute -mt-2 ml-2">System Balance</label>
                    <div className="border border-gray-300 rounded-md px-3 py-2 text-[#636363] cursor-not-allowed">
                      {initialData?.systembalance ?? "N/A"}
                    </div>
                  </div>

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
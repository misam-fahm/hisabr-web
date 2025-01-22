"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import "react-datepicker/dist/react-datepicker.css";
import { FormProvider, useForm, Controller, FieldError } from "react-hook-form";
import Dropdown from "../UI/Themes/DropDown";
import { format } from "date-fns";
import CustomDatePicker from "../UI/Themes/CustomDatePicker";
import { InputField } from "@/Components/UI/Themes/InputField";
import { sendApiRequest } from "@/utils/apiUtils";
import ToastNotification, { ToastNotificationProps } from "../UI/ToastNotification/ToastNotification";

interface JsonData {
  mode: string;
  storeid: number | null;
  expensedate: any;
  amount: number | null;
  expenseid: number | null;
  id:number | null;
  description: string;
}


const EditExpense = ({ initialData , setAddExpenses}:any) => {

  const methods = useForm<any>();
  
  const {  setValue, clearErrors, watch, control, register, formState, handleSubmit } = methods;
  const { errors } = formState;
  const [description, setDescription] = useState(initialData?.description );
  const [amount, setAmount] = useState(initialData?.amount);
  const [isOpen, setIsOpen] = useState(false);
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [isExpenseDropdownOpen, setIsExpenseDropdownOpen] = useState(false);
  const [expensetypes, setExpensetypes] = useState<any[]>([]);
  const [store, setStore] = useState<any[]>([]);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });
 
  const selectedStore = watch("store"); 
  const selectedExpense = watch("expenseType"); 
  const selecetedDate =  methods?.watch("date")

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleChange = (data: any) => {
    setDescription(data);
    methods.setValue("description", data); 
  };

  const handleChangeAmount = (data: any) => {
    setAmount(data);
    methods.setValue("amount", data);
  };

  const toggleStoreDropdown = () => {
    setIsStoreDropdownOpen((prev) => !prev);
    setIsExpenseDropdownOpen(false); // Close the other dropdown
  }


  const toggleExpenseDropdown = () => {
    setIsExpenseDropdownOpen((prev) => !prev);
    setIsStoreDropdownOpen(false); // Close the other dropdown
  };
 
  const fetchDropdownData = async () => {
    try {
      const response = await sendApiRequest({ mode: "getallstores" });
      if (response?.status === 200) {
        setStore(response?.data?.stores || []);
      } else {
        handleError(response?.message);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  
    try {
      const response = await sendApiRequest({ mode: "getallexpensetypes" });
      if (response?.status === 200) {
        setExpensetypes(response?.data?.expensetypes || []);
      } else {
        handleError(response?.message);
      }
    } catch (error) {
      console.error("Error fetching expense types:", error);
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
    const jsonData: JsonData = {
      mode: "updateexpense",
      expensedate: format(data?.date, "yyyy-MM-dd"),
      expenseid: data?.expenseTypeId,
      storeid: data?.storeId,
      description: data?.description,
      amount: Number(data?.amount),
      id:Number(initialData?.id)
    };
  
    try {
      const result: any = await sendApiRequest(jsonData);
      const { status, data: responseData } = result; // Assuming responseData contains the new expense data or its ID
  
      setCustomToast({
        message: status === 200 ? "Item updated successfully!" : "Failed to add item.",
        type: status === 200 ? "success" : "error",
      });

      if (status === 200) {
        setCustomToast({
          message: status === 200 ? "Item updated successfully!" : "Failed to add item.",
          type: status === 200 ? "success" : "error",
        });
        setTimeout(() => {
          setAddExpenses(true);
          closeModal();
        }, 300);
      };

    } catch (error) {
      setCustomToast({ message: "Error adding item", type: "error" });
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    // Set the default value for 'store' when component mounts
    if (!selectedStore && initialData?.storename) {
      methods.setValue("store", initialData?.storename);
      methods.setValue("storeId", initialData?.storeid); // Optionally set storeId if available
    }

    if (!selectedExpense && initialData?.expensename) {
      methods.setValue("expenseType", initialData?.expensename);
      methods.setValue("expenseTypeId", initialData?.expenseid); // Optionally set storeId if available
    }
    if (!selecetedDate && initialData?.expensedate) {
      methods.setValue("date", initialData?.expensedate);
    }
  }, [initialData]);
  
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
            className="flex justify-center w-4 h-4 below-md:w-5 below-md:h-5 text-left"
          />
        </button>
      </div>



      {/* Dialog for the modal */}
      <Dialog open={isOpen} as="div" className="relative z-50" onClose={closeModal}>
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-[335px] h-[430px] below-md:w-[94%] below-md:h-[450] px-6 below-md:px-4 py-3 bg-white rounded-lg shadow-lg flex flex-col">
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
                  className="text-[16px]  font-bold leading-custom text-[#3D3D3D]"
                >
                  Edit Expense
                </DialogTitle>
              </div>
            </div>


            {/* EditExpense Form */}
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
              >
                <div className="flex flex-col h-full mt-4 gap-6">
                <Dropdown
                    options={store}
                    selectedOption={selectedStore ? selectedStore || "Store" : initialData?.storename } 
                    onSelect={(selectedOption) => {
                      setValue("store", selectedOption.name); 
                      setValue("storeId", selectedOption.id);
                      setIsStoreDropdownOpen(false); 
                      clearErrors("store"); 

                    }}
                    isOpen={isStoreDropdownOpen}
                    toggleOpen={toggleStoreDropdown}
                    widthchange="w-full"
                    {...methods.register("store", {
                      required: "Store Selection is required",
                    })}
                    errors={methods.formState.errors.store} 
                  />

                  {/* Expense Type Input Field */}
                  <Dropdown
                    options={expensetypes}
                    selectedOption={ selectedExpense ? selectedExpense || "Expense Type" : initialData?.expensename } 
                    onSelect={(selectedOption) => {
                      setValue("expenseType", selectedOption.name);
                      setValue("expenseTypeId", selectedOption.id);
                      setIsExpenseDropdownOpen(false);
                      clearErrors("expenseType"); 

                    }}
                    isOpen={isExpenseDropdownOpen}
                    toggleOpen={toggleExpenseDropdown}
                    widthchange="w-full"
                    {...methods.register("expenseType", {
                      required: "Expense Type is required",
                    })}
                    errors={methods.formState.errors.expenseType} // Explicitly cast the type
                  />

                  {/* Date input field */}
                  <CustomDatePicker
                       value={  selecetedDate ? selecetedDate: initialData?.expensedate }
                       onChange={(date) =>
                       methods.setValue("date", date, { shouldValidate: true })
                     }
                       placeholder="Date"
                       errors={methods.formState.errors.date?.message}
                      /> 
                
                  {/* Description field */}
                  <InputField
                  type="text"
                  label="Description"
                  borderClassName="border border-gray-300"
                  labelBackgroundColor="bg-white"
                  value={description}
                    textColor="text-[#636363]"
                  {...register("description", {
                    required: "Description is required",
                  })}
                  errors={errors.description}
                  placeholder="Description"
                  variant="outline"
                  onChange={(e: any) => handleChange(e.target.value)}
                />

                  {/* Amount Field */}
                  <InputField
                  type="number"
                  label="Amount"
                  borderClassName="border border-gray-300"
                  labelBackgroundColor="bg-white"
                  value={amount}
                     textColor="text-[#636363]"
                  {...register("amount", {
                    required: "Amount is required",
                    min: {
                      value: 0,
                      message: "Amount must be a positive number",
                    },
                  })}
                  errors={errors.amount}
                  placeholder="Enter Amount"
                  variant="outline"
                  onChange={(e: any) => handleChangeAmount(e.target.value)}
                />

                  <div className="flex justify-between gap-3 items-center w-full">
                    <button type="button"
                      className="px-4  below-md:px-2 md:py-1 text-[14px] text-[#6F6F6F] h-[35px] w-[165px] hover:bg-[#C9C9C9] bg-[#E4E4E4] rounded-md"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-4 text-white md:text[13px] text-[14px] h-[35px] w-[165px] bg-[#168A6F] hover:bg-[#11735C] rounded-md "
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


export default EditExpense;
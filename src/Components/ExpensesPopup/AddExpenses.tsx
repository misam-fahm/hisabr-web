"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import "react-datepicker/dist/react-datepicker.css";
import Dropdown from "@/Components/UI/Themes/DropDown";
import { FormProvider, useForm, } from "react-hook-form";
import { format } from "date-fns";
import { InputField } from "../UI/Themes/InputField";
import CustomDatePicker from "../UI/Themes/CustomDatePicker";
import { sendApiRequest } from "@/utils/apiUtils";
import ToastNotification, { ToastNotificationProps } from "../UI/ToastNotification/ToastNotification";
import router from "next/router";

type ExpenseFormInputs = {
  expenseName: string;
  amount: number;
  date: Date; // The date field
};

interface JsonData {
  mode: string;
  storeid: number | null;
  expensedate: any;
  amount: number | null;
  expenseid: number | null;
  description: string;
}

interface CustomToast {
  toastMessage: string;
  toastType: string;
}

const AddExpenses = ({ setAddExpenses , SelectedStore }: any) => {

  const methods = useForm();
  const { setValue, watch, trigger , clearErrors } = methods;
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const { control, handleSubmit, register, formState: { errors }, } = useForm<ExpenseFormInputs>();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedOption, setSelectedOption] = useState<any>();
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [isExpenseDropdownOpen, setIsExpenseDropdownOpen] = useState(false);
  const selectedStore = watch("store");
  const selectedExpense = watch("expenseType");
  // const [isStoreFetched, setIsStoreFetched] = useState(false);
  // const [isExpenseFetched, setIsExpenseFetched] = useState(false);
  const [expensetypes, setExpensetypes] = useState<any[]>([]);
  const [store, setStore] = useState<any[]>([]);
  const [isVerifiedUser, setIsVerifiedUser] = useState<boolean>(false);
  const [customToast, setCustomToast] = useState<CustomToast>({
    toastMessage: "",
    toastType: "",
  });

  const toggleStoreDropdown = () => {
    setIsStoreDropdownOpen((prev) => !prev);
    setIsExpenseDropdownOpen(false);
  };
  const toggleExpenseDropdown = () => {
    setIsExpenseDropdownOpen((prev) => !prev);
    setIsStoreDropdownOpen(false);
  };

  const handleError = (message: string) => {
    setCustomToast({
      toastMessage: message,
      toastType: "error",
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

  const handleChange = (data: any) => {
    setDescription(data);
    methods.setValue("description", data);
  };

  const handleChangeAmount = (data: any) => {
    setAmount(data);
    methods.setValue("amount", data);
  };

  const verifyToken = async (token: string) => {
    try {
      const res: any = await sendApiRequest({
        token: token
      }, `auth/verifyToken`);
      res?.status === 200
        ? setIsVerifiedUser(true)
        : router.replace('/login');
    } catch (error) {
      router.replace('/login');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
    } else {
      verifyToken(token);
    }
  }, []);

  const getUserStore = async () => {
    try {
      const response = await sendApiRequest({ mode: "getUserStore" });
      if (response?.status === 200) {
        setStore(response?.data?.stores || []);
      
      } else {
        handleError(response?.message);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };
  useEffect(() => {
    if (isVerifiedUser) {
      // const currentYear = new Date().getFullYear();
      // setStartDate(new Date(`${currentYear}-01-01`));
      // setEndDate(new Date(`${currentYear}-12-31`));
      getUserStore();
      // fetchDropdownData();
    }
  }, [isVerifiedUser]);


  const openModal = async () => {
    setIsOpen(true);
    methods.reset({
      store: "",
      storeId: null,
      expenseType: "",
      expenseTypeId: null,
      date: null,
      description: "",
      amount: "",
    });

    setDescription("");
    setAmount("");


    try {
      const response: any = await sendApiRequest({ mode: "getAllExpenseTypes" });
      if (response?.status === 200) {
        setExpensetypes(response?.data?.expensetypes || []);
        // setIsExpenseFetched(true); 
      } else {
        setCustomToast({
          ...customToast,
          toastMessage: response?.message,
          toastType: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching expense types:", error);
    }

  };
  const closeModal = () => setIsOpen(false);

  // const onSubmit = (data: any) => {
  //   const payload = {
  //     date: format(data?.date , "MM-dd-yyyy"),
  //        expenseType: data?.expenseTypeId,
  //      store: data?.storeId,
  //    description: data?.description,
  //        amount: data?.amount,
  //   };
  //   console.log("Form Data with IDs:", payload);
  // };

  const onSubmit = async (data: any) => {

    const jsonData: JsonData = {
      mode: "insertExpense",
      expensedate: format(methods.watch("date") || today, "yyyy-MM-dd"),
      expenseid: data?.expenseTypeId,
      storeid: Number(methods.watch("store")),
      // storeid: selectedOption?.id || 69,
      description: data?.description,
      amount: Number(data?.amount),
    };

    try {
      const result: any = await sendApiRequest(jsonData);
      const { status, data: responseData } = result; // Assuming responseData contains the new expense data or its ID
      setTimeout(() => {
        setCustomToast({
          toastMessage: status === 200 ? "Expenses added successfully!" : "Failed to add item.",
          toastType: status === 200 ? "success" : "error",
        });
      }, 0);
      if (status === 200) {
        closeModal();
        setAddExpenses(true)
      }
    } catch (error: any) {
      setTimeout(() => {
        setCustomToast({
          toastMessage: error?.message,
          toastType: "error",
        });
      }, 0);
    }
  };

  const today = new Date();

  useEffect(() => {
    if (selectedOption || SelectedStore) {
      methods.setValue("store", selectedOption?.id ? selectedOption?.id : SelectedStore?.id, { shouldValidate: true }); 
    }
    trigger("store");
    if (!methods.watch("date")) {
      methods.setValue("date", today, { shouldValidate: true });
    }
  }, [selectedOption , SelectedStore , methods, isOpen]);

  return (
    <>
      <ToastNotification
        message={customToast.toastMessage}
        type={customToast.toastType}
      />
      <div className="hidden below-md:block sticky">
        <button
          onClick={openModal}
          onTouchStart={handlePressStart}
          onMouseLeave={handlePressEnd}
          className="focus:outline-none flex items-center justify-center bg-[#168A6F]  w-[56px] h-[56px] rounded-xl relative"
        >
          <img
            src="/images/webaddicon.svg"
            alt="AddExpense"
            className="w-[18px] h-[18px]"
          />
          {showTooltip && (
            <div className="absolute bottom-[75px] right-[80%] transform translate-x-1/2 bg-[#79747E] text-white text-[12px] px-5 py-2 rounded-md whitespace-nowrap">
              Add Expenses
              {/* Tooltip Pointer */}
              <div className="absolute top-full right-[20%] transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#79747E]"></div>
            </div>
          )}
        </button>
      </div>
      <div className="block below-md:hidden">
        <button
          onClick={openModal}
          className="bg-[#168A6F] hover:bg-[#11735C] shadow-lg text-white w-[159px] text-[13px] gap-[0.25rem] font-medium h-[35px] rounded-md flex items-center justify-center "
        >
          <img className="" src="/images/webaddicon.svg" alt="" />
          Add Expenses
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
          <DialogPanel className="w-[335px] h-auto below-md:w-[94%] below-md:h-[450px] px-6 below-md:px-4 py-6 bg-white rounded-lg shadow-lg flex flex-col">
            <div className="relative">
              <div className="flex justify-center">
                <DialogTitle
                  as="h3"
                  className="text-[16px]  font-bold leading-custom text-[#3D3D3D]"
                >
                  Add Expense
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
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
              >
                <div className="flex flex-col  mt-4 gap-6">

                  {/* Store Input Field */}
                  <Dropdown
                    options={store}
                    selectedOption={selectedOption?.name || SelectedStore?.name || "Store"}
                    onSelect={(selectedOption: any) => {
                      setSelectedOption({
                        name: selectedOption.name ,
                        id: selectedOption.id  ,
                      });
                      setIsStoreDropdownOpen(false);
                      methods.setValue("store", selectedOption.id  ? selectedOption?.id : SelectedStore?.id , { shouldValidate: true });
                      trigger("store");
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
                    selectedOption={selectedExpense || "Expense Type"}
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


                  <CustomDatePicker
  value={methods.watch("date")}
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
                    borderClassName=" border border-gray-300"
                    labelBackgroundColor="bg-white"
                    value={description}
                    textColor="text-[#636363]"
                    {...methods?.register("description", {
                      required: "Description is required",
                    })}
                    errors={methods.formState.errors.description}
                    placeholder="Description"
                    variant="outline"
                    onChange={(e: any) => handleChange(e.target.value)}
                  />

                  {/* Amount Field */}
                  <InputField
                    type="number" // Use type="number" for numeric input
                    label="Amount"
                    borderClassName="border border-gray-300"
                    labelBackgroundColor="bg-white"
                    value={amount}
                    textColor="text-[#636363]"
                    {...methods?.register("amount", {
                      required: "Amount is required",
                      min: {
                        value: 0,
                        message: "Amount must be a positive number",
                      },
                    })}
                    errors={methods.formState.errors.amount}
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

export default AddExpenses;

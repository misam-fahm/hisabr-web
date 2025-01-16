"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
//import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FormProvider, useForm, Controller, FieldError } from "react-hook-form";
import Dropdown from "../UI/Themes/DropDown";
import CustomDatePicker from "../UI/Themes/CustomDatePicker";
import { InputField } from "@/Components/UI/Themes/InputField";

type ExpenseFormInputs = {
  amount: number;
  date: Date; // The date field
  store: string;
  expenseType: string;
  description: string;
};
type EditExpensesProps = {
  initialData: ExpenseFormInputs; // Existing expense data to edit
  onSubmit: (data: ExpenseFormInputs) => void; // Callback to handle form submission
  onClose: () => void; // Callback to close the modal
};


const EditExpense = ({ initialData, onSubmit }: EditExpensesProps) => {
  const methods = useForm<ExpenseFormInputs>({
    defaultValues: initialData, // Prepopulate form with existing data
  });
  const {  setValue, watch, control, register, formState, handleSubmit } = methods;
  const { errors } = formState;

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const handleChange = (data: any) => {
    setDescription(data); // Update local state
    methods.setValue("description", data); // Update form state in react-hook-form
  };
  const handleChangeAmount = (data: any) => {
    setAmount(data);
    methods.setValue("amount", data);
  };

  // const onSubmit = (data: any) => {
  //   console.log("Form Data:", data);
  // };
  // const {
  //   control,
  //   handleSubmit,
  //   register,
  //   formState: { errors },
  // } = useForm<ExpenseFormInputs>(); // Initialize React Hook Form


  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);


  //Dropdown
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [isExpenseDropdownOpen, setIsExpenseDropdownOpen] = useState(false);
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleStoreDropdown = () => {
    setIsStoreDropdownOpen((prev) => !prev);
    setIsExpenseDropdownOpen(false); // Close the other dropdown
  }
  const storeOptions = ["Store 1", "Store 2", "Store 3", "All Store"];
  const selectedStore = watch("store"); // Watch the "store" field for changes

  const toggleExpenseDropdown = () => {
    setIsExpenseDropdownOpen((prev) => !prev);
    setIsStoreDropdownOpen(false); // Close the other dropdown
  };
  const expenseTypes = ["Travel", "Food", "Accommodation", "Miscellaneous"];
  const selectedExpense = watch("expenseType"); // Watch the "store" field for changes









  return (
    <>
      <div>
        <button onClick={openModal}>
          <img
            src="/images/editpencilicon.svg"
            className="flex justify-center w-4 h-4 below-md:h-5 below-md:w-5 text-left"
          />
        </button>
      </div>



      {/* Dialog for the modal */}
      <Dialog open={isOpen} as="div" className="relative z-50" onClose={closeModal}>
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-[335px] h-[430px] below-md:w-[94%] below-md:h-[400] px-6 below-md:px-3 py-6 bg-white rounded-lg shadow-lg flex flex-col">
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
                  {/* Store Input Field */}
                  <Dropdown
                  options={storeOptions}
                  selectedOption={watch("store") || "Store"}
                  onSelect={(selectedOption) => {
                    setValue("store", selectedOption);
                    setIsStoreDropdownOpen(false);
                  }}
                  isOpen={isStoreDropdownOpen}
                  toggleOpen={toggleStoreDropdown}
                  widthchange="w-full"
                  {...register("store", { required: "Store Selection is required" })}
                  errors={errors.store}
                />

                 

                  {/* Expense Type Input Field */}
                  <Dropdown
                  options={expenseTypes}
                  selectedOption={watch("expenseType") || "Expense Type"}
                  onSelect={(selectedOption) => {
                    setValue("expenseType", selectedOption);
                    setIsExpenseDropdownOpen(false);
                  }}
                  isOpen={isExpenseDropdownOpen}
                  toggleOpen={toggleExpenseDropdown}
                  widthchange="w-full"
                  {...register("expenseType", { required: "Expense Type is required" })}
                  errors={errors.expenseType}
                />

                  {/* Date input field */}
                  <Controller
                  name="date"
                  control={control}
                  rules={{ required: "Date is required" }}
                  render={({ field }) => (
                    <CustomDatePicker
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      placeholder="Date"
                    />
                  )}
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                )}
                  {/* <CalendarRangePicker
                       value={methods.watch("date")}
                       onChange={(date) =>
                       methods.setValue("date", date, { shouldValidate: true })
                     }
                       placeholder="Date"
                       errors={methods.formState.errors.date?.message}
                      /> */}


                  {/* Description field */}
                  <InputField
                  type="text"
                  label="Description"
                  borderClassName="border border-gray-400"
                  labelBackgroundColor="bg-white"
                  value={watch("description")}
                  textColor="text-gray-500"
                  {...register("description", {
                    required: "Description is required",
                  })}
                  errors={errors.description}
                  placeholder="Description"
                  variant="outline"
                />

                  {/* Amount Field */}
                  <InputField
                  type="number"
                  label="Amount"
                  borderClassName="border border-gray-400"
                  labelBackgroundColor="bg-white"
                  value={watch("amount")}
                  textColor="text-gray-500"
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
                />

                  <div className="flex justify-between gap-3 items-center w-full">
                    <button type="button"
                      className="px-4  below-md:px-2 md:py-1 text-[14px] text-[#6F6F6F] md:h-[35px] w-[165px] hover:bg-[#C9C9C9] bg-[#E4E4E4] rounded-md"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-4 text-white md:text[13px] text-[14px] md:h-[35px] w-[165px] bg-[#168A6F] hover:bg-[#11735C] rounded-md "
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
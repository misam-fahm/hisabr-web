"use client";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { InputField } from "@/Components/UI/Themes/InputField";
import Dropdown from "@/Components/UI/Themes/DropDown";
import { ToastNotificationProps } from "@/Components/UI/ToastNotification/ToastNotification";
import { sendApiRequest } from "@/utils/apiUtils";

const Page = () => {
  const methods = useForm();
  const { watch, setValue, clearErrors } = methods;

  const selectedStore = watch("store");

  //const [selectedOption, setSelectedOption] = useState<any>();
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [store, setStore] = useState<any[]>([]);
  const [payrolltax, setPayrollTax] = useState("");
  const [laboursalary, setLabourSalary] = useState("");
  const [rentMortgage, setRentMortgage] = useState("");
  const [insurance, setInsurance] = useState("");
  const [propertytax, setPropertyTax] = useState("");
  const [trash, setTrash] = useState("");
  const [operatorsalary, setOeratorSlary] = useState("");
  const [nucO2, setNUCO2] = useState("");
  const [internet, setInternet] = useState("");
  const [waterbill, setWaterBill] = useState("");
  const [gasbill, setGasBill] = useState("");
  const [par, setPAR] = useState("");
  const [repair, setRepair] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [customToast, setCustomToast] = useState<ToastNotificationProps>({
    message: "",
    type: "",
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const toggleStoreDropdown = () => {
    setIsStoreDropdownOpen((prev) => !prev);
  };

  const handleError = (message: string) => {
    setCustomToast({
      message,
      type: "error",
    });
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
  };
  useEffect(() => {
    fetchDropdownData();
  }, []);

  const handleChangePayrollTax = (data: any) => {
    setPayrollTax(data); // Update local state
    methods.setValue("payrolltax", data); // Update form state in react-hook-form
  };

  const handleChangesetLabourSalary = (data: any) => {
    setLabourSalary(data); // Update local state
    methods.setValue("laboursalary", data); // Update form state in react-hook-form
  };

  const handleChangesetRentMortgage = (data: any) => {
    setRentMortgage(data); // Update local state
    methods.setValue("rent", data); // Update form state in react-hook-form
  };

  const handleChangesetInsurance = (data: any) => {
    setInsurance(data); // Update local state
    methods.setValue("insurance", data); // Update form state in react-hook-form
  };

  const handleChangesetPropertyTax = (data: any) => {
    setPropertyTax(data); // Update local state
    methods.setValue("propertytax", data); // Update form state in react-hook-form
  };

  const handleChangesetTrash = (data: any) => {
    setTrash(data); // Update local state
    methods.setValue("trash", data); // Update form state in react-hook-form
  };

  const handleChangeOperatorSalary = (data: any) => {
    setOeratorSlary(data); // Update local state
    methods.setValue("operatorsalary", data); // Update form state in react-hook-form
  };

  const handleChangeNUCO2 = (data: any) => {
    setNUCO2(data); // Update local state
    methods.setValue("nucO2", data); // Update form state in react-hook-form
  };

  const handleChangesetInternet = (data: any) => {
    setInternet(data); // Update local state
    methods.setValue("internet", data); // Update form state in react-hook-form
  };

  const handleChangewaterbill = (data: any) => {
    setWaterBill(data); // Update local state
    methods.setValue("waterbill", data); // Update form state in react-hook-form
  };

  const handleChangesetGasBill = (data: any) => {
    setGasBill(data); // Update local state
    methods.setValue("waterbill", data); // Update form state in react-hook-form
  };

  const handleChangePAR = (data: any) => {
    setPAR(data); // Update local state
    methods.setValue("par", data); // Update form state in react-hook-form
  };

  const handleChangeRepair = (data: any) => {
    setRepair(data); // Update local state
    methods.setValue("repair", data); // Update form state in react-hook-form
  };
  console.log("selectedStore", selectedStore)

  return (

    <main
      className="max-h-[calc(100vh-50px)] below-lg:px-4 overflow-auto "
      style={{ scrollbarWidth: "thin" }}>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="w-full flex flex-col overflow-auto below-md:h-auto p-5 "
        >
          {/* Desktop View */}
          <div className="bg-white px-8 py-6 rounded-lg shadow-lg">
            <p className="text-[12px] font-normal mt-1 below-md:mt-0 text-[#5E6366]">
              Streamline and configure operational expenses for accurate
              tracking
            </p>
            <div className="below-lg:flex pt-7 below-md:pt-6">
              <p className="below-lg:w-[16%] text-[13px] font-medium text-[#5E6366]">
                Store Selection :
              </p>
              <Dropdown
                options={store}
                selectedOption={selectedStore || "Store"}
                onSelect={(selectedOption) => {
                  setValue("store", selectedOption.name);
                  setValue("storeId", selectedOption.id);
                  setIsStoreDropdownOpen(false);
                  clearErrors("store");

                }}
                isOpen={isStoreDropdownOpen}
                toggleOpen={toggleStoreDropdown}
                widthchange="w-[25%] below-md:mt-4"
                {...methods.register("store", {
                  required: "Store Selection is required",
                })}
                errors={methods.formState.errors.store}
              />
            </div>
            <div className="below-lg:flex pt-7 below-md:pt-4">
              <p className="below-lg:w-[16%] text-[13px] font-medium text-[#5E6366]">
                Yearly Expenses :
              </p>
              <div className="below-lg:w-[25%] below-lg:mr-5 below-md:pt-4">
                <InputField
                  type="text"
                  label="Insurance"
                  borderClassName=" border border-gray-300"
                  labelBackgroundColor="bg-white"
                  value={insurance}
                  textColor="text-[#636363]"
                  {...methods?.register("insurance", {
                    //  required: "Insurance is required",
                  })}
                  errors={methods.formState.errors.insurance}
                  variant="outline"
                  onChange={(e: any) => handleChangesetInsurance(e.target.value)}
                />
              </div>
              <div className="w-[25%] below-md:w-full below-md:pt-4">
                <InputField
                  type="text"
                  label="Property Tax"
                  borderClassName=" border border-gray-300"
                  labelBackgroundColor="bg-white"
                  value={propertytax}
                  textColor="text-[#636363]"
                  {...methods?.register("propertytax", {
                    // required: "Property Tax is required",
                  })}
                  errors={methods.formState.errors.propertytax}
                  placeholder="propertytax"
                  variant="outline"
                  onChange={(e: any) =>
                    handleChangesetPropertyTax(e.target.value)
                  }
                />
              </div>
            </div>
            <div>
              <div className="below-lg:flex pt-7 below-md:pt-4">
                <p className="below-lg:w-[16%] text-[13px] font-medium text-[#5E6366]">
                  Monthly Expenses :
                </p>
                <div className="below-lg:w-[25%] below-lg:mr-5 below-md:pt-4">
                  <InputField
                    type="text"
                    label="Rent/Mortgage"
                    borderClassName=" border border-gray-300"
                    labelBackgroundColor="bg-white"
                    value={rentMortgage}
                    textColor="text-[#636363]"
                    {...methods?.register("rentMortgage", {
                      // required: "Rent/Mortgage is required",
                    })}
                    errors={methods.formState.errors.rentMortgage}
                    placeholder="rentMortgage"
                    variant="outline"
                    onChange={(e: any) =>
                      handleChangesetRentMortgage(e.target.value)
                    }
                  />
                </div>
                <div className="below-lg:w-[25%] below-md:w-full below-md:pt-4">
                  <InputField
                    type="text"
                    label="Payroll Tax (%)"
                    borderClassName=" border border-gray-300"
                    labelBackgroundColor="bg-white"
                    value={payrolltax}
                    textColor="text-[#636363]"
                    {...methods?.register("payrolltax", {
                      //  required: "Payroll Tax (%) is required",
                    })}
                    errors={methods.formState.errors.payrolltax}
                    placeholder="payrolltax"
                    variant="outline"
                    onChange={(e: any) => handleChangePayrollTax(e.target.value)}
                  />
                </div>
                <div className="below-lg:w-[25%]  below-lg:ml-5 below-md:w-full below-md:pt-4">
                  <InputField
                    type="text"
                    label="Labour/Operator Salary"
                    borderClassName=" border border-gray-300"
                    labelBackgroundColor="bg-white"
                    value={laboursalary}
                    textColor="text-[#636363]"
                    {...methods?.register("laboursalary", {
                      //  required: "Labour Salary is required",
                    })}
                    errors={methods.formState.errors.laboursalary}
                    placeholder="laboursalary"
                    variant="outline"
                    onChange={(e: any) =>
                      handleChangesetLabourSalary(e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="below-lg:flex below-lg:mt-8">
                <div className="below-lg:w-[25%]  below-lg:ml-[16%] below-md:w-full below-md:pt-4">
                  <InputField
                    type="text"
                    label="NUCO2"
                    borderClassName=" border border-gray-300"
                    labelBackgroundColor="bg-white"
                    value={nucO2}
                    textColor="text-[#636363]"
                    {...methods?.register("nucO2", {
                      //  required: "NUCO2 is required",
                    })}
                    errors={methods.formState.errors.nucO2}
                    placeholder="nucO2"
                    variant="outline"
                    onChange={(e: any) => handleChangeNUCO2(e.target.value)}
                  />
                </div>
                <div className="below-lg:w-[25%]  below-lg:ml-5 below-md:w-full below-md:pt-4">
                <InputField
                  type="text"
                  label="Trash"
                  borderClassName=" border border-gray-300"
                  labelBackgroundColor="bg-white"
                  value={trash}
                  textColor="text-[#636363]"
                  {...methods?.register("trash", {
                    // required: "Trash is required",
                  })}
                  errors={methods.formState.errors.trash}
                  placeholder="trash"
                  variant="outline"
                  onChange={(e: any) => handleChangesetTrash(e.target.value)}
                />
              </div>
              <div className="below-lg:w-[25%] below-lg:ml-5 below-md:pt-4">
                  <InputField
                    type="text"
                    label="Internet"
                    borderClassName=" border border-gray-300"
                    labelBackgroundColor="bg-white"
                    value={internet}
                    textColor="text-[#636363]"
                    {...methods?.register("internet", {
                      // required: "Internet is required",
                    })}
                    errors={methods.formState.errors.internet}
                    placeholder="internet"
                    variant="outline"
                    onChange={(e: any) =>
                      handleChangesetInternet(e.target.value)
                    }
                  />
                </div> 
              </div>
              <div className="below-lg:flex below-lg:mt-8">
              <div className="below-lg:w-[25%]  below-lg:ml-[16%] below-md:w-full below-md:pt-4">
                  <InputField
                    type="text"
                    label="PAR"
                    borderClassName=" border border-gray-300"
                    labelBackgroundColor="bg-white"
                    value={par}
                    textColor="text-[#636363]"
                    {...methods?.register("par", {
                      //required: "PAR is required",
                    })}
                    errors={methods.formState.errors.par}
                    placeholder="par"
                    variant="outline"
                    onChange={(e: any) =>
                      handleChangePAR(e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
            <div>
              <div className="below-lg:flex below-lg:pt-7 below-md:pt-4">
                <p className="below-lg:w-[16%] text-[13px] font-medium text-[#5E6366]">
                  Other Expenses :
                </p>
                <div className="below-lg:w-[25%] below-md:w-full below-md:pt-4">
                  <InputField
                    type="text"
                    label="Water Bill"
                    borderClassName=" border border-gray-300"
                    labelBackgroundColor="bg-white"
                    value={waterbill}
                    textColor="text-[#636363]"
                    {...methods?.register("waterbill", {
                      // required: "Water Bill is required",
                    })}
                    errors={methods.formState.errors.waterbill}
                    placeholder="payrolltax"
                    variant="outline"
                    onChange={(e: any) => handleChangewaterbill(e.target.value)}
                  />
                </div>
                <div className="below-lg:w-[25%]  below-lg:ml-5 below-md:w-full below-md:pt-4">
                  <InputField
                    type="text"
                    label="Gas Bill"
                    borderClassName=" border border-gray-300"
                    labelBackgroundColor="bg-white"
                    value={gasbill}
                    textColor="text-[#636363]"
                    {...methods?.register("gasbill", {
                      //required: "Gas Bill is required",
                    })}
                    errors={methods.formState.errors.gasbill}
                    placeholder="gasbill"
                    variant="outline"
                    onChange={(e: any) =>
                      handleChangesetGasBill(e.target.value)
                    }
                  />
                </div>
                <div className="below-lg:w-[25%]  below-lg:ml-5 below-md:w-full below-md:pt-4 ">
                  <InputField
                    type="text"
                    label="Repair"
                    borderClassName=" border border-gray-300"
                    labelBackgroundColor="bg-white"
                    value={repair}
                    textColor="text-[#636363]"
                    {...methods?.register("repair", {
                      //  required: "Repair is required",
                    })}
                    errors={methods.formState.errors.repair}
                    placeholder="repair"
                    variant="outline"
                    onChange={(e: any) => handleChangeRepair(e.target.value)}
                  />
                </div>
              </div>
              <div className="below-lg:flex below-lg:justify-end below-lg:mr-10 below-md:pt-4 below-lg:my-6">
                <button className="bg-[#168A6F] hover:bg-[#11735C] text-[13px]  font-medium text-white rounded-md  h-[35px] w-[118px]">
                  Add
                </button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </main>
  );
};

export default Page;

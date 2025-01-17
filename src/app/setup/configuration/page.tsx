"use client";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { InputField } from "@/Components/UI/Themes/InputField";
import Dropdown from "@/Components/UI/Themes/DropDown";

const Page = () => {
  const methods = useForm();
  const { watch, setValue } = methods;

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const [selectedOption, setSelectedOption] = useState<string>("All stores");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [payrolltax, setPayrollTax] = useState("");
  const handleChangePayrollTax = (data: any) => {
    setPayrollTax(data); // Update local state
    methods.setValue("payrolltax", data); // Update form state in react-hook-form
  };

  const [laboursalary, setLabourSalary] = useState("");
  const handleChangesetLabourSalary = (data: any) => {
    setLabourSalary(data); // Update local state
    methods.setValue("laboursalary", data); // Update form state in react-hook-form
  };

  const [rentMortgage, setRentMortgage] = useState("");
  const handleChangesetRentMortgage = (data: any) => {
    setRentMortgage(data); // Update local state
    methods.setValue("rent", data); // Update form state in react-hook-form
  };

  const [insurance, setInsurance] = useState("");
  const handleChangesetInsurance = (data: any) => {
    setInsurance(data); // Update local state
    methods.setValue("insurance", data); // Update form state in react-hook-form
  };

  const [propertytax, setPropertyTax] = useState("");
  const handleChangesetPropertyTax = (data: any) => {
    setPropertyTax(data); // Update local state
    methods.setValue("propertytax", data); // Update form state in react-hook-form
  };

  const [trash, setTrash] = useState("");
  const handleChangesetTrash = (data: any) => {
    setTrash(data); // Update local state
    methods.setValue("trash", data); // Update form state in react-hook-form
  };

  const [operatorsalary, setOeratorSlary] = useState("");
  const handleChangeOperatorSalary = (data: any) => {
    setOeratorSlary(data); // Update local state
    methods.setValue("operatorsalary", data); // Update form state in react-hook-form
  };

  const [nucO2, setNUCO2] = useState("");
  const handleChangeNUCO2 = (data: any) => {
    setNUCO2(data); // Update local state
    methods.setValue("nucO2", data); // Update form state in react-hook-form
  };

  const [internet, setInternet] = useState("");
  const handleChangesetInternet = (data: any) => {
    setInternet(data); // Update local state
    methods.setValue("internet", data); // Update form state in react-hook-form
  };

  const [waterbill, setWaterBill] = useState("");
  const handleChangewaterbill = (data: any) => {
    setWaterBill(data); // Update local state
    methods.setValue("waterbill", data); // Update form state in react-hook-form
  };

  const [gasbill, setGasBill] = useState("");
  const handleChangesetGasBill = (data: any) => {
    setGasBill(data); // Update local state
    methods.setValue("waterbill", data); // Update form state in react-hook-form
  };

  const [par, setPAR] = useState("");
  const handleChangePAR = (data: any) => {
    setPAR(data); // Update local state
    methods.setValue("par", data); // Update form state in react-hook-form
  };

  const [repair, setRepair] = useState("");
  const handleChangeRepair = (data: any) => {
    setRepair(data); // Update local state
    methods.setValue("repair", data); // Update form state in react-hook-form
  };

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const toggleDropdown1 = () => {
    setIsStoreDropdownOpen((prev) => !prev);
  };
  const options = ["Store 1", "Store 2", "Store 3", "All Store"];
  const selectedStore = watch("store"); // Watch the "store" field for changes

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="w-full flex flex-col overflow-auto below-md:h-[850px] p-5"
      >
        <div  className="bg-white py-6 px-8 rounded-lg shadow-lg block md:hidden  ">
        <p className="text-[12px] font-normal mt-1 text-[#5E6366]">
              Streamline and configure operational expenses for accurate
              tracking
            </p>
            <div className=" pt-8">
            <p className="text-[15px] font-medium text-[#5E6366]">
              Store Selection :
            </p>
            <Dropdown
              options={options}
              selectedOption={selectedStore || "Store"}
              onSelect={(selectedOption) => {
                setValue("store", selectedOption);
                setIsStoreDropdownOpen(false);
              }}
              isOpen={isStoreDropdownOpen}
              toggleOpen={toggleDropdown1}
              widthchange="w-[25%] mt-4"
            />
          </div>
          <div className="pt-4">
            <p className="text-[15px] font-medium text-[#5E6366]">
              Yearly Expenses :
            </p>

            <div className="pt-4">
              <InputField
                type="text"
                label="Insurance"
                borderClassName=" border border-gray-200"
                labelBackgroundColor="bg-white"
                value={insurance}
                textColor="text-gray-500"
                {...methods?.register("insurance", {
                //  required: "Insurance is required",
                })}
                errors={methods.formState.errors.insurance}
                variant="outline"
                onChange={(e: any) => handleChangesetInsurance(e.target.value)}
              />
            </div>
            <div className="pt-4">
              <InputField
                type="text"
                label="Property Tax"
                borderClassName=" border border-gray-200"
                labelBackgroundColor="bg-white"
                value={propertytax}
                textColor="text-gray-500"
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
            <div className="pt-4">
              <InputField
                type="text"
                label="Trash"
                borderClassName=" border border-gray-200"
                labelBackgroundColor="bg-white"
                value={trash}
                textColor="text-gray-500"
                {...methods?.register("trash", {
                 // required: "Trash is required",
                })}
                errors={methods.formState.errors.trash}
                placeholder="trash"
                variant="outline"
                onChange={(e: any) => handleChangesetTrash(e.target.value)}
              />
            </div>
          </div>
          <div className="pt-4">
              <p className="text-[15px] font-medium text-[#5E6366]">
                Monthly Expenses :
              </p>

              <div className="pt-4">
                <InputField
                  type="text"
                  label="Rent/Mortgage"
                  borderClassName=" border border-gray-200"
                  labelBackgroundColor="bg-white"
                  value={rentMortgage}
                  textColor="text-gray-500"
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
              <div className="pt-4">
                <InputField
                  type="text"
                  label="Payroll Tax (%)"
                  borderClassName=" border border-gray-200"
                  labelBackgroundColor="bg-white"
                  value={payrolltax}
                  textColor="text-gray-500"
                  {...methods?.register("payrolltax", {
                  //  required: "Payroll Tax (%) is required",
                  })}
                  errors={methods.formState.errors.payrolltax}
                  placeholder="payrolltax"
                  variant="outline"
                  onChange={(e: any) => handleChangePayrollTax(e.target.value)}
                />
              </div>
              <div className="pt-4">
                <InputField
                  type="text"
                  label="Labour Salary"
                  borderClassName=" border border-gray-200"
                  labelBackgroundColor="bg-white"
                  value={laboursalary}
                  textColor="text-gray-500"
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
              <div className="pt-4">
                <InputField
                  type="text"
                  label="Operator Salary"
                  borderClassName=" border border-gray-200"
                  labelBackgroundColor="bg-white"
                  value={operatorsalary}
                  textColor="text-gray-500"
                  {...methods?.register("operatorsalary", {
                  // required: "Operator Salary is required",
                  })}
                  errors={methods.formState.errors.operatorsalary}
                  placeholder="operatorsalary"
                  variant="outline"
                  onChange={(e: any) =>
                    handleChangeOperatorSalary(e.target.value)
                  }
                />
              </div>
              <div className="pt-4">
                <InputField
                  type="text"
                  label="NUCO2"
                  borderClassName=" border border-gray-200"
                  labelBackgroundColor="bg-white"
                  value={nucO2}
                  textColor="text-gray-500"
                  {...methods?.register("nucO2", {
                  //  required: "NUCO2 is required",
                  })}
                  errors={methods.formState.errors.nucO2}
                  placeholder="nucO2"
                  variant="outline"
                  onChange={(e: any) => handleChangeNUCO2(e.target.value)}
                />
              </div>
              
            </div>

            <div className="pt-4">
              <p className="text-[15px] font-medium text-[#5E6366]">
              Other Expenses :
              </p>

              <div className="pt-4">
                <InputField
                  type="text"
                  label="Internet"
                  borderClassName=" border border-gray-200"
                  labelBackgroundColor="bg-white"
                  value={internet}
                  textColor="text-gray-500"
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
              <div className="pt-4">
                <InputField
                  type="text"
                  label="Water Bill"
                  borderClassName=" border border-gray-200"
                  labelBackgroundColor="bg-white"
                  value={waterbill}
                  textColor="text-gray-500"
                  {...methods?.register("waterbill", {
                   // required: "Water Bill is required",
                  })}
                  errors={methods.formState.errors.waterbill}
                  placeholder="payrolltax"
                  variant="outline"
                  onChange={(e: any) => handleChangewaterbill(e.target.value)}
                />
              </div>
              <div className="pt-4">
                <InputField
                  type="text"
                  label="Gas Bill"
                  borderClassName=" border border-gray-200"
                  labelBackgroundColor="bg-white"
                  value={gasbill}
                  textColor="text-gray-500"
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
              <div className="pt-4">
                <InputField
                  type="text"
                  label="PAR"
                  borderClassName=" border border-gray-200"
                  labelBackgroundColor="bg-white"
                  value={par}
                  textColor="text-gray-500"
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
              <div className="pt-4">
                <InputField
                  type="text"
                  label="Repair"
                  borderClassName=" border border-gray-200"
                  labelBackgroundColor="bg-white"
                  value={repair}
                  textColor="text-gray-500"
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
            <div  className="pt-4">
              <button className="bg-[#168A6F] hover:bg-[#11735C] text-[14px]  font-semibold text-white rounded-md  h-[35px] w-[118px]">
                Add
              </button>
            </div>
        </div>

         {/* Desktop View */}
        <div className="bg-white py-6 px-8 rounded-lg shadow-lg hidden md:block">
          
            
            <p className="text-[12px] font-normal mt-1 text-[#5E6366]">
              Streamline and configure operational expenses for accurate
              tracking
            </p>
        

          <div className="flex pt-8">
            <p className="w-[16%] text-[15px] font-medium text-[#5E6366]">
              Store Selection :
            </p>
            <Dropdown
              options={options}
              selectedOption={selectedStore || "Store"}
              onSelect={(selectedOption) => {
                setValue("store", selectedOption);
                setIsStoreDropdownOpen(false);
              }}
              isOpen={isStoreDropdownOpen}
              toggleOpen={toggleDropdown1}
              widthchange="w-[25%]"
            />
          </div>

          <div className="flex pt-8">
            <p className="w-[16%] text-[15px] font-medium text-[#5E6366]">
              Yearly Expenses :
            </p>

            <div className=" w-[25%] mr-5">
              <InputField
                type="text"
                label="Insurance"
                borderClassName=" border border-gray-200"
                labelBackgroundColor="bg-white"
                value={insurance}
                textColor="text-gray-500"
                {...methods?.register("insurance", {
                //  required: "Insurance is required",
                })}
                errors={methods.formState.errors.insurance}
                variant="outline"
                onChange={(e: any) => handleChangesetInsurance(e.target.value)}
              />
            </div>
            <div className="w-[25%] below-md:w-full">
              <InputField
                type="text"
                label="Property Tax"
                borderClassName=" border border-gray-200"
                labelBackgroundColor="bg-white"
                value={propertytax}
                textColor="text-gray-500"
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
            <div className="w-[25%]  ml-5 below-md:w-full">
              <InputField
                type="text"
                label="Trash"
                borderClassName=" border border-gray-200"
                labelBackgroundColor="bg-white"
                value={trash}
                textColor="text-gray-500"
                {...methods?.register("trash", {
                 // required: "Trash is required",
                })}
                errors={methods.formState.errors.trash}
                placeholder="trash"
                variant="outline"
                onChange={(e: any) => handleChangesetTrash(e.target.value)}
              />
            </div>
          </div>
          <div>
            <div className="flex pt-8">
              <p className="w-[16%] text-[15px] font-medium text-[#5E6366]">
                Monthly Expenses :
              </p>

              <div className=" w-[25%] mr-5">
                <InputField
                  type="text"
                  label="Rent/Mortgage"
                  borderClassName=" border border-gray-200"
                  labelBackgroundColor="bg-white"
                  value={rentMortgage}
                  textColor="text-gray-500"
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
              <div className="w-[25%] below-md:w-full">
                <InputField
                  type="text"
                  label="Payroll Tax (%)"
                  borderClassName=" border border-gray-200"
                  labelBackgroundColor="bg-white"
                  value={payrolltax}
                  textColor="text-gray-500"
                  {...methods?.register("payrolltax", {
                  //  required: "Payroll Tax (%) is required",
                  })}
                  errors={methods.formState.errors.payrolltax}
                  placeholder="payrolltax"
                  variant="outline"
                  onChange={(e: any) => handleChangePayrollTax(e.target.value)}
                />
              </div>
              <div className="w-[25%]  ml-5 below-md:w-full">
                <InputField
                  type="text"
                  label="Labour Salary"
                  borderClassName=" border border-gray-200"
                  labelBackgroundColor="bg-white"
                  value={laboursalary}
                  textColor="text-gray-500"
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
            <div className="flex mt-8">
              
              <div className="w-[25%]  ml-[16%] below-md:w-full">
                <InputField
                  type="text"
                  label="Operator Salary"
                  borderClassName=" border border-gray-200"
                  labelBackgroundColor="bg-white"
                  value={operatorsalary}
                  textColor="text-gray-500"
                  {...methods?.register("operatorsalary", {
                  // required: "Operator Salary is required",
                  })}
                  errors={methods.formState.errors.operatorsalary}
                  placeholder="operatorsalary"
                  variant="outline"
                  onChange={(e: any) =>
                    handleChangeOperatorSalary(e.target.value)
                  }
                />
              </div>
              <div className="w-[25%]  ml-5 below-md:w-full">
                <InputField
                  type="text"
                  label="NUCO2"
                  borderClassName=" border border-gray-200"
                  labelBackgroundColor="bg-white"
                  value={nucO2}
                  textColor="text-gray-500"
                  {...methods?.register("nucO2", {
                  //  required: "NUCO2 is required",
                  })}
                  errors={methods.formState.errors.nucO2}
                  placeholder="nucO2"
                  variant="outline"
                  onChange={(e: any) => handleChangeNUCO2(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div>
            <div className="flex pt-8">
              <p className="w-[16%] text-[15px] font-medium text-[#5E6366]">
              Other Expenses :
              </p>

              <div className=" w-[25%] mr-5">
                <InputField
                  type="text"
                  label="Internet"
                  borderClassName=" border border-gray-200"
                  labelBackgroundColor="bg-white"
                  value={internet}
                  textColor="text-gray-500"
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
              <div className="w-[25%] below-md:w-full">
                <InputField
                  type="text"
                  label="Water Bill"
                  borderClassName=" border border-gray-200"
                  labelBackgroundColor="bg-white"
                  value={waterbill}
                  textColor="text-gray-500"
                  {...methods?.register("waterbill", {
                   // required: "Water Bill is required",
                  })}
                  errors={methods.formState.errors.waterbill}
                  placeholder="payrolltax"
                  variant="outline"
                  onChange={(e: any) => handleChangewaterbill(e.target.value)}
                />
              </div>
              <div className="w-[25%]  ml-5 below-md:w-full">
                <InputField
                  type="text"
                  label="Gas Bill"
                  borderClassName=" border border-gray-200"
                  labelBackgroundColor="bg-white"
                  value={gasbill}
                  textColor="text-gray-500"
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
            </div>
            <div className="flex mt-8">
              
              <div className="w-[25%]  ml-[16%] below-md:w-full">
                <InputField
                  type="text"
                  label="PAR"
                  borderClassName=" border border-gray-200"
                  labelBackgroundColor="bg-white"
                  value={par}
                  textColor="text-gray-500"
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
              <div className="w-[25%]  ml-5 below-md:w-full">
                <InputField
                  type="text"
                  label="Repair"
                  borderClassName=" border border-gray-200"
                  labelBackgroundColor="bg-white"
                  value={repair}
                  textColor="text-gray-500"
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
            <div  className="flex justify-end">
              <button className="bg-[#168A6F] hover:bg-[#11735C] text-[14px]  font-semibold text-white rounded-md  h-[35px] w-[118px]">
                Add
              </button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default Page;

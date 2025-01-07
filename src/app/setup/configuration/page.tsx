
"use client";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Inputtext } from "@/Components/ui/InputText";
import { Text } from "@/Components/ui/Common/Text";
import Dropdown from "@/Components/ui/Common/DropDown";

const Page = () => {
  const methods = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };
   

  const [selectedOption, setSelectedOption] = useState<string>("All stores");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const options = ["Store 1", "Store 2", "Store 3", "All Store"];

  const toggleDropdown1 = () => setIsOpen(!isOpen);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };


  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-8 p-10 "
      >
        <div className="bg-white py-10 px-5 rounded-lg">
        <div className="flex gap-2  justify-between ">
          <div className=" w-full below-md:w-full ">
          <Dropdown
            options={options}
            selectedOption={selectedOption}
            onSelect={handleSelect}
            isOpen={isOpen}
            toggleOpen={toggleDropdown1}
            widthchange="w-full"
            
          />
          </div>

          <div className="w-full below-md:w-full">
            <Inputtext
              type={"text"}
              label="Monthly Royalty"
              borderClassName="border border-[#5E6366]"
              labelBackgroundColor="bg-white"
              textColor="text-[#5E6366]"
              {...methods.register("monthlyroyalty", {
                required: "Monthly Royalty is required",
                
              })}
              errors={methods.formState.errors.monthlyroyalty}
              placeholder="Enter Monthly Royalty"
              variant="outline"
            />
          </div>
          <div className="w-full below-md:w-full">
            <Inputtext
              type={"text"}
              label="Labor Salary"
              borderClassName="border border-[#5E6366]"
              labelBackgroundColor="bg-white"
              textColor="text-[#5E6366]"
              {...methods.register("labor", {
                required: " Labor Salary is required",
              })}
              errors={methods.formState.errors.labor}
              placeholder="Enter Labor Salary"
              variant="outline"
            />
          </div>
          <div className="w-full below-md:w-full">
            <Inputtext
              type={"text"}
              label="Rent"
              borderClassName="border border-[#5E6366]"
              labelBackgroundColor="bg-white"
              textColor="text-[#5E6366]"
              {...methods.register("rent", {
                required: "Rent is required",
              
              })}
              errors={methods.formState.errors.rent}
              placeholder="Enter Rent"
              variant="outline"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-10 justify-center ">
          <div className="w-[25%] below-md:w-full">
            <Inputtext
              type={"text"}
              label="Electricity"
              borderClassName="border border-[#5E6366]"
              labelBackgroundColor="bg-white"
              textColor="text-[#5E6366]"
              {...methods.register("electricity", {
                required: "Electricity is required",
                
              })}
              errors={methods.formState.errors.electricity}
              placeholder="Enter Electricity"
              variant="outline"
            />
          </div>

          <div className="w-[25%] below-md:w-full">
            <Inputtext
              type={"text"}
              label="Mortgage"
              borderClassName="border border-[#5E6366]"
              labelBackgroundColor="bg-white"
              textColor="text-[#5E6366]"
              {...methods.register("mortgage", {
                required: "Mortgage is required",
               
              })}
              errors={methods.formState.errors.mortgage}
              placeholder="Enter Mortgage"
              variant="outline"
            />
          </div>
          <div className="w-[25%] below-md:w-full">
            <Inputtext
              type={"text"}
              label="Other Expenses"
              borderClassName="border border-[#5E6366]"
              labelBackgroundColor="bg-white"
              textColor="text-[#5E6366]"
              {...methods.register("otherexpenses", {
                required: "Other Expenses is required",
              
              })}
              errors={methods.formState.errors.otherexpenses}
              placeholder="Enter Other Expenses"
              variant="outline"
            />
          </div>
          <div className="flex justify-end w-[25%] below-md:w-full">
            <button className=" rounded-md text-white px-14 bg-[#168A6F] hover:bg-[#11735C] ">
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

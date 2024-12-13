"use client";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Inputtext } from "../ui/InputText"; 
import { Text } from "../ui/Common/Text";

const LoginForm = () => {
  const methods = useForm(); 

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <div className="bg-[#334155] w-full h-[100vh] flex justify-center below-md:flex-col">
        <div className="w-[50%] below-md:w-full flex justify-center items-center h-full  below-md:h-auto">
          <img
            className="w-auto h-[200px] below-md:h-[150px]"
            src="/images/HisabrFinalLogo.png"
            alt="Logo"
          />
        </div>

        <div className="flex justify-center items-center below-md:hidden">
          <div className="w-[1px] bg-[#FFFFFF] h-[60%]" />
        </div>

        <div className="w-[50%] below-md:w-full flex justify-center items-center">
          <div className="w-[460px] below-md:w-full h-[406px] below-md:px-4 flex justify-center flex-col">
            <div className="flex flex-col w-[340px] below-md:w-full h-[67px] mb-6">
              <p className="text-[25px] text-[#FFFFFF] font-medium">
              Reset Your Password
              </p>
              <p className="text-[14px] text-[#FFFFFF] font-normal">
              Enter your registered email, and we’ll send you a password reset link.
              </p>
            </div>

            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="w-full mt-4 flex flex-col gap-6"
            >
              <div className="w-[400px] below-md:w-full">
                <Inputtext
                  label="Email"
                  {...methods.register("email", {
                    required: "Email is required",
                    pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  })}
                  errors={methods.formState.errors.email}
                  placeholder="Enter email"
                  variant="outline"
                />
              </div>
              <div className="flex justify-start">
              <p className=" text-[#3BFCC6] font-normal text-[14px] cursor-pointer"   onClick={() => (window.location.href = "/login")} >
              Back to Sign In
              </p>
              </div> 

              <button
                type="submit"
                className="bg-[#1AA47D] w-[400px] below-md:w-full text-white py-2 px-4 rounded "
              >
                    SEND RESET LINK
              </button>
            </form>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default LoginForm;

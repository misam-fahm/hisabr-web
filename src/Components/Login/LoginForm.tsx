"use client";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Inputtext } from "../UI/Thems/InputText"; 
import { Text } from "../UI/Thems/Text";


const LoginForm = () => {

  const methods = useForm(); 
 
  const onSubmit = (data: any) => {
    console.log(data);
  };



  return (
    <FormProvider {...methods}>
      <div className="bg-[#334155] w-full h-[100vh] flex justify-center below-md:flex-col">
        <div className="w-[50%] below-md:w-full flex justify-center items-center h-full below-md:h-auto">
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
            <div className="flex flex-col w-[340px] below-md:w-full h-[67px]">
              <p className="text-[25px] text-[#FFFFFF] font-medium">
                Welcome Back
              </p>
              <p className="text-[14px] text-[#FFFFFF] font-normal">
                Start managing your finance faster and better
              </p>
            </div>

            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="w-full mt-4 flex flex-col gap-8"
            >
              <div className="w-[400px] below-md:w-full">
                <Inputtext
                  type={"email"} 
                  label="Email"
                  {...methods.register("email", {
                    required: "Email is required",
                    pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  })}
                  errors={methods.formState.errors.email}
                  placeholder="Enter email"
                  variant="outline"                />
              </div>

              <div className="w-[400px] below-md:w-full ">
                <Inputtext
                  type={"text"} 
                  label="Password"
                  {...methods.register("Password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long",
                    },
                    maxLength: {
                      value: 20,
                      message: "Password cannot exceed 20 characters",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                    },
                  })}
                  errors={methods.formState.errors.Password}
                  placeholder="Enter Password"
                  variant="outline"                />
                <div className="flex justify-end mt-2">
              <p className=" text-[#3BFCC6] font-normal text-[14px] cursor-pointer"   onClick={() => (window.location.href = "/forgotpassword")} >
              Forgot Password?
              </p>
              </div> 
              </div>
            
              <button
                type="submit"
                className="bg-[#1AA47D] w-[400px] below-md:w-full text-white py-2 px-4 rounded "
              >
                GET STARTED
              </button>
            </form>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default LoginForm;

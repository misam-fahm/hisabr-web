"use client";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { InputField } from "../UI/Themes/InputField";
import { Text } from "../UI/Themes/Text";
import { sendApiRequest } from "@/utils/apiUtils";
import ToastNotification from "../UI/ToastNotification/ToastNotification";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();
  const methods = useForm();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [customToast, setCustomToast] = useState({
    toastMessage: "",
    toastType: "",
  });

  const verifyToken = async (token: string) => {
    const res: any = await sendApiRequest({
      token: token
    }, `auth/verifyToken`);
    res?.status === 200 && router.replace("/sales-kpi");
  };
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
    } else {
      verifyToken(token);
    }    
  }, []);
  
  const onSubmit = async (data: any) => {
    try {
      setCustomToast({
        ...customToast,
        toastMessage: "",
        toastType: "",
      });
      if (email && password) {
        const getUser: any = await sendApiRequest({
          mode: "getUserByEmail",
          email: email,
        });
        if (getUser?.status === 200) {
          localStorage.setItem("UserType",  getUser?.data?.user[0]?.usertype);
          const val: any = {
            email: data?.email,
            password: data?.password,
            userid: getUser?.data?.user[0]?.userid,
            dbPassword: getUser?.data?.user[0]?.password,
            usertype: getUser?.data?.user[0]?.usertype,
            storeid: getUser?.data?.user[0]?.storeid,
          };
          const result: any = await sendApiRequest(val, `auth/login`);
          if (result?.status === 200 && result?.data?.token) {
            localStorage.setItem("token", result?.data?.token);
           
            router.replace("/sales-kpi");
          } else {
            // router.push("/login");
          }
        } else {
          setCustomToast({
            ...customToast,
            toastMessage: "User not found",
            toastType: "error",
          });
        }
      } else {
        setTimeout(() => {
          setCustomToast({
            toastMessage: email
              ? "Please enter password"
              : "Please enter email",
            toastType: "error",
          });
        }, 0);
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

  return (
    <FormProvider {...methods}>
      <ToastNotification
        message={customToast.toastMessage}
        type={customToast.toastType}
      />
      <div className="bg-[#0F1044] w-full h-[100vh] flex justify-center below-md:flex-col">
        <div className="w-[50%] below-md:w-full flex justify-center items-center h-full below-md:h-auto">
          <img
            className="w-auto h-[200px] below-md:h-[150px]"
            src="/images/HisabrNewLogo.svg"
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
                <InputField
                  type="email"
                  label="Email"
                  value={email ? email: ""}
                  maxLength={60}
                  className="bg-gray-100 focus:bg-gray-100 autofill:bg-gray-100" // Custom class for autofill
                  style={{
                    backgroundColor: "#f3f4f6",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "white",
                  }}
                  labelBackgroundColor="bg-[#0F1044]"
                  {...methods.register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                      message: "Invalid email format",
                    },
                    onChange: (e) => setEmail(e.target.value),
                  })}
                  errors={methods.formState.errors.email}
                  textColor="text-white"
                  placeholder="Enter email"
                  variant="outline"
                />
              </div>

              <div className="w-[400px] below-md:w-full ">
                <InputField
                  type={showPassword ? "text" : "password"} // Changed from "password" to "text"
                  label="Password"
                  value={password}
                  maxLength={20}
                  className="bg-gray-100 focus:bg-gray-100 autofill:bg-gray-100" // Custom class for autofill
                  style={{
                    backgroundColor: "#f3f4f6",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "white",
                  }}
                  {...methods.register("password", {
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
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message:
                        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                    },
                    onChange: (e) => setPassword(e.target.value),
                  })}
                  rightIcon={
                    <img
                      src="/images/fieldeyeicon.svg"
                      onClick={() => setShowPassword((prev: any) => !prev)}
                      className="cursor-pointer"
                    />
                  }
                  errors={methods.formState.errors.password} // Fixed casing
                  placeholder="Enter Password"
                  variant="outline"
                />

                <div className="flex justify-end mt-5">
                  <p
                    className=" text-[#3BFCC6] font-normal text-[13px] cursor-pointer"
                    onClick={() => (window.location.href = "/forgotpassword")}
                  >
                    Forgot Password?
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#1AA47D] w-[400px] below-md:w-full font-bold text-[14px] text-white py-2 px-4 rounded "
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

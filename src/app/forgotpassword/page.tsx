"use client";
import { InputField } from "@/Components/UI/Themes/InputField";
import ToastNotification from "@/Components/UI/ToastNotification/ToastNotification";
import { sendApiRequest } from "@/utils/apiUtils";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

const ForgotPassword = () => {
  const methods = useForm(); 
  const [email, setEmail] = useState("");
  const [customToast, setCustomToast] = useState({
    toastMessage: "",
    toastType: "",
  });
  
  const onSubmit = async (data: any) => {
    try {
      setCustomToast({
        ...customToast,
        toastMessage: "",
        toastType: "",
      });
      if (email) {
        const getUser: any = await sendApiRequest({
          mode: "getUserByEmail",
          email: email,
        });
        if (getUser?.status === 200) {
              // localStorage.setItem("UserType",  getUser?.data?.user[0]?.usertype);
          const genUUID: any = await sendApiRequest({
            mode: "generateUUID",
            email: getUser?.data?.user[0]?.email,
          });
          if (genUUID?.status === 200 && genUUID?.data?.uuid) {            
            const val: any = {
              to: getUser?.data?.user[0]?.email,
              name: getUser?.data?.user[0]?.firstname + " " + getUser?.data?.user[0]?.lastname,
              subject: "Reset Your Password",
              message: `Dear ${getUser?.data?.user[0]?.firstname? getUser?.data?.user[0]?.firstname : ""} ${getUser?.data?.user[0]?.lastname? getUser?.data?.user[0]?.lastname : ""},

              We received a request to reset the password for your account on ${Date()}. If you made this request, you can reset your password using the link below:

              ${process.env.WEB_BASE_URL + "/resetpassword?uuid=" + genUUID?.data?.uuid}

              If you didn't request this change, please ignore this email or let us know immediately by contacting our support team at support@hisabr.com.

              For security reasons, this link will expire in 24 hours.

              Thank you for being part of our community!

              Best regards,
              The Hisabr Team

              support@hisabr.com
              hisabr-web.vercel.app`
            };
            const result: any = await sendApiRequest(val, `sendEmail`);
            if (result?.status === 200) {
              setTimeout(() => {
                setCustomToast({
                  toastMessage: "Email send successfully",
                  toastType: "success",
                });
              }, 0);
              // router.replace("/");
            } else {
              setTimeout(() => {
                setCustomToast({
                  toastMessage: "Failed to send email",
                  toastType: "error",
                });
              }, 0);
              // router.push("/login");
            }
          } else {
            setCustomToast({
              ...customToast,
              toastMessage: "Failed to generate link",
              toastType: "error",
            });
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
            toastMessage: "Please enter email",
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
        <div className="w-[50%] below-md:w-full flex justify-center items-center h-full  below-md:h-auto">
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
              <InputField
                  type="email"
                  label="Email"
                  value={email}
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
              <div className="flex justify-start">
              <p className=" text-[#3BFCC6] font-normal text-[14px] cursor-pointer" onClick={() => (window.location.href = "/login")} >
              Back to Sign In
              </p>
              </div>

              <button
                type="submit"
                className="bg-[#1AA47D] w-[400px] below-md:w-full text-white py-2 px-4 rounded"
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

export default ForgotPassword;
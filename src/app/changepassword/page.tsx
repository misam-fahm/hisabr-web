"use client";
import { InputField } from "@/Components/UI/Themes/InputField";
import { sendApiRequest } from "@/utils/apiUtils";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

const ChangePassword = () => {
  const methods = useForm();
  const { handleSubmit } = methods;
  const router = useRouter();
  const [currentpassword,setCurrentPassword]=useState("");
  const [newpassword, setNewPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [showCurrentPassword,setshowCurrentPassword]=useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [customToast, setCustomToast] = useState({
        message: "",
        type: "",
  });

  

  const onSubmit = async (data: any) => {
    try {
        setCustomToast({
            ...customToast,
            message: "",
            type: "",
        });
        const response: any = await sendApiRequest({
            mode: "getUserById",        
        });
    
        if (response?.status === 200) {
            const userData = response.data.user[0];
            const val: any = {
                email: "change password",
                password: currentpassword.trim(),
                dbPassword: userData.password
            };
            const result: any = await sendApiRequest(val, `auth/login`);
            if (result?.status === 200 && result?.data?.token) {
                const response: any = await sendApiRequest({
                    mode: "changePassword",
                    password: newpassword.trim()
                });
            
                if (response?.status === 200) {
                    setTimeout(() => {
                        setCustomToast({
                            message: "Password updated.",
                            type: "success",
                        });
                    }, 0);
                } else {
                    setTimeout(() => {
                        setCustomToast({
                            message: "Failed to update password.",
                            type: "error",
                        });
                    }, 0);
                }
                localStorage.removeItem('token');
                localStorage.removeItem('UserType');
                router.replace("/login");
            } else {
            setTimeout(() => {
                setCustomToast({
                    message: "Authentication Failed.",
                    type: "error",
                });
            }, 0);
            }
        } else {
            setCustomToast({
              message: "Failed to fetch data.",
              type: "error",
            });
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        // setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="bg-[#0F1044] flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md bg-transparent p-8">
          <h2 className="text-[24px] text-white font-semibold text-center mb-6">
            Change Your Password
          </h2>
          {/* <p className="text-[14px] text-white text-center mb-6">
            Enter a new password for your account.
          </p> */}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7 flex flex-col items-center">
          <div className="w-[370px]">
              <InputField
                type={showCurrentPassword ? "text" : "password"}
                value={currentpassword}
                label="Current Password"
                maxLength={20}
                className="bg-gray-100 focus:bg-gray-100"
                style={{
                  backgroundColor: "#f3f4f6",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "white",
                }}
                {...methods.register("currentpassword", {
                  required: "current Password is required",
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
                      "Password must contain uppercase, lowercase, number, and special character",
                  },
                  validate: (value) =>
                    value !== newpassword ||
                    "Current password and New password cannot be the same",
                  onChange: (e) => setCurrentPassword(e.target.value),
                })}
                rightIcon={
                  <img
                    src="/images/fieldeyeicon.svg"
                    onClick={() => setshowCurrentPassword((prev) => !prev)}
                    className="cursor-pointer"
                    alt="Toggle visibility"
                  />
                }
                errors={methods.formState.errors.currentpassword}
                placeholder="New Password"
                variant="outline"
              />
            </div>
            <div className="w-[370px]">
              <InputField
                type={showNewPassword ? "text" : "password"}
                value={newpassword}
                label="New Password"
                maxLength={20}
                className="bg-gray-100 focus:bg-gray-100"
                style={{
                  backgroundColor: "#f3f4f6",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "white",
                }}
                {...methods.register("newpassword", {
                  required: "New Password is required",
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
                      "Password must contain uppercase, lowercase, number, and special character",
                  },
                  onChange: (e) => setNewPassword(e.target.value),
                })}
                rightIcon={
                  <img
                    src="/images/fieldeyeicon.svg"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="cursor-pointer"
                    alt="Toggle visibility"
                  />
                }
                errors={methods.formState.errors.newpassword}
                placeholder="New Password"
                variant="outline"
              />
            </div>

            <div className="w-[370px]">
              <InputField
                type={showConfirmPassword ? "text" : "password"}
                value={confirmpassword}
                label="Confirm Password"
                maxLength={20}
                className="bg-gray-100 focus:bg-gray-100"
                style={{
                  backgroundColor: "#f3f4f6",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "white",
                }}
                {...methods.register("confirmpassword", {
                  required: "Confirm Password is required",
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
                      "Password must contain uppercase, lowercase, number, and special character",
                  },
                  validate: (value) =>
                    value === newpassword ||
                    "Confirm password must match new password",
                  onChange: (e) => setConfirmPassword(e.target.value),
                })}
                rightIcon={
                  <img
                    src="/images/fieldeyeicon.svg"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="cursor-pointer"
                    alt="Toggle visibility"
                  />
                }
                errors={methods.formState.errors.confirmpassword}
                placeholder="Confirm Password"
                variant="outline"
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-[#1AA47D] w-[370px] font-bold text-sm text-white py-2 rounded-md"
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  );
};

export default ChangePassword;
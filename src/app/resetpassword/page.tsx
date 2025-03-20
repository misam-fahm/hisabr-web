"use client";
import { Suspense } from 'react';
import { InputField } from "@/Components/UI/Themes/InputField";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { sendApiRequest } from "@/utils/apiUtils";
import ToastNotification from "@/Components/UI/ToastNotification/ToastNotification";

const ResetPasswordBase = () => {
    const methods = useForm();
    const router = useRouter();
    const searchParams = useSearchParams(); 
    const uuid = searchParams.get('uuid');
    const [isValidUser, setIsValidUser] = useState(false);
    const { handleSubmit, register, formState: { errors } } = methods;
    const [newpassword, setNewPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [customToast, setCustomToast] = useState({
        toastMessage: "",
        toastType: "",
    });

    const verifyUser = async () => {
        const response: any = await sendApiRequest({
          mode: "verifyUser",
          uuid: uuid,
        });
    
        if (response?.status === 200 && response?.data?.result?.userid) {
          setIsValidUser(true);
        } else {
            setTimeout(() => {
                setCustomToast({
                    toastMessage: "Invalid URL",
                    toastType: "error",
                });
            }, 0);
            router.replace("/login");
        }
    };
    
    const verifyToken = async (token: string) => {
        const res: any = await sendApiRequest({
        token: token
        }, `auth/verifyToken`);
        res?.status === 200 && router.replace('/login');
    };
    
    useEffect(() => {
        window.history.replaceState({ ...window.history.state, as: '/resetpassword', url: '/resetpassword' }, '', '/resetpassword');
        const token = localStorage.getItem('token');
        if (token) {
            verifyToken(token);
        } else {
            if (uuid) {
                verifyUser();
            } else {
                setTimeout(() => {
                    setCustomToast({
                        toastMessage: "Invalid URL",
                        toastType: "error",
                    });
                }, 0);
                router.replace("/login");
            }
        }
    }, []);

    const onSubmit = async (data: any) => {
        setCustomToast({
            ...customToast,
            toastMessage: "",
            toastType: "",
          });
        const updatePass: any = await sendApiRequest({
            mode: "resetPassword",
            uuid: uuid,
            password: newpassword.trim()
        });
        if (updatePass?.status === 200) {
            setTimeout(() => {
                setCustomToast({
                    toastMessage: "Password reset",
                    toastType: "success",
                });
            }, 0);
            router.replace("/login");
        } else {
            setTimeout(() => {
                setCustomToast({
                    toastMessage: "Failed to reset",
                    toastType: "error",
                });
            }, 0);
            router.replace("/login");
        }
    };

    return (
        <FormProvider {...methods}>
            <ToastNotification
                message={customToast.toastMessage}
                type={customToast.toastType}
            />
            {isValidUser && <div className="bg-[#0F1044] flex items-center justify-center min-h-screen px-4">
            <div className="w-full max-w-md bg-transparent p-8 rounded-lg shadow-lg">
                <h2 className="text-[24px] text-white font-semibold text-center mb-2">
                    Reset Your Password
                </h2>
                <p className="text-[14px] text-white text-center mb-6">
                    Enter a new password for your account.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex flex-col items-center">
                    <div className="w-[320px]">
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

                    <div className="w-[320px]">
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
                        className="bg-[#1AA47D] w-[320px] font-bold text-sm text-white py-2 rounded-md hover:bg-[#17956f] transition-all"
                    >
                        Reset Password
                    </button>
                    </div>
                </form>
            </div>
            </div>}
        </FormProvider>
    );
};
// export default ResetPassword;
export default function ResetPassword() {
    return (
      <Suspense>
        <ResetPasswordBase />
      </Suspense>
    )
  }

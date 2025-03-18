"use client";
import { InputField } from "@/Components/UI/Themes/InputField";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";






const ResetPassword = () => {
    const methods = useForm();
    const { handleSubmit, register, formState: { errors } } = methods;
    const [newpassword, setNewPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    


    const onSubmit = (data: any) => {
        console.log("Form Data:", data);

    };












    return (
        <FormProvider {...methods}>
            <main
                className="relative px-6  below-md:px-3  overflow-auto 
                max-h-[calc(100vh-60px)]" style={{ scrollbarWidth: "thin" }}
            >
                <div className="flex items-center justify-center h-[80vh] ">
                    <div className="w-full max-w-md bg-[#0F1044] p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl text-white font-semibold text-center mb-3">Reset Your Password</h2>
                        <p className="text-[14px] text-white text-center">Enter a new password for your account.   </p>
                        <form onSubmit={methods.handleSubmit(onSubmit)}
                              className="w-full mt-4 flex flex-col gap-8"
                        >
                            <div className="w-[400px]">
                                <InputField
                                    type={showNewPassword ? "text" : "password"}
                                    value={newpassword}
                                    label="New Password"
                                    // borderClassName=" border border-gray-300"
                                    // labelBackgroundColor="bg-white"
                                    className="bg-gray-100 focus:bg-gray-100 autofill:bg-gray-100" // Custom class for autofill
                                    style={{
                                        backgroundColor: "#f3f4f6",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "white",
                                    }}
                                    // textColor="text-[#636363]"
                                    {...methods?.register("newpassword", {
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
                                                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                                        },
                                        onChange: (e) => setNewPassword(e.target.value),
                                    })}
                                    rightIcon={
                                        <img
                                            src="/images/fieldeyeicon.svg"
                                            // src={showNewPassword ? "/images/eye-open.svg" : "/images/eye-close.svg"}
                                            onClick={() => setShowNewPassword((prev: any) => !prev)}
                                            className="cursor-pointer"
                                            alt="Toggle visibility"
                                        />
                                    }
                                    errors={methods.formState.errors.newpassword}
                                    placeholder="New Password"
                                    variant="outline"
                                />
                            </div>
                            <div className="w-[400px]">
                                <InputField
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmpassword}
                                    label="Confirm Password"
                                    // borderClassName=" border border-gray-300"
                                    // labelBackgroundColor="bg-white"
                                    // textColor="text-[#636363]"
                                    className="bg-gray-100 focus:bg-gray-100 autofill:bg-gray-100" // Custom class for autofill
                                    style={{
                                        backgroundColor: "#f3f4f6",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "white",
                                    }}
                                    {...methods?.register("confirmpassword", {
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
                                                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                                        },
                                        validate: (value) =>
                                            value === newpassword || "Confirm password must match new password",
                                        onChange: (e) => setConfirmPassword(e.target.value),
                                    })}
                                    rightIcon={
                                        <img
                                            src="/images/fieldeyeicon.svg"
                                            // src={showConfirmPassword ? "/images/eye-open.svg" : "/images/eye-close.svg"}
                                            onClick={() => setShowConfirmPassword((prev: any) => !prev)}
                                            className="cursor-pointer"
                                            alt="Toggle visibility"
                                        />
                                    }
                                    errors={methods.formState.errors.confirmpassword}
                                    placeholder="Confirm Password"
                                    variant="outline"
                                />
                            </div>
                            <div className="flex items-center justify-center">
                                <button
                                    type="submit"
                                    className="bg-[#1AA47D] w-[40%]  below-md:w-full font-bold text-[14px] text-white py-2 px-4 rounded "
                                >
                                    Reset Password
                                </button>
                            </div>



                        </form>

                    </div>

                </div>

            </main>
        </FormProvider>
    );
};
export default ResetPassword;

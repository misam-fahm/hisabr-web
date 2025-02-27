"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { InputField } from '@/Components/UI/Themes/InputField';
import { sendApiRequest } from '@/utils/apiUtils';
import ToastNotification, { ToastNotificationProps } from '@/Components/UI/ToastNotification/ToastNotification';

const ProfileShow = () => {
    const router = useRouter();
    const methods = useForm();
    const { register, handleSubmit, setValue, formState: { errors } } = methods;
    const [userData, setData] = useState<any>([]);
    const [errorVerification, setErrorVerification] = useState();
    const [loading, setLoading] = useState<boolean>(true);
    const [isEditing, setIsEditing] = useState(false);
    const [customToast, setCustomToast] = useState<ToastNotificationProps>({
        message: "",
        type: "",
      });
      const [formData, setFormData] = useState({
        FirstName: "",
        email: "",
        LastName: "",
        phoneNumber: "",
      });

      
  const fetchData = async () => {
    setLoading(true);
    try {
      const response: any = await sendApiRequest({
        mode: "getUserById",
        
      });
  
      if (response?.status === 200) {
        const userData = response.data.user[0];
        setData(userData);
        setFormData({
          FirstName: userData.firstname || "",
          email: userData.email || "",
          LastName: userData.lastname || "",
          phoneNumber: userData.phoneno || "",
        });
        methods.setValue("FirstName", userData.firstname || "");
        methods.setValue("email", userData.email || "");
        methods.setValue("LastName", userData.lastname || "");
        methods.setValue("phoneNumber", userData.phoneno || "");
        
      } else {
        setCustomToast({
          message: response?.message || "Failed to fetch sales.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
   
  useEffect(() => {
    fetchData();
  }, []);

  const handleChangeEmailVerify = async (email: string): Promise<boolean> => {

    const originalEmail = userData?.email;
    // If the email hasn't changed, skip verification
    if (!email || email === originalEmail) return false;

    try {
        const response: any = await sendApiRequest({ mode: "checkEmailExist", email });

        console.log("Email verification response:", response); // Debugging

        if (response?.status === 400) {
            setErrorVerification(response?.error); // Set the error message
            return true; // Email exists
        }

        return false; // Email does not exist
    } catch (error) {
        console.error("Error verifying email:", error);
        return false; // Assume email does not exist in case of an error
    }
};


  const onSubmit = async (data: any) => {

    console.log("phone",data)
    const originalEmail = userData?.email;
    const jsonData: any = {
        mode: "updateUserById",
        firstname: data?.FirstName,
        lastname: data?.LastName,
        email: data?.email,
        phoneno: data?.phoneNumber,
    };

    if (data.email !== originalEmail) {
        const emailExists: boolean = await handleChangeEmailVerify(data.email);
        console.log("Email Exists Check:", emailExists); // Debugging

        if (emailExists) {
            setCustomToast({
                message: "Email already exists. Please use a different email.",
                type: "error",
            });
            return; // Stop further execution
        }
    }

    try {
        const result: any = await sendApiRequest(jsonData);
        const { status } = result;

        setTimeout(() => {
            setCustomToast({
                message: status === 200 ? "Profile Updated successfully!" : "Failed to update profile.",
                type: status === 200 ? "success" : "error",
            });
        }, 0);
        
    } catch (error: any) {
        setTimeout(() => {
            setCustomToast({
                message: error?.message || "An error occurred while updating the profile.",
                type: "error",
            });
        }, 0);
    }
};

    const handleEdit = () => setIsEditing(true);
    const handleCancel = () => setIsEditing(false);



    return (
        <main className='w-full below-md:mt-4 px-6'>
            <ToastNotification
        message={customToast.message}
        type={customToast.type}
      />
            <div>
                <img
                    onClick={() => router.push("/")}
                    alt="Back Arrow"
                    className="w-7 h-7 my-4 below-md:hidden cursor-pointer"
                    src="/images/webbackicon.svg"
                />
            </div>
            <div className='w-full max-h-[calc(100vh-10px)] overflow-auto below-md:h-auto border rounded-md shadow bg-white px-8 below-md:px-0 py-8'>
                <div className='flex justify-end below-md:justify-center below-md:flex-col below-md:items-center items-center'>
                    {/* <div className='flex items-center gap-4 below-md:gap-2 below-md:flex-col below-md:items-center'>
                        <img className="w-[72px] h-[70] rounded-full" src="/images/admin.png" alt="Admin" />
                        <div className='flex flex-col below-md:items-center'>
                            <p className='text-[#4C535F] text-[18px] font-[600px]'>{formData.FirstName}</p>
                            <p className='text-gray-300 text-[12px] font-normal'>{formData.email}</p>
                        </div>
                    </div> */}
                    {!isEditing ? (
                        <button className="px-4 py-2 text-white text-[13px] w-[97px] h-[37px] bg-[#1AA47D] rounded-md hover:bg-green-700 below-md:hidden" onClick={handleEdit}>
                            Edit
                        </button>
                    ) : null}
                </div>
                <div className='mt-9'>
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-2 gap-9 mt-16 below-md:flex below-md:flex-col below-md:justify-center below-md:px-5">
                                {Object.keys(formData).map((field, index) => (
                                    <div key={index} className='w-[350px] below-md:w-full'>
                                        <InputField
                                            type={field === 'email' ? 'email' : 'text'}
                                            label={field.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}

                                            value={formData[field]}
                                            borderClassName={`${ errors[field] || field === "email" && errorVerification ? "border border-red-500 " : isEditing ? "border border-gray-500" : "border border-gray-100"}`}
                                            labelBackgroundColor="bg-white"
                                            textColor="text-gray-500"
                                            {...register(field, {
                                                required: `${field} is required`,
                                                ...(field === "email" && {
                                                  pattern: {
                                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                                    message: "Invalid email format",
                                                  },
                                                }),
                                                ...(field === "phonenumber" && {
                                                  pattern: {
                                                    value: /^[0-9]{10,15}$/,
                                                    message: "Phone number must be 10-15 digits",
                                                  },
                                                  minLength: { value: 10, message: "Phone number must be at least 10 digits" },
                                                  maxLength: { value: 15, message: "Phone number cannot exceed 15 digits" },
                                                }),
                                              })}
                                              errors={errors[field] || (field === "email" && errorVerification ? { message: errorVerification } : null)}
                                            placeholder={`Please enter ${field}`}
                                            isDisabled={!isEditing}
                                            onChange={(e) => {
                                                setFormData({ ...formData, [field]: e.target.value });
                                                if (field === "email") {
                                                    handleChangeEmailVerify(e.target.value);
                                                }
                                            }}
                                            variant="outline"
                                        />
                                    </div>
                                ))}
                            </div>
                            {isEditing && (
                                <div className="mt-6 fixed top-28 right-10 flex space-x-3">
                                     <button type="button" className="px-4 py-2 text-[#6F6F6F] text-[13px] w-[101px] h-[37px] bg-[#E4E4E4] rounded-md hover:bg-[#C9C9C9]" onClick={handleCancel}>Cancel</button>
                                    <button type="submit" className="px-4 py-2 text-white text-[13px] w-[101px] h-[37px] bg-[#1AA47D] rounded-md hover:bg-[#11735C]">Save</button>
                                   
                                </div>
                            )}
                        </form>
                    </FormProvider>
                </div>
            </div>
        </main>
    );
};

export default ProfileShow;

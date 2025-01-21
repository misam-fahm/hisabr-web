"use client";
import React from 'react'
import { Text } from '@/Components/UI/Themes/Text';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { InputField } from '@/Components/UI/Themes/InputField';


const ProfileShow = () => {

    const router = useRouter();
    const methods = useForm();
    const onSubmit = (data: any) => {
        console.log("Form Data:", data);
    };

    const { watch, register, formState } = methods;
    const { errors } = formState;

    return (

        <main className='below-md:mt-[100px] px-4'>
            <div className='py-4 flex justify-end below-md:hidden '>
                <button className='bg-[#C8C8C87A] w-[104px] h-[37px] text-[#6F6F6F] border rounded-md ' onClick={() => router.push("/")}>Back
                </button>
            </div>

            <div className='w-full max-h-[calc(100vh-10px)] overflow-auto  below-md:h-auto border rounded-md shadow bg-white px-8 below-md:px-0 py-5 '>

                <div className='flex  below-md:justify-center items-center gap-4'>
                    <img
                        className="w-[72px] h-[70] mr-4 rounded-full"
                        src="/images/admin.png"
                        alt="Admin"
                    />
                    <Text className='text-[#4C535F] text-[18px] font-[600px]'> Saheel</Text>
                </div>

                <div className='mt-4 px-6'>
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(onSubmit)}>


                            <div className="grid grid-cols-2 gap-8 mb-4 below-md:flex below-md:flex-col below-md:justify-center">
                                <div className='w-[350px]'>  
                                    <InputField
                                        type="text"
                                        label="Full Name"
                                        value={"Saheel"}
                                        borderClassName="border border-gray-400"
                                        labelBackgroundColor="bg-white"
                                        textColor="text-gray-500"
                                        {...register("full name", {
                                            required: "Name is required",
                                        })}
                                        errors={errors.fullname}
                                        placeholder="Please enter full name"
                                        variant="outline"
                                    />
                                </div>
                                <div className='w-[350px]'>
                                    <InputField
                                        type="email"
                                        label="Email"
                                        value={"saheel@gmail.com"}
                                        borderClassName="border border-gray-400"
                                        labelBackgroundColor="bg-white"
                                        textColor="text-gray-500"
                                        {...register("email", {
                                            required: "Email is required",
                                        })}
                                        errors={errors.email}
                                        placeholder="Please enter Email"
                                        variant="outline"
                                    />                       
                                </div>
                                <div className='w-[350px]'>
                                    {/* <label className="text-[13px] text-[#5E6366] mb-2 block">Username</label>
                                    <input
                                        type="text"
                                        value={"SAheelAdmin"}
                                        disabled={true}
                                        className=" h-[40px] w-[355px] below-md:w-full pl-2 text-[#8D98AA] text-[12px] rounded-lg "
                                        placeholder="Please enter User Name"
                                    /> */}
                                    <InputField
                                        type="text"
                                        label="Username"
                                        value={"SAheelAdmin"}
                                        borderClassName="border border-gray-400"
                                        labelBackgroundColor="bg-white"
                                        textColor="text-gray-500"
                                        {...register("username", {
                                            required: "username is required",
                                        })}
                                        errors={errors.username}
                                        placeholder="Please enter Username"
                                        variant="outline"
                                    />   
                                </div>
                                <div className='w-[350px]'>
                                    {/* <label className="text-[13px] text-[#5E6366] mb-2 block">Phone number</label>
                                    <input
                                        type="number"
                                        value={"7453557586"}
                                        disabled={true}
                                        className=" h-[40px] w-[355px] below-md:w-full pl-2 text-[#8D98AA] text-[12px] rounded-lg "
                                        placeholder="Please Phone number"
                                    /> */}
                                    <InputField
                                        type="number"
                                        label="Phone number"
                                        value={"7453557586"}
                                        borderClassName="border border-gray-400"
                                        labelBackgroundColor="bg-white"
                                        textColor="text-gray-500"
                                        {...register("phonenumber", {
                                            required: "phonenumber is required",
                                        })}
                                        errors={errors.phonenumber}
                                        placeholder="Please enter Phone number"
                                        variant="outline"
                                    /> 


                                </div>
                            </div>

                            {/* Submit Button */}

                        </form>
                    </FormProvider>
                    <div className="flex items-center justify-start mt-10 gap-8">

                        <button
                            className="px-4 py-2 text-white text-[14px] w-[165px] h-[37px] bg-[#1AA47D] rounded-md hover:bg-green-700"
                            onClick={() => router.push("/editprofile")}
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>

            </div>

        </main>

    )
}

export default ProfileShow
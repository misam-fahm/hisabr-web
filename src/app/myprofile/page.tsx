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

    const handleBack = () => {
        router.push("/");
      };
    

    return (

        <main className='w-full below-md:mt-4 px-6'>
            <div>
        <img
          onClick={handleBack}
          alt="Back Arrow"
          className="w-7 h-7 my-4 below-md:hidden cursor-pointer"
          src="/images/webbackicon.svg"
        ></img>
      </div>
          
            <div className='w-full max-h-[calc(100vh-10px)] overflow-auto  below-md:h-auto border rounded-md shadow bg-white px-8 below-md:px-0 py-8 '>

                <div className='flex justify-between below-md:justify-center below-md:flex-col below-md:items-center items-center'>
                    <div className='flex items-center gap-4 below-md:gap-2 below-md:flex-col below-md:items-center'>
                        <img
                            className="w-[72px] h-[70] rounded-full"
                            src="/images/admin.png"
                            alt="Admin"
                        />
                        <div className='flex flex-col below-md:items-center'>
                            <p className='text-[#4C535F] text-[18px] font-[600px]'> Saheel</p>
                            <p className=' text-gray-300 text-[12px] font-normal'>Saheel@gmail.com</p>
                        </div>
                    </div>
                    {/* Submit Button */}
                    <button
                        className="px-4 py-2 text-white text-[13px] w-[97px] h-[37px] bg-[#1AA47D] rounded-md hover:bg-green-700 below-md:hidden"
                        onClick={() => router.push("/editprofile")}
                    >
                        Edit
                    </button>


                </div>

                <div className='mt-9'>
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(onSubmit)}>


                            <div className="grid grid-cols-2 gap-9 below-md:gap-6 below-md:flex below-md:flex-col below-md:justify-center below-md:px-5">
                                <div className='w-[350px] below-md:w-full'>
                                    <InputField
                                        type="text"
                                        label="Full Name"
                                        value={"Saheel"}
                                        borderClassName="border border-gray-100"
                                        labelBackgroundColor="bg-white"
                                        textColor="text-gray-500"
                                        {...register("full name", {
                                            required: "Name is required",
                                        })}
                                        errors={errors.fullname}
                                        isDisabled={true}
                                        placeholder="Please enter full name"
                                        variant="outline"
                                    />
                                </div>
                                <div className='w-[350px] below-md:w-full'>
                                    <InputField
                                        type="email"
                                        label="Email"
                                        value={"saheel@gmail.com"}
                                        borderClassName="border border-gray-100"
                                        labelBackgroundColor="bg-white"
                                        textColor="text-gray-500"
                                        {...register("email", {
                                            required: "Email is required",
                                        })}
                                        errors={errors.email}
                                        placeholder="Please enter Email"
                                        isDisabled={true}
                                        variant="outline"
                                    />
                                </div>
                                <div className='w-[350px] below-md:w-full'>
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
                                        borderClassName="border border-gray-100"
                                        labelBackgroundColor="bg-white"
                                        textColor="text-gray-500"
                                        {...register("username", {
                                            required: "username is required",
                                        })}
                                        errors={errors.username}
                                        placeholder="Please enter Username"
                                        isDisabled={true}
                                        variant="outline"
                                    />
                                </div>
                                <div className='w-[350px] below-md:w-full'>
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
                                        borderClassName="border border-gray-100"
                                        labelBackgroundColor="bg-white"
                                        textColor="text-gray-500"
                                        {...register("phonenumber", {
                                            required: "phonenumber is required",
                                        })}
                                        errors={errors.phonenumber}
                                        placeholder="Please enter Phone number"
                                        isDisabled={true}
                                        variant="outline"
                                    />
                                </div>
                                <div className="below-lg:hidden">
    <button
      className="bg-[#168A6F] hover:bg-[#11735C] text-[13px] font-medium text-white rounded-md h-[35px] w-[83px]"
      onClick={() => router.push("/editprofile")}
    >
      Edit
    </button>
  </div>
                            </div>



                        </form>
                    </FormProvider>
                   

                </div>

            </div>

        </main>

    )
}

export default ProfileShow
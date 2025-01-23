"use client";
import React, { useState } from 'react'
import { Text } from '@/Components/UI/Themes/Text';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { InputField } from '@/Components/UI/Themes/InputField';

const EditProfile = () => {
  const router = useRouter();
  const methods = useForm();
  const [fullName, setFullName] = useState("Saheel");
  const [email, setEmail] = useState("saheel@gmail.com");
  const [username, setUsername] = useState("SAheelAdmin");
  const [phonenumber, setPhonenumber] = useState("7453557586")

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  const { watch, register, formState } = methods;
  const { errors } = formState;

  const handleBack = () => {
    router.push("/myprofile");
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
     

      <div className='w-full max-h-[calc(100vh-10px)] overflow-auto  below-md:h-auto border rounded-md shadow bg-white px-8 below-md:px-0 py-8 below-md:py-5'>
      <div className='flex justify-between below-md:justify-center below-md:flex-col below-md:items-centeritems-center'>
                    <div className='flex items-center gap-4 below-md:gap-2 below-md:flex-col below-md:items-center'>
                        <img
                            className="w-[72px] h-[70]  rounded-full"
                            src="/images/admin.png"
                            alt="Admin"
                        />
                        <div className='flex flex-col below-md:items-center'>
                            <text className='text-[#4C535F] text-[18px] font-[600px]'> Saheel</text>
                            <text className=' text-gray-300 text-[12px] font-normal'>Saheel@gmail.com</text>
                        </div>
                    </div>
                    <div className='space-x-3 below-md:hidden'>
                    <button
                        className="px-4 py-2 text-[#6F6F6F] text-[13px] w-[101px] h-[37px] bg-[#E4E4E4] rounded-md hover:bg-[#C9C9C9]"
                        onClick={() => router.push("/editprofile")}
                    >
                        Cancel
                    </button>

                    {/* Submit Button */}
                    <button
                        className="px-4 py-2 text-white text-[13px] w-[101px] h-[37px] bg-[#1AA47D] rounded-md hover:bg-[#11735C]"
                        onClick={() => router.push("/editprofile")}
                    >
                        Save
                    </button>
                    </div>


                </div>

        <div className='mt-9'>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>

              {/* Expense Type and Description */}
              <div className="grid grid-cols-2 gap-9 below-md:flex below-md:flex-col  below-md:justify-center below-md:px-5">
                <div className='w-[350px] below-md:w-full'>

                  <InputField
                    type="text"
                    label="Full Name"
                    value={fullName}
                    borderClassName="border border-gray-400"
                    labelBackgroundColor="bg-white"
                    textColor="text-gray-500"
                    {...register("full name", {
                      required: "Name is required",
                      onChange: (e) => setFullName(e.target.value),
                    })}
                    errors={errors.fullname}
                    placeholder="Please enter full name"
                    variant="outline"
                  />
                </div>
                <div className='w-[350px] below-md:w-full'>
                  <InputField
                    type="email"
                    label="Email"
                    value={email}
                    borderClassName="border border-gray-400"
                    labelBackgroundColor="bg-white"
                    textColor="text-gray-500"
                    {...register("email", {
                      required: "Email is required",
                      onChange: (e) => setEmail(e.target.value),
                    })}
                    errors={errors.email}
                    placeholder="Please enter Email"
                    variant="outline"
                  />
                </div>
                <div className='w-[350px] below-md:w-full'>
                  <InputField
                    type="text"
                    label="Username"
                    value={username}
                    borderClassName="border border-gray-400"
                    labelBackgroundColor="bg-white"
                    textColor="text-gray-500"
                    {...register("username", {
                      required: "Username is required",
                      onChange: (e) => setUsername(e.target.value),
                    })}
                    errors={errors.username}
                    placeholder="Please enter Email"
                    variant="outline"
                  />
                </div>
                <div className='w-[350px] below-md:w-full'>
                  <InputField
                    type="phone"
                    label="Phonenumber"
                    value={phonenumber}
                    borderClassName="border border-gray-400"
                    labelBackgroundColor="bg-white"
                    textColor="text-gray-500"
                    {...register("phonenumber", {
                      required: "phonenumber is required",
                      onChange: (e) => setPhonenumber(e.target.value),
                    })}
                    errors={errors.phonenumber}
                    placeholder="Please enter Phonenumber"
                    variant="outline"
                  />
                </div>
                <div className="below-lg:hidden space-x-3 ">
                <button
                        className="px-4 py-2 text-white text-[13px] w-[101px] h-[37px] bg-[#1AA47D] rounded-md hover:bg-[#11735C]"
                        onClick={() => router.push("/editprofile")}
                    >
                        Save
                    </button>
                    <button
                        className="px-4 py-2 text-[#6F6F6F] text-[13px] w-[101px] h-[37px] bg-[#E4E4E4] rounded-md hover:bg-[#C9C9C9]"
                        onClick={() => router.push("/editprofile")}
                    >
                        Cancel
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

export default EditProfile
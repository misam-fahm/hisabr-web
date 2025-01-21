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

  return (

    <main className='w-full below-md:mt-[100px] px-4'>
      <div className='py-4 flex justify-end below-md:hidden '>
        <button className='bg-[#C8C8C87A] w-[104px] h-[37px] text-[#6F6F6F] border rounded-md ' onClick={() => router.back()}>Back
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

              {/* Expense Type and Description */}
              <div className="grid grid-cols-2 gap-8 mb-4 below-md:flex below-md:flex-col  below-md:justify-center">
                <div className='w-[350px]'>

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
                <div className='w-[350px]'>
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
                <div className='w-[350px]'>
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
                <div className='w-[350px]'>
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
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-start mt-10 gap-8">

                <button
                  type="submit"
                  className="px-4 py-2 text-white text-[14px] w-[165px] below-md:w-full h-[37px] bg-[#1AA47D] rounded-md hover:bg-green-700"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </FormProvider>
        </div>

      </div>

    </main>

  )
}

export default EditProfile
"use client";
import React from 'react'
import { Text } from '../UI/Themes/Text'
import { useRouter } from 'next/navigation';

const EditProfile = () => {
    const router = useRouter() ;

  return (
   
    <main className= 'w-full below-md:mt-[100px]'>
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
        <form>
                           
                                {/* Expense Type and Description */}
                                <div className="grid grid-cols-2 gap-6 mb-4 below-md:flex below-md:flex-col  below-md:justify-center">
                                <div>
                                        <label className="text-[13px] text-[#5E6366] mb-2 block">Full Name</label>
                                        <input
                                            type="text"
                                           
                                            defaultValue={"Saheel"}
                                            className="border border-gray-400 h-[40px] pl-2 w-[355px] below-md:w-full text-[#8D98AA] text-[12px] rounded-lg "
                                            placeholder="Please enter Full Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[13px] text-[#5E6366] mb-2 block">Email</label>
                                        <input
                                            type="email"
                                            defaultValue={"saheel@gmail.com"}
                                            className="border border-gray-400 h-[40px] pl-2 w-[355px] below-md:w-full text-[#8D98AA] text-[12px] rounded-lg "
                                            placeholder="Please enter Email"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[13px] text-[#5E6366] mb-2 block">Username</label>
                                        <input
                                            type="text"
                                            defaultValue={"SAheelAdmin"}
                                            className="border border-gray-400 h-[40px] w-[355px] below-md:w-full pl-2 text-[#8D98AA] text-[12px] rounded-lg "
                                            placeholder="Please enter User Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[13px] text-[#5E6366] mb-2 block">Phone number</label>
                                        <input
                                            type="phone"
                                            defaultValue={"7453557586"}
                                            className=" border border-gray-400 h-[40px] w-[355px] below-md:w-full pl-2 text-[#8D98AA] text-[12px] rounded-lg "
                                            placeholder="Please Phone number"
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
        </div>

      </div>

        </main> 
     
  )
}

export default EditProfile
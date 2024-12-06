"use client";
import React from 'react'
import { Text } from '../ui/Common/Text'
import { useRouter } from 'next/navigation';

const ProfileShow = () => {

    const router = useRouter() ;

  return (
   
    <div className= 'w-full'>
      <div className='py-4 flex justify-end '>
        <button className='bg-[#C8C8C87A] w-[104px] h-[37px] text-[#6F6F6F] border rounded-md '  onClick={() =>  router.push("/")}>Back
            </button>
      </div>
 
      <div className='w-full h-[473px] border rounded-md shadow bg-white px-8 py-5 '>
        <div className='flex  items-center gap-4'>
      <img
          className="w-[72px] h-[70] mr-4 rounded-full"
          src="/images/admin.png"
          alt="Admin"
        />
        <Text className='text-[#4C535F] text-[18px] font-[600px]'> Saheel</Text>
        </div>

        <div className='mt-4'>
        <form>
                           
                                {/* Expense Type and Description */}
                                <div className="grid grid-cols-2 gap-6 mb-4">
                                <div>
                                        <label className="text-[13px] text-[#5E6366] mb-2 block">Full Name</label>
                                        <input
                                            type="text"
                                            value={"Saheel"}
                                            disabled={true}
                                            className=" h-[40px] pl-2 w-[355px] text-[#8D98AA] text-[12px] rounded-lg "
                                            placeholder="Please enter Full Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[13px] text-[#5E6366] mb-2 block">Email</label>
                                        <input
                                            type="email"
                                            value={"saheel@gmail.com"}
                                            disabled={true}
                                            className=" h-[40px] pl-2 w-[355px] text-[#8D98AA] text-[12px] rounded-lg "
                                            placeholder="Please enter Email"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[13px] text-[#5E6366] mb-2 block">Username</label>
                                        <input
                                            type="text"
                                            value={"SAheelAdmin"}
                                            disabled={true}
                                            className=" h-[40px] w-[355px] pl-2 text-[#8D98AA] text-[12px] rounded-lg "
                                            placeholder="Please enter User Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[13px] text-[#5E6366] mb-2 block">Phone number</label>
                                        <input
                                            type="number"
                                            value={"7453557586"}
                                            disabled={true}
                                            className=" h-[40px] w-[355px] pl-2 text-[#8D98AA] text-[12px] rounded-lg "
                                            placeholder="Please Phone number"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                               
                            </form>
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

        </div> 
     
  )
}

export default ProfileShow
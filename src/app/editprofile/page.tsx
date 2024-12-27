import EditProfile from '@/Components/Profile/EditProfile'
import ProfileShow from '@/Components/Profile/Profileshow'
import React from 'react'

const page = () => {
  return (
    <main className='w-full ' >
    <div className='flex justify-center px-6'>
            <EditProfile/>
    </div>
    </main>
  )
}

export default page
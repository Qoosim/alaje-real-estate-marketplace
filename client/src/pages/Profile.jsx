import React from 'react'
import { useSelector } from 'react-redux'

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user)

  return (
    <section className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <img src={currentUser.avatar} alt="profile" className='rounded-full size-24 object-cover cursor-pointer self-center mt-2' />
        <input type='text' placeholder='Username' className='border p-3 rounded-lg' id='username' />
        <input type='email' placeholder='Email' className='border p-3 rounded-lg' id='email' />
        <input type='password' placeholder='Password' className='border p-3 rounded-lg' id='password' />
        <button className='bg-slate-700 p-3 uppercase rounded-lg text-white hover:opacity-95 disabled:opacity-80'>update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
    </section>
  )
}

export default Profile
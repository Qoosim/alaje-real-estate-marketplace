import React from 'react'
import { Link } from 'react-router-dom'

const Signup = () => {
  return (
    <section className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-4'>Sign Up</h1>
      <form className='flex flex-col gap-4'>
        <input type="text" placeholder='Username' id='username' className='border p-3 rounded-lg focus:outline-none ' />
        <input type="email" placeholder='Email' id='username' className='border p-3 rounded-lg focus:outline-none' />
        <input type="password" placeholder='Password' id='username' className='border p-3 rounded-lg focus:outline-none' />
        <button className='bg-slate-700 uppercase text-white rounded-lg p-3 hover:opacity-95 disabled:opacity-80'>sign up</button>
      </form>
      <div className='flex gap-2 mt-4'>
        <p>Have an account?</p>
        <Link to="/login">
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
    </section>
  )
}

export default Signup
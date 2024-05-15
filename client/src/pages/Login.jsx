import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { loginStart, loginSuccess, loginFailure } from '../redux/user/userSlice'
import OAuth from '../components/OAuth'

const Login = () => {
  const [formData, setFormData] = useState({})
  // const [error, setError] = useState(null)
  // const [isLoading, setIsLoading] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { error, isLoading } = useSelector((state) => state.user)

  const handleFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(loginStart())
      const response = await fetch("/api/auth/login", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      const json = await response.json()
      if (!response.ok) {
        dispatch(loginFailure(json.error))
      }
      if (response.ok) {
        dispatch(loginSuccess(json))
        navigate('/')
      }
    } catch (error) {
      dispatch(loginFailure(error.message))
    }
  }

  return (
    <section className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-4'>Login</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type="email" placeholder='Email' id='email' className='border p-3 rounded-lg focus:outline-none' onChange={handleFormData} />
        <input type="password" placeholder='Password' id='password' className='border p-3 rounded-lg focus:outline-none' onChange={handleFormData} />
        <button disabled={isLoading} className='bg-slate-700 uppercase text-white rounded-lg p-3 hover:opacity-95 disabled:opacity-80'>{isLoading ? 'Loading...' : 'sign in'}</button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-4'>
        <p>Don&apos;t have an account?</p>
        <Link to="/signup">
          <span className='text-blue-700'>Sign Up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5 text-center'>{error}</p>}
    </section>
  )
}

export default Login

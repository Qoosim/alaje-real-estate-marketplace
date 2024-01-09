import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup }  from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginSuccess } from '../redux/user/userSlice'

const OAuth = () => {

  const dispatch =  useDispatch()
  const navigate = useNavigate()
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider() 
      const auth = getAuth(app)
      const result = await signInWithPopup(auth, provider)
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: result.user.displayName,  email: result.user.email, photo: result.user.photoURL })
      })
      const json = await response.json()
      dispatch(loginSuccess(json))
      navigate('/')
    } catch (error) {
      console.log("Could not sign in with google account", error);
    }
  }

  return (
    <button
      type='button'
      className='bg-red-700 text-white uppercase p-3 rounded-lg hover:opacity-95'
      onClick={handleGoogleClick}
    >
      continue with google
    </button>
  )
}

export default OAuth
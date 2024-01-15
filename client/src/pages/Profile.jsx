import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { app } from '../firebase'
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  logoutUserStart,
  logoutUserSuccess,
  logoutUserFailure
} from '../redux/user/userSlice'

const Profile = () => {
  const { currentUser, error, isLoading } = useSelector((state) => state.user)
  const fileRef = useRef(null)
  const dispatch = useDispatch()
  const [file, setFile] = useState(undefined)
  const [filePercentage, setFilePercentage] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(null)
  const [formData, setFormData] = useState({})
  const [successMsg, setSuccessMsg] = useState(false)

  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')
  useEffect(() => {
    if (file) {
      handleUpload(file)
    }
  }, [file])

  const handleUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setFilePercentage(Math.round(progress))
      },
      (error) => {
        setFileUploadError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then
        ((downloadUrl) => {
          setFormData({ ...formData, avatar: downloadUrl })
        })
      },
    )
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(updateUserStart()) 
      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      const json = await response.json()
      if (!response.ok) {
        dispatch(updateUserFailure(json.error))
        return
      }
      if (response.ok) {
        dispatch(updateUserSuccess(json))
        setSuccessMsg(true)
      }
    } catch (error) {
      dispatch(updateUserFailure(error.message)) 
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMsg(false)
    }, 5000)
    return () => clearTimeout(timer)
  }, [successMsg])

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart()) 
      const response = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE'
      })
      const json = await response.json()
      if (!response.ok) {
        dispatch(deleteUserFailure(json.error))
      }
      dispatch(deleteUserSuccess(json))
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleUserLogout = async () => {
    try {
      dispatch(logoutUserStart())
      const response = await fetch('/api/auth/logout')
      const json = await response.json()
      if (!response.ok) {
        dispatch(logoutUserFailure(json.error))
      }
      if (response.ok) {
        dispatch(logoutUserSuccess(json))
      }
      
    } catch (error) {
      dispatch(logoutUserFailure(error.message))
    }
  }

  return (
    <section className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <input
        type="file"
        ref={fileRef}
        hidden
        accept='image/*'
        onChange={(e) => setFile(e.target.files[0])}
      />
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <img
          onClick={() => fileRef.current.click()}
          src={formData?.avatar || currentUser.avatar}
          alt='profile'
          className='rounded-full size-24 object-cover cursor-pointer self-center mt-2'
        />
        <p className='text-sm self-center'>
          { fileUploadError ? (
              <span className='text-red-700'>Image upload error(image must be less than 2mb)</span>
            ) : filePercentage > 0 && filePercentage < 100 ? (
              <span className='text-slate-700'>{`Uploading ${filePercentage}%`}</span>
            ) : filePercentage === 100 ? (
              <span className='text-green-700'>Image successfully uploaded</span>
            ) : ""
          }
        </p>
        <input
          type='text'
          placeholder='Username'
          defaultValue={currentUser.username}
          className='border p-3 rounded-lg'
          id='username'
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='Email'
          defaultValue={currentUser.email}
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='Password' 
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange}
        />
        <button
          disabled={isLoading}
          className='bg-slate-700 p-3 uppercase rounded-lg text-white hover:opacity-95 disabled:opacity-80'
        >
          {isLoading ? `Loading...` : `update`}
        </button>
        <Link
          to='/create-listing'
          className='bg-green-700 p-3 rounded-lg text-white text-center uppercase hover:opacity-95'
        >
          Create Listing
        </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span
          className='text-red-700 cursor-pointer'
          onClick={handleDeleteUser}
        >
          Delete account
        </span>
        <span
          className='text-red-700 cursor-pointer'
          onClick={handleUserLogout}
        >
          Sign out
        </span>
      </div>
      { error && <p className='text-red-700 mt-5 text-center italic'>{error}</p>}
      { successMsg && <p className='text-green-700 mt-5 text-center italic'>User details updated successfully</p> }
    </section>
  )
}

export default Profile
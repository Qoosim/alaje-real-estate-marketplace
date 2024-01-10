import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { app } from '../firebase'

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user)
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [filePercentage, setFilePercentage] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(null)
  const [formData, setFormData] = useState({})
  console.log(formData);
  console.log(filePercentage);
  console.log(fileUploadError);

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
      <form className='flex flex-col gap-4'>
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
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
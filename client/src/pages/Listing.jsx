import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import React, { useState } from 'react'
import { app } from '../firebase'

const Listing = () => {
  const [ files, setFiles] = useState([])
  const [imageUploadError, setImageUploadError] = useState(false)
  const [formData, setFormData] = useState({
    imageUrls: []
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
       setImageUploadError(false);
       setIsLoading(true)
      const promises = []
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]))
      }
       Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setIsLoading(false)
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setIsLoading(false)
        });
    } else if (files.length === 0 && files.length + formData.imageUrls.length === 0) {
      setImageUploadError('Please upload at least one image')
    } else {
      setImageUploadError('You can only upload 6 images per listing')
    }
  }

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        reject(new Error('Image size exceeds the maximum limit (2 MB)'));
        return;
      }
      const storage = getStorage(app)
      const fileName = new Date().getTime() + file.name
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      }, (error) => {
        console.log(error.bytesTransferred);
        reject(error)
      }, () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          resolve(downloadUrl)
        })
      })
    })
  }

  const handleDeleteImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index)
    })
  }

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl text-center my-7 font-semibold'>Create a Listing</h1>
      <form className='flex flex-col gap-4 sm:flex-row'>
        <div className="flex flex-col gap-4 flex-1">
          <input type="text" placeholder='Name' id='name' className='border p-3' maxLength={62} minLength={10} required />
          <textarea type="text" placeholder='Description' id='description' className='border p-3' required />
          <input type="text" placeholder='Address' id='address' className='border p-3' required />
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2">
              <input type="checkbox" id='sale' className='w-5' />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id='rent' className='w-5' />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id='parking' className='w-5' />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id='furnished' className='w-5' />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id='offer' className='w-5' />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id='bedrooms'
                className='p-3 border border-gray-300 rounded-lg'
                min="1"
                max="10"
                required
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id='bathrooms'
                className='p-3 border border-gray-300 rounded-lg'
                min="1"
                max="10"
                required
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id='regularPrice'
                className='p-3 border border-gray-300 rounded-lg'
                min="1"
                max="10"
                required
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className='text-sm'>($ /month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id='discountedPrice'
                className='p-3 border border-gray-300 rounded-lg'
                min="1"
                max="10"
                required
              />
              <div className="flex flex-col items-center">
                <p>Discounted price</p>
                <span className='text-sm'>($ / month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <p className='font-semibold'>Images: 
          <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              type="file"
              id='images'
              className='p-3 border border-gray-300 rounded w-full'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              onClick={handleImageSubmit}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              { isLoading ? "uploading..." : "upload" }
            </button>
          </div>
          <p className='text-red-500 text-sm'>{imageUploadError && imageUploadError}</p>
          {formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
            <div key={index} className='flex justify-between items-center'>
              <img src={url} alt="House" className='size-40 rounded-lg object-contain' />
              <button
                type='button'
                className='uppercase text-base text-red-700 p-3 rounded-lg hover:opacity-75 font-normal'
                onClick={() => handleDeleteImage(index)}
              >
                delete
              </button>
            </div>
          ))}
          <button
            className='p-3 mt-5 bg-slate-700 text-white uppercase rounded-lg hover:opacity-95 disabled:opacity-80'
          >
            create listing
          </button>
        </div>
      </form>
    </main>
  )
}

export default Listing
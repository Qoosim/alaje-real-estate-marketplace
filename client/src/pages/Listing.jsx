import React from 'react'

const Listing = () => {
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl text-center my-7 font-semibold'>Create a Listing</h1>
      <form className='flex flex-col gap-4 sm:flex-row'>
        <div className="flex flex-col gap-4 flex-1">
          <input type="text" placeholder='Name' id='name' className='border p-3' maxLength={62} minLength={10} required />
          <textarea type="text" placeholder='Description' id='desciption' className='border p-3' required />
          <input type="text" placeholder='Address' id='address' className='border p-3' required />
          <div className="flex gap-6 flex-wrap">
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
            <input type="file" id='images' className='p-3 border border-gray-300 rounded w-full' accept='image/*' multiple />
            <button className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>upload</button>
          </div>
          <button className='p-3 mt-5 bg-slate-700 text-white uppercase rounded-lg hover:opacity-95 disabled:opacity-80'>create listing</button>
        </div>
      </form>
    </main>
  )
}

export default Listing
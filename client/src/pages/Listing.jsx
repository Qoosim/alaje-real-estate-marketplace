import { useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'

export const Listing = () => {
    SwiperCore.use(Navigation)
    const params = useParams()
    const [listing, setListing] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setIsLoading(true)
                const res = await fetch(`/api/listing/get-listing/${params.listingId}`)
                const data = await res.json()
                if (data.success === false) {
                    setError(true)
                    setIsLoading(false)
                    return
                }
                setListing(data)
                setIsLoading(false)
                setError(false)
            } catch (error) {
                setError(true)
                setIsLoading(false)
            }
        }
        fetchListing()
    }, [params.listingId])

    if (isLoading) {
        return <div className='text-center my-7 text-2xl'>Loading...</div>
    }
    if (error) {
        return <div className='text-center my-7 text-2xl'>Something went wrong.</div>
    }


  return (
    <main>
        {listing && !isLoading && !error && (
           <Swiper navigation>
            {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                    <div className='h-[20rem]' style={{background: `url(${url}) center no-repeat`}}>

                    </div>
                </SwiperSlide>
            ))}
           </Swiper>
        )}
    </main> 
  )
}

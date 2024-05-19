import express from 'express'
import { verifyToken } from '../utils/verifyToken.js'
import { createListing, deleteListing, updatedListing, getListing, getListings } from '../controllers/listingController.js'
const router = express.Router()

router.post('/create', verifyToken, createListing)
router.delete('/delete/:id', verifyToken, deleteListing)
router.post('/update/:id', verifyToken, updatedListing)
router.get('/get-listing/:id', getListing)
router.get('/get-listings', getListings)

export default router

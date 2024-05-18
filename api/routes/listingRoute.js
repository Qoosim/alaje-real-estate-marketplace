import express from 'express'
import { verifyToken } from '../utils/verifyToken.js'
import { createListing, deleteListing, updatedListing } from '../controllers/listingController.js'
const router = express.Router()

router.post('/create', verifyToken, createListing)
router.delete('/delete/:id', verifyToken, deleteListing)
router.post('/update/:id', verifyToken, updatedListing)

export default router

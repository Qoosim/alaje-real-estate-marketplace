import express from 'express'
const router = express.Router()
import { deleteUser, getUserListings, updateUser } from '../controllers/userController.js'
import { verifyToken } from '../utils/verifyToken.js'

router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/listings/:id', verifyToken, getUserListings)

export default router

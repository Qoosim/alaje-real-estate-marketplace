import express from 'express'
const router = express.Router()
import { updateUser, userController } from '../controllers/userController.js'
import { verifyToken } from '../utils/verifyToken.js'

router.get('/test', userController)
router.post('/update/:id', verifyToken, updateUser)

export default router

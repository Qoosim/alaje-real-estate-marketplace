import express from 'express'
const router = express.Router()
import { deleteUser, updateUser, userController } from '../controllers/userController.js'
import { verifyToken } from '../utils/verifyToken.js'

router.get('/test', userController)
router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)

export default router

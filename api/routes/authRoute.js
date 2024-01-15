import express from 'express'
import { google, signup, login, logOut } from '../controllers/authController.js'
const router = express.Router()


router.post('/signup', signup)
router.post('/login', login)
router.post('/google', google)
router.get('/logout', logOut)

export default router

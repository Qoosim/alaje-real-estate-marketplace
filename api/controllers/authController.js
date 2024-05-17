import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import User from '../models/userModel.js'

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' })
}

export const signup = async (req, res) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    return res.status(401).json({ error: "All fields must be filled" })
  }

  if (!validator.isEmail(email)) {
    return res.status(401).json({ error: "Invalid email address" })
  }

  if (!validator.isStrongPassword(password)) {
    return res.status(401).json({ error: "Password not strong enough" })
  }

  const existUser = await User.findOne({ email })
  if (existUser) {
    return res.status(400).json({ error: "Email already in use" })
  }
  try {
    const hashPassword = bcrypt.hashSync(password, 10)
    const newUser = new User({ username, email, password: hashPassword })
    await newUser.save()
    const { password: pass, ...restInfo } = newUser._doc
    res.status(201).json(restInfo)
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: "All fields must be filled" })
  }
  try {
    const validUser = await User.findOne({ email })
    if (!validUser) {
      return res.status(400).json({ error: "Invalid email address" })
    }
    const matchPassword = bcrypt.compare(password, validUser.password)
    if (!matchPassword) {
      return res.status(400).json({ error: "Incorrect password" })
    }
    const token = createToken(validUser._id)
    const { password: pass, ...restInfo } = validUser._doc
    res.cookie('access_token', token, { httpOnly: true }).status(200).json(restInfo)
    // res.status(200).json({ email, token })
  } catch (error) {
    res.status(401).json({ error: error.message })
  }

}

export const google = async (req, res) => {
  // destructure email from google result
  const { email } = req.body
  try {
    const user = await User.findOne({ email })
    // check if the user exist
    if (user) {
      // create token
      const token = createToken(user._id)
      const { password: pass, ...restInfo } = user._doc
      res.cookie("access_token", token, { httpOnly: true }).status(200).json(restInfo)
    } else {
      // user does not exist, create one
      const genPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
      const hashPassword = bcrypt.hashSync(genPassword, 10)
      const newUser = await User({ username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-8), email: req.body.email, password: hashPassword, avatar: req.body.photo })
      await newUser.save()
      const token = createToken(newUser._id)
      const { password: pass, ...restInfo } = newUser._doc
      res.cookie("access_token", token, { httpOnly: true }).status(200).json(restInfo)
    }
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
}

export const logOut = async (req, res) => {
  try {
    res.clearCookie('access_token')
    res.status(200).json({ message: 'User has been logged out'})
  } catch (error) {
    res.status(400).json(error.message)
  }   
}
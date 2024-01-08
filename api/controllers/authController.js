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

  const exist = await User.findOne({ email })
  if (exist) {
    return res.status(400).json({ error: "Email already in use" })
  }
  try {
    const hashPassword = bcrypt.hashSync(password, 10)
    const newUser = new User({ username, email, password: hashPassword })
    newUser.save()
    res.status(201).json(newUser)
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

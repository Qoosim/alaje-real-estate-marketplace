import bcrypt from 'bcrypt'
import User from '../models/userModel.js'
import validator from 'validator'

const signup = async (req, res) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    return res.status(401).json({ error: "All fields must be filled" })
  }

  if (!validator.isEmail(email)) {
    return res.status(401).json({ error: "Invalid email address"})
  }

  if (!validator.isStrongPassword(password)) {
    return res.status(401).json({ error: "Password not strong enough"})
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


export default signup

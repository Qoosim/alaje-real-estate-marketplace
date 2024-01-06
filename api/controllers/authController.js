import User from '../models/userModel.js'

const signup = async (req, res) => {
  const { username, email, password } = req.body
  try {
    await User.signup(username, email, password)
    res.status(201).json({ message: "User created successfully" })
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
}

export default signup

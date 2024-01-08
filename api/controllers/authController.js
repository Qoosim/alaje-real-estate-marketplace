import User from '../models/userModel.js'
import bcrypt from 'bcrypt'

// This for statics method from userModel
// const signup = async (req, res) => {
//   const { username, email, password } = req.body
//   try {
//     await User.signup(username, email, password)
//     res.status(201).json({ message: "User created successfully" })
//   } catch (error) {
//     res.status(401).json({ error: error.message })
//   }
// }

const signup = async (req, res) => {
  const { username, email, password } = req.body

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

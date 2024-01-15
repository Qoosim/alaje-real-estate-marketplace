import bcrypt from 'bcrypt'
import User from '../models/userModel.js'

export const userController = (req, res) => {
  res.json({ message: "Api route is working!"})
}

export const updateUser = async (req, res) => {
  if (req.user._id !== req.params.id) {
    return res.status(401).json({ error: "You can only update your own account" })
  }
  try {
   if (req.body.password) {
    req.body.password = bcrypt.hashSync(req.body.password, 10)
   }
   const updateUser = await User.findByIdAndUpdate(req.params.id, {
    $set: {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      avatar: req.body.avatar
    }
   }, { new: true })
   const { password: pass, ...restInfo } = updateUser._doc
   res.status(200).json(restInfo)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const deleteUser = async (req, res) => {
  if (req.user._id !== req.params.id) {
    return res.status(401).json({ error: 'You can only delete your own account'})
  }

  try {
    await User.findByIdAndDelete(req.params.id)  
    res.clearCookie('access_token')
    res.status(200).json({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

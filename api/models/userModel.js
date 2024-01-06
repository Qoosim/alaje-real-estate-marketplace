import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  }
}, { timestamps: true })

userSchema.statics.signup = async function (username, email, password) {
  const exist = await this.findOne({ email })
  if (exist) {
    throw Error('Email already in use')
  }
  const hashPassword = bcrypt.hashSync(password, 10)
  const user = await this.create({ username, email, password: hashPassword })
  return user
}

const User = mongoose.model('User', userSchema)

export default User

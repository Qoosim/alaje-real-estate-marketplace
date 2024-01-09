import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import userRouter from './routes/userRoute.js'
import authRouter from './routes/authRoute.js'
dotenv.config()

const app = express()
// middleware
app.use(express.json())
app.use((req, res, next) => {
  console.log(req.path, req.method); 
  next()
})
// routes
app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)

const port = process.env.PORT || 4001
mongoose.connect(process.env.MONGO_DB)
.then(() => {
  app.listen(port, console.log(`Connected to db && listening on port ${port}`))
})
.catch((error) => {
  console.log(error);
})

import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import userRouter from './routes/userRoute.js'
dotenv.config()

const app = express()

// routes
app.use('/api/user', userRouter)

const port = process.env.PORT || 4001
mongoose.connect(process.env.MONGO_DB)
.then(() => {
  app.listen(port, console.log(`Connected to db && listening on port ${port}`))
})
.catch((error) => {
  console.log(error);
})

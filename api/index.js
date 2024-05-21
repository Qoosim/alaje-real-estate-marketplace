import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import userRouter from './routes/userRoute.js'
import authRouter from './routes/authRoute.js'
import listingRouter from './routes/listingRoute.js'
import cookieParser from 'cookie-parser'
import path from 'path'
dotenv.config()

const __dirname = path.resolve()

const app = express()
// middleware
app.use(cookieParser())
app.use(express.json())
app.use((req, res, next) => {
  console.log(req.path, req.method); 
  next()
})
// routes
app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/listing', listingRouter)

// This would be '/client/build' if you use `npx create-react` to create your app
app.use(express.static(path.join(__dirname, '/client/dist')))

// For any directory aside the three above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})

const port = process.env.PORT || 4001
mongoose.connect(process.env.MONGO_DB)
.then(() => {
  app.listen(port, console.log(`Connected to db && listening on port ${port}`))
})
.catch((error) => {
  console.log(error);
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error"
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  })
})

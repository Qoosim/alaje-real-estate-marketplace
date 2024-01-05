import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
dotenv.config()

const app = express()

const port = process.env.PORT || 4001

mongoose.connect(process.env.MONGO_DB)
  .then(() => {
    app.listen(port, console.log(`Connected to db && listening on port ${port}`))
  })
  .catch((error) => {
    console.log(error);
  })

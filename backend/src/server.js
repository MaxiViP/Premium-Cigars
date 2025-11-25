import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import shopRoutes from './routes/shop.js'
import './services/passport.js'

const app = express()

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
app.use(express.json())
app.use(cookieParser())

const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://polyakovmaksim058:DKVYQjvZQf2PPuF@cluster0.jmrte.mongodb.net/premium-cigars?retryWrites=true&w=majority'

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected via Atlas!'))
  .catch((err) => console.error('MongoDB connection error:', err))

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/shop', shopRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log('Backend listening on', PORT))

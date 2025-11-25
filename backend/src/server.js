// src/server.js
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'

// Роуты
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import shopRoutes from './routes/shop.js'

// Passport — импортируем сам объект passport (важно!)
import passport from './services/passport.js'

const app = express()

// CORS — разрешаем фронтенду
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  }),
)

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Инициализируем Passport (обязательно!)
app.use(passport.initialize())

// MongoDB подключение
const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://polyakovmaksim058:DKVYQjvZQf2PPuF@cluster0.jmrte.mongodb.net/premium-cigars?retryWrites=true&w=majority'

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected via Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err))

// Роуты
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/shop', shopRoutes)

// 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Запуск
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`)
})

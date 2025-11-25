// backend/src/routes/auth.js
import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { signAccess, signRefresh } from '../services/jwt.js'
import passport from 'passport'

const router = express.Router()

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// =======================
// Регистрация по email + пароль
// =======================
router.post('/register', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email и пароль обязательны' })
  }

  try {
    let user = await User.findOne({ email })

    if (user) {
      // Если аккаунт уже есть, но без пароля (через OAuth) — разрешаем привязать пароль
      if (user.password) {
        return res.status(400).json({ error: 'Этот email уже зарегистрирован' })
      }

      user.password = await bcrypt.hash(password, 10)
      await user.save()
    } else {
      // Создаём нового пользователя
      user = await User.create({
        email,
        password: await bcrypt.hash(password, 10),
      })
    }

    const access = signAccess({ id: user._id })
    const refresh = signRefresh({ id: user._id })

    res.json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        favorites: user.favorites || [],
        cart: user.cart || [],
      },
      tokens: { access, refresh },
    })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// =======================
// Логин по email + пароль
// =======================
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email и пароль обязательны' })
  }

  try {
    const user = await User.findOne({ email })
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Неверный email или пароль' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Неверный email или пароль' })
    }

    const access = signAccess({ id: user._id })
    const refresh = signRefresh({ id: user._id })

    res.json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        favorites: user.favorites || [],
        cart: user.cart || [],
      },
      tokens: { access, refresh },
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// =======================
// Универсальный OAuth callback
// =======================
const oauthSuccessRedirect = (req, res) => {
  if (!req.user) {
    return res.redirect(`${FRONTEND_URL}/auth/failure`)
  }

  const access = signAccess({ id: req.user._id })
  const refresh = signRefresh({ id: req.user._id })

  // Перенаправляем на фронт с токенами в query
  res.redirect(`${FRONTEND_URL}/auth/success?access=${access}&refresh=${refresh}`)
}

// Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/failure' }),
  oauthSuccessRedirect,
)

// Yandex
router.get('/yandex', passport.authenticate('yandex'))
router.get(
  '/yandex/callback',
  passport.authenticate('yandex', { session: false, failureRedirect: '/auth/failure' }),
  oauthSuccessRedirect,
)

// =======================
// Выход (опционально — можно просто чистить токены на фронте)
// =======================
router.post('/logout', (req, res) => {
  res.json({ message: 'Выход выполнен' })
})

export default router

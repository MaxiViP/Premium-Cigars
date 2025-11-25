import express from 'express'
import passport from 'passport'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { signAccess, signRefresh } from '../services/jwt.js'
import { sendVerifyCode, checkVerifyCode } from '../services/phone.js'

const router = express.Router()

// Email/Пароль — регистрация с объединением
router.post('/register', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email и пароль обязательны' })

  try {
    let user = await User.findOne({ email })

    if (user) {
      if (user.password) {
        return res.status(400).json({ error: 'Этот email уже используется для входа по паролю.' })
      }
      // Аккаунт есть, но без пароля → привязываем пароль
      user.password = await bcrypt.hash(password, 10)
      await user.save()
    } else {
      // Совсем новый пользователь
      user = await User.create({
        email,
        password: await bcrypt.hash(password, 10),
      })
    }

    const access = signAccess({ id: user._id })
    const refresh = signRefresh({ id: user._id })
    res.json({ user, tokens: { access, refresh } })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Логин по email/паролю
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Неверный email или пароль' })
  }

  const access = signAccess({ id: user._id })
  const refresh = signRefresh({ id: user._id })
  res.json({ user, tokens: { access, refresh } })
})

// Телефон — без изменений (у тебя отлично)
router.post('/phone/send', async (req, res) => { /* твой код */ })
router.post('/phone/verify', async (req, res) => { /* твой код */ })

// OAuth — ВСЁ ЧЕРЕЗ ОДИН success-редирект
const oauthCallback = (req, res) => {
  if (!req.user) return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/failure`)

  const access = signAccess({ id: req.user._id })
  const refresh = signRefresh({ id: req.user._id })

  res.redirect(
    `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/success?access=${access}&refresh=${refresh}`,
  )
}

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/google/callback', passport.authenticate('google', { session: false }), oauthCallback)

router.get('/yandex', passport.authenticate('yandex'))
router.get('/yandex/callback', passport.authenticate('yandex', { session: false }), oauthCallback)

export default router

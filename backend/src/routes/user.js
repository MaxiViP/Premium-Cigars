// backend/src/routes/user.js
import express from 'express'
import authMiddleware from '../middleware/auth.js' // ← у тебя должен быть такой
import User from '../models/User.js'
import Product from '../models/Product.js' // ← если есть модель товаров

const router = express.Router()

// Получение профиля
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password').lean()

    if (!user) return res.status(404).json({ error: 'Пользователь не найден' })

    res.json({ user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// === ИЗБРАННОЕ ===
router.post('/favorites/:id', authMiddleware, async (req, res) => {
  try {
    const productId = req.params.id

    const user = await User.findById(req.userId)
    if (!user.favorites.includes(productId)) {
      user.favorites.push(productId)
      await user.save()
    }

    res.json({ favorites: user.favorites })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

router.delete('/favorites/:id', authMiddleware, async (req, res) => {
  try {
    const productId = req.params.id
    await User.findByIdAndUpdate(req.userId, { $pull: { favorites: productId } })
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

// === КОРЗИНА ===
router.post('/cart', authMiddleware, async (req, res) => {
  try {
    const { productId, qty = 1 } = req.body

    const user = await User.findById(req.userId)
    const existing = user.cart.find((item) => item.product === productId)

    if (existing) {
      existing.qty += qty
    } else {
      user.cart.push({ product: productId, qty })
    }

    await user.save()
    res.json({ cart: user.cart })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

router.delete('/cart/:id', authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, { $pull: { cart: { product: req.params.id } } })
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

export default router

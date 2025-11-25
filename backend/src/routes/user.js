import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
// import Product from '../models/Product.js'

const router = express.Router()

// 🔹 Middleware для авторизации по JWT
function authMiddleware(req, res, next) {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ error: 'No token provided' })

  const token = header.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Invalid token format' })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = payload.id
    next()
  } catch  {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// 🔹 Получение информации о пользователе
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('favorites').populate('cart.product')
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch  {
    res.status(500).json({ error: 'Server error' })
  }
})

// 🔹 Добавление товара в избранное
router.post('/favorites/:productId', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params
    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })

    if (!user.favorites.includes(productId)) user.favorites.push(productId)
    await user.save()
    res.json({ ok: true })
  } catch  {
    res.status(500).json({ error: 'Server error' })
  }
})

// 🔹 Удаление товара из избранного
router.delete('/favorites/:productId', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params
    await User.findByIdAndUpdate(req.userId, { $pull: { favorites: productId } })
    res.json({ ok: true })
  } catch  {
    res.status(500).json({ error: 'Server error' })
  }
})

// 🔹 Добавление товара в корзину
router.post('/cart', authMiddleware, async (req, res) => {
  try {
    const { productId, qty = 1 } = req.body
    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })

    const existing = user.cart.find((i) => i.product.equals(productId))
    if (existing) existing.qty += qty
    else user.cart.push({ product: productId, qty })

    await user.save()
    res.json({ ok: true })
  } catch  {
    res.status(500).json({ error: 'Server error' })
  }
})

// 🔹 Удаление товара из корзины
router.delete('/cart/:productId', authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, {
      $pull: { cart: { product: req.params.productId } },
    })
    res.json({ ok: true })
  } catch  {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router

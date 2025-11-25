import express from 'express'
import Stripe from 'stripe'
import Product from '../models/Product.js'
import jwt from 'jsonwebtoken'

const router = express.Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' })

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

// 🔹 Создание платежного намерения Stripe
router.post('/create-payment-intent', authMiddleware, async (req, res) => {
  try {
    const { items } = req.body
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Items array is required' })
    }

    let amount = 0
    for (const it of items) {
      const product = await Product.findById(it.productId)
      if (!product) return res.status(404).json({ error: `Product ${it.productId} not found` })
      amount += (product.price || 0) * (it.qty || 1)
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
    })

    res.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router

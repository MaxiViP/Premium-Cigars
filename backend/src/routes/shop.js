import express from 'express';
import stripeLib from 'stripe';
import Product from '../models/Product.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const stripe = stripeLib(process.env.STRIPE_SECRET_KEY || '');

function authMiddleware(req, res, next){
  const header = req.headers.authorization;
  if(!header) return res.status(401).send({ error: 'no token' });
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch (e){ res.status(401).send({ error: 'invalid token' }); }
}

router.post('/create-payment-intent', authMiddleware, async (req, res) => {
  const { items } = req.body;
  let amount = 0;
  for (const it of items) {
    const p = await Product.findById(it.productId);
    amount += (p.price || 0) * it.qty;
  }
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: 'usd'
  });
  res.send({ clientSecret: paymentIntent.client_secret });
});

export default router;

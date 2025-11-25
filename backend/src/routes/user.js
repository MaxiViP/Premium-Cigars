import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Product from '../models/Product.js';

const router = express.Router();

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

router.get('/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).populate('favorites').populate('cart.product');
  res.send(user);
});

router.post('/favorites/:productId', authMiddleware, async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.userId);
  if (!user.favorites.includes(productId)) user.favorites.push(productId);
  await user.save();
  res.send({ ok: true });
});
router.delete('/favorites/:productId', authMiddleware, async (req, res) => {
  const { productId } = req.params;
  await User.findByIdAndUpdate(req.userId, { $pull: { favorites: productId } });
  res.send({ ok: true });
});

router.post('/cart', authMiddleware, async (req, res) => {
  const { productId, qty = 1 } = req.body;
  const user = await User.findById(req.userId);
  const existing = user.cart.find(i => i.product.equals(productId));
  if (existing) existing.qty += qty; else user.cart.push({ product: productId, qty });
  await user.save();
  res.send({ ok: true });
});
router.delete('/cart/:productId', authMiddleware, async (req, res) => {
  await User.findByIdAndUpdate(req.userId, { $pull: { cart: { product: req.params.productId } } });
  res.send({ ok: true });
});

export default router;

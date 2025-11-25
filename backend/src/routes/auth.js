import express from 'express';
import passport from 'passport';
import User from '../models/User.js';
import { sendVerifyCode, checkVerifyCode } from '../services/twilio.js';
import { signAccess, signRefresh } from '../services/jwt.js';

const router = express.Router();

// Phone: send code
router.post('/phone/send', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).send({ error: 'phone required' });
  try {
    await sendVerifyCode(phone);
    res.send({ ok: true });
  } catch (e) { res.status(500).send({ error: e.message }); }
});

// Phone verify
router.post('/phone/verify', async (req, res) => {
  const { phone, code } = req.body;
  if (!phone || !code) return res.status(400).send({ error: 'phone/code required' });
  const ok = await checkVerifyCode(phone, code);
  if (!ok) return res.status(401).send({ error: 'Invalid code' });
  let user = await User.findOne({ phone });
  if (!user) user = await User.create({ phone });
  const access = signAccess({ id: user._id });
  const refresh = signRefresh({ id: user._id });
  res.send({ user, tokens: { access, refresh } });
});

// OAuth Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const access = signAccess({ id: req.user._id });
  const refresh = signRefresh({ id: req.user._id });
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/success?access=${access}&refresh=${refresh}`);
});

// OAuth Yandex
router.get('/yandex', passport.authenticate('yandex'));
router.get('/yandex/callback', passport.authenticate('yandex', { session: false }), (req, res) => {
  const access = signAccess({ id: req.user._id });
  const refresh = signRefresh({ id: req.user._id });
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/success?access=${access}&refresh=${refresh}`);
});

export default router;

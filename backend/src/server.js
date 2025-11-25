import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import shopRoutes from './routes/shop.js';
import './services/passport.js';

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/premium-cigars', {});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/shop', shopRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log('Backend listening', PORT));

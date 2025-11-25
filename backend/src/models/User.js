// backend/models/User.js
import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, sparse: true },
  password: String,
  googleId: String,
  yandexId: String,
  name: String,
  avatar: String,

  favorites: [{ type: String }], // ← String, не ObjectId!
  cart: [
    {
      product: { type: String, required: true }, // ← String!
      qty: { type: Number, default: 1 },
    },
  ],
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('User', UserSchema)

import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, sparse: true },
  password: {
    type: String,
    required: function () {
      // password обязателен только если нет phone и OAuth
      return !this.phone && !this.googleId && !this.yandexId
    },
  },
  phone: { type: String, unique: true, sparse: true },
  googleId: String,
  yandexId: String,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      qty: { type: Number, default: 1 },
    },
  ],
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('User', UserSchema)

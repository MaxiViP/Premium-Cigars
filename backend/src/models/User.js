import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  phone: { type: String, unique: true, sparse: true },
  email: { type: String, unique: true, sparse: true },
  name: String,
  avatar: String,
  googleId: String,
  yandexId: String,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  cart: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, qty: { type: Number, default: 1 } }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);

import mongoose from 'mongoose';
const ProductSchema = new mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  images: [String],
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Product', ProductSchema);

// backend/models/Product.js
import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true }, // ← ОБЯЗАТЕЛЬНО!
  title: String,
  price: Number,
  description: String,
  images: [String],
  createdAt: { type: Date, default: Date.now },
})

ProductSchema.pre('save', async function (next) {
  if (this.isNew && !this.id) {
    const last = await this.constructor.findOne({}, { id: 1 }).sort({ id: -1 })
    this.id = last && last.id ? last.id + 1 : 1
  }
  next()
})

export default mongoose.model('Product', ProductSchema)

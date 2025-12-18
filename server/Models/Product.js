const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // Оставляем твой ID для совместимости
  brand: String,
  name_en: String,
  name_ua: String,
  price: Number,
  category: String,
  gender: String,
  img: String,
  sizes: [String],
  desc_en: String,
  desc_ua: String
});

module.exports = mongoose.model('Product', ProductSchema);
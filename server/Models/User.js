const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Здесь будет хэш, а не "123"
  cart: [
    {
      productId: Number,
      selectedSize: String,
      quantity: { type: Number, default: 1 }
    }
  ],
  wishlist: [Number], // Храним ID товаров
  orders: [
    {
      date: { type: Date, default: Date.now },
      total: Number,
      items: Array
    }
  ]
});

module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  userId: { type: String, default: uuidv4, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  profileImage: { type: String, default: '' },
  addresses: [{
    addressId: { type: String, default: uuidv4 },
    addressType: { type: String, enum: ['home', 'work', 'other'], default: 'home' },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zipCode: { type: String },
    isDefault: { type: Boolean, default: false }
  }],
  cart: [{
    productId: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    addedAt: { type: Date, default: Date.now }
  }],
  wishlist: [{
    productId: { type: String, required: true },
    addedAt: { type: Date, default: Date.now }
  }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 
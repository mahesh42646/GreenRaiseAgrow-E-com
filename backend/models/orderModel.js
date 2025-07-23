const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // allow guest checkout
  },
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  shippingAddress: String,
  city: String,
  state: String,
  zipCode: String,
  country: String,
  orderNotes: String,
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  subtotal: Number,
  shippingCost: Number,
  total: Number,
  paymentStatus: { type: String, default: 'pending' },
  paymentDetails: Object,
  status: { type: String, enum: ['placed', 'pending', 'out for delivery', 'cancelled', 'complete'], default: 'placed' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryPartner', default: null },
  deliveryStatus: { type: String, enum: ['pending', 'out for delivery', 'delivered', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema); 
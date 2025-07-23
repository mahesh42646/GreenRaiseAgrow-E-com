const express = require('express');
const router = express.Router();
const DeliveryPartner = require('../models/deliveryPartnerModel');
const Order = require('../models/orderModel');
const bcrypt = require('bcrypt');

// Register a new delivery partner (admin)
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existing = await DeliveryPartner.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const partner = new DeliveryPartner({ name, email, phone, password: hashed });
    await partner.save();
    res.status(201).json({ message: 'Partner registered', partner });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login (partner)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const partner = await DeliveryPartner.findOne({ email });
    if (!partner) return res.status(404).json({ message: 'Not found' });
    const valid = await bcrypt.compare(password, partner.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    res.status(200).json({ id: partner._id, name: partner.name, email: partner.email, phone: partner.phone, status: partner.status });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// List all partners (admin)
router.get('/', async (req, res) => {
  try {
    const partners = await DeliveryPartner.find();
    res.status(200).json(partners);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Assign/unassign order to partner (admin)
router.patch('/assign-order', async (req, res) => {
  try {
    const { orderId, partnerId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.assignedTo = partnerId || null;
    order.deliveryStatus = partnerId ? 'out for delivery' : 'pending';
    await order.save();
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get orders assigned to a partner (partner dashboard)
router.get('/:partnerId/orders', async (req, res) => {
  try {
    const orders = await Order.find({ assignedTo: req.params.partnerId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Partner updates delivery status
router.patch('/order/:orderId/delivery-status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.deliveryStatus = status;
    if (status === 'delivered') order.status = 'complete';
    if (status === 'failed') order.status = 'cancelled';
    await order.save();
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router; 
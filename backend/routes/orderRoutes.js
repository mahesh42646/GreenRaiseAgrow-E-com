const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');
const User = require('../models/userModel');

module.exports = function(io) {
  // Create a new order
  router.post('/', async (req, res) => {
    try {
      const order = new Order(req.body);
      await order.save();
      // Link order to user if userId is present
      if (req.body.userId) {
        const user = await User.findOne({ userId: req.body.userId });
        if (user) {
          user.orders.push(order._id);
          await user.save();
        }
      }
      res.status(201).json({ message: 'Order placed successfully', order });
      io.emit('order:created', { orderId: order._id });
    } catch (error) {
      console.error('Error placing order:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // List all orders (for admin/testing)
  router.get('/', async (req, res) => {
    try {
      const orders = await Order.find().sort({ createdAt: -1 });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Get orders for a specific user (by userId or email)
  router.get('/user/:userId', async (req, res) => {
    try {
      const user = await User.findOne({ userId: req.params.userId });
      if (!user) return res.status(404).json({ message: 'User not found' });
      // Find orders by user ObjectId or by customerEmail
      const orders = await Order.find({
        $or: [
          { user: user._id },
          { customerEmail: user.email }
        ]
      }).sort({ createdAt: -1 });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Update order status
  router.patch('/:orderId/status', async (req, res) => {
    try {
      const { status, userId } = req.body;
      const order = await Order.findById(req.params.orderId);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      // Only allow user to cancel if status is 'placed'
      if (status === 'cancelled' && userId) {
        if (order.status !== 'placed') {
          return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
        }
        order.status = 'cancelled';
        await order.save();
        return res.status(200).json(order);
      }
      // Admin can set any status
      order.status = status;
      await order.save();
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  return router;
}; 
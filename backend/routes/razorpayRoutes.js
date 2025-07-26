const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

console.log('Razorpay Config:', { key_id, key_secret: key_secret ? '***' : 'undefined' });

const razorpay = new Razorpay({ key_id, key_secret });

// Get Razorpay key for frontend
router.get('/key', (req, res) => {
  res.json({ key: key_id });
});

router.post('/order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    console.log('Creating Razorpay order:', { amount, currency, receipt });
    
    if (!amount) return res.status(400).json({ error: 'Amount is required' });
    if (!key_id || !key_secret) {
      console.error('Razorpay credentials not configured');
      return res.status(500).json({ error: 'Payment gateway not configured' });
    }
    
    const options = {
      amount: amount * 100, // amount in paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      payment_capture: 1
    };
    
    console.log('Razorpay order options:', options);
    
    const order = await razorpay.orders.create(options);
    console.log('Razorpay order created:', order);
    res.json(order);
  } catch (err) {
    console.error('Razorpay order creation error:', err);
    res.status(500).json({ error: 'Failed to create Razorpay order', details: err.message });
  }
});

module.exports = router; 
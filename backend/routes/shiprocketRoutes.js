const express = require('express');
const router = express.Router();

// In-memory dummy shipment store
const dummyShipments = {};

// Create a dummy shipment for an order
router.post('/create-shipment', (req, res) => {
  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ message: 'orderId required' });
  const awb = 'SR' + Math.floor(Math.random() * 1000000);
  const trackingUrl = `https://shiprocket.co/tracking/${awb}`;
  dummyShipments[orderId] = {
    orderId,
    awb,
    trackingUrl,
    status: 'Pickup Scheduled',
    createdAt: new Date().toISOString()
  };
  res.json(dummyShipments[orderId]);
});

// Get dummy shipment status for an order
router.get('/status/:orderId', (req, res) => {
  const shipment = dummyShipments[req.params.orderId];
  if (!shipment) return res.status(404).json({ message: 'No shipment found' });
  res.json(shipment);
});

// List all dummy shipments
router.get('/shipments', (req, res) => {
  res.json(Object.values(dummyShipments));
});

module.exports = router; 
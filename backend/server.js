require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));

// Serve static files from uploads directory
app.use('/api/ecom/products/uploads', express.static('uploads'));
app.use('/api/products/uploads', express.static('uploads'));

// Socket.io connection
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Import routes
const productRoutes = require('./routes/productRoutes')(io);
const blogRoutes = require('./routes/blogRoutes')(io);
const profileRoutes = require('./routes/profileRoutes')(io);
const contactRoutes = require('./routes/contactRoutes')(io);
const orderRoutes = require('./routes/orderRoutes')(io);
const deliveryPartnerRoutes = require('./routes/deliveryPartnerRoutes');
const shiprocketRoutes = require('./routes/shiprocketRoutes');
const razorpayRoutes = require('./routes/razorpayRoutes');
const emailVerificationRoutes = require('./routes/emailVerificationRoutes');

console.log('Routes imported successfully');

// API Routes
app.use('/api/ecom/products', productRoutes);
app.use('/api/ecom/blogs', blogRoutes);
app.use('/api/ecom/profile', profileRoutes);
app.use('/api/ecom/contact', contactRoutes);
app.use('/api/ecom/orders', orderRoutes);
app.use('/api/ecom/delivery-partners', deliveryPartnerRoutes);
app.use('/api/ecom/shiprocket', shiprocketRoutes);
app.use('/api/razorpay', razorpayRoutes);
app.use('/api/ecom/email-verification', emailVerificationRoutes(io));

console.log('API routes registered successfully');

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to GreenRaise API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error middleware caught:', err);
  console.error('Request URL:', req.url);
  console.error('Request method:', req.method);
  console.error('Request body:', req.body);
  console.error('Error stack:', err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Promise Rejection:', err);
  console.error('Promise:', promise);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Start server
const PORT = process.env.PORT || 2999;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API endpoints available at:`);
  console.log(`- http://localhost:${PORT}/api/ecom/products`);
  console.log(`- http://localhost:${PORT}/api/ecom/blogs`);
  console.log(`- http://localhost:${PORT}/api/ecom/profile`);
  console.log(`- http://localhost:${PORT}/api/ecom/contact`);
  console.log(`- http://localhost:${PORT}/api/ecom/email-verification`);
  console.log(`- http://localhost:${PORT}/api/ecom/profile/test (test endpoint)`);
}); 
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Product = require('../models/productModel');

// Initialize socket.io for this router
module.exports = function(io) {
  // Test route to check if backend is working
  router.get('/test', (req, res) => {
    res.status(200).json({ message: 'Profile routes are working' });
  });
  
  // Create or get Firebase user profile
  router.post('/firebase/create', async (req, res) => {
    try {
      console.log('Firebase create request received:', req.body);
      const { firebaseUid, name, email, phone } = req.body;
      
      if (!firebaseUid || !email) {
        return res.status(400).json({ message: 'Firebase UID and email are required' });
      }
      
      // Check if user already exists by Firebase UID
      let user = await User.findOne({ userId: firebaseUid });
      
      if (!user) {
        // Check if user exists with same email but different userId
        const existingUserByEmail = await User.findOne({ email: email });
        
        if (existingUserByEmail) {
          // Update existing user's userId to Firebase UID
          existingUserByEmail.userId = firebaseUid;
          existingUserByEmail.name = name || existingUserByEmail.name;
          existingUserByEmail.phone = phone || existingUserByEmail.phone;
          await existingUserByEmail.save();
          user = existingUserByEmail;
        } else {
          // Create new user with Firebase UID as userId
          user = new User({
            userId: firebaseUid,
            name: name || email.split('@')[0],
            email: email,
            phone: phone || '',
            password: 'firebase-auth', // Placeholder since Firebase handles auth
            role: 'user'
          });
          
          await user.save();
        }
      }
      
      // Return user profile without password
      const userProfile = {
        userId: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        addresses: user.addresses,
        cartCount: user.cart.length,
        wishlistCount: user.wishlist.length,
        orderCount: user.orders.length,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
      
      res.status(200).json(userProfile);
    } catch (error) {
      console.error('Error creating Firebase user profile:', error);
      console.error('Request body:', req.body);
      console.error('Error details:', error.stack);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  // Get user profile
  router.get('/:userId', async (req, res) => {
    try {
      // In a real app, you'd use authentication middleware to verify the user
      const user = await User.findOne({ userId: req.params.userId });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Don't send password in response
      const userProfile = {
        userId: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        addresses: user.addresses,
        cartCount: user.cart.length,
        wishlistCount: user.wishlist.length,
        orderCount: user.orders.length,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
      
      res.status(200).json(userProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Update user profile
  router.put('/:userId', async (req, res) => {
    try {
      // In a real app, you'd use authentication middleware to verify the user
      const { password, ...updateData } = req.body; // Remove password from update data
      
      const updatedUser = await User.findOneAndUpdate(
        { userId: req.params.userId },
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Don't send password in response
      const userProfile = {
        userId: updatedUser.userId,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage,
        addresses: updatedUser.addresses,
        cartCount: updatedUser.cart.length,
        wishlistCount: updatedUser.wishlist.length,
        orderCount: updatedUser.orders.length,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      };
      
      res.status(200).json(userProfile);
      
      // Emit event for profile update
      io.emit('profile:updated', { 
        userId: updatedUser.userId,
        name: updatedUser.name
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Add address to user profile
  router.post('/:userId/addresses', async (req, res) => {
    try {
      const user = await User.findOne({ userId: req.params.userId });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Add new address
      user.addresses.push(req.body);
      
      // If this is the first address or isDefault is true, make it the default
      if (user.addresses.length === 1 || req.body.isDefault) {
        // Set all addresses to non-default
        user.addresses.forEach(address => {
          address.isDefault = false;
        });
        // Set the new address as default
        user.addresses[user.addresses.length - 1].isDefault = true;
      }
      
      await user.save();
      
      res.status(201).json(user.addresses);
      
      // Emit event for address added
      io.emit('profile:address:added', { 
        userId: user.userId,
        addressCount: user.addresses.length
      });
    } catch (error) {
      console.error('Error adding address:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Get user cart
  router.get('/:userId/cart', async (req, res) => {
    try {
      const user = await User.findOne({ userId: req.params.userId });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json(user.cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Add product to cart
  router.post('/:userId/cart', async (req, res) => {
    try {
      const user = await User.findOne({ userId: req.params.userId });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Check if product already exists in cart
      const existingCartItem = user.cart.find(item => item.productId === req.body.productId);
      
      if (existingCartItem) {
        // Update quantity
        existingCartItem.quantity += req.body.quantity || 1;
      } else {
        // Add new item to cart
        user.cart.push(req.body);
      }
      
      await user.save();
      
      res.status(200).json(user.cart);
      
      // Emit event for cart update
      io.emit('profile:cart:updated', { 
        userId: user.userId,
        cartCount: user.cart.length
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Update cart item quantity
  router.put('/:userId/cart', async (req, res) => {
    try {
      const user = await User.findOne({ userId: req.params.userId });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const { productId, quantity } = req.body;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        user.cart = user.cart.filter(item => item.productId !== productId);
      } else {
        // Update quantity
        const cartItem = user.cart.find(item => item.productId === productId);
        if (cartItem) {
          cartItem.quantity = quantity;
        }
      }
      
      await user.save();
      
      res.status(200).json(user.cart);
      
      // Emit event for cart update
      io.emit('profile:cart:updated', { 
        userId: user.userId,
        cartCount: user.cart.length
      });
    } catch (error) {
      console.error('Error updating cart item:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Remove item from cart
  router.delete('/:userId/cart', async (req, res) => {
    try {
      const user = await User.findOne({ userId: req.params.userId });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const { productId } = req.body;
      
      // Remove item from cart
      user.cart = user.cart.filter(item => item.productId !== productId);
      
      await user.save();
      
      res.status(200).json(user.cart);
      
      // Emit event for cart update
      io.emit('profile:cart:updated', { 
        userId: user.userId,
        cartCount: user.cart.length
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Clear cart
  router.delete('/:userId/cart/clear', async (req, res) => {
    try {
      const user = await User.findOne({ userId: req.params.userId });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Clear all items from cart
      user.cart = [];
      
      await user.save();
      
      res.status(200).json({ message: 'Cart cleared successfully', cart: [] });
      
      // Emit event for cart update
      io.emit('profile:cart:updated', { 
        userId: user.userId,
        cartCount: 0
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Sync cart (for merging local and backend cart)
  router.post('/:userId/cart/sync', async (req, res) => {
    try {
      const user = await User.findOne({ userId: req.params.userId });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Replace entire cart with synced data
      user.cart = req.body;
      await user.save();
      
      res.status(200).json(user.cart);
      
      // Emit event for cart update
      io.emit('cart:updated', { userId: req.params.userId, cart: user.cart });
    } catch (error) {
      console.error('Error syncing cart:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Get user wishlist
  router.get('/:userId/wishlist', async (req, res) => {
    try {
      const user = await User.findOne({ userId: req.params.userId });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json(user.wishlist);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Add product to wishlist
  router.post('/:userId/wishlist', async (req, res) => {
    try {
      const user = await User.findOne({ userId: req.params.userId });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Check if product already exists in wishlist
      const existingWishlistItem = user.wishlist.find(item => item.productId === req.body.productId);
      
      if (!existingWishlistItem) {
        // Add new item to wishlist
        user.wishlist.push(req.body);
        await user.save();
      }
      
      res.status(200).json(user.wishlist);
      
      // Emit event for wishlist update
      io.emit('profile:wishlist:updated', { 
        userId: user.userId,
        wishlistCount: user.wishlist.length
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // User login
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      // Don't send password
      const userProfile = {
        userId: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        addresses: user.addresses,
        cartCount: user.cart.length,
        wishlistCount: user.wishlist.length,
        orderCount: user.orders.length,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
      res.status(200).json(userProfile);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // User registration
  router.post('/register', async (req, res) => {
    try {
      const { name, email, password, phone } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
      }
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ message: 'Email already registered' });
      }
      const user = new User({ name, email, password, phone });
      await user.save();
      const userProfile = {
        userId: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        addresses: user.addresses,
        cartCount: user.cart.length,
        wishlistCount: user.wishlist.length,
        orderCount: user.orders.length,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
      res.status(201).json(userProfile);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  return router;
}; 
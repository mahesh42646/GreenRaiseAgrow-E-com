const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');

// Initialize socket.io for this router
module.exports = function(io) {
  // Get all products
  router.get('/', async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
      
      // Emit event to all connected clients
      io.emit('products:fetch', { count: products.length });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Get a single product by ID
  router.get('/:id', async (req, res) => {
    try {
      const product = await Product.findOne({ productId: req.params.id });
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      // Increment view count
      product.activeViewCount += 1;
      await product.save();
      
      res.status(200).json(product);
      
      // Emit event for product view
      io.emit('product:view', { 
        productId: product.productId, 
        productName: product.productName,
        viewCount: product.activeViewCount 
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Create a new product
  router.post('/', async (req, res) => {
    try {
      // Accepts: media (array of {type, url}), thumbnail (string), and all other fields
      const newProduct = new Product(req.body);
      const savedProduct = await newProduct.save();
      
      res.status(201).json(savedProduct);
      
      // Emit event for new product
      io.emit('product:created', { 
        productId: savedProduct.productId, 
        productName: savedProduct.productName 
      });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Update a product
  router.put('/:id', async (req, res) => {
    try {
      // Accepts: media (array of {type, url}), thumbnail (string), and all other fields
      const updatedProduct = await Product.findOneAndUpdate(
        { productId: req.params.id },
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.status(200).json(updatedProduct);
      
      // Emit event for updated product
      io.emit('product:updated', { 
        productId: updatedProduct.productId, 
        productName: updatedProduct.productName 
      });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Delete a product
  router.delete('/:id', async (req, res) => {
    try {
      const deletedProduct = await Product.findOneAndDelete({ productId: req.params.id });
      
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.status(200).json({ message: 'Product deleted successfully' });
      
      // Emit event for deleted product
      io.emit('product:deleted', { 
        productId: req.params.id
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Add a review to a product
  router.post('/:id/reviews', async (req, res) => {
    try {
      const product = await Product.findOne({ productId: req.params.id });
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      // Add the review
      product.reviews.push(req.body);
      
      // Update review count and average rating
      product.reviewCount = product.reviews.length;
      
      // Calculate average rating
      const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
      product.averageRating = totalRating / product.reviewCount;
      
      await product.save();
      
      res.status(201).json(product);
      
      // Emit event for new review
      io.emit('product:review:added', { 
        productId: product.productId,
        productName: product.productName,
        reviewCount: product.reviewCount,
        averageRating: product.averageRating
      });
    } catch (error) {
      console.error('Error adding review:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Add a FAQ to a product
  router.post('/:id/faqs', async (req, res) => {
    try {
      const product = await Product.findOne({ productId: req.params.id });
      if (!product) return res.status(404).json({ message: 'Product not found' });
      product.faqs.push(req.body);
      await product.save();
      res.status(201).json(product.faqs);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Update a FAQ
  router.put('/:id/faqs/:faqId', async (req, res) => {
    try {
      const product = await Product.findOne({ productId: req.params.id });
      if (!product) return res.status(404).json({ message: 'Product not found' });
      const faq = product.faqs.id(req.params.faqId);
      if (!faq) return res.status(404).json({ message: 'FAQ not found' });
      faq.question = req.body.question;
      faq.answer = req.body.answer;
      await product.save();
      res.status(200).json(faq);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Delete a FAQ
  router.delete('/:id/faqs/:faqId', async (req, res) => {
    try {
      const product = await Product.findOne({ productId: req.params.id });
      if (!product) return res.status(404).json({ message: 'Product not found' });
      product.faqs = product.faqs.filter(faq => faq.faqId !== req.params.faqId);
      await product.save();
      res.status(200).json(product.faqs);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Add a customer question
  router.post('/:id/questions', async (req, res) => {
    try {
      const product = await Product.findOne({ productId: req.params.id });
      if (!product) return res.status(404).json({ message: 'Product not found' });
      product.questions.push(req.body);
      await product.save();
      res.status(201).json(product.questions);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Answer a customer question
  router.put('/:id/questions/:questionId', async (req, res) => {
    try {
      const product = await Product.findOne({ productId: req.params.id });
      if (!product) return res.status(404).json({ message: 'Product not found' });
      const question = product.questions.id(req.params.questionId);
      if (!question) return res.status(404).json({ message: 'Question not found' });
      question.answer = req.body.answer;
      await product.save();
      res.status(200).json(question);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Get all questions for a product
  router.get('/:id/questions', async (req, res) => {
    try {
      const product = await Product.findOne({ productId: req.params.id });
      if (!product) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json(product.questions);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  return router;
}; 
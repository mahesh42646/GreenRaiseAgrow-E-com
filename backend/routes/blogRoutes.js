const express = require('express');
const router = express.Router();
const Blog = require('../models/blogModel');

// Initialize socket.io for this router
module.exports = function(io) {
  // Get all blogs
  router.get('/', async (req, res) => {
    try {
      const blogs = await Blog.find({ status: 'published' }).sort({ publishDate: -1 });
      res.status(200).json(blogs);
      
      // Emit event to all connected clients
      io.emit('blogs:fetch', { count: blogs.length });
    } catch (error) {
      console.error('Error fetching blogs:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Get a single blog by ID or slug
  router.get('/:identifier', async (req, res) => {
    try {
      const identifier = req.params.identifier;
      let blog;
      
      // Check if identifier is a blogId or slug
      if (identifier.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)) {
        blog = await Blog.findOne({ blogId: identifier });
      } else {
        blog = await Blog.findOne({ slug: identifier });
      }
      
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
      
      // Increment view count
      blog.viewCount += 1;
      await blog.save();
      
      res.status(200).json(blog);
      
      // Emit event for blog view
      io.emit('blog:view', { 
        blogId: blog.blogId, 
        title: blog.title,
        viewCount: blog.viewCount 
      });
    } catch (error) {
      console.error('Error fetching blog:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Create a new blog
  router.post('/', async (req, res) => {
    try {
      const newBlog = new Blog(req.body);
      const savedBlog = await newBlog.save();
      
      res.status(201).json(savedBlog);
      
      // Emit event for new blog
      io.emit('blog:created', { 
        blogId: savedBlog.blogId, 
        title: savedBlog.title 
      });
    } catch (error) {
      console.error('Error creating blog:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Update a blog
  router.put('/:id', async (req, res) => {
    try {
      const updatedBlog = await Blog.findOneAndUpdate(
        { blogId: req.params.id },
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!updatedBlog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
      
      res.status(200).json(updatedBlog);
      
      // Emit event for updated blog
      io.emit('blog:updated', { 
        blogId: updatedBlog.blogId, 
        title: updatedBlog.title 
      });
    } catch (error) {
      console.error('Error updating blog:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Delete a blog
  router.delete('/:id', async (req, res) => {
    try {
      const deletedBlog = await Blog.findOneAndDelete({ blogId: req.params.id });
      
      if (!deletedBlog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
      
      res.status(200).json({ message: 'Blog deleted successfully' });
      
      // Emit event for deleted blog
      io.emit('blog:deleted', { 
        blogId: req.params.id
      });
    } catch (error) {
      console.error('Error deleting blog:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Add a comment to a blog
  router.post('/:id/comments', async (req, res) => {
    try {
      const blog = await Blog.findOne({ blogId: req.params.id });
      
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }
      
      // Add the comment
      blog.comments.push(req.body);
      await blog.save();
      
      res.status(201).json(blog);
      
      // Emit event for new comment
      io.emit('blog:comment:added', { 
        blogId: blog.blogId,
        title: blog.title,
        commentCount: blog.comments.length
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  return router;
}; 
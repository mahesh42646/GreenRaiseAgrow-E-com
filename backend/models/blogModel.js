const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const blogSchema = new mongoose.Schema({
  blogId: { type: String, default: uuidv4, unique: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  author: { type: String, required: true },
  authorEmail: { type: String, required: true },
  featuredImage: { type: String, default: '' },
  category: { type: String, required: true },
  tags: { type: [String], default: [] },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  publishDate: { type: Date },
  viewCount: { type: Number, default: 0 },
  comments: [{
    commentId: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    email: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    replies: [{
      replyId: { type: String, default: uuidv4 },
      name: { type: String, required: true },
      email: { type: String, required: true },
      content: { type: String, required: true },
      date: { type: Date, default: Date.now },
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
    }]
  }],
  isFeatured: { type: Boolean, default: false },
  metaTitle: { type: String },
  metaDescription: { type: String },
  readTime: { type: Number, default: 0 } // in minutes
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema); 
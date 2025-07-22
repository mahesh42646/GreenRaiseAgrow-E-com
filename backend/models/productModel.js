const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const productSchema = new mongoose.Schema({
  productId: { type: String, default: uuidv4, unique: true },
  productName: { type: String, required: true },
  recentlyOrderedCount: { type: Number, default: 0 },
  activeViewCount: { type: Number, default: 0 },
  actualPrice: { type: Number, required: true },
  discountedPrice: { type: Number },
  shortDescription: { type: String },
  longDescription: { type: String },
  productImage: { type: String, required: true }, // Main thumbnail image
  media: [{
    type: { type: String, enum: ['image', 'video'], required: true },
    url: { type: String, required: true }
  }],
  productVideo: { type: String, default: "" },
  productBrochure: { type: String, default: "" },
  productReviews: { type: [String], default: [] },
  productRating: { type: Number, default: 0 },
  productCategory: { type: String },
  productSubcategory: { type: String },
  productTags: { type: [String], default: [] },
  quantity: { type: Number },
  variants: { type: [String] },
  skuNo: { type: String },
  stockStatus: { type: String, enum: ['In Stock', 'Out of Stock'] },
  quantityStockLeft: { type: Number },
  reviews: [{
    reviewId: { type: String, default: uuidv4 },
    reviewerName: { type: String },
    reviewerEmail: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    reviewText: { type: String },
    reviewDate: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    replies: [{
      replyId: { type: String, default: uuidv4 },
      replierName: { type: String },
      replyText: { type: String },
      replyDate: { type: Date, default: Date.now }
    }],
    reports: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'hidden'], default: 'active' },
    featured: { type: Boolean, default: false }
  }],
  reviewCount: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  adminEmail: { type: String, required: true },
  isBestSeller: { type: Boolean, default: false },
  packagingSize: {
    size: { type: String, default: '' },
    unit: { type: String, default: 'custom' }
  },
  minimumOrderQuantity: { type: Number, default: 1 },
  dose: {
    value: { type: String, default: '' },
    unit: { type: String, default: 'custom' }
  },
  moisturePercentage: { type: Number, default: 0 },
  isUpcoming: { type: Boolean, default: false },
  waitingTime: { type: String, default: '' },
  faqs: [{
    faqId: { type: String, default: uuidv4 },
    question: { type: String, required: true },
    answer: { type: String, required: true }
  }],
  questions: [{
    questionId: { type: String, default: uuidv4 },
    customerName: { type: String },
    customerEmail: { type: String },
    question: { type: String, required: true },
    answer: { type: String },
    askedAt: { type: Date, default: Date.now }
  }],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema); 
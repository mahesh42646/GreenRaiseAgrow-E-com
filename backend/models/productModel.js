const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const productSchema = new mongoose.Schema({
  productId: { type: String, default: uuidv4, unique: true },
  productName: { type: String, required: true },
  recentlyOrderedCount: { type: Number, default: 0 },
  activeViewCount: { type: Number, default: 0 },
  actualPrice: { type: Number, required: true },
  discountedPrice: { type: Number },
  shortDescription: { type: String, required: true },
  longDescription: { type: String, required: true },
  productImage: { type: [String], default: [] },
  productVideo: { type: String, default: "" },
  productBrochure: { type: String, default: "" },
  productReviews: { type: [String], default: [] },
  productRating: { type: Number, default: 0 },
  productCategory: { type: String, required: true },
  productSubcategory: { type: String, required: true },
  productTags: { type: [String], default: [] },
  quantity: { type: Number, required: true },
  variants: { type: [String] },
  skuNo: { type: String, required: true, unique: true },
  stockStatus: { type: String, enum: ['In Stock', 'Out of Stock'], required: true },
  quantityStockLeft: { type: Number, required: true },
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
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema); 
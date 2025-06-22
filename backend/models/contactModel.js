const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const contactSchema = new mongoose.Schema({
  contactId: { type: String, default: uuidv4, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'responded', 'closed'], default: 'new' },
  responseDate: { type: Date },
  responseMessage: { type: String },
  respondedBy: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema); 
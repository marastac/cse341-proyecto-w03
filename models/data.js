// models/data.js
const mongoose = require('mongoose');

// Data Schema with 7+ fields as required for CSE341 project
const dataSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  isActive: { type: Boolean, required: true, default: true },
  tags: [{ type: String }],
  createdDate: { type: Date, required: true, default: Date.now },
  lastModified: { type: Date, required: true, default: Date.now },
  metadata: {
    author: { type: String, required: true },
    version: { type: String, required: true, default: "1.0" }
  }
}, {
  timestamps: true
});

// Export Data Model
module.exports = mongoose.model('Data', dataSchema);
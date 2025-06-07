// models/user.js
const mongoose = require('mongoose');

// User Schema with 7+ fields as required for CSE341 project
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String, required: true },
  isActive: { type: Boolean, required: true, default: true },
  hireDate: { type: Date, required: true, default: Date.now },
  metadata: {
    createdBy: { type: String, required: true },
    lastModified: { type: Date, required: true, default: Date.now }
  }
}, {
  timestamps: true
});

// Export User Model
module.exports = mongoose.model('User', userSchema);
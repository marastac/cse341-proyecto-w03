// controllers/usersController.js - VERSIÓN CORREGIDA
// MVC PATTERN: Controller layer - Business logic separated from routes
const User = require('../models/user');
const mongoose = require('mongoose');

// HELPER: Validate MongoDB ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// HELPER: Email validation function
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// GET all users - Controller Function
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ hireDate: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ 
      error: 'Server Error',
      message: 'Failed to fetch users from database'
    });
  }
};

// GET user by ID - Controller Function  
const getUserById = async (req, res) => {
  try {
    // VALIDATION: Check if ID is valid MongoDB ObjectId
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: "Invalid user ID format" 
      });
    }

    const user = await User.findById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ 
        error: 'Not Found',
        message: "User not found" 
      });
    }
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ 
      error: 'Server Error',
      message: 'Failed to fetch user from database'
    });
  }
};

// POST create new user - Controller Function
const createUser = async (req, res) => {
  try {
    // INPUT VALIDATION: Check required fields for CSE341 project
    const { firstName, lastName, email, phone, role, department } = req.body;
    
    if (!firstName || !lastName || !email || !phone || !role || !department) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: "Missing required fields: firstName, lastName, email, phone, role, department" 
      });
    }

    // EMAIL VALIDATION: Check email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: "Invalid email format" 
      });
    }

    // VALIDATION: Check metadata.createdBy if provided
    const metadata = req.body.metadata || {};
    if (!metadata.createdBy) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: "metadata.createdBy is required" 
      });
    }

    // VALIDATION: Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: "Email already exists" 
      });
    }

    const newUser = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      role: role.trim(),
      department: department.trim(),
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      hireDate: req.body.hireDate || new Date(),
      metadata: {
        createdBy: metadata.createdBy.trim(),
        lastModified: new Date()
      }
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    
    // ERROR HANDLING: MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: "Email already exists" 
      });
    }
    
    // ERROR HANDLING: Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Invalid input data',
        details: errors
      });
    }
    
    res.status(500).json({ 
      error: 'Server Error',
      message: 'Failed to create user'
    });
  }
};

// PUT update user by ID - Controller Function
const updateUser = async (req, res) => {
  try {
    // VALIDATION: Check if ID is valid MongoDB ObjectId
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: "Invalid user ID format" 
      });
    }

    // INPUT VALIDATION: Check required fields for PUT request
    const { firstName, lastName, email, phone, role, department } = req.body;
    
    if (!firstName || !lastName || !email || !phone || !role || !department) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: "Missing required fields: firstName, lastName, email, phone, role, department" 
      });
    }

    // EMAIL VALIDATION: Check email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: "Invalid email format" 
      });
    }

    // VALIDATION: Check metadata.createdBy if provided
    const metadata = req.body.metadata || {};
    if (!metadata.createdBy) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: "metadata.createdBy is required" 
      });
    }

    // VALIDATION: Check if email already exists (exclude current user)
    const existingUser = await User.findOne({ 
      email: email.toLowerCase().trim(),
      _id: { $ne: req.params.id }
    });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: "Email already exists" 
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        role: role.trim(),
        department: department.trim(),
        isActive: req.body.isActive !== undefined ? req.body.isActive : true,
        hireDate: req.body.hireDate || new Date(),
        metadata: {
          createdBy: metadata.createdBy.trim(),
          lastModified: new Date()
        }
      },
      { new: true, runValidators: true }
    );
    
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ 
        error: 'Not Found',
        message: "User not found" 
      });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    
    // ERROR HANDLING: MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: "Email already exists" 
      });
    }
    
    // ERROR HANDLING: Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Invalid input data',
        details: errors
      });
    }
    
    res.status(500).json({ 
      error: 'Server Error',
      message: 'Failed to update user'
    });
  }
};

// DELETE user by ID - Controller Function
const deleteUser = async (req, res) => {
  try {
    // VALIDATION: Check if ID is valid MongoDB ObjectId
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: "Invalid user ID format" 
      });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (deletedUser) {
      res.status(200).json({ 
        message: "User deleted successfully",
        deletedUser: deletedUser 
      });
    } else {
      res.status(404).json({ 
        error: 'Not Found',
        message: "User not found" 
      });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      error: 'Server Error',
      message: 'Failed to delete user'
    });
  }
};

// EXPORT: All controller functions for use in routes
module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
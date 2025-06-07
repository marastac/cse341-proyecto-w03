// controllers/usersController.js
// MVC PATTERN: Controller layer - Business logic separated from routes
const User = require('../models/user');

// GET all users - Controller Function
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET user by ID - Controller Function  
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create new user - Controller Function
const createUser = async (req, res) => {
  // INPUT VALIDATION: Check required fields for CSE341 project
  const { firstName, lastName, email, phone, role, department, createdBy } = req.body;
  
  if (!firstName || !lastName || !email || !phone || !role || !department || !createdBy) {
    return res.status(400).json({ 
      message: "Missing required fields: firstName, lastName, email, phone, role, department, createdBy" 
    });
  }

  // EMAIL VALIDATION: Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      message: "Invalid email format" 
    });
  }

  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    role: req.body.role,
    department: req.body.department,
    isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    hireDate: req.body.hireDate || new Date(),
    metadata: {
      createdBy: req.body.createdBy,
      lastModified: new Date()
    }
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    // ERROR HANDLING: Validation errors (including duplicate email)
    if (error.code === 11000) {
      res.status(400).json({ message: "Email already exists" });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

// PUT update user by ID - Controller Function
const updateUser = async (req, res) => {
  // INPUT VALIDATION: Check required fields for PUT request
  const { firstName, lastName, email, phone, role, department, createdBy } = req.body;
  
  if (!firstName || !lastName || !email || !phone || !role || !department || !createdBy) {
    return res.status(400).json({ 
      message: "Missing required fields: firstName, lastName, email, phone, role, department, createdBy" 
    });
  }

  // EMAIL VALIDATION: Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      message: "Invalid email format" 
    });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        metadata: {
          ...req.body.metadata,
          createdBy: req.body.createdBy,
          lastModified: new Date()
        }
      },
      { new: true, runValidators: true }
    );
    
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    // ERROR HANDLING: Validation errors (including duplicate email)
    if (error.code === 11000) {
      res.status(400).json({ message: "Email already exists" });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

// DELETE user by ID - Controller Function
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (deletedUser) {
      res.json({ 
        message: "User deleted successfully",
        deletedUser: deletedUser 
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    // ERROR HANDLING: Server errors
    res.status(500).json({ message: error.message });
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
// controllers/dataController.js - VERSIÓN CORREGIDA
// MVC PATTERN: Controller layer - Business logic separated from routes
const Data = require('../models/data');
const mongoose = require('mongoose');

// HELPER: Validate MongoDB ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// GET all data - Controller Function
const getAllData = async (req, res) => {
  try {
    const data = await Data.find().sort({ createdDate: -1 });
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching all data:', error);
    res.status(500).json({ 
      error: 'Server Error',
      message: 'Failed to fetch data from database'
    });
  }
};

// GET data by ID - Controller Function  
const getDataById = async (req, res) => {
  try {
    // VALIDATION: Check if ID is valid MongoDB ObjectId
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: "Invalid data ID format" 
      });
    }

    const data = await Data.findById(req.params.id);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ 
        error: 'Not Found',
        message: "Data not found" 
      });
    }
  } catch (error) {
    console.error('Error fetching data by ID:', error);
    res.status(500).json({ 
      error: 'Server Error',
      message: 'Failed to fetch data from database'
    });
  }
};

// POST create new data - Controller Function
const createData = async (req, res) => {
  try {
    // INPUT VALIDATION: Check required fields for CSE341 project
    const { title, description, category, price } = req.body;
    
    if (!title || !description || !category || price === undefined || price === null) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: "Missing required fields: title, description, category, price" 
      });
    }

    // VALIDATION: Price must be a positive number
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: "Price must be a positive number" 
      });
    }

    // VALIDATION: Check metadata.author if provided
    const metadata = req.body.metadata || {};
    if (!metadata.author) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: "metadata.author is required" 
      });
    }

    const newData = new Data({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      price: price,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      tags: Array.isArray(req.body.tags) ? req.body.tags : [],
      createdDate: new Date(),
      lastModified: new Date(),
      metadata: {
        author: metadata.author.trim(),
        version: metadata.version || "1.0"
      }
    });

    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (error) {
    console.error('Error creating data:', error);
    
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
      message: 'Failed to create data'
    });
  }
};

// PUT update data by ID - Controller Function
const updateData = async (req, res) => {
  try {
    // VALIDATION: Check if ID is valid MongoDB ObjectId
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: "Invalid data ID format" 
      });
    }

    // INPUT VALIDATION: Check required fields for PUT request
    const { title, description, category, price } = req.body;
    
    if (!title || !description || !category || price === undefined || price === null) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: "Missing required fields: title, description, category, price" 
      });
    }

    // VALIDATION: Price must be a positive number
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: "Price must be a positive number" 
      });
    }

    // VALIDATION: Check metadata.author if provided
    const metadata = req.body.metadata || {};
    if (!metadata.author) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: "metadata.author is required" 
      });
    }

    const updatedData = await Data.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        price: price,
        isActive: req.body.isActive !== undefined ? req.body.isActive : true,
        tags: Array.isArray(req.body.tags) ? req.body.tags : [],
        lastModified: new Date(),
        metadata: {
          author: metadata.author.trim(),
          version: metadata.version || "1.0"
        }
      },
      { new: true, runValidators: true }
    );
    
    if (updatedData) {
      res.status(200).json(updatedData);
    } else {
      res.status(404).json({ 
        error: 'Not Found',
        message: "Data not found" 
      });
    }
  } catch (error) {
    console.error('Error updating data:', error);
    
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
      message: 'Failed to update data'
    });
  }
};

// DELETE data by ID - Controller Function
const deleteData = async (req, res) => {
  try {
    // VALIDATION: Check if ID is valid MongoDB ObjectId
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: "Invalid data ID format" 
      });
    }

    const deletedData = await Data.findByIdAndDelete(req.params.id);
    if (deletedData) {
      res.status(200).json({ 
        message: "Data deleted successfully",
        deletedData: deletedData 
      });
    } else {
      res.status(404).json({ 
        error: 'Not Found',
        message: "Data not found" 
      });
    }
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ 
      error: 'Server Error',
      message: 'Failed to delete data'
    });
  }
};

// EXPORT: All controller functions for use in routes
module.exports = {
  getAllData,
  getDataById,
  createData,
  updateData,
  deleteData
};
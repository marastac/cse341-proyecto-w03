// controllers/dataController.js
// MVC PATTERN: Controller layer - Business logic separated from routes
const Data = require('../models/data');

// GET all data - Controller Function
const getAllData = async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET data by ID - Controller Function  
const getDataById = async (req, res) => {
  try {
    const data = await Data.findById(req.params.id);
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create new data - Controller Function
const createData = async (req, res) => {
  // INPUT VALIDATION: Check required fields for CSE341 project
  const { title, description, category, price, author } = req.body;
  
  if (!title || !description || !category || !price || !author) {
    return res.status(400).json({ 
      message: "Missing required fields: title, description, category, price, author" 
    });
  }

  const newData = new Data({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    price: req.body.price,
    isActive: req.body.isActive || true,
    tags: req.body.tags || [],
    createdDate: new Date(),
    lastModified: new Date(),
    metadata: {
      author: req.body.author,
      version: req.body.version || "1.0"
    }
  });

  try {
    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (error) {
    // ERROR HANDLING: Validation errors
    res.status(400).json({ message: error.message });
  }
};

// PUT update data by ID - Controller Function
const updateData = async (req, res) => {
  // INPUT VALIDATION: Check required fields for PUT request
  const { title, description, category, price, author } = req.body;
  
  if (!title || !description || !category || !price || !author) {
    return res.status(400).json({ 
      message: "Missing required fields: title, description, category, price, author" 
    });
  }

  try {
    const updatedData = await Data.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        lastModified: new Date(),
        metadata: {
          ...req.body.metadata,
          author: req.body.author,
          version: req.body.version || "1.0"
        }
      },
      { new: true, runValidators: true }
    );
    
    if (updatedData) {
      res.json(updatedData);
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (error) {
    // ERROR HANDLING: Validation errors
    res.status(400).json({ message: error.message });
  }
};

// DELETE data by ID - Controller Function
const deleteData = async (req, res) => {
  try {
    const deletedData = await Data.findByIdAndDelete(req.params.id);
    if (deletedData) {
      res.json({ 
        message: "Data deleted successfully",
        deletedData: deletedData 
      });
    } else {
      res.status(404).json({ message: "Data not found" });
    }
  } catch (error) {
    // ERROR HANDLING: Server errors
    res.status(500).json({ message: error.message });
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
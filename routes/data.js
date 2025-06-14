// routes/data.js
// MVC PATTERN: Routes layer - Only route definitions, logic moved to controllers
const express = require('express');
const router = express.Router();
// IMPORT: Controller functions following MVC architecture
const dataController = require('../controllers/dataController');
// IMPORT: Authentication middleware
const { ensureAuthenticated } = require('../middleware/auth');

// GET All Data
router.get('/', 
  /*  #swagger.tags = ['Data']
      #swagger.summary = 'Get all data'
      #swagger.description = 'Retrieve all data from the database'
      #swagger.responses[200] = {
        description: 'Array of data objects',
        schema: { $ref: '#/definitions/Data' }
      }
      #swagger.responses[500] = {
        description: 'Server error'
      }
  */
  dataController.getAllData
);

// GET Data by ID
router.get('/:id', 
  /*  #swagger.tags = ['Data']
      #swagger.summary = 'Get data by ID'
      #swagger.description = 'Retrieve a specific data object by their ID'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'Data ID',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: 'Data found',
        schema: { $ref: '#/definitions/Data' }
      }
      #swagger.responses[404] = {
        description: 'Data not found'
      }
      #swagger.responses[500] = {
        description: 'Server error'
      }
  */
  dataController.getDataById
);

// POST Create New Data
router.post('/', 
  /*  #swagger.tags = ['Data']
      #swagger.summary = 'Create new data'
      #swagger.description = 'Create a new data object with all required fields'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Data object',
        required: true,
        schema: { $ref: '#/definitions/Data' }
      }
      #swagger.responses[201] = {
        description: 'Data created successfully',
        schema: { $ref: '#/definitions/Data' }
      }
      #swagger.responses[400] = {
        description: 'Invalid input data or missing required fields'
      }
      #swagger.responses[500] = {
        description: 'Server error'
      }
  */
  dataController.createData
);

// PUT Update Data by ID
router.put('/:id', 
  /*  #swagger.tags = ['Data']
      #swagger.summary = 'Update data by ID'
      #swagger.description = 'Update an existing data object with validation'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'Data ID',
        required: true,
        type: 'string'
      }
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Updated data object',
        required: true,
        schema: { $ref: '#/definitions/Data' }
      }
      #swagger.responses[200] = {
        description: 'Data updated successfully',
        schema: { $ref: '#/definitions/Data' }
      }
      #swagger.responses[400] = {
        description: 'Invalid input data or missing required fields'
      }
      #swagger.responses[404] = {
        description: 'Data not found'
      }
      #swagger.responses[500] = {
        description: 'Server error'
      }
  */
  dataController.updateData
);

// DELETE Data by ID
router.delete('/:id', 
  /*  #swagger.tags = ['Data']
      #swagger.summary = 'Delete data by ID'
      #swagger.description = 'Delete a data object from the database'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'Data ID',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: 'Data deleted successfully'
      }
      #swagger.responses[404] = {
        description: 'Data not found'
      }
      #swagger.responses[500] = {
        description: 'Server error'
      }
  */
  dataController.deleteData
);

// GET Protected Data - Requires Authentication
router.get('/protected', 
  ensureAuthenticated,
  /*  #swagger.tags = ['Data (Protected)']
      #swagger.summary = 'Get protected data'
      #swagger.description = 'Get all data - Authentication Required'
      #swagger.security = [{ "OAuth": [] }]
      #swagger.responses[200] = {
        description: 'Array of data objects (authenticated access)',
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            user: { type: 'object' },
            data: {
              type: 'array',
              items: { $ref: '#/definitions/Data' }
            },
            protectedAccess: { type: 'boolean' }
          }
        }
      }
      #swagger.responses[401] = {
        description: 'Authentication required'
      }
  */
  async (req, res) => {
    try {
      const data = await require('../models/data').find().sort({ createdDate: -1 });
      res.status(200).json({
        message: 'Protected data access granted',
        user: req.user,
        data: data,
        protectedAccess: true,
        accessTime: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching protected data:', error);
      res.status(500).json({ 
        error: 'Server Error',
        message: 'Failed to fetch protected data'
      });
    }
  }
);

// POST Protected Create Data - Requires Authentication
router.post('/protected', 
  ensureAuthenticated,
  /*  #swagger.tags = ['Data (Protected)']
      #swagger.summary = 'Create data (protected)'
      #swagger.description = 'Create new data with authenticated user info'
      #swagger.security = [{ "OAuth": [] }]
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Data object',
        required: true,
        schema: { $ref: '#/definitions/Data' }
      }
      #swagger.responses[201] = {
        description: 'Data created successfully with user attribution'
      }
      #swagger.responses[401] = {
        description: 'Authentication required'
      }
  */
  async (req, res) => {
    try {
      const Data = require('../models/data');
      
      // Automatically set metadata.author to authenticated user
      const dataWithUser = {
        ...req.body,
        metadata: {
          ...req.body.metadata,
          author: req.user.displayName || req.user.username,
          createdBy: req.user.username,
          authenticatedCreation: true
        }
      };
      
      const newData = new Data(dataWithUser);
      const savedData = await newData.save();
      
      res.status(201).json({
        message: 'Data created successfully by authenticated user',
        data: savedData,
        createdBy: req.user,
        protectedCreation: true
      });
    } catch (error) {
      console.error('Error creating protected data:', error);
      res.status(500).json({ 
        error: 'Server Error',
        message: 'Failed to create protected data'
      });
    }
  }
);

module.exports = router;
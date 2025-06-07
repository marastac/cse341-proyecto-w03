// routes/data.js
// MVC PATTERN: Routes layer - Only route definitions, logic moved to controllers
const express = require('express');
const router = express.Router();
// IMPORT: Controller functions following MVC architecture
const dataController = require('../controllers/dataController');

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

module.exports = router;
// routes/users.js
// MVC PATTERN: Routes layer - Only route definitions, logic moved to controllers
const express = require('express');
const router = express.Router();
// IMPORT: Controller functions following MVC architecture
const usersController = require('../controllers/usersController');

// GET All Users
router.get('/', 
  /*  #swagger.tags = ['Users']
      #swagger.summary = 'Get all users'
      #swagger.description = 'Retrieve all users from the database'
      #swagger.responses[200] = {
        description: 'Array of user objects',
        schema: { $ref: '#/definitions/User' }
      }
      #swagger.responses[500] = {
        description: 'Server error'
      }
  */
  usersController.getAllUsers
);

// GET User by ID
router.get('/:id', 
  /*  #swagger.tags = ['Users']
      #swagger.summary = 'Get user by ID'
      #swagger.description = 'Retrieve a specific user by their ID'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'User ID',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: 'User found',
        schema: { $ref: '#/definitions/User' }
      }
      #swagger.responses[404] = {
        description: 'User not found'
      }
      #swagger.responses[500] = {
        description: 'Server error'
      }
  */
  usersController.getUserById
);

// POST Create New User
router.post('/', 
  /*  #swagger.tags = ['Users']
      #swagger.summary = 'Create new user'
      #swagger.description = 'Create a new user with all required fields and validation'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'User object',
        required: true,
        schema: { $ref: '#/definitions/User' }
      }
      #swagger.responses[201] = {
        description: 'User created successfully',
        schema: { $ref: '#/definitions/User' }
      }
      #swagger.responses[400] = {
        description: 'Invalid input data, missing required fields, or email already exists'
      }
      #swagger.responses[500] = {
        description: 'Server error'
      }
  */
  usersController.createUser
);

// PUT Update User by ID
router.put('/:id', 
  /*  #swagger.tags = ['Users']
      #swagger.summary = 'Update user by ID'
      #swagger.description = 'Update an existing user with validation'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'User ID',
        required: true,
        type: 'string'
      }
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Updated user object',
        required: true,
        schema: { $ref: '#/definitions/User' }
      }
      #swagger.responses[200] = {
        description: 'User updated successfully',
        schema: { $ref: '#/definitions/User' }
      }
      #swagger.responses[400] = {
        description: 'Invalid input data, missing required fields, or email already exists'
      }
      #swagger.responses[404] = {
        description: 'User not found'
      }
      #swagger.responses[500] = {
        description: 'Server error'
      }
  */
  usersController.updateUser
);

// DELETE User by ID
router.delete('/:id', 
  /*  #swagger.tags = ['Users']
      #swagger.summary = 'Delete user by ID'
      #swagger.description = 'Delete a user from the database'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'User ID',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: 'User deleted successfully'
      }
      #swagger.responses[404] = {
        description: 'User not found'
      }
      #swagger.responses[500] = {
        description: 'Server error'
      }
  */
  usersController.deleteUser
);

module.exports = router;
// routes/users.js
// MVC PATTERN: Routes layer - Only route definitions, logic moved to controllers
const express = require('express');
const router = express.Router();
// IMPORT: Controller functions following MVC architecture
const usersController = require('../controllers/usersController');
// IMPORT: Authentication middleware
const { ensureAuthenticated } = require('../middleware/auth');

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

// GET Protected Users - Requires Authentication
router.get('/protected', 
  ensureAuthenticated,
  /*  #swagger.tags = ['Users (Protected)']
      #swagger.summary = 'Get protected users'
      #swagger.description = 'Get all users - Authentication Required'
      #swagger.security = [{ "OAuth": [] }]
      #swagger.responses[200] = {
        description: 'Array of user objects (authenticated access)',
        schema: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            user: { type: 'object' },
            users: {
              type: 'array',
              items: { $ref: '#/definitions/User' }
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
      const users = await require('../models/user').find().sort({ hireDate: -1 });
      res.status(200).json({
        message: 'Protected users access granted',
        authenticatedUser: req.user,
        users: users,
        protectedAccess: true,
        accessTime: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching protected users:', error);
      res.status(500).json({ 
        error: 'Server Error',
        message: 'Failed to fetch protected users'
      });
    }
  }
);

// POST Protected Create User - Requires Authentication
router.post('/protected', 
  ensureAuthenticated,
  /*  #swagger.tags = ['Users (Protected)']
      #swagger.summary = 'Create user (protected)'
      #swagger.description = 'Create new user with authenticated user info'
      #swagger.security = [{ "OAuth": [] }]
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'User object',
        required: true,
        schema: { $ref: '#/definitions/User' }
      }
      #swagger.responses[201] = {
        description: 'User created successfully with user attribution'
      }
      #swagger.responses[401] = {
        description: 'Authentication required'
      }
  */
  async (req, res) => {
    try {
      const User = require('../models/user');
      
      // Automatically set metadata.createdBy to authenticated user
      const userWithCreator = {
        ...req.body,
        metadata: {
          ...req.body.metadata,
          createdBy: req.user.displayName || req.user.username,
          authenticatedBy: req.user.username,
          lastModified: new Date()
        }
      };
      
      const newUser = new User(userWithCreator);
      const savedUser = await newUser.save();
      
      res.status(201).json({
        message: 'User created successfully by authenticated user',
        user: savedUser,
        createdBy: req.user,
        protectedCreation: true
      });
    } catch (error) {
      console.error('Error creating protected user:', error);
      
      // Handle duplicate email error
      if (error.code === 11000) {
        return res.status(400).json({ 
          error: 'Bad Request',
          message: "Email already exists" 
        });
      }
      
      res.status(500).json({ 
        error: 'Server Error',
        message: 'Failed to create protected user'
      });
    }
  }
);

module.exports = router;
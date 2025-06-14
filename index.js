// index.js - VERSIÓN CON OAUTH AUTHENTICATION + TEST DIRECTO
const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport'); // Import our passport configuration
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 Starting server with OAuth authentication...');

// CORS Configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: false
}));

// Additional CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration for OAuth
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ Connected to MongoDB");
})
.catch(err => {
  console.error("❌ Error connecting to MongoDB:", err);
  process.exit(1);
});

// Enhanced Swagger Document with OAuth Security
const swaggerDocument = {
  "swagger": "2.0",
  "info": {
    "title": "CSE341 W03 CRUD Operations API with OAuth",
    "description": "Complete API with Data and Users collections, featuring GitHub OAuth authentication",
    "version": "2.1.0"
  },
  "host": process.env.NODE_ENV === 'production' ? 'cse341-proyecto-w03.onrender.com' : `localhost:${PORT}`,
  "basePath": "/",
  "schemes": process.env.NODE_ENV === 'production' ? ["https"] : ["http"],
  "consumes": ["application/json"],
  "produces": ["application/json"],
  "securityDefinitions": {
    "OAuth": {
      "type": "oauth2",
      "authorizationUrl": "/auth/github",
      "flow": "implicit",
      "scopes": {
        "user:email": "Access user email"
      }
    }
  },
  "definitions": {
    "Data": {
      "type": "object",
      "properties": {
        "_id": { "type": "string" },
        "title": { "type": "string", "example": "Sample Product Title" },
        "description": { "type": "string", "example": "Sample description" },
        "category": { "type": "string", "example": "Technology" },
        "price": { "type": "number", "example": 99.99 },
        "isActive": { "type": "boolean", "example": true },
        "tags": { "type": "array", "items": { "type": "string" } },
        "createdDate": { "type": "string", "format": "date-time" },
        "lastModified": { "type": "string", "format": "date-time" },
        "metadata": {
          "type": "object",
          "properties": {
            "author": { "type": "string", "example": "John Doe" },
            "version": { "type": "string", "example": "1.0" }
          }
        }
      }
    },
    "User": {
      "type": "object",
      "properties": {
        "_id": { "type": "string" },
        "firstName": { "type": "string", "example": "John" },
        "lastName": { "type": "string", "example": "Doe" },
        "email": { "type": "string", "example": "john.doe@example.com" },
        "phone": { "type": "string", "example": "+1-555-123-4567" },
        "role": { "type": "string", "example": "Software Engineer" },
        "department": { "type": "string", "example": "Engineering" },
        "isActive": { "type": "boolean", "example": true },
        "hireDate": { "type": "string", "format": "date-time" },
        "metadata": {
          "type": "object",
          "properties": {
            "createdBy": { "type": "string", "example": "Admin" },
            "lastModified": { "type": "string", "format": "date-time" }
          }
        }
      }
    }
  },
  "paths": {
    "/auth/github": {
      "get": {
        "tags": ["Authentication"],
        "summary": "Login with GitHub",
        "description": "Redirect to GitHub for OAuth authentication",
        "responses": {
          "302": { "description": "Redirect to GitHub OAuth" }
        }
      }
    },
    "/auth/logout": {
      "get": {
        "tags": ["Authentication"],
        "summary": "Logout user",
        "description": "End user session and logout",
        "responses": {
          "200": { "description": "Logout successful" }
        }
      }
    },
    "/auth/status": {
      "get": {
        "tags": ["Authentication"],
        "summary": "Check authentication status",
        "description": "Check if user is currently authenticated",
        "responses": {
          "200": { "description": "Authentication status" }
        }
      }
    },
    "/data": {
      "get": {
        "tags": ["Data"],
        "summary": "Get all data",
        "responses": {
          "200": {
            "description": "Array of data objects",
            "schema": {
              "type": "array",
              "items": { "$ref": "#/definitions/Data" }
            }
          }
        }
      },
      "post": {
        "tags": ["Data"],
        "summary": "Create new data",
        "parameters": [{
          "in": "body",
          "name": "body",
          "required": true,
          "schema": { "$ref": "#/definitions/Data" }
        }],
        "responses": {
          "201": {
            "description": "Data created successfully",
            "schema": { "$ref": "#/definitions/Data" }
          }
        }
      }
    },
    "/data/protected": {
      "get": {
        "tags": ["Data (Protected)"],
        "summary": "Get protected data",
        "description": "Get all data - Authentication Required",
        "security": [{ "OAuth": [] }],
        "responses": {
          "200": { "description": "Array of data objects (authenticated access)" },
          "401": { "description": "Authentication required" }
        }
      },
      "post": {
        "tags": ["Data (Protected)"],
        "summary": "Create data (protected)",
        "description": "Create new data with authenticated user info",
        "security": [{ "OAuth": [] }],
        "parameters": [{
          "in": "body",
          "name": "body",
          "required": true,
          "schema": { "$ref": "#/definitions/Data" }
        }],
        "responses": {
          "201": { "description": "Data created successfully with user attribution" },
          "401": { "description": "Authentication required" }
        }
      }
    },
    "/data/{id}": {
      "get": {
        "tags": ["Data"],
        "summary": "Get data by ID",
        "parameters": [{
          "name": "id",
          "in": "path",
          "required": true,
          "type": "string"
        }],
        "responses": {
          "200": {
            "description": "Data found",
            "schema": { "$ref": "#/definitions/Data" }
          }
        }
      },
      "put": {
        "tags": ["Data"],
        "summary": "Update data by ID",
        "parameters": [{
          "name": "id",
          "in": "path",
          "required": true,
          "type": "string"
        }, {
          "in": "body",
          "name": "body",
          "required": true,
          "schema": { "$ref": "#/definitions/Data" }
        }],
        "responses": {
          "200": {
            "description": "Data updated successfully",
            "schema": { "$ref": "#/definitions/Data" }
          }
        }
      },
      "delete": {
        "tags": ["Data"],
        "summary": "Delete data by ID",
        "parameters": [{
          "name": "id",
          "in": "path",
          "required": true,
          "type": "string"
        }],
        "responses": {
          "200": { "description": "Data deleted successfully" }
        }
      }
    },
    "/users": {
      "get": {
        "tags": ["Users"],
        "summary": "Get all users",
        "responses": {
          "200": {
            "description": "Array of user objects",
            "schema": {
              "type": "array",
              "items": { "$ref": "#/definitions/User" }
            }
          }
        }
      },
      "post": {
        "tags": ["Users"],
        "summary": "Create new user",
        "parameters": [{
          "in": "body",
          "name": "body",
          "required": true,
          "schema": { "$ref": "#/definitions/User" }
        }],
        "responses": {
          "201": {
            "description": "User created successfully",
            "schema": { "$ref": "#/definitions/User" }
          }
        }
      }
    },
    "/users/protected": {
      "get": {
        "tags": ["Users (Protected)"],
        "summary": "Get protected users",
        "description": "Get all users - Authentication Required",
        "security": [{ "OAuth": [] }],
        "responses": {
          "200": { "description": "Array of user objects (authenticated access)" },
          "401": { "description": "Authentication required" }
        }
      },
      "post": {
        "tags": ["Users (Protected)"],
        "summary": "Create user (protected)",
        "description": "Create new user with authenticated user info",
        "security": [{ "OAuth": [] }],
        "parameters": [{
          "in": "body",
          "name": "body",
          "required": true,
          "schema": { "$ref": "#/definitions/User" }
        }],
        "responses": {
          "201": { "description": "User created successfully with user attribution" },
          "401": { "description": "Authentication required" }
        }
      }
    },
    "/users/{id}": {
      "get": {
        "tags": ["Users"],
        "summary": "Get user by ID",
        "parameters": [{
          "name": "id",
          "in": "path",
          "required": true,
          "type": "string"
        }],
        "responses": {
          "200": {
            "description": "User found",
            "schema": { "$ref": "#/definitions/User" }
          }
        }
      },
      "put": {
        "tags": ["Users"],
        "summary": "Update user by ID",
        "parameters": [{
          "name": "id",
          "in": "path",
          "required": true,
          "type": "string"
        }, {
          "in": "body",
          "name": "body",
          "required": true,
          "schema": { "$ref": "#/definitions/User" }
        }],
        "responses": {
          "200": {
            "description": "User updated successfully",
            "schema": { "$ref": "#/definitions/User" }
          }
        }
      },
      "delete": {
        "tags": ["Users"],
        "summary": "Delete user by ID",
        "parameters": [{
          "name": "id",
          "in": "path",
          "required": true,
          "type": "string"
        }],
        "responses": {
          "200": { "description": "User deleted successfully" }
        }
      }
    }
  }
};

// Swagger UI Setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  swaggerOptions: {
    tryItOutEnabled: true
  }
}));

// TEST - Direct route for testing
app.get('/test-direct', (req, res) => {
  res.json({ message: 'Direct route works', timestamp: new Date().toISOString() });
});

// TEST OAUTH DIRECTO EN INDEX.JS
app.get('/auth-direct', (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = 'http://localhost:3000/auth/github/callback';
  const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
  
  console.log('🔗 Redirecting to GitHub:', githubUrl);
  res.redirect(githubUrl);
});

// Routes
app.use('/auth', require('./routes/auth')); // OAuth routes
app.use('/data', require('./routes/data'));
app.use('/users', require('./routes/users'));

// Enhanced root route with OAuth info
app.get('/', (req, res) => {
  res.json({
    message: 'CSE341 W03 CRUD API with OAuth Authentication - Working!',
    authentication: {
      status: req.isAuthenticated() ? 'Authenticated' : 'Not Authenticated',
      user: req.isAuthenticated() ? req.user : null,
      loginUrl: '/auth/github',
      logoutUrl: '/auth/logout'
    },
    documentation: '/api-docs',
    endpoints: {
      auth: '/auth',
      data: '/data',
      users: '/users',
      health: '/health',
      protectedData: '/data/protected',
      protectedUsers: '/users/protected',
      testDirect: '/test-direct',
      authDirect: '/auth-direct'
    },
    version: '2.1.0'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    authentication: 'OAuth with GitHub enabled',
    oauth: {
      configured: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
      provider: 'GitHub'
    }
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: error.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: {
      auth: '/auth',
      data: '/data',
      users: '/users',
      documentation: '/api-docs',
      testDirect: '/test-direct',
      authDirect: '/auth-direct'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🔐 OAuth Login: http://localhost:${PORT}/auth/github`);
  console.log(`🧪 Test Direct: http://localhost:${PORT}/test-direct`);
  console.log(`🧪 Auth Direct: http://localhost:${PORT}/auth-direct`);
  console.log(`🔗 Data endpoints: /data`);
  console.log(`👥 Users endpoints: /users`);
  console.log(`🛡️ Protected endpoints: /data/protected, /users/protected`);
});
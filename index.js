// index.js - VERSIÓN SIMPLIFICADA Y ESTABLE
const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚀 Starting server...');

// CORS Configuration - SIMPLE Y FUNCIONAL
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

// Simple Swagger Document
const swaggerDocument = {
  "swagger": "2.0",
  "info": {
    "title": "CSE341 W03 CRUD Operations API",
    "description": "Complete API with Data and Users collections",
    "version": "2.0.0"
  },
  "host": process.env.NODE_ENV === 'production' ? 'cse341-proyecto-w03.onrender.com' : `localhost:${PORT}`,
  "basePath": "/",
  "schemes": process.env.NODE_ENV === 'production' ? ["https"] : ["http"],
  "consumes": ["application/json"],
  "produces": ["application/json"],
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

// Routes
app.use('/data', require('./routes/data'));
app.use('/users', require('./routes/users'));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'CSE341 W03 CRUD API - Working!',
    documentation: '/api-docs',
    endpoints: {
      data: '/data',
      users: '/users',
      health: '/health'
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
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🔗 Data endpoints: /data`);
  console.log(`👥 Users endpoints: /users`);
});
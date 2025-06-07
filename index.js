// index.js
const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger Document - Manual configuration for production
const swaggerDocument = {
  "swagger": "2.0",
  "info": {
    "title": "CSE341 W03 CRUD Operations API - Complete",
    "description": "Complete API with two collections: Data and Users. All endpoints include GET, POST, PUT, DELETE with validation.",
    "version": "2.0.0"
  },
  "host": "cse341-proyecto-w03.onrender.com",
  "basePath": "/",
  "schemes": ["https", "http"],
  "definitions": {
    "Data": {
      "type": "object",
      "properties": {
        "title": { "type": "string", "example": "Sample Product Title" },
        "description": { "type": "string", "example": "Sample description of the product or service" },
        "category": { "type": "string", "example": "Technology" },
        "price": { "type": "number", "example": 99.99 },
        "isActive": { "type": "boolean", "example": true },
        "tags": { "type": "array", "items": { "type": "string" }, "example": ["sample", "example", "test"] },
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
        "description": "Retrieve all data from the database",
        "responses": {
          "200": {
            "description": "Array of data objects",
            "schema": {
              "type": "array",
              "items": { "$ref": "#/definitions/Data" }
            }
          },
          "500": { "description": "Server error" }
        }
      },
      "post": {
        "tags": ["Data"],
        "summary": "Create new data",
        "description": "Create a new data object with all required fields",
        "parameters": [{
          "in": "body",
          "name": "body",
          "description": "Data object",
          "required": true,
          "schema": { "$ref": "#/definitions/Data" }
        }],
        "responses": {
          "201": {
            "description": "Data created successfully",
            "schema": { "$ref": "#/definitions/Data" }
          },
          "400": { "description": "Invalid input data or missing required fields" },
          "500": { "description": "Server error" }
        }
      }
    },
    "/data/{id}": {
      "get": {
        "tags": ["Data"],
        "summary": "Get data by ID",
        "description": "Retrieve a specific data object by their ID",
        "parameters": [{
          "name": "id",
          "in": "path",
          "description": "Data ID",
          "required": true,
          "type": "string"
        }],
        "responses": {
          "200": {
            "description": "Data found",
            "schema": { "$ref": "#/definitions/Data" }
          },
          "404": { "description": "Data not found" },
          "500": { "description": "Server error" }
        }
      },
      "put": {
        "tags": ["Data"],
        "summary": "Update data by ID",
        "description": "Update an existing data object with validation",
        "parameters": [{
          "name": "id",
          "in": "path",
          "description": "Data ID",
          "required": true,
          "type": "string"
        }, {
          "in": "body",
          "name": "body",
          "description": "Updated data object",
          "required": true,
          "schema": { "$ref": "#/definitions/Data" }
        }],
        "responses": {
          "200": {
            "description": "Data updated successfully",
            "schema": { "$ref": "#/definitions/Data" }
          },
          "400": { "description": "Invalid input data or missing required fields" },
          "404": { "description": "Data not found" },
          "500": { "description": "Server error" }
        }
      },
      "delete": {
        "tags": ["Data"],
        "summary": "Delete data by ID",
        "description": "Delete a data object from the database",
        "parameters": [{
          "name": "id",
          "in": "path",
          "description": "Data ID",
          "required": true,
          "type": "string"
        }],
        "responses": {
          "200": { "description": "Data deleted successfully" },
          "404": { "description": "Data not found" },
          "500": { "description": "Server error" }
        }
      }
    },
    "/users": {
      "get": {
        "tags": ["Users"],
        "summary": "Get all users",
        "description": "Retrieve all users from the database",
        "responses": {
          "200": {
            "description": "Array of user objects",
            "schema": {
              "type": "array",
              "items": { "$ref": "#/definitions/User" }
            }
          },
          "500": { "description": "Server error" }
        }
      },
      "post": {
        "tags": ["Users"],
        "summary": "Create new user",
        "description": "Create a new user with all required fields and validation",
        "parameters": [{
          "in": "body",
          "name": "body",
          "description": "User object",
          "required": true,
          "schema": { "$ref": "#/definitions/User" }
        }],
        "responses": {
          "201": {
            "description": "User created successfully",
            "schema": { "$ref": "#/definitions/User" }
          },
          "400": { "description": "Invalid input data, missing required fields, or email already exists" },
          "500": { "description": "Server error" }
        }
      }
    },
    "/users/{id}": {
      "get": {
        "tags": ["Users"],
        "summary": "Get user by ID",
        "description": "Retrieve a specific user by their ID",
        "parameters": [{
          "name": "id",
          "in": "path",
          "description": "User ID",
          "required": true,
          "type": "string"
        }],
        "responses": {
          "200": {
            "description": "User found",
            "schema": { "$ref": "#/definitions/User" }
          },
          "404": { "description": "User not found" },
          "500": { "description": "Server error" }
        }
      },
      "put": {
        "tags": ["Users"],
        "summary": "Update user by ID",
        "description": "Update an existing user with validation",
        "parameters": [{
          "name": "id",
          "in": "path",
          "description": "User ID",
          "required": true,
          "type": "string"
        }, {
          "in": "body",
          "name": "body",
          "description": "Updated user object",
          "required": true,
          "schema": { "$ref": "#/definitions/User" }
        }],
        "responses": {
          "200": {
            "description": "User updated successfully",
            "schema": { "$ref": "#/definitions/User" }
          },
          "400": { "description": "Invalid input data, missing required fields, or email already exists" },
          "404": { "description": "User not found" },
          "500": { "description": "Server error" }
        }
      },
      "delete": {
        "tags": ["Users"],
        "summary": "Delete user by ID",
        "description": "Delete a user from the database",
        "parameters": [{
          "name": "id",
          "in": "path",
          "description": "User ID",
          "required": true,
          "type": "string"
        }],
        "responses": {
          "200": { "description": "User deleted successfully" },
          "404": { "description": "User not found" },
          "500": { "description": "Server error" }
        }
      }
    }
  }
};

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ Error connecting to MongoDB:", err));

// Middleware
app.use(express.json());

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Use Routes - Both Collections
app.use('/data', require('./routes/data'));
app.use('/users', require('./routes/users'));

// Root Route
app.get('/', (req, res) => {
  res.send('CSE341 W03 CRUD API - Complete with Data and Users collections. Visit /api-docs for documentation');
});

// Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
  console.log(`🔗 Data endpoints: /data`);
  console.log(`👥 Users endpoints: /users`);
});
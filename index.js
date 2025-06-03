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
    "title": "CSE341 W03 CRUD Operations API",
    "description": "API for CRUD operations - Part 1 (GET and POST endpoints)",
    "version": "1.0.0"
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

// Use Data Routes
app.use('/data', require('./routes/data'));

// Root Route
app.get('/', (req, res) => {
  res.send('CSE341 W03 CRUD API - Visit /api-docs for documentation');
});

// Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
});
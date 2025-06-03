const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'CSE341 W03 CRUD Operations API',
    description: 'API for CRUD operations - Part 1 (GET and POST endpoints)',
    version: '1.0.0',
  },
  // UPDATE: Change this to your actual Render URL when deploying to production
  host: 'cse341-proyecto-w03.onrender.com',
  schemes: ['http', 'https'],
  definitions: {
    Data: {
      title: 'Sample Product Title',
      description: 'Sample description of the product or service',
      category: 'Technology',
      price: 99.99,
      isActive: true,
      tags: ['sample', 'example', 'test'],
      createdDate: '2024-03-01T00:00:00.000Z',
      lastModified: '2024-03-01T00:00:00.000Z',
      metadata: {
        author: 'John Doe',
        version: '1.0'
      }
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./index.js'];

// Generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./index.js'); // Your project's root file
});
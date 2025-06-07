// debug.js - Script para diagnosticar problemas de la API
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

// Import models
const Data = require('./models/data');
const User = require('./models/user');

const API_BASE_URL = 'http://localhost:3000';

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

const log = (color, message) => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

// Test database connection
const testDatabaseConnection = async () => {
  try {
    log('blue', '\n🔗 TESTING DATABASE CONNECTION...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    log('green', '✅ Database connection successful');
    
    const dbName = mongoose.connection.db.databaseName;
    log('cyan', `📊 Connected to database: ${dbName}`);
    
    return true;
  } catch (error) {
    log('red', `❌ Database connection failed: ${error.message}`);
    return false;
  }
};

// Test collections and data
const testCollections = async () => {
  try {
    log('blue', '\n📁 TESTING COLLECTIONS...');
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    log('cyan', `Found ${collections.length} collections:`);
    collections.forEach(col => log('cyan', `   - ${col.name}`));
    
    // Count documents
    const dataCount = await Data.countDocuments();
    const userCount = await User.countDocuments();
    
    log('cyan', `📋 Data collection: ${dataCount} documents`);
    log('cyan', `👥 Users collection: ${userCount} documents`);
    
    // Test data retrieval
    if (dataCount > 0) {
      const firstData = await Data.findOne();
      log('green', `✅ Successfully retrieved data document: ${firstData.title}`);
    } else {
      log('yellow', '⚠️ No data documents found');
    }
    
    if (userCount > 0) {
      const firstUser = await User.findOne();
      log('green', `✅ Successfully retrieved user document: ${firstUser.firstName} ${firstUser.lastName}`);
    } else {
      log('yellow', '⚠️ No user documents found');
    }
    
    return { dataCount, userCount };
  } catch (error) {
    log('red', `❌ Error testing collections: ${error.message}`);
    return { dataCount: 0, userCount: 0 };
  }
};

// Test API endpoints
const testAPIEndpoints = async () => {
  log('blue', '\n🌐 TESTING API ENDPOINTS...');
  
  const endpoints = [
    { method: 'GET', url: `${API_BASE_URL}/`, name: 'Root endpoint' },
    { method: 'GET', url: `${API_BASE_URL}/health`, name: 'Health check' },
    { method: 'GET', url: `${API_BASE_URL}/data`, name: 'Get all data' },
    { method: 'GET', url: `${API_BASE_URL}/users`, name: 'Get all users' }
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await axios({
        method: endpoint.method,
        url: endpoint.url,
        timeout: 5000
      });
      
      log('green', `✅ ${endpoint.name}: ${response.status}`);
      
      if (endpoint.url.includes('/data') || endpoint.url.includes('/users')) {
        const data = response.data;
        if (Array.isArray(data)) {
          log('cyan', `   Response: Array with ${data.length} items`);
          if (data.length > 0) {
            const firstItem = data[0];
            if (firstItem._id) {
              log('cyan', `   First item ID: ${firstItem._id}`);
            }
          }
        } else {
          log('cyan', `   Response type: ${typeof data}`);
        }
      }
      
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        log('red', `❌ ${endpoint.name}: Server not running`);
      } else {
        log('red', `❌ ${endpoint.name}: ${error.response?.status || error.message}`);
      }
    }
  }
};

// Test POST endpoint
const testPOSTEndpoint = async () => {
  log('blue', '\n📝 TESTING POST ENDPOINTS...');
  
  // Test creating new data
  const testData = {
    title: "Debug Test Product",
    description: "Test product created by debug script",
    category: "Testing",
    price: 99.99,
    isActive: true,
    tags: ["debug", "test"],
    metadata: {
      author: "Debug Script",
      version: "1.0"
    }
  };
  
  try {
    const response = await axios.post(`${API_BASE_URL}/data`, testData);
    log('green', `✅ POST /data: ${response.status} - Created with ID: ${response.data._id}`);
    
    // Clean up - delete the test data
    try {
      await axios.delete(`${API_BASE_URL}/data/${response.data._id}`);
      log('cyan', '   🗑️ Test data cleaned up');
    } catch (deleteError) {
      log('yellow', '   ⚠️ Could not clean up test data');
    }
    
  } catch (error) {
    log('red', `❌ POST /data: ${error.response?.status || error.message}`);
    if (error.response?.data) {
      log('red', `   Error details: ${JSON.stringify(error.response.data)}`);
    }
  }
};

// Test environment variables
const testEnvironment = () => {
  log('blue', '\n🔧 TESTING ENVIRONMENT...');
  
  const requiredVars = ['MONGODB_URI', 'PORT'];
  
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      if (varName === 'MONGODB_URI') {
        // Hide password in output
        const uri = process.env[varName].replace(/:([^:@]+)@/, ':****@');
        log('green', `✅ ${varName}: ${uri}`);
      } else {
        log('green', `✅ ${varName}: ${process.env[varName]}`);
      }
    } else {
      log('red', `❌ ${varName}: Not set`);
    }
  });
};

// Main debug function
const runDiagnostics = async () => {
  log('magenta', '🚀 API DIAGNOSTICS STARTING...');
  log('magenta', '================================');
  
  // Test environment
  testEnvironment();
  
  // Test database
  const dbConnected = await testDatabaseConnection();
  
  if (dbConnected) {
    const { dataCount, userCount } = await testCollections();
    
    // If no data, suggest running seeder
    if (dataCount === 0 && userCount === 0) {
      log('yellow', '\n⚠️ SUGGESTION: Database is empty!');
      log('yellow', '💡 Run the seeder to populate with sample data:');
      log('cyan', '   node seeder.js');
    }
  }
  
  // Test API endpoints
  await testAPIEndpoints();
  
  // Test POST endpoint
  await testPOSTEndpoint();
  
  log('magenta', '\n✅ DIAGNOSTICS COMPLETED');
  log('cyan', '📚 If APIs are working, visit: http://localhost:3000/api-docs');
  
  // Close database connection
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    log('cyan', '🔌 Database connection closed');
  }
};

// Run diagnostics
if (require.main === module) {
  runDiagnostics().catch(error => {
    log('red', `💥 Fatal error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { runDiagnostics };
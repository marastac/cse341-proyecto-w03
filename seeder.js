// seeder.js - Script para poblar la base de datos
const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Data = require('./models/data');
const User = require('./models/user');

// Sample data for Data collection
const sampleData = [
  {
    title: "Complete API Test Product",
    description: "This product demonstrates full CRUD operations",
    category: "Technology",
    price: 199.99,
    isActive: true,
    tags: ["complete", "crud", "test"],
    createdDate: new Date(),
    lastModified: new Date(),
    metadata: {
      author: "Mario",
      version: "1.0"
    }
  },
  {
    title: "Sample Web Application",
    description: "A comprehensive web application for testing purposes",
    category: "Software",
    price: 299.99,
    isActive: true,
    tags: ["web", "application", "demo"],
    createdDate: new Date(),
    lastModified: new Date(),
    metadata: {
      author: "Jane Smith",
      version: "2.0"
    }
  },
  {
    title: "Mobile App Development Kit",
    description: "Complete toolkit for mobile application development",
    category: "Development",
    price: 149.99,
    isActive: true,
    tags: ["mobile", "development", "toolkit"],
    createdDate: new Date(),
    lastModified: new Date(),
    metadata: {
      author: "John Developer",
      version: "1.5"
    }
  }
];

// Sample data for Users collection
const sampleUsers = [
  {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1-555-123-4567",
    role: "Software Engineer",
    department: "Engineering",
    isActive: true,
    hireDate: new Date(),
    metadata: {
      createdBy: "Admin",
      lastModified: new Date()
    }
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "+1-555-987-6543",
    role: "Product Manager",
    department: "Product",
    isActive: true,
    hireDate: new Date(),
    metadata: {
      createdBy: "HR",
      lastModified: new Date()
    }
  },
  {
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob.johnson@example.com",
    phone: "+1-555-456-7890",
    role: "Designer",
    department: "Design",
    isActive: true,
    hireDate: new Date(),
    metadata: {
      createdBy: "Admin",
      lastModified: new Date()
    }
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB for seeding");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

// Diagnostic function to check database status
const checkDatabase = async () => {
  try {
    console.log("\n🔍 CHECKING DATABASE STATUS...");
    
    // Check connection
    const dbState = mongoose.connection.readyState;
    console.log(`📡 Connection State: ${dbState === 1 ? 'Connected' : 'Not Connected'}`);
    
    // Get database name
    const dbName = mongoose.connection.db.databaseName;
    console.log(`📊 Database Name: ${dbName}`);
    
    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📁 Collections found: ${collections.length}`);
    collections.forEach(col => console.log(`   - ${col.name}`));
    
    // Count documents in each collection
    const dataCount = await Data.countDocuments();
    const userCount = await User.countDocuments();
    
    console.log(`📋 Data collection: ${dataCount} documents`);
    console.log(`👥 Users collection: ${userCount} documents`);
    
    return { dataCount, userCount };
  } catch (error) {
    console.error("❌ Error checking database:", error);
    return { dataCount: 0, userCount: 0 };
  }
};

// Seed function
const seedDatabase = async () => {
  try {
    console.log("\n🌱 SEEDING DATABASE...");
    
    // Clear existing data (optional)
    console.log("🗑️ Clearing existing data...");
    await Data.deleteMany({});
    await User.deleteMany({});
    
    // Insert sample data
    console.log("📋 Inserting sample data...");
    const insertedData = await Data.insertMany(sampleData);
    console.log(`✅ Inserted ${insertedData.length} data documents`);
    
    console.log("👥 Inserting sample users...");
    const insertedUsers = await User.insertMany(sampleUsers);
    console.log(`✅ Inserted ${insertedUsers.length} user documents`);
    
    console.log("\n🎉 Database seeded successfully!");
    
    // Show inserted data IDs
    console.log("\n📋 Data IDs:");
    insertedData.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item._id} - ${item.title}`);
    });
    
    console.log("\n👥 User IDs:");
    insertedUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user._id} - ${user.firstName} ${user.lastName}`);
    });
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
};

// Test API endpoints function
const testEndpoints = async () => {
  try {
    console.log("\n🧪 TESTING DATA RETRIEVAL...");
    
    // Test Data collection
    const allData = await Data.find();
    console.log(`📋 Data.find() returned: ${allData.length} documents`);
    
    if (allData.length > 0) {
      console.log("📋 First data document:");
      console.log(`   ID: ${allData[0]._id}`);
      console.log(`   Title: ${allData[0].title}`);
      console.log(`   Category: ${allData[0].category}`);
    }
    
    // Test Users collection
    const allUsers = await User.find();
    console.log(`👥 User.find() returned: ${allUsers.length} documents`);
    
    if (allUsers.length > 0) {
      console.log("👥 First user document:");
      console.log(`   ID: ${allUsers[0]._id}`);
      console.log(`   Name: ${allUsers[0].firstName} ${allUsers[0].lastName}`);
      console.log(`   Email: ${allUsers[0].email}`);
    }
    
  } catch (error) {
    console.error("❌ Error testing endpoints:", error);
  }
};

// Main execution function
const main = async () => {
  console.log("🚀 DATABASE SEEDER STARTING...");
  console.log("================================");
  
  await connectDB();
  
  // Check current database status
  const { dataCount, userCount } = await checkDatabase();
  
  // Ask if user wants to seed
  if (dataCount === 0 && userCount === 0) {
    console.log("\n❗ Database is empty. Seeding with sample data...");
    await seedDatabase();
  } else {
    console.log(`\n❓ Database already has data (${dataCount} data, ${userCount} users).`);
    console.log("❓ Do you want to reseed? (This will clear existing data)");
    console.log("❓ To reseed, run: node seeder.js --force");
    
    // Check if force flag is provided
    if (process.argv.includes('--force')) {
      console.log("🔄 Force flag detected. Reseeding...");
      await seedDatabase();
    }
  }
  
  // Test data retrieval
  await testEndpoints();
  
  console.log("\n✅ Seeder completed. You can now test your API endpoints.");
  console.log("🌐 API Documentation: http://localhost:3000/api-docs");
  
  // Close connection
  await mongoose.connection.close();
  console.log("🔌 Database connection closed.");
};

// Run the seeder
if (require.main === module) {
  main().catch(error => {
    console.error("💥 Fatal error:", error);
    process.exit(1);
  });
}

module.exports = { connectDB, checkDatabase, seedDatabase };
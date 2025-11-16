import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Test setup file
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-testing-only';
process.env.JWT_EXPIRE = process.env.JWT_EXPIRE || '1h';

// Use a test database on MongoDB Atlas or local MongoDB
// You can create a separate test database on Atlas
const testDbUri = process.env.MONGODB_TEST_URI || process.env.MONGODB_URI;

let isConnected = false;

// Setup database connection before all tests
beforeAll(async () => {
  if (!isConnected) {
    await mongoose.connect(testDbUri);
    isConnected = true;
  }
}, 30000);

// Disconnect after all tests
afterAll(async () => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
  }
}, 30000);

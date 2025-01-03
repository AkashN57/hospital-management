import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import connectDB from '../../config/mongodb.js';

describe('MongoDB Connection', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test('should connect to MongoDB successfully', async () => {
    await connectDB();
    expect(mongoose.connection.readyState).toBe(1);
  });

  test('should handle connection errors', async () => {
    // Temporarily store the original URI
    const originalUri = process.env.MONGODB_URI;
    
    // Set invalid URI
    process.env.MONGODB_URI = 'mongodb://invalid:27017/test';
    
    // Test that it throws an error
    await expect(connectDB()).rejects.toThrow();
    
    // Restore the original URI
    process.env.MONGODB_URI = originalUri;
  });
});
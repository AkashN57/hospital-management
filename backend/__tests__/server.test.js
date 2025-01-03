import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';

describe('Server Test', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('GET / should return API Working', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('API Working');
  });

  test('should handle 404 for non-existent routes', async () => {
    const response = await request(app).get('/non-existent-route');
    expect(response.status).toBe(404);
  });
});
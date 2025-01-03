import request from 'supertest';
import express from 'express';
import adminRouter from '../../routes/adminRoute.js';

const app = express();
app.use(express.json());
app.use('/api/admin', adminRouter);

describe('Admin Routes', () => {
  test('should authenticate admin login', async () => {
    const credentials = {
      email: 'admin@test.com',
      password: 'admin123'
    };

    const response = await request(app)
      .post('/api/admin/login')
      .send(credentials);

    expect(response.status).toBe(200);
  });

  // Add more admin route tests
});
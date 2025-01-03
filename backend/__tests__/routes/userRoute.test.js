import request from 'supertest';
import express from 'express';
import userRouter from '../../routes/userRoute.js';

const app = express();
app.use(express.json());
app.use('/api/user', userRouter);

describe('User Routes', () => {
  test('should register a new user', async () => {
    const newUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/user/register')
      .send(newUser);

    expect(response.status).toBe(200);
  });

  // Add more user route tests
});
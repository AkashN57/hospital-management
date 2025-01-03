import request from 'supertest';
import express from 'express';
import auth from '../../middleware/auth.js';

const app = express();
app.use(auth);

describe('Auth Middleware', () => {
  test('should deny access without token', async () => {
    const response = await request(app)
      .get('/protected-route');
    expect(response.status).toBe(401);
  });

  test('should allow access with valid token', async () => {
    const token = 'valid-test-token';
    const response = await request(app)
      .get('/protected-route')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
});
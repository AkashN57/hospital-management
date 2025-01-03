import request from 'supertest';
import express from 'express';
import doctorRouter from '../../routes/doctorRoute.js';

const app = express();
app.use(express.json());
app.use('/api/doctor', doctorRouter);

describe('Doctor Routes', () => {
  test('should get all doctors', async () => {
    const response = await request(app)
      .get('/api/doctor/list');
    expect(response.status).toBe(200);
  });

  // Add more doctor route tests
});

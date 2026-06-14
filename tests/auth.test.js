/* eslint-env jest */
require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../src/app');
const connectDB = require('../src/config/db');

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Auth', () => {
  test('debe registrar un usuario paciente', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Paciente Test',
        email: 'paciente@test.com',
        password: '123456',
        role: 'paciente',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe('paciente@test.com');
    expect(response.body.data.user.password).toBeUndefined();
  });

test('debe iniciar sesión y devolver cookie con token', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'paciente@test.com',
      password: '123456',
    });

  expect(response.statusCode).toBe(200);
  expect(response.body.success).toBe(true);
  expect(response.headers['set-cookie']).toBeDefined();
});
});

test('debe devolver el usuario autenticado con cookie', async () => {
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'paciente@test.com',
      password: '123456',
    });

  const cookie = loginResponse.headers['set-cookie'];

  const response = await request(app)
    .get('/api/auth/me')
    .set('Cookie', cookie);

  expect(response.statusCode).toBe(200);
  expect(response.body.success).toBe(true);
  expect(response.body.data.user.role).toBe('paciente');
});
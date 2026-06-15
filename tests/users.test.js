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

describe('Users', () => {
  let adminCookie;
  let patientCookie;
  let patientId;

  test('debe preparar usuarios admin y paciente', async () => {
    const adminResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin Users',
        email: 'admin.users@test.com',
        password: '123456',
        role: 'admin',
      });

    adminCookie = adminResponse.headers['set-cookie'];

    const patientResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Paciente Users',
        email: 'paciente.users@test.com',
        password: '123456',
        role: 'paciente',
      });

    patientCookie = patientResponse.headers['set-cookie'];
    patientId = patientResponse.body.data.user.id;

    expect(adminCookie).toBeDefined();
    expect(patientCookie).toBeDefined();
    expect(patientId).toBeDefined();
  });

  test('admin debe poder listar usuarios', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Cookie', adminCookie);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test('paciente no debe poder listar usuarios', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Cookie', patientCookie);

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });

  test('admin debe poder actualizar un usuario', async () => {
    const response = await request(app)
      .put(`/api/users/${patientId}`)
      .set('Cookie', adminCookie)
      .send({
        name: 'Paciente Actualizado',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe('Paciente Actualizado');
  });
});
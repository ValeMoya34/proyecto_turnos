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

describe('Professionals', () => {
  let adminCookie;

  test('debe registrar un usuario admin', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin Test',
        email: 'admin@test.com',
        password: '123456',
        role: 'admin',
      });

    expect(response.statusCode).toBe(201);
    adminCookie = response.headers['set-cookie'];
    expect(adminCookie).toBeDefined();
  });

  test('admin debe crear un profesional', async () => {
    const response = await request(app)
      .post('/api/professionals')
      .set('Cookie', adminCookie)
      .send({
        name: 'Dra. Test',
        specialty: 'Cardiologia',
        email: 'dra.test@test.com',
        phone: '1122334455',
        availableDays: ['lunes', 'miercoles'],
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe('dra.test@test.com');
  });

  test('debe listar profesionales si el usuario está autenticado', async () => {
    const response = await request(app)
      .get('/api/professionals')
      .set('Cookie', adminCookie);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});

test('paciente no debe poder crear un profesional', async () => {
  const patientResponse = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Paciente Sin Permiso',
      email: 'paciente.sinpermiso@test.com',
      password: '123456',
      role: 'paciente',
    });

  const patientCookie = patientResponse.headers['set-cookie'];

  const response = await request(app)
    .post('/api/professionals')
    .set('Cookie', patientCookie)
    .send({
      name: 'Dr. No Permitido',
      specialty: 'Pediatria',
      email: 'no.permitido@test.com',
      phone: '1122334455',
      availableDays: ['lunes'],
    });

  expect(response.statusCode).toBe(403);
  expect(response.body.success).toBe(false);
});
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

describe('Appointments', () => {
  let adminCookie;
  let patientCookie;
  let professionalId;

  test('debe preparar usuarios y profesional', async () => {
    const adminResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin Turnos',
        email: 'admin.turnos@test.com',
        password: '123456',
        role: 'admin',
      });

    adminCookie = adminResponse.headers['set-cookie'];

    const patientResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Paciente Turnos',
        email: 'paciente.turnos@test.com',
        password: '123456',
        role: 'paciente',
      });

    patientCookie = patientResponse.headers['set-cookie'];

    const professionalResponse = await request(app)
      .post('/api/professionals')
      .set('Cookie', adminCookie)
      .send({
        name: 'Dra. Agenda',
        specialty: 'Clinica',
        email: 'agenda@test.com',
        phone: '1122334455',
        availableDays: ['lunes', 'miercoles'],
      });

    professionalId = professionalResponse.body.data._id;

    expect(adminCookie).toBeDefined();
    expect(patientCookie).toBeDefined();
    expect(professionalId).toBeDefined();
  });

  test('paciente debe crear un turno', async () => {
    const response = await request(app)
      .post('/api/appointments')
      .set('Cookie', patientCookie)
      .send({
        professionalId,
        date: '2026-08-20',
        time: '10:00',
        notes: 'Consulta test',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('pendiente');
  });

  test('debe rechazar turno duplicado para mismo profesional, fecha y hora', async () => {
    const response = await request(app)
      .post('/api/appointments')
      .set('Cookie', patientCookie)
      .send({
        professionalId,
        date: '2026-08-20',
        time: '10:00',
        notes: 'Turno duplicado',
      });

    expect(response.statusCode).toBe(409);
  });

  test('paciente debe ver sus turnos', async () => {
    const response = await request(app)
      .get('/api/appointments/me')
      .set('Cookie', patientCookie);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });
});


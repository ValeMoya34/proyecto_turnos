/* eslint-env jest */
require('dotenv').config();
const { hashPassword, comparePassword } = require('../src/utils/hash.util');
const { signToken, verifyToken } = require('../src/utils/jwt.util');

describe('Utils - pruebas unitarias', () => {
  test('hashPassword debe devolver una contraseña hasheada', async () => {
    const password = '123456';

    const hashedPassword = await hashPassword(password);

    expect(hashedPassword).toBeDefined();
    expect(hashedPassword).not.toBe(password);
  });

  test('comparePassword debe devolver true si la contraseña es correcta', async () => {
    const password = '123456';
    const hashedPassword = await hashPassword(password);

    const result = await comparePassword(password, hashedPassword);

    expect(result).toBe(true);
  });

  test('comparePassword debe devolver false si la contraseña es incorrecta', async () => {
    const password = '123456';
    const hashedPassword = await hashPassword(password);

    const result = await comparePassword('incorrecta', hashedPassword);

    expect(result).toBe(false);
  });

  test('signToken y verifyToken deben generar y verificar un JWT', () => {
    const user = {
      _id: '123456789',
      role: 'paciente',
    };

    const token = signToken(user);
    const decoded = verifyToken(token);

    expect(token).toBeDefined();
    expect(decoded.id).toBe(user._id);
    expect(decoded.role).toBe(user.role);
  });
});
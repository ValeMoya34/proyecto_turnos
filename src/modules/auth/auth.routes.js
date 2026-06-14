const express = require('express');
const { body} = require('express-validator');
const validate = require('../../middlewares/validate.middleware');
const { register, login, logout, me } = require('./auth.controller');
const authenticate = require('../../middlewares/auth.middleware');

const router = express.Router();

// Ruta para registrar un usuario nuevo.
// POST /api/auth/register
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('El email no es válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('role').optional().isIn(['admin', 'paciente']).withMessage('El rol debe ser admin o paciente'),
  ],
  validate,
  register
);

// Ruta para iniciar sesión.
// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('El email no es válido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  ],
  validate,
  login
);

// Ruta para obtener el usuario autenticado.
// GET /api/auth/me
router.get('/me', authenticate, me);

// Ruta para cerrar sesión.
// POST /api/auth/logout
router.post('/logout', logout);

module.exports = router;
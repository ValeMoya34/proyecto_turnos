const express = require('express');
const { body } = require('express-validator');
const {getAll,getById,update,remove,} = require('./user.controller');
const authenticate = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const validate = require('../../middlewares/validate.middleware');

const router = express.Router();

// Todas estas rutas son solo para admin.

// Listar usuarios.
router.get('/', authenticate, authorize('admin'), getAll);

// Obtener usuario por ID.
router.get('/:id', authenticate, authorize('admin'), getById);

// Actualizar usuario.
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  [
    body('name').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
    body('email').optional().isEmail().withMessage('El email no es válido'),
    body('role').optional().isIn(['admin', 'paciente']).withMessage('El rol debe ser admin o paciente'),
  ],
  validate,
  update
);

// Eliminar usuario.
router.delete('/:id', authenticate, authorize('admin'), remove);

module.exports = router;
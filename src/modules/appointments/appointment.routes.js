const express = require('express');
const { body } = require('express-validator');
const {create,getMine,getAll,getById,updateStatus,cancel,remove,} = require('./appointment.controller');
const authenticate = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const validate = require('../../middlewares/validate.middleware');

const router = express.Router();

// Crear turno.
// Paciente y admin pueden crear turnos.
router.post(
  '/',
  authenticate,
  authorize('paciente', 'admin'),
  [
    body('professionalId').notEmpty().withMessage('El profesional es obligatorio'),
    body('date').isISO8601().withMessage('La fecha debe tener un formato válido'),
    body('time').matches(/^\d{2}:\d{2}$/).withMessage('La hora debe tener formato HH:mm'),
  ],
  validate,
  create
);

// Ver mis turnos.
// Solo paciente.
router.get('/me', authenticate, authorize('paciente'), getMine);

// Ver todos los turnos.
// Solo admin.
router.get('/', authenticate, authorize('admin'), getAll);

// Ver un turno por ID.
// Solo admin.
router.get('/:id', authenticate, authorize('admin'), getById);

// Cambiar estado de un turno.
// Solo admin.
router.patch(
  '/:id/status',
  authenticate,
  authorize('admin'),
  [body('status').isIn(['pendiente', 'confirmado', 'cancelado']).withMessage('El estado debe ser pendiente, confirmado o cancelado'),],
  validate,
  updateStatus
);

// Cancelar mi turno.
// Solo paciente.
router.patch('/:id/cancel', authenticate, authorize('paciente'), cancel);

// Eliminar turno.
// Solo admin.
router.delete('/:id', authenticate, authorize('admin'), remove);

module.exports = router;
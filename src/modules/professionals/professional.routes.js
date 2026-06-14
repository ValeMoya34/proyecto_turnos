const express = require('express');
const { body } = require('express-validator');
const {create,getAll,getById,update,remove,} = require('./professional.controller');
const authenticate = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const validate = require('../../middlewares/validate.middleware');

const router = express.Router();

// Permite filtrar por especialidad.
router.get('/',authenticate,getAll);
// Obtiene un profesional por ID.
router.get('/:id',authenticate,getById);
//Crea un profesional nuevo.
// Solo un admin puede cargar médicos/profesionales.
router.post('/',
    authenticate,
    authorize('admin'),
    [
        body('name').notEmpty().withMessage('El nombre es obligatorio'),
        body('specialty').notEmpty().withMessage('La especialidad es obligatoria'),
        body('email').notEmpty().withMessage('El email no es valido'),
        body('availableDays').notEmpty().isArray().withMessage('Los dias disponibles deben enviarse en un array'),
    ],
    validate,
    create
);

// Actualiza un profesional.
// Solo admin puede modificar profesionales.
router.put('/:id',
    authenticate,
    authorize('admin'),
    [
        body('email').optional().isEmail().withMessage('El email no es valido'),
        body('name').optional().notEmpty().withMessage('El nombre no puede estar vacio'),
        body('specialty').optional().notEmpty().withMessage('La especialidad no puede estar vacia'),
    ],
    validate,
    update
);

// Elimina un profesional.
// Solo admin puede eliminar profesionales.
router.delete('/:id', authenticate, authorize('admin'), remove);

module.exports = router;


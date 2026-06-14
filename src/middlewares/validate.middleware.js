const { validationResult } = require('express-validator');

// Revisa si express-validator encontró errores en la petición.
const validate = (req, res, next) => {
  const errors = validationResult(req);

  // Si no hay errores, dejamos que la petición siga al controlador.
  if (errors.isEmpty()) {
    return next();
  }

  // Si hay errores, respondemos con status 400 y una lista simple de problemas.
  return res.status(400).json({
    success: false,
    message: 'Error de validación',
    errors: errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    })),
  });
};

module.exports = validate;



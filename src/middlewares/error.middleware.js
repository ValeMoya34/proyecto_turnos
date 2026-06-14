// Middleware centralizado para manejar errores de la API.
const errorHandler = (error, req, res, next) => {
  // Si el error trae un statusCode propio, lo usamos.
  // Si no, asumimos error interno del servidor.
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || 'Error interno del servidor',
  });
};

module.exports = errorHandler;
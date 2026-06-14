// Middleware que permite entrar solo a usuarios con ciertos roles.
const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user viene del middleware authenticate.
    // Ahí guardamos el id y el role que venían dentro del JWT.
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para realizar esta acción.',
      });
    }

    next();
  };
};

module.exports = authorize;
const { verifyToken } = require('../utils/jwt.util');

const authenticate = (req, res, next) => {

  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token requerido. Debes iniciar sesión.',
    });
  }

  try {
    const decoded = verifyToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    

    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado.',
    });
  }
};

module.exports = authenticate;
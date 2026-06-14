const { registerUser, loginUser } = require('./auth.service');

// Opciones de configuración para la cookie donde guardaremos el JWT.
const cookieOptions = {
  httpOnly: true, // Evita que JavaScript del navegador pueda leer la cookie.
  secure: process.env.NODE_ENV === 'production', // En producción debería viajar solo por HTTPS.
  sameSite: 'lax', // Ayuda a reducir ataques CSRF en usos comunes.
  maxAge: 7 * 24 * 60 * 60 * 1000, // Duración de la cookie: 7 días.
};

// Controlador para registrar usuarios.
const register = async (req, res, next) => {
  try {

    // Le pasamos al service los datos que llegaron en el body.
    const { token, user } = await registerUser(req.body);

    // Guardamos el JWT en una cookie segura para autenticación.
    res.cookie('token', token, cookieOptions);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Controlador para iniciar sesión.
const login = async (req, res, next) => {
  try {
    // Tomamos email y password del body de la petición.
    const { email, password } = req.body;

     const { token, user } = await loginUser(email, password);

    // Si el login es correcto, guardamos el JWT en la cookie.
    res.cookie('token', token, cookieOptions);


    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Controlador para cerrar sesión.
const logout = (req, res) => {
  // Elimina la cookie que contiene el token.
  res.clearCookie('token');

  res.json({
    success: true,
    message: 'Sesión cerrada correctamente',
  });
};

// Controlador para obtener el usuario autenticado.
const me = (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user,
    },
  });
}; 

module.exports = {
  register,
  login,
  logout,
  me
};
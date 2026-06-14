const User = require('./user.model');

// Lista todos los usuarios sin mostrar contraseñas.
const getUsers = async () => {
  return User.find().select('-password');
};

// Busca un usuario por ID sin mostrar contraseña.
const getUserById = async (id) => {
  const user = await User.findById(id).select('-password');

  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

// Actualiza datos básicos de un usuario.
const updateUser = async (id, data) => {
  const user = await User.findByIdAndUpdate(
    id,
    {
      name: data.name,
      email: data.email,
      role: data.role,
    },
    {
      returnDocument: 'after',
      runValidators: true,
    }
  ).select('-password');

  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

// Elimina un usuario por ID.
const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id).select('-password');

  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
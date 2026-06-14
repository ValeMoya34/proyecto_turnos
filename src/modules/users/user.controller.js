const { getUsers,getUserById, updateUser,deleteUser,} = require('./user.service');

// Lista todos los usuarios. Solo admin.
const getAll = async (req, res, next) => {
  try {
    const users = await getUsers();

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// Obtiene un usuario por ID. Solo admin.
const getById = async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Actualiza un usuario. Solo admin.
const update = async (req, res, next) => {
  try {
    const user = await updateUser(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Usuario actualizado correctamente',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Elimina un usuario. Solo admin.
const remove = async (req, res, next) => {
  try {
    await deleteUser(req.params.id);

    res.json({
      success: true,
      message: 'Usuario eliminado correctamente',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  update,
  remove,
};
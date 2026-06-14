const bcrypt = require('bcryptjs');

// Cantidad de rondas de seguridad para generar el hash.
const SALT_ROUNDS = 10;

// Recibe una contraseña normal y devuelve la contraseña hasheada.
const hashPassword = async (password) => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

// Compara una contraseña normal con una contraseña hasheada.
// Devuelve true si coinciden, false si no coinciden.
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = {hashPassword, comparePassword};
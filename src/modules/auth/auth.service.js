const User = require('../users/user.model');
const { hashPassword, comparePassword } = require('../../utils/hash.util');
const { signToken } = require('../../utils/jwt.util');


// Registra un usuario nuevo en la base de datos.
const registerUser = async (data) => {
    // Verificamos si ya existe un usuario con ese email.
    const existingUser = await User.findOne({email: data.email});

    if (existingUser){
        const error = new Error ('El mail ya se encuentra registrado');
        error.statusCode = 409;
        throw error;
    }

    // Hasheamos la contraseña antes de guardarla.
    const hashedPassword = await hashPassword(data.password);

    // Creamos el usuario con la contraseña protegida.
    const user = await User.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
    });
    
    // Generamos el token usando id y role del usuario.
const token = signToken(user);

return {
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
};
};

// Inicia sesión con email y contraseña.
const loginUser = async (email,password)=> {
    // Buscamos el usuario por email.
    const user = await User.findOne({email});

    if(!user){
        const error = new Error('Credenciales invalidas');
        error.statusCode = 401;
        throw error;
    }

    // Comparamos la contraseña escrita con el hash guardado.
    const isPasswordValid = await comparePassword(password, user.password);

    if(!isPasswordValid){
        const error = new Error('Credenciales invalidas');
        error.statusCode = 401;
        throw error;
    }

    // Si todo está bien, generamos un token.
    const token = signToken(user);
    return{
        token,
        user:{
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    },
};
};

module.exports ={
    registerUser,
    loginUser,
};
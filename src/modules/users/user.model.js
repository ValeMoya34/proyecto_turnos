const mongoose = require('mongoose');

// Definimos la estructura que tendrá cada usuario en MongoDB.
const userSchema = new mongoose.Schema(
    {
        // Nombre del usuario. Es obligatorio y se limpian espacios al inicio/final.
        name:{type:String,required:true,trim:true,},
        // Email único para identificar al usuario al iniciar sesión.
        email:{type:String,required:true,unique:true,lowercase:true,trim:true,},
        // Contraseña hasheada.
        password:{type:String,required:true,},
        // Rol del usuario. Define qué permisos tendrá dentro del sistema.
        role:{type:String,enum:['admin','paciente'],default:'paciente',},
    },
    {
    // Agrega automáticamente createdAt y updatedAt.
    timestaps: true,
    }
);
// Creamos el modelo User a partir del schema.
const User = mongoose.model('User', userSchema);
module.exports = User;
const mongoose = require('mongoose');

// Definimos cómo se guardará un profesional médico en MongoDB.
const professionalSchema = new mongoose.Schema({
    name:{type:String,required:true,trim:true,},
    // Especialidad médica
    specialty:{type:String,required:true,trim:true,},
    // Email de contacto. Lo hacemos único para evitar duplicados.
    email:{type:String,required:true,unique:true,lowercase:true,trim:true,},
    // Teléfono opcional del profesional.
    phone: { type: String },
    // Días en los que atiende.
    availableDays: [{ type: String, enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sábado']}],

},
// Agrega createdAt y updatedAt automáticamente.
{timestamps:true}
);
// Creo el modelo Professional para interactuar con la colección en MongoDB.
const Professional = mongoose.model('Professional',professionalSchema)
module.exports= Professional;
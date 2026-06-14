const mongoose = require('mongoose');
// Definimos cómo se guardará un turno médico en MongoDB.
const appointmentSchema = new mongoose.Schema(
  {
    // Usuario paciente que solicita el turno.
    patient: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true,},
    // Profesional médico con quien se reserva el turno.
    professional: {type: mongoose.Schema.Types.ObjectId,ref: 'Professional',required: true,},
    // Especialidad del turno. La copiamos del profesional para facilitar filtros.
    specialty: {type: String,required: true,},
    // Fecha del turno.
    date: {type: Date,required: true,},
    // Hora del turno. La guardamos como texto en formato HH:mm.
    time: {type: String,required: true,},
    // Estado del turno.
    status: {type: String,enum: ['pendiente', 'confirmado', 'cancelado'],default: 'pendiente',},
    // Notas opcionales del paciente o del admin.
    notes: {type: String,},
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
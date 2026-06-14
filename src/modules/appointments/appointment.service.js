const Appointment = require('./appointment.model');
const Professional = require('../professionals/professional.model');

// Crea un turno para un paciente con un profesional.
const createAppointment = async (data, patientId) => {
  // Buscamos el profesional para verificar que exista.
  const professional = await Professional.findById(data.professionalId);

  if (!professional) {
    const error = new Error('Profesional no encontrado');
    error.statusCode = 404;
    throw error;
  }

  // Verificamos si ya existe un turno para ese profesional en esa fecha y horario.
  const conflict = await Appointment.findOne({
    professional: data.professionalId,
    date: new Date(data.date),
    time: data.time,
    status: { $ne: 'cancelado' },
  });

  if (conflict) {
    const error = new Error('El profesional ya tiene un turno en esa fecha y horario');
    error.statusCode = 409;
    throw error;
  }

  // Creamos el turno vinculado al paciente y al profesional.
  return Appointment.create({
    patient: patientId,
    professional: data.professionalId,
    specialty: professional.specialty,
    date: new Date(data.date),
    time: data.time,
    notes: data.notes,
  });
};

// Devuelve los turnos del paciente autenticado.
const getMyAppointments = async (patientId) => {
  return Appointment.find({ patient: patientId })
    .populate('professional', 'name specialty email phone')
    .sort({ date: 1, time: 1 });
};

// Lista todos los turnos. Permite filtros para admin.
const getAllAppointments = async (filters) => {
  const query = {};

  if (filters.specialty) {
    query.specialty = new RegExp(filters.specialty, 'i');
  }

  if (filters.professional) {
    query.professional = filters.professional;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  return Appointment.find(query)
    .populate('patient', 'name email role')
    .populate('professional', 'name specialty email')
    .sort({ date: 1, time: 1 });
};

// Busca un turno por ID.
const getAppointmentById = async (id) => {
  const appointment = await Appointment.findById(id)
    .populate('patient', 'name email role')
    .populate('professional', 'name specialty email');

  if (!appointment) {
    const error = new Error('Turno no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return appointment;
};

// Cambia el estado de un turno. Lo usa admin.
const updateAppointmentStatus = async (id, status) => {
  const appointment = await Appointment.findByIdAndUpdate(
    id,
    { status },
    {
      returnDocument: 'after',
      runValidators: true,
    }
  );

  if (!appointment) {
    const error = new Error('Turno no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return appointment;
};

// Permite que un paciente cancele únicamente sus propios turnos.
const cancelAppointment = async (id, patientId) => {
  const appointment = await Appointment.findById(id);

  if (!appointment) {
    const error = new Error('Turno no encontrado');
    error.statusCode = 404;
    throw error;
  }

  if (appointment.patient.toString() !== patientId) {
    const error = new Error('No tienes permiso para cancelar este turno');
    error.statusCode = 403;
    throw error;
  }

  appointment.status = 'cancelado';
  return appointment.save();
};

// Elimina un turno. Lo usa admin.
const deleteAppointment = async (id) => {
  const appointment = await Appointment.findByIdAndDelete(id);

  if (!appointment) {
    const error = new Error('Turno no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return appointment;
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  deleteAppointment,
};


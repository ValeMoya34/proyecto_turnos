const Professional = require('./professional.model');
// Crea un nuevo profesional en la base de datos.
const createProfessional = async (data) => {
  const existingProfessional = await Professional.findOne({ email: data.email });

  if (existingProfessional) {
    const error = new Error('Ya existe un profesional con ese email');
    error.statusCode = 409;
    throw error;
  }

  return Professional.create(data);
};

// Lista profesionales.
// Si llega una especialidad por query, filtra por especialidad.
const getProfessionals = async (filters) => {
  const query = {};

  if (filters.specialty) {
    query.specialty = new RegExp(filters.specialty, 'i');
  }

  return Professional.find(query);
};

// Busca un profesional por su ID.
const getProfessionalById = async (id) => {
  const professional = await Professional.findById(id);

  if (!professional) {
    const error = new Error('Profesional no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return professional;
};

// Actualiza los datos de un profesional.
const updateProfessional = async (id, data) => {
  const professional = await Professional.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });

  if (!professional) {
    const error = new Error('Profesional no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return professional;
};

// Elimina un profesional por ID.
const deleteProfessional = async (id) => {
  const professional = await Professional.findByIdAndDelete(id);

  if (!professional) {
    const error = new Error('Profesional no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return professional;
};

module.exports = {
  createProfessional,
  getProfessionals,
  getProfessionalById,
  updateProfessional,
  deleteProfessional,
};
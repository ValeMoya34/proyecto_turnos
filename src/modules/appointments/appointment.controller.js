const {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  deleteAppointment,
} = require('./appointment.service');

// Crea un turno para el usuario autenticado.
const create = async (req, res, next) => {
  try {
    const appointment = await createAppointment(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Turno creado correctamente',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// Devuelve los turnos del paciente autenticado.
const getMine = async (req, res, next) => {
  try {
    const appointments = await getMyAppointments(req.user.id);

    res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

// Devuelve todos los turnos. Uso admin.
const getAll = async (req, res, next) => {
  try {
    const appointments = await getAllAppointments(req.query);

    res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

// Devuelve un turno por ID. Uso admin.
const getById = async (req, res, next) => {
  try {
    const appointment = await getAppointmentById(req.params.id);

    res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// Cambia el estado de un turno. Uso admin.
const updateStatus = async (req, res, next) => {
  try {
    const appointment = await updateAppointmentStatus(
      req.params.id,
      req.body.status
    );

    res.json({
      success: true,
      message: 'Estado del turno actualizado correctamente',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// Cancela un turno propio del paciente.
const cancel = async (req, res, next) => {
  try {
    const appointment = await cancelAppointment(req.params.id, req.user.id);

    res.json({
      success: true,
      message: 'Turno cancelado correctamente',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// Elimina un turno. Uso admin.
const remove = async (req, res, next) => {
  try {
    await deleteAppointment(req.params.id);

    res.json({
      success: true,
      message: 'Turno eliminado correctamente',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getMine,
  getAll,
  getById,
  updateStatus,
  cancel,
  remove,
};
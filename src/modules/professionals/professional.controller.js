const {createProfessional,
  getProfessionals,
  getProfessionalById,
  updateProfessional,
  deleteProfessional,} = require ('./professional.service');

  //crea un profesional nuevo
  const create = async (req,res,next) => {
    try{
        const professional = await  createProfessional(req.body);

    res.status(201).json({
    success: true,
    message: 'Profesional creado correctamente',
    data: professional,
    });
  } catch (error) {
    next(error);
  }
};

// Lista profesionales. Puede filtrar por especialidad usando query params.
const getAll = async (req, res, next) => {
  try {
    const professionals = await getProfessionals(req.query);

    res.json({
      success: true,
      data: professionals,
    });
  } catch (error) {
    next(error);
  }
};
// Obtiene un profesional por ID.
const getById = async (req,res,next) =>{
    try{
        const professional = await getProfessionalById(req.params.id);

    res.json({
    success: true,
    data: professional,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req,res,next) =>{
    try{
        const professional = await updateProfessional(req.params.id, req.body);
    res.json({
    success: true,
    message: 'Profesional actualizado correctamente',
    data: professional,
    });
  } catch (error) {
    next(error);
  }
};


const remove=async (req,res,next) =>{
    try{
        await deleteProfessional(req.params.id);

    res.json({
    success: true,
    message: 'Profesional eliminado correctamente',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {create, getAll, getById, update, remove};
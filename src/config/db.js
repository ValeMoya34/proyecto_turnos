const mongoose = require('mongoose');

// Función encargada de conectar la aplicación con MongoDB.
const connectDB = async () => {
  try {
    const mongoUri =
      process.env.NODE_ENV === 'test'
        ? process.env.MONGO_URI_TEST
        : process.env.MONGO_URI;

    // Usa la URL guardada en el archivo .env.
    await mongoose.connect(mongoUri);

    console.log('MongoDB conectado correctamente');
  } catch (error) {
    console.error('Error al conectar MongoDB:', error.message);

    process.exit(1);
  }
};

module.exports = connectDB;
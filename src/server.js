require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000;

// Conectamos la aplicación con MongoDB.
connectDB();

// Inicia el servidor y lo deja escuchando peticiones en el puerto configurado.
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
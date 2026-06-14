//librerias
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const professionalRoutes = require('./modules/professionals/professional.routes');
const appointmentRoutes = require('./modules/appointments/appointment.routes');
const errorHandler = require('./middlewares/error.middleware');


// Se crea la aplicación principal de Express.
const app = express();

// Permite que la API reciba datos en formato JSON desde el body.
app.use(express.json());

// Permite que otros clientes, como un frontend, puedan consumir esta API.
app.use(cors());

// Agrega configuraciones básicas de seguridad en las respuestas HTTP.
app.use(helmet());

// Muestra en consola las peticiones que llegan al servidor.
app.use(morgan('dev'));

// Permite leer cookies desde req.cookies.
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../public')));

// Conectamos las rutas de autenticación.
// Todas las rutas de auth empiezan con /api/auth.
app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

// Conectamos las rutas de profesionales.
// Todas las rutas de profesionales empiezan con /api/professionals.
app.use('/api/professionals', professionalRoutes);

app.use('/api/appointments', appointmentRoutes);

//middleware de errores
app.use(errorHandler);
// Exportamos app para que server.js pueda iniciar el servidor.
module.exports = app;
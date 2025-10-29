// backend/server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Requerido para aceptar peticiones de la URL pública de Render
const db = require('./src/config/db.config'); // Conexión a PostgreSQL
const reservasRoutes = require('./src/routes/reservas.routes'); // Rutas de Reservas
const authRoutes = require('./src/routes/auth.routes'); 

// Cargar variables del archivo .env
dotenv.config();

const app = express();
// Dejamos el puerto como estaba: Render usará process.env.PORT si está disponible.
const PORT = process.env.PORT || 3000; 

// Middleware
// 🚀 1. Configuración de CORS simplificada: Permite cualquier origen para el despliegue
app.use(cors()); 

// 🚀 2. Middleware para leer datos JSON
app.use(express.json()); // Permite al servidor leer datos JSON de las peticiones


db.connect()
    .then(client => {
        console.log("PostgreSQL Conectado.");
        
        // Ejecuta la creación de tablas. 
        // DESCOMENTA ESTA LÍNEA SOLO UNA VEZ para crear las tablas en tu DB.
        // db.createTables(); 
        
        client.release();
    })
    .catch(err => {
        console.error("Error de conexión a DB:", err.stack);
        process.exit(1); // Cierra la aplicación si no puede conectarse a la DB
    });

// Rutas de la API (Descomentar y agregar más rutas a medida que se creen)
app.use('/api/auth', authRoutes); // Rutas de Autenticación
app.use('/api/reservas', reservasRoutes); 

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor de Football Amigos MT corriendo en http://localhost:${PORT}`);
});
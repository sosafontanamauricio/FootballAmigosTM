// backend/src/config/db.config.js

const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Configuración de la conexión usando variables de entorno
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// SQL para crear todas las tablas del proyecto Football Amigos MT
const createTablesSQL = `
    CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        rol VARCHAR(50) NOT NULL DEFAULT 'cliente',
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS canchas (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) UNIQUE NOT NULL,
        tipo VARCHAR(50) NOT NULL, -- ej: 5v5, 7v7
        tarifa_base DECIMAL(10, 2) NOT NULL,
        activo BOOLEAN DEFAULT TRUE
    );

    CREATE TABLE IF NOT EXISTS horarios (
        id SERIAL PRIMARY KEY,
        cancha_id INTEGER REFERENCES canchas(id) ON DELETE CASCADE,
        fecha DATE NOT NULL,
        hora_inicio TIME NOT NULL,
        hora_fin TIME NOT NULL,
        tarifa_especial DECIMAL(10, 2),
        UNIQUE (cancha_id, fecha, hora_inicio)
    );

    CREATE TABLE IF NOT EXISTS reservas (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        horario_id INTEGER REFERENCES horarios(id) UNIQUE ON DELETE RESTRICT,
        tipo_reserva VARCHAR(50) NOT NULL, -- 'equipo' o 'random'
        monto_total DECIMAL(10, 2) NOT NULL,
        estado_reserva VARCHAR(50) NOT NULL DEFAULT 'pendiente',
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pagos (
        id SERIAL PRIMARY KEY,
        reserva_id INTEGER REFERENCES reservas(id) ON DELETE CASCADE,
        metodo VARCHAR(50) NOT NULL, -- 'efectivo', 'wise', 'revolut', 'tarjeta'
        monto DECIMAL(10, 2) NOT NULL,
        estado_pago VARCHAR(50) NOT NULL,
        comprobante_url TEXT, -- URL para comprobantes Wise/Revolut
        fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const createTables = async () => {
    console.log("Creando o verificando la existencia de las tablas...");
    try {
        await pool.query(createTablesSQL);
        console.log("Tablas de la DB verificadas y listas.");
    } catch (err) {
        console.error("Error al crear las tablas:", err);
    }
};

module.exports = {
    query: (text, params) => pool.query(text, params),
    connect: () => pool.connect(),
    createTables, 
};
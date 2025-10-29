// backend/src/controllers/auth.controller.js

const db = require('../config/db.config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ------------------------------------
// 1. Lógica de REGISTRO (Crear Nuevo Usuario)
// ------------------------------------
exports.register = async (req, res) => {
    const { nombre, email, password } = req.body;

    // Validación básica
    if (!nombre || !email || !password) {
        return res.status(400).json({ message: "Faltan campos obligatorios." });
    }

    try {
        // 1. Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 2. Insertar el nuevo usuario en la tabla 'usuarios'
        const result = await db.query(
            "INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol",
            [nombre, email, passwordHash, 'cliente']
        );

        // 3. Respuesta exitosa (sin incluir el hash de la contraseña)
        res.status(201).json({ 
            message: "Registro exitoso. Por favor, inicia sesión.", 
            user: result.rows[0] 
        });

    } catch (error) {
        // Error de duplicidad (email ya existe)
        if (error.code === '23505') {
            return res.status(409).json({ message: "El email ya está registrado." });
        }
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ message: "Error interno del servidor al registrar." });
    }
};


// ------------------------------------
// 2. Lógica de LOGIN (Verificar Usuario y Emitir Token)
// ------------------------------------
exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // 1. Buscar usuario por email
        const result = await db.query("SELECT * FROM usuarios WHERE email = $1", [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: "Credenciales inválidas." });
        }

        // 2. Comparar la contraseña ingresada con el hash guardado
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: "Credenciales inválidas." });
        }

        // 3. Generar Token de Autenticación (JWT)
        const token = jwt.sign(
            { id: user.id, rol: user.rol }, // Payload: información básica
            process.env.JWT_SECRET,        // Clave secreta del .env
            { expiresIn: '1d' }            // Expira en 1 día
        );

        // 4. Respuesta exitosa
        res.status(200).json({
            token,
            user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol }
        });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: "Error interno del servidor al iniciar sesión." });
    }
};
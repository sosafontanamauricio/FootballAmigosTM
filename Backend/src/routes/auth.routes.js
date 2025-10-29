// backend/src/routes/auth.routes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Ruta para registrar un nuevo cliente
router.post('/register', authController.register);

// Ruta para iniciar sesión (clientes y admin)
router.post('/login', authController.login);

module.exports = router;
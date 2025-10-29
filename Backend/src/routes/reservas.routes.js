// backend/src/routes/reservas.routes.js

const express = require('express');
const router = express.Router();
// const reservaController = require('../controllers/reserva.controller'); // Lo crearemos después

// [Cliente] Ejemplo de una ruta que usaremos: obtener la disponibilidad de canchas
router.get('/disponibilidad', (req, res) => {
    // Por ahora, solo devuelve un mensaje. La lógica vendrá después.
    res.status(200).send({ message: "Endpoint de disponibilidad de canchas. Lógica pendiente." });
});

module.exports = router;
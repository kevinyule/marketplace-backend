const express = require('express');
const router = express.Router();
const {
    crearUsuario,
    loginUsuario,
    obtenerUsuarios,
    obtenerUsuario,
    actualizarUsuario,
    eliminarUsuario
} = require('../controllers/controllers.user');

// Rutas de autenticación
router.post('/registro', crearUsuario);
router.post('/login', loginUsuario);

// Rutas CRUD de usuarios
router.get('/', obtenerUsuarios);
router.get('/:id', obtenerUsuario);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);

module.exports = router;
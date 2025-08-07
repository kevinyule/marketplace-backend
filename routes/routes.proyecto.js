const express = require('express');
const router = express.Router();
const {
    crearProyecto,
    obtenerProyectos,
    obtenerProyectosPorUsuario,
    obtenerProyecto,
    actualizarProyecto,
    eliminarProyecto,
    buscarProyectosPorTecnologia
} = require('../controllers/controllers.proyecto');

// Rutas CRUD de proyectos
router.post('/', crearProyecto);
router.get('/', obtenerProyectos);
router.get('/:id', obtenerProyecto);
router.put('/:id', actualizarProyecto);
router.delete('/:id', eliminarProyecto);

// Rutas especiales
router.get('/usuario/:userId', obtenerProyectosPorUsuario);
router.get('/buscar/:tecnologia', buscarProyectosPorTecnologia);

module.exports = router;
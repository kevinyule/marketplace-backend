const Proyecto = require("../models/proyecto");

// Crear proyecto
const crearProyecto = async (req, res) => {
    try {
        const { 
            nombre, 
            descripcion, 
            imagenes, 
            documentacion, 
            tecnologias, 
            enlaceDemo, 
            enlaceRepositorio, 
            autor 
        } = req.body;
        
        const nuevoProyecto = new Proyecto({
            nombre,
            descripcion,
            imagenes: imagenes || [],
            documentacion,
            tecnologias: tecnologias || [],
            enlaceDemo,
            enlaceRepositorio,
            autor
        });
        
        const proyectoGuardado = await nuevoProyecto.save();
        
        // Poblar información del autor
        await proyectoGuardado.populate('autor', 'nombre correo');
        
        res.status(201).json({
            mensaje: "Proyecto creado exitosamente",
            proyecto: proyectoGuardado
        });
        
    } catch (error) {
        res.status(500).json({ 
            mensaje: "Error al crear proyecto", 
            error: error.message 
        });
    }
};

// Obtener todos los proyectos
const obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({ activo: true })
            .populate('autor', 'nombre correo')
            .sort({ fechaCreacion: -1 });
            
        res.status(200).json(proyectos);
    } catch (error) {
        res.status(500).json({ 
            mensaje: "Error al obtener proyectos", 
            error: error.message 
        });
    }
};

// Obtener proyectos por usuario
const obtenerProyectosPorUsuario = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const proyectos = await Proyecto.find({ 
            autor: userId, 
            activo: true 
        })
        .populate('autor', 'nombre correo')
        .sort({ fechaCreacion: -1 });
        
        res.status(200).json(proyectos);
    } catch (error) {
        res.status(500).json({ 
            mensaje: "Error al obtener proyectos del usuario", 
            error: error.message 
        });
    }
};

// Obtener proyecto por ID
const obtenerProyecto = async (req, res) => {
    try {
        const { id } = req.params;
        
        const proyecto = await Proyecto.findById(id)
            .populate('autor', 'nombre correo');
        
        if (!proyecto || !proyecto.activo) {
            return res.status(404).json({ 
                mensaje: "Proyecto no encontrado" 
            });
        }
        
        res.status(200).json(proyecto);
    } catch (error) {
        res.status(500).json({ 
            mensaje: "Error al obtener proyecto", 
            error: error.message 
        });
    }
};

// Actualizar proyecto
const actualizarProyecto = async (req, res) => {
    try {
        const { id } = req.params;
        const actualizacion = req.body;
        
        const proyectoActualizado = await Proyecto.findByIdAndUpdate(
            id, 
            actualizacion, 
            { new: true, runValidators: true }
        ).populate('autor', 'nombre correo');
        
        if (!proyectoActualizado) {
            return res.status(404).json({ 
                mensaje: "Proyecto no encontrado" 
            });
        }
        
        res.status(200).json({
            mensaje: "Proyecto actualizado exitosamente",
            proyecto: proyectoActualizado
        });
        
    } catch (error) {
        res.status(500).json({ 
            mensaje: "Error al actualizar proyecto", 
            error: error.message 
        });
    }
};

// Eliminar proyecto (soft delete)
const eliminarProyecto = async (req, res) => {
    try {
        const { id } = req.params;
        
        const proyectoEliminado = await Proyecto.findByIdAndUpdate(
            id,
            { activo: false },
            { new: true }
        );
        
        if (!proyectoEliminado) {
            return res.status(404).json({ 
                mensaje: "Proyecto no encontrado" 
            });
        }
        
        res.status(200).json({ 
            mensaje: "Proyecto eliminado exitosamente" 
        });
        
    } catch (error) {
        res.status(500).json({ 
            mensaje: "Error al eliminar proyecto", 
            error: error.message 
        });
    }
};

// Buscar proyectos por tecnología
const buscarProyectosPorTecnologia = async (req, res) => {
    try {
        const { tecnologia } = req.params;
        
        const proyectos = await Proyecto.find({
            tecnologias: { $regex: tecnologia, $options: 'i' },
            activo: true
        })
        .populate('autor', 'nombre correo')
        .sort({ fechaCreacion: -1 });
        
        res.status(200).json(proyectos);
    } catch (error) {
        res.status(500).json({ 
            mensaje: "Error al buscar proyectos", 
            error: error.message 
        });
    }
};

module.exports = {
    crearProyecto,
    obtenerProyectos,
    obtenerProyectosPorUsuario,
    obtenerProyecto,
    actualizarProyecto,
    eliminarProyecto,
    buscarProyectosPorTecnologia
};
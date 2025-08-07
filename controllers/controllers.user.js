exports.prueba = (req,res)=>{
    console.log("Hola desde el controlador")
    res.send("hola desde el controlador")
}

const User = require("../models/users");
const bcrypt = require('bcrypt');

// Crear usuario (Registro)
const crearUsuario = async (req, res) => {
    try {
        const { nombre, correo, contraseña } = req.body;
        
        // Verificar si el correo ya existe
        const usuarioExistente = await User.findOne({ correo });
        if (usuarioExistente) {
            return res.status(400).json({ 
                mensaje: "El correo ya está registrado" 
            });
        }
        
        // Encriptar contraseña
        const saltRounds = 10;
        const contraseñaEncriptada = await bcrypt.hash(contraseña, saltRounds);
        
        const nuevoUsuario = new User({
            nombre,
            correo,
            contraseña: contraseñaEncriptada
        });
        
        const usuarioGuardado = await nuevoUsuario.save();
        
        // No devolver la contraseña
        const { contraseña: _, ...usuarioSinPassword } = usuarioGuardado.toObject();
        
        res.status(201).json({
            mensaje: "Usuario creado exitosamente",
            usuario: usuarioSinPassword
        });
        
    } catch (error) {
        res.status(500).json({ 
            mensaje: "Error al crear usuario", 
            error: error.message 
        });
    }
};

// Login de usuario
const loginUsuario = async (req, res) => {
    try {
        const { correo, contraseña } = req.body;
        
        // Buscar usuario por correo
        const usuario = await User.findOne({ correo });
        if (!usuario) {
            return res.status(401).json({ 
                mensaje: "Credenciales inválidas" 
            });
        }
        
        // Verificar contraseña
        const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!contraseñaValida) {
            return res.status(401).json({ 
                mensaje: "Credenciales inválidas" 
            });
        }
        
        // No devolver la contraseña
        const { contraseña: _, ...usuarioSinPassword } = usuario.toObject();
        
        res.status(200).json({
            mensaje: "Login exitoso",
            usuario: usuarioSinPassword
        });
        
    } catch (error) {
        res.status(500).json({ 
            mensaje: "Error en el login", 
            error: error.message 
        });
    }
};

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await User.find().select('-contraseña');
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ 
            mensaje: "Error al obtener usuarios", 
            error: error.message 
        });
    }
};

// Obtener usuario por ID
const obtenerUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await User.findById(id).select('-contraseña');
        
        if (!usuario) {
            return res.status(404).json({ 
                mensaje: "Usuario no encontrado" 
            });
        }
        
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ 
            mensaje: "Error al obtener usuario", 
            error: error.message 
        });
    }
};

// Actualizar usuario
const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, correo, contraseña } = req.body;
        
        const actualizacion = { nombre, correo };
        
        // Si se proporciona nueva contraseña, encriptarla
        if (contraseña) {
            const saltRounds = 10;
            actualizacion.contraseña = await bcrypt.hash(contraseña, saltRounds);
        }
        
        const usuarioActualizado = await User.findByIdAndUpdate(
            id, 
            actualizacion, 
            { new: true, runValidators: true }
        ).select('-contraseña');
        
        if (!usuarioActualizado) {
            return res.status(404).json({ 
                mensaje: "Usuario no encontrado" 
            });
        }
        
        res.status(200).json({
            mensaje: "Usuario actualizado exitosamente",
            usuario: usuarioActualizado
        });
        
    } catch (error) {
        res.status(500).json({ 
            mensaje: "Error al actualizar usuario", 
            error: error.message 
        });
    }
};

// Eliminar usuario
const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        
        const usuarioEliminado = await User.findByIdAndDelete(id);
        
        if (!usuarioEliminado) {
            return res.status(404).json({ 
                mensaje: "Usuario no encontrado" 
            });
        }
        
        res.status(200).json({ 
            mensaje: "Usuario eliminado exitosamente" 
        });
        
    } catch (error) {
        res.status(500).json({ 
            mensaje: "Error al eliminar usuario", 
            error: error.message 
        });
    }
};

module.exports = {
    crearUsuario,
    loginUsuario,
    obtenerUsuarios,
    obtenerUsuario,
    actualizarUsuario,
    eliminarUsuario
};
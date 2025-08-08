const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const proyectoSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        maxLength: 150
    },
    descripcion: {
        type: String,
        required: true,
        maxLength: 1000
    },
    imagenes: [{
        type: String, // Guardará Base64 sin límite de tamaño
        required: false
    }],
    documentacion: {
        type: String, // URL del archivo o texto
        maxLength: 500
    },
    tecnologias: [{
        type: String,
        maxLength: 50
    }],
    enlaceDemo: {
        type: String,
        maxLength: 500
    },
    enlaceRepositorio: {
        type: String,
        maxLength: 500
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Proyecto", proyectoSchema);
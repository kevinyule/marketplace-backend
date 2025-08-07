const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
const rutasUsuarios = require('./routes/routes.users');
const rutasProyectos = require('./routes/routes.proyecto');

app.use('/api/usuarios', rutasUsuarios);
app.use('/api/proyectos', rutasProyectos);

// Ruta base
app.get('/', (req, res) => {
    res.json({ mensaje: 'API de MarketPlace de Proyectos funcionando correctamente' });
});

// Conexión a MongoDB
const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI  || 'mongodb://localhost:27017/marketplace');
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        process.exit(1);
    }
};

// Iniciar servidor
const PORT = process.env.PORT || 3000;

conectarDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
    });
});

module.exports = app;
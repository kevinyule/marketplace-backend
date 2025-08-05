const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API inicial de proyectos.' });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/buscar', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM comprador WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Error del servidor' });

    if (results.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const user = results[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    res.json({ message: 'Login exitoso', user });
  });
});

module.exports = router;

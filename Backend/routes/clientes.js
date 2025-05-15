const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

router.post('/agregar', async (req, res) => {
  const { nombre, email, telefono, password } = req.body;
  console.log("Datos recibidos:", req.body);
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const sql = 'INSERT INTO comprador (nombre, email, telefono, password) VALUES (?, ?, ?, ?)';

    db.query(sql, [nombre, email, telefono, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true, id: result.insertId });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al encriptar la contraseña' });
  }
});


// Ruta para eliminar un cliente por ID
router.delete('/eliminar/:id', (req, res) => {
  const clienteId = req.params.id;
  const sql = 'DELETE FROM comprador WHERE id = ?';

  db.query(sql, [clienteId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json({ success: true, message: 'Cliente eliminado correctamente' });
  });
});

router.post('/buscar', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM comprador WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Error del servidor' });

    if (results.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const user = results[0];
    const { comprador_id, nombre, email } = user;

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    res.json({ success: true, message: 'Login exitoso', user: {id: comprador_id, name: nombre,email} });
  });
});

module.exports = router;

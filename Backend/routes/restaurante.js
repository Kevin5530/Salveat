const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../db');

// Clave secreta para firmar el token (preferiblemente en una variable de entorno)
const SECRET_KEY = 'tu_clave_secreta';

// -------------------------------------------------------------------------
// REGISTRO DE RESTAURANTE
// Endpoint: POST /api/restaurante/registro
// -------------------------------------------------------------------------
router.post('/registro', (req, res) => {
  const { nombre, direccion, telefono, email, password } = req.body;

  if (!nombre || !direccion || !telefono || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  // Encriptar la contraseña
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('❌ Error al encriptar la contraseña:', err);
      return res.status(500).json({ error: 'Error interno al registrar' });
    }

    const sql = `
      INSERT INTO restaurante (nombre, direccion, telefono, email, password)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [nombre, direccion, telefono, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('❌ Error al registrar el restaurante:', err);
        return res.status(500).json({ error: 'Error en el servidor al registrar' });
      }

      res.status(201).json({
        mensaje: '✅ Restaurante registrado correctamente',
        restaurante_id: result.insertId
      });
    });
  });
});

// -------------------------------------------------------------------------
// LOGIN DE RESTAURANTE
// Endpoint: POST /api/restaurante/login
// -------------------------------------------------------------------------
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  const query = 'SELECT * FROM restaurante WHERE email = ? LIMIT 1';

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('❌ Error al buscar restaurante:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Correo no registrado' });
    }

    const restaurante = results[0];

    // Verificar si las contraseñas coinciden
    bcrypt.compare(password, restaurante.password, (err, isMatch) => {
      if (err) {
        console.error('❌ Error al comparar contraseñas:', err);
        return res.status(500).json({ error: 'Error interno al verificar la contraseña' });
      }

      if (!isMatch) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }
      
      // Generar el token usando jsonwebtoken
      const payload = {
        restaurante_id: restaurante.restaurante_id,
        nombre: restaurante.nombre,
      };

      jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' }, (err, token) => {
        if (err) {
          console.error('❌ Error al generar token:', err);
          return res.status(500).json({ error: 'Error al generar token' });
        }
        
        res.status(200).json({
          mensaje: '✅ Login exitoso',
          token, // Se envía el token generado
          restaurante_id: restaurante.restaurante_id,
          nombre: restaurante.nombre
        });
      });
    });
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../cloudinary');

// Configurar Cloudinary Storage para multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ordenes', 
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});
const upload = multer({ storage });

// -------------------------------------------------------------------------
// CREAR ORDEN SIN IMAGEN
// Endpoint: POST /api/orden
// -------------------------------------------------------------------------
router.post('/', (req, res) => {
  const { restaurante_id, nombre_platillo, precio_original, precio_descuento } = req.body;

  const sql = `
    INSERT INTO orden 
      (restaurante_id, nombre_platillo, precio_original, precio_descuento, estado, fecha_publicacion)
    VALUES (?, ?, ?, ?, 'Disponible', NOW())
  `;

  db.query(sql, [restaurante_id, nombre_platillo, precio_original, precio_descuento], (err, result) => {
    if (err) {
      console.error('Error al insertar orden (sin imagen):', err);
      return res.status(500).json({ error: 'Error en el servidor al crear la orden' });
    }
    res.status(201).json({ message: 'Orden creada exitosamente', orden_id: result.insertId });
  });
});

// -------------------------------------------------------------------------
// CREAR ORDEN CON IMAGEN
// Endpoint: POST /api/orden/crear
// -------------------------------------------------------------------------
router.post('/crear', upload.single('imagen'), (req, res) => {
  const { restaurante_id, nombre_platillo, precio_original, precio_descuento } = req.body;
  const imagen_url = req.file.path;

  const sql = `
    INSERT INTO orden 
      (restaurante_id, nombre_platillo, precio_original, precio_descuento, estado, fecha_publicacion, imagen_url)
    VALUES (?, ?, ?, ?, 'Disponible', NOW(), ?)
  `;

  db.query(sql, [restaurante_id, nombre_platillo, precio_original, precio_descuento, imagen_url], (err, result) => {
    if (err) {
      console.error('Error al insertar orden (con imagen):', err);
      return res.status(500).json({ error: 'Error al crear la orden' });
    }
    res.status(201).json({ message: 'Orden creada exitosamente', orden_id: result.insertId });
  });
});

// -------------------------------------------------------------------------
// OBTENER DETALLE DE UNA ORDEN
// Endpoint: GET /api/orden/detalle/:orden_id
// -------------------------------------------------------------------------
router.get('/detalle/:orden_id', (req, res) => {
  const orden_id = req.params.orden_id;
  console.log("Recibí petición para orden_id =", orden_id);

  const sql = `
    SELECT o.*, r.nombre AS nombre_restaurante, r.direccion, r.telefono, r.email
    FROM orden o
    JOIN restaurante r ON o.restaurante_id = r.restaurante_id
    WHERE o.orden_id = ?
  `;

  db.query(sql, [orden_id], (err, results) => {
    console.log("Resultados de la BD:", results);
    if (err) {
      console.error('Error al obtener el detalle de la orden:', err);
      return res.status(500).json({ error: 'Error al obtener detalle de la orden' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    res.status(200).json(results[0]);
  });
});

// -------------------------------------------------------------------------
// OBTENER TODAS LAS ÓRDENES (SIN FILTRO) ORDENADAS POR FECHA
// Endpoint: GET /api/orden/buscar
// -------------------------------------------------------------------------
router.get('/buscar', (req, res) => {
  const sql = "SELECT * FROM orden WHERE estado = 'Disponible' ORDER BY fecha_publicacion DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener órdenes disponibles:', err);
      return res.status(500).json({ error: 'Error al obtener órdenes' });
    }
    res.status(200).json(results);
  });
});

// -------------------------------------------------------------------------
// OBTENER LAS ÓRDENES DE UN RESTAURANTE
// Endpoint: GET /api/orden/:restaurante_id
// -------------------------------------------------------------------------
router.get('/:restaurante_id', (req, res) => {
  const restaurante_id = req.params.restaurante_id;
  const sql = 'SELECT * FROM orden WHERE restaurante_id = ?';
  db.query(sql, [restaurante_id], (err, results) => {
    if (err) {
      console.error('Error al obtener las órdenes:', err);
      return res.status(500).json({ error: 'Error en el servidor al obtener las órdenes' });
    }
    res.status(200).json(results);
  });
});

// -------------------------------------------------------------------------
// ACTUALIZAR EL ESTADO DE UNA ORDEN
// Endpoint: PUT /api/orden/estado/:orden_id
// -------------------------------------------------------------------------
router.put('/estado/:orden_id', (req, res) => {
  const orden_id = req.params.orden_id;
  const { estado } = req.body;
  const estadosPermitidos = ['Disponible', 'Vendido', 'Cancelado'];
  
  if (!estadosPermitidos.includes(estado)) {
    return res.status(400).json({ error: 'Estado no válido' });
  }

  const sql = `UPDATE orden SET estado = ? WHERE orden_id = ?`;
  db.query(sql, [estado, orden_id], (err, result) => {
    if (err) {
      console.error('Error al actualizar el estado de la orden:', err);
      return res.status(500).json({ error: 'Error interno al actualizar el estado' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    res.status(200).json({ message: 'Estado actualizado correctamente' });
  });
});

router.post('/comprar', (req, res) => {
  const { comprador_id, orden_id } = req.body;

  if (!comprador_id || !orden_id) {
    return res.status(400).json({ error: 'Faltan datos de la compra' });
  }

  // Obtener el precio de la orden
  db.query('SELECT precio_descuento FROM orden WHERE orden_id = ?', [orden_id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).json({ error: 'No se pudo obtener la orden' });
    }

    const monto = results[0].precio_descuento;

    const insertSQL = `
      INSERT INTO transaccion (comprador_id, orden_id, fecha, monto, estado)
      VALUES (?, ?, NOW(), ?, 'Pendiente')
    `;

    db.query(insertSQL, [comprador_id, orden_id, monto], (err, result) => {
      if (err) {
        console.error(' Error al registrar transacción:', err);
        return res.status(500).json({ error: 'Error al registrar la compra' });
      }

      // Actualizar estado de la orden
      const updateSQL = 'UPDATE orden SET estado = "Vendido" WHERE orden_id = ?';
      db.query(updateSQL, [orden_id], (updateErr) => {
        if (updateErr) {
          console.error(' Error al actualizar estado de orden:', updateErr);
          return res.status(500).json({ error: 'Compra registrada, pero error al actualizar orden' });
        }

        res.status(200).json({ success: true, message: 'Compra realizada con éxito' });
      });
    });
  });
});



module.exports = router;

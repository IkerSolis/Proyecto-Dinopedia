const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/search', async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) {
      return res.status(400).json({ error: "Parámetro de búsqueda requerido" });
    }
    const result = await pool.query(
      'SELECT id, nombre, dieta, imagen_url FROM dinosaurios WHERE LOWER(nombre) LIKE LOWER($1)',
      ['%' + q + '%']
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar dinosaurios" });
  }
});


router.get('/dinos', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre, dieta, imagen_url FROM dinosaurios ORDER BY nombre ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener dinosaurios" });
  }
});

// GET /api/dinos/:id
router.get('/dinos/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: "ID inválido" });
    }
    const result = await pool.query('SELECT * FROM dinosaurios WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Dinosaurio no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el dinosaurio" });
  }
});

// POST /api/dinos
router.post('/dinos', authMiddleware, async (req, res) => {
  try {
    const { nombre, tamanio, peso, dieta, ubicacion, descripcion, imagen_url } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: "El nombre es requerido" });
    }

    const result = await pool.query(
      'INSERT INTO dinosaurios (nombre, tamanio, peso, dieta, ubicacion, descripcion, imagen_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [nombre, tamanio, peso, dieta, ubicacion, descripcion, imagen_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el dinosaurio" });
  }
});

module.exports = router;

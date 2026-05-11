const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// POST /api/login
router.post('/login', (req, res) => {
  try {
    const { usuario, password } = req.body;
    
    if (usuario === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '2h' });
      return res.status(200).json({ token });
    }
    
    return res.status(401).json({ error: "Credenciales inválidas" });
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;

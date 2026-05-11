const express = require('express');
const dotenv = require('dotenv');
const pool = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Importar rutas
const dinosRoutes = require('./routes/dinos');
const authRoutes = require('./routes/auth');
app.use('/api', dinosRoutes);
app.use('/api', authRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Conexión a PostgreSQL exitosa:', res.rows[0].now);
  } catch (err) {
    console.error('Error al conectar a PostgreSQL:', err);
    process.exit(1);
  }
});

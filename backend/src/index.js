require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initSchema } = require('./db/database');

const authRoutes = require('./routes/auth');
const invitacionesRoutes = require('./routes/invitaciones');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mensaje: 'API Invitación Cristina 40', db: 'neon' });
});

app.use('/api/auth', authRoutes);
app.use('/api/invitaciones', invitacionesRoutes);
app.use('/api/admin', adminRoutes);

async function start() {
  try {
    await initSchema();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log('Base de datos: Neon PostgreSQL');
    });
  } catch (err) {
    console.error('No se pudo iniciar el servidor:', err.message);
    console.error('Revisa que DATABASE_URL en backend/.env sea correcta.');
    process.exit(1);
  }
}

start();

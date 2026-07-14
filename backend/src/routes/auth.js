const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { queryOne } = require('../db/database');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
    }

    const admin = await queryOne('SELECT * FROM administrador WHERE correo = $1', [correo]);

    if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: admin.id_administrador, correo: admin.correo, nombre: admin.nombre },
      process.env.JWT_SECRET || 'secreto_dev',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      admin: { id: admin.id_administrador, nombre: admin.nombre, correo: admin.correo },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

module.exports = router;

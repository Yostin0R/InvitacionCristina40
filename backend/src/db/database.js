require('dotenv').config();
const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  throw new Error('Falta DATABASE_URL en el archivo .env (connection string de Neon)');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function query(text, params = []) {
  return pool.query(text, params);
}

async function queryOne(text, params = []) {
  const result = await pool.query(text, params);
  return result.rows[0] || null;
}

async function queryAll(text, params = []) {
  const result = await pool.query(text, params);
  return result.rows;
}

async function initSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS administrador (
      id_administrador SERIAL PRIMARY KEY,
      nombre TEXT NOT NULL,
      correo TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      rol TEXT DEFAULT 'admin',
      fecha_creacion TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS evento (
      id_evento SERIAL PRIMARY KEY,
      titulo TEXT NOT NULL,
      homenajeada TEXT NOT NULL,
      descripcion TEXT,
      fecha_evento DATE NOT NULL,
      hora_inicio TIME NOT NULL,
      hora_fin TIME,
      lugar TEXT NOT NULL,
      direccion TEXT NOT NULL,
      url_mapa TEXT,
      codigo_vestimenta TEXT,
      fecha_limite_confirmacion DATE NOT NULL,
      mensaje_regalos TEXT,
      estado TEXT DEFAULT 'publicado'
    );

    CREATE TABLE IF NOT EXISTS invitado (
      id_invitado SERIAL PRIMARY KEY,
      id_evento INTEGER NOT NULL REFERENCES evento(id_evento),
      nombre TEXT NOT NULL,
      telefono TEXT,
      token_invitacion TEXT NOT NULL UNIQUE,
      acompanantes_permitidos INTEGER DEFAULT 2,
      estado_envio TEXT DEFAULT 'pendiente',
      fecha_envio TIMESTAMPTZ,
      activo BOOLEAN DEFAULT TRUE
    );

    CREATE TABLE IF NOT EXISTS confirmacion (
      id_confirmacion SERIAL PRIMARY KEY,
      id_invitado INTEGER NOT NULL UNIQUE REFERENCES invitado(id_invitado),
      asistira BOOLEAN NOT NULL,
      numero_acompanantes INTEGER DEFAULT 0,
      mensaje TEXT,
      fecha_confirmacion TIMESTAMPTZ DEFAULT NOW(),
      ultima_actualizacion TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS fotografia (
      id_fotografia SERIAL PRIMARY KEY,
      id_evento INTEGER NOT NULL REFERENCES evento(id_evento),
      url_imagen TEXT NOT NULL,
      descripcion TEXT,
      etapa TEXT,
      orden INTEGER DEFAULT 0,
      activa BOOLEAN DEFAULT TRUE
    );

    CREATE TABLE IF NOT EXISTS configuracion (
      id_configuracion SERIAL PRIMARY KEY,
      id_evento INTEGER NOT NULL UNIQUE REFERENCES evento(id_evento),
      color_principal TEXT DEFAULT '#6B2233',
      color_secundario TEXT DEFAULT '#C5A05D',
      tipografia TEXT DEFAULT 'Playfair Display',
      url_musica TEXT,
      imagen_portada TEXT,
      musica_activa BOOLEAN DEFAULT TRUE
    );

    CREATE TABLE IF NOT EXISTS visita (
      id_visita SERIAL PRIMARY KEY,
      id_invitado INTEGER NOT NULL REFERENCES invitado(id_invitado),
      fecha_visita TIMESTAMPTZ DEFAULT NOW(),
      dispositivo TEXT,
      cantidad_visitas INTEGER DEFAULT 1
    );
  `);
}

module.exports = {
  pool,
  query,
  queryOne,
  queryAll,
  initSchema,
};

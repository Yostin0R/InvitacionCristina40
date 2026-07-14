require('dotenv').config();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { query, queryOne, initSchema } = require('./database');

async function seed() {
  await initSchema();

  const eventoExiste = await queryOne('SELECT id_evento FROM evento LIMIT 1');
  if (eventoExiste) {
    console.log('La base de datos ya tiene datos. Omitiendo seed.');
    process.exit(0);
  }

  const passwordHash = bcrypt.hashSync('admin123', 10);

  await query(
    `INSERT INTO administrador (nombre, correo, password_hash, rol)
     VALUES ($1, $2, $3, $4)`,
    ['Administrador', 'admin@cumplecristina.com', passwordHash, 'admin']
  );

  const evento = await queryOne(
    `INSERT INTO evento (
      titulo, homenajeada, descripcion, fecha_evento, hora_inicio, hora_fin,
      lugar, direccion, url_mapa, codigo_vestimenta, fecha_limite_confirmacion,
      mensaje_regalos, estado
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING id_evento`,
    [
      'Celebrando 40 años',
      'Cristina Estefanía Sinche',
      'Cuatro décadas de recuerdos, amor y momentos especiales',
      '2026-08-22',
      '19:00',
      '23:00',
      'Salón de eventos',
      'Av. Principal 123, Ciudad',
      'https://maps.google.com/?q=Salon+de+eventos',
      'Elegante casual',
      '2026-08-15',
      'Tu presencia es el mejor regalo. Si deseas obsequiar algo, será recibido con mucho cariño.',
      'publicado',
    ]
  );

  const eventoId = evento.id_evento;

  await query(
    `INSERT INTO configuracion (id_evento, color_principal, color_secundario, tipografia, musica_activa, imagen_portada)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      eventoId,
      '#6B2233',
      '#C5A05D',
      'Playfair Display',
      true,
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
    ]
  );

  const fotos = [
    { url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80', desc: 'Los primeros pasos', etapa: 'Infancia', orden: 1 },
    { url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80', desc: 'Días de juventud', etapa: 'Juventud', orden: 2 },
    { url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&q=80', desc: 'Momentos en familia', etapa: 'Familia', orden: 3 },
    { url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5ea?w=600&q=80', desc: 'Hoy y siempre', etapa: 'Actualidad', orden: 4 },
  ];

  for (const foto of fotos) {
    await query(
      `INSERT INTO fotografia (id_evento, url_imagen, descripcion, etapa, orden)
       VALUES ($1, $2, $3, $4, $5)`,
      [eventoId, foto.url, foto.desc, foto.etapa, foto.orden]
    );
  }

  const invitadosDemo = [
    { nombre: 'Juan Pérez', telefono: '0991234567', acompanantes: 2 },
    { nombre: 'María López', telefono: '0997654321', acompanantes: 1 },
    { nombre: 'Carlos Ruiz', telefono: '0991112233', acompanantes: 2 },
    { nombre: 'Ana García', telefono: '0994445566', acompanantes: 3 },
  ];

  const tokens = [];

  for (const inv of invitadosDemo) {
    const token = uuidv4().replace(/-/g, '').slice(0, 12);
    await query(
      `INSERT INTO invitado (id_evento, nombre, telefono, token_invitacion, acompanantes_permitidos)
       VALUES ($1, $2, $3, $4, $5)`,
      [eventoId, inv.nombre, inv.telefono, token, inv.acompanantes]
    );
    tokens.push({ nombre: inv.nombre, token });
  }

  console.log('✅ Base de datos Neon inicializada correctamente');
  console.log('\n📧 Admin: admin@cumplecristina.com / admin123');
  console.log('\n🔗 Enlaces de invitación de prueba:');
  for (const t of tokens) {
    console.log(`   ${t.nombre}: http://localhost:5173/invitacion/${t.token}`);
  }

  process.exit(0);
}

seed().catch((err) => {
  console.error('Error en seed:', err.message);
  process.exit(1);
});

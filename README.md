# Invitación Digital — 40 años de Cristina

Invitación web personalizada para el cumpleaños número 40, con confirmación de asistencia y panel administrativo.

## Estructura del proyecto

```
InvitacionCristina40/
├── backend/          # API Node.js + Express + SQLite
│   ├── src/
│   │   ├── db/       # Base de datos y datos iniciales
│   │   ├── routes/   # Endpoints de la API
│   │   └── index.js
│   └── data/         # Archivo de base de datos (se crea al iniciar)
└── frontend/         # React + Vite
    └── src/
        ├── components/invitacion/
        └── pages/admin/
```

## Requisitos

- Node.js 18 o superior
- npm

## Instalación y ejecución

### 1. Backend

```bash
cd backend
npm install
npm run seed    # Carga datos iniciales (solo la primera vez)
npm run dev     # Inicia en http://localhost:3001
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev     # Inicia en http://localhost:5173
```

## Accesos de prueba

| Rol | Acceso |
|-----|--------|
| **Administrador** | http://localhost:5173/admin |
| Correo | `admin@cumplecristina.com` |
| Contraseña | `admin123` |

Después de ejecutar `npm run seed`, la consola mostrará enlaces de invitación de prueba para cada invitado demo.

## Funcionalidades incluidas (MVP)

### Invitación pública (`/invitacion/:token`)
- Apertura animada del sobre
- Portada con foto, nombre y fecha
- Cuenta regresiva en tiempo real
- Detalles del evento (fecha, hora, lugar, vestimenta)
- Enlaces a Google Maps y Google Calendar
- Galería de fotografías con carrusel
- Formulario de confirmación (Sí/No, acompañantes, mensaje)
- Pantalla de agradecimiento

### Panel administrativo (`/admin`)
- Inicio de sesión
- Dashboard con estadísticas
- Gestión de invitados (crear, buscar, filtrar, eliminar)
- Copiar enlace personalizado por invitado
- Enviar invitación por WhatsApp
- Ver mensajes de invitados
- Exportar lista a CSV o Excel

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/invitaciones/:token` | Datos de la invitación |
| POST | `/api/invitaciones/:token/confirmar` | Confirmar asistencia |
| POST | `/api/auth/login` | Login administrador |
| GET | `/api/admin/estadisticas` | Estadísticas del evento |
| GET | `/api/admin/invitados` | Lista de invitados |
| POST | `/api/admin/invitados` | Crear invitado |
| GET | `/api/admin/exportar` | Exportar CSV/Excel |

## Personalización

Los datos del evento se configuran en `backend/src/db/seed.js`. Para la primera versión puedes editar directamente:

- Nombre de la homenajeada
- Fecha, hora y lugar
- Fotografías (URLs)
- Colores y estilo
- Invitados de prueba

## Próximos pasos (segunda versión)

- Editor visual del evento desde el panel admin
- Migración a PostgreSQL (Neon)
- Almacenamiento de imágenes en Cloudinary
- Música de fondo personalizada
- Vista especial para la homenajeada
- Recordatorios automáticos
- Código QR por invitación

## Despliegue sugerido

| Componente | Plataforma |
|------------|------------|
| Frontend | Vercel |
| Backend | Render / Railway |
| Base de datos | Neon PostgreSQL |
| Imágenes | Cloudinary |

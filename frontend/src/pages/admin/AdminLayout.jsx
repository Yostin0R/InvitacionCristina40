import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { IconGrid, IconUsers, IconChat, IconSettings, IconExport } from '../../components/icons';

export default function AdminLayout() {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_nombre');
    navigate('/admin');
  };

  const linkClass = ({ isActive }) => (isActive ? 'active' : '');

  return (
    <div className="admin-page admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="logo">M · 40</div>
          <div className="sub">Admin · Celebración</div>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" className={linkClass}><IconGrid /> Dashboard</NavLink>
          <NavLink to="/admin/invitados" className={linkClass}><IconUsers /> Invitados</NavLink>
          <NavLink to="/admin/mensajes" className={linkClass}><IconChat /> Mensajes</NavLink>
          <NavLink to="/admin/configuracion" className={linkClass}><IconSettings /> Configuración</NavLink>
        </nav>
        <button className="admin-logout" onClick={cerrarSesion}>
          <IconExport style={{ transform: 'rotate(90deg)' }} /> Cerrar sesión
        </button>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

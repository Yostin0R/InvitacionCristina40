import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import InvitacionPage from './pages/InvitacionPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminInvitados from './pages/admin/AdminInvitados';
import AdminMensajes from './pages/admin/AdminMensajes';
import AdminConfiguracion from './pages/admin/AdminConfiguracion';

function RutaProtegida({ children }) {
  const token = localStorage.getItem('admin_token');
  if (!token) return <Navigate to="/admin" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/invitacion/:token" element={<InvitacionPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          element={
            <RutaProtegida>
              <AdminLayout />
            </RutaProtegida>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/invitados" element={<AdminInvitados />} />
          <Route path="/admin/mensajes" element={<AdminMensajes />} />
          <Route path="/admin/configuracion" element={<AdminConfiguracion />} />
        </Route>
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { token, role, user } = useAuth();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Se sono specificati ruoli permessi, verifica che l'utente ne abbia uno
  if (allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
    // Reindirizza alla dashboard appropriata in base al ruolo se prova ad accedere a una rotta non sua
    if (role === 'amministratore') return <Navigate to="/dashboard/admin" replace />;
    if (role === 'fornitore') return <Navigate to="/dashboard/fornitore" replace />;
    return <Navigate to="/dashboard/cliente" replace />;
  }

  return children;
}

export default ProtectedRoute; 
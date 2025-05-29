import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const { role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'cliente') navigate('/dashboard/cliente');
    else if (role === 'fornitore') navigate('/dashboard/fornitore');
    else if (role === 'amministratore') navigate('/dashboard/admin');
    else navigate('/login');
  }, [role, navigate]);

  return null;
 
}

export default Dashboard; 

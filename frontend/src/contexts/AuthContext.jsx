import { createContext, useContext, useState, useEffect } from 'react';
import { getProfile } from '../services/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);

  // Recupera il profilo utente se c'è già un token (persistenza login)
  useEffect(() => {
    const fetchProfile = async () => {
      if (token && !user) {
        try {
          const profile = await getProfile(token);
          setUser(profile);
          setRole(profile.ruolo);
          localStorage.setItem('role', profile.ruolo);
        } catch (err) {
          setUser(null);
          setToken(null);
          setRole(null);
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          localStorage.removeItem('role');
        }
      }
    };
    fetchProfile();
    // eslint-disable-next-line
  }, [token]);

  const loginUser = async (tokens) => {
    setToken(tokens.access);
    localStorage.setItem('access', tokens.access);
    localStorage.setItem('refresh', tokens.refresh);
    // Recupera il profilo utente dal backend
    const profile = await getProfile(tokens.access);
    setUser(profile);
    setRole(profile.ruolo);
    localStorage.setItem('role', profile.ruolo);
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ user, token, role, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

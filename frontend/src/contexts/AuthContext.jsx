import { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { getProfile } from '../services/auth';
import { API_BASE } from '../config/api.js';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const isAuthenticated = Boolean(token);
  const refreshTimerRef = useRef(null);

  // ─── Refresh silenzioso token JWT ─────────────────────────────────────────
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh');
    if (!refreshToken) {
      _doLogout();
      return null;
    }
    try {
      const response = await axios.post(`${API_BASE}auth/token/refresh/`, {
        refresh: refreshToken,
      });
      const newAccess = response.data.access;
      const newRefresh = response.data.refresh || refreshToken; // SimpleJWT ROTATE emette nuovo refresh
      localStorage.setItem('access', newAccess);
      localStorage.setItem('refresh', newRefresh);
      setToken(newAccess);
      return newAccess;
    } catch {
      _doLogout();
      return null;
    }
  };

  // Avvia il timer di refresh automatico 2 minuti prima della scadenza (token 30min)
  const _scheduleRefresh = (offsetMs = 28 * 60 * 1000) => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = setTimeout(() => {
      refreshAccessToken();
    }, offsetMs);
  };

  // Interceptor axios globale: ritenta con nuovo token se 401, gestendo le code (evita i crash su refresh multipli)
  useEffect(() => {
    let isRefreshing = false;
    let failedQueue = [];

    const processQueue = (error, token = null) => {
      failedQueue.forEach(prom => {
        if (error) {
          prom.reject(error);
        } else {
          prom.resolve(token);
        }
      });
      failedQueue = [];
    };

    const interceptorId = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry &&
          localStorage.getItem('refresh') &&
          !originalRequest.url?.includes('auth/token/refresh')
        ) {
          if (isRefreshing) {
            // Accoda le altre chiamate in attesa del refresh
            return new Promise(function(resolve, reject) {
              failedQueue.push({ resolve, reject });
            })
            .then(token => {
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
              return axios(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const newToken = await refreshAccessToken();
            if (newToken) {
              processQueue(null, newToken);
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              return axios(originalRequest);
            } else {
              processQueue(new Error('Refresh failed'), null);
              return Promise.reject(error);
            }
          } catch (err) {
            processQueue(err, null);
            return Promise.reject(err);
          } finally {
            isRefreshing = false;
          }
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptorId);
  }, []);

  // Recupera il profilo utente se c'è già un token (persistenza login al riavvio)
  useEffect(() => {
    const fetchProfile = async () => {
      if (token && !user) {
        try {
          const profile = await getProfile(token);
          setUser(profile);
          setRole(profile.ruolo);
          localStorage.setItem('role', profile.ruolo);
          _scheduleRefresh();
        } catch {
          // Token scaduto o non valido: prova il refresh
          const newToken = await refreshAccessToken();
          if (newToken) {
            try {
              const profile = await getProfile(newToken);
              setUser(profile);
              setRole(profile.ruolo);
              localStorage.setItem('role', profile.ruolo);
              _scheduleRefresh();
            } catch {
              _doLogout();
            }
          }
        }
      }
    };
    fetchProfile();
  }, [token]);

  const _doLogout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('role');
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
  };

  const loginUser = async (tokens) => {
    setToken(tokens.access);
    localStorage.setItem('access', tokens.access);
    localStorage.setItem('refresh', tokens.refresh);
    const profile = await getProfile(tokens.access);
    setUser(profile);
    setRole(profile.ruolo);
    localStorage.setItem('role', profile.ruolo);
    _scheduleRefresh(); // Avvia il timer di refresh automatico
  };

  const logoutUser = () => {
    _doLogout();
  };

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const profile = await getProfile(token);
      setUser(profile);
      setRole(profile.ruolo);
      localStorage.setItem('role', profile.ruolo);
    } catch {
      const newToken = await refreshAccessToken();
      if (newToken) {
        const profile = await getProfile(newToken);
        setUser(profile);
        setRole(profile.ruolo);
        localStorage.setItem('role', profile.ruolo);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      role,
      isAuthenticated,
      loginUser,
      logoutUser,
      refreshProfile,
      refreshAccessToken
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

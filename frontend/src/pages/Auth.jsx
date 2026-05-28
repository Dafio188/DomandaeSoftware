import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { login, register, googleLogin } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { 
  FaUser, FaLock, FaEnvelope, FaUserTag, FaEye, FaEyeSlash, 
  FaShieldAlt, FaHandshake, FaBriefcase, FaCheckCircle
} from 'react-icons/fa';
import './Auth.css';

// Calcola la forza della password
function getPasswordStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score; // 0-5
}

function PasswordStrengthBar({ password }) {
  const strength = getPasswordStrength(password);
  const levels = ['', 'Molto debole', 'Debole', 'Discreta', 'Buona', 'Ottima'];
  const colors = ['', '#ff453a', '#ff9f0a', '#ffd60a', '#30d158', '#30d158'];
  
  if (!password) return null;
  return (
    <div className="mt-1">
      <div className="d-flex gap-1 mb-1">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{
            height: '4px',
            flex: 1,
            borderRadius: '4px',
            background: i <= strength ? colors[strength] : '#e0e0e0',
            transition: 'background 0.3s ease'
          }} />
        ))}
      </div>
      <small style={{ color: colors[strength], fontSize: '0.75rem', fontWeight: 600 }}>
        {levels[strength]}
      </small>
    </div>
  );
}

function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form Login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form Register
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPassword2, setRegPassword2] = useState('');
  const [regRuolo, setRegRuolo] = useState('cliente');
  const [showRegPassword, setShowRegPassword] = useState(false);

  useEffect(() => {
    if (location.pathname === '/register') setIsSignUp(true);
    else setIsSignUp(false);
  }, [location]);

  // Pulizia errori quando si cambia pannello
  const switchPanel = (toSignUp) => {
    setError('');
    setSuccess('');
    setIsSignUp(toSignUp);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const tokens = await login(username, password);
      await loginUser(tokens);
      navigate('/dashboard');
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (detail && detail.includes('No active account')) {
        setError('Username o password non corretti. Riprova.');
      } else if (err.response?.status === 429) {
        setError('Troppi tentativi. Riprova tra qualche minuto.');
      } else {
        setError('Credenziali non valide. Controlla username e password.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validazioni lato client
    if (regUsername.length < 3) {
      setError('Lo username deve avere almeno 3 caratteri.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) {
      setError('Inserisci un indirizzo email valido.');
      return;
    }
    if (regPassword.length < 8) {
      setError('La password deve avere almeno 8 caratteri.');
      return;
    }
    if (getPasswordStrength(regPassword) < 2) {
      setError('Scegli una password più sicura (aggiungi numeri o simboli).');
      return;
    }
    if (regPassword !== regPassword2) {
      setError('Le password non coincidono. Ricontrolla.');
      return;
    }

    setLoading(true);
    try {
      await register({
        username: regUsername,
        email: regEmail,
        password: regPassword,
        ruolo: regRuolo
      });
      setSuccess('Account creato con successo! Esegui il login per accedere.');
      // Auto-switch al login dopo 1.5 secondi
      setTimeout(() => {
        setUsername(regUsername);
        switchPanel(false);
        setSuccess('');
      }, 1500);
    } catch (err) {
      const data = err.response?.data;
      if (data?.username) {
        setError('Username già in uso. Scegline un altro.');
      } else if (data?.email) {
        setError('Email già registrata. Prova a fare il login o recupera la password.');
      } else if (data?.password) {
        setError('Password non sicura: ' + (Array.isArray(data.password) ? data.password[0] : data.password));
      } else if (data?.detail) {
        setError(data.detail);
      } else {
        setError('Errore nella registrazione. Riprova o contatta il supporto.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const tokens = await googleLogin(credentialResponse.credential, regRuolo);
      await loginUser({ access: tokens.token, refresh: tokens.refresh });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Autenticazione con Google fallita.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className={`auth-container ${isSignUp ? 'right-panel-active' : ''}`}>
        
        {/* ── PANNELLO REGISTRAZIONE ───────────────────────────────── */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleRegister} noValidate>
            <h1 className="auth-h1">Crea Account</h1>
            <p className="auth-p-small">Unisciti a SoftMatch come Cliente o Fornitore</p>

            <div className="auth-input-group">
              <FaUser className="auth-icon" />
              <input
                type="text"
                placeholder="Username (min. 3 caratteri)"
                value={regUsername}
                onChange={e => setRegUsername(e.target.value)}
                required
                minLength="3"
                autoComplete="username"
              />
            </div>
            <div className="auth-input-group">
              <FaEnvelope className="auth-icon" />
              <input
                type="email"
                placeholder="Email professionale"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="auth-input-group">
              <FaLock className="auth-icon" />
              <input
                type={showRegPassword ? 'text' : 'password'}
                placeholder="Password (min. 8 caratteri)"
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                required
                minLength="8"
                autoComplete="new-password"
              />
              <button type="button" className="auth-eye-btn" onClick={() => setShowRegPassword(v => !v)} tabIndex={-1}>
                {showRegPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {regPassword && <PasswordStrengthBar password={regPassword} />}
            <div className="auth-input-group">
              <FaLock className="auth-icon" />
              <input
                type="password"
                placeholder="Conferma password"
                value={regPassword2}
                onChange={e => setRegPassword2(e.target.value)}
                required
                minLength="8"
                autoComplete="new-password"
              />
            </div>

            {/* Selezione ruolo con card visiva */}
            <div className="auth-role-selector">
              <button
                type="button"
                className={`auth-role-card ${regRuolo === 'cliente' ? 'selected' : ''}`}
                onClick={() => setRegRuolo('cliente')}
              >
                <FaBriefcase size={20} className="mb-1" />
                <span>Cliente</span>
                <small>Cerco fornitori</small>
              </button>
              <button
                type="button"
                className={`auth-role-card ${regRuolo === 'fornitore' ? 'selected' : ''}`}
                onClick={() => setRegRuolo('fornitore')}
              >
                <FaHandshake size={20} className="mb-1" />
                <span>Fornitore</span>
                <small>Offro servizi</small>
              </button>
            </div>

            {error && isSignUp && <div className="auth-msg error">{error}</div>}
            {success && isSignUp && <div className="auth-msg success">{success}</div>}

            <button className="auth-btn mt-2" type="submit" disabled={loading}>
              {loading ? 'Creazione in corso...' : 'Registrati'}
            </button>
            
            {/* Link di switch visibile solo su mobile quando l'overlay e' nascosto */}
            <div className="auth-mobile-switch d-md-none">
              Hai già un account? <button type="button" onClick={() => switchPanel(false)}>Accedi</button>
            </div>

            <div className="text-center mt-2 mb-1 small text-muted w-100" style={{fontSize: '0.75rem'}}>oppure continua con</div>
            <div className="w-100 d-flex justify-content-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Autenticazione con Google fallita')}
                text="signup_with"
                theme="outline"
                shape="rectangular"
                width="280px"
              />
            </div>
          </form>
        </div>

        {/* ── PANNELLO LOGIN ───────────────────────────────────────── */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleLogin} noValidate>
            <h1 className="auth-h1">Accedi</h1>
            <p className="auth-p-small">Bentornato su SoftMatch</p>

            <div className="auth-input-group">
              <FaUser className="auth-icon" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="auth-input-group">
              <FaLock className="auth-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button type="button" className="auth-eye-btn" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <Link to="/password-reset" className="auth-forgot">
              Password dimenticata?
            </Link>

            {error && !isSignUp && <div className="auth-msg error">{error}</div>}

            <button className="auth-btn mt-3" type="submit" disabled={loading}>
              {loading ? 'Accesso in corso...' : 'Accedi'}
            </button>

            <div className="auth-mobile-switch d-md-none">
              Nuovo su SoftMatch? <button type="button" onClick={() => switchPanel(true)}>Crea Account</button>
            </div>
            
            <div className="text-center mt-3 mb-2 small text-muted w-100" style={{fontSize: '0.75rem'}}>oppure continua con</div>
            <div className="w-100 d-flex justify-content-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Autenticazione con Google fallita')}
                text="signin_with"
                theme="outline"
                shape="rectangular"
                width="280px"
              />
            </div>
          </form>
        </div>

        {/* ── OVERLAY (PORTA SCORREVOLE) ───────────────────────────── */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <FaShieldAlt size={36} className="mb-3 text-white opacity-75" />
              <h1 className="auth-h1 text-white">Hai già un account?</h1>
              <p className="auth-p">Accedi con le tue credenziali e gestisci i tuoi progetti.</p>
              <button className="auth-btn ghost" onClick={() => switchPanel(false)}>
                Accedi
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <FaHandshake size={36} className="mb-3 text-white opacity-75" />
              <h1 className="auth-h1 text-white">Nuovo su SoftMatch?</h1>
              <p className="auth-p">Registrati gratuitamente come Cliente o Fornitore e inizia a collaborare.</p>
              <button className="auth-btn ghost" onClick={() => switchPanel(true)}>
                Crea Account
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Auth;

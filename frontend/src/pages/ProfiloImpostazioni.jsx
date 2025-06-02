import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  FaUser, 
  FaUserTie, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaLock, 
  FaBell, 
  FaCog, 
  FaSave, 
  FaEye, 
  FaEyeSlash,
  FaEdit,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaCheckCircle,
  FaShieldAlt,
  FaUserCog,
  FaKey,
  FaGlobe,
  FaLanguage
} from 'react-icons/fa';
import './ProfiloImpostazioni.css';

function ProfiloImpostazioni() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('profilo');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Stati per profilo
  const [profiloData, setProfiloData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    telefono: '',
    citta: '',
    bio: '',
    competenze: '',
    linkedin: '',
    github: '',
    portfolio: ''
  });

  // Stati per password
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });

  // Stati per notifiche
  const [notificheData, setNotificheData] = useState({
    email_nuove_richieste: true,
    email_offerte_accettate: true,
    email_messaggi: true,
    push_nuove_richieste: true,
    push_offerte_accettate: true,
    newsletter: false
  });

  // Carica dati utente
  useEffect(() => {
    if (user && token) {
      setProfiloData({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        telefono: user.telefono || '',
        citta: user.citta || '',
        bio: user.bio || '',
        competenze: user.competenze || '',
        linkedin: user.linkedin || '',
        github: user.github || '',
        portfolio: user.portfolio || ''
      });
    }
  }, [user, token]);

  // Gestione salvataggio profilo
  const handleSaveProfilo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.patch('/api/auth/user/', profiloData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Profilo aggiornato con successo!');
    } catch (err) {
      setError('Errore nell\'aggiornamento del profilo: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Gestione cambio password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('Le nuove password non coincidono');
      setLoading(false);
      return;
    }

    if (passwordData.new_password.length < 8) {
      setError('La nuova password deve essere di almeno 8 caratteri');
      setLoading(false);
      return;
    }

    try {
      await axios.post('/api/auth/change-password/', {
        old_password: passwordData.old_password,
        new_password: passwordData.new_password
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Password cambiata con successo!');
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setError('Errore nel cambio password: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Gestione notifiche
  const handleSaveNotifiche = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.patch('/api/auth/notifiche/', notificheData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Preferenze notifiche aggiornate!');
    } catch (err) {
      setError('Errore nell\'aggiornamento notifiche: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profilo', label: 'Profilo', icon: FaUser },
    { id: 'password', label: 'Password', icon: FaLock },
    { id: 'notifiche', label: 'Notifiche', icon: FaBell },
    { id: 'privacy', label: 'Privacy', icon: FaShieldAlt }
  ];

  if (!user) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <FaLock size={64} className="text-muted mb-4" />
          <h3>Accesso negato</h3>
          <p className="text-muted">Devi effettuare l'accesso per visualizzare questa pagina</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profilo-impostazioni min-vh-100 bg-light">
      <div className="container py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div className="avatar-circle bg-primary text-white me-3">
                    <FaUserTie size={32} />
                  </div>
                  <div>
                    <h2 className="mb-1">Impostazioni Account</h2>
                    <p className="text-muted mb-0">
                      Gestisci il tuo profilo, sicurezza e preferenze
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messaggi */}
        {success && (
          <div className="alert alert-success alert-dismissible fade show rounded-4 mb-4" role="alert">
            <FaCheckCircle className="me-2" />
            {success}
            <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
          </div>
        )}

        {error && (
          <div className="alert alert-danger alert-dismissible fade show rounded-4 mb-4" role="alert">
            <FaExclamationTriangle className="me-2" />
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}

        <div className="row">
          {/* Sidebar Tabs */}
          <div className="col-lg-3 mb-4">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-3">
                <div className="nav flex-column">
                  {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        className={`nav-link text-start border-0 rounded-3 mb-2 ${activeTab === tab.id ? 'active bg-primary text-white' : 'text-dark'}`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <Icon className="me-3" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="col-lg-9">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                
                {/* TAB PROFILO */}
                {activeTab === 'profilo' && (
                  <div>
                    <h4 className="mb-4">
                      <FaUser className="me-3 text-primary" />
                      Informazioni Profilo
                    </h4>
                    
                    <form onSubmit={handleSaveProfilo}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Username</label>
                          <input
                            type="text"
                            className="form-control"
                            value={profiloData.username}
                            onChange={(e) => setProfiloData({...profiloData, username: e.target.value})}
                            disabled
                          />
                          <small className="text-muted">Il username non può essere modificato</small>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            value={profiloData.email}
                            onChange={(e) => setProfiloData({...profiloData, email: e.target.value})}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Nome</label>
                          <input
                            type="text"
                            className="form-control"
                            value={profiloData.first_name}
                            onChange={(e) => setProfiloData({...profiloData, first_name: e.target.value})}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Cognome</label>
                          <input
                            type="text"
                            className="form-control"
                            value={profiloData.last_name}
                            onChange={(e) => setProfiloData({...profiloData, last_name: e.target.value})}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Telefono</label>
                          <input
                            type="tel"
                            className="form-control"
                            value={profiloData.telefono}
                            onChange={(e) => setProfiloData({...profiloData, telefono: e.target.value})}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Città</label>
                          <input
                            type="text"
                            className="form-control"
                            value={profiloData.citta}
                            onChange={(e) => setProfiloData({...profiloData, citta: e.target.value})}
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-bold">Bio Professionale</label>
                          <textarea
                            className="form-control"
                            rows="4"
                            value={profiloData.bio}
                            onChange={(e) => setProfiloData({...profiloData, bio: e.target.value})}
                            placeholder="Descrivi le tue competenze e esperienza..."
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label fw-bold">Competenze</label>
                          <input
                            type="text"
                            className="form-control"
                            value={profiloData.competenze}
                            onChange={(e) => setProfiloData({...profiloData, competenze: e.target.value})}
                            placeholder="es: React, Node.js, Python, AI..."
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-bold">LinkedIn</label>
                          <input
                            type="url"
                            className="form-control"
                            value={profiloData.linkedin}
                            onChange={(e) => setProfiloData({...profiloData, linkedin: e.target.value})}
                            placeholder="https://linkedin.com/in/..."
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-bold">GitHub</label>
                          <input
                            type="url"
                            className="form-control"
                            value={profiloData.github}
                            onChange={(e) => setProfiloData({...profiloData, github: e.target.value})}
                            placeholder="https://github.com/..."
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-bold">Portfolio</label>
                          <input
                            type="url"
                            className="form-control"
                            value={profiloData.portfolio}
                            onChange={(e) => setProfiloData({...profiloData, portfolio: e.target.value})}
                            placeholder="https://mio-portfolio.com"
                          />
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-end mt-4">
                        <button type="submit" className="btn btn-primary btn-lg rounded-pill px-4" disabled={loading}>
                          <FaSave className="me-2" />
                          {loading ? 'Salvando...' : 'Salva Modifiche'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* TAB PASSWORD */}
                {activeTab === 'password' && (
                  <div>
                    <h4 className="mb-4">
                      <FaLock className="me-3 text-primary" />
                      Cambio Password
                    </h4>
                    
                    <form onSubmit={handleChangePassword}>
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label fw-bold">Password Attuale</label>
                          <div className="input-group">
                            <input
                              type={showPasswords.old ? 'text' : 'password'}
                              className="form-control"
                              value={passwordData.old_password}
                              onChange={(e) => setPasswordData({...passwordData, old_password: e.target.value})}
                              required
                            />
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => setShowPasswords({...showPasswords, old: !showPasswords.old})}
                            >
                              {showPasswords.old ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Nuova Password</label>
                          <div className="input-group">
                            <input
                              type={showPasswords.new ? 'text' : 'password'}
                              className="form-control"
                              value={passwordData.new_password}
                              onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                              required
                              minLength="8"
                            />
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                            >
                              {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold">Conferma Nuova Password</label>
                          <div className="input-group">
                            <input
                              type={showPasswords.confirm ? 'text' : 'password'}
                              className="form-control"
                              value={passwordData.confirm_password}
                              onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                              required
                              minLength="8"
                            />
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                            >
                              {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="alert alert-info border-0 rounded-3 mt-3">
                        <FaKey className="me-2" />
                        <strong>Requisiti password:</strong> Almeno 8 caratteri, una maiuscola, una minuscola e un numero
                      </div>
                      
                      <div className="d-flex justify-content-end mt-4">
                        <button type="submit" className="btn btn-warning btn-lg rounded-pill px-4" disabled={loading}>
                          <FaLock className="me-2" />
                          {loading ? 'Cambiando...' : 'Cambia Password'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* TAB NOTIFICHE */}
                {activeTab === 'notifiche' && (
                  <div>
                    <h4 className="mb-4">
                      <FaBell className="me-3 text-primary" />
                      Preferenze Notifiche
                    </h4>
                    
                    <div className="row g-4">
                      <div className="col-12">
                        <h6 className="fw-bold text-secondary mb-3">Notifiche Email</h6>
                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={notificheData.email_nuove_richieste}
                            onChange={(e) => setNotificheData({...notificheData, email_nuove_richieste: e.target.checked})}
                          />
                          <label className="form-check-label fw-bold">
                            Nuove richieste nel tuo settore
                          </label>
                          <div className="text-muted small">Ricevi email quando vengono pubblicate nuove richieste</div>
                        </div>
                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={notificheData.email_offerte_accettate}
                            onChange={(e) => setNotificheData({...notificheData, email_offerte_accettate: e.target.checked})}
                          />
                          <label className="form-check-label fw-bold">
                            Offerte accettate
                          </label>
                          <div className="text-muted small">Notifica quando una tua offerta viene accettata</div>
                        </div>
                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={notificheData.email_messaggi}
                            onChange={(e) => setNotificheData({...notificheData, email_messaggi: e.target.checked})}
                          />
                          <label className="form-check-label fw-bold">
                            Messaggi diretti
                          </label>
                          <div className="text-muted small">Email per nuovi messaggi dai clienti</div>
                        </div>
                      </div>
                      
                      <div className="col-12">
                        <h6 className="fw-bold text-secondary mb-3">Notifiche Push</h6>
                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={notificheData.push_nuove_richieste}
                            onChange={(e) => setNotificheData({...notificheData, push_nuove_richieste: e.target.checked})}
                          />
                          <label className="form-check-label fw-bold">
                            Notifiche push nuove richieste
                          </label>
                        </div>
                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={notificheData.push_offerte_accettate}
                            onChange={(e) => setNotificheData({...notificheData, push_offerte_accettate: e.target.checked})}
                          />
                          <label className="form-check-label fw-bold">
                            Notifiche push offerte accettate
                          </label>
                        </div>
                      </div>
                      
                      <div className="col-12">
                        <h6 className="fw-bold text-secondary mb-3">Marketing</h6>
                        <div className="form-check form-switch mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={notificheData.newsletter}
                            onChange={(e) => setNotificheData({...notificheData, newsletter: e.target.checked})}
                          />
                          <label className="form-check-label fw-bold">
                            Newsletter TechnoBridge
                          </label>
                          <div className="text-muted small">Aggiornamenti, consigli e nuove funzionalità</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="d-flex justify-content-end mt-4">
                      <button onClick={handleSaveNotifiche} className="btn btn-success btn-lg rounded-pill px-4" disabled={loading}>
                        <FaBell className="me-2" />
                        {loading ? 'Salvando...' : 'Salva Preferenze'}
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB PRIVACY */}
                {activeTab === 'privacy' && (
                  <div>
                    <h4 className="mb-4">
                      <FaShieldAlt className="me-3 text-primary" />
                      Privacy e Sicurezza
                    </h4>
                    
                    <div className="row g-4">
                      <div className="col-12">
                        <div className="card bg-light border-0 rounded-3">
                          <div className="card-body">
                            <h6 className="fw-bold text-success mb-3">
                              <FaCheckCircle className="me-2" />
                              Account Sicuro
                            </h6>
                            <p className="text-muted">
                              Il tuo account è protetto con autenticazione sicura e crittografia avanzata.
                              Tutti i tuoi dati personali sono trattati secondo le normative GDPR.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-12">
                        <h6 className="fw-bold text-secondary mb-3">Gestione Dati</h6>
                        <div className="d-grid gap-2">
                          <button className="btn btn-outline-info rounded-pill">
                            <FaUser className="me-2" />
                            Scarica i tuoi dati
                          </button>
                          <button className="btn btn-outline-warning rounded-pill">
                            <FaEdit className="me-2" />
                            Richiedi modifica dati
                          </button>
                          <button className="btn btn-outline-danger rounded-pill">
                            <FaTimes className="me-2" />
                            Elimina account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfiloImpostazioni; 
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  FaUser, FaUserTie, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaBell, FaCog, FaSave, FaEye, FaEyeSlash,
  FaEdit, FaCheck, FaTimes, FaExclamationTriangle, FaCheckCircle, FaShieldAlt, FaUserCog, FaKey, FaGlobe, FaLanguage,
  FaLinkedin, FaGithub, FaExternalLinkAlt, FaCreditCard, FaInfoCircle, FaArrowRight, FaShieldVirus
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { API_BASE } from '../config/api.js';

function ProfiloImpostazioni() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('profilo');
  const [loading, setLoading] = useState(false);

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
    portfolio: '',
    iban: '',
    iban_intestatario: ''
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
        portfolio: user.portfolio || '',
        iban: user.iban || '',
        iban_intestatario: user.iban_intestatario || ''
      });
    }
  }, [user, token]);

  // Gestione salvataggio profilo
  const handleSaveProfilo = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.patch(`${API_BASE}auth/user/`, profiloData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Profilo aggiornato con successo! ✨');
    } catch (err) {
      toast.error('Errore nell\'aggiornamento: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Gestione cambio password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('Le nuove password non coincidono');
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API_BASE}auth/change-password/`, {
        old_password: passwordData.old_password,
        new_password: passwordData.new_password
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Password cambiata correttamente 🔒');
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
    } finally {
      setLoading(false);
    }
  };

  // Funzione per scaricare i dati (GDPR)
  const handleDownloadData = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
        account: { username: user.username, email: user.email, ruolo: user.ruolo },
        profilo: profiloData,
        timestamp: new Date().toISOString()
      }, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `softmatch_dati_${user.username}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      toast.info('Archivio dati generato e scaricato! 📂');
    } catch (err) {
      toast.error('Errore nella generazione dell\'archivio');
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
        <div className="mac-glass-card p-5 text-center shadow-lg">
          <FaLock size={64} className="text-muted mb-4" />
          <h3 className="mac-title">Accesso negato</h3>
          <p className="mac-subtitle">Devi effettuare l'accesso per visualizzare questa pagina</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profilo-impostazioni py-4">
        {/* Header - Mac Style */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="mac-glass-card p-5 overflow-hidden position-relative border-0 shadow-lg" style={{borderRadius: '30px'}}>
               <div className="position-absolute top-0 end-0 p-4 opacity-10">
                 <FaUserCog size={150} />
               </div>
               <div className="row align-items-center position-relative" style={{zIndex: 2}}>
                 <div className="col-auto">
                    <div className="avatar-circle-lg bg-primary bg-gradient text-white shadow-lg d-flex align-items-center justify-content-center" style={{width: 100, height: 100, borderRadius: '28px'}}>
                      <FaUserTie size={48} />
                    </div>
                 </div>
                 <div className="col">
                   <h1 className="mac-title mb-2 h2">Impostazioni Account</h1>
                   <p className="mac-subtitle mb-0 fs-5">
                     Gestisci la tua identità e le tue preferenze su <span className="text-primary fw-bold">SoftMatch</span>
                   </p>
                 </div>
               </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Sidebar Tabs - Mac Style Navigation */}
          <div className="col-lg-3 mb-4">
            <div className="mac-glass-card p-3 border-0 shadow-sm sticky-top" style={{ top: '100px', borderRadius: '25px' }}>
              <div className="nav flex-column gap-2">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      className={`btn mac-button text-start d-flex align-items-center mb-1 ${activeTab === tab.id ? 'btn-primary shadow active-tab' : 'btn-light-transparent'}`}
                      onClick={() => setActiveTab(tab.id)}
                      style={{ padding: '12px 20px', borderRadius: '15px' }}
                    >
                      <div className={`p-2 rounded-3 me-3 d-flex align-items-center justify-content-center ${activeTab === tab.id ? 'bg-white bg-opacity-20' : 'bg-primary bg-opacity-10 text-primary'}`}>
                        <Icon size={18} />
                      </div>
                      <span className="fw-bold">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-4 pt-4 border-top">
                <div className="p-3 rounded-4 bg-light bg-opacity-50 text-center">
                  <small className="text-muted d-block mb-2">Sicurezza Account</small>
                  <div className="progress" style={{height: '6px', borderRadius: '10px'}}>
                    <div className="progress-bar bg-success" style={{width: '85%'}}></div>
                  </div>
                  <small className="text-success fw-bold d-block mt-2" style={{fontSize: '0.7rem'}}>Status: Protetto</small>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="col-lg-9">
            <div className="mac-glass-card p-5 border-0 shadow-sm" style={{borderRadius: '30px'}}>
                
                {/* TAB PROFILO */}
                {activeTab === 'profilo' && (
                  <div className="animated-fade-in">
                    <div className="d-flex justify-content-between align-items-center mb-5">
                      <h4 className="mac-title mb-0">
                        <FaUser className="me-2 text-primary" />
                        Dati Personali
                      </h4>
                      <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2">
                        Professionista Verificato
                      </span>
                    </div>
                    
                    <form onSubmit={handleSaveProfilo}>
                      <div className="row g-4">
                        <div className="col-md-6">
                           <div className="mac-form-group">
                              <label className="mac-label">Username</label>
                              <div className="input-group">
                                <span className="input-group-text bg-light border-0"><FaUser className="text-muted" /></span>
                                <input type="text" className="form-control mac-input" value={profiloData.username} disabled />
                              </div>
                           </div>
                        </div>
                        <div className="col-md-6">
                           <div className="mac-form-group">
                              <label className="mac-label">Email Professionale</label>
                              <div className="input-group">
                                <span className="input-group-text bg-light border-0"><FaEnvelope className="text-muted" /></span>
                                <input type="email" className="form-control mac-input" value={profiloData.email} required onChange={(e) => setProfiloData({...profiloData, email: e.target.value})} />
                              </div>
                           </div>
                        </div>
                        <div className="col-md-6">
                           <div className="mac-form-group">
                              <label className="mac-label">Nome</label>
                              <input type="text" className="form-control mac-input" value={profiloData.first_name} onChange={(e) => setProfiloData({...profiloData, first_name: e.target.value})} />
                           </div>
                        </div>
                        <div className="col-md-6">
                           <div className="mac-form-group">
                              <label className="mac-label">Cognome</label>
                              <input type="text" className="form-control mac-input" value={profiloData.last_name} onChange={(e) => setProfiloData({...profiloData, last_name: e.target.value})} />
                           </div>
                        </div>
                        
                        <div className="col-12 mt-4">
                          <h5 className="mac-title mb-3 border-bottom pb-2">Dettagli Professionali</h5>
                        </div>

                        <div className="col-12">
                           <div className="mac-form-group">
                              <label className="mac-label">Bio / Presentazione</label>
                              <textarea className="form-control mac-input px-3 py-3" rows="4" value={profiloData.bio} onChange={(e) => setProfiloData({...profiloData, bio: e.target.value})} placeholder="Descrivi il tuo percorso e cosa sai fare meglio..." />
                           </div>
                        </div>
                        <div className="col-12">
                           <div className="mac-form-group">
                              <label className="mac-label">Competenze Principali (Skill Tags)</label>
                              <input type="text" className="form-control mac-input" value={profiloData.competenze} onChange={(e) => setProfiloData({...profiloData, competenze: e.target.value})} placeholder="Esempio: React, Python, UI Design, Project Management..." />
                           </div>
                        </div>

                        <div className="col-md-4">
                           <div className="mac-form-group">
                              <label className="mac-label"><FaLinkedin className="text-primary me-2" /> LinkedIn</label>
                              <input type="url" className="form-control mac-input" value={profiloData.linkedin} onChange={(e) => setProfiloData({...profiloData, linkedin: e.target.value})} placeholder="https://..." />
                           </div>
                        </div>
                        <div className="col-md-4">
                           <div className="mac-form-group">
                              <label className="mac-label"><FaGithub className="text-dark me-2" /> GitHub</label>
                              <input type="url" className="form-control mac-input" value={profiloData.github} onChange={(e) => setProfiloData({...profiloData, github: e.target.value})} placeholder="https://..." />
                           </div>
                        </div>
                        <div className="col-md-4">
                           <div className="mac-form-group">
                              <label className="mac-label"><FaExternalLinkAlt className="text-success me-2" /> Portfolio</label>
                              <input type="url" className="form-control mac-input" value={profiloData.portfolio} onChange={(e) => setProfiloData({...profiloData, portfolio: e.target.value})} placeholder="https://..." />
                           </div>
                        </div>

                        {user?.ruolo === 'fornitore' && (
                          <div className="col-12 mt-4">
                            <div className="p-4 rounded-4 bg-primary bg-opacity-5 border border-primary border-opacity-10">
                              <h5 className="mac-title text-primary mb-3 d-flex align-items-center">
                                <FaCreditCard className="me-2" /> Dati per i Pagamenti (Accrediti)
                              </h5>
                              <div className="row g-3">
                                <div className="col-md-8">
                                   <div className="mac-form-group mb-0">
                                      <label className="mac-label">IBAN</label>
                                      <input type="text" className="form-control mac-input" value={profiloData.iban} onChange={(e) => setProfiloData({ ...profiloData, iban: e.target.value.toUpperCase() })} placeholder="IT..." />
                                   </div>
                                </div>
                                <div className="col-md-4">
                                   <div className="mac-form-group mb-0">
                                      <label className="mac-label">Intestatario</label>
                                      <input type="text" className="form-control mac-input" value={profiloData.iban_intestatario} onChange={(e) => setProfiloData({ ...profiloData, iban_intestatario: e.target.value })} placeholder="Nome Cognome" />
                                   </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="d-flex justify-content-end mt-5">
                        <button type="submit" className="btn btn-primary mac-button btn-lg px-5 shadow-sm" disabled={loading}>
                          {loading ? 'Sincronizzazione...' : <><FaSave className="me-2" /> Salva Profilo</>}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* TAB PASSWORD */}
                {activeTab === 'password' && (
                  <div className="animated-fade-in">
                    <h4 className="mac-title mb-5">
                      <FaLock className="me-2 text-primary" />
                      Sicurezza & Password
                    </h4>
                    
                    <form onSubmit={handleChangePassword}>
                      <div className="row g-4">
                        <div className="col-12">
                           <div className="mac-form-group">
                              <label className="mac-label">Password Attuale</label>
                              <div className="input-group">
                                <input type={showPasswords.old ? 'text' : 'password'} className="form-control mac-input" value={passwordData.old_password} onChange={(e) => setPasswordData({...passwordData, old_password: e.target.value})} required />
                                <button type="button" className="btn btn-outline-light text-dark border-0" onClick={() => setShowPasswords({...showPasswords, old: !showPasswords.old})}>
                                  {showPasswords.old ? <FaEyeSlash /> : <FaEye />}
                                </button>
                              </div>
                           </div>
                        </div>
                        <div className="col-md-6">
                           <div className="mac-form-group">
                              <label className="mac-label">Nuova Password</label>
                              <div className="input-group">
                                <input type={showPasswords.new ? 'text' : 'password'} className="form-control mac-input" value={passwordData.new_password} onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})} required minLength="8" />
                                <button type="button" className="btn btn-outline-light text-dark border-0" onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}>
                                  {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                                </button>
                              </div>
                           </div>
                        </div>
                        <div className="col-md-6">
                           <div className="mac-form-group">
                              <label className="mac-label">Conferma Nuova Password</label>
                              <div className="input-group">
                                <input type={showPasswords.confirm ? 'text' : 'password'} className="form-control mac-input" value={passwordData.confirm_password} onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})} required minLength="8" />
                                <button type="button" className="btn btn-outline-light text-dark border-0" onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}>
                                  {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                                </button>
                              </div>
                           </div>
                        </div>
                      </div>
                      
                      <div className="alert bg-primary bg-opacity-5 border-0 rounded-4 mt-5 d-flex align-items-center p-4">
                        <FaShieldVirus className="text-primary me-4" size={32} />
                        <div>
                          <strong>Proteggi il tuo account:</strong> Usa almeno 8 caratteri, combinando lettere maiuscole, minuscole, numeri e simboli per una protezione massimale.
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-end mt-5">
                        <button type="submit" className="btn btn-primary mac-button btn-lg px-5 shadow-sm" disabled={loading}>
                          {loading ? 'Aggiornamento...' : <><FaKey className="me-2" /> Cambia Password</>}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* TAB NOTIFICHE */}
                {activeTab === 'notifiche' && (
                  <div className="animated-fade-in">
                    <h4 className="mac-title mb-5">
                      <FaBell className="me-2 text-primary" />
                      Preferenze Notifiche
                    </h4>
                    
                    <div className="row g-4">
                      {/* Esempio switch notifiche migliorato */}
                      <div className="col-12">
                        <div className="mac-glass-card p-4 bg-light bg-opacity-30 border-0 mb-3">
                           <div className="d-flex justify-content-between align-items-center">
                             <div>
                               <h6 className="mac-title mb-1">Nuove Richieste</h6>
                               <p className="mac-subtitle small mb-0">Inviaci una email ogni volta che c'è un'opportunità nel tuo ambito.</p>
                             </div>
                             <div className="form-check form-switch">
                               <input className="form-check-input" type="checkbox" defaultChecked />
                             </div>
                           </div>
                        </div>
                        <div className="mac-glass-card p-4 bg-light bg-opacity-30 border-0 mb-3">
                           <div className="d-flex justify-content-between align-items-center">
                             <div>
                               <h6 className="mac-title mb-1">Accettazione Offerte</h6>
                               <p className="mac-subtitle small mb-0">Notifica istantanea quando una trattativa va a buon fine.</p>
                             </div>
                             <div className="form-check form-switch">
                               <input className="form-check-input" type="checkbox" defaultChecked />
                             </div>
                           </div>
                        </div>
                        <div className="mac-glass-card p-4 bg-light bg-opacity-30 border-0">
                           <div className="d-flex justify-content-between align-items-center">
                             <div>
                               <h6 className="mac-title mb-1">Messaggi Diretti</h6>
                               <p className="mac-subtitle small mb-0">Ricevi notifiche per le conversazioni con altri utenti.</p>
                             </div>
                             <div className="form-check form-switch">
                               <input className="form-check-input" type="checkbox" defaultChecked />
                             </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB PRIVACY */}
                {activeTab === 'privacy' && (
                  <div className="animated-fade-in">
                    <h4 className="mac-title mb-5">
                      <FaShieldAlt className="me-2 text-primary" />
                      Privacy & Dati
                    </h4>
                    
                    <div className="row g-4">
                      <div className="col-12">
                        <div className="alert border-0 rounded-4 p-4 mb-4 shadow-sm" style={{ backgroundColor: '#198754' }}>
                          <h6 className="mac-title text-white mb-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                            <FaShieldAlt className="me-2" /> Conforme al GDPR
                          </h6>
                          <p className="mb-0 small text-white text-opacity-95" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                            Tutti i tuoi dati sono criptati e gestiti secondo le direttive europee sulla privacy.
                            Non condividiamo le tue informazioni personali con terze parti non autorizzate.
                          </p>
                        </div>
                        
                        <div className="mac-glass-card p-4 border-0">
                           <div className="d-grid gap-3">
                              <button 
                                className="btn btn-outline-dark mac-button text-start d-flex align-items-center"
                                onClick={handleDownloadData}
                              >
                                <FaExternalLinkAlt className="me-3" /> Scarica copia dei miei dati
                              </button>
                              <button className="btn btn-outline-danger mac-button text-start">
                                <FaTimes className="me-2" /> Richiedi cancellazione account
                              </button>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
        
        {/* CSS PERSONALIZZATO - Injected for Premium Effect */}
        <style dangerouslySetInnerHTML={{ __html: `
          .animated-fade-in {
            animation: fadeIn 0.4s ease-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .mac-form-group {
            margin-bottom: 0.5rem;
          }
          .mac-label {
            font-weight: 600;
            font-size: 0.9rem;
            margin-bottom: 8px;
            color: #1d1d1f;
            display: block;
          }
          .mac-input {
            border-radius: 12px;
            padding: 12px 15px;
            border: 1px solid rgba(0,0,0,0.1);
            background-color: rgba(255,255,255,0.7);
            font-size: 0.95rem;
            transition: all 0.2s ease;
          }
          .mac-input:focus {
            background-color: #fff;
            border-color: #0071e3;
            box-shadow: 0 0 0 4px rgba(0,113,227,0.15);
          }
          .active-tab {
            transform: scale(1.02);
          }
          .btn-light-transparent {
            background: transparent;
            color: #1d1d1f;
          }
          .btn-light-transparent:hover {
            background: rgba(0,0,0,0.03);
          }
        ` }} />
    </div>
  );
}

export default ProfiloImpostazioni;

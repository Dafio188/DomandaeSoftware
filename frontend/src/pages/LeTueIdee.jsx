import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  FaLightbulb, 
  FaComments, 
  FaHeart,
  FaThumbsUp,
  FaThumbsDown,
  FaStar,
  FaUser,
  FaUserTie,
  FaCrown,
  FaPaperPlane,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaPlus,
  FaFilter,
  FaSearch,
  FaTag,
  FaClock,
  FaEye,
  FaRocket,
  FaShieldAlt,
  FaLock
} from 'react-icons/fa';
import './LeTueIdee.css';

function LeTueIdee() {
  const { user, token } = useAuth();
  const [idee, setIdee] = useState([]);
  const [nuovaIdea, setNuovaIdea] = useState('');
  const [categoria, setCategoria] = useState('miglioramento');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('tutte');
  const [searchTerm, setSearchTerm] = useState('');

  const categorie = [
    { value: 'miglioramento', label: 'Miglioramento Piattaforma', icon: '🔧', color: '#007bff' },
    { value: 'nuova_funzionalita', label: 'Nuova Funzionalità', icon: '✨', color: '#28a745' },
    { value: 'bug_report', label: 'Segnalazione Bug', icon: '🐛', color: '#dc3545' },
    { value: 'ux_ui', label: 'Miglioramento UX/UI', icon: '🎨', color: '#6f42c1' },
    { value: 'sicurezza', label: 'Sicurezza e Privacy', icon: '🔒', color: '#fd7e14' },
    { value: 'generale', label: 'Suggerimento Generale', icon: '💡', color: '#ffc107' }
  ];

  useEffect(() => {
    if (token && user) {
      caricaIdee();
    } else {
      setLoading(false);
    }
  }, [token, user]);

  const caricaIdee = async () => {
    try {
      const response = await axios.get('/api/idee/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIdee(response.data);
      setLoading(false);
    } catch (err) {
      setError('Errore nel caricamento delle idee');
      setLoading(false);
    }
  };

  const inviaIdea = async (e) => {
    e.preventDefault();
    if (!nuovaIdea.trim()) return;
    
    setSending(true);
    setError('');
    
    try {
      await axios.post('/api/idee/', {
        testo: nuovaIdea.trim(),
        categoria
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess('Idea inviata con successo! Grazie per il tuo contributo.');
      setNuovaIdea('');
      setCategoria('miglioramento');
      caricaIdee();
      
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError('Errore nell\'invio dell\'idea');
    }
    
    setSending(false);
  };

  const votaIdea = async (ideaId, voto) => {
    try {
      await axios.post(`/api/idee/${ideaId}/vota/`, {
        voto
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      caricaIdee(); // Ricarica per aggiornare i voti
    } catch (err) {
      setError('Errore nella votazione');
      setTimeout(() => setError(''), 3000);
    }
  };

  const ideeFiltrate = idee.filter(idea => {
    const matchCategoria = filtroCategoria === 'tutte' || idea.categoria === filtroCategoria;
    const matchSearch = idea.testo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       idea.autore_username.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategoria && matchSearch;
  });

  if (!user) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <FaLock size={64} className="text-muted mb-4" />
          <h3 className="text-muted mb-3">Accesso Riservato</h3>
          <p className="text-muted mb-4">
            Per condividere le tue idee e visualizzare quelle della community, 
            devi essere registrato e aver effettuato l'accesso.
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <a href="/login" className="btn btn-primary px-4">
              <FaUser className="me-2" />
              Accedi
            </a>
            <a href="/register" className="btn btn-outline-primary px-4">
              <FaPlus className="me-2" />
              Registrati
            </a>
          </div>
          <div className="mt-4">
            <small className="text-muted">
              <FaShieldAlt className="me-2" />
              I tuoi dati sono protetti e mantenuti in massima sicurezza
            </small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-gradient idee-page">
      {/* Hero Section */}
      <div className="hero-section bg-primary text-white position-relative overflow-hidden">
        <div className="container py-5 position-relative z-2">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="display-3 fw-bold mb-4">
                <FaLightbulb className="me-3 text-warning" />
                Le Tue Idee
              </h1>
              <p className="lead mb-4 opacity-90">
                <strong>Aiutaci a migliorare!</strong> Condividi le tue idee, suggerimenti e feedback 
                per rendere la piattaforma sempre migliore. La tua voce conta!
              </p>
              <div className="stats-row">
                <div className="row g-3 justify-content-center">
                  <div className="col-auto">
                    <div className="stat-badge">
                      <FaComments className="me-2" />
                      {idee.length} Idee Condivise
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="stat-badge">
                      <FaHeart className="me-2" />
                      Community Attiva
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="stat-badge">
                      <FaRocket className="me-2" />
                      Miglioramento Continuo
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-decoration"></div>
      </div>

      <div className="container py-5">
        {/* Form Nuova Idea */}
        <div className="card border-0 shadow-lg rounded-4 mb-5">
          <div className="card-header bg-gradient-success text-white border-0 rounded-top-4 p-4">
            <div className="d-flex align-items-center">
              <FaPlus className="me-3" size={24} />
              <div>
                <h4 className="mb-0">Condividi la Tua Idea</h4>
                <small className="opacity-75">Ogni suggerimento è prezioso per migliorare la piattaforma</small>
              </div>
            </div>
          </div>
          <div className="card-body p-4">
            <form onSubmit={inviaIdea}>
              <div className="row g-4">
                <div className="col-md-4">
                  <label className="form-label fw-bold">
                    <FaTag className="me-2 text-primary" />
                    Categoria
                  </label>
                  <select 
                    className="form-select rounded-pill" 
                    value={categoria} 
                    onChange={(e) => setCategoria(e.target.value)}
                  >
                    {categorie.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-8">
                  <label className="form-label fw-bold">
                    <FaLightbulb className="me-2 text-warning" />
                    La Tua Idea o Suggerimento
                  </label>
                  <textarea 
                    className="form-control rounded-3" 
                    rows="4"
                    placeholder="Descrivi la tua idea in dettaglio... Più informazioni fornisci, meglio potremo valutare e implementare il tuo suggerimento!"
                    value={nuovaIdea}
                    onChange={(e) => setNuovaIdea(e.target.value)}
                    required
                    maxLength="1000"
                  />
                  <div className="d-flex justify-content-between mt-2">
                    <small className="text-muted">
                      <FaShieldAlt className="me-1" />
                      I tuoi dati sono protetti e utilizzati solo per migliorare il servizio
                    </small>
                    <small className="text-muted">
                      {nuovaIdea.length}/1000 caratteri
                    </small>
                  </div>
                </div>
              </div>
              
              <div className="d-flex justify-content-end mt-4">
                <button 
                  type="submit" 
                  className="btn btn-success btn-lg px-5 rounded-pill"
                  disabled={sending || !nuovaIdea.trim()}
                >
                  {sending ? (
                    <>
                      <FaSpinner className="fa-spin me-2" />
                      Invio in corso...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="me-2" />
                      Condividi Idea
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Filtri e Ricerca */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <div className="row g-3 align-items-center">
              <div className="col-md-4">
                <label className="form-label fw-bold small">
                  <FaFilter className="me-2 text-primary" />
                  Filtra per Categoria
                </label>
                <select 
                  className="form-select rounded-pill" 
                  value={filtroCategoria} 
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                >
                  <option value="tutte">🌟 Tutte le Categorie</option>
                  {categorie.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold small">
                  <FaSearch className="me-2 text-info" />
                  Cerca nelle Idee
                </label>
                <input 
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="Cerca per parole chiave o nome utente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <div className="text-center">
                  <small className="text-muted fw-bold d-block">Risultati</small>
                  <span className="badge bg-primary rounded-pill px-3 py-2">
                    {ideeFiltrate.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista Idee */}
        {loading ? (
          <div className="text-center py-5">
            <FaSpinner className="fa-spin text-primary" size={48} />
            <h5 className="mt-3 text-muted">Caricamento idee...</h5>
          </div>
        ) : ideeFiltrate.length > 0 ? (
          <div className="idee-grid">
            {ideeFiltrate.map((idea) => {
              const categoriaInfo = categorie.find(c => c.value === idea.categoria);
              return (
                <div key={idea.id} className="idea-card">
                  <div className="idea-header">
                    <div className="categoria-badge" style={{ backgroundColor: categoriaInfo?.color }}>
                      <span>{categoriaInfo?.icon}</span>
                      <small>{categoriaInfo?.label}</small>
                    </div>
                    <div className="autore-info">
                      {idea.autore_ruolo === 'amministratore' ? (
                        <FaCrown className="text-warning" />
                      ) : idea.autore_ruolo === 'fornitore' ? (
                        <FaUserTie className="text-primary" />
                      ) : (
                        <FaUser className="text-success" />
                      )}
                      <span className="ms-2 fw-bold">{idea.autore_username}</span>
                      <small className="text-muted ms-2">
                        {idea.autore_ruolo === 'amministratore' ? 'Admin' : 
                         idea.autore_ruolo === 'fornitore' ? 'Sviluppatore' : 'Cliente'}
                      </small>
                    </div>
                  </div>
                  
                  <div className="idea-content">
                    <p className="mb-3">{idea.testo}</p>
                  </div>
                  
                  <div className="idea-footer">
                    <div className="idea-stats">
                      <span className="stat-item">
                        <FaClock className="me-1 text-muted" />
                        <small className="text-muted">
                          {new Date(idea.data_creazione).toLocaleDateString('it-IT')}
                        </small>
                      </span>
                      <span className="stat-item">
                        <FaEye className="me-1 text-muted" />
                        <small className="text-muted">{idea.visualizzazioni || 0} visualizzazioni</small>
                      </span>
                    </div>
                    
                    <div className="idea-actions">
                      <button 
                        className="btn btn-sm btn-outline-success rounded-pill"
                        onClick={() => votaIdea(idea.id, 'positivo')}
                        disabled={idea.ha_votato}
                      >
                        <FaThumbsUp className="me-1" />
                        {idea.voti_positivi || 0}
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger rounded-pill"
                        onClick={() => votaIdea(idea.id, 'negativo')}
                        disabled={idea.ha_votato}
                      >
                        <FaThumbsDown className="me-1" />
                        {idea.voti_negativi || 0}
                      </button>
                    </div>
                  </div>
                  
                  {idea.risposta_admin && (
                    <div className="admin-response">
                      <div className="response-header">
                        <FaCrown className="text-warning me-2" />
                        <strong>Risposta dell'Amministrazione</strong>
                      </div>
                      <p className="mb-0 mt-2">{idea.risposta_admin}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-5">
            <FaComments size={64} className="text-muted mb-4" />
            <h4 className="text-muted mb-3">Nessuna idea trovata</h4>
            <p className="text-muted">
              {searchTerm || filtroCategoria !== 'tutte' 
                ? 'Prova a modificare i filtri di ricerca'
                : 'Sii il primo a condividere un\'idea!'
              }
            </p>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="card border-0 bg-light rounded-4 mt-5">
          <div className="card-body p-4">
            <div className="text-center">
              <FaShieldAlt size={40} className="text-success mb-3" />
              <h5 className="fw-bold text-primary mb-3">Privacy e Sicurezza dei Tuoi Dati</h5>
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="privacy-point">
                    <h6 className="fw-bold text-success">🔒 Dati Protetti</h6>
                    <small className="text-muted">
                      Le tue idee sono memorizzate su server sicuri con crittografia avanzata
                    </small>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="privacy-point">
                    <h6 className="fw-bold text-info">👥 Solo Utenti Autenticati</h6>
                    <small className="text-muted">
                      Solo utenti registrati possono visualizzare e interagire con le idee
                    </small>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="privacy-point">
                    <h6 className="fw-bold text-warning">🎯 Finalità Specifica</h6>
                    <small className="text-muted">
                      I dati sono utilizzati esclusivamente per migliorare la piattaforma
                    </small>
                  </div>
                </div>
              </div>
              <div className="alert alert-info border-0 rounded-3 mt-4">
                <small>
                  <FaShieldAlt className="me-2" />
                  <strong>Conformità GDPR:</strong> Puoi richiedere la modifica o cancellazione 
                  delle tue idee contattando l'amministrazione. I tuoi dati non vengono mai 
                  condivisi con terze parti.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {success && (
        <div className="alert alert-success border-0 rounded-4 shadow-sm position-fixed bottom-0 end-0 m-4" style={{ zIndex: 1050 }}>
          <FaCheckCircle className="me-2" />
          {success}
        </div>
      )}
      {error && (
        <div className="alert alert-danger border-0 rounded-4 shadow-sm position-fixed bottom-0 end-0 m-4" style={{ zIndex: 1050 }}>
          <FaExclamationTriangle className="me-2" />
          {error}
        </div>
      )}
    </div>
  );
}

export default LeTueIdee; 
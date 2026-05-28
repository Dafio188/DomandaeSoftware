import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE } from '../config/api.js';
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
      const response = await axios.get(`${API_BASE}richieste/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Filtra le richieste per mostrare solo quelle del cliente loggato
      const richiesteCliente = response.data.filter(richiesta => richiesta.cliente === user.id);
      setIdee(richiesteCliente);
      setLoading(false);
    } catch (error) {
      console.error('Errore durante il caricamento delle richieste:', error);
      setLoading(false);
    }
  };

  const inviaIdea = async (e) => {
    e.preventDefault();
    if (!nuovaIdea.trim()) return;
    
    setSending(true);
    setError('');
    
    try {
      await axios.post(`${API_BASE}richieste/`, {
        titolo: `Idea ${categoria}: ${nuovaIdea.substring(0, 50)}...`,
        descrizione: nuovaIdea.trim(),
        tipo_software: 'altro', // Le idee sono generalmente "altro"
        budget: 0, // Budget default per le idee
        is_prodotto_acquistato: false
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess('Idea inviata con successo! Grazie per il tuo contributo.');
      setNuovaIdea('');
      setCategoria('miglioramento');
      caricaIdee();
      
      setTimeout(() => setSuccess(''), 5000);
    } catch {
      setError('Errore nell\'invio dell\'idea');
    }
    
    setSending(false);
  };

  const votaIdea = async (ideaId, voto) => {
    try {
      // Per ora disabilitiamo la votazione finché non implementiamo un sistema di voti
      console.log(`Voto ${voto} per idea ${ideaId} - Feature da implementare`);
      setError('Feature votazione in arrivo!');
      setTimeout(() => setError(''), 3000);
    } catch {
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

  // Funzione per eliminare una richiesta
  const _handleDeleteRichiesta = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa richiesta?')) {
      try {
        await axios.delete(`${API_BASE}richieste/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Ricarica le richieste dopo l'eliminazione
        caricaIdee();
      } catch (error) {
        console.error('Errore durante l\'eliminazione:', error);
      }
    }
  };

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
    <div className="py-4">
      {/* Hero Section */}
      <div className="mac-glass-card mb-5 p-5 text-center position-relative overflow-hidden bg-primary text-white">
        <div className="position-relative z-2">
          <h1 className="display-3 fw-bold mb-4">
            <FaLightbulb className="me-3 text-warning" />
            Le Tue Idee
          </h1>
          <p className="lead mb-4 opacity-90">
            <strong>Aiutaci a migliorare!</strong> Condividi le tue idee, suggerimenti e feedback 
            per rendere la piattaforma sempre migliore. La tua voce conta!
          </p>
          <div className="row g-3 justify-content-center">
            <div className="col-auto">
              <div className="mac-badge bg-white bg-opacity-20 text-white">
                <FaComments className="me-2" />
                {idee.length} Idee Condivise
              </div>
            </div>
            <div className="col-auto">
              <div className="mac-badge bg-white bg-opacity-20 text-white">
                <FaHeart className="me-2" />
                Community Attiva
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Form per inviare una nuova idea */}
        <div className="col-lg-4">
          <div className="mac-glass-card p-4 sticky-top" style={{ top: '110px' }}>
            <h4 className="mac-title mb-4">Condividi un'idea</h4>
            <form onSubmit={inviaIdea}>
              <div className="mb-3">
                <label className="form-label mac-subtitle small text-uppercase fw-bold">Categoria</label>
                <select 
                  className="form-select mac-input-field rounded-3"
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
              
              <div className="mb-4">
                <label className="form-label mac-subtitle small text-uppercase fw-bold">La tua idea</label>
                <textarea 
                  className="form-control mac-input-field rounded-4"
                  rows="6"
                  placeholder="Descrivi la tua idea in dettaglio..."
                  value={nuovaIdea}
                  onChange={(e) => setNuovaIdea(e.target.value)}
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary w-100 rounded-pill py-3 fw-bold shadow"
                disabled={sending}
              >
                {sending ? <FaSpinner className="fa-spin me-2" /> : <FaPaperPlane className="me-2" />}
                Invia Feedback
              </button>
            </form>
            
            {success && (
              <div className="alert alert-success mt-4 border-0 rounded-4 animate__animated animate__fadeIn">
                <FaCheckCircle className="me-2" /> {success}
              </div>
            )}
            
            {error && (
              <div className="alert alert-danger mt-4 border-0 rounded-4 animate__animated animate__fadeIn">
                <FaExclamationTriangle className="me-2" /> {error}
              </div>
            )}
          </div>
        </div>

        {/* Lista delle idee */}
        <div className="col-lg-8">
          <div className="mac-glass-card p-4 mb-4">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0 rounded-start-pill ps-3">
                    <FaSearch className="text-muted" />
                  </span>
                  <input 
                    type="text" 
                    className="form-control border-start-0 rounded-end-pill mac-input-field"
                    placeholder="Cerca tra le idee..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <select 
                  className="form-select rounded-pill mac-input-field"
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                >
                  <option value="tutte">Tutte le categorie</option>
                  {categorie.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                  ))}
                </select>
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
        <div className="mac-glass-card p-4 mt-5">
          <div className="text-center">
            <FaShieldAlt size={40} className="text-success mb-3 opacity-50" />
            <h5 className="mac-title mb-3">Privacy e Sicurezza dei Tuoi Dati</h5>
            <div className="row g-4">
              <div className="col-md-4">
                <h6 className="mac-title h6 text-success">🔒 Dati Protetti</h6>
                <p className="mac-subtitle small">Le tue idee sono memorizzate su server sicuri con crittografia avanzata</p>
              </div>
              <div className="col-md-4">
                <h6 className="mac-title h6 text-info">👥 Solo Utenti Autenticati</h6>
                <p className="mac-subtitle small">Solo utenti registrati possono visualizzare e interagire con le idee</p>
              </div>
              <div className="col-md-4">
                <h6 className="mac-title h6 text-warning">🎯 Finalità Specifica</h6>
                <p className="mac-subtitle small">I dati sono utilizzati esclusivamente per migliorare la piattaforma</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default LeTueIdee;

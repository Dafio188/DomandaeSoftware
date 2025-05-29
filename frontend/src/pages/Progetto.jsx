import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './Progetto.css';
import { 
  FaCheckCircle, 
  FaUser, 
  FaUserTie, 
  FaExclamationTriangle, 
  FaClock,
  FaComments,
  FaPaperPlane,
  FaProjectDiagram,
  FaEuroSign,
  FaCalendar,
  FaStar,
  FaRocket,
  FaHandshake,
  FaLightbulb,
  FaTools,
  FaTrophy,
  FaArrowRight,
  FaPlay,
  FaSpinner,
  FaPlus,
  FaMagic,
  FaCrown,
  FaHeart,
  FaBolt,
  FaFlag,
  FaCode,
  FaGift,
  FaInfoCircle,
  FaArchive,
  FaUndo,
  FaTimes,
  FaQuestionCircle,
  FaChartLine,
  FaShieldAlt,
  FaClipboardList,
  FaEye,
  FaLock
} from 'react-icons/fa';

function Progetto() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [progetto, setProgetto] = useState(null);
  const [messaggi, setMessaggi] = useState([]);
  const [testo, setTesto] = useState('');
  const [recensione, setRecensione] = useState('');
  const [voto, setVoto] = useState(5);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [newStep, setNewStep] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [activeTab, setActiveTab] = useState('deliverables');
  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);

  useEffect(() => {
    console.log('🔍 INIZIANDO CARICAMENTO PROGETTO');
    
    if (token && user) {
      const progettoUrl = `/api/progetti/${id}/`;
      const messaggiUrl = `/api/messaggi/?progetto=${id}`;
      
      Promise.all([
        axios.get(progettoUrl, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(messaggiUrl, { headers: { Authorization: `Bearer ${token}` } })
      ]).then(([progettoRes, messaggiRes]) => {
        console.log('✅ SUCCESSO - Progetto caricato:', progettoRes.data);
        setProgetto(progettoRes.data);
        setMessaggi(messaggiRes.data);
        setLoading(false);
        setError('');
      }).catch((err) => {
        console.error('❌ ERRORE nel caricamento:', err);
        if (err.response?.status === 404) {
          setError(`Progetto #${id} non trovato.`);
        } else if (err.response?.status === 403) {
          setError('Non hai i permessi per accedere a questo progetto.');
        } else {
          setError('Errore nel caricamento del progetto: ' + (err.response?.data?.detail || err.message));
        }
        setLoading(false);
      });
    } else {
      setError('Token di autenticazione non presente. Effettua il login.');
      setLoading(false);
    }
  }, [id, token, user, success]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messaggi]);

  // Invio messaggio
  const sendMessage = async () => {
    if (!testo.trim() || sending) return;
    
    setSending(true);
    try {
      const response = await axios.post('/api/messaggi/', {
        progetto: id,
        testo: testo.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessaggi([...messaggi, response.data]);
      setTesto('');
      setSuccess('Messaggio inviato!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Errore invio messaggio:', err);
      setError('Errore nell\'invio del messaggio: ' + (err.response?.data?.detail || err.message));
    } finally {
      setSending(false);
    }
  };

  // Spunta fase principali
  const spuntaFase = async (fase) => {
    try {
      await axios.post(`/api/progetti/${id}/spunta-fase/`, {
        fase,
        ruolo: user.id === progetto.cliente ? 'cliente' : 'fornitore'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const updatedProgetto = await axios.get(`/api/progetti/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProgetto(updatedProgetto.data);
      setSuccess('Fase aggiornata!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Errore spunta fase:', err);
      setError('Errore nell\'aggiornamento: ' + (err.response?.data?.detail || err.message));
    }
  };

  // Aggiungi step personalizzato
  const aggiungiStep = async () => {
    if (!newStep.trim()) return;
    
    try {
      await axios.post(`/api/progetti/${id}/aggiungi-step/`, {
        nome: newStep.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const updatedProgetto = await axios.get(`/api/progetti/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProgetto(updatedProgetto.data);
      setNewStep('');
      setSuccess('Step aggiunto!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Errore aggiunta step:', err);
      setError('Errore nell\'aggiunta dello step: ' + (err.response?.data?.detail || err.message));
    }
  };

  // Spunta step personalizzato
  const spuntaStep = async (stepId) => {
    try {
      await axios.post(`/api/progetti/${id}/spunta-step/`, {
        step_id: stepId,
        ruolo: user.id === progetto.cliente ? 'cliente' : 'fornitore'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const updatedProgetto = await axios.get(`/api/progetti/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProgetto(updatedProgetto.data);
      setSuccess('Step aggiornato!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Errore spunta step:', err);
      setError('Errore nell\'aggiornamento: ' + (err.response?.data?.detail || err.message));
    }
  };

  // Invio recensione
  const inviaRecensione = async () => {
    if (!recensione.trim()) return;
    
    try {
      await axios.post('/api/recensioni/', {
        progetto: id,
        voto,
        commento: recensione.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setRecensione('');
      setVoto(5);
      setSuccess('Recensione inviata!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Errore recensione:', err);
      setError('Errore nell\'invio della recensione: ' + (err.response?.data?.detail || err.message));
    }
  };

  // Archiviazione progetto
  const archiviaProgetto = async () => {
    try {
      await axios.post(`/api/progetti/${id}/archivia/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess('🎉 Progetto archiviato con successo! Reindirizzamento alla dashboard...');
      
      // Reindirizza alla dashboard dopo 2 secondi
      setTimeout(() => {
        window.location.href = user.ruolo === 'cliente' ? '/dashboard-cliente' : '/dashboard-fornitore';
      }, 2000);
      
    } catch (err) {
      console.error('Errore archiviazione:', err);
      setError('Errore nell\'archiviazione: ' + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Caricamento...</span>
          </div>
          <h4 className="text-muted">Caricamento progetto #{id}...</h4>
          <p className="text-muted small">Connessione al backend in corso...</p>
        </div>
      </div>
    );
  }

  if (error || !progetto) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <FaExclamationTriangle size={48} className="text-warning mb-3" />
          <h4 className="text-muted">Problema nel caricamento del progetto #{id}</h4>
          {error && (
            <div className="alert alert-danger mt-3 mx-auto" style={{ maxWidth: '600px' }}>
              <strong>Errore:</strong> {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Determina ruolo utente per personalizzazione contenuti
  const isCliente = user.id === progetto.cliente;
  const isFornitore = user.id === progetto.fornitore;
  const isAdmin = user.ruolo === 'amministratore';
  const partnerName = isCliente ? progetto.fornitore_username : progetto.cliente_username;
  const partnerRole = isCliente ? 'Fornitore' : 'Cliente';

  // CALCOLI IMPORTI - VISIBILI SOLO PER IL PROPRIO RUOLO E MOMENTO GIUSTO
  const prezzo = progetto?.offerta_prezzo || 0;
  const importoCliente = (prezzo * 1.05).toFixed(2);
  const importoFornitore = (prezzo * 0.95).toFixed(2);
  
  // Il fornitore vede il suo importo SOLO dopo l'approvazione finale del cliente
  const fornitoreVedeImporto = progetto.consegna_cliente_ok;
  
  // Funzioni per i pulsanti di calcolo manuale
  const calcolaImportoCliente = () => {
    if (!progetto?.offerta_prezzo) {
      alert('❌ ERRORE: Prezzo offerta non disponibile!');
      return;
    }
    
    const prezzoBase = Number(progetto.offerta_prezzo);
    const totale = (prezzoBase * 1.05).toFixed(2);
    const commissione = (prezzoBase * 0.05).toFixed(2);
    
    alert('💰 CALCOLO IMPORTO CLIENTE\n\n' +
          '💵 Prezzo base offerta: ' + prezzoBase + '€\n' +
          '📊 Commissione (5%): ' + commissione + '€\n' +
          '💳 TOTALE DA PAGARE: ' + totale + '€\n\n' +
          '💡 Il pagamento scatta automaticamente quando approvi la bozza iniziale');
  };

  const calcolaImportoFornitore = () => {
    if (!progetto?.offerta_prezzo) {
      alert('❌ ERRORE: Prezzo offerta non disponibile!');
      return;
    }
    
    if (!fornitoreVedeImporto) {
      alert('🔒 IMPORTO NON ANCORA DISPONIBILE\n\n' +
            'Potrai vedere il tuo importo solo dopo che il cliente avrà approvato la consegna finale.\n\n' +
            '⏳ Continua a lavorare sul progetto...');
      return;
    }
    
    const prezzoBase = Number(progetto.offerta_prezzo);
    const netto = (prezzoBase * 0.95).toFixed(2);
    const commissione = (prezzoBase * 0.05).toFixed(2);
    
    alert('💰 CALCOLO IMPORTO FORNITORE\n\n' +
          '💵 Prezzo base offerta: ' + prezzoBase + '€\n' +
          '📊 Commissione trattenuta (5%): ' + commissione + '€\n' +
          '💳 TOTALE CHE RICEVERAI: ' + netto + '€\n\n' +
          '🎉 Complimenti! Il cliente ha approvato la consegna finale.');
  };

  // Rendering stelle per rating
  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return [...Array(5)].map((_, index) => (
      <FaStar 
        key={index}
        size={20}
        className={`star ${index < rating ? 'active' : ''}`}
        onClick={interactive && onStarClick ? () => onStarClick(index + 1) : undefined}
        style={{ 
          color: index < rating ? '#ffc107' : '#e9ecef',
          cursor: interactive ? 'pointer' : 'default',
          marginRight: '2px'
        }}
      />
    ));
  };

  // Contenuti del modal guida per ruolo
  const getDeliverables = () => {
    if (isCliente) {
      return [
        { numero: 1, testo: "Monitora i progressi attraverso la timeline del progetto" },
        { numero: 2, testo: "Comunica con il fornitore tramite la chat supervisionata" },
        { numero: 3, testo: "Approva ogni fase di sviluppo prima di procedere" },
        { numero: 4, testo: "Effettua il pagamento solo quando sei soddisfatto" },
        { numero: 5, testo: "Ricevi il prodotto finale testato e funzionante" }
      ];
    } else {
      return [
        { numero: 1, testo: "Sviluppa seguendo le specifiche del cliente" },
        { numero: 2, testo: "Mantieni comunicazione costruttiva sui progressi" },
        { numero: 3, testo: "Consegna milestone verificabili e funzionanti" },
        { numero: 4, testo: "Ricevi pagamenti sicuri al completamento" },
        { numero: 5, testo: "Fornisci supporto e documentazione finale" }
      ];
    }
  };

  const getProcessSteps = () => {
    if (isCliente) {
      return [
        { 
          step: 1, 
          titolo: "Supervisione Sviluppo", 
          descrizione: "Monitora i progressi e comunica feedback",
          icon: "👀",
          color: "#17a2b8"
        },
        { 
          step: 2, 
          titolo: "Revisioni & Test", 
          descrizione: "Testa le funzionalità e richiedi modifiche",
          icon: "🔍",
          color: "#ffc107"
        },
        { 
          step: 3, 
          titolo: "Approvazione", 
          descrizione: "Approva ogni fase prima del pagamento",
          icon: "✅",
          color: "#28a745"
        },
        { 
          step: 4, 
          titolo: "Pagamento Sicuro", 
          descrizione: "Paga solo quando sei completamente soddisfatto",
          icon: "💳",
          color: "#007bff"
        }
      ];
    } else {
      return [
        { 
          step: 1, 
          titolo: "Pianificazione", 
          descrizione: "Analizza requisiti e pianifica lo sviluppo",
          icon: "📋",
          color: "#6f42c1"
        },
        { 
          step: 2, 
          titolo: "Sviluppo", 
          descrizione: "Implementa le funzionalità richieste",
          icon: "💻",
          color: "#17a2b8"
        },
        { 
          step: 3, 
          titolo: "Testing", 
          descrizione: "Testa e verifica il corretto funzionamento",
          icon: "🧪",
          color: "#ffc107"
        },
        { 
          step: 4, 
          titolo: "Consegna", 
          descrizione: "Consegna il prodotto finale e documentazione",
          icon: "🚀",
          color: "#28a745"
        }
      ];
    }
  };

  const getTips = () => {
    if (isCliente) {
      return {
        title: "Consigli per Clienti",
        tips: [
          "Comunica chiaramente i tuoi requisiti",
          "Fornisci feedback costruttivo e tempestivo",
          "Testa accuratamente ogni deliverable",
          "Mantieni una comunicazione professionale",
          "Approva rapidamente per velocizzare il progetto"
        ]
      };
    } else {
      return {
        title: "Consigli per Fornitori",
        tips: [
          "Mantieni il cliente aggiornato sui progressi",
          "Documenta il tuo codice e le funzionalità",
          "Testa accuratamente prima di ogni consegna",
          "Richiedi chiarimenti se necessario",
          "Fornisci supporto post-consegna"
        ]
      };
    }
  };

  // Modal Guida del Progetto
  const GuideModal = () => (
    showGuideModal && (
      <div className="custom-modal-overlay" onClick={() => setShowGuideModal(false)}>
        <div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="custom-modal-header">
            <div className="d-flex align-items-center">
              <div className="modal-icon-wrapper me-3">
                <FaQuestionCircle size={24} />
              </div>
              <div>
                <h4 className="text-white mb-1 fw-bold">Guida del Progetto</h4>
                <p className="text-white-50 mb-0 opacity-75">
                  Tutto quello che devi sapere per gestire al meglio questo progetto
                </p>
              </div>
            </div>
            <button 
              className="custom-modal-close"
              onClick={() => setShowGuideModal(false)}
            >
              <FaTimes />
            </button>
            <div className="btn-decoration"></div>
          </div>

          <div className="custom-tab-navigation">
            <button 
              className={`custom-tab ${activeTab === 'deliverables' ? 'active' : ''}`}
              onClick={() => setActiveTab('deliverables')}
            >
              <FaClipboardList className="me-2" />
              I Tuoi Compiti
            </button>
            <button 
              className={`custom-tab ${activeTab === 'process' ? 'active' : ''}`}
              onClick={() => setActiveTab('process')}
            >
              <FaChartLine className="me-2" />
              Il Processo
            </button>
            <button 
              className={`custom-tab ${activeTab === 'tips' ? 'active' : ''}`}
              onClick={() => setActiveTab('tips')}
            >
              <FaLightbulb className="me-2" />
              Consigli
            </button>
          </div>

          <div className="custom-modal-body">
            <div className="tab-content-animated">
              {activeTab === 'deliverables' && (
                <div>
                  <h5 className="fw-bold text-primary mb-4">
                    📋 Cosa devi fare come {isCliente ? 'Cliente' : 'Fornitore'}
                  </h5>
                  <div className="deliverables-list">
                    {getDeliverables().map((item, index) => (
                      <div key={index} className="deliverable-item-custom">
                        <div className={`deliverable-number-${isCliente ? 'cliente' : 'fornitore'}`}>
                          {item.numero}
                        </div>
                        <div className="deliverable-content">
                          <div className="deliverable-text">{item.testo}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'process' && (
                <div>
                  <h5 className="fw-bold text-primary mb-4">
                    🔄 Come funziona il processo per te
                  </h5>
                  <div className="process-steps-custom">
                    {getProcessSteps().map((step, index) => (
                      <div key={index} className="process-step-custom">
                        <div 
                          className="step-icon-custom"
                          style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)` }}
                        >
                          <span style={{ fontSize: '2rem' }}>{step.icon}</span>
                        </div>
                        <h6 className="fw-bold mb-2">{step.titolo}</h6>
                        <p className="text-muted small">{step.descrizione}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'tips' && (
                <div>
                  <h5 className="fw-bold text-primary mb-4">
                    💡 {getTips().title}
                  </h5>
                  <div className="tips-grid">
                    <div className={`tip-card-custom ${isCliente ? 'tip-cliente' : 'tip-fornitore'}`}>
                      <h6 className="fw-bold mb-3">
                        🎯 Best Practices
                      </h6>
                      <ul className="tip-list">
                        {getTips().tips.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {user.ruolo === 'amministratore' && (
                    <div className="admin-warning">
                      <h6 className="fw-bold mb-2">
                        <FaCrown className="me-2 text-warning" />
                        Area Amministratore
                      </h6>
                      <p className="mb-0 small">
                        Come admin puoi supervisionare tutti i progetti, mediare dispute e gestire i pagamenti.
                        Usa i tuoi poteri con saggezza per mantenere alta la qualità della piattaforma.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="custom-modal-footer">
            <button 
              className="btn btn-primary rounded-pill px-4"
              onClick={() => setShowGuideModal(false)}
            >
              <FaCheckCircle className="me-2" />
              Ho capito, iniziamo!
            </button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="min-vh-100 bg-gradient project-page">
      <div className="container py-5">
        {/* Alert di successo/errore */}
        {success && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <FaCheckCircle className="me-2" />
            {success}
          </div>
        )}
        
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <FaExclamationTriangle className="me-2" />
            {error}
          </div>
        )}

        {/* Header Professionale del Progetto */}
        <div className="project-hero text-white position-relative overflow-hidden mb-5">
          <div className="container-fluid p-5">
            <div className="row align-items-center">
              <div className="col-lg-7">
                <div className="d-flex align-items-center mb-4">
                  <div className="me-4">
                    <div className="icon-circle-btn">
                      <FaProjectDiagram size={24} />
                    </div>
                  </div>
                  <div>
                    <h1 className="display-4 fw-bold mb-2">Progetto #{progetto.id}</h1>
                    <p className="lead mb-0 opacity-90">{progetto.richiesta_titolo}</p>
                  </div>
                </div>
                
                <div className="communication-badge">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      {isCliente ? <FaUserTie size={20} /> : <FaUser size={20} />}
                    </div>
                    <div>
                      <div className="partner-name">{partnerRole}: {partnerName}</div>
                      <small className="opacity-75">Il tuo partner per questo progetto</small>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-5 text-end">
                <button 
                  className="btn btn-light btn-lg rounded-pill guide-btn position-relative"
                  onClick={() => setShowGuideModal(true)}
                >
                  <div className="d-flex align-items-center">
                    <FaQuestionCircle className="me-2" size={20} />
                    <span className="fw-bold">Guida del Progetto</span>
                  </div>
                  <div className="btn-decoration"></div>
                </button>
                
                <div className="mt-4">
                  <span className={`badge badge-lg px-4 py-2 status-${progetto.stato}`}>
                    <FaClock className="me-2" />
                    {progetto.stato.charAt(0).toUpperCase() + progetto.stato.slice(1)}
                  </span>
                  <div className="mt-2">
                    <small className="opacity-75">
                      Iniziato: {new Date(progetto.data_inizio).toLocaleDateString('it-IT')}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-decoration"></div>
        </div>

        {/* Timeline Professionale del Progetto */}
        <div className="card border-0 shadow-lg rounded-4 mb-5">
          <div className="card-header bg-gradient-primary text-white border-0 rounded-top-4 p-4">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <FaRocket className="me-3" size={24} />
                <div>
                  <h4 className="mb-1">Timeline di Sviluppo</h4>
                  <small className="opacity-75">Monitora e gestisci l'avanzamento del progetto</small>
                </div>
              </div>
              <div className="progress-summary">
                <span className="badge bg-light text-primary px-3 py-2">
                  {Math.round(((progetto.bozza_fornitore_ok ? 1 : 0) + 
                               (progetto.bozza_cliente_ok ? 1 : 0) + 
                               (progetto.pagamento_cliente_ok ? 1 : 0) + 
                               (progetto.pagamento_admin_ok ? 1 : 0) + 
                               (progetto.consegna_fornitore_ok ? 1 : 0) + 
                               (progetto.consegna_cliente_ok ? 1 : 0) + 
                               (progetto.bonifico_fornitore_ok ? 1 : 0)) / 7 * 100)}% Completato
                </span>
              </div>
            </div>
          </div>
          <div className="card-body p-5">
            <div className="timeline-container">
              <div className="row">
                {/* FASE 1: PRIMA RELEASE / BOZZA */}
                <div className="col-lg-4 timeline-step">
                  <div className={`timeline-icon ${progetto.bozza_fornitore_ok && progetto.bozza_cliente_ok ? 'active' : ''}`} 
                       style={{'--step-color': '#ffc107'}}>
                    <FaLightbulb />
                  </div>
                  
                  {/* Progress Ring */}
                  <div className="progress-ring-container text-center mt-3 mb-4">
                    <div className="progress-circle" 
                         style={{'--progress': `${((progetto.bozza_fornitore_ok ? 1 : 0) + (progetto.bozza_cliente_ok ? 1 : 0)) / 2 * 100}%`}}>
                      <span className="progress-text">
                        {Math.round(((progetto.bozza_fornitore_ok ? 1 : 0) + (progetto.bozza_cliente_ok ? 1 : 0)) / 2 * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h5 className="fw-bold text-warning mb-3">
                      🚀 Prima Release
                    </h5>
                    <p className="small text-muted mb-4">
                      {isCliente 
                        ? "Il fornitore sviluppa la prima versione funzionante del software. Una volta pronta, potrai testarla e approvarla."
                        : "Sviluppa la prima versione funzionante seguendo le specifiche. Assicurati che tutte le funzionalità base siano operative."
                      }
                    </p>
                    
                    <div className="fase-card bozza">
                      {/* FORNITORE STEP */}
                      <div className="checkpoint-item mb-3">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            <FaUserTie className="me-2 text-success" size={16} />
                            <span className="fw-bold small">Sviluppo Completato</span>
                          </div>
                          {progetto.bozza_fornitore_ok ? (
                            <div className="checkpoint-completed">
                              <FaCheckCircle className="text-success" size={18} />
                              <small className="text-success ms-1">✓</small>
                            </div>
                          ) : (
                            <div className="checkpoint-pending">
                              <FaClock className="text-warning" size={16} />
                              <small className="text-warning ms-1">In attesa</small>
                            </div>
                          )}
                        </div>
                        
                        {isFornitore && !progetto.bozza_fornitore_ok && (
                          <div className="mt-3">
                            <div className="alert alert-warning border-0 bg-warning bg-opacity-10 p-3 rounded-3">
                              <h6 className="fw-bold mb-2">
                                <FaPlay className="me-2" />
                                La tua azione richiesta:
                              </h6>
                              <p className="small mb-3">
                                Sviluppa la prima bozza del progetto seguendo le specifiche del cliente:
                                • Implementa le funzionalità base richieste<br/>
                                • Crea una versione funzionante e testabile<br/>
                                • Prepara screenshot, demo o codice di esempio<br/>
                                • Documenta brevemente il lavoro svolto
                              </p>
                              <div className="form-check">
                                <input 
                                  className="form-check-input" 
                                  type="checkbox" 
                                  id="fornitore-bozza"
                                  onChange={(e) => {
                                    if (e.target.checked && window.confirm('⚠️ CONFERMA BOZZA COMPLETATA\n\nConfermi che la prima bozza è pronta per la revisione del cliente?\n\n✅ Bozza funzionante sviluppata\n✅ Documentazione/screenshot inclusi\n✅ Pronto per feedback del cliente\n\n💡 Il cliente potrà ora testare e decidere se approvare.')) {
                                      spuntaFase('bozza_fornitore');
                                    } else {
                                      e.target.checked = false;
                                    }
                                  }}
                                />
                                <label className="form-check-label fw-bold" htmlFor="fornitore-bozza">
                                  Bozza completata e pronta per revisione cliente
                                </label>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {isCliente && progetto.bozza_fornitore_ok && !progetto.bozza_cliente_ok && (
                          <div className="mt-3">
                            <div className="alert alert-info border-0 bg-info bg-opacity-10 p-3 rounded-3">
                              <h6 className="fw-bold mb-2">
                                <FaEye className="me-2" />
                                Il tuo turno per testare e approvare:
                              </h6>
                              <p className="small mb-3">
                                <strong>🎯 Il fornitore ha completato la bozza iniziale!</strong><br/>
                                Ora devi testarla attentamente:
                                • Verifica che soddisfi i requisiti richiesti<br/>
                                • Testa tutte le funzionalità implementate<br/>
                                • Valuta se è in linea con le tue aspettative<br/>
                                • Comunica via chat eventuali modifiche necessarie
                              </p>
                              <div className="alert alert-warning bg-warning bg-opacity-10 border-0 p-2 mb-3">
                                <small className="fw-bold">
                                  ⚠️ IMPORTANTE: Approvando questa bozza, scatterà automaticamente il pagamento di {importoCliente}€ come garanzia.
                                </small>
                              </div>
                              <div className="form-check">
                                <input 
                                  className="form-check-input" 
                                  type="checkbox" 
                                  id="cliente-bozza"
                                  onChange={(e) => {
                                    if (e.target.checked && window.confirm(`🎯 CONFERMA APPROVAZIONE BOZZA\n\nConfermi che la bozza soddisfa i tuoi requisiti?\n\n⚠️ ATTENZIONE: Approvando, dovrai effettuare il pagamento di ${importoCliente}€ come garanzia.\n\n✅ Ho testato la bozza\n✅ Soddisfa i requisiti\n✅ Sono pronto per il pagamento\n\n🔒 I fondi saranno rilasciati al fornitore solo a progetto completato.`)) {
                                      spuntaFase('bozza_cliente');
                                    } else {
                                      e.target.checked = false;
                                    }
                                  }}
                                />
                                <label className="form-check-label fw-bold" htmlFor="cliente-bozza">
                                  Approvo la bozza - procedi con il pagamento di {importoCliente}€
                                </label>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Messaggio quando bozza è completata ma cliente non ha ancora testato */}
                        {progetto.bozza_fornitore_ok && !progetto.bozza_cliente_ok && !isCliente && (
                          <div className="mt-3">
                            <div className="alert alert-info border-0 bg-info bg-opacity-10 p-3 rounded-3 text-center">
                              <FaClock className="text-info mb-2" size={20} />
                              <h6 className="fw-bold text-info mb-1">In attesa di approvazione cliente</h6>
                              <small className="text-muted">
                                La bozza è stata completata. Il cliente sta testando prima di approvare.
                              </small>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* CLIENTE STEP */}
                      <div className="checkpoint-item">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            <FaUser className="me-2 text-info" size={16} />
                            <span className="fw-bold small">Approvazione Cliente</span>
                          </div>
                          {progetto.bozza_cliente_ok ? (
                            <div className="checkpoint-completed">
                              <FaCheckCircle className="text-success" size={18} />
                              <small className="text-success ms-1">✓</small>
                            </div>
                          ) : progetto.bozza_fornitore_ok ? (
                            <div className="checkpoint-ready">
                              <FaEye className="text-primary" size={16} />
                              <small className="text-primary ms-1">Pronto per test</small>
                            </div>
                          ) : (
                            <div className="checkpoint-blocked">
                              <FaFlag className="text-muted" size={16} />
                              <small className="text-muted ms-1">In attesa sviluppo</small>
                            </div>
                          )}
                        </div>
                        
                        {isCliente && !progetto.bozza_cliente_ok && progetto.bozza_fornitore_ok && (
                          <div className="mt-3">
                            <div className="alert alert-info border-0 bg-info bg-opacity-10 p-3 rounded-3">
                              <h6 className="fw-bold mb-2">
                                <FaEye className="me-2" />
                                Il tuo turno per testare:
                              </h6>
                              <p className="small mb-3">
                                Il fornitore ha completato la prima release. Ora devi:
                                • Testare tutte le funzionalità richieste<br/>
                                • Verificare che soddisfi i requisiti<br/>
                                • Segnalare eventuali problemi via chat
                              </p>
                              <div className="form-check">
                                <input 
                                  className="form-check-input" 
                                  type="checkbox" 
                                  id="cliente-bozza"
                                  onChange={(e) => {
                                    if (e.target.checked && window.confirm('🎯 CONFERMA APPROVAZIONE\n\nConfermi che la prima release soddisfa i tuoi requisiti?\n\n⚠️ Una volta approvata, si passerà alla fase di pagamento.\n\n✅ Ho testato tutte le funzionalità\n✅ Il software soddisfa i requisiti\n✅ Sono pronto per procedere')) {
                                      spuntaFase('bozza_cliente');
                                    } else {
                                      e.target.checked = false;
                                    }
                                  }}
                                />
                                <label className="form-check-label fw-bold" htmlFor="cliente-bozza">
                                  Approvo la prima release - procedi al pagamento
                                </label>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="timeline-connector completed"></div>
                </div>

                {/* FASE 2: PAGAMENTO */}
                <div className="col-lg-4 timeline-step">
                  <div className={`timeline-icon ${progetto.pagamento_cliente_ok && progetto.pagamento_admin_ok ? 'active' : ''}`} 
                       style={{'--step-color': '#28a745'}}>
                    <FaEuroSign />
                  </div>
                  
                  {/* Progress Ring */}
                  <div className="progress-ring-container text-center mt-3 mb-4">
                    <div className="progress-circle" 
                         style={{'--progress': `${((progetto.pagamento_cliente_ok ? 1 : 0) + (progetto.pagamento_admin_ok ? 1 : 0)) / 2 * 100}%`}}>
                      <span className="progress-text">
                        {Math.round(((progetto.pagamento_cliente_ok ? 1 : 0) + (progetto.pagamento_admin_ok ? 1 : 0)) / 2 * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h5 className="fw-bold text-success mb-3">
                      💳 Pagamento Sicuro
                    </h5>
                    <p className="small text-muted mb-4">
                      {isCliente 
                        ? "Effettua il pagamento in sicurezza. I fondi saranno rilasciati al fornitore solo dopo la consegna finale approvata."
                        : "Il cliente effettuerà il pagamento e un admin lo verificherà. I fondi ti saranno rilasciati alla consegna finale."
                      }
                    </p>
                    
                    <div className="fase-card pagamento">
                      {/* PAGAMENTO CLIENTE */}
                      <div className="checkpoint-item mb-3">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            <FaUser className="me-2 text-info" size={16} />
                            <span className="fw-bold small">Pagamento Cliente</span>
                          </div>
                          {progetto.pagamento_cliente_ok ? (
                            <div className="checkpoint-completed">
                              <FaCheckCircle className="text-success" size={18} />
                              <small className="text-success ms-1">✓</small>
                            </div>
                          ) : progetto.bozza_cliente_ok ? (
                            <div className="checkpoint-ready">
                              <FaEuroSign className="text-warning" size={16} />
                              <small className="text-warning ms-1">Richiesto</small>
                            </div>
                          ) : (
                            <div className="checkpoint-blocked">
                              <FaFlag className="text-muted" size={16} />
                              <small className="text-muted ms-1">In attesa approvazione bozza</small>
                            </div>
                          )}
                        </div>
                        
                        {/* Istruzioni per il Cliente dopo approvazione bozza */}
                        {isCliente && !progetto.pagamento_cliente_ok && progetto.bozza_cliente_ok && (
                          <div className="mt-3">
                            <div className="alert alert-success border-0 bg-success bg-opacity-10 p-3 rounded-3">
                              <h6 className="fw-bold mb-2">
                                <FaEuroSign className="me-2" />
                                Effettua il pagamento di garanzia:
                              </h6>
                              <p className="small mb-3">
                                <strong>Importo da versare: {importoCliente}€</strong> (include 5% commissione Domanda&Software)<br/>
                                📧 <strong>Riceverai via email le coordinate per il bonifico</strong><br/>
                                🔒 I fondi saranno trattenuti come garanzia<br/>
                                💳 Rilasciati al fornitore solo a progetto completato<br/>
                                ⚡ Una volta effettuato, spunta qui sotto per informare l'admin
                              </p>
                              <div className="form-check">
                                <input 
                                  className="form-check-input" 
                                  type="checkbox" 
                                  id="cliente-pagamento"
                                  onChange={(e) => {
                                    if (e.target.checked && window.confirm(`💳 CONFERMA PAGAMENTO EFFETTUATO\n\nConfermi di aver effettuato il bonifico di ${importoCliente}€?\n\n⚠️ Spunta solo se hai GIÀ inviato il bonifico.\n\n📧 Coordinate ricevute via email\n💰 Bonifico di ${importoCliente}€ inviato\n🔔 Admin riceverà notifica per verifica\n\n🔒 I fondi sono al sicuro e rilasciati solo a completamento.`)) {
                                      spuntaFase('pagamento_cliente');
                                    } else {
                                      e.target.checked = false;
                                    }
                                  }}
                                />
                                <label className="form-check-label fw-bold" htmlFor="cliente-pagamento">
                                  Ho effettuato il bonifico di {importoCliente}€
                                </label>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Messaggio per fornitore e admin quando cliente ha pagato */}
                        {progetto.pagamento_cliente_ok && !progetto.pagamento_admin_ok && !isCliente && (
                          <div className="mt-3">
                            <div className="alert alert-info border-0 bg-info bg-opacity-10 p-3 rounded-3 text-center">
                              <FaSpinner className="text-info mb-2" size={20} />
                              <h6 className="fw-bold text-info mb-1">Pagamento in verifica</h6>
                              <small className="text-muted">
                                Il cliente ha confermato il pagamento. Un admin sta verificando la ricezione dei fondi.
                              </small>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* VERIFICA ADMIN */}
                      <div className="checkpoint-item">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            <FaCrown className="me-2 text-warning" size={16} />
                            <span className="fw-bold small">Verifica Admin</span>
                          </div>
                          {progetto.pagamento_admin_ok ? (
                            <div className="checkpoint-completed">
                              <FaCheckCircle className="text-success" size={18} />
                              <small className="text-success ms-1">✓</small>
                            </div>
                          ) : progetto.pagamento_cliente_ok ? (
                            <div className="checkpoint-ready">
                              <FaSpinner className="text-info" size={16} />
                              <small className="text-info ms-1">In verifica</small>
                            </div>
                          ) : (
                            <div className="checkpoint-blocked">
                              <FaFlag className="text-muted" size={16} />
                              <small className="text-muted ms-1">In attesa pagamento cliente</small>
                            </div>
                          )}
                        </div>
                        
                        {/* Azione per SOLO ADMIN */}
                        {isAdmin && !progetto.pagamento_admin_ok && progetto.pagamento_cliente_ok && (
                          <div className="mt-3">
                            <div className="alert alert-warning border-0 bg-warning bg-opacity-10 p-3 rounded-3">
                              <h6 className="fw-bold mb-2">
                                <FaCrown className="me-2" />
                                Verifica Admin richiesta:
                              </h6>
                              <p className="small mb-3">
                                <strong>Il cliente ha confermato di aver effettuato il pagamento.</strong><br/>
                                • Controlla l'arrivo del bonifico di {importoCliente}€<br/>
                                • Verifica che l'importo sia corretto<br/>
                                • Una volta confermato, il fornitore potrà proseguire<br/>
                                ⚠️ Spunta solo dopo aver VERIFICATO la ricezione effettiva dei fondi
                              </p>
                              <div className="form-check">
                                <input 
                                  className="form-check-input" 
                                  type="checkbox" 
                                  id="admin-pagamento"
                                  onChange={(e) => {
                                    if (e.target.checked && window.confirm(`🏛️ CONFERMA RICEZIONE PAGAMENTO\n\nConfermi di aver RICEVUTO il bonifico di ${importoCliente}€?\n\n⚠️ ATTENZIONE: Spunta solo se i fondi sono effettivamente arrivati.\n\n💰 Bonifico di ${importoCliente}€ ricevuto\n✅ Importo verificato e corretto\n🚀 Il fornitore potrà proseguire il lavoro\n\n🔒 Fondi al sicuro fino a completamento progetto.`)) {
                                      spuntaFase('pagamento_admin');
                                    } else {
                                      e.target.checked = false;
                                    }
                                  }}
                                />
                                <label className="form-check-label fw-bold" htmlFor="admin-pagamento">
                                  Confermo ricezione bonifico di {importoCliente}€
                                </label>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Messaggio generico quando in verifica */}
                        {progetto.pagamento_cliente_ok && !progetto.pagamento_admin_ok && !isAdmin && (
                          <div className="mt-3">
                            <div className="alert alert-info border-0 bg-info bg-opacity-10 p-3 rounded-3">
                              <h6 className="fw-bold mb-2">
                                <FaSpinner className="me-2" />
                                Verifica in corso:
                              </h6>
                              <p className="small mb-0">
                                Un amministratore sta verificando l'arrivo del pagamento. 
                                Riceverai una notifica una volta completata la verifica.
                                {isFornitore && " Una volta confermato, potrai proseguire il lavoro."}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {/* Messaggio di successo quando admin ha confermato */}
                        {progetto.pagamento_admin_ok && (
                          <div className="mt-3">
                            <div className="alert alert-success border-0 bg-success bg-opacity-10 p-3 rounded-3 text-center">
                              <FaCheckCircle className="text-success mb-2" size={20} />
                              <h6 className="fw-bold text-success mb-1">Pagamento confermato!</h6>
                              <small className="text-muted">
                                L'admin ha confermato la ricezione del pagamento. 
                                {isFornitore && " Puoi ora proseguire con il lavoro fino alla consegna finale."}
                                {isCliente && " Il fornitore può ora proseguire il lavoro."}
                              </small>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="timeline-connector"></div>
                </div>

                {/* FASE 3: CONSEGNA FINALE */}
                <div className="col-lg-4 timeline-step">
                  <div className={`timeline-icon ${progetto.consegna_fornitore_ok && progetto.consegna_cliente_ok ? 'active' : ''}`} 
                       style={{'--step-color': '#6f42c1'}}>
                    <FaTrophy />
                  </div>
                  
                  {/* Progress Ring */}
                  <div className="progress-ring-container text-center mt-3 mb-4">
                    <div className="progress-circle" 
                         style={{'--progress': `${((progetto.consegna_fornitore_ok ? 1 : 0) + (progetto.consegna_cliente_ok ? 1 : 0)) / 2 * 100}%`}}>
                      <span className="progress-text">
                        {Math.round(((progetto.consegna_fornitore_ok ? 1 : 0) + (progetto.consegna_cliente_ok ? 1 : 0)) / 2 * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h5 className="fw-bold text-purple mb-3">
                      🏆 Consegna Finale
                    </h5>
                    <p className="small text-muted mb-4">
                      {isCliente 
                        ? "Il fornitore consegna la versione finale completa. Dopo la tua approvazione, il progetto sarà completato."
                        : "Consegna la versione finale completa con documentazione. Dopo l'approvazione del cliente riceverai il pagamento."
                      }
                    </p>
                    
                    <div className="fase-card consegna">
                      {/* CONSEGNA FORNITORE */}
                      <div className="checkpoint-item mb-3">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            <FaUserTie className="me-2 text-success" size={16} />
                            <span className="fw-bold small">Consegna Finale</span>
                          </div>
                          {progetto.consegna_fornitore_ok ? (
                            <div className="checkpoint-completed">
                              <FaCheckCircle className="text-success" size={18} />
                              <small className="text-success ms-1">✓</small>
                            </div>
                          ) : progetto.pagamento_admin_ok ? (
                            <div className="checkpoint-ready">
                              <FaRocket className="text-primary" size={16} />
                              <small className="text-primary ms-1">Pronto</small>
                            </div>
                          ) : (
                            <div className="checkpoint-blocked">
                              <FaFlag className="text-muted" size={16} />
                              <small className="text-muted ms-1">In attesa conferma pagamento</small>
                            </div>
                          )}
                        </div>
                        
                        {isFornitore && !progetto.consegna_fornitore_ok && progetto.pagamento_admin_ok && (
                          <div className="mt-3">
                            <div className="alert alert-primary border-0 bg-primary bg-opacity-10 p-3 rounded-3">
                              <h6 className="fw-bold mb-2">
                                <FaRocket className="me-2" />
                                Ultima fase - consegna finale:
                              </h6>
                              <p className="small mb-3">
                                <strong>🎉 Il pagamento è stato confermato!</strong> Ora completa il progetto:
                                • Finalizza tutte le funzionalità richieste<br/>
                                • Testa accuratamente tutto il software<br/>
                                • Prepara documentazione completa (utente/tecnica)<br/>
                                • Includi file sorgenti se richiesti<br/>
                                • Fornisci istruzioni per installazione/uso
                              </p>
                              <div className="form-check">
                                <input 
                                  className="form-check-input" 
                                  type="checkbox" 
                                  id="fornitore-consegna"
                                  onChange={(e) => {
                                    if (e.target.checked && window.confirm('🏆 CONFERMA CONSEGNA FINALE\n\nConfermi che il progetto è completo al 100% e pronto per la consegna finale?\n\n✅ Software completo e funzionante\n✅ Documentazione completa inclusa\n✅ Tutto testato e verificato\n✅ File sorgenti preparati\n\n🎉 Il cliente potrà ora testare e approvare per il rilascio del pagamento!')) {
                                      spuntaFase('consegna_fornitore');
                                    } else {
                                      e.target.checked = false;
                                    }
                                  }}
                                />
                                <label className="form-check-label fw-bold" htmlFor="fornitore-consegna">
                                  Progetto completato al 100% - pronto per consegna finale
                                </label>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* APPROVAZIONE FINALE CLIENTE */}
                      <div className="checkpoint-item">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            <FaUser className="me-2 text-info" size={16} />
                            <span className="fw-bold small">Approvazione Finale</span>
                          </div>
                          {progetto.consegna_cliente_ok ? (
                            <div className="checkpoint-completed">
                              <FaCheckCircle className="text-success" size={18} />
                              <small className="text-success ms-1">✓</small>
                            </div>
                          ) : progetto.consegna_fornitore_ok ? (
                            <div className="checkpoint-ready">
                              <FaEye className="text-primary" size={16} />
                              <small className="text-primary ms-1">Pronto per test finale</small>
                            </div>
                          ) : (
                            <div className="checkpoint-blocked">
                              <FaFlag className="text-muted" size={16} />
                              <small className="text-muted ms-1">In attesa consegna</small>
                            </div>
                          )}
                        </div>
                        
                        {isCliente && !progetto.consegna_cliente_ok && progetto.consegna_fornitore_ok && (
                          <div className="mt-3">
                            <div className="alert alert-success border-0 bg-success bg-opacity-10 p-3 rounded-3">
                              <h6 className="fw-bold mb-2">
                                <FaTrophy className="me-2" />
                                Test finale e approvazione:
                              </h6>
                              <p className="small mb-3">
                                <strong>🏆 Il fornitore ha consegnato la versione finale!</strong><br/>
                                Effettua il test finale e verifica che:
                                • Tutte le funzionalità siano complete e funzionanti<br/>
                                • La documentazione sia completa e chiara<br/>
                                • Tutto corrisponda alle specifiche richieste<br/>
                                • Sei completamente soddisfatto del risultato
                              </p>
                              <div className="alert alert-warning bg-warning bg-opacity-10 border-0 p-2 mb-3">
                                <small className="fw-bold">
                                  ⚠️ IMPORTANTE: Approvando, il fornitore riceverà il pagamento di {importoFornitore}€ e il progetto sarà completato.
                                </small>
                              </div>
                              <div className="form-check">
                                <input 
                                  className="form-check-input" 
                                  type="checkbox" 
                                  id="cliente-consegna"
                                  onChange={(e) => {
                                    if (e.target.checked && window.confirm(`🎉 APPROVAZIONE FINALE\n\nConfermi che il progetto è stato completato secondo le tue aspettative?\n\n⚠️ Una volta approvato:\n• Il fornitore riceverà il pagamento di ${importoFornitore}€\n• Il progetto sarà marcato come completato\n• Potrai lasciare una recensione\n\n✅ Il software soddisfa tutti i requisiti\n✅ Sono completamente soddisfatto\n✅ Approvo il rilascio del pagamento`)) {
                                      spuntaFase('consegna_cliente');
                                    } else {
                                      e.target.checked = false;
                                    }
                                  }}
                                />
                                <label className="form-check-label fw-bold" htmlFor="cliente-consegna">
                                  Approvo la consegna finale - rilascia pagamento al fornitore
                                </label>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* SUCCESS MESSAGE quando tutto completato */}
              {progetto.stato === 'completato' && (
                <div className="completion-celebration mt-5">
                  <div className="alert alert-success border-0 bg-success bg-opacity-10 p-4 rounded-4 text-center">
                    <div className="mb-3">
                      <FaTrophy size={48} className="text-warning" />
                    </div>
                    <h4 className="fw-bold text-success mb-3">🎉 Progetto Completato con Successo!</h4>
                    <p className="mb-4">
                      Complimenti! Il progetto è stato completato e approvato da entrambe le parti.
                      {isCliente && " Ora puoi lasciare una recensione per aiutare altri utenti."}
                      {isFornitore && " Il pagamento è stato processato. Grazie per il tuo eccellente lavoro!"}
                    </p>
                    <div className="row g-3 text-center">
                      <div className="col-md-4">
                        <div className="stat-item">
                          <FaCheckCircle className="text-success mb-2" size={24} />
                          <h6 className="fw-bold">Sviluppo</h6>
                          <small className="text-muted">Completato</small>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="stat-item">
                          <FaEuroSign className="text-success mb-2" size={24} />
                          <h6 className="fw-bold">Pagamento</h6>
                          <small className="text-muted">Processato</small>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="stat-item">
                          <FaTrophy className="text-warning mb-2" size={24} />
                          <h6 className="fw-bold">Consegnato</h6>
                          <small className="text-muted">Con successo</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* SEZIONE BONIFICO FORNITORE - Visibile solo dopo approvazione cliente */}
              {progetto.consegna_cliente_ok && (
                <div className="completion-celebration mt-5">
                  <div className="card border-0 shadow-lg rounded-4">
                    <div className="card-header bg-gradient-success text-white border-0 rounded-top-4 p-4">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <FaEuroSign className="me-3" size={20} />
                          <h5 className="mb-0">💸 Rilascio Pagamento al Fornitore</h5>
                        </div>
                        <span className="badge bg-light text-primary px-3 py-2">
                          Fase Finale
                        </span>
                      </div>
                    </div>
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center">
                          <FaUserTie className="me-2 text-success" size={16} />
                          <span className="fw-bold">Conferma Ricezione Bonifico</span>
                        </div>
                        {progetto.bonifico_fornitore_ok ? (
                          <div className="checkpoint-completed">
                            <FaCheckCircle className="text-success" size={18} />
                            <small className="text-success ms-1">✓ Ricevuto</small>
                          </div>
                        ) : (
                          <div className="checkpoint-pending">
                            <FaEuroSign className="text-warning" size={16} />
                            <small className="text-warning ms-1">In attesa</small>
                          </div>
                        )}
                      </div>
                      
                      {/* Messaggio per il fornitore che ora può vedere il suo importo */}
                      {isFornitore && !progetto.bonifico_fornitore_ok && (
                        <div className="alert alert-success border-0 bg-success bg-opacity-10 p-3 rounded-3">
                          <h6 className="fw-bold mb-2">
                            <FaTrophy className="me-2" />
                            🎉 Progetto Completato! Il tuo pagamento:
                          </h6>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="amount-display-fornitore text-center mb-3">
                                <h3 className="fw-bold text-success mb-2">{importoFornitore}€</h3>
                                <p className="small text-muted">Importo netto che riceverai</p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <p className="small mb-3">
                                <strong>Il cliente ha approvato la consegna finale!</strong><br/>
                                📧 Riceverai il bonifico entro 24-48 ore<br/>
                                💰 Importo: {importoFornitore}€ (netto commissioni)<br/>
                                🏦 Sul conto corrente da te fornito<br/>
                                ⚡ Una volta ricevuto, conferma qui sotto
                              </p>
                            </div>
                          </div>
                          <div className="form-check">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              id="fornitore-bonifico"
                              onChange={(e) => {
                                if (e.target.checked && window.confirm(`💰 CONFERMA RICEZIONE BONIFICO\n\nConfermi di aver RICEVUTO il bonifico di ${importoFornitore}€?\n\n⚠️ Spunta solo se i fondi sono effettivamente arrivati sul tuo conto.\n\n💳 Bonifico di ${importoFornitore}€ ricevuto\n✅ Importo verificato sul conto\n🎉 Progetto completato con successo\n\n📋 Il progetto sarà automaticamente archiviato.`)) {
                                  spuntaFase('bonifico_fornitore');
                                } else {
                                  e.target.checked = false;
                                }
                              }}
                            />
                            <label className="form-check-label fw-bold" htmlFor="fornitore-bonifico">
                              Confermo di aver ricevuto il bonifico di {importoFornitore}€
                            </label>
                          </div>
                        </div>
                      )}
                      
                      {/* Messaggio per cliente e admin quando fornitore non ha ancora confermato */}
                      {!progetto.bonifico_fornitore_ok && !isFornitore && (
                        <div className="alert alert-info border-0 bg-info bg-opacity-10 p-3 rounded-3 text-center">
                          <FaSpinner className="text-info mb-2" size={20} />
                          <h6 className="fw-bold text-info mb-1">Bonifico in corso</h6>
                          <small className="text-muted">
                            Il bonifico di {importoFornitore}€ è stato inviato al fornitore. 
                            In attesa di conferma ricezione per l'archiviazione finale.
                          </small>
                        </div>
                      )}
                      
                      {/* Messaggio finale quando tutto è completato */}
                      {progetto.bonifico_fornitore_ok && (
                        <div className="alert alert-success border-0 bg-success bg-opacity-10 p-3 rounded-3 text-center">
                          <FaTrophy className="text-success mb-2" size={24} />
                          <h4 className="fw-bold text-success mb-2">🎉 Progetto Completato al 100%!</h4>
                          <p className="mb-3">
                            Il fornitore ha confermato la ricezione del bonifico. 
                            Tutti i passaggi sono stati completati con successo.
                          </p>
                          <div className="d-flex justify-content-center">
                            <button 
                              className="btn btn-warning rounded-pill px-4"
                              onClick={() => {
                                if (window.confirm('📂 ARCHIVIA PROGETTO\n\nVuoi archiviare questo progetto?\n\n✅ Il progetto sarà rimosso dalla dashboard\n📋 Rimarrà disponibile nello storico\n🎯 Operazione reversibile\n\nProcedere con l\'archiviazione?')) {
                                  archiviaProgetto();
                                }
                              }}
                            >
                              <FaArchive className="me-2" />
                              Archivia Progetto
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step Personalizzati */}
        {progetto.step_personalizzati && progetto.step_personalizzati.length > 0 && (
          <div className="card border-0 shadow-lg rounded-4 mb-5">
            <div className="card-header bg-gradient-info text-white border-0 rounded-top-4 p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <FaTools className="me-3" size={20} />
                  <div>
                    <h5 className="mb-1">Step Personalizzati del Progetto</h5>
                    <small className="opacity-75">Milestone specifiche create per questo progetto</small>
                  </div>
                </div>
                <div className="custom-steps-summary">
                  <span className="badge bg-light text-primary px-3 py-2">
                    {progetto.step_personalizzati.filter(step => 
                      step.completato_fornitore && step.completato_cliente
                    ).length} di {progetto.step_personalizzati.length} completati
                  </span>
                </div>
              </div>
            </div>
            <div className="card-body p-4">
              {progetto.step_personalizzati.length === 0 ? (
                <div className="text-center py-5">
                  <FaTools size={48} className="text-muted mb-3 opacity-50" />
                  <h6 className="text-muted">Nessun step personalizzato ancora</h6>
                  <p className="text-muted small">
                    {isCliente 
                      ? "Puoi aggiungere step specifici per questo progetto nella sezione sottostante"
                      : "Il cliente può aggiungere step specifici per guidare meglio il progetto"
                    }
                  </p>
                </div>
              ) : (
                <div className="row g-4">
                  {progetto.step_personalizzati.map((step, index) => {
                    const isCompleted = step.completato_fornitore && step.completato_cliente;
                    const progressPercent = Math.round(
                      ((step.completato_fornitore ? 1 : 0) + (step.completato_cliente ? 1 : 0)) / 2 * 100
                    );
                    
                    return (
                      <div key={step.id} className="col-lg-6">
                        <div className={`custom-step-card ${isCompleted ? 'completed' : ''}`}>
                          <div className="custom-step-header">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div className="step-number-badge">
                                <span className="step-number">{index + 1}</span>
                              </div>
                              <div className="step-progress-mini">
                                <div className="progress-mini-circle" 
                                     style={{'--progress-mini': `${progressPercent}%`}}>
                                  <span className="progress-mini-text">{progressPercent}%</span>
                                </div>
                              </div>
                            </div>
                            
                            <h6 className="fw-bold mb-2 step-title">{step.nome}</h6>
                            
                            <div className="step-status-badge mb-3">
                              {isCompleted ? (
                                <span className="badge bg-success rounded-pill">
                                  <FaCheckCircle className="me-1" size={12} />
                                  Completato
                                </span>
                              ) : (
                                <span className="badge bg-warning rounded-pill">
                                  <FaClock className="me-1" size={12} />
                                  In corso
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="custom-step-body">
                            <div className="participants-status mb-3">
                              {/* STATUS FORNITORE */}
                              <div className="participant-item mb-2">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="d-flex align-items-center">
                                    <FaUserTie className="me-2 text-success" size={14} />
                                    <span className="small fw-bold">Fornitore</span>
                                  </div>
                                  <div className="participant-status">
                                    {step.completato_fornitore ? (
                                      <div className="status-completed">
                                        <FaCheckCircle className="text-success me-1" size={14} />
                                        <small className="text-success">Completato</small>
                                      </div>
                                    ) : (
                                      <div className="status-pending">
                                        <FaClock className="text-warning me-1" size={14} />
                                        <small className="text-warning">In attesa</small>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {step.data_fornitore && (
                                  <small className="text-muted ps-4">
                                    Completato il {new Date(step.data_fornitore).toLocaleDateString('it-IT', {
                                      day: '2-digit',
                                      month: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </small>
                                )}
                              </div>
                              
                              {/* STATUS CLIENTE */}
                              <div className="participant-item">
                                <div className="d-flex align-items-center justify-content-between">
                                  <div className="d-flex align-items-center">
                                    <FaUser className="me-2 text-info" size={14} />
                                    <span className="small fw-bold">Cliente</span>
                                  </div>
                                  <div className="participant-status">
                                    {step.completato_cliente ? (
                                      <div className="status-completed">
                                        <FaCheckCircle className="text-success me-1" size={14} />
                                        <small className="text-success">Approvato</small>
                                      </div>
                                    ) : step.completato_fornitore ? (
                                      <div className="status-ready">
                                        <FaEye className="text-primary me-1" size={14} />
                                        <small className="text-primary">Pronto per revisione</small>
                                      </div>
                                    ) : (
                                      <div className="status-blocked">
                                        <FaFlag className="text-muted me-1" size={14} />
                                        <small className="text-muted">In attesa sviluppo</small>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {step.data_cliente && (
                                  <small className="text-muted ps-4">
                                    Approvato il {new Date(step.data_cliente).toLocaleDateString('it-IT', {
                                      day: '2-digit',
                                      month: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </small>
                                )}
                              </div>
                            </div>
                            
                            {/* AZIONI UTENTE */}
                            <div className="step-actions">
                              {/* AZIONE FORNITORE */}
                              {isFornitore && !step.completato_fornitore && (
                                <div className="action-alert fornitore mb-3">
                                  <div className="alert alert-warning border-0 bg-warning bg-opacity-10 p-3 rounded-3">
                                    <h6 className="fw-bold mb-2">
                                      <FaPlay className="me-2" size={14} />
                                      La tua azione richiesta:
                                    </h6>
                                    <p className="small mb-3">
                                      Completa questo step personalizzato seguendo le specifiche del cliente.
                                      Assicurati che tutti i requisiti siano soddisfatti prima di marcarlo come completato.
                                    </p>
                                    <div className="form-check">
                                      <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        id={`fornitore-step-${step.id}`}
                                        onChange={(e) => {
                                          if (e.target.checked && window.confirm(`✅ CONFERMA COMPLETAMENTO\n\nConfermi di aver completato lo step "${step.nome}"?\n\n🔍 Il cliente potrà ora rivederlo e approvarlo.`)) {
                                            spuntaStep(step.id);
                                          } else {
                                            e.target.checked = false;
                                          }
                                        }}
                                      />
                                      <label className="form-check-label fw-bold" htmlFor={`fornitore-step-${step.id}`}>
                                        Ho completato questo step
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {/* AZIONE CLIENTE */}
                              {isCliente && !step.completato_cliente && step.completato_fornitore && (
                                <div className="action-alert cliente mb-3">
                                  <div className="alert alert-info border-0 bg-info bg-opacity-10 p-3 rounded-3">
                                    <h6 className="fw-bold mb-2">
                                      <FaEye className="me-2" size={14} />
                                      Il tuo turno per approvare:
                                    </h6>
                                    <p className="small mb-3">
                                      Il fornitore ha completato lo step "{step.nome}". 
                                      Verifica che tutto sia conforme alle aspettative prima di approvare.
                                    </p>
                                    <div className="form-check">
                                      <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        id={`cliente-step-${step.id}`}
                                        onChange={(e) => {
                                          if (e.target.checked && window.confirm(`👍 CONFERMA APPROVAZIONE\n\nConfermi che lo step "${step.nome}" è stato completato correttamente?\n\n✅ Lo step sarà marcato come approvato.`)) {
                                            spuntaStep(step.id);
                                          } else {
                                            e.target.checked = false;
                                          }
                                        }}
                                      />
                                      <label className="form-check-label fw-bold" htmlFor={`cliente-step-${step.id}`}>
                                        Approvo questo step
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {/* MESSAGGIO STEP COMPLETATO */}
                              {isCompleted && (
                                <div className="completion-message">
                                  <div className="alert alert-success border-0 bg-success bg-opacity-10 p-3 rounded-3 text-center">
                                    <FaTrophy className="text-success mb-2" size={20} />
                                    <h6 className="fw-bold text-success mb-1">Step Completato!</h6>
                                    <small className="text-muted">
                                      Questo step è stato completato e approvato da entrambe le parti.
                                    </small>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Aggiungi Step Personalizzato (solo cliente) */}
        {isCliente && (
          <div className="card border-0 shadow-lg rounded-4 mb-5">
            <div className="card-header bg-gradient-secondary text-white border-0 rounded-top-4 p-4">
              <div className="d-flex align-items-center">
                <FaPlus className="me-3" size={20} />
                <div>
                  <h5 className="mb-1">Aggiungi Step Personalizzato</h5>
                  <small className="opacity-75">Crea milestone specifiche per guidare meglio il progetto</small>
                </div>
              </div>
            </div>
            <div className="card-body p-4">
              <div className="add-step-container">
                <div className="row">
                  <div className="col-lg-8">
                    <div className="input-group-improved">
                      <div className="input-icon">
                        <FaMagic />
                      </div>
                      <textarea
                        className="custom-textarea"
                        placeholder="Descrivi un nuovo step per il progetto... (es: 'Implementazione sistema di login', 'Creazione database utenti', 'Test di sicurezza')"
                        value={newStep}
                        onChange={(e) => setNewStep(e.target.value)}
                        rows="3"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4 d-flex align-items-center">
                    <button 
                      className="btn btn-add-step w-100"
                      onClick={aggiungiStep}
                      disabled={!newStep.trim()}
                    >
                      <FaPlus className="me-2" />
                      Aggiungi Step
                    </button>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="alert alert-light border-0 bg-light p-3 rounded-3">
                    <small className="text-muted">
                      <FaInfoCircle className="me-2" />
                      <strong>Suggerimento:</strong> Usa step personalizzati per dividere il progetto in milestone specifiche. 
                      Ogni step dovrà essere completato dal fornitore e approvato da te prima di procedere.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row">
          {/* Chat Supervisionata */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-lg rounded-4 mb-5 chat-container">
              <div className="card-header bg-gradient-info text-white border-0 rounded-top-4 p-4">
                <div className="d-flex align-items-center">
                  <FaComments className="me-3" size={20} />
                  <h5 className="mb-0">Chat Supervisionata</h5>
                  <div className="ms-auto">
                    <span className="badge bg-light text-dark">
                      {messaggi.length} messaggi
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="card-body p-0">
                <div className="chat-messages" style={{ height: '500px', overflowY: 'auto' }}>
                  <div className="p-4">
                    {messaggi.length === 0 ? (
                      <div className="text-center text-muted py-5">
                        <FaComments size={48} className="mb-3 opacity-50" />
                        <p>Nessun messaggio ancora. Inizia la conversazione!</p>
                      </div>
                    ) : (
                      messaggi.map((msg) => (
                        <div key={msg.id} className={`message-bubble ${msg.mittente === user.id ? 'my-message' : 'other-message'} mb-3`}>
                          <div className="message-sender mb-1">
                            <strong>{msg.mittente_username}</strong>
                            <span className="role-badge ms-2">
                              {msg.mittente === progetto.cliente ? 'Cliente' : 
                               msg.mittente === progetto.fornitore ? 'Fornitore' : 'Admin'}
                            </span>
                          </div>
                          <div className="message-content">
                            {msg.testo}
                          </div>
                          <div className="message-time">
                            {new Date(msg.data_invio).toLocaleString('it-IT')}
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                
                <div className="p-4 border-top">
                  <div className="input-group">
                    <input
                      ref={chatInputRef}
                      type="text"
                      className="form-control chat-input rounded-pill"
                      placeholder="Scrivi un messaggio..."
                      value={testo}
                      onChange={(e) => setTesto(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      disabled={sending}
                    />
                    <button 
                      className="btn btn-primary rounded-pill ms-2"
                      onClick={sendMessage}
                      disabled={!testo.trim() || sending}
                    >
                      {sending ? <FaSpinner className="fa-spin" /> : <FaPaperPlane />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Informazioni */}
          <div className="col-lg-4">
            {/* INFORMAZIONI PAGAMENTO - VISIBILI SOLO PER IL PROPRIO RUOLO */}
            <div className="card border-0 shadow-lg rounded-4 mb-4">
              <div className="card-header bg-gradient-success text-white border-0 rounded-top-4 p-4">
                <div className="d-flex align-items-center">
                  <FaEuroSign className="me-3" size={20} />
                  <h5 className="mb-0">
                    {isCliente ? 'Il Tuo Pagamento' : (fornitoreVedeImporto ? 'Il Tuo Guadagno' : 'Informazioni Pagamento')}
                  </h5>
                </div>
              </div>
              <div className="card-body p-4">
                {/* CLIENTE: Sempre vede il suo importo */}
                {isCliente && (
                  <>
                    <div className="amount-display mb-4">
                      <h3 className="fw-bold mb-2 text-warning">{importoCliente}€</h3>
                      <p className="small text-muted mb-0">
                        Importo totale da pagare (include 5% commissione piattaforma)
                      </p>
                    </div>
                    <div className="d-grid">
                      <button 
                        className="btn btn-warning btn-lg rounded-pill"
                        onClick={calcolaImportoCliente}
                      >
                        <FaEuroSign className="me-2" />
                        Calcola Importo da Pagare
                      </button>
                    </div>
                    <div className="alert alert-light border-0 rounded-3 mt-3">
                      <small className="text-muted">
                        <FaInfoCircle className="me-2" />
                        {!progetto.bozza_cliente_ok 
                          ? "Il pagamento scatterà automaticamente quando approvi la bozza"
                          : !progetto.pagamento_admin_ok 
                          ? "Pagamento in corso di verifica dall'admin"
                          : "Pagamento confermato - il fornitore può proseguire"
                        }
                      </small>
                    </div>
                  </>
                )}
                
                {/* FORNITORE: Vede importo solo dopo approvazione finale cliente */}
                {isFornitore && (
                  <>
                    {fornitoreVedeImporto ? (
                      <>
                        <div className="amount-display mb-4">
                          <h3 className="fw-bold mb-2 text-success">{importoFornitore}€</h3>
                          <p className="small text-muted mb-0">
                            Importo netto che riceverai (5% commissione trattenuta)
                          </p>
                        </div>
                        <div className="d-grid">
                          <button 
                            className="btn btn-success btn-lg rounded-pill"
                            onClick={calcolaImportoFornitore}
                          >
                            <FaEuroSign className="me-2" />
                            Calcola Importo da Incassare
                          </button>
                        </div>
                        <div className="alert alert-light border-0 rounded-3 mt-3">
                          <small className="text-muted">
                            <FaInfoCircle className="me-2" />
                            🎉 Il cliente ha approvato! Riceverai il bonifico entro 24-48 ore.
                          </small>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-center py-4">
                          <FaLock size={48} className="text-muted mb-3 opacity-50" />
                          <h6 className="text-muted mb-2">Importo non ancora disponibile</h6>
                          <p className="small text-muted">
                            Potrai vedere il tuo guadagno solo dopo che il cliente avrà approvato la consegna finale.
                          </p>
                        </div>
                        <div className="d-grid">
                          <button 
                            className="btn btn-secondary btn-lg rounded-pill"
                            onClick={calcolaImportoFornitore}
                          >
                            <FaEye className="me-2" />
                            Informazioni Pagamento
                          </button>
                        </div>
                        <div className="alert alert-light border-0 rounded-3 mt-3">
                          <small className="text-muted">
                            <FaInfoCircle className="me-2" />
                            {!progetto.pagamento_admin_ok 
                              ? "In attesa che l'admin confermi il pagamento del cliente"
                              : "Continua a lavorare fino alla consegna finale"
                            }
                          </small>
                        </div>
                      </>
                    )}
                  </>
                )}
                
                {/* ADMIN: Vede entrambi gli importi sempre */}
                {isAdmin && (
                  <>
                    <div className="row">
                      <div className="col-6">
                        <div className="amount-display-mini mb-3">
                          <h5 className="fw-bold text-warning mb-1">{importoCliente}€</h5>
                          <small className="text-muted">Cliente paga</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="amount-display-mini mb-3">
                          <h5 className="fw-bold text-success mb-1">{importoFornitore}€</h5>
                          <small className="text-muted">Fornitore riceve</small>
                        </div>
                      </div>
                    </div>
                    <div className="alert alert-warning border-0 rounded-3">
                      <small className="text-muted">
                        <FaCrown className="me-2" />
                        <strong>Admin:</strong> Verifica pagamenti e supervisiona il progetto.
                        {!progetto.pagamento_admin_ok && progetto.pagamento_cliente_ok && 
                          " ⚠️ Conferma richiesta per pagamento cliente."
                        }
                      </small>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* SEZIONE RECENSIONI - Solo quando progetto completato */}
            {progetto.stato === 'completato' && (
              <div className="card border-0 shadow-lg rounded-4 mb-4">
                <div className="card-header bg-gradient-warning text-white border-0 rounded-top-4 p-4">
                  <div className="d-flex align-items-center">
                    <FaStar className="me-3" size={20} />
                    <h5 className="mb-0">Valuta il Progetto</h5>
                  </div>
                </div>
                <div className="card-body p-4">
                  <div className="text-center mb-4">
                    <h6 className="fw-bold mb-3">La tua soddisfazione</h6>
                    <div className="star-rating mb-3">
                      {renderStars(voto, true, setVoto)}
                    </div>
                    <p className="small text-muted">
                      {voto === 1 && 'Molto insoddisfatto'}
                      {voto === 2 && 'Insoddisfatto'}
                      {voto === 3 && 'Neutrale'}
                      {voto === 4 && 'Soddisfatto'}
                      {voto === 5 && 'Molto soddisfatto'}
                    </p>
                  </div>
                  
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      placeholder="Lascia un commento sulla tua esperienza..."
                      value={recensione}
                      onChange={(e) => setRecensione(e.target.value)}
                      rows="4"
                    />
                  </div>
                  
                  <div className="d-grid">
                    <button 
                      className="btn btn-warning btn-lg rounded-pill"
                      onClick={inviaRecensione}
                      disabled={!recensione.trim()}
                    >
                      <FaStar className="me-2" />
                      Invia Recensione
                    </button>
                  </div>
                  
                  <div className="alert alert-light border mt-3">
                    <small className="text-muted">
                      <FaInfoCircle className="me-2" />
                      La tua recensione aiuterà altri utenti a scegliere i migliori {isCliente ? 'fornitori' : 'clienti'}.
                    </small>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Guida del Progetto */}
      <GuideModal />
    </div>
  );
}

export default Progetto; 
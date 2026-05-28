import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getRichiesteCliente, getProgettiCliente } from '../services/api';
import AcquistoModal from '../components/AcquistoModal';
import axios from 'axios';
import { FaImage, FaTimes, FaEye, FaEuroSign, FaUser, FaCalendar, FaCheckCircle, FaTimesCircle, FaClock, FaLaptopCode, FaInfoCircle, FaMagic, FaRocket, FaLightbulb, FaArchive, FaShoppingCart, FaBox, FaArrowRight, FaProjectDiagram, FaHistory, FaArrowUp, FaArrowLeft } from 'react-icons/fa';
import { API_BASE } from '../config/api.js';

function DashboardCliente() {
  const { user, token } = useAuth();
  const [richieste, setRichieste] = useState([]);
  const [progetti, setProgetti] = useState([]);
  const [progettiArchiviati, setProgettiArchiviati] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  
  // Stati per i prodotti
  const [prodotti, setProdotti] = useState([]);
  const [showAcquistoModal, setShowAcquistoModal] = useState(false);
  const [prodottoSelezionato, setProdottoSelezionato] = useState(null);
  
  const [titolo, setTitolo] = useState('');
  const [tipoSoftware, setTipoSoftware] = useState('');
  const [descrizione, setDescrizione] = useState('');
  const [budget, setBudget] = useState('');
  const [immagine, setImmagine] = useState(null);
  const [immaginePrev, setImmaginePrev] = useState(null);
  const [skillTagsInput, setSkillTagsInput] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [offerte, setOfferte] = useState([]);
  const [accepting, setAccepting] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const progettiRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Dati avanzati dashboard
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totale_richieste: 0,
      richieste_aperte: 0,
      progetti_attivi: 0,
      budget_impegnato: 0
    },
    recent_movements: []
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Opzioni tipo software
  const tipiSoftware = [
    { value: 'crm', label: 'CRM - Customer Relationship Management', icon: '👥', desc: 'Gestione clienti e relazioni commerciali' },
    { value: 'gestionale', label: 'Gestionale/ERP - Enterprise Resource Planning', icon: '📊', desc: 'Sistema integrato per gestione aziendale' },
    { value: 'ecommerce', label: 'E-commerce - Negozio Online', icon: '🛒', desc: 'Piattaforma di vendita online' },
    { value: 'sito_web', label: 'Sito Web - Vetrina/Corporate', icon: '🌐', desc: 'Sito web aziendale o di presentazione' },
    { value: 'app_mobile', label: 'App Mobile - iOS/Android', icon: '📱', desc: 'Applicazione per dispositivi mobili' },
    { value: 'web_app', label: 'Web Application - Applicazione Web', icon: '💻', desc: 'Applicazione web interattiva' },
    { value: 'software_desktop', label: 'Software Desktop', icon: '🖥️', desc: 'Applicazione per computer desktop' },
    { value: 'api_servizi', label: 'API/Servizi Web', icon: '🔌', desc: 'Integrazione e servizi web' },
    { value: 'automazione', label: 'Automazione Processi', icon: '⚙️', desc: 'Automatizzazione di workflow' },
    { value: 'business_intelligence', label: 'Business Intelligence', icon: '📈', desc: 'Analisi dati e reportistica' },
    { value: 'altro', label: 'Altro - Specifica nella descrizione', icon: '💡', desc: 'Categoria personalizzata' }
  ];

  useEffect(() => {
    if (token && user) {
      getRichiesteCliente(token).then(setRichieste);
      
      // Carica progetti attivi (non archiviati)
      getProgettiCliente(token, user.id).then(progettiTutti => {
        const progettiAttivi = progettiTutti.filter(p => !p.archiviato);
        setProgetti(progettiAttivi);
      });
      
      // Carica prodotti pronti
      axios.get(`${API_BASE}prodotti-pronti/`)
        .then(res => {
          setProdotti(res.data);
        })
        .catch(err => {
          console.log('Errore caricamento prodotti:', err);
        });
      
      // Carica progetti archiviati separatamente
      axios.get(`${API_BASE}progetti/archiviati/`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setProgettiArchiviati(res.data.results || []);
      }).catch(err => {
        console.log('Errore nel caricamento progetti archiviati:', err);
        setProgettiArchiviati([]);
      });
      
      // Recupera le offerte per le richieste del cliente corrente
      axios.get(`${API_BASE}offerte/?cliente=${user.id}&order=quality`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setOfferte(res.data);
      }).catch(err => {
        console.error('Errore nel caricamento offerte:', err);
        setOfferte([]);
      });

      // Carica statistiche avanzate
      setLoadingStats(true);
      axios.get(`${API_BASE}stats/dashboard/`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setDashboardData(res.data);
      }).catch(err => {
        console.error('Errore caricamento statistiche dashboard cliente:', err);
      }).finally(() => {
        setLoadingStats(false);
      });
    }
  }, [token, user, success, accepting]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Controllo dimensione (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('L\'immagine non può superare i 5MB');
        return;
      }
      
      // Controllo tipo file
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Formato immagine non supportato. Usa JPG, PNG o WEBP');
        return;
      }
      
      setImmagine(file);
      const reader = new FileReader();
      reader.onload = (e) => setImmaginePrev(e.target.result);
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const removeImage = () => {
    setImmagine(null);
    setImmaginePrev(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(''); setError('');
    
    try {
      const formData = new FormData();
      formData.append('cliente', user.id);
      formData.append('titolo', titolo);
      formData.append('tipo_software', tipoSoftware);
      formData.append('descrizione', descrizione);
      formData.append('budget', budget);
      formData.append('skill_tags', skillTagsInput);
      if (immagine) {
        formData.append('immagine', immagine);
      }

      await axios.post('/api/richieste/', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess('🎉 Richiesta pubblicata con successo! I fornitori possono ora inviarti offerte.');
      setTitolo(''); setTipoSoftware(''); setDescrizione(''); setBudget(''); setSkillTagsInput('');
      removeImage();
      setShowPreview(false);
      setCurrentStep(1);
    } catch {
      setError('Errore nella creazione della richiesta');
    }
  };

  const handleAccetta = async (offertaId) => {
    setAccepting(offertaId);
    try {
      await axios.post(`/api/offerte/${offertaId}/accetta/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Offerta accettata! Ora puoi gestire il progetto nella sezione Progetti attivi.');
      setTimeout(() => {
        if (progettiRef.current) {
          progettiRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    } catch {
      setError('Errore nell\'accettazione dell\'offerta');
    }
    setAccepting(null);
  };

  // Anteprima della card migliorata
  const renderCardPreview = () => {
    if (!titolo || !tipoSoftware || !descrizione || !budget) return null;
    
    const tipoSelezionato = tipiSoftware.find(t => t.value === tipoSoftware);
    const previewTags = skillTagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 8);
    
    return (
      <div className="card border-0 shadow-lg rounded-4 mb-4" style={{ background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
        <div className="card-body p-4">
          <div className="d-flex align-items-center mb-3">
            <div className="badge bg-primary bg-gradient rounded-pill px-3 py-2 me-2">
              <span className="me-1">{tipoSelezionato?.icon}</span>
              {tipoSelezionato?.label.split(' - ')[0]}
            </div>
            <span className="badge bg-success bg-gradient rounded-pill px-3 py-2">NUOVA</span>
          </div>
          
          {immaginePrev && (
            <div className="position-relative mb-3">
              <img 
                src={immaginePrev} 
                alt="Anteprima" 
                className="img-fluid rounded-3"
                style={{ height: '200px', width: '100%', objectFit: 'cover' }}
              />
              <div className="position-absolute top-0 end-0 m-2">
                <span className="badge bg-dark bg-opacity-75 rounded-pill">Immagine allegata</span>
              </div>
            </div>
          )}
          
          <h5 className="card-title fw-bold text-primary mb-2">{titolo}</h5>
          {previewTags.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mb-3">
              {previewTags.map((tag) => (
                <span key={tag} className="badge rounded-pill bg-light text-dark border">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <p className="card-text text-muted mb-3" style={{ lineHeight: '1.6' }}>{descrizione}</p>
          
          <div className="row g-3 mb-3">
            <div className="col-6">
              <div className="d-flex align-items-center">
                <FaEuroSign className="text-success me-2" />
                <div>
                  <small className="text-muted d-block">Budget massimo</small>
                  <strong className="text-success">{budget}€</strong>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex align-items-center">
                <FaUser className="text-info me-2" />
                <div>
                  <small className="text-muted d-block">Cliente</small>
                  <strong>{user?.username}</strong>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-top pt-3">
            <small className="text-muted">
              <FaCalendar className="me-1" />
              Pubblicata il {new Date().toLocaleDateString('it-IT')}
            </small>
          </div>
        </div>
      </div>
    );
  };

  // Funzione per ottenere suggerimenti in base al tipo software
  const getSuggerimenti = (tipo) => {
    const suggerimenti = {
      crm: "💡 Includi: numero utenti, integrazioni email, gestione pipeline vendite, reportistica necessaria",
      gestionale: "💡 Includi: moduli necessari (contabilità, magazzino, HR), numero utenti, integrazioni esistenti",
      ecommerce: "💡 Includi: numero prodotti, metodi pagamento, integrazione corrieri, design preferenze",
      sito_web: "💡 Includi: numero pagine, funzionalità speciali, design style, integrazione social",
      app_mobile: "💡 Includi: piattaforme (iOS/Android), funzionalità offline, notifiche push, design UI/UX",
      web_app: "💡 Includi: numero utenti concorrenti, database necessario, API terze parti, responsive design",
      altro: "💡 Descrivi dettagliatamente il software che hai in mente e le funzionalità richieste"
    };
    return suggerimenti[tipo] || "";
  };

  // Funzioni per gestire l'acquisto di prodotti
  const handleAcquistaProdotto = (prodotto) => {
    setProdottoSelezionato(prodotto);
    setShowAcquistoModal(true);
  };

  const handleCloseModal = () => {
    setShowAcquistoModal(false);
    setProdottoSelezionato(null);
  };

  return (
    <div className="mac-page-wrapper">
      <div className="container py-4">
        <div className="row">
          <div className="col-12">
            {/* Header Section */}
            <header className="mb-5 animate__animated animate__fadeIn">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h1 className="mac-title display-4 mb-2">Dashboard Cliente</h1>
                  <p className="mac-subtitle lead mb-0">Gestisci i tuoi progetti e le tue richieste di software.</p>
                </div>
                <div className="badge bg-primary bg-opacity-10 text-primary p-3 rounded-4 border border-primary border-opacity-25">
                  <FaUser className="me-2" /> {user?.username}
                </div>
              </div>
              
              <div className="row g-4">
                <div className="col-md-3">
                  <div className="mac-glass-card p-4 h-100 d-flex flex-column align-items-center text-center">
                    <div className="rounded-circle p-3 mb-3" style={{ backgroundColor: '#0071e315', color: '#0071e3', fontSize: '1.5rem' }}>
                      <FaLightbulb />
                    </div>
                    <h3 className="mac-title mb-1 h2">{dashboardData.stats.totale_richieste}</h3>
                    <p className="mac-subtitle mb-0 small uppercase font-weight-bold">Le tue richieste</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="mac-glass-card p-4 h-100 d-flex flex-column align-items-center text-center">
                    <div className="rounded-circle p-3 mb-3" style={{ backgroundColor: '#34c75915', color: '#34c759', fontSize: '1.5rem' }}>
                      <FaProjectDiagram />
                    </div>
                    <h3 className="mac-title mb-1 h2">{dashboardData.stats.progetti_attivi}</h3>
                    <p className="mac-subtitle mb-0 small uppercase font-weight-bold">Progetti attivi</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="mac-glass-card p-4 h-100 d-flex flex-column align-items-center text-center">
                    <div className="rounded-circle p-3 mb-3" style={{ backgroundColor: '#af52de15', color: '#af52de', fontSize: '1.5rem' }}>
                      <FaEuroSign />
                    </div>
                    <h3 className="mac-title mb-1 h2">{offerte.length}</h3>
                    <p className="mac-subtitle mb-0 small uppercase font-weight-bold">Offerte ricevute</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="mac-glass-card p-4 h-100 d-flex flex-column align-items-center text-center border-0" style={{background: 'linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 100%)'}}>
                    <div className="rounded-circle p-3 mb-3" style={{ backgroundColor: '#00000010', color: '#000', fontSize: '1.5rem' }}>
                      <FaEuroSign />
                    </div>
                    <h3 className="mac-title mb-1 h2">{(dashboardData.stats.budget_impegnato ?? 0).toFixed(0)}€</h3>
                    <p className="mac-subtitle mb-0 small uppercase font-weight-bold">Budget impegnato</p>
                  </div>
                </div>
              </div>
            </header>
            
            <div className="row g-4 mb-4">
              <div className="col-12">
                <div className="mac-glass-card p-4">
                  <div className="d-flex align-items-center mb-4">
                    <FaHistory className="text-primary me-2" />
                    <h5 className="mac-title mb-0">Storico Crediti & Operazioni</h5>
                  </div>
                  <div className="row g-3">
                    {dashboardData.recent_movements.length > 0 ? (
                      dashboardData.recent_movements.slice(0, 4).map(mov => (
                        <div key={mov.id} className="col-md-3">
                          <div className="p-3 rounded-4 bg-white bg-opacity-40 border border-white d-flex align-items-center">
                            <div className={`rounded-circle p-2 me-3 ${mov.delta > 0 ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>
                              {mov.delta > 0 ? <FaArrowUp size={12} /> : <FaArrowLeft size={12} style={{transform:'rotate(-90deg)'}} />}
                            </div>
                            <div className="overflow-hidden">
                              <h6 className="mac-title mb-0 text-truncate" style={{fontSize:'0.75rem'}}>{mov.reason || 'Operazione'}</h6>
                              <div className={`fw-bold small ${mov.delta > 0 ? 'text-success' : 'text-danger'}`}>{mov.delta > 0 ? '+' : ''}{mov.delta} cr</div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-12 text-center py-2">
                        <p className="text-muted small mb-0">Nessun movimento recente</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="row g-4">
              {/* COLONNA SINISTRA - Creazione Richieste */}
              <div className="col-lg-6">
                <div className="mac-glass-card p-4 h-100">
                  <div className="d-flex align-items-center mb-4">
                    <FaMagic className="me-3 text-primary" size={24} />
                    <div>
                      <h5 className="mac-title mb-0">Nuova Richiesta</h5>
                      <small className="mac-subtitle">Crea il tuo progetto software</small>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {/* Progress Steps */}
                    <div className="d-flex justify-content-between mb-4">
                      {[1, 2, 3, 4].map(step => (
                        <div key={step} className={`rounded-circle d-flex align-items-center justify-content-center ${step <= currentStep ? 'bg-primary text-white' : 'bg-light text-muted'}`} style={{ width: 30, height: 30, fontSize: '0.8rem' }}>
                          {step}
                        </div>
                      ))}
                    </div>

                    {/* STEP 1: Categoria */}
                    <div className="mb-4">
                      <label className="form-label mac-title small">Categoria Software</label>
                      <select className="form-select mac-input" value={tipoSoftware} onChange={(e) => { setTipoSoftware(e.target.value); if (e.target.value && currentStep === 1) setCurrentStep(2); }} required>
                        <option value="">Seleziona...</option>
                        {tipiSoftware.map(tipo => <option key={tipo.value} value={tipo.value}>{tipo.icon} {tipo.label}</option>)}
                      </select>
                    </div>

                    {/* Altri step condensati per brevità */}
                    {tipoSoftware && (
                      <>
                        <div className="mb-4">
                          <label className="form-label mac-title small">Titolo Progetto</label>
                          <input type="text" className="form-control mac-input" value={titolo} onChange={(e) => { setTitolo(e.target.value); if (e.target.value && currentStep === 2) setCurrentStep(3); }} required />
                        </div>
                        <div className="mb-4">
                          <label className="form-label mac-title small">Descrizione</label>
                          <textarea className="form-control mac-input" rows="4" value={descrizione} onChange={e => setDescrizione(e.target.value)} required />
                        </div>
                        <div className="mb-4">
                          <label className="form-label mac-title small">Budget (€)</label>
                          <input type="number" className="form-control mac-input" value={budget} onChange={(e) => { setBudget(e.target.value); if (e.target.value && currentStep === 3) setCurrentStep(4); }} required />
                        </div>
                        <button type="submit" className="btn btn-primary mac-button w-100 shadow-sm mt-3">
                          Pubblica Progetto
                        </button>
                      </>
                    )}
                  </form>
                </div>
              </div>
              
              {/* COLONNA DESTRA - Le tue Richieste */}
              <div className="col-lg-6">
                <div className="mac-glass-card p-4 h-100 overflow-auto" style={{maxHeight:'700px'}}>
                  <h5 className="mac-title mb-4">Le tue Richieste</h5>
                  {richieste.length > 0 ? richieste.filter(r => r.cliente === user?.id).map(r => (
                    <div key={r.id} className="mac-glass-card p-3 mb-3 bg-white bg-opacity-40 border-0 shadow-sm">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="mac-title small mb-0">{r.titolo}</h6>
                        <span className="mac-badge bg-primary text-white" style={{fontSize:'0.6rem'}}>{r.stato}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <span className="text-success fw-bold small">{r.budget}€</span>
                        <small className="mac-subtitle" style={{fontSize:'0.7rem'}}>
                          {offerte.filter(o => o.richiesta === r.id).length} offerte
                        </small>
                      </div>
                      
                      {/* Mini lista offerte */}
                      <div className="mt-3">
                        {offerte.filter(o => o.richiesta === r.id).map(o => (
                          <div key={o.id} className="p-2 rounded-3 bg-white bg-opacity-50 mb-2 border d-flex justify-content-between align-items-center">
                            <div className="overflow-hidden">
                              <div className="fw-bold small">{o.fornitore_username}</div>
                              <div className="text-success small">{o.prezzo}€</div>
                            </div>
                            {r.stato === 'aperta' && o.stato === 'inviata' && (
                              <button className="btn btn-success mac-button btn-sm py-1 px-3" onClick={() => handleAccetta(o.id)}>
                                Accetta
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )) : (
                    <p className="mac-subtitle text-center py-5">Nessuna richiesta attiva</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* SEZIONE PRODOTTI DISPONIBILI */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="mac-glass-card p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mac-title mb-0">Prodotti Consigliati</h5>
                    <Link to="/prodotti-pronti" className="btn btn-link text-primary p-0 text-decoration-none small fw-bold">
                      Esplora tutto <FaArrowRight size={10} />
                    </Link>
                  </div>
                  <div className="row g-3">
                    {prodotti.slice(0, 3).map(prodotto => (
                      <div key={prodotto.id} className="col-md-4">
                        <div className="p-3 rounded-4 bg-white bg-opacity-40 border border-white h-100 d-flex flex-column">
                          <h6 className="mac-title small mb-2">{prodotto.titolo}</h6>
                          <p className="text-muted small flex-grow-1" style={{fontSize:'0.75rem'}}>{prodotto.descrizione.substring(0, 60)}...</p>
                          <div className="d-flex justify-content-between align-items-center mt-2">
                            <span className="text-success fw-bold">{prodotto.prezzo}€</span>
                            <button className="btn btn-primary mac-button btn-sm py-1" onClick={() => handleAcquistaProdotto(prodotto)}>
                              Dettagli
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* SEZIONE PROGETTI */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="mac-glass-card p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mac-title mb-0">I tuoi Progetti {showArchived ? '(Archivio)' : '(Attivi)'}</h5>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} id="archivedSwitchCliente" />
                      <label className="form-check-label ms-2 small text-muted" htmlFor="archivedSwitchCliente">Vedi archiviati</label>
                    </div>
                  </div>
                  <div className="row g-3">
                    {(showArchived ? progettiArchiviati : progetti).length > 0 ? (showArchived ? progettiArchiviati : progetti).map(p => (
                      <div key={p.id} className="col-md-4">
                        <div className="p-3 rounded-4 bg-white bg-opacity-40 border border-white text-center">
                          <span className="mac-badge bg-info text-white mb-2 d-inline-block" style={{fontSize:'0.6rem'}}>{p.stato}</span>
                          <h6 className="mac-title small mb-3">{p.richiesta_titolo}</h6>
                          <Link to={`/progetto/${p.id}`} className="btn btn-light mac-button btn-sm w-100 border">
                            Gestisci
                          </Link>
                        </div>
                      </div>
                    )) : (
                      <div className="col-12 text-center py-4">
                        <p className="mac-subtitle small">Nessun progetto da mostrare</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* SEZIONE FAQ E SUPPORTO */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-header bg-info bg-gradient text-white border-0 rounded-top-4">
                <div className="d-flex align-items-center">
                  <FaInfoCircle className="me-3" size={20} />
                  <div>
                    <h5 className="mb-0">FAQ & Supporto</h5>
                    <small className="opacity-75">Domande frequenti e assistenza</small>
                  </div>
                </div>
              </div>
              <div className="card-body p-4">
                <div className="row g-4">
                  <div className="col-lg-8">
                    <h6 className="fw-bold mb-3 text-primary">
                      <FaLightbulb className="me-2" />
                      Domande Frequenti per Clienti
                    </h6>
                    <div className="accordion" id="faqAccordion">
                      <div className="accordion-item border-0 mb-2 rounded-3">
                        <h2 className="accordion-header">
                          <button className="accordion-button collapsed rounded-3" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                            Come funziona il processo di richiesta?
                          </button>
                        </h2>
                        <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                          <div className="accordion-body">
                            Crea una richiesta dettagliata, ricevi offerte dai fornitori, scegli quella migliore e inizia il progetto. I pagamenti sono protetti fino al completamento.
                          </div>
                        </div>
                      </div>
                      <div className="accordion-item border-0 mb-2 rounded-3">
                        <h2 className="accordion-header">
                          <button className="accordion-button collapsed rounded-3" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                            I pagamenti sono sicuri?
                          </button>
                        </h2>
                        <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                          <div className="accordion-body">
                            Sì! I fondi vengono trattenuti in escrow fino al completamento soddisfacente del progetto. Paghi solo quando sei completamente soddisfatto.
                          </div>
                        </div>
                      </div>
                      <div className="accordion-item border-0 mb-2 rounded-3">
                        <h2 className="accordion-header">
                          <button className="accordion-button collapsed rounded-3" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                            Cosa succede se non sono soddisfatto?
                          </button>
                        </h2>
                        <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                          <div className="accordion-body">
                            Il nostro team di supporto interviene per mediare. Se il problema non si risolve, puoi richiedere il rimborso completo.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="bg-light rounded-4 p-4 text-center">
                      <FaUser size={48} className="text-primary mb-3" />
                      <h6 className="fw-bold mb-3">Hai bisogno di aiuto?</h6>
                      <p className="text-muted mb-3">
                        Il nostro team è sempre disponibile per supportarti
                      </p>
                      <div className="d-grid gap-2">
                        <Link to="/faq" className="btn btn-primary rounded-pill">
                          <FaInfoCircle className="me-2" />
                          Vai alle FAQ Complete
                        </Link>
                        <button className="btn btn-outline-primary rounded-pill">
                          <FaUser className="me-2" />
                          Contatta il Supporto
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* MODAL DI ACQUISTO */}
        {prodottoSelezionato && (
          <AcquistoModal 
            prodotto={prodottoSelezionato}
            show={showAcquistoModal}
            onClose={handleCloseModal}
          />
        )}
        
        <style>{`
          .animated-card {
            transition: all 0.3s ease;
          }
          .animated-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
          }
          .bg-gradient {
            background: linear-gradient(135deg, var(--bs-bg-opacity, 1), rgba(255,255,255,0.1));
          }
        `}</style>
      </div>
    </div>
  );
}

export default DashboardCliente; 

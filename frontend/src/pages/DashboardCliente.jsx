import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getRichiesteCliente, getProgettiCliente } from '../services/api';
import AcquistoModal from '../components/AcquistoModal';
import axios from 'axios';
import { FaImage, FaTimes, FaEye, FaEuroSign, FaUser, FaCalendar, FaCheckCircle, FaTimesCircle, FaClock, FaLaptopCode, FaInfoCircle, FaMagic, FaRocket, FaLightbulb, FaArchive, FaShoppingCart, FaBox, FaArrowRight } from 'react-icons/fa';

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
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [offerte, setOfferte] = useState([]);
  const [accepting, setAccepting] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const progettiRef = useRef(null);
  const fileInputRef = useRef(null);

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
      axios.get('/api/prodotti-pronti/')
        .then(res => {
          setProdotti(res.data);
        })
        .catch(err => {
          console.log('Errore caricamento prodotti:', err);
        });
      
      // Carica progetti archiviati separatamente
      axios.get('/api/progetti/archiviati/', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setProgettiArchiviati(res.data.results || []);
      }).catch(err => {
        console.log('Errore nel caricamento progetti archiviati:', err);
        setProgettiArchiviati([]);
      });
      
      // Recupera le offerte per le richieste del cliente corrente usando il nuovo endpoint
      axios.get(`/api/offerte/?cliente=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setOfferte(res.data);
      }).catch(err => {
        console.error('Errore nel caricamento offerte:', err);
        setOfferte([]);
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
      setTitolo(''); setTipoSoftware(''); setDescrizione(''); setBudget('');
      removeImage();
      setShowPreview(false);
      setCurrentStep(1);
    } catch (err) {
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
    } catch (err) {
      setError('Errore nell\'accettazione dell\'offerta');
    }
    setAccepting(null);
  };

  // Anteprima della card migliorata
  const renderCardPreview = () => {
    if (!titolo || !tipoSoftware || !descrizione || !budget) return null;
    
    const tipoSelezionato = tipiSoftware.find(t => t.value === tipoSoftware);
    
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
    <div className="dashboard-cliente min-vh-100" style={{ background: 'linear-gradient(135deg, #f8f9fc 0%, #e8edf5 100%)' }}>
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            {/* HEADER DASHBOARD CLIENTE */}
            <div className="welcome-header mb-4">
              <div className="card border-0 shadow-lg rounded-4" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f4f6f9 100%)' }}>
                <div className="card-body p-4">
                  <div className="row align-items-center">
                    <div className="col-lg-8">
                      <div className="d-flex align-items-center">
                        <div className="welcome-icon bg-primary bg-opacity-10 rounded-circle p-3 me-4">
                          <FaUser size={40} className="text-primary" />
                        </div>
                        <div>
                          <h2 className="welcome-title mb-2 text-dark">
                            Benvenuto, <span className="text-primary fw-bold">{user?.username || 'Cliente'}</span>! 🚀
                          </h2>
                          <p className="welcome-subtitle text-muted mb-0 fs-5">
                            Trasforma le tue idee in realtà con i migliori sviluppatori
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                      <div className="d-flex justify-content-lg-end gap-2">
                        <button 
                          className="btn btn-primary rounded-pill px-4"
                          onClick={() => setCurrentStep(currentStep === 1 ? 2 : 1)}
                        >
                          <FaRocket className="me-2" />
                          {currentStep === 1 ? 'Nuova Richiesta' : 'Torna Indietro'}
                        </button>
                        <Link 
                          to="/prodotti-pronti"
                          className="btn btn-outline-success rounded-pill px-4"
                        >
                          <FaShoppingCart className="me-2" />
                          Prodotti Pronti
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="row g-4">
              {/* COLONNA SINISTRA - Creazione Richieste MIGLIORATA */}
              <div className="col-lg-6">
                <div className="card border-0 shadow-lg rounded-4 h-100" style={{ background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
                  <div className="card-header bg-primary bg-gradient text-white border-0 rounded-top-4">
                    <div className="d-flex align-items-center">
                      <FaMagic className="me-3" size={20} />
                      <div>
                        <h5 className="mb-0">Crea la tua richiesta software</h5>
                        <small className="opacity-75">Guidato passo-passo</small>
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-4">
                    {/* Progress Steps */}
                    <div className="row mb-4">
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center">
                          {[1,2,3,4].map(step => (
                            <div key={step} className="d-flex flex-column align-items-center">
                              <div className={`rounded-circle d-flex align-items-center justify-content-center ${step <= currentStep ? 'bg-primary text-white' : 'bg-light text-muted'}`} style={{ width: '40px', height: '40px' }}>
                                {step}
                              </div>
                              <small className={`mt-1 ${step <= currentStep ? 'text-primary fw-bold' : 'text-muted'}`}>
                                {step === 1 && 'Categoria'}
                                {step === 2 && 'Dettagli'}
                                {step === 3 && 'Budget'}
                                {step === 4 && 'Anteprima'}
                              </small>
                            </div>
                          ))}
                        </div>
                        <hr className="my-4" />
                      </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                      {/* STEP 1: Tipo Software */}
                      <div className="mb-4">
                        <label className="form-label fw-bold d-flex align-items-center">
                          <FaLaptopCode className="me-2 text-primary" />
                          Che tipo di software ti serve?
                        </label>
                        <select 
                          className="form-select form-select-lg" 
                          value={tipoSoftware} 
                          onChange={(e) => {
                            setTipoSoftware(e.target.value);
                            if (e.target.value && currentStep === 1) setCurrentStep(2);
                          }}
                          required
                        >
                          <option value="">🎯 Seleziona la categoria più adatta...</option>
                          {tipiSoftware.map(tipo => (
                            <option key={tipo.value} value={tipo.value}>
                              {tipo.icon} {tipo.label}
                            </option>
                          ))}
                        </select>
                        {tipoSoftware && (
                          <div className="alert alert-info mt-2 border-0 bg-info bg-opacity-10">
                            <small>
                              <FaInfoCircle className="me-1" />
                              {tipiSoftware.find(t => t.value === tipoSoftware)?.desc}
                            </small>
                          </div>
                        )}
                      </div>
                      
                      {/* STEP 2: Titolo e Descrizione */}
                      {tipoSoftware && (
                        <>
                          <div className="mb-3">
                            <label className="form-label fw-bold">Titolo del progetto</label>
                            <input 
                              type="text" 
                              className="form-control form-control-lg" 
                              placeholder="Es: Sistema CRM per agenzia immobiliare con 20 agenti" 
                              value={titolo} 
                              onChange={(e) => {
                                setTitolo(e.target.value);
                                if (e.target.value && currentStep === 2) setCurrentStep(3);
                              }}
                              required 
                            />
                          </div>
                          
                          <div className="mb-3">
                            <label className="form-label fw-bold">Descrizione dettagliata del progetto</label>
                            {tipoSoftware && (
                              <div className="alert alert-warning border-0 bg-warning bg-opacity-10 mb-2">
                                <small>{getSuggerimenti(tipoSoftware)}</small>
                              </div>
                            )}
                            <textarea 
                              className="form-control" 
                              rows="5"
                              placeholder="Descrivi dettagliatamente cosa ti serve: funzionalità, numero utenti, integrazioni necessarie, tecnologie preferite, tempistiche..." 
                              value={descrizione} 
                              onChange={e => setDescrizione(e.target.value)} 
                              required 
                            />
                            <small className="text-muted">
                              Più dettagli fornisci, più accurate saranno le offerte che riceverai!
                            </small>
                          </div>
                        </>
                      )}
                      
                      {/* STEP 3: Budget e Immagine */}
                      {titolo && descrizione && (
                        <>
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <label className="form-label fw-bold">Budget massimo disponibile</label>
                              <div className="input-group input-group-lg">
                                <span className="input-group-text bg-success text-white">
                                  <FaEuroSign />
                                </span>
                                <input 
                                  type="number" 
                                  className="form-control" 
                                  placeholder="5000" 
                                  value={budget} 
                                  onChange={(e) => {
                                    setBudget(e.target.value);
                                    if (e.target.value && currentStep === 3) setCurrentStep(4);
                                  }}
                                  required 
                                />
                              </div>
                              <small className="text-muted">Indica il budget massimo che hai a disposizione</small>
                            </div>
                            <div className="col-md-6 mb-3">
                              <label className="form-label fw-bold">Immagine esplicativa (opzionale)</label>
                              <input 
                                type="file" 
                                className="form-control" 
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageChange}
                                ref={fileInputRef}
                              />
                              <small className="text-muted">Max 5MB - JPG, PNG, WEBP</small>
                            </div>
                          </div>
                          
                          {immaginePrev && (
                            <div className="mb-3 position-relative text-center">
                              <img 
                                src={immaginePrev} 
                                alt="Anteprima" 
                                className="img-thumbnail rounded-3"
                                style={{ maxHeight: '150px', maxWidth: '200px' }}
                              />
                              <button 
                                type="button" 
                                className="btn btn-sm btn-danger position-absolute"
                                style={{ top: '-10px', right: 'calc(50% - 110px)' }}
                                onClick={removeImage}
                              >
                                <FaTimes />
                              </button>
                            </div>
                          )}
                        </>
                      )}
                      
                      {/* STEP 4: Anteprima e Pubblicazione */}
                      {titolo && tipoSoftware && descrizione && budget && (
                        <div className="mb-4">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="fw-bold mb-0">
                              <FaLightbulb className="text-warning me-2" />
                              Anteprima della tua richiesta
                            </h6>
                            <button 
                              type="button" 
                              className="btn btn-outline-info btn-sm"
                              onClick={() => setShowPreview(!showPreview)}
                            >
                              <FaEye className="me-1" />
                              {showPreview ? 'Nascondi' : 'Mostra'} anteprima
                            </button>
                          </div>
                          
                          {showPreview && (
                            <div className="border rounded-3 p-3 bg-light">
                              <small className="text-muted mb-2 d-block">💡 Così apparirà la tua richiesta sul sito:</small>
                              {renderCardPreview()}
                            </div>
                          )}
                          
                          <button type="submit" className="btn btn-success btn-lg w-100 mt-3">
                            <FaRocket className="me-2" />
                            Pubblica richiesta sul portale
                          </button>
                        </div>
                      )}
                      
                      {success && (
                        <div className="alert alert-success border-0 bg-success bg-opacity-10">
                          <FaCheckCircle className="me-2" />
                          {success}
                        </div>
                      )}
                      {error && (
                        <div className="alert alert-danger border-0 bg-danger bg-opacity-10">
                          <FaTimesCircle className="me-2" />
                          {error}
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              </div>
              
              {/* COLONNA DESTRA - Richieste e Offerte (mantenuta ma migliorata) */}
              <div className="col-lg-6">
                <div className="card border-0 shadow-lg rounded-4 h-100">
                  <div className="card-header bg-info bg-gradient text-white border-0 rounded-top-4">
                    <h5 className="mb-0">
                      <FaUser className="me-2" />
                      Le tue richieste e offerte ricevute
                    </h5>
                  </div>
                  <div className="card-body" style={{ maxHeight: '700px', overflowY: 'auto' }}>
                    {richieste.filter(r => r.cliente === user?.id).map(r => (
                      <div key={r.id} className="card mb-3 border-0 shadow-sm rounded-3">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="card-title fw-bold text-primary">{r.titolo}</h6>
                            <span className={`badge bg-${r.stato === 'aperta' ? 'success' : r.stato === 'in_lavorazione' ? 'warning text-dark' : 'secondary'} rounded-pill`}>
                              {r.stato}
                            </span>
                          </div>
                          
                          {r.tipo_software && (
                            <div className="mb-2">
                              <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill">
                                {tipiSoftware.find(t => t.value === r.tipo_software)?.icon} {tipiSoftware.find(t => t.value === r.tipo_software)?.label.split(' - ')[0]}
                              </span>
                            </div>
                          )}
                          
                          {r.immagine && (
                            <img 
                              src={r.immagine} 
                              alt={r.titolo}
                              className="img-fluid mb-2 rounded-3"
                              style={{ maxHeight: '120px', objectFit: 'cover' }}
                            />
                          )}
                          
                          <p className="text-muted small mb-2">{r.descrizione}</p>
                          <div className="row g-2 mb-3">
                            <div className="col-4">
                              <small className="text-muted"><FaEuroSign /> Budget: <strong>{r.budget}€</strong></small>
                            </div>
                            <div className="col-4">
                              <small className="text-muted">
                                <FaUser className="me-1 text-primary" />
                                {r.cliente_username || user?.username}
                              </small>
                            </div>
                            <div className="col-4">
                              <small className="text-muted"><FaCalendar /> {new Date(r.data_pubblicazione).toLocaleDateString()}</small>
                            </div>
                          </div>
                          
                          {/* Offerte ricevute */}
                          <div className="border-top pt-2">
                            <h6 className="text-secondary mb-2">Offerte ricevute:</h6>
                            {offerte.filter(o => o.richiesta === r.id).length > 0 ? (
                              offerte.filter(o => o.richiesta === r.id).map(o => (
                                <div key={o.id} className={`alert ${o.stato === 'accettata' ? 'alert-success' : o.stato === 'rifiutata' ? 'alert-danger' : 'alert-light'} py-2 mb-2 border-0 rounded-3`}>
                                  <div className="d-flex justify-content-between align-items-start">
                                    <div>
                                      <strong>{o.fornitore_username}</strong><br />
                                      <small>{o.descrizione}</small><br />
                                      <span className="badge bg-primary rounded-pill"><FaEuroSign /> {o.prezzo}€</span>
                                      <span className={`badge ms-1 rounded-pill bg-${o.stato === 'accettata' ? 'success' : o.stato === 'rifiutata' ? 'danger' : 'secondary'}`}>
                                        {o.stato}
                                      </span>
                                    </div>
                                    {r.stato === 'aperta' && o.stato === 'inviata' && offerte.filter(x => x.richiesta === r.id && x.stato === 'accettata').length === 0 && (
                                      <button 
                                        className="btn btn-sm btn-success rounded-pill" 
                                        disabled={accepting === o.id} 
                                        onClick={() => handleAccetta(o.id)}
                                      >
                                        {accepting === o.id ? <FaClock className="me-1" /> : <FaCheckCircle className="me-1" />}
                                        Accetta
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center text-muted py-2">
                                <small>Nessuna offerta ricevuta ancora</small>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {richieste.filter(r => r.cliente === user?.id).length === 0 && (
                      <div className="text-center text-muted py-5">
                        <FaTimesCircle size={48} className="mb-3 opacity-50" />
                        <p>Non hai ancora creato richieste.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* SEZIONE PRODOTTI DISPONIBILI */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="card border-0 shadow-lg rounded-4">
                  <div className="card-header bg-info bg-gradient text-white border-0 rounded-top-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">
                        <FaShoppingCart className="me-2" />
                        Prodotti Disponibili
                      </h5>
                      <div className="d-flex align-items-center">
                        <span className="badge bg-light text-dark me-2">
                          {prodotti.length} prodotti
                        </span>
                        <a href="/prodotti-pronti" className="btn btn-light btn-sm rounded-pill">
                          Vedi tutti <FaArrowRight className="ms-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    {prodotti.length > 0 ? (
                      <div className="row g-3">
                        {prodotti.slice(0, 6).map(prodotto => (
                          <div key={prodotto.id} className="col-md-6 col-lg-4">
                            <div className="card border-0 shadow-sm rounded-3 h-100 animated-card">
                              <div className="position-relative">
                                {prodotto.immagine ? (
                                  <img 
                                    src={prodotto.immagine} 
                                    alt={prodotto.titolo}
                                    className="card-img-top rounded-top-3"
                                    style={{ height: '180px', objectFit: 'cover' }}
                                  />
                                ) : (
                                  <div className="bg-light d-flex align-items-center justify-content-center rounded-top-3" 
                                       style={{ height: '180px' }}>
                                    <FaBox size={48} className="text-muted" />
                                  </div>
                                )}
                                <div className="position-absolute top-0 end-0 m-2">
                                  <span className="badge bg-success rounded-pill">
                                    €{prodotto.prezzo}
                                  </span>
                                </div>
                              </div>
                              <div className="card-body d-flex flex-column">
                                <div className="mb-2">
                                  <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-2 py-1 small">
                                    {prodotto.categoria}
                                  </span>
                                </div>
                                <h6 className="card-title fw-bold text-primary mb-2">
                                  {prodotto.titolo}
                                </h6>
                                <p className="card-text text-muted small mb-3 flex-grow-1" 
                                   style={{ 
                                     display: '-webkit-box',
                                     WebkitLineClamp: 3,
                                     WebkitBoxOrient: 'vertical',
                                     overflow: 'hidden'
                                   }}>
                                  {prodotto.descrizione}
                                </p>
                                <div className="d-flex justify-content-between align-items-center">
                                  <small className="text-muted">
                                    <FaUser className="me-1" />
                                    {prodotto.fornitore_username}
                                  </small>
                                  <button 
                                    className="btn btn-success btn-sm rounded-pill"
                                    onClick={() => handleAcquistaProdotto(prodotto)}
                                  >
                                    <FaShoppingCart className="me-1" />
                                    Acquista
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-muted py-5">
                        <FaBox size={48} className="mb-3 opacity-50" />
                        <h6>Nessun prodotto disponibile</h6>
                        <p className="mb-0">I prodotti dei fornitori appariranno qui quando saranno pubblicati.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* SEZIONE PROGETTI ATTIVI E ARCHIVIATI */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="card border-0 shadow-lg rounded-4">
                  <div className="card-header bg-success bg-gradient text-white border-0 rounded-top-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">
                        <FaCheckCircle className="me-2" />
                        {showArchived ? 'Progetti Archiviati' : 'Progetti Attivi'}
                      </h5>
                      <div className="d-flex align-items-center">
                        {/* Contatori */}
                        <div className="me-3">
                          <span className="badge bg-light text-dark me-2">
                            Attivi: {progetti.length}
                          </span>
                          <span className="badge bg-light text-dark">
                            Archiviati: {progettiArchiviati.length}
                          </span>
                        </div>
                        
                        {/* Toggle Switch */}
                        <div className="form-check form-switch">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            role="switch" 
                            id="toggleArchived"
                            checked={showArchived}
                            onChange={(e) => setShowArchived(e.target.checked)}
                          />
                          <label className="form-check-label text-white ms-2" htmlFor="toggleArchived">
                            {showArchived ? '🗃️ Archiviati' : '⚡ Attivi'}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body" ref={progettiRef}>
                    {!showArchived ? (
                      // Progetti Attivi
                      <div className="row g-3">
                        {progetti.length > 0 ? progetti.map(p => (
                          <div key={p.id} className="col-md-6 col-lg-4">
                            <div className="card border-0 shadow-sm rounded-3 h-100 animated-card">
                              <div className="card-body text-center">
                                <div className="mb-3">
                                  <span className={`badge rounded-pill px-3 py-2 ${
                                    p.stato === 'completato' ? 'bg-success' :
                                    p.stato === 'pagamento' ? 'bg-warning text-dark' :
                                    p.stato === 'prima_release' ? 'bg-info' :
                                    'bg-primary'
                                  }`}>
                                    {p.stato === 'bozza' && '🎨 Sviluppo'}
                                    {p.stato === 'prima_release' && '🔍 Revisione'}
                                    {p.stato === 'pagamento' && '💳 Pagamento'}
                                    {p.stato === 'completato' && '🏆 Completato'}
                                  </span>
                                </div>
                                <h6 className="card-title text-success fw-bold mb-2">
                                  {p.richiesta_titolo || `Progetto #${p.richiesta}`}
                                </h6>
                                <div className="mb-3">
                                  <div className="row g-2">
                                    <div className="col-6">
                                      <small className="text-muted">
                                        <FaUser className="me-1 text-primary" />
                                        <strong>Cliente:</strong><br />
                                        {p.cliente_username || user?.username}
                                      </small>
                                    </div>
                                    <div className="col-6">
                                      <small className="text-muted">
                                        <FaUser className="me-1 text-success" />
                                        <strong>Fornitore:</strong><br />
                                        {p.fornitore_username}
                                      </small>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <a href={`/progetto/${p.id}`} className="btn btn-outline-success rounded-pill">
                                    <FaEye className="me-1" />
                                    Gestisci progetto
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        )) : (
                          <div className="col-12 text-center text-muted py-5">
                            <FaClock size={48} className="mb-3 opacity-50" />
                            <h6>Nessun progetto attivo</h6>
                            <p className="mb-0">Accetta un'offerta per iniziare un nuovo progetto!</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Progetti Archiviati
                      <div className="row g-3">
                        {progettiArchiviati.length > 0 ? progettiArchiviati.map(p => (
                          <div key={p.id} className="col-md-6 col-lg-4">
                            <div className="card border-0 shadow-sm rounded-3 h-100 animated-card bg-light bg-opacity-50">
                              <div className="card-body text-center">
                                <div className="mb-3">
                                  <span className="badge bg-secondary rounded-pill px-3 py-2">
                                    🗃️ Archiviato
                                  </span>
                                </div>
                                <h6 className="card-title text-secondary fw-bold mb-2">
                                  {p.richiesta_titolo || `Progetto #${p.richiesta}`}
                                </h6>
                                <div className="mb-3">
                                  <div className="row g-2">
                                    <div className="col-6">
                                      <small className="text-muted">
                                        <FaUser className="me-1 text-primary" />
                                        <strong>Cliente:</strong><br />
                                        {p.cliente_username || user?.username}
                                      </small>
                                    </div>
                                    <div className="col-6">
                                      <small className="text-muted">
                                        <FaUser className="me-1 text-success" />
                                        <strong>Fornitore:</strong><br />
                                        {p.fornitore_username}
                                      </small>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-muted small mb-3">
                                  Archiviato il {new Date(p.data_archiviazione).toLocaleDateString('it-IT')}
                                </p>
                                <div>
                                  <a href={`/progetto/${p.id}`} className="btn btn-outline-secondary btn-sm rounded-pill">
                                    <FaEye className="me-1" />
                                    Visualizza storico
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        )) : (
                          <div className="col-12 text-center text-muted py-5">
                            <FaArchive size={48} className="mb-3 opacity-50" />
                            <h6>Nessun progetto archiviato</h6>
                            <p className="mb-0">I progetti completati e archiviati appariranno qui.</p>
                          </div>
                        )}
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
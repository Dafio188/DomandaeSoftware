import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getOfferteFornitore, getProgettiFornitore, getAllRichieste } from '../services/api';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaUser, FaEuroSign, FaCalendar, FaCheckCircle, FaTimesCircle, FaClock, FaLightbulb, FaTools, FaChartLine, FaHandshake, FaStar, FaBriefcase, FaPlus, FaEye, FaImage, FaTimes, FaMagic, FaRocket, FaInfoCircle, FaProjectDiagram, FaArrowLeft, FaArchive, FaSearch, FaArrowRight, FaUserTie, FaEdit, FaArrowUp, FaQuestionCircle, FaEnvelope, FaCog, FaTicketAlt, FaHistory } from 'react-icons/fa';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';
import { API_BASE } from '../config/api.js';

function DashboardFornitore() {
  const { user, token } = useAuth();
  const [offerte, setOfferte] = useState([]);
  const [progetti, setProgetti] = useState([]);
  const [progettiArchiviati, setProgettiArchiviati] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [richieste, setRichieste] = useState([]);
  const [prodotti, setProdotti] = useState([]);
  const [descrizione, setDescrizione] = useState('');
  const [prezzo, setPrezzo] = useState('');
  const [richiestaId, setRichiestaId] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Stati per modal offerta
  const [showModalOfferta, setShowModalOfferta] = useState(false);
  const [richiestaSelezionata, setRichiestaSelezionata] = useState(null);
  
  // Stati per creazione prodotto
  const [showCreaProdotto, setShowCreaProdotto] = useState(false);
  const [prodottoTitolo, setProdottoTitolo] = useState('');
  const [prodottoDescrizione, setProdottoDescrizione] = useState('');
  const [prodottoPrezzo, setProdottoPrezzo] = useState('');
  const [prodottoCategoria, setProdottoCategoria] = useState('');
  const [prodottoImmagine, setProdottoImmagine] = useState(null);
  const [prodottoImmaginePrev, setProdottoImmaginePrev] = useState(null);
  const [_showProdottoPreview, _setShowProdottoPreview] = useState(false);

  // Stati per statistiche dashboard — mancanti: causa crash pagina nera
  const [loadingStats, setLoadingStats] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    grafico_guadagni: [],
    recent_movements: [],
  });

  // Categorie prodotti
  const categorieProdotti = [
    { value: 'template', label: 'Template/Temi', icon: '🎨', desc: 'Template per siti web, temi WordPress, ecc.' },
    { value: 'plugin', label: 'Plugin/Estensioni', icon: '🔌', desc: 'Plugin per CMS, estensioni browser, ecc.' },
    { value: 'script', label: 'Script/Codici', icon: '💻', desc: 'Script PHP, JavaScript, Python, ecc.' },
    { value: 'software', label: 'Software Completi', icon: '📦', desc: 'Software desktop o web completi' },
    { value: 'app', label: 'App Mobile', icon: '📱', desc: 'App native o ibride per mobile' },
    { value: 'servizio', label: 'Servizi/Consulenze', icon: '🎯', desc: 'Servizi di consulenza o supporto' }
  ];

  // Opzioni tipo software (per le richieste)
  const _tipiSoftware = [
    { value: 'crm', label: 'CRM - Customer Relationship Management', icon: '👥' },
    { value: 'gestionale', label: 'Gestionale/ERP - Enterprise Resource Planning', icon: '📊' },
    { value: 'ecommerce', label: 'E-commerce - Negozio Online', icon: '🛒' },
    { value: 'sito_web', label: 'Sito Web - Vetrina/Corporate', icon: '🌐' },
    { value: 'app_mobile', label: 'App Mobile - iOS/Android', icon: '📱' },
    { value: 'web_app', label: 'Web Application - Applicazione Web', icon: '💻' },
    { value: 'software_desktop', label: 'Software Desktop', icon: '🖥️' },
    { value: 'api_servizi', label: 'API/Servizi Web', icon: '🔌' },
    { value: 'automazione', label: 'Automazione Processi', icon: '⚙️' },
    { value: 'business_intelligence', label: 'Business Intelligence', icon: '📈' },
    { value: 'altro', label: 'Altro - Specifica nella descrizione', icon: '💡' }
  ];

  useEffect(() => {
    if (token && user) {
      getOfferteFornitore(token, user.id).then(setOfferte);
      
      // Carica progetti attivi (non archiviati)
      getProgettiFornitore(token, user.id).then(progettiTutti => {
        const progettiAttivi = progettiTutti.filter(p => !p.archiviato);
        setProgetti(progettiAttivi);
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
      
      getAllRichieste(token).then(setRichieste);
      
      // Carica statistiche avanzate
      setLoadingStats(true);
      axios.get(`${API_BASE}stats/dashboard/`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setDashboardData(res.data);
      }).catch(err => {
        console.error('Errore caricamento statistiche dashboard:', err);
      }).finally(() => {
        setLoadingStats(false);
      });

      // Carica i prodotti pronti del fornitore
      axios.get(`${API_BASE}prodotti-pronti/`)
        .then(res => {
          const prodottiFornitore = res.data.filter(p => p.fornitore === user.id);
          setProdotti(prodottiFornitore);
        })
        .catch(err => {
          console.error('Errore caricamento prodotti:', err);
        });
    }
  }, [token, user, success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(''); setError('');
    try {
      await axios.post('/api/offerte/', {
        richiesta: richiestaId,
        fornitore: user.id,
        descrizione,
        prezzo
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('🎉 Offerta inviata con successo! Il cliente riceverà una notifica e potrà valutare la tua proposta.');
      setDescrizione(''); setPrezzo(''); setRichiestaId('');
      setShowModalOfferta(false);
      setRichiestaSelezionata(null);
    } catch (err) {
      setError("Errore nell'invio dell'offerta: " + (err.response?.data?.detail || err.message));
    }
  };

  // Gestione immagine prodotto
  const handleProdottoImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('L\'immagine non può superare i 5MB');
        return;
      }
      
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Formato immagine non supportato. Usa JPG, PNG o WEBP');
        return;
      }
      
      setProdottoImmagine(file);
      const reader = new FileReader();
      reader.onload = (e) => setProdottoImmaginePrev(e.target.result);
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const removeProdottoImage = () => {
    setProdottoImmagine(null);
    setProdottoImmaginePrev(null);
  };

  // Creazione prodotto
  const handleCreaProdotto = async (e) => {
    e.preventDefault();
    setSuccess(''); setError('');
    
    try {
      const formData = new FormData();
      formData.append('fornitore', user.id);
      formData.append('titolo', prodottoTitolo);
      formData.append('descrizione', prodottoDescrizione);
      formData.append('prezzo', prodottoPrezzo);
      formData.append('categoria', prodottoCategoria);
      if (prodottoImmagine) {
        formData.append('immagine', prodottoImmagine);
      }

      await axios.post('/api/prodotti-pronti/', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess('🎉 Prodotto pubblicato con successo! È ora visibile nel marketplace e i clienti possono contattarti direttamente per acquistarlo.');
      setProdottoTitolo(''); setProdottoDescrizione(''); setProdottoPrezzo(''); setProdottoCategoria('');
      removeProdottoImage();
      _setShowProdottoPreview(false);
      setShowCreaProdotto(false);
      
      // Mostra un toast di successo più evidente
      setTimeout(() => {
        alert('✅ SUCCESSO!\n\nIl tuo prodotto è stato pubblicato e sarà visibile a tutti i clienti del marketplace.\n\nI clienti interessati potranno contattarti direttamente per procedere all\'acquisto.');
      }, 500);
      
    } catch (err) {
      setError('Errore nella creazione del prodotto: ' + (err.response?.data?.detail || err.message));
    }
  };

  // Anteprima card prodotto
  const renderProdottoPreview = () => {
    if (!prodottoTitolo || !prodottoCategoria || !prodottoDescrizione || !prodottoPrezzo) return null;
    
    const categoriaSelezionata = categorieProdotti.find(c => c.value === prodottoCategoria);
    
    return (
      <div className="card border-0 shadow-lg rounded-4 mb-4" style={{ background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
        <div className="card-body p-4">
          <div className="d-flex align-items-center mb-3">
            <div className="badge bg-warning bg-gradient rounded-pill px-3 py-2 me-2">
              <span className="me-1">{categoriaSelezionata?.icon}</span>
              {categoriaSelezionata?.label}
            </div>
            <span className="badge bg-primary bg-gradient rounded-pill px-3 py-2">NUOVO</span>
          </div>
          
          <h5 className="card-title fw-bold text-primary mb-3">{prodottoTitolo}</h5>
          
          {prodottoImmaginePrev && (
            <div className="mb-3">
              <img 
                src={prodottoImmaginePrev} 
                alt="Anteprima prodotto" 
                className="img-fluid rounded-3"
                style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }}
              />
            </div>
          )}
          
          <p className="text-muted mb-3" style={{ lineHeight: '1.6' }}>
            {prodottoDescrizione.length > 100 ? 
              prodottoDescrizione.substring(0, 100) + '...' : 
              prodottoDescrizione
            }
          </p>
          
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <FaEuroSign className="text-success me-2" />
              <span className="h5 text-success mb-0 fw-bold">{prodottoPrezzo}€</span>
            </div>
            <div className="d-flex align-items-center text-muted">
              <FaUser className="me-2" />
              <span>{user?.username}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleCloseModalOfferta = () => {
    setShowModalOfferta(false);
    setRichiestaSelezionata(null);
    setDescrizione('');
    setPrezzo('');
    setError('');
  };

  // Utilizzo statistiche reali dalla dashboardData
  const realStats = dashboardData.stats;

  // Filtra richieste escludendo quelle per cui ho già fatto un'offerta
  const richiesteDisponibili = richieste.filter(richiesta => {
    // Escludi richieste non aperte
    if (richiesta.stato !== 'aperta') return false;
    
    // Escludi richieste per cui ho già fatto un'offerta
    const hoGiaOfferto = offerte.some(offerta => offerta.richiesta === richiesta.id);
    return !hoGiaOfferto;
  });

  return (
    <div className="py-4">
      <div className="row">
        <div className="col-12">
            {/* HEADER MODERNO IN STILE APPLE */}
            <div className="welcome-header mb-5">
              <div className="mac-glass-card p-4 p-md-5">
                <div className="row align-items-center">
                  <div className="col-lg-8">
                    <div className="d-flex align-items-center">
                      <div className="welcome-icon bg-primary bg-opacity-10 rounded-circle p-4 me-4 d-none d-md-flex">
                        <FaUserTie size={48} className="text-primary" />
                      </div>
                      <div>
                        <h1 className="mac-title mb-2">
                          Ciao, <span className="text-primary">{user?.username || 'Fornitore'}</span>! 👋
                        </h1>
                        <p className="mac-subtitle mb-0 fs-5">
                          Ecco il riepilogo delle tue attività e le nuove opportunità.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
                    <div className="d-flex justify-content-lg-end gap-2 flex-wrap">
                      <div className="mac-glass-card px-4 py-2 d-flex align-items-center border-0 shadow-none bg-white bg-opacity-50">
                        <FaTicketAlt className="me-2 text-primary" />
                        <span className="fw-bold text-dark">{user?.crediti ?? 0}</span>
                        <span className="ms-1 text-muted small">Crediti</span>
                      </div>
                      <Link to="/crediti" className="btn btn-primary mac-button px-4 shadow-sm">
                        Ricarica
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-top d-flex flex-wrap gap-2">
                  <Link to="/richieste" className="btn btn-light mac-button px-4 border">
                    <FaSearch className="me-2" /> Trova Progetti
                  </Link>
                  <Link to="/prodotti-pronti" className="btn btn-light mac-button px-4 border">
                    <FaStar className="me-2" /> Marketplace
                  </Link>
                  <Link to="/le-tue-idee" className="btn btn-light mac-button px-4 border">
                    <FaLightbulb className="me-2" /> Le Tue Idee
                  </Link>
                </div>
              </div>
            </div>

            {/* MESSAGGI DI SUCCESSO/ERRORE */}
            {success && (
              <div className="alert alert-success mac-glass-card border-0 shadow-sm mb-4 d-flex align-items-center p-3" role="alert">
                <FaCheckCircle className="me-3 text-success" size={24} />
                <div className="text-dark">{success}</div>
                <button type="button" className="btn-close ms-auto" onClick={() => setSuccess('')}></button>
              </div>
            )}

            {error && (
              <div className="alert alert-danger mac-glass-card border-0 shadow-sm mb-4 d-flex align-items-center p-3" role="alert">
                <FaTimesCircle className="me-3 text-danger" size={24} />
                <div className="text-dark">{error}</div>
                <button type="button" className="btn-close ms-auto" onClick={() => setError('')}></button>
              </div>
            )}

            {/* STATISTICHE DASHBOARD - WIDGET STYLE */}
            <div className="row g-4 mb-4">
              <div className="col-6 col-md-4 col-lg-2-4">
                <div className="mac-glass-card p-4 text-center h-100 border-0">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-3 mx-auto mb-3" style={{width:'fit-content'}}>
                    <FaHandshake size={24} className="text-primary" />
                  </div>
                  <h3 className="mac-title mb-1">{realStats.totale_offerte}</h3>
                  <p className="mac-subtitle small mb-0">Offerte inviate</p>
                </div>
              </div>
              <div className="col-6 col-md-4 col-lg-2-4">
                <div className="mac-glass-card p-4 text-center h-100 border-0">
                  <div className="bg-success bg-opacity-10 rounded-circle p-3 mx-auto mb-3" style={{width:'fit-content'}}>
                    <FaCheckCircle size={24} className="text-success" />
                  </div>
                  <h3 className="mac-title mb-1">{realStats.offerte_accettate}</h3>
                  <p className="mac-subtitle small mb-0">Accettate</p>
                </div>
              </div>
              <div className="col-6 col-md-4 col-lg-2-4">
                <div className="mac-glass-card p-4 text-center h-100 border-0">
                  <div className="bg-info bg-opacity-10 rounded-circle p-3 mx-auto mb-3" style={{width:'fit-content'}}>
                    <FaBriefcase size={24} className="text-info" />
                  </div>
                  <h3 className="mac-title mb-1">{progetti.length}</h3>
                  <p className="mac-subtitle small mb-0">Progetti attivi</p>
                </div>
              </div>
              <div className="col-6 col-md-4 col-lg-2-4">
                <div className="mac-glass-card p-4 text-center h-100 border-0">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-3 mx-auto mb-3" style={{width:'fit-content'}}>
                    <FaChartLine size={24} className="text-warning" />
                  </div>
                  <h3 className="mac-title mb-1">{realStats.success_rate}%</h3>
                  <p className="mac-subtitle small mb-0">Success Rate</p>
                </div>
              </div>
              <div className="col-6 col-md-4 col-lg-2-4">
                <div className="mac-glass-card p-4 text-center h-100 border-0">
                  <div className="bg-dark bg-opacity-10 rounded-circle p-3 mx-auto mb-3" style={{width:'fit-content'}}>
                    <FaEuroSign size={24} className="text-dark" />
                  </div>
                  <h3 className="mac-title mb-1">{(realStats.guadagno_totale ?? 0).toFixed(0)}€</h3>
                  <p className="mac-subtitle small mb-0">Guadagno tot.</p>
                </div>
              </div>
            </div>

            {/* ANALITYCS & MOVIMENTI */}
            <div className="row g-4 mb-5">
              <div className="col-xl-8">
                <div className="mac-glass-card p-4 h-100">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h5 className="mac-title mb-1">Andamento Guadagni</h5>
                      <p className="mac-subtitle small mb-0">Prestazioni degli ultimi mesi</p>
                    </div>
                    <div className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2">
                       {realStats.guadagno_totale > 0 ? '+ Pro' : 'In attesa'}
                    </div>
                  </div>
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dashboardData.grafico_guadagni}>
                        <defs>
                          <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0071e3" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#0071e3" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#86868b'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#86868b'}} />
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="earnings" 
                          stroke="#0071e3" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorEarnings)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="col-xl-4">
                <div className="mac-glass-card p-4 h-100">
                  <div className="d-flex align-items-center mb-4">
                    <FaHistory className="text-primary me-2" />
                    <h5 className="mac-title mb-0">Storico Crediti</h5>
                  </div>
                  <div className="movements-list overflow-auto" style={{maxHeight:'280px'}}>
                    {dashboardData.recent_movements.length > 0 ? (
                      dashboardData.recent_movements.map(mov => (
                        <div key={mov.id} className="d-flex align-items-center p-3 mb-2 rounded-4 bg-white bg-opacity-40 border border-white">
                          <div className={`rounded-circle p-2 me-3 ${mov.delta > 0 ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>
                            {mov.delta > 0 ? <FaArrowUp size={12} /> : <FaArrowLeft size={12} style={{transform:'rotate(-90deg)'}} />}
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mac-title small mb-0">{mov.reason || 'Movimento crediti'}</h6>
                            <small className="mac-subtitle" style={{fontSize:'0.65rem'}}>{new Date(mov.created_at).toLocaleDateString()}</small>
                          </div>
                          <div className={`fw-bold ${mov.delta > 0 ? 'text-success' : 'text-danger'}`}>
                            {mov.delta > 0 ? '+' : ''}{mov.delta}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted py-5 small">Nessun movimento recente</p>
                    )}
                  </div>
                  <Link to="/crediti" className="btn btn-link w-100 text-primary text-decoration-none small mt-3 fw-bold">
                    Gestisci Crediti
                  </Link>
                </div>
              </div>
            </div>

            {/* 🤝 GESTIONE OFFERTE INVIATE */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="mac-glass-card overflow-hidden">
                  <div className="p-4 border-bottom bg-white bg-opacity-30">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h4 className="mac-title mb-1">
                          <FaHandshake className="me-2 text-primary" />
                          Gestione Offerte
                        </h4>
                        <p className="mac-subtitle mb-0 small">Monitora le tue proposte ai clienti</p>
                      </div>
                      <div className="d-none d-md-flex align-items-center gap-4">
                        <div className="text-center">
                          <h5 className="mac-title mb-0">{offerte.length}</h5>
                          <small className="mac-subtitle">totali</small>
                        </div>
                        <div className="text-center">
                          <h5 className="mac-title mb-0 text-warning">{offerte.filter(o => o.stato === 'in_attesa').length}</h5>
                          <small className="mac-subtitle">attesa</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    {offerte.length > 0 ? (
                      <div className="row g-4">
                        {offerte.map(offerta => (
                          <div key={offerta.id} className="col-lg-6">
                            <div className="mac-glass-card p-4 border-0 shadow-sm h-100 bg-white bg-opacity-50">
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                  <h6 className="mac-title mb-1 text-primary">
                                    {offerta.richiesta_titolo || `Richiesta #${offerta.richiesta}`}
                                  </h6>
                                  <small className="mac-subtitle">
                                    <FaUser className="me-1" /> Cliente: {offerta.cliente_username}
                                  </small>
                                </div>
                                <span className={`mac-badge ${
                                  offerta.stato === 'accettata' ? 'bg-success text-white' :
                                  offerta.stato === 'rifiutata' ? 'bg-danger text-white' :
                                  'bg-warning text-dark'
                                }`}>
                                  {offerta.stato === 'accettata' ? 'Accettata' : 
                                   offerta.stato === 'rifiutata' ? 'Rifiutata' : 'In attesa'}
                                </span>
                              </div>
                              <p className="text-muted small mb-3" style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                height: '2.8em'
                              }}>
                                {offerta.descrizione}
                              </p>
                              <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                <div className="h5 mac-title text-success mb-0">{offerta.prezzo}€</div>
                                <div className="text-muted small">
                                  <FaCalendar className="me-1" />
                                  {new Date(offerta.data_offerta).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-5">
                        <FaHandshake size={48} className="text-muted opacity-20 mb-3" />
                        <h5 className="mac-subtitle">Nessuna offerta inviata</h5>
                        <p className="text-muted small">Inizia a proporre le tue soluzioni ai clienti!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RICHIESTE IN EVIDENZA */}
            <div className="row mt-5">
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="mac-title mb-0">🎯 Opportunità per te</h4>
                  <Link to="/richieste" className="btn btn-link text-primary p-0 text-decoration-none fw-bold">
                    Vedi tutte <FaArrowRight className="ms-1" size={12} />
                  </Link>
                </div>
                <div className="row g-4">
                  {richiesteDisponibili.slice(0, 3).map(richiesta => (
                    <div key={richiesta.id} className="col-lg-4">
                      <div className="mac-glass-card p-4 h-100 border-0">
                        <h6 className="mac-title mb-3 text-primary">{richiesta.titolo}</h6>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="h5 mac-title text-success mb-0">{richiesta.budget}€</div>
                          <small className="mac-subtitle">
                            <FaUser className="me-1" /> {richiesta.cliente_username}
                          </small>
                        </div>
                        <button 
                          className="btn btn-primary mac-button w-100 shadow-sm"
                          onClick={() => {
                            setRichiestaId(richiesta.id);
                            setShowModalOfferta(true);
                            setRichiestaSelezionata(richiesta);
                          }}
                        >
                          Fai Offerta
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PROGETTI E PRODOTTI */}
            <div className="row mt-5 g-5">
              <div className="col-lg-6">
                <div className="mac-glass-card p-4 h-100">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mac-title mb-0">
                      <FaBriefcase className="me-2 text-success" />
                      Progetti {showArchived ? 'Archiviati' : 'Attivi'}
                    </h5>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} id="archivedSwitch" />
                      <label className="form-check-label ms-2 small text-muted" htmlFor="archivedSwitch">Archivio</label>
                    </div>
                  </div>
                  
                  <div className="row g-3">
                    {(showArchived ? progettiArchiviati : progetti).length > 0 ? 
                      (showArchived ? progettiArchiviati : progetti).map(p => (
                      <div key={p.id} className="col-12">
                        <div className="p-3 rounded-4 bg-white bg-opacity-40 border border-white">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="mac-badge bg-primary text-white" style={{fontSize:'0.6rem'}}>
                              {p.stato}
                            </span>
                            <span className="mac-title text-success">{p.prezzo_finale || p.budget}€</span>
                          </div>
                          <h6 className="mac-title small mb-3">{p.richiesta_titolo}</h6>
                          <Link to={`/progetto/${p.id}`} className="btn btn-light mac-button btn-sm w-100 border">
                            Gestisci Progetto
                          </Link>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-4">
                        <p className="mac-subtitle small">Nessun progetto da mostrare</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="mac-glass-card p-4 h-100">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mac-title mb-0">
                      <FaStar className="me-2 text-warning" />
                      I tuoi Prodotti
                    </h5>
                    <button className="btn btn-primary mac-button btn-sm px-3" onClick={() => setShowCreaProdotto(true)}>
                      <FaPlus className="me-1" /> Nuovo
                    </button>
                  </div>

                  <div className="row g-3">
                    {prodotti.length > 0 ? prodotti.slice(0, 3).map(prodotto => (
                      <div key={prodotto.id} className="col-12">
                        <div className="p-3 rounded-4 bg-white bg-opacity-40 border border-white d-flex align-items-center">
                          {prodotto.immagine && (
                            <img src={prodotto.immagine} className="rounded-3 me-3" style={{width:50, height:50, objectFit:'cover'}} alt="" />
                          )}
                          <div className="flex-grow-1 overflow-hidden">
                            <h6 className="mac-title small mb-0 text-truncate">{prodotto.titolo}</h6>
                            <span className="text-success fw-bold small">{prodotto.prezzo}€</span>
                          </div>
                          <Link to="/prodotti-pronti" className="btn btn-light mac-button btn-sm ms-2 border">
                            <FaEye size={12} />
                          </Link>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-4">
                        <p className="mac-subtitle small">Non hai ancora pubblicato prodotti</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* MODAL OFFERTA */}
      {showModalOfferta && richiestaSelezionata && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header bg-primary bg-gradient text-white border-0 rounded-top-4">
                <div>
                  <h4 className="modal-title mb-1">
                    <FaHandshake className="me-3" />
                    Fai un'offerta
                  </h4>
                  <p className="mb-0 opacity-90">Proponi la tua soluzione per: {richiestaSelezionata.titolo}</p>
                </div>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={handleCloseModalOfferta}
                ></button>
              </div>
              <div className="modal-body p-4">
                {/* Info richiesta */}
                <div className="card bg-light bg-gradient border-0 rounded-4 mb-4">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-8">
                        <h6 className="text-primary fw-bold mb-2">{richiestaSelezionata.titolo}</h6>
                        <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                          {richiestaSelezionata.descrizione.substring(0, 150)}...
                        </p>
                      </div>
                      <div className="col-md-4 text-md-end">
                        <div className="mb-2">
                          <small className="text-muted">Budget cliente</small>
                          <div className="h5 text-success mb-0">
                            <FaEuroSign className="me-1" />
                            {richiestaSelezionata.budget}€
                          </div>
                        </div>
                        <small className="text-muted">
                          <FaUser className="me-1" />
                          {richiestaSelezionata.cliente_username}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label fw-bold">La tua proposta dettagliata</label>
                    <textarea 
                      className="form-control" 
                      rows="6"
                      placeholder="Descrivi la tua soluzione, metodologia di lavoro, tempistiche e cosa include il prezzo..."
                      value={descrizione} 
                      onChange={e => setDescrizione(e.target.value)} 
                      required 
                    />
                    <div className="form-text">
                      💡 Suggerimento: Sii specifico su cosa offri, i tempi di consegna e eventuali garanzie
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label fw-bold">Il tuo prezzo</label>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-success text-white">
                        <FaEuroSign />
                      </span>
                      <input 
                        type="number" 
                        className="form-control" 
                        placeholder="Inserisci il tuo prezzo" 
                        value={prezzo} 
                        onChange={e => setPrezzo(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="form-text">
                      💰 Il cliente ha un budget di {richiestaSelezionata.budget}€
                    </div>
                  </div>
                  
                  <div className="d-flex gap-3">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary btn-lg rounded-pill"
                      onClick={handleCloseModalOfferta}
                    >
                      <FaTimes className="me-2" />
                      Annulla
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg flex-fill rounded-pill shadow"
                      disabled={!descrizione || !prezzo}
                    >
                      <FaHandshake className="me-2" />
                      Invia Offerta
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREAZIONE PRODOTTO */}
      {showCreaProdotto && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header bg-warning bg-gradient text-white border-0 rounded-top-4">
                <div>
                  <h4 className="modal-title mb-1">
                    <FaStar className="me-3" />
                    Crea il tuo prodotto software
                  </h4>
                  <p className="mb-0 opacity-90">Pubblica un software già sviluppato nel marketplace</p>
                </div>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowCreaProdotto(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="row">
                  <div className="col-lg-8">
                    <form onSubmit={handleCreaProdotto}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-bold">Nome del prodotto</label>
                          <input 
                            type="text" 
                            className="form-control form-control-lg" 
                            placeholder="Es: Sistema CRM completo per PMI" 
                            value={prodottoTitolo} 
                            onChange={e => setProdottoTitolo(e.target.value)} 
                            required 
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-bold">Categoria</label>
                          <select 
                            className="form-select form-select-lg" 
                            value={prodottoCategoria} 
                            onChange={e => setProdottoCategoria(e.target.value)} 
                            required
                          >
                            <option value="">Seleziona categoria...</option>
                            {categorieProdotti.map(cat => (
                              <option key={cat.value} value={cat.value}>
                                {cat.icon} {cat.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label fw-bold">Descrizione completa</label>
                        <textarea 
                          className="form-control" 
                          rows="6"
                          placeholder="Descrivi in dettaglio il tuo prodotto software..."
                          value={prodottoDescrizione} 
                          onChange={e => setProdottoDescrizione(e.target.value)} 
                          required 
                        />
                      </div>
                      
                      <div className="row">
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-bold">Prezzo di vendita</label>
                          <div className="input-group input-group-lg">
                            <span className="input-group-text bg-success text-white">
                              <FaEuroSign />
                            </span>
                            <input 
                              type="number" 
                              className="form-control" 
                              placeholder="299" 
                              value={prodottoPrezzo} 
                              onChange={e => setProdottoPrezzo(e.target.value)} 
                              required 
                            />
                          </div>
                        </div>
                        <div className="col-md-8 mb-3">
                          <label className="form-label fw-bold">Immagine prodotto</label>
                          <input 
                            type="file" 
                            className="form-control" 
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleProdottoImageChange}
                          />
                          {prodottoImmaginePrev && (
                            <div className="mt-2 position-relative d-inline-block">
                              <img 
                                src={prodottoImmaginePrev} 
                                alt="Anteprima" 
                                className="img-thumbnail"
                                style={{ maxHeight: '100px' }}
                              />
                              <button 
                                type="button"
                                className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                onClick={removeProdottoImage}
                                style={{ transform: 'translate(50%, -50%)' }}
                              >
                                <FaTimes />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="d-flex gap-3 mt-4">
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary btn-lg rounded-pill"
                          onClick={() => setShowCreaProdotto(false)}
                        >
                          <FaTimes className="me-2" />
                          Annulla
                        </button>
                        <button 
                          type="submit" 
                          className="btn btn-warning btn-lg flex-fill rounded-pill shadow"
                          disabled={!prodottoTitolo || !prodottoCategoria || !prodottoDescrizione || !prodottoPrezzo}
                        >
                          <FaRocket className="me-2" />
                          Pubblica nel marketplace
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  <div className="col-lg-4">
                    <div className="sticky-top" style={{ top: '20px' }}>
                      <h6 className="fw-bold mb-3">
                        <FaEye className="me-2 text-primary" />
                        Anteprima prodotto
                      </h6>
                      {renderProdottoPreview()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS PERSONALIZZATO */}
      <style jsx>{`
        .col-md-2-4 {
          flex: 0 0 auto;
          width: 20%;
        }
        
        @media (max-width: 768px) {
          .col-md-2-4 {
            width: 50%;
          }
        }
        
        @media (max-width: 576px) {
          .col-md-2-4 {
            width: 100%;
          }
        }
        
        .card-hover {
          transition: all 0.3s ease;
          border-color: rgba(0,0,0,0.08) !important;
        }
        
        .card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 1rem 3rem rgba(0,0,0,0.175) !important;
        }
        
        .richiesta-card-enhanced {
          transition: all 0.3s ease;
          border: 1px solid rgba(0,0,0,0.08);
        }
        
        .richiesta-card-enhanced:hover {
          transform: translateY(-3px);
          box-shadow: 0 1rem 3rem rgba(0,0,0,0.15) !important;
          border-color: rgba(0,123,255,0.25);
        }
        
        .bg-gradient-light {
          background: linear-gradient(135deg, #f8f9fc 0%, #e8edf5 100%);
        }
        
        .bg-gradient-white {
          background: linear-gradient(135deg, #ffffff 0%, #f4f6f9 100%);
        }
        
        .animated-card {
          animation: slideInUp 0.6s ease-out;
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .offerta-card-hover {
          transition: all 0.3s ease;
          border: 1px solid rgba(0,0,0,0.08);
        }
        
        .offerta-card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 0.5rem 1.5rem rgba(0,0,0,0.15) !important;
          border-color: rgba(13,110,253,0.25);
        }
      `}</style>
    </div>
  );
}

export default DashboardFornitore; 

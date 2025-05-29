import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getOfferteFornitore, getProgettiFornitore, getAllRichieste } from '../services/api';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaUser, FaEuroSign, FaCalendar, FaCheckCircle, FaTimesCircle, FaClock, FaLightbulb, FaTools, FaChartLine, FaHandshake, FaStar, FaBriefcase, FaPlus, FaEye, FaImage, FaTimes, FaMagic, FaRocket, FaInfoCircle, FaProjectDiagram, FaArrowLeft, FaArchive, FaSearch, FaArrowRight } from 'react-icons/fa';

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
  const [showProdottoPreview, setShowProdottoPreview] = useState(false);

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
  const tipiSoftware = [
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
      axios.get('/api/progetti/archiviati/', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setProgettiArchiviati(res.data.results || []);
      }).catch(err => {
        console.log('Errore nel caricamento progetti archiviati:', err);
        setProgettiArchiviati([]);
      });
      
      getAllRichieste(token).then(setRichieste);
      // Carica i prodotti pronti del fornitore
      axios.get('/api/prodotti-pronti/')
        .then(res => {
          console.log('Prodotti caricati:', res.data);
          console.log('User ID:', user.id);
          const prodottiFornitore = res.data.filter(p => p.fornitore === user.id);
          console.log('Prodotti filtrati per fornitore:', prodottiFornitore);
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
      setShowProdottoPreview(false);
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
          
          {prodottoImmaginePrev && (
            <div className="position-relative mb-3">
              <img 
                src={prodottoImmaginePrev} 
                alt="Anteprima" 
                className="img-fluid rounded-3"
                style={{ height: '200px', width: '100%', objectFit: 'cover' }}
              />
              <div className="position-absolute top-0 end-0 m-2">
                <span className="badge bg-dark bg-opacity-75 rounded-pill">Immagine prodotto</span>
              </div>
            </div>
          )}
          
          <h5 className="card-title fw-bold text-primary mb-2">{prodottoTitolo}</h5>
          <p className="card-text text-muted mb-3" style={{ lineHeight: '1.6' }}>{prodottoDescrizione}</p>
          
          <div className="row g-3 mb-3">
            <div className="col-6">
              <div className="d-flex align-items-center">
                <FaEuroSign className="text-success me-2" />
                <div>
                  <small className="text-muted d-block">Prezzo</small>
                  <strong className="text-success">{prodottoPrezzo}€</strong>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex align-items-center">
                <FaUser className="text-info me-2" />
                <div>
                  <small className="text-muted d-block">Fornitore</small>
                  <strong>{user?.username}</strong>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-top pt-3">
            <small className="text-muted">
              <FaCalendar className="me-1" />
              Pubblicato il {new Date().toLocaleDateString('it-IT')}
            </small>
          </div>
        </div>
      </div>
    );
  };

  // Calcolo le richieste disponibili correttamente:
  // Il fornitore deve vedere TUTTE le richieste aperte (fino a quando non vengono accettate)
  // NON deve essere limitato dalle sue offerte già inviate
  const richiesteOffertabili = richieste.filter(r => r.stato === 'aperta');
  
  // Ottengo le richieste per cui il fornitore ha già fatto offerta (per mostrarlo nella UI)
  const offerteIds = offerte.map(o => o.richiesta);
  
  // Statistiche
  const stats = {
    offerteInviate: offerte.length,
    offerteAccettate: offerte.filter(o => o.stato === 'accettata').length,
    progettiAttivi: progetti.length,
    prodottiPubblicati: prodotti.length,
    guadagnoTotale: offerte.filter(o => o.stato === 'accettata').reduce((sum, o) => sum + parseFloat(o.prezzo), 0)
  };

  // Gestione modal offerta
  const handleCloseModalOfferta = () => {
    setShowModalOfferta(false);
    setRichiestaSelezionata(null);
    setRichiestaId('');
    setDescrizione('');
    setPrezzo('');
    setError('');
  };

  return (
    <div className="container-fluid bg-light min-vh-100">
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="text-center mb-5 pt-4">
            <div className="d-inline-flex align-items-center bg-success bg-gradient rounded-pill px-4 py-2 mb-3">
              <FaTools className="text-white me-2" />
              <span className="text-white fw-bold">Dashboard Fornitore</span>
            </div>
            <h1 className="fw-bold text-dark mb-2">Benvenuto, <span className="text-success">{user?.username}</span>!</h1>
            <p className="lead text-muted">Gestisci le tue offerte, crea prodotti innovativi e costruisci il tuo successo nel marketplace software.</p>
          </div>

          {/* STATISTICHE MIGLIORATE */}
          <div className="row g-3 mb-4">
            <div className="col-md-2-4">
              <div className="card bg-primary bg-gradient text-white h-100 border-0 rounded-4">
                <div className="card-body text-center">
                  <FaHandshake size={28} className="mb-2" />
                  <h4 className="card-title">{stats.offerteInviate}</h4>
                  <p className="card-text small">Offerte inviate</p>
                </div>
              </div>
            </div>
            <div className="col-md-2-4">
              <div className="card bg-success bg-gradient text-white h-100 border-0 rounded-4">
                <div className="card-body text-center">
                  <FaCheckCircle size={28} className="mb-2" />
                  <h4 className="card-title">{stats.offerteAccettate}</h4>
                  <p className="card-text small">Offerte accettate</p>
                </div>
              </div>
            </div>
            <div className="col-md-2-4">
              <div className="card bg-info bg-gradient text-white h-100 border-0 rounded-4">
                <div className="card-body text-center">
                  <FaBriefcase size={28} className="mb-2" />
                  <h4 className="card-title">{stats.progettiAttivi}</h4>
                  <p className="card-text small">Progetti attivi</p>
                </div>
              </div>
            </div>
            <div className="col-md-2-4">
              <div className="card bg-warning bg-gradient text-white h-100 border-0 rounded-4">
                <div className="card-body text-center">
                  <FaStar size={28} className="mb-2" />
                  <h4 className="card-title">{stats.prodottiPubblicati}</h4>
                  <p className="card-text small">Prodotti pubblicati</p>
                </div>
              </div>
            </div>
            <div className="col-md-2-4">
              <div className="card bg-dark bg-gradient text-white h-100 border-0 rounded-4">
                <div className="card-body text-center">
                  <FaEuroSign size={28} className="mb-2" />
                  <h4 className="card-title">{stats.guadagnoTotale.toFixed(0)}€</h4>
                  <p className="card-text small">Guadagno totale</p>
                </div>
              </div>
            </div>
          </div>

          {/* SEZIONE RICHIESTE IN EVIDENZA - PRIORITÀ MASSIMA */}
          <div className="row mt-4" data-section="richieste">
            <div className="col-12">
              <div className="card border-0 shadow-lg rounded-4">
                <div className="card-header bg-gradient text-white border-0 rounded-top-4" 
                     style={{ background: 'linear-gradient(135deg, #28a745, #20c997)' }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 className="mb-1">
                        <FaSearch className="me-3" />
                        🎯 Richieste in Evidenza
                      </h4>
                      <p className="mb-0 opacity-90">Le migliori opportunità per il tuo business</p>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="text-center me-3">
                        <h3 className="mb-0">{richieste.filter(r => r.stato === 'aperta').length}</h3>
                        <small className="opacity-75">disponibili</small>
                      </div>
                      <Link to="/richieste" className="btn btn-light btn-lg rounded-pill shadow">
                        <FaArrowRight className="me-2" />
                        Esplora Tutte
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="card-body p-4">
                  {richieste.filter(r => r.stato === 'aperta').length > 0 ? (
                    <>
                      <div className="row g-4">
                        {richieste.filter(r => r.stato === 'aperta').slice(0, 6).map(richiesta => {
                          const tipoSoftware = tipiSoftware.find(t => t.value === richiesta.tipo_software);
                          return (
                            <div key={richiesta.id} className="col-lg-4 col-md-6">
                              <div className="card border-0 shadow-lg rounded-4 h-100 richiesta-card-enhanced">
                                {/* Immagine header se presente */}
                                {richiesta.immagine && (
                                  <div className="position-relative">
                                    <img 
                                      src={richiesta.immagine} 
                                      alt={richiesta.titolo}
                                      className="card-img-top rounded-top-4"
                                      style={{ height: '180px', objectFit: 'cover' }}
                                    />
                                    <div className="position-absolute top-0 end-0 m-3">
                                      <span className="badge bg-success bg-gradient rounded-pill px-3 py-2 shadow">
                                        🟢 APERTA
                                      </span>
                                    </div>
                                  </div>
                                )}
                                
                                <div className="card-body p-4">
                                  {/* Header con categoria */}
                                  <div className="d-flex align-items-center justify-content-between mb-3">
                                    {tipoSoftware && (
                                      <span className="badge rounded-pill px-3 py-2 fw-semibold" style={{ 
                                        backgroundColor: `${tipoSoftware.color}15`, 
                                        color: tipoSoftware.color,
                                        border: `2px solid ${tipoSoftware.color}40`
                                      }}>
                                        {tipoSoftware.icon} {tipoSoftware.label}
                                      </span>
                                    )}
                                    {!richiesta.immagine && (
                                      <span className="badge bg-success bg-gradient rounded-pill px-3 py-2">
                                        🟢 APERTA
                                      </span>
                                    )}
                                  </div>
                                  
                                  {/* Titolo prominente */}
                                  <h5 className="card-title fw-bold mb-3 text-primary" style={{ lineHeight: '1.3' }}>
                                    {richiesta.titolo}
                                  </h5>
                                  
                                  {/* Descrizione estesa */}
                                  <p className="text-muted mb-4" style={{ 
                                    lineHeight: '1.6',
                                    height: '72px',
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical'
                                  }}>
                                    {richiesta.descrizione.length > 150 ? 
                                      richiesta.descrizione.substring(0, 150) + '...' : 
                                      richiesta.descrizione
                                    }
                                  </p>
                                  
                                  {/* Info grid dettagliata */}
                                  <div className="row g-3 mb-4">
                                    <div className="col-6">
                                      <div className="d-flex align-items-center">
                                        <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                                          <FaEuroSign className="text-success" />
                                        </div>
                                        <div>
                                          <small className="text-muted d-block">Budget</small>
                                          <strong className="text-success h6 mb-0">{richiesta.budget}€</strong>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-6">
                                      <div className="d-flex align-items-center">
                                        <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                                          <FaUser className="text-info" />
                                        </div>
                                        <div>
                                          <small className="text-muted d-block">Cliente</small>
                                          <strong className="h6 mb-0">{richiesta.cliente_username}</strong>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Footer con azioni */}
                                  <div className="border-top pt-3">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                      <small className="text-muted">
                                        <FaCalendar className="me-1" />
                                        Pubblicata: {new Date(richiesta.data_pubblicazione).toLocaleDateString('it-IT')}
                                      </small>
                                    </div>
                                    
                                    <div className="d-grid gap-2">
                                      <button 
                                        className="btn btn-primary btn-lg rounded-pill shadow"
                                        onClick={() => {
                                          setRichiestaId(richiesta.id);
                                          setShowModalOfferta(true);
                                          setRichiestaSelezionata(richiesta);
                                        }}
                                        title="Fai un'offerta per questa richiesta"
                                      >
                                        <FaHandshake className="me-2" />
                                        Fai un'Offerta
                                      </button>
                                      <Link 
                                        to="/richieste" 
                                        className="btn btn-outline-secondary btn-sm rounded-pill"
                                      >
                                        <FaEye className="me-1" />
                                        Vedi Dettagli Completi
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Call to action se ci sono più richieste */}
                      {richieste.filter(r => r.stato === 'aperta').length > 6 && (
                        <div className="text-center mt-5 p-4 bg-light bg-gradient rounded-4">
                          <h5 className="mb-3">🚀 Ci sono altre {richieste.filter(r => r.stato === 'aperta').length - 6} opportunità!</h5>
                          <p className="text-muted mb-4">Esplora tutte le richieste per trovare il progetto perfetto per te</p>
                          <Link to="/richieste" className="btn btn-success btn-lg rounded-pill px-5 shadow">
                            <FaSearch className="me-2" />
                            Esplora Tutte le Richieste
                          </Link>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-5">
                      <div className="bg-light bg-gradient rounded-circle mx-auto mb-4" style={{ width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaSearch size={48} className="text-muted opacity-50" />
                      </div>
                      <h5 className="text-muted mb-3">Nessuna richiesta disponibile al momento</h5>
                      <p className="text-muted mb-4">Le nuove opportunità appariranno qui non appena pubblicate dai clienti.</p>
                      <Link to="/richieste" className="btn btn-primary rounded-pill px-4">
                        <FaSearch className="me-2" />
                        Controlla la Pagina Completa
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SEZIONE LE TUE OFFERTE */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card border-0 shadow-lg rounded-4">
                <div className="card-header bg-info bg-gradient text-white border-0 rounded-top-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 className="mb-1">
                        <FaChartLine className="me-3" />
                        📊 Le tue offerte
                      </h4>
                      <p className="mb-0 opacity-90">Monitora lo stato delle tue proposte inviate</p>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <div className="text-center">
                        <h5 className="mb-0">{offerte.length}</h5>
                        <small className="opacity-75">totali</small>
                      </div>
                      <div className="text-center">
                        <h5 className="mb-0 text-success">{offerte.filter(o => o.stato === 'accettata').length}</h5>
                        <small className="opacity-75">accettate</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body p-4">
                  {offerte.length > 0 ? (
                    <div className="row g-3">
                      {offerte.slice(0, 6).map(o => (
                        <div key={o.id} className="col-lg-4 col-md-6">
                          <div className={`card border-0 shadow-sm rounded-4 h-100 ${
                            o.stato === 'accettata' ? 'border-success border-2' : 
                            o.stato === 'rifiutata' ? 'border-danger border-2' : 
                            'border-light'
                          }`}>
                            <div className="card-body p-3">
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <h6 className="card-title fw-bold mb-0" style={{ lineHeight: '1.3' }}>
                                  {o.richiesta_titolo || `Richiesta #${o.richiesta}`}
                                </h6>
                                <span className={`badge rounded-pill px-2 py-1 ${
                                  o.stato === 'accettata' ? 'bg-success' : 
                                  o.stato === 'rifiutata' ? 'bg-danger' : 
                                  o.stato === 'inviata' ? 'bg-info' : 
                                  'bg-secondary'
                                }`}>
                                  {o.stato === 'accettata' && '✅ Accettata'}
                                  {o.stato === 'rifiutata' && '❌ Rifiutata'}
                                  {o.stato === 'inviata' && '⏳ In attesa'}
                                  {!['accettata', 'rifiutata', 'inviata'].includes(o.stato) && o.stato}
                                </span>
                              </div>
                              
                              <p className="text-muted small mb-3" style={{ 
                                height: '60px',
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                lineHeight: '1.4'
                              }}>
                                {o.descrizione}
                              </p>
                              
                              <div className="row g-2 mb-3">
                                <div className="col-6">
                                  <div className="d-flex align-items-center">
                                    <FaEuroSign className="text-success me-2" />
                                    <div>
                                      <small className="text-muted d-block">Prezzo offerto</small>
                                      <strong className="text-success">{o.prezzo}€</strong>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="d-flex align-items-center">
                                    <FaCalendar className="text-info me-2" />
                                    <div>
                                      <small className="text-muted d-block">Data invio</small>
                                      <strong className="small">{new Date(o.data_invio || Date.now()).toLocaleDateString('it-IT')}</strong>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {o.stato === 'accettata' && (
                                <div className="alert alert-success py-2 mb-0 border-0 rounded-3">
                                  <small className="fw-bold">
                                    <FaCheckCircle className="me-1" />
                                    🎉 Complimenti! Progetto assegnato
                                  </small>
                                </div>
                              )}
                              {o.stato === 'rifiutata' && (
                                <div className="alert alert-danger py-2 mb-0 border-0 rounded-3">
                                  <small>
                                    <FaTimesCircle className="me-1" />
                                    Cliente ha scelto un'altra proposta
                                  </small>
                                </div>
                              )}
                              {o.stato === 'inviata' && (
                                <div className="alert alert-info py-2 mb-0 border-0 rounded-3">
                                  <small>
                                    <FaClock className="me-1" />
                                    Cliente sta valutando la tua proposta
                                  </small>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <div className="bg-light bg-gradient rounded-circle mx-auto mb-4" style={{ width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaHandshake size={48} className="text-muted opacity-50" />
                      </div>
                      <h5 className="text-muted mb-3">Nessuna offerta inviata ancora</h5>
                      <p className="text-muted mb-4">Inizia a esplorare le richieste in evidenza e invia la tua prima proposta!</p>
                      <button 
                        className="btn btn-primary rounded-pill px-4"
                        onClick={() => {
                          document.querySelector('[data-section="richieste"]')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        <FaSearch className="me-2" />
                        Esplora Richieste
                      </button>
                    </div>
                  )}
                  
                  {offerte.length > 6 && (
                    <div className="text-center mt-4">
                      <p className="text-muted mb-3">Stai visualizzando le ultime 6 offerte</p>
                      <button className="btn btn-outline-info rounded-pill">
                        <FaEye className="me-2" />
                        Vedi tutte le {offerte.length} offerte
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* PROGETTI E PRODOTTI - Sezione secondaria */}
          <div className="row mt-5">
            {/* Progetti assegnati - Con toggle attivi/archiviati */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-lg rounded-4">
                <div className="card-header bg-success bg-gradient text-white border-0 rounded-top-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <FaBriefcase className="me-2" />
                      {showArchived ? 'Progetti Archiviati' : 'Progetti Assegnati'}
                    </h5>
                    <div className="d-flex align-items-center">
                      {/* Contatori */}
                      <div className="me-3">
                        <span className="badge bg-light text-dark me-1" style={{ fontSize: '0.7rem' }}>
                          Attivi: {progetti.length}
                        </span>
                        <span className="badge bg-light text-dark" style={{ fontSize: '0.7rem' }}>
                          Archiviati: {progettiArchiviati.length}
                        </span>
                      </div>
                      
                      {/* Toggle Switch */}
                      <div className="form-check form-switch">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          role="switch" 
                          id="toggleArchivedFornitore"
                          checked={showArchived}
                          onChange={(e) => setShowArchived(e.target.checked)}
                        />
                        <label className="form-check-label text-white ms-2" htmlFor="toggleArchivedFornitore" style={{ fontSize: '0.85rem' }}>
                          {showArchived ? '🗃️' : '⚡'}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  {!showArchived ? (
                    // Progetti Attivi
                    <div className="row g-3">
                      {progetti.length > 0 ? progetti.map(p => (
                        <div key={p.id} className="col-12">
                          <div className="card border-0 shadow-sm rounded-3 h-100">
                            <div className="card-body text-center">
                              <div className="mb-2">
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
                                      <FaUser className="me-1 text-info" />
                                      <strong>Cliente:</strong><br />
                                      {p.cliente_username}
                                    </small>
                                  </div>
                                  <div className="col-6">
                                    <small className="text-muted">
                                      <FaUser className="me-1 text-success" />
                                      <strong>Fornitore:</strong><br />
                                      {p.fornitore_username || user?.username}
                                    </small>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <a href={`/progetto/${p.id}`} className="btn btn-outline-success rounded-pill">
                                  <FaTools className="me-2" />Gestisci progetto
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="col-12 text-center text-muted py-4">
                          <FaClock size={48} className="mb-3 opacity-50" />
                          <h6>Nessun progetto attivo</h6>
                          <p className="mb-0">Quando una tua offerta viene accettata, il progetto apparirà qui!</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Progetti Archiviati
                    <div className="row g-3">
                      {progettiArchiviati.length > 0 ? progettiArchiviati.map(p => (
                        <div key={p.id} className="col-12">
                          <div className="card border-0 shadow-sm rounded-3 h-100 bg-light bg-opacity-50">
                            <div className="card-body text-center">
                              <div className="mb-2">
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
                                      <FaUser className="me-1 text-info" />
                                      <strong>Cliente:</strong><br />
                                      {p.cliente_username}
                                    </small>
                                  </div>
                                  <div className="col-6">
                                    <small className="text-muted">
                                      <FaUser className="me-1 text-success" />
                                      <strong>Fornitore:</strong><br />
                                      {p.fornitore_username || user?.username}
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
                        <div className="col-12 text-center text-muted py-4">
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

            {/* Prodotti pronti */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-lg rounded-4">
                <div className="card-header bg-warning bg-gradient text-white border-0 rounded-top-4">
                  <h5 className="mb-0"><FaStar className="me-2" />I tuoi prodotti pronti</h5>
                </div>
                <div className="card-body">
                  {prodotti.length > 0 ? (
                    <div className="row g-3">
                      {prodotti.slice(0, 3).map(p => (
                        <div key={p.id} className="col-12">
                          <div className="card border-0 shadow-sm rounded-3 h-100">
                            <div className="card-body">
                              <h6 className="card-title">{p.titolo}</h6>
                              <p className="text-muted small">{p.descrizione.substring(0, 100)}...</p>
                              <div className="d-flex justify-content-between align-items-center">
                                <small className="text-muted">{new Date(p.data_pubblicazione).toLocaleDateString()}</small>
                                <span className="badge bg-success bg-gradient rounded-pill px-2 py-1">
                                  <FaEuroSign className="me-1" />
                                  {p.prezzo}€
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted py-4">
                      <FaStar size={48} className="mb-3 opacity-50" />
                      <p>Non hai ancora pubblicato prodotti pronti.</p>
                    </div>
                  )}
                  
                  <div className="text-center mt-3">
                    <Link to="/prodotti-pronti" className="btn btn-outline-warning rounded-pill">
                      <FaEye className="me-2" />
                      Vedi tutti i prodotti
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {success && (
            <div className="row mt-4">
              <div className="col-12">
                <div className="alert alert-success border-0 bg-success bg-opacity-10 rounded-4">
                  <FaCheckCircle className="me-2" />
                  {success}
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="row mt-4">
              <div className="col-12">
                <div className="alert alert-danger border-0 bg-danger bg-opacity-10 rounded-4">
                  <FaTimesCircle className="me-2" />
                  {error}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* MODAL CREAZIONE OFFERTA */}
      {showModalOfferta && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header bg-primary bg-gradient text-white border-0 rounded-top-4">
                <div>
                  <h4 className="modal-title mb-1">
                    <FaHandshake className="me-3" />
                    Crea la tua offerta professionale
                  </h4>
                  <p className="mb-0 opacity-90">Invia una proposta competitiva per conquistare il cliente</p>
                </div>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={handleCloseModalOfferta}
                ></button>
              </div>
              <div className="modal-body p-4">
                {richiestaSelezionata && (
                  <>
                    {/* Preview richiesta selezionata */}
                    <div className="alert alert-info border-0 rounded-4 mb-4">
                      <div className="d-flex align-items-start">
                        <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3 mt-1">
                          <FaProjectDiagram className="text-info" />
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="alert-heading fw-bold text-info mb-2">
                            Richiesta selezionata: {richiestaSelezionata.titolo}
                          </h6>
                          <div className="row g-3 mb-3">
                            <div className="col-sm-6">
                              <small className="text-muted">
                                <FaUser className="me-1" />
                                <strong>Cliente:</strong> {richiestaSelezionata.cliente_username}
                              </small>
                            </div>
                            <div className="col-sm-6">
                              <small className="text-muted">
                                <FaEuroSign className="me-1" />
                                <strong>Budget:</strong> €{richiestaSelezionata.budget}
                              </small>
                            </div>
                          </div>
                          <p className="small text-muted mb-0 lh-sm">
                            <strong>Descrizione:</strong> {richiestaSelezionata.descrizione.substring(0, 200)}
                            {richiestaSelezionata.descrizione.length > 200 && '...'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Avviso se ha già fatto offerta */}
                    {offerteIds.includes(richiestaSelezionata.id) && (
                      <div className="alert alert-warning border-0 rounded-4 mb-4">
                        <div className="d-flex align-items-center">
                          <FaInfoCircle className="me-2 text-warning" />
                          <div>
                            <strong>⚠️ Attenzione!</strong><br />
                            <small>Hai già inviato un'offerta per questa richiesta. Questa nuova offerta sostituirà quella precedente.</small>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Form offerta */}
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label className="form-label fw-bold d-flex align-items-center">
                          <FaLightbulb className="me-2 text-warning" />
                          La tua proposta tecnica
                        </label>
                        <textarea 
                          className="form-control form-control-lg" 
                          rows="8"
                          placeholder="Crea una proposta professionale che includa:

• Analisi della richiesta e comprensione delle esigenze
• Tecnologie e strumenti che utilizzerai
• Metodologia di sviluppo e fasi del progetto
• Tempistiche dettagliate di consegna
• Garanzie e supporto post-lancio
• Il tuo valore aggiunto unico

Esempio:
Ciao! Ho analizzato attentamente la tua richiesta e posso offrirti una soluzione completa che include:

✅ Sviluppo con tecnologie moderne (React, Node.js, MongoDB)
✅ Design responsive e user experience ottimizzata
✅ Sicurezza avanzata e backup automatici
✅ Test completi e documentazione dettagliata
✅ Supporto tecnico per 6 mesi
✅ Formazione del team per l'utilizzo

Tempi di consegna: 4-6 settimane
Garanzia: 1 anno su tutto il software
Sono disponibile per una call gratuita di approfondimento!"
                          value={descrizione} 
                          onChange={e => setDescrizione(e.target.value)} 
                          required 
                          style={{ lineHeight: '1.6', minHeight: '200px' }}
                        />
                        <div className="mt-2">
                          <small className="text-muted">
                            💡 <strong>Suggerimento:</strong> Sii specifico, professionale e dimostra il valore che puoi offrire!
                          </small>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="form-label fw-bold d-flex align-items-center">
                          <FaEuroSign className="me-2 text-success" />
                          Il tuo prezzo professionale (€)
                        </label>
                        <div className="input-group input-group-lg">
                          <span className="input-group-text bg-success text-white">
                            <FaEuroSign />
                          </span>
                          <input 
                            type="number" 
                            className="form-control" 
                            placeholder="3500" 
                            value={prezzo} 
                            onChange={e => setPrezzo(e.target.value)} 
                            required 
                            min="1"
                            step="0.01"
                          />
                          <span className="input-group-text">
                            {prezzo && richiestaSelezionata && (
                              <small className={`${parseFloat(prezzo) <= parseFloat(richiestaSelezionata.budget) ? 'text-success' : 'text-warning'}`}>
                                {parseFloat(prezzo) <= parseFloat(richiestaSelezionata.budget) ? '✓ Nel budget' : '⚠ Sopra budget'}
                              </small>
                            )}
                          </span>
                        </div>
                        <div className="mt-2">
                          <small className="text-muted">
                            <strong>Budget richiesto:</strong> €{richiestaSelezionata.budget} | 
                            <span className="ms-1">
                              Puoi offrire un prezzo diverso dal budget indicato
                            </span>
                          </small>
                        </div>
                      </div>

                      {error && (
                        <div className="alert alert-danger border-0 rounded-4 mb-3">
                          <FaTimesCircle className="me-2" />
                          {error}
                        </div>
                      )}

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
                          className="btn btn-success btn-lg flex-fill rounded-pill shadow"
                          disabled={!descrizione || !prezzo}
                        >
                          <FaRocket className="me-2" />
                          Invia offerta professionale
                        </button>
                      </div>
                    </form>

                    {/* Suggerimenti per vincere */}
                    <div className="mt-4 p-3 bg-light rounded-4">
                      <h6 className="text-primary mb-2">
                        <FaMagic className="me-2" />
                        💡 Consigli per vincere l'offerta:
                      </h6>
                      <div className="row g-2">
                        <div className="col-sm-6">
                          <small className="text-muted d-block">🎯 Dimostra comprensione del progetto</small>
                          <small className="text-muted d-block">⚡ Proponi soluzioni innovative</small>
                          <small className="text-muted d-block">📅 Indica tempi realistici</small>
                        </div>
                        <div className="col-sm-6">
                          <small className="text-muted d-block">🛡️ Offri garanzie solide</small>
                          <small className="text-muted d-block">💎 Evidenzia il tuo valore unico</small>
                          <small className="text-muted d-block">🤝 Mostra professionalità</small>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .col-md-2-4 {
          flex: 0 0 auto;
          width: 20%;
        }
        
        @media (max-width: 768px) {
          .col-md-2-4 {
            width: 50%;
          }
        }
        
        .bg-gradient {
          background: linear-gradient(135deg, var(--bs-bg-opacity, 1), rgba(255,255,255,0.1));
        }
        
        .richiesta-card {
          transition: all 0.3s ease;
          position: relative;
        }
        
        .richiesta-card:hover {
          background: #f8f9fa;
          transform: translateX(5px);
        }
        
        .richiesta-card.selected {
          background: linear-gradient(145deg, #e3f2fd, #f8f9fa);
          border-left: 4px solid #007bff !important;
          transform: translateX(8px);
          box-shadow: 0 4px 12px rgba(0,123,255,0.15);
        }
        
        .richiesta-card.selected::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 5px;
          height: 100%;
          background: linear-gradient(145deg, #007bff, #0056b3);
          border-radius: 0 5px 5px 0;
        }
        
        .richiesta-card.gia-offerta {
          background: linear-gradient(145deg, #fff3cd, #f8f9fa);
          border-left: 4px solid #ffc107 !important;
        }
        
        .richiesta-card.gia-offerta:hover {
          background: linear-gradient(145deg, #fff3cd, #fef9e7);
        }
        
        .form-control:focus, .form-select:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
        }
        
        .btn-warning {
          background: linear-gradient(135deg, #ffc107, #ff8c00);
          border: none;
        }
        
        .btn-success {
          background: linear-gradient(135deg, #28a745, #20c997);
          border: none;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #007bff, #0056b3);
          border: none;
        }
        
        .card {
          border-radius: 1rem !important;
        }
        
        .badge {
          font-size: 0.8rem;
        }
        
        /* Scrollbar personalizzata */
        .card-body::-webkit-scrollbar {
          width: 6px;
        }
        
        .card-body::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .card-body::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        
        .card-body::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        
        /* Animazioni */
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .richiesta-card {
          animation: slideIn 0.3s ease-out;
        }
        
        .richiesta-card-enhanced {
          transition: all 0.3s ease;
          cursor: pointer;
          border: 2px solid transparent !important;
        }
        
        .richiesta-card-enhanced:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
          border-color: #007bff30 !important;
        }
        
        .richiesta-card-enhanced:hover .btn-primary {
          background: linear-gradient(135deg, #007bff, #0056b3);
          transform: scale(1.05);
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
      `}</style>
    </div>
  );
}

export default DashboardFornitore; 
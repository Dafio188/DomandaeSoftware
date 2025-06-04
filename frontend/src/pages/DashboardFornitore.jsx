import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getOfferteFornitore, getProgettiFornitore, getAllRichieste } from '../services/api';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaUser, FaEuroSign, FaCalendar, FaCheckCircle, FaTimesCircle, FaClock, FaLightbulb, FaTools, FaChartLine, FaHandshake, FaStar, FaBriefcase, FaPlus, FaEye, FaImage, FaTimes, FaMagic, FaRocket, FaInfoCircle, FaProjectDiagram, FaArrowLeft, FaArchive, FaSearch, FaArrowRight, FaUserTie, FaEdit, FaArrowUp, FaQuestionCircle, FaEnvelope, FaCog } from 'react-icons/fa';
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
      axios.get(`${API_BASE}progetti/archiviati/`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setProgettiArchiviati(res.data.results || []);
      }).catch(err => {
        console.log('Errore nel caricamento progetti archiviati:', err);
        setProgettiArchiviati([]);
      });
      
      getAllRichieste(token).then(setRichieste);
      // Carica i prodotti pronti del fornitore
      axios.get(`${API_BASE}prodotti-pronti/`)
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

  // Calcolo statistiche
  const stats = {
    offerteInviate: offerte.length,
    offerteAccettate: offerte.filter(o => o.stato === 'accettata').length,
    progettiAttivi: progetti.length,
    prodottiPubblicati: prodotti.length,
    guadagnoTotale: progetti.filter(p => p.stato === 'completato').reduce((sum, p) => sum + (parseFloat(p.prezzo_finale) || 0), 0)
  };

  // Filtra richieste escludendo quelle per cui ho già fatto un'offerta
  const richiesteDisponibili = richieste.filter(richiesta => {
    // Escludi richieste non aperte
    if (richiesta.stato !== 'aperta') return false;
    
    // Escludi richieste per cui ho già fatto un'offerta
    const hoGiaOfferto = offerte.some(offerta => offerta.richiesta === richiesta.id);
    return !hoGiaOfferto;
  });

  return (
    <div className="dashboard-fornitore min-vh-100" style={{ background: 'linear-gradient(135deg, #f8f9fc 0%, #e8edf5 100%)' }}>
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            {/* HEADER MODERNO MANTENUTO */}
            <div className="welcome-header mb-4">
              <div className="card border-0 shadow-lg rounded-4" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f4f6f9 100%)' }}>
                <div className="card-body p-4">
                  <div className="row align-items-center">
                    <div className="col-lg-8">
                      <div className="d-flex align-items-center">
                        <div className="welcome-icon bg-primary bg-opacity-10 rounded-circle p-3 me-4">
                          <FaUserTie size={40} className="text-primary" />
                        </div>
                        <div>
                          <h2 className="welcome-title mb-2 text-dark">
                            Ciao, <span className="text-primary fw-bold">{user?.username || 'Fornitore'}</span>! 👋
                          </h2>
                          <p className="welcome-subtitle text-muted mb-0 fs-5">
                            Ecco la tua dashboard personalizzata con le opportunità più interessanti
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                      <div className="d-flex justify-content-lg-end gap-2 flex-wrap">
                        <Link to="/richieste" className="btn btn-primary rounded-pill px-4">
                          <FaSearch className="me-2" />
                          Trova Progetti
                        </Link>
                        <Link to="/prodotti-pronti" className="btn btn-outline-warning rounded-pill px-4">
                          <FaStar className="me-2" />
                          Marketplace
                        </Link>
                        <Link to="/le-tue-idee" className="btn btn-outline-info rounded-pill px-4">
                          <FaLightbulb className="me-2" />
                          Le Tue Idee
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MESSAGGI DI SUCCESSO/ERRORE */}
            {success && (
              <div className="alert alert-success alert-dismissible fade show rounded-4 shadow-sm mb-4" role="alert">
                <div className="d-flex align-items-center">
                  <FaCheckCircle className="me-3 text-success" size={24} />
                  <div>
                    <strong>Perfetto!</strong>
                    <div>{success}</div>
                  </div>
                </div>
                <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
              </div>
            )}

            {error && (
              <div className="alert alert-danger alert-dismissible fade show rounded-4 shadow-sm mb-4" role="alert">
                <div className="d-flex align-items-center">
                  <FaTimesCircle className="me-3 text-danger" size={24} />
                  <div>
                    <strong>Attenzione!</strong>
                    <div>{error}</div>
                  </div>
                </div>
                <button type="button" className="btn-close" onClick={() => setError('')}></button>
              </div>
            )}

            {/* STATISTICHE DASHBOARD */}
            <div className="row g-4 mb-5">
              <div className="col-md-2-4">
                <div className="card bg-primary bg-gradient text-white h-100 border-0 rounded-4 card-hover">
                  <div className="card-body text-center">
                    <FaHandshake size={28} className="mb-2" />
                    <h4 className="card-title">{stats.offerteInviate}</h4>
                    <p className="card-text small">Offerte inviate</p>
                  </div>
                </div>
              </div>
              <div className="col-md-2-4">
                <div className="card bg-success bg-gradient text-white h-100 border-0 rounded-4 card-hover">
                  <div className="card-body text-center">
                    <FaCheckCircle size={28} className="mb-2" />
                    <h4 className="card-title">{stats.offerteAccettate}</h4>
                    <p className="card-text small">Offerte accettate</p>
                  </div>
                </div>
              </div>
              <div className="col-md-2-4">
                <div className="card bg-info bg-gradient text-white h-100 border-0 rounded-4 card-hover">
                  <div className="card-body text-center">
                    <FaBriefcase size={28} className="mb-2" />
                    <h4 className="card-title">{stats.progettiAttivi}</h4>
                    <p className="card-text small">Progetti attivi</p>
                  </div>
                </div>
              </div>
              <div className="col-md-2-4">
                <div className="card bg-warning bg-gradient text-white h-100 border-0 rounded-4 card-hover">
                  <div className="card-body text-center">
                    <FaStar size={28} className="mb-2" />
                    <h4 className="card-title">{stats.prodottiPubblicati}</h4>
                    <p className="card-text small">Prodotti pubblicati</p>
                  </div>
                </div>
              </div>
              <div className="col-md-2-4">
                <div className="card bg-dark bg-gradient text-white h-100 border-0 rounded-4 card-hover">
                  <div className="card-body text-center">
                    <FaEuroSign size={28} className="mb-2" />
                    <h4 className="card-title">{stats.guadagnoTotale.toFixed(0)}€</h4>
                    <p className="card-text small">Guadagno totale</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 🤝 GESTIONE OFFERTE INVIATE - PRIORITÀ MASSIMA */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="card border-0 shadow-lg rounded-4">
                  <div className="card-header bg-info bg-gradient text-white border-0 rounded-top-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h4 className="mb-1">
                          <FaHandshake className="me-3" />
                          🤝 Gestione Offerte Inviate
                        </h4>
                        <p className="mb-0 opacity-90">Monitora e gestisci tutte le tue proposte inviate ai clienti</p>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        <div className="text-center">
                          <h5 className="mb-0">{offerte.length}</h5>
                          <small className="opacity-75">totali</small>
                        </div>
                        <div className="text-center">
                          <h5 className="mb-0 text-warning">{offerte.filter(o => o.stato === 'in_attesa').length}</h5>
                          <small className="opacity-75">in attesa</small>
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
                      <>
                        {/* Filtri Rapidi */}
                        <div className="row mb-4">
                          <div className="col-12">
                            <div className="card bg-light border-0 rounded-3">
                              <div className="card-body py-3">
                                <div className="d-flex justify-content-between align-items-center">
                                  <h6 className="fw-bold mb-0 text-dark">
                                    <FaSearch className="me-2 text-primary" />
                                    Filtri Rapidi
                                  </h6>
                                  <div className="btn-group" role="group">
                                    <button type="button" className="btn btn-outline-primary btn-sm active">
                                      Tutte ({offerte.length})
                                    </button>
                                    <button type="button" className="btn btn-outline-warning btn-sm">
                                      In Attesa ({offerte.filter(o => o.stato === 'in_attesa').length})
                                    </button>
                                    <button type="button" className="btn btn-outline-success btn-sm">
                                      Accettate ({offerte.filter(o => o.stato === 'accettata').length})
                                    </button>
                                    <button type="button" className="btn btn-outline-danger btn-sm">
                                      Rifiutate ({offerte.filter(o => o.stato === 'rifiutata').length})
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Vista Card delle Offerte */}
                        <div className="border-top pt-4">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="fw-bold mb-0">
                              <FaChartLine className="me-2 text-info" />
                              Le Tue Offerte Recenti
                            </h6>
                          </div>
                          
                          <div className="row g-3">
                            {offerte.map(offerta => (
                              <div key={offerta.id} className="col-lg-6">
                                <div className="card border-0 shadow-sm rounded-3 h-100 offerta-card-hover">
                                  <div className="card-body">
                                    {/* Header con titolo e stato */}
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                      <div className="flex-grow-1">
                                        <h6 className="card-title fw-bold mb-1 text-primary">
                                          {offerta.richiesta_titolo || `Richiesta #${offerta.richiesta}`}
                                        </h6>
                                        <small className="text-muted">
                                          <FaUser className="me-1" />
                                          Cliente: <strong>{offerta.cliente_username}</strong>
                                        </small>
                                      </div>
                                      <span className={`badge rounded-pill px-3 py-2 ${
                                        offerta.stato === 'accettata' ? 'bg-success' :
                                        offerta.stato === 'rifiutata' ? 'bg-danger' :
                                        'bg-warning text-dark'
                                      }`}>
                                        {offerta.stato === 'accettata' && '✅ Accettata'}
                                        {offerta.stato === 'rifiutata' && '❌ Rifiutata'}
                                        {offerta.stato === 'in_attesa' && '🟡 In Attesa'}
                                      </span>
                                    </div>
                                    
                                    {/* Descrizione offerta */}
                                    <div className="mb-3">
                                      <small className="text-muted fw-bold d-block mb-1">La tua proposta:</small>
                                      <p className="text-muted mb-0" style={{ 
                                        fontSize: '0.85rem',
                                        lineHeight: '1.4',
                                        height: '40px',
                                        overflow: 'hidden',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical'
                                      }}>
                                        {offerta.descrizione.length > 80 ? 
                                          offerta.descrizione.substring(0, 80) + '...' : 
                                          offerta.descrizione
                                        }
                                      </p>
                                    </div>
                                    
                                    {/* Info prezzo e data */}
                                    <div className="row g-2 mb-3">
                                      <div className="col-6">
                                        <div className="bg-success bg-opacity-10 rounded-3 p-2 text-center">
                                          <FaEuroSign className="text-success mb-1" size={16} />
                                          <div className="fw-bold text-success">{offerta.prezzo}€</div>
                                          <small className="text-muted">La tua offerta</small>
                                        </div>
                                      </div>
                                      <div className="col-6">
                                        <div className="bg-info bg-opacity-10 rounded-3 p-2 text-center">
                                          <FaCalendar className="text-info mb-1" size={16} />
                                          <div className="fw-bold text-info" style={{ fontSize: '0.8rem' }}>
                                            {new Date(offerta.data_offerta).toLocaleDateString('it-IT')}
                                          </div>
                                          <small className="text-muted">Data invio</small>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Azioni */}
                                    <div className="border-top pt-3">
                                      <div className="d-flex gap-2">
                                        {offerta.stato === 'in_attesa' && (
                                          <button 
                                            className="btn btn-outline-warning btn-sm rounded-pill flex-grow-1"
                                            title="Modifica offerta (se in attesa)"
                                            disabled
                                          >
                                            <FaEdit className="me-1" />
                                            Modifica
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-5">
                        <div className="bg-info bg-opacity-10 rounded-circle mx-auto mb-4" style={{ width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FaHandshake size={48} className="text-info opacity-50" />
                        </div>
                        <h5 className="text-muted mb-3">Nessuna offerta inviata ancora</h5>
                        <p className="text-muted mb-4">
                          Inizia a inviare offerte competitive per le richieste dei clienti!<br />
                          Le tue proposte appariranno qui con tutte le statistiche e la gestione completa.
                        </p>
                        <div className="d-flex gap-3 justify-content-center">
                          <button 
                            className="btn btn-info rounded-pill px-4"
                            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                          >
                            <FaArrowUp className="me-2" />
                            Vedi Richieste Sopra
                          </button>
                          <Link to="/richieste" className="btn btn-outline-info rounded-pill px-4">
                            <FaSearch className="me-2" />
                            Esplora Tutte le Richieste
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RICHIESTE IN EVIDENZA - VERSIONE COMPATTA */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-header bg-success bg-gradient text-white border-0 rounded-top-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-0">
                          <FaSearch className="me-2" />
                          🎯 Richieste Aperte ({richiesteDisponibili.length})
                        </h5>
                      </div>
                      <Link to="/richieste" className="btn btn-outline-light btn-sm rounded-pill">
                        <FaArrowRight className="me-1" />
                        Esplora Tutte
                      </Link>
                    </div>
                  </div>
                  <div className="card-body p-3">
                    {richiesteDisponibili.length > 0 ? (
                      <div className="row g-3">
                        {richiesteDisponibili.slice(0, 3).map(richiesta => (
                          <div key={richiesta.id} className="col-lg-4">
                            <div className="card border-0 bg-light rounded-3 h-100">
                              <div className="card-body p-3">
                                <h6 className="card-title fw-bold mb-2 text-primary">
                                  {richiesta.titolo.length > 40 ? richiesta.titolo.substring(0, 40) + '...' : richiesta.titolo}
                                </h6>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                  <span className="fw-bold text-success">
                                    <FaEuroSign className="me-1" />
                                    {richiesta.budget}€
                                  </span>
                                  <small className="text-muted">
                                    <FaUser className="me-1" />
                                    {richiesta.cliente_username}
                                  </small>
                                </div>
                                <button 
                                  className="btn btn-primary btn-sm w-100 rounded-pill"
                                  onClick={() => {
                                    setRichiestaId(richiesta.id);
                                    setShowModalOfferta(true);
                                    setRichiestaSelezionata(richiesta);
                                  }}
                                >
                                  <FaHandshake className="me-1" />
                                  Fai Offerta
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-3">
                        <h6 className="text-muted mb-2">Nessuna richiesta disponibile</h6>
                        <Link to="/richieste" className="btn btn-primary btn-sm rounded-pill">
                          <FaSearch className="me-1" />
                          Esplora Richieste
                        </Link>
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
                                <div>
                                  <a href={`/progetto/${p.id}`} className="btn btn-outline-secondary btn-sm rounded-pill">
                                    <FaArchive className="me-2" />Vedi Archivio
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        )) : (
                          <div className="col-12 text-center text-muted py-4">
                            <FaArchive size={48} className="mb-3 opacity-50" />
                            <h6>Nessun progetto archiviato</h6>
                            <p className="mb-0">I progetti completati e archiviati appariranno qui</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SEZIONE PRODOTTI PRONTI CON PULSANTE CREA */}
              <div className="col-lg-6">
                <div className="card border-2 border-opacity-10 shadow-lg rounded-4" style={{ background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fc 100%)' }}>
                  <div className="card-header bg-warning bg-gradient text-white border-0 rounded-top-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0"><FaStar className="me-2" />I tuoi prodotti pronti</h5>
                      <div className="d-flex gap-2">
                        <Link 
                          to="/prodotti-pronti" 
                          className="btn btn-light btn-sm rounded-pill"
                          title="Vedi tutti i prodotti nel marketplace"
                        >
                          <FaEye className="me-1" />
                          Marketplace
                        </Link>
                        <button 
                          className="btn btn-outline-light btn-sm rounded-pill"
                          onClick={() => setShowCreaProdotto(true)}
                          title="Crea nuovo prodotto"
                        >
                          <FaPlus className="me-1" />
                          Nuovo
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    {prodotti.length > 0 ? (
                      <div className="row g-3">
                        {prodotti.slice(0, 4).map(prodotto => {
                          const categoria = categorieProdotti.find(c => c.value === prodotto.categoria);
                          return (
                            <div key={prodotto.id} className="col-12">
                              <div className="card border-0 shadow-sm rounded-3 h-100">
                                <div className="card-body">
                                  <div className="d-flex align-items-start">
                                    {prodotto.immagine && (
                                      <img 
                                        src={prodotto.immagine} 
                                        alt={prodotto.titolo}
                                        className="rounded-3 me-3"
                                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                      />
                                    )}
                                    <div className="flex-grow-1">
                                      <div className="d-flex align-items-center mb-2">
                                        {categoria && (
                                          <span className="badge bg-warning bg-opacity-10 text-warning rounded-pill px-2 py-1 me-2" style={{ fontSize: '0.7rem' }}>
                                            {categoria.icon} {categoria.label}
                                          </span>
                                        )}
                                      </div>
                                      <h6 className="card-title fw-bold mb-2 text-primary" style={{ fontSize: '0.9rem' }}>
                                        {prodotto.titolo}
                                      </h6>
                                      <p className="text-muted mb-2" style={{ 
                                        fontSize: '0.8rem',
                                        lineHeight: '1.4',
                                        height: '32px',
                                        overflow: 'hidden',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical'
                                      }}>
                                        {prodotto.descrizione.length > 80 ? 
                                          prodotto.descrizione.substring(0, 80) + '...' : 
                                          prodotto.descrizione
                                        }
                                      </p>
                                      <div className="d-flex justify-content-between align-items-center">
                                        <span className="text-success fw-bold">
                                          <FaEuroSign className="me-1" />
                                          {prodotto.prezzo}€
                                        </span>
                                        <small className="text-muted">
                                          <FaCalendar className="me-1" />
                                          {new Date(prodotto.data_pubblicazione).toLocaleDateString('it-IT')}
                                        </small>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="bg-warning bg-opacity-10 rounded-circle mx-auto mb-3" style={{ width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FaStar size={32} className="text-warning opacity-50" />
                        </div>
                        <h6 className="text-muted mb-2">Nessun prodotto pubblicato</h6>
                        <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>Crea il tuo primo prodotto per il marketplace!</p>
                        <button 
                          className="btn btn-warning rounded-pill px-4"
                          onClick={() => setShowCreaProdotto(true)}
                        >
                          <FaPlus className="me-2" />
                          Crea Primo Prodotto
                        </button>
                      </div>
                    )}
                    
                    {prodotti.length > 4 && (
                      <div className="text-center mt-3 pt-3 border-top">
                        <Link to="/prodotti-pronti" className="btn btn-outline-warning btn-sm rounded-pill">
                          <FaEye className="me-1" />
                          Vedi tutti i {prodotti.length} prodotti
                        </Link>
                      </div>
                    )}
                  </div>
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
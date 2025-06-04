import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { API_BASE } from '../config/api.js';
import { 
  FaStar, 
  FaEuroSign, 
  FaUser, 
  FaCalendar, 
  FaEye, 
  FaPlus, 
  FaImage, 
  FaTimes, 
  FaMagic,
  FaRocket,
  FaLightbulb,
  FaCheckCircle,
  FaExclamationTriangle,
  FaFilter,
  FaSort,
  FaGift,
  FaHeart,
  FaBolt,
  FaCode,
  FaArrowRight,
  FaShoppingCart,
  FaEnvelope
} from 'react-icons/fa';

function ProdottiPronti() {
  const { user, token } = useAuth();
  const [prodotti, setProdotti] = useState([]);
  const [prodottiFiltrati, setProdottiFiltrati] = useState([]);
  const [titolo, setTitolo] = useState('');
  const [descrizione, setDescrizione] = useState('');
  const [prezzo, setPrezzo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [linkDemo, setLinkDemo] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Gestione immagine
  const [immagine, setImmagine] = useState(null);
  const [anteprima, setAnteprima] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Filtri
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [ordinamento, setOrdinamento] = useState('recenti');
  const [searchTerm, setSearchTerm] = useState('');

  // Categorie prodotti
  const categorieProdotti = [
    { value: 'template', label: 'Template/Temi', icon: '🎨', desc: 'Template per siti web, temi WordPress, ecc.', color: '#e74c3c' },
    { value: 'plugin', label: 'Plugin/Estensioni', icon: '🔌', desc: 'Plugin per CMS, estensioni browser, ecc.', color: '#9b59b6' },
    { value: 'script', label: 'Script/Codici', icon: '💻', desc: 'Script PHP, JavaScript, Python, ecc.', color: '#3498db' },
    { value: 'software', label: 'Software Completi', icon: '📦', desc: 'Software desktop o web completi', color: '#2ecc71' },
    { value: 'app', label: 'App Mobile', icon: '📱', desc: 'App native o ibride per mobile', color: '#f39c12' },
    { value: 'servizio', label: 'Servizi/Consulenze', icon: '🎯', desc: 'Servizi di consulenza o supporto', color: '#34495e' }
  ];

  useEffect(() => {
    loadProdotti();
  }, []);

  useEffect(() => {
    // Applica filtri
    let risultati = [...prodotti];
    
    // Filtro categoria
    if (filtroCategoria) {
      risultati = risultati.filter(p => p.categoria === filtroCategoria);
    }
    
    // Filtro ricerca
    if (searchTerm) {
      risultati = risultati.filter(p => 
        p.titolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.descrizione.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Ordinamento
    if (ordinamento === 'recenti') {
      risultati.sort((a, b) => new Date(b.data_pubblicazione) - new Date(a.data_pubblicazione));
    } else if (ordinamento === 'prezzo_asc') {
      risultati.sort((a, b) => a.prezzo - b.prezzo);
    } else if (ordinamento === 'prezzo_desc') {
      risultati.sort((a, b) => b.prezzo - a.prezzo);
    } else if (ordinamento === 'alfabetico') {
      risultati.sort((a, b) => a.titolo.localeCompare(b.titolo));
    }
    
    setProdottiFiltrati(risultati);
  }, [prodotti, filtroCategoria, searchTerm, ordinamento]);

  const loadProdotti = async () => {
    try {
      const res = await axios.get(`${API_BASE}prodotti-pronti/`);
      setProdotti(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Errore caricamento prodotti:', error);
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Verifica dimensione (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("L'immagine è troppo grande. Dimensione massima: 5MB");
        return;
      }

      // Verifica formato
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError("Formato non supportato. Utilizzare JPG, PNG o WEBP");
        return;
      }

      setImmagine(file);
      setError('');
      
      // Crea URL per anteprima
      const reader = new FileReader();
      reader.onloadend = () => {
        setAnteprima(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImmagine(null);
    setAnteprima(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(''); setError('');
    
    try {
      const formData = new FormData();
      formData.append('fornitore', user.id);
      formData.append('titolo', titolo);
      formData.append('descrizione', descrizione);
      formData.append('prezzo', prezzo);
      formData.append('categoria', categoria);
      formData.append('link_demo', linkDemo);
      if (immagine) formData.append('immagine', immagine);

      await axios.post('/api/prodotti-pronti/', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess('🎉 Prodotto pubblicato con successo nel marketplace!');
      setTitolo(''); setDescrizione(''); setPrezzo(''); setCategoria(''); setLinkDemo('');
      removeImage();
      setShowPreview(false);
      setShowCreateForm(false);
      loadProdotti();
      
      setTimeout(() => {
        alert('✅ SUCCESSO!\n\nIl tuo prodotto è stato pubblicato e sarà visibile a tutti i clienti del marketplace.\n\nI clienti interessati potranno contattarti direttamente per procedere all\'acquisto.');
      }, 500);
      
    } catch (err) {
      setError('Errore nella pubblicazione del prodotto: ' + (err.response?.data?.detail || err.message));
    }
  };

  const renderProductPreview = () => {
    if (!titolo || !categoria || !descrizione || !prezzo) return null;
    
    const categoriaSelezionata = categorieProdotti.find(c => c.value === categoria);
    
    return (
      <div className="card border-0 shadow-lg rounded-4 mb-4" style={{ background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
        <div className="card-body p-4">
          <div className="d-flex align-items-center mb-3">
            <div className="badge rounded-pill px-3 py-2 me-2" style={{ backgroundColor: categoriaSelezionata?.color, color: 'white' }}>
              <span className="me-1">{categoriaSelezionata?.icon}</span>
              {categoriaSelezionata?.label}
            </div>
            <span className="badge bg-success bg-gradient rounded-pill px-3 py-2">NUOVO</span>
          </div>
          
          {anteprima && (
            <div className="position-relative mb-3">
              <img 
                src={anteprima} 
                alt="Anteprima" 
                className="img-fluid rounded-3"
                style={{ height: '200px', width: '100%', objectFit: 'cover' }}
              />
              <div className="position-absolute top-0 end-0 m-2">
                <span className="badge bg-dark bg-opacity-75 rounded-pill">Immagine prodotto</span>
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
                  <small className="text-muted d-block">Prezzo</small>
                  <strong className="text-success">{prezzo}€</strong>
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
          
          {linkDemo && (
            <div className="mb-3">
              <a href={linkDemo} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm rounded-pill">
                <FaEye className="me-1" />
                Vedi Demo
              </a>
            </div>
          )}
          
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

  const contactSupplier = (fornitoreId, prodottoTitolo) => {
    // Simula contatto fornitore
    alert(`Contatto con il fornitore per il prodotto "${prodottoTitolo}".\n\nIn un'implementazione completa, questo aprirebbe una chat o un form di contatto.`);
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Caricamento...</span>
          </div>
          <h4 className="text-muted">Caricamento marketplace...</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-gradient-light">
      {/* Header Hero */}
      <div className="bg-primary text-white position-relative overflow-hidden">
        <div className="container py-5 position-relative z-2">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="d-flex align-items-center mb-3">
                <FaShoppingCart className="me-3" size={32} />
                <span className="badge bg-light text-primary px-3 py-2 rounded-pill">MARKETPLACE</span>
              </div>
              <h1 className="display-4 fw-bold mb-3">Prodotti Software Pronti</h1>
              <p className="lead opacity-90">Scopri soluzioni software innovative create dai nostri fornitori esperti. Trova il prodotto perfetto per le tue esigenze!</p>
            </div>
            <div className="col-lg-4 text-center">
              {user?.ruolo === 'fornitore' && (
                <button 
                  className="btn btn-warning btn-lg rounded-pill px-5 py-3 shadow-lg"
                  onClick={() => setShowCreateForm(!showCreateForm)}
                >
                  <FaPlus className="me-2" />
                  Pubblica Prodotto
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="position-absolute top-0 end-0 w-100 h-100 opacity-10">
          <div className="float-animation" style={{ fontSize: '8rem', position: 'absolute', top: '20%', right: '10%' }}>🚀</div>
          <div className="float-animation" style={{ fontSize: '4rem', position: 'absolute', top: '60%', right: '20%', animationDelay: '1s' }}>💡</div>
        </div>
      </div>

      <div className="container py-5">
        {/* Form Creazione Prodotto */}
        {user?.ruolo === 'fornitore' && showCreateForm && (
          <div className="row mb-5">
            <div className="col-12">
              <div className="card border-0 shadow-lg rounded-4" style={{ background: 'linear-gradient(145deg, #ffffff, #f8f9fa)' }}>
                <div className="card-header bg-warning bg-gradient text-white border-0 rounded-top-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <FaMagic className="me-3" size={20} />
                      <div>
                        <h5 className="mb-0">Crea il tuo prodotto software</h5>
                        <small className="opacity-75">Pubblica nel marketplace e inizia a vendere</small>
                      </div>
                    </div>
                    <button 
                      className="btn btn-outline-light btn-sm rounded-pill"
                      onClick={() => setShowCreateForm(false)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
                <div className="card-body p-4">
                  <div className="row">
                    <div className="col-lg-8">
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Nome del prodotto</label>
                            <input 
                              type="text" 
                              className="form-control form-control-lg" 
                              placeholder="Es: Sistema CRM completo per PMI" 
                              value={titolo} 
                              onChange={e => setTitolo(e.target.value)} 
                              required 
                            />
                            <small className="text-muted">Scegli un nome accattivante e descrittivo</small>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Categoria prodotto</label>
                            <select 
                              className="form-select form-select-lg" 
                              value={categoria} 
                              onChange={e => setCategoria(e.target.value)}
                              required
                            >
                              <option value="">🎯 Seleziona categoria...</option>
                              {categorieProdotti.map(cat => (
                                <option key={cat.value} value={cat.value}>
                                  {cat.icon} {cat.label}
                                </option>
                              ))}
                            </select>
                            {categoria && (
                              <small className="text-info">
                                💡 {categorieProdotti.find(c => c.value === categoria)?.desc}
                              </small>
                            )}
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <label className="form-label fw-bold">Descrizione completa del prodotto</label>
                          <textarea 
                            className="form-control" 
                            rows="4"
                            placeholder="Descrivi dettagliatamente il tuo prodotto: funzionalità, tecnologie usate, cosa include, come si installa..."
                            value={descrizione} 
                            onChange={e => setDescrizione(e.target.value)} 
                            required 
                          />
                          <small className="text-muted">
                            💡 Includi: funzionalità principali, tecnologie utilizzate, requisiti di sistema, supporto incluso
                          </small>
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
                                value={prezzo} 
                                onChange={e => setPrezzo(e.target.value)} 
                                required 
                              />
                            </div>
                            <small className="text-muted">Prezzo competitivo per il mercato</small>
                          </div>
                          <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold">Link demo (opzionale)</label>
                            <input 
                              type="url" 
                              className="form-control form-control-lg" 
                              placeholder="https://demo.mioprodotto.com" 
                              value={linkDemo} 
                              onChange={e => setLinkDemo(e.target.value)} 
                            />
                            <small className="text-muted">URL per provare il prodotto</small>
                          </div>
                          <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold">Immagine prodotto</label>
                            <input 
                              type="file" 
                              className="form-control" 
                              accept="image/jpeg,image/png,image/webp"
                              onChange={handleImageChange}
                            />
                            <small className="text-muted">Max 5MB - JPG, PNG, WEBP</small>
                          </div>
                        </div>
                        
                        {anteprima && (
                          <div className="mb-3 position-relative text-center">
                            <img 
                              src={anteprima} 
                              alt="Anteprima prodotto" 
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
                        
                        {titolo && categoria && descrizione && prezzo && (
                          <div className="d-flex gap-2 mt-4">
                            <button 
                              type="button" 
                              className="btn btn-outline-info"
                              onClick={() => setShowPreview(!showPreview)}
                            >
                              <FaEye className="me-1" />
                              {showPreview ? 'Nascondi' : 'Mostra'} anteprima
                            </button>
                            <button type="submit" className="btn btn-warning btn-lg flex-fill">
                              <FaRocket className="me-2" />
                              Pubblica nel marketplace
                            </button>
                          </div>
                        )}
                      </form>
                    </div>
                    
                    {/* Anteprima prodotto */}
                    <div className="col-lg-4">
                      {showPreview && titolo && categoria && descrizione && prezzo && (
                        <div>
                          <h6 className="fw-bold mb-3">
                            <FaLightbulb className="text-warning me-2" />
                            Così apparirà nel marketplace:
                          </h6>
                          {renderProductPreview()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtri e Ricerca */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <div className="row align-items-center">
                  <div className="col-md-4">
                    <div className="input-group">
                      <span className="input-group-text bg-primary text-white">
                        <FaFilter />
                      </span>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Cerca prodotti..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <select 
                      className="form-select" 
                      value={filtroCategoria}
                      onChange={e => setFiltroCategoria(e.target.value)}
                    >
                      <option value="">Tutte le categorie</option>
                      {categorieProdotti.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <select 
                      className="form-select" 
                      value={ordinamento}
                      onChange={e => setOrdinamento(e.target.value)}
                    >
                      <option value="recenti">🕒 Più recenti</option>
                      <option value="prezzo_asc">💰 Prezzo: crescente</option>
                      <option value="prezzo_desc">💎 Prezzo: decrescente</option>
                      <option value="alfabetico">🔤 Alfabetico</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Griglia Prodotti */}
        <div className="row g-4">
          {prodottiFiltrati.length > 0 ? (
            prodottiFiltrati.map(prodotto => {
              const categoriaInfo = categorieProdotti.find(c => c.value === prodotto.categoria);
              
              return (
                <div key={prodotto.id} className="col-lg-4 col-md-6">
                  <div className="card border-0 shadow-lg rounded-4 h-100 product-card">
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div className="badge rounded-pill px-3 py-2 me-2" style={{ backgroundColor: categoriaInfo?.color || '#6c757d', color: 'white' }}>
                          <span className="me-1">{categoriaInfo?.icon || '📦'}</span>
                          {categoriaInfo?.label || 'Altro'}
                        </div>
                        {prodotto.prezzo > 0 && (
                          <div className="badge bg-success bg-gradient rounded-pill px-3 py-2">
                            <FaEuroSign className="me-1" />
                            {prodotto.prezzo}€
                          </div>
                        )}
                      </div>
                      
                      {prodotto.immagine && (
                        <div className="mb-3">
                          <img 
                            src={prodotto.immagine} 
                            alt={prodotto.titolo}
                            className="img-fluid rounded-3"
                            style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      )}
                      
                      <h5 className="card-title fw-bold text-primary mb-2">{prodotto.titolo}</h5>
                      <p className="card-text text-muted mb-3" style={{ 
                        lineHeight: '1.6',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {prodotto.descrizione}
                      </p>
                      
                      <div className="row g-2 mb-3">
                        <div className="col-6">
                          <small className="text-muted">
                            <FaUser className="me-1" />
                            {prodotto.fornitore_username || 'Fornitore'}
                          </small>
                        </div>
                        <div className="col-6">
                          <small className="text-muted">
                            <FaCalendar className="me-1" />
                            {new Date(prodotto.data_pubblicazione).toLocaleDateString('it-IT')}
                          </small>
                        </div>
                      </div>
                      
                      <div className="d-flex gap-2 mt-auto">
                        {prodotto.link_demo && (
                          <a 
                            href={prodotto.link_demo} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn btn-outline-primary btn-sm flex-fill rounded-pill"
                          >
                            <FaEye className="me-1" />
                            Demo
                          </a>
                        )}
                        <button 
                          className="btn btn-primary btn-sm flex-fill rounded-pill"
                          onClick={() => contactSupplier(prodotto.fornitore, prodotto.titolo)}
                        >
                          <FaEnvelope className="me-1" />
                          Contatta
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-12">
              <div className="text-center py-5">
                <FaGift size={64} className="text-muted mb-3 opacity-50" />
                <h4 className="text-muted">Nessun prodotto trovato</h4>
                <p className="text-muted">
                  {filtroCategoria || searchTerm ? 
                    'Prova a modificare i filtri di ricerca.' :
                    'Nessun prodotto disponibile al momento. Torna più tardi!'
                  }
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Messaggi di successo/errore */}
        {success && (
          <div className="alert alert-success border-0 rounded-4 shadow-sm mt-4">
            <FaCheckCircle className="me-2" />
            {success}
          </div>
        )}
        {error && (
          <div className="alert alert-danger border-0 rounded-4 shadow-sm mt-4">
            <FaExclamationTriangle className="me-2" />
            {error}
          </div>
        )}
      </div>

      {/* CSS Avanzato */}
      <style>{`
        .bg-gradient-light {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .product-card {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.15) !important;
        }

        .product-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transition: left 0.5s;
        }

        .product-card:hover::before {
          left: 100%;
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        .form-control:focus, .form-select:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
        }

        .btn-warning {
          background: linear-gradient(135deg, #ffc107, #ff8c00);
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

        /* Responsive */
        @media (max-width: 768px) {
          .display-4 {
            font-size: 2rem;
          }
          
          .col-md-4 {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default ProdottiPronti; 
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
  FaEnvelope,
  FaSearch
} from 'react-icons/fa';
import '../styles/MacStyle.css';
import '../styles/DarkPage.css';

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
      risultati = risultati.filter(p => {
        const titolo = p.titolo || '';
        const descrizione = p.descrizione || '';
        return titolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
               descrizione.toLowerCase().includes(searchTerm.toLowerCase());
      });
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
      <div className="dark-page min-vh-100 d-flex align-items-center justify-content-center">
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
    <div className="dark-page py-4">
      {/* Header Hero - Mac Style */}
      <div className="row align-items-center mb-5">
        <div className="col-lg-8">
          <div className="d-flex align-items-center mb-3">
            <div className="bg-primary bg-opacity-10 p-3 rounded-4 me-3">
              <FaShoppingCart className="text-primary" size={32} />
            </div>
            <span className="mac-badge bg-primary text-white">MARKETPLACE</span>
          </div>
          <h1 className="display-4 mac-title mb-3">Prodotti Software Pronti</h1>
          <p className="lead mac-subtitle opacity-90">
            Scopri soluzioni software innovative pronte all'uso. 
            Risparmia tempo con pacchetti pre-configurati dai nostri migliori esperti.
          </p>
        </div>
        <div className="col-lg-4 text-center">
          {user?.ruolo === 'fornitore' && (
            <button 
              className="btn btn-primary btn-lg rounded-pill px-5 py-3 shadow-lg fw-bold"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              <FaPlus className="me-2" />
              Pubblica Prodotto
            </button>
          )}
        </div>
      </div>

      {/* Form Creazione Prodotto - Mac Style Modal/Card */}
        {user?.ruolo === 'fornitore' && showCreateForm && (
          <div className="row mb-5">
            <div className="col-12">
              <div className="mac-glass-card p-0 overflow-hidden">
                <div className="p-4 border-bottom bg-primary bg-opacity-5">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3">
                        <FaMagic className="text-primary" size={20} />
                      </div>
                      <div>
                        <h5 className="mb-0 mac-title">Nuovo Prodotto Software</h5>
                        <p className="mac-subtitle mb-0 small">Compila i dettagli per pubblicare nel marketplace</p>
                      </div>
                    </div>
                    <button 
                      className="btn btn-link text-muted text-decoration-none"
                      onClick={() => setShowCreateForm(false)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="row">
                    <div className="col-lg-8">
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="form-label mac-subtitle small text-uppercase fw-bold">Nome del prodotto</label>
                            <input 
                              type="text" 
                              className="form-control rounded-3 mac-input-field" 
                              placeholder="Es: Sistema CRM completo per PMI" 
                              value={titolo} 
                              onChange={e => setTitolo(e.target.value)} 
                              required 
                            />
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="form-label mac-subtitle small text-uppercase fw-bold">Categoria prodotto</label>
                            <select 
                              className="form-select rounded-3 mac-input-field" 
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
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <label className="form-label mac-subtitle small text-uppercase fw-bold">Descrizione completa</label>
                          <textarea 
                            className="form-control rounded-3 mac-input-field" 
                            rows="4"
                            placeholder="Funzionalità, tecnologie, cosa include..."
                            value={descrizione} 
                            onChange={e => setDescrizione(e.target.value)} 
                            required 
                          />
                        </div>
                        
                        <div className="row">
                          <div className="col-md-4 mb-3">
                            <label className="form-label mac-subtitle small text-uppercase fw-bold">Prezzo (€)</label>
                            <div className="input-group">
                              <span className="input-group-text bg-white border-end-0 rounded-start-3">
                                <FaEuroSign className="text-success" />
                              </span>
                              <input 
                                type="number" 
                                className="form-control border-start-0 rounded-end-3 mac-input-field" 
                                placeholder="299" 
                                value={prezzo} 
                                onChange={e => setPrezzo(e.target.value)} 
                                required 
                              />
                            </div>
                          </div>
                          <div className="col-md-4 mb-3">
                            <label className="form-label mac-subtitle small text-uppercase fw-bold">Link demo</label>
                            <input 
                              type="url" 
                              className="form-control rounded-3 mac-input-field" 
                              placeholder="https://demo.com" 
                              value={linkDemo} 
                              onChange={e => setLinkDemo(e.target.value)} 
                            />
                          </div>
                          <div className="col-md-4 mb-3">
                            <label className="form-label mac-subtitle small text-uppercase fw-bold">Immagine</label>
                            <input 
                              type="file" 
                              className="form-control rounded-3 mac-input-field" 
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </div>
                        </div>
                        
                        <div className="d-flex gap-3 mt-4">
                          <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold flex-grow-1">
                            <FaRocket className="me-2" />
                            Pubblica Prodotto
                          </button>
                          {titolo && (
                            <button 
                              type="button" 
                              className="btn btn-light rounded-pill px-4"
                              onClick={() => setShowPreview(!showPreview)}
                            >
                              <FaEye className="me-2" />
                              {showPreview ? 'Nascondi' : 'Anteprima'}
                            </button>
                          )}
                        </div>
                      </form>
                    </div>
                    
                    {/* Anteprima prodotto */}
                    <div className="col-lg-4">
                      {showPreview && titolo && categoria && (
                        <div className="p-3 bg-light rounded-4 border border-dashed">
                          <h6 className="mac-subtitle small text-uppercase fw-bold mb-3 text-center">Preview Card</h6>
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

        {/* Filtri e Ricerca - Mac Style */}
        <div className="mac-glass-card mb-5 p-4">
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 rounded-start-3">
                  <FaSearch className="text-muted" />
                </span>
                <input 
                  type="text" 
                  className="form-control border-start-0 rounded-end-3 mac-input-field" 
                  placeholder="Cerca software..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select 
                className="form-select rounded-3 mac-input-field" 
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
                className="form-select rounded-3 mac-input-field" 
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

        {/* Griglia Prodotti - Mac Style */}
        <div className="row g-4">
          {prodottiFiltrati.length > 0 ? (
            prodottiFiltrati.map(prodotto => {
              const categoriaInfo = categorieProdotti.find(c => c.value === prodotto.categoria);
              
              return (
                <div key={prodotto.id} className="col-lg-4 col-md-6">
                  <div className="mac-glass-card h-100 p-4 d-flex flex-column">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="mac-badge" style={{ backgroundColor: 'rgba(0, 113, 227, 0.1)', color: '#0071e3' }}>
                        <span className="me-1">{categoriaInfo?.icon || '📦'}</span>
                        {categoriaInfo?.label || 'Altro'}
                      </div>
                      {prodotto.prezzo > 0 && (
                        <div className="text-success fw-bold">
                          <FaEuroSign className="small me-1" />
                          {prodotto.prezzo}
                        </div>
                      )}
                    </div>
                    
                    {prodotto.immagine && (
                      <div className="mb-3 position-relative overflow-hidden rounded-4" style={{ height: '180px' }}>
                        <img 
                          src={prodotto.immagine} 
                          alt={prodotto.titolo}
                          className="w-100 h-100 object-fit-cover"
                        />
                      </div>
                    )}
                    
                    <h5 className="mac-title mb-2 fs-5">{prodotto.titolo}</h5>
                    <p className="mac-subtitle mb-4 flex-grow-1 small" style={{ 
                      lineHeight: '1.5',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {prodotto.descrizione}
                    </p>
                    
                    <div className="d-flex align-items-center justify-content-between mb-4 p-2 bg-light bg-opacity-50 rounded-3">
                      <div className="d-flex align-items-center">
                        <div className="bg-info bg-opacity-10 p-2 rounded-circle me-2">
                          <FaUser className="text-info" size={10} />
                        </div>
                        <small className="mac-subtitle x-small text-uppercase fw-bold">{prodotto.fornitore_username || 'Expert'}</small>
                      </div>
                      <small className="mac-subtitle x-small">
                        {new Date(prodotto.data_pubblicazione).toLocaleDateString('it-IT')}
                      </small>
                    </div>
                    
                    <div className="d-flex gap-2 mt-auto pt-3 border-top">
                      {prodotto.link_demo && (
                        <a 
                          href={prodotto.link_demo} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-light btn-sm flex-fill rounded-pill fw-bold"
                        >
                          <FaEye className="me-1" />
                          Demo
                        </a>
                      )}
                      <button 
                        className="btn btn-primary btn-sm flex-fill rounded-pill fw-bold"
                        onClick={() => contactSupplier(prodotto.fornitore, prodotto.titolo)}
                      >
                        <FaEnvelope className="me-1" />
                        Contatta
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-12">
              <div className="text-center py-5 mac-glass-card">
                <div className="bg-light rounded-circle d-inline-flex p-4 mb-4">
                  <FaGift size={48} className="text-muted opacity-50" />
                </div>
                <h4 className="mac-title mb-2">Nessun prodotto trovato</h4>
                <p className="mac-subtitle mb-0">
                  {filtroCategoria || searchTerm ? 
                    'Prova a modificare i filtri di ricerca.' :
                    'Nessun prodotto disponibile al momento.'
                  }
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Messaggi Feedback */}
        {(success || error) && (
          <div className="fixed-bottom p-4 d-flex justify-content-center" style={{ zIndex: 1050 }}>
            {success && (
              <div className="mac-glass-card px-4 py-3 text-success shadow-lg d-flex align-items-center">
                <FaCheckCircle className="me-3" />
                <strong>{success}</strong>
              </div>
            )}
            {error && (
              <div className="mac-glass-card px-4 py-3 text-danger shadow-lg d-flex align-items-center">
                <FaExclamationTriangle className="me-3" />
                <strong>{error}</strong>
              </div>
            )}
          </div>
        )}
      </div>
  );
}

export default ProdottiPronti; 
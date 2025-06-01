import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAllRichieste } from '../services/api';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaSearch, FaFilter, FaSort, FaEye, FaEuroSign, FaCalendar, 
  FaUser, FaLayerGroup, FaChevronLeft, FaChevronRight,
  FaImage, FaExclamationTriangle, FaSpinner, FaArrowLeft,
  FaHandshake, FaTimes
} from 'react-icons/fa';

function RichiestePage() {
  const { user, token } = useAuth();
  const [richieste, setRichieste] = useState([]);
  const [richiesteFiltered, setRichiesteFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Stati per filtri
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [statoFilter, setStatoFilter] = useState('');
  const [ordinamento, setOrdinamento] = useState('recenti');

  // Paginazione
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Stati per modal offerta
  const [showModalOfferta, setShowModalOfferta] = useState(false);
  const [richiestaSelezionata, setRichiestaSelezionata] = useState(null);
  const [descrizione, setDescrizione] = useState('');
  const [prezzo, setPrezzo] = useState('');
  const [success, setSuccess] = useState('');

  // Categorie software
  const categorieSoftware = [
    { value: 'crm', label: 'CRM', icon: '👥' },
    { value: 'ecommerce', label: 'E-commerce', icon: '🛒' },
    { value: 'app_mobile', label: 'App Mobile', icon: '📱' },
    { value: 'web_app', label: 'Web App', icon: '🌐' },
    { value: 'gestionale', label: 'Gestionale', icon: '📊' },
    { value: 'blog', label: 'Blog/CMS', icon: '📝' },
    { value: 'portfolio', label: 'Portfolio', icon: '🎨' },
    { value: 'prenotazioni', label: 'Prenotazioni', icon: '📅' },
    { value: 'marketplace', label: 'Marketplace', icon: '🏪' },
    { value: 'social', label: 'Social Network', icon: '👫' },
    { value: 'altro', label: 'Altro', icon: '⚡' }
  ];

  // Carica richieste
  useEffect(() => {
    const loadRichieste = async () => {
      try {
        setLoading(true);
        console.log('🔄 Caricamento richieste...');
        console.log('Token disponibile:', !!token);
        
        const data = await getAllRichieste(token);
        console.log('📊 Dati ricevuti:', data);
        console.log('📊 Numero richieste:', data?.length || 0);
        
        setRichieste(data || []);
        setRichiesteFiltered(data || []);
        setError('');
      } catch (err) {
        console.error('❌ Errore nel caricamento delle richieste:', err);
        setError(`Errore nel caricamento delle richieste: ${err.message}`);
        setRichieste([]);
        setRichiesteFiltered([]);
      } finally {
        setLoading(false);
        console.log('✅ Caricamento completato');
      }
    };

    loadRichieste();
  }, [token]);

  // Gestione invio offerta
  const handleSubmitOfferta = async (e) => {
    e.preventDefault();
    setSuccess(''); 
    setError('');
    
    try {
      await axios.post('/api/offerte/', {
        richiesta: richiestaSelezionata.id,
        fornitore: user.id,
        descrizione,
        prezzo
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess('🎉 Offerta inviata con successo! Il cliente riceverà una notifica e potrà valutare la tua proposta.');
      setDescrizione(''); 
      setPrezzo('');
      setShowModalOfferta(false);
      setRichiestaSelezionata(null);
      
      // Mostra un alert di successo
      setTimeout(() => {
        alert('✅ OFFERTA INVIATA!\n\nLa tua offerta è stata inviata con successo al cliente.\n\nRiceverai una notifica quando il cliente prenderà una decisione.');
      }, 500);
      
    } catch (err) {
      setError("Errore nell'invio dell'offerta: " + (err.response?.data?.detail || err.message));
    }
  };

  // Gestione apertura modal offerta
  const handleFaiOfferta = (richiesta) => {
    setRichiestaSelezionata(richiesta);
    setShowModalOfferta(true);
    setDescrizione('');
    setPrezzo('');
    setError('');
    setSuccess('');
  };

  // Gestione chiusura modal offerta
  const handleCloseModalOfferta = () => {
    setShowModalOfferta(false);
    setRichiestaSelezionata(null);
    setDescrizione('');
    setPrezzo('');
    setError('');
    setSuccess('');
  };

  // Applica filtri
  useEffect(() => {
    let filtered = [...richieste];

    // Filtro per testo
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.titolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.descrizione.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro per categoria
    if (categoriaFilter) {
      filtered = filtered.filter(r => r.tipo_software === categoriaFilter);
    }

    // Filtro per budget
    if (budgetMin) {
      filtered = filtered.filter(r => parseFloat(r.budget) >= parseFloat(budgetMin));
    }
    if (budgetMax) {
      filtered = filtered.filter(r => parseFloat(r.budget) <= parseFloat(budgetMax));
    }

    // Filtro per stato
    if (statoFilter) {
      filtered = filtered.filter(r => r.stato === statoFilter);
    }

    // Ordinamento
    switch (ordinamento) {
      case 'recenti':
        filtered.sort((a, b) => new Date(b.data_pubblicazione) - new Date(a.data_pubblicazione));
        break;
      case 'budget_asc':
        filtered.sort((a, b) => parseFloat(a.budget) - parseFloat(b.budget));
        break;
      case 'budget_desc':
        filtered.sort((a, b) => parseFloat(b.budget) - parseFloat(a.budget));
        break;
      case 'alfabetico':
        filtered.sort((a, b) => a.titolo.localeCompare(b.titolo));
        break;
      default:
        break;
    }

    setRichiesteFiltered(filtered);
    setCurrentPage(1); // Reset pagina quando cambiano i filtri
  }, [richieste, searchTerm, categoriaFilter, budgetMin, budgetMax, statoFilter, ordinamento]);

  // Calcolo paginazione
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = richiesteFiltered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(richiesteFiltered.length / itemsPerPage);

  // Reset filtri
  const resetFiltri = () => {
    setSearchTerm('');
    setCategoriaFilter('');
    setBudgetMin('');
    setBudgetMax('');
    setStatoFilter('');
    setOrdinamento('recenti');
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <FaSpinner className="fa-spin text-primary mb-3" size={48} />
          <h4 className="text-muted">Caricamento richieste...</h4>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <FaExclamationTriangle className="text-warning mb-3" size={48} />
          <h4 className="text-muted">{error}</h4>
          <button className="btn btn-primary mt-3" onClick={() => window.location.reload()}>
            Riprova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-gradient-light">
      {/* Header */}
      <div className="bg-primary text-white position-relative overflow-hidden">
        <div className="container py-5 position-relative z-2">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="d-flex align-items-center mb-3">
                <Link to="/" className="btn btn-light btn-sm rounded-pill me-3">
                  <FaArrowLeft className="me-2" />
                  Homepage
                </Link>
                <span className="badge bg-light text-primary px-3 py-2 rounded-pill">RICHIESTE</span>
              </div>
              <h1 className="display-4 fw-bold mb-3">Tutte le Richieste</h1>
              <p className="lead opacity-90">
                Esplora tutte le richieste software pubblicate dai clienti. 
                Usa i filtri per trovare il progetto perfetto per te!
              </p>
            </div>
            <div className="col-lg-4 text-center">
              <div className="bg-white bg-opacity-10 rounded-4 p-4">
                <h3 className="mb-2">{richiesteFiltered.length}</h3>
                <p className="mb-0 opacity-75">Richieste trovate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        {/* Filtri */}
        <div className="card border-0 shadow-lg rounded-4 mb-5">
          <div className="card-header bg-white border-0 rounded-top-4 p-4">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <FaFilter className="text-primary me-3" size={20} />
                <h5 className="mb-0">Filtri di Ricerca</h5>
              </div>
              <button 
                className="btn btn-outline-secondary btn-sm rounded-pill"
                onClick={resetFiltri}
              >
                Reset Filtri
              </button>
            </div>
          </div>
          <div className="card-body p-4">
            <div className="row g-3">
              {/* Search Bar */}
              <div className="col-md-6">
                <label className="form-label fw-bold">🔍 Cerca per titolo o descrizione</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <FaSearch className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="es. App mobile, e-commerce..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Categoria */}
              <div className="col-md-3">
                <label className="form-label fw-bold">📂 Categoria</label>
                <select 
                  className="form-select"
                  value={categoriaFilter}
                  onChange={(e) => setCategoriaFilter(e.target.value)}
                >
                  <option value="">Tutte le categorie</option>
                  {categorieSoftware.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stato */}
              <div className="col-md-3">
                <label className="form-label fw-bold">📊 Stato</label>
                <select 
                  className="form-select"
                  value={statoFilter}
                  onChange={(e) => setStatoFilter(e.target.value)}
                >
                  <option value="">Tutti gli stati</option>
                  <option value="aperta">🟢 Aperta</option>
                  <option value="assegnata">🟡 Assegnata</option>
                  <option value="completata">✅ Completata</option>
                </select>
              </div>

              {/* Budget Min */}
              <div className="col-md-3">
                <label className="form-label fw-bold">💰 Budget Min (€)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="0"
                  min="0"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                />
              </div>

              {/* Budget Max */}
              <div className="col-md-3">
                <label className="form-label fw-bold">💰 Budget Max (€)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="10000"
                  min="0"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                />
              </div>

              {/* Ordinamento */}
              <div className="col-md-3">
                <label className="form-label fw-bold">📈 Ordina per</label>
                <select 
                  className="form-select"
                  value={ordinamento}
                  onChange={(e) => setOrdinamento(e.target.value)}
                >
                  <option value="recenti">🕒 Più recenti</option>
                  <option value="budget_desc">💎 Budget: decrescente</option>
                  <option value="budget_asc">💰 Budget: crescente</option>
                  <option value="alfabetico">🔤 Alfabetico</option>
                </select>
              </div>

              {/* Statistiche Filtri */}
              <div className="col-md-3 d-flex align-items-end">
                <div className="w-100">
                  <div className="bg-light rounded-3 p-3 text-center">
                    <small className="text-muted d-block">Risultati</small>
                    <strong className="text-primary fs-5">{richiesteFiltered.length}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Griglia Richieste */}
        {currentItems.length > 0 ? (
          <>
            <div className="row g-4 mb-5">
              {currentItems.map(richiesta => {
                const categoriaInfo = categorieSoftware.find(c => c.value === richiesta.tipo_software);
                
                return (
                  <div key={richiesta.id} className="col-lg-4 col-md-6">
                    <div className="card border-0 shadow-lg rounded-4 h-100 richiesta-card">
                      <div className="card-body p-4">
                        {/* Header con categoria e stato */}
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <div className="badge rounded-pill px-3 py-2" 
                               style={{ backgroundColor: categoriaInfo?.value ? '#007bff' : '#6c757d', color: 'white' }}>
                            <span className="me-1">{categoriaInfo?.icon || '⚡'}</span>
                            {categoriaInfo?.label || 'Altro'}
                          </div>
                          <div className={`badge rounded-pill px-3 py-2 ${
                            richiesta.stato === 'aperta' ? 'bg-success' :
                            richiesta.stato === 'assegnata' ? 'bg-warning' : 'bg-secondary'
                          }`}>
                            {richiesta.stato === 'aperta' ? '🟢 Aperta' :
                             richiesta.stato === 'assegnata' ? '🟡 Assegnata' : '✅ Completata'}
                          </div>
                        </div>

                        {/* Immagine se presente */}
                        {richiesta.immagine && (
                          <div className="mb-3">
                            <img 
                              src={richiesta.immagine} 
                              alt={richiesta.titolo}
                              className="img-fluid rounded-3"
                              style={{ height: '150px', width: '100%', objectFit: 'cover' }}
                            />
                          </div>
                        )}

                        {/* Titolo */}
                        <h5 className="card-title fw-bold text-primary mb-2">
                          {richiesta.titolo}
                        </h5>

                        {/* Descrizione */}
                        <p className="card-text text-muted mb-3" style={{ lineHeight: '1.6' }}>
                          {richiesta.descrizione.length > 120 
                            ? richiesta.descrizione.substring(0, 120) + '...'
                            : richiesta.descrizione
                          }
                        </p>

                        {/* Info richiesta */}
                        <div className="row g-2 mb-3">
                          <div className="col-6">
                            <div className="d-flex align-items-center">
                              <FaEuroSign className="text-success me-2" />
                              <div>
                                <small className="text-muted d-block">Budget</small>
                                <strong className="text-success">{richiesta.budget}€</strong>
                              </div>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="d-flex align-items-center">
                              <FaUser className="text-info me-2" />
                              <div>
                                <small className="text-muted d-block">Cliente</small>
                                <strong>{richiesta.cliente_username || 'Cliente'}</strong>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Footer con data e azione */}
                        <div className="border-top pt-3 d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            <FaCalendar className="me-1" />
                            {new Date(richiesta.data_creazione).toLocaleDateString('it-IT')}
                          </small>
                          
                          {/* Debug info - rimuovere dopo test */}
                          {console.log('Debug Richiesta:', {
                            id: richiesta.id,
                            stato: richiesta.stato,
                            userRuolo: user?.ruolo,
                            showButton: user?.ruolo === 'fornitore' && richiesta.stato === 'aperta'
                          })}
                          
                          {user?.ruolo === 'fornitore' ? (
                            richiesta.stato === 'aperta' ? (
                              <button 
                                className="btn btn-primary btn-sm rounded-pill"
                                onClick={() => handleFaiOfferta(richiesta)}
                              >
                                <FaHandshake className="me-1" />
                                Fai Offerta
                              </button>
                            ) : (
                              <span className="btn btn-outline-warning btn-sm rounded-pill disabled">
                                <FaHandshake className="me-1" />
                                {richiesta.stato === 'assegnata' ? 'Assegnata' : 'Completata'}
                              </span>
                            )
                          ) : (
                            <span className="btn btn-outline-secondary btn-sm rounded-pill disabled">
                              <FaEye className="me-1" />
                              {user ? 'Solo Fornitori' : 'Login Richiesto'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Paginazione */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center">
                <nav>
                  <ul className="pagination pagination-lg">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link rounded-pill me-2"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <FaChevronLeft />
                      </button>
                    </li>
                    
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      if (page === 1 || page === totalPages || 
                          (page >= currentPage - 2 && page <= currentPage + 2)) {
                        return (
                          <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                            <button 
                              className="page-link rounded-pill mx-1"
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </button>
                          </li>
                        );
                      } else if (page === currentPage - 3 || page === currentPage + 3) {
                        return (
                          <li key={page} className="page-item disabled">
                            <span className="page-link rounded-pill mx-1">...</span>
                          </li>
                        );
                      }
                      return null;
                    })}
                    
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link rounded-pill ms-2"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <FaChevronRight />
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-5">
            <FaExclamationTriangle size={64} className="text-muted mb-4 opacity-50" />
            <h4 className="text-muted mb-2">Nessuna richiesta trovata</h4>
            <p className="text-muted mb-4">
              Prova a modificare i filtri di ricerca o a esplorare tutte le categorie.
            </p>
            <button className="btn btn-primary rounded-pill px-4" onClick={resetFiltri}>
              Reset Filtri
            </button>
          </div>
        )}
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
                {/* Messaggio di successo */}
                {success && (
                  <div className="alert alert-success alert-dismissible fade show rounded-4 mb-4" role="alert">
                    <strong>{success}</strong>
                    <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                  </div>
                )}

                {/* Messaggio di errore */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show rounded-4 mb-4" role="alert">
                    <strong>{error}</strong>
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                  </div>
                )}

                {/* Info richiesta */}
                <div className="card bg-light bg-gradient border-0 rounded-4 mb-4">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-8">
                        <h6 className="text-primary fw-bold mb-2">{richiestaSelezionata.titolo}</h6>
                        <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                          {richiestaSelezionata.descrizione.length > 150 
                            ? richiestaSelezionata.descrizione.substring(0, 150) + '...'
                            : richiestaSelezionata.descrizione
                          }
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

                <form onSubmit={handleSubmitOfferta}>
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

      <style jsx>{`
        .bg-gradient-light {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }
        
        .richiesta-card {
          transition: all 0.3s ease;
          border: 1px solid rgba(0,0,0,0.05) !important;
        }
        
        .richiesta-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
        }
        
        .page-link {
          border: none;
          color: #007bff;
          font-weight: 500;
        }
        
        .page-item.active .page-link {
          background: linear-gradient(45deg, #007bff, #0056b3);
          border: none;
        }
        
        .page-link:hover {
          background: rgba(0,123,255,0.1);
          color: #007bff;
        }
      `}</style>
    </div>
  );
}

export default RichiestePage; 
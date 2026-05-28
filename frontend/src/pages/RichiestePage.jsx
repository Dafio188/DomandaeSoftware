import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAllRichieste } from '../services/api';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaSearch, FaFilter, FaSort, FaEye, FaEuroSign, FaCalendar, 
  FaUser, FaLayerGroup, FaChevronLeft, FaChevronRight,
  FaImage, FaExclamationTriangle, FaSpinner, FaArrowLeft,
  FaHandshake, FaTimes, FaSearch as FaRichiesteIcon
} from 'react-icons/fa';
import PageHeader from '../components/PageHeader';
import '../styles/MacStyle.css';

function RichiestePage() {
  const { user, token, refreshProfile } = useAuth();
  const [richieste, setRichieste] = useState([]);
  const [richiesteFiltered, setRichiesteFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Stati per filtri
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState('');
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

      if (refreshProfile) {
        refreshProfile().catch(() => {});
      }
      
    } catch (err) {
      setError("Errore nell'invio dell'offerta: " + (err.response?.data?.detail || err.message));
    }
  };

  const offertaCreditCost = 1;
  const userCrediti = Number(user?.crediti ?? 0);
  const creditiOk = user?.ruolo !== 'fornitore' ? true : userCrediti >= offertaCreditCost;

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
      filtered = filtered.filter(r => {
        const titolo = r.titolo || '';
        const descrizione = r.descrizione || '';
        return titolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
               descrizione.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Filtro per tag/skill
    if (tagFilter) {
      const q = tagFilter.trim().toLowerCase();
      filtered = filtered.filter((r) => {
        const tags = Array.isArray(r.skill_tags) ? r.skill_tags : [];
        return tags.some((t) => String(t).toLowerCase().includes(q));
      });
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
  }, [richieste, searchTerm, tagFilter, categoriaFilter, budgetMin, budgetMax, statoFilter, ordinamento]);

  // Calcolo paginazione
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = richiesteFiltered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(richiesteFiltered.length / itemsPerPage);

  // Reset filtri
  const resetFiltri = () => {
    setSearchTerm('');
    setTagFilter('');
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
    <div className="py-4">
      {/* Header Section */}
      <PageHeader 
        title="Esplora le Richieste"
        subtitle="Trova il progetto perfetto per te tra le centinaia di richieste pubblicate. Filtra per categoria, budget e competenze richieste."
        badge="RICHIESTE"
        icon={FaSearch}
        theme="primary"
      />

      <div className="row justify-content-center mb-5">
        <div className="col-lg-10">
          <div className="row g-3">
            <div className="col-md-4">
              <Link to="/" className="btn btn-light btn-sm rounded-pill shadow-sm w-100 py-3">
                <FaArrowLeft className="me-2" />
                Torna alla Homepage
              </Link>
            </div>
            <div className="col-md-8">
              <div className="mac-glass-card p-2 d-flex align-items-center justify-content-center">
                <span className="h4 mb-0 mac-title me-3">{richiesteFiltered.length}</span>
                <span className="mac-subtitle small">Richieste attive trovate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtri Section - Mac Style */}
        <div className="mac-glass-card mb-5 p-4">
          <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
            <div className="d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3">
                <FaFilter className="text-primary" size={20} />
              </div>
              <h5 className="mb-0 mac-title">Filtri di Ricerca</h5>
            </div>
            <button 
              className="btn btn-link text-muted text-decoration-none btn-sm fw-bold"
              onClick={resetFiltri}
            >
              Reset Filtri
            </button>
          </div>
          
          <div className="row g-3">
            {/* Search Bar */}
            <div className="col-md-4">
              <label className="form-label mac-subtitle small text-uppercase fw-bold">🔍 Cerca per titolo o descrizione</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 rounded-start-3">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 rounded-end-3 mac-input-field"
                  placeholder="es. App mobile, e-commerce..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Skill tag */}
            <div className="col-md-2">
              <label className="form-label mac-subtitle small text-uppercase fw-bold">🏷️ Skill</label>
              <input
                type="text"
                className="form-control rounded-3 mac-input-field"
                placeholder="es. react"
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
              />
            </div>

            {/* Categoria */}
            <div className="col-md-3">
              <label className="form-label mac-subtitle small text-uppercase fw-bold">📂 Categoria</label>
              <select 
                className="form-select rounded-3 mac-input-field"
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
              <label className="form-label mac-subtitle small text-uppercase fw-bold">📊 Stato</label>
              <select 
                className="form-select rounded-3 mac-input-field"
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
              <label className="form-label mac-subtitle small text-uppercase fw-bold">💰 Budget Min (€)</label>
              <input
                type="number"
                className="form-control rounded-3 mac-input-field"
                placeholder="0"
                min="0"
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
              />
            </div>

            {/* Budget Max */}
            <div className="col-md-3">
              <label className="form-label mac-subtitle small text-uppercase fw-bold">💰 Budget Max (€)</label>
              <input
                type="number"
                className="form-control rounded-3 mac-input-field"
                placeholder="10000"
                min="0"
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
              />
            </div>

            {/* Ordinamento */}
            <div className="col-md-3">
              <label className="form-label mac-subtitle small text-uppercase fw-bold">📈 Ordina per</label>
              <select 
                className="form-select rounded-3 mac-input-field"
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
                <div className="bg-primary bg-opacity-10 rounded-3 p-2 text-center">
                  <small className="text-primary d-block fw-bold small">RISULTATI</small>
                  <strong className="text-primary fs-5">{richiesteFiltered.length}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Griglia Richieste - Mac Cards */}
        {currentItems.length > 0 ? (
          <>
            <div className="row g-4 mb-5">
              {currentItems.map(richiesta => {
                const categoriaInfo = categorieSoftware.find(c => c.value === richiesta.tipo_software);
                
                return (
                  <div key={richiesta.id} className="col-lg-4 col-md-6">
                    <div className="mac-glass-card h-100 p-4 d-flex flex-column">
                      {/* Header con categoria e stato */}
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="mac-badge" 
                             style={{ backgroundColor: 'rgba(0, 113, 227, 0.1)', color: '#0071e3' }}>
                          <span className="me-1">{categoriaInfo?.icon || '⚡'}</span>
                          {categoriaInfo?.label || 'Altro'}
                        </div>
                        <div className={`mac-badge ${
                          richiesta.stato === 'aperta' ? 'bg-success bg-opacity-10 text-success' :
                          richiesta.stato === 'assegnata' ? 'bg-warning bg-opacity-10 text-warning' : 'bg-secondary bg-opacity-10 text-secondary'
                        }`}>
                          {richiesta.stato === 'aperta' ? '🟢 Aperta' :
                           richiesta.stato === 'assegnata' ? '🟡 Assegnata' : '✅ Completata'}
                        </div>
                      </div>

                      {/* Immagine se presente */}
                      {richiesta.immagine && (
                        <div className="mb-3 position-relative overflow-hidden rounded-4" style={{ height: '160px' }}>
                          <img 
                            src={richiesta.immagine} 
                            alt={richiesta.titolo}
                            className="w-100 h-100 object-fit-cover"
                          />
                        </div>
                      )}

                      {/* Titolo */}
                      <h5 className="mac-title mb-2 fs-5">
                        {richiesta.titolo}
                      </h5>

                      {Array.isArray(richiesta.skill_tags) && richiesta.skill_tags.length > 0 && (
                        <div className="d-flex flex-wrap gap-2 mb-3">
                          {richiesta.skill_tags.slice(0, 5).map((tag) => (
                            <span key={tag} className="badge bg-light text-dark fw-medium border-0 rounded-pill px-2 py-1 small">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Descrizione */}
                      <p className="mac-subtitle mb-4 flex-grow-1 small" style={{ lineHeight: '1.5' }}>
                        {richiesta.descrizione.length > 120 
                          ? richiesta.descrizione.substring(0, 120) + '...'
                          : richiesta.descrizione
                        }
                      </p>

                      {/* Info richiesta */}
                      <div className="row g-2 mb-4 p-3 rounded-4 bg-white bg-opacity-50">
                        <div className="col-6">
                          <div className="d-flex align-items-center">
                            <div className="bg-success bg-opacity-10 p-2 rounded-3 me-2">
                              <FaEuroSign className="text-success" size={12} />
                            </div>
                            <div>
                              <small className="mac-subtitle d-block x-small">BUDGET</small>
                              <strong className="text-success small">{richiesta.budget}€</strong>
                            </div>
                          </div>
                        </div>
                        <div className="col-6 border-start ps-3">
                          <div className="d-flex align-items-center">
                            <div className="bg-info bg-opacity-10 p-2 rounded-3 me-2">
                              <FaUser className="text-info" size={12} />
                            </div>
                            <div>
                              <small className="mac-subtitle d-block x-small">CLIENTE</small>
                              <strong className="text-dark small">{richiesta.cliente_username || 'Utente'}</strong>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Footer con data e azione */}
                      <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
                        <small className="mac-subtitle x-small">
                          <FaCalendar className="me-1" />
                          {new Date(richiesta.data_creazione).toLocaleDateString('it-IT')}
                        </small>
                        
                        {user?.ruolo === 'fornitore' ? (
                          richiesta.stato === 'aperta' ? (
                            <button 
                              className="btn btn-primary btn-sm rounded-pill px-3 fw-bold"
                              onClick={() => handleFaiOfferta(richiesta)}
                            >
                              Fai Offerta
                            </button>
                          ) : (
                            <span className="text-muted small fw-medium">
                              {richiesta.stato === 'assegnata' ? 'Assegnata' : 'Completata'}
                            </span>
                          )
                        ) : (
                          <Link to="/login" className="text-primary small fw-bold text-decoration-none">
                            Vedi dettagli
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Paginazione Mac Style */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center pb-5">
                <nav className="mac-glass-card p-2">
                  <ul className="pagination pagination-sm mb-0 border-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link border-0 rounded-circle bg-transparent text-primary"
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
                              className={`page-link border-0 rounded-circle mx-1 ${currentPage === page ? 'bg-primary text-white shadow' : 'bg-transparent text-dark'}`}
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </button>
                          </li>
                        );
                      } else if (page === currentPage - 3 || page === currentPage + 3) {
                        return (
                          <li key={page} className="page-item disabled">
                            <span className="page-link border-0 bg-transparent">...</span>
                          </li>
                        );
                      }
                      return null;
                    })}
                    
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link border-0 rounded-circle bg-transparent text-primary"
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
          <div className="text-center py-5 mac-glass-card">
            <div className="bg-light rounded-circle d-inline-flex p-4 mb-4">
              <FaExclamationTriangle size={48} className="text-muted opacity-50" />
            </div>
            <h4 className="mac-title mb-2">Nessuna richiesta trovata</h4>
            <p className="mac-subtitle mb-4">
              Prova a modificare i filtri di ricerca o a esplorare tutte le categorie.
            </p>
            <button className="btn btn-primary rounded-pill px-4 fw-bold" onClick={resetFiltri}>
              Reset Filtri
            </button>
          </div>
        )}

      {/* MODAL OFFERTA - Mac Style */}
      {showModalOfferta && richiestaSelezionata && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)' }} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content mac-glass-card border-0 overflow-hidden">
              <div className="modal-header border-0 p-4">
                <div>
                  <h4 className="mac-title mb-1">
                    <FaHandshake className="me-2 text-primary" />
                    Fai un'offerta
                  </h4>
                  <p className="mac-subtitle mb-0 small">Proponi la tua soluzione professionale</p>
                </div>
                <button 
                  type="button" 
                  className="btn-close shadow-none" 
                  onClick={handleCloseModalOfferta}
                ></button>
              </div>
              <div className="modal-body p-4 pt-0">
                {/* Messaggio di successo */}
                {success && (
                  <div className="alert alert-success border-0 rounded-4 mb-4 bg-success bg-opacity-10 text-success">
                    <FaCheckCircle className="me-2" />
                    <strong>{success}</strong>
                  </div>
                )}

                {/* Messaggio di errore */}
                {error && (
                  <div className="alert alert-danger border-0 rounded-4 mb-4 bg-danger bg-opacity-10 text-danger">
                    <FaExclamationTriangle className="me-2" />
                    <strong>{error}</strong>
                  </div>
                )}

                {/* Info richiesta */}
                <div className="p-3 rounded-4 bg-primary bg-opacity-5 mb-4 border border-primary border-opacity-10">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h6 className="mac-title mb-2 text-primary">{richiestaSelezionata.titolo}</h6>
                      <p className="mac-subtitle mb-0 small">
                        {richiestaSelezionata.descrizione.length > 150 
                          ? richiestaSelezionata.descrizione.substring(0, 150) + '...'
                          : richiestaSelezionata.descrizione
                        }
                      </p>
                    </div>
                    <div className="col-md-4 text-md-end mt-3 mt-md-0">
                      <div className="bg-white bg-opacity-50 p-2 rounded-3 d-inline-block">
                        <small className="mac-subtitle d-block x-small">BUDGET</small>
                        <div className="h5 text-success fw-bold mb-0">
                          {richiestaSelezionata.budget}€
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmitOfferta}>
                  <div className="alert alert-warning border-0 rounded-4 mb-4 bg-warning bg-opacity-10 text-dark small">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                      <div>
                        <FaTicketAlt className="me-2" />
                        <strong>Ticket:</strong> inviare un’offerta costa {offertaCreditCost} credito
                      </div>
                      <div className="bg-white bg-opacity-50 px-2 py-1 rounded-2">
                        <strong>Saldo:</strong> {userCrediti}
                      </div>
                    </div>
                    {!creditiOk && (
                      <div className="mt-2 text-danger fw-bold">
                        Crediti insufficienti: ricarica per poter inviare offerte. <Link to="/crediti" className="text-danger">Vai a Crediti</Link>
                      </div>
                    )}
                  </div>
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
                      disabled={!descrizione || !prezzo || !creditiOk}
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

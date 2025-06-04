import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../config/api.js';
import { Link } from 'react-router-dom';
import { 
  FaHandshake, 
  FaEuroSign, 
  FaCalendar, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock, 
  FaArrowLeft,
  FaEye,
  FaSearch,
  FaFilter,
  FaUser,
  FaProjectDiagram,
  FaCheck,
  FaTimes
} from 'react-icons/fa';

function LeMieOfferteCliente() {
  const { user, token } = useAuth();
  const [offerte, setOfferte] = useState([]);
  const [richieste, setRichieste] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStato, setFiltroStato] = useState('tutte');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (token && user && user.is_cliente) {
      setLoading(true);
      
      // Carica le richieste del cliente
      axios.get(`${API_BASE}richieste/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const richiesteCliente = res.data.filter(r => r.cliente === user.id);
        setRichieste(richiesteCliente);
        
        // Carica tutte le offerte per le richieste del cliente
        return axios.get(`${API_BASE}offerte/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      })
      .then(res => {
        const richiesteIds = richieste.map(r => r.id);
        const offerteCliente = res.data.filter(o => richiesteIds.includes(o.richiesta));
        setOfferte(offerteCliente);
        setLoading(false);
      })
      .catch(err => {
        console.error('Errore caricamento dati:', err);
        setLoading(false);
      });
    }
  }, [token, user, richieste.length]);

  // Filtra offerte in base ai criteri
  const offerteFiltered = offerte.filter(offerta => {
    const matchStato = filtroStato === 'tutte' || offerta.stato === filtroStato;
    const matchSearch = !searchTerm || 
      offerta.fornitore_username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offerta.descrizione.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchStato && matchSearch;
  });

  // Statistiche
  const stats = {
    totali: offerte.length,
    accettate: offerte.filter(o => o.stato === 'accettata').length,
    inAttesa: offerte.filter(o => o.stato === 'inviata').length,
    rifiutate: offerte.filter(o => o.stato === 'rifiutata').length,
    richiesteAttive: richieste.filter(r => r.stato === 'aperta').length
  };

  const getStatoBadge = (stato) => {
    switch(stato) {
      case 'accettata':
        return <span className="badge bg-success rounded-pill">✅ Accettata</span>;
      case 'rifiutata':
        return <span className="badge bg-danger rounded-pill">❌ Rifiutata</span>;
      case 'inviata':
        return <span className="badge bg-info rounded-pill">⏳ In attesa</span>;
      default:
        return <span className="badge bg-secondary rounded-pill">{stato}</span>;
    }
  };

  const handleAccettaOfferta = async (offertaId) => {
    try {
      await axios.patch(`${API_BASE}offerte/${offertaId}/`, 
        { stato: 'accettata' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Ricarica le offerte
      window.location.reload();
    } catch (error) {
      console.error('Errore nell\'accettare l\'offerta:', error);
      alert('Errore nell\'accettare l\'offerta');
    }
  };

  const handleRifiutaOfferta = async (offertaId) => {
    try {
      await axios.patch(`${API_BASE}offerte/${offertaId}/`, 
        { stato: 'rifiutata' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Ricarica le offerte
      window.location.reload();
    } catch (error) {
      console.error('Errore nel rifiutare l\'offerta:', error);
      alert('Errore nel rifiutare l\'offerta');
    }
  };

  if (!user || !user.is_cliente) {
    return (
      <div className="container mt-5 text-center">
        <h3>Accesso negato</h3>
        <p>Questa pagina è riservata ai clienti.</p>
        <Link to="/" className="btn btn-primary">Torna alla Home</Link>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light min-vh-100">
      {/* Header */}
      <div className="bg-gradient-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="d-flex align-items-center mb-3">
                <Link to="/dashboard" className="btn btn-light btn-sm rounded-pill me-3">
                  <FaArrowLeft className="me-2" />
                  Dashboard
                </Link>
                <span className="badge bg-light text-primary px-3 py-2 rounded-pill">CLIENTE</span>
              </div>
              <h1 className="display-4 fw-bold mb-3">Offerte Ricevute</h1>
              <p className="lead opacity-90">
                Gestisci tutte le proposte dei fornitori per i tuoi progetti
              </p>
            </div>
            <div className="col-lg-4">
              <div className="row g-3">
                <div className="col-6">
                  <div className="bg-white bg-opacity-10 rounded-4 p-3 text-center">
                    <h3 className="mb-1">{stats.totali}</h3>
                    <small className="opacity-75">Offerte Ricevute</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-success bg-opacity-20 rounded-4 p-3 text-center">
                    <h3 className="mb-1">{stats.inAttesa}</h3>
                    <small className="opacity-75">In Attesa</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        {/* Statistiche dettagliate */}
        <div className="row g-4 mb-5">
          <div className="col-md-3">
            <div className="card bg-primary bg-gradient text-white border-0 rounded-4">
              <div className="card-body text-center">
                <FaHandshake size={32} className="mb-3" />
                <h4>{stats.totali}</h4>
                <p className="mb-0">Offerte Ricevute</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-info bg-gradient text-white border-0 rounded-4">
              <div className="card-body text-center">
                <FaClock size={32} className="mb-3" />
                <h4>{stats.inAttesa}</h4>
                <p className="mb-0">In Attesa di Risposta</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-success bg-gradient text-white border-0 rounded-4">
              <div className="card-body text-center">
                <FaCheckCircle size={32} className="mb-3" />
                <h4>{stats.accettate}</h4>
                <p className="mb-0">Accettate</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-warning bg-gradient text-white border-0 rounded-4">
              <div className="card-body text-center">
                <FaProjectDiagram size={32} className="mb-3" />
                <h4>{stats.richiesteAttive}</h4>
                <p className="mb-0">Richieste Attive</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtri e ricerca */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label fw-bold">
                  <FaSearch className="me-2" />
                  Cerca nelle offerte
                </label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="Nome fornitore o descrizione..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-bold">
                  <FaFilter className="me-2" />
                  Filtra per stato
                </label>
                <select
                  className="form-select rounded-pill"
                  value={filtroStato}
                  onChange={(e) => setFiltroStato(e.target.value)}
                >
                  <option value="tutte">Tutte le offerte</option>
                  <option value="inviata">In attesa</option>
                  <option value="accettata">Accettate</option>
                  <option value="rifiutata">Rifiutate</option>
                </select>
              </div>
              <div className="col-md-5 text-end">
                <p className="mb-0 text-muted">
                  Visualizzando <strong>{offerteFiltered.length}</strong> di <strong>{offerte.length}</strong> offerte
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista offerte */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Caricamento...</span>
            </div>
          </div>
        ) : offerteFiltered.length > 0 ? (
          <div className="row g-4">
            {offerteFiltered.map(offerta => (
              <div key={offerta.id} className="col-lg-6 col-xl-4">
                <div className={`card border-0 shadow-sm rounded-4 h-100 ${
                  offerta.stato === 'accettata' ? 'border-success border-2' : 
                  offerta.stato === 'rifiutata' ? 'border-danger border-2' : 
                  ''
                }`}>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="card-title fw-bold mb-0">
                        {offerta.richiesta_titolo || `Richiesta #${offerta.richiesta}`}
                      </h5>
                      {getStatoBadge(offerta.stato)}
                    </div>
                    
                    <div className="d-flex align-items-center mb-3">
                      <FaUser className="text-info me-2" />
                      <span className="fw-bold text-info">{offerta.fornitore_username}</span>
                    </div>
                    
                    <p className="text-muted mb-3" style={{
                      height: '60px',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {offerta.descrizione}
                    </p>
                    
                    <div className="row g-3 mb-3">
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <FaEuroSign className="text-success me-2" />
                          <div>
                            <small className="text-muted d-block">Prezzo</small>
                            <strong className="text-success">{offerta.prezzo}€</strong>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <FaCalendar className="text-info me-2" />
                          <div>
                            <small className="text-muted d-block">Data ricevuta</small>
                            <strong className="small">
                              {new Date(offerta.data_invio || Date.now()).toLocaleDateString('it-IT')}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-top pt-3">
                      {offerta.stato === 'inviata' ? (
                        <div className="d-grid gap-2">
                          <div className="row g-2">
                            <div className="col-6">
                              <button 
                                className="btn btn-success btn-sm rounded-pill w-100"
                                onClick={() => handleAccettaOfferta(offerta.id)}
                              >
                                <FaCheck className="me-1" />
                                Accetta
                              </button>
                            </div>
                            <div className="col-6">
                              <button 
                                className="btn btn-outline-danger btn-sm rounded-pill w-100"
                                onClick={() => handleRifiutaOfferta(offerta.id)}
                              >
                                <FaTimes className="me-1" />
                                Rifiuta
                              </button>
                            </div>
                          </div>
                          <Link 
                            to={`/richieste/${offerta.richiesta}`}
                            className="btn btn-outline-primary btn-sm rounded-pill"
                          >
                            <FaEye className="me-2" />
                            Vedi Richiesta
                          </Link>
                        </div>
                      ) : (
                        <div className="d-grid">
                          <Link 
                            to={`/richieste/${offerta.richiesta}`}
                            className="btn btn-outline-primary btn-sm rounded-pill"
                          >
                            <FaEye className="me-2" />
                            Vedi Richiesta
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <div className="bg-light rounded-circle mx-auto mb-4" style={{ width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaHandshake size={48} className="text-muted opacity-50" />
            </div>
            <h5 className="text-muted mb-3">
              {searchTerm || filtroStato !== 'tutte' ? 'Nessuna offerta trovata' : 'Non hai ancora ricevuto offerte'}
            </h5>
            <p className="text-muted mb-4">
              {searchTerm || filtroStato !== 'tutte' 
                ? 'Prova a modificare i filtri di ricerca' 
                : 'Pubblica una richiesta per iniziare a ricevere proposte!'
              }
            </p>
            <Link to="/le-tue-idee" className="btn btn-primary rounded-pill px-4">
              <FaProjectDiagram className="me-2" />
              Le Tue Idee
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeMieOfferteCliente; 
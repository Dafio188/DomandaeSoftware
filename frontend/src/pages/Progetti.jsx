import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaProjectDiagram, 
  FaUser, 
  FaUserTie, 
  FaEuroSign, 
  FaCalendar,
  FaClock,
  FaCheckCircle,
  FaSpinner,
  FaPlay,
  FaPause,
  FaArchive,
  FaEye,
  FaSearch,
  FaFilter,
  FaSort,
  FaStar,
  FaExclamationTriangle,
  FaChartLine,
  FaRocket,
  FaTrophy,
  FaHandshake
} from 'react-icons/fa';

function Progetti() {
  const { user, token } = useAuth();
  const [progetti, setProgetti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statoFilter, setStatoFilter] = useState('');
  const [sortBy, setSortBy] = useState('data_creazione');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    if (token && user) {
      caricaProgetti();
    }
  }, [token, user]);

  const caricaProgetti = async () => {
    try {
      setLoading(true);
      
      // URL diversi in base al ruolo
      let url = '';
      if (user.is_cliente) {
        url = `/api/progetti/?cliente=${user.id}`;
      } else if (user.is_fornitore) {
        url = `/api/progetti/?fornitore=${user.id}`;
      } else {
        url = '/api/progetti/';
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProgetti(response.data.results || response.data || []);
      setError('');
    } catch (err) {
      console.error('Errore caricamento progetti:', err);
      setError('Errore nel caricamento dei progetti: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const getStatoColor = (stato) => {
    switch (stato) {
      case 'in_corso': return 'primary';
      case 'completato': return 'success';
      case 'sospeso': return 'warning';
      case 'annullato': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatoIcon = (stato) => {
    switch (stato) {
      case 'in_corso': return FaPlay;
      case 'completato': return FaCheckCircle;
      case 'sospeso': return FaPause;
      case 'annullato': return FaExclamationTriangle;
      default: return FaClock;
    }
  };

  const getStatoLabel = (stato) => {
    switch (stato) {
      case 'in_corso': return 'In Corso';
      case 'completato': return 'Completato';
      case 'sospeso': return 'Sospeso';
      case 'annullato': return 'Annullato';
      default: return stato;
    }
  };

  const progetti_filtrati = progetti.filter(progetto => {
    const matchSearch = progetto.richiesta?.titolo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       progetto.cliente_username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       progetto.fornitore_username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStato = !statoFilter || progetto.stato === statoFilter;
    return matchSearch && matchStato;
  }).sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'titolo':
        aValue = a.richiesta?.titolo || '';
        bValue = b.richiesta?.titolo || '';
        break;
      case 'data_creazione':
        aValue = new Date(a.data_inizio || a.data_creazione);
        bValue = new Date(b.data_inizio || b.data_creazione);
        break;
      case 'prezzo':
        aValue = parseFloat(a.offerta?.prezzo || 0);
        bValue = parseFloat(b.offerta?.prezzo || 0);
        break;
      default:
        aValue = a[sortBy];
        bValue = b[sortBy];
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const statistiche = {
    totali: progetti.length,
    in_corso: progetti.filter(p => p.stato === 'in_corso').length,
    completati: progetti.filter(p => p.stato === 'completato').length,
    valore_totale: progetti.reduce((sum, p) => sum + (parseFloat(p.offerta?.prezzo || 0)), 0)
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <FaSpinner className="fa-spin text-primary" size={48} />
          <h5 className="mt-3 text-muted">Caricamento progetti...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container">
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h2 mb-1">
              <FaProjectDiagram className="me-3 text-primary" />
              I Miei Progetti
            </h1>
            <p className="text-muted mb-0">
              {user.is_cliente ? 'Gestisci i tuoi progetti in corso e completati' : 'I progetti che stai sviluppando'}
            </p>
          </div>
          <Link to="/dashboard" className="btn btn-outline-primary">
            <FaRocket className="me-2" />
            Torna alla Dashboard
          </Link>
        </div>

        {/* Statistiche */}
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body">
                <FaProjectDiagram className="text-primary mb-2" size={32} />
                <h4 className="fw-bold mb-1">{statistiche.totali}</h4>
                <small className="text-muted">Progetti Totali</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body">
                <FaPlay className="text-warning mb-2" size={32} />
                <h4 className="fw-bold mb-1">{statistiche.in_corso}</h4>
                <small className="text-muted">In Corso</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body">
                <FaTrophy className="text-success mb-2" size={32} />
                <h4 className="fw-bold mb-1">{statistiche.completati}</h4>
                <small className="text-muted">Completati</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body">
                <FaEuroSign className="text-info mb-2" size={32} />
                <h4 className="fw-bold mb-1">€{statistiche.valore_totale.toLocaleString()}</h4>
                <small className="text-muted">Valore Totale</small>
              </div>
            </div>
          </div>
        </div>

        {/* Filtri */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-bold">
                  <FaSearch className="me-2 text-primary" />
                  Cerca Progetti
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cerca per titolo, cliente o fornitore..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-bold">
                  <FaFilter className="me-2 text-success" />
                  Stato
                </label>
                <select
                  className="form-select"
                  value={statoFilter}
                  onChange={(e) => setStatoFilter(e.target.value)}
                >
                  <option value="">Tutti gli stati</option>
                  <option value="in_corso">In Corso</option>
                  <option value="completato">Completati</option>
                  <option value="sospeso">Sospesi</option>
                  <option value="annullato">Annullati</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label fw-bold">
                  <FaSort className="me-2 text-info" />
                  Ordina per
                </label>
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="data_creazione">Data Creazione</option>
                  <option value="titolo">Titolo</option>
                  <option value="prezzo">Prezzo</option>
                  <option value="stato">Stato</option>
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label fw-bold">Ordine</label>
                <select
                  className="form-select"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="desc">Decrescente</option>
                  <option value="asc">Crescente</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Lista Progetti */}
        {error && (
          <div className="alert alert-danger border-0 shadow-sm">
            <FaExclamationTriangle className="me-2" />
            {error}
          </div>
        )}

        {progetti_filtrati.length > 0 ? (
          <div className="row g-4">
            {progetti_filtrati.map((progetto) => {
              const StatoIcon = getStatoIcon(progetto.stato);
              return (
                <div key={progetto.id} className="col-md-6 col-lg-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-white border-0 pb-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <span className={`badge bg-${getStatoColor(progetto.stato)} rounded-pill`}>
                          <StatoIcon className="me-1" size={12} />
                          {getStatoLabel(progetto.stato)}
                        </span>
                        <small className="text-muted">
                          <FaCalendar className="me-1" />
                          {new Date(progetto.data_inizio || progetto.data_creazione).toLocaleDateString('it-IT')}
                        </small>
                      </div>
                    </div>
                    
                    <div className="card-body">
                      <h5 className="card-title fw-bold text-truncate" title={progetto.richiesta?.titolo}>
                        {progetto.richiesta?.titolo || `Progetto #${progetto.id}`}
                      </h5>
                      
                      <div className="mb-3">
                        <div className="d-flex align-items-center mb-1">
                          <FaUser className="text-primary me-2" size={14} />
                          <small className="text-muted fw-bold">Cliente:</small>
                          <small className="ms-1">{progetto.cliente_username}</small>
                        </div>
                        <div className="d-flex align-items-center">
                          <FaUserTie className="text-success me-2" size={14} />
                          <small className="text-muted fw-bold">Fornitore:</small>
                          <small className="ms-1">{progetto.fornitore_username}</small>
                        </div>
                      </div>

                      {progetto.offerta?.prezzo && (
                        <div className="d-flex align-items-center mb-3">
                          <FaEuroSign className="text-warning me-2" />
                          <span className="fw-bold text-success">
                            €{parseFloat(progetto.offerta.prezzo).toLocaleString()}
                          </span>
                        </div>
                      )}

                      <p className="card-text text-muted small">
                        {progetto.richiesta?.descrizione?.substring(0, 100)}...
                      </p>
                    </div>
                    
                    <div className="card-footer bg-transparent border-0 pt-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <Link 
                          to={`/progetto/${progetto.id}`} 
                          className="btn btn-primary btn-sm rounded-pill"
                        >
                          <FaEye className="me-1" />
                          Visualizza
                        </Link>
                        {progetto.archiviato && (
                          <span className="badge bg-secondary rounded-pill">
                            <FaArchive className="me-1" size={10} />
                            Archiviato
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-5">
            <FaProjectDiagram size={64} className="text-muted mb-4" />
            <h4 className="text-muted mb-3">Nessun progetto trovato</h4>
            <p className="text-muted">
              {searchTerm || statoFilter 
                ? 'Prova a modificare i filtri di ricerca'
                : user.is_cliente 
                  ? 'Non hai ancora progetti. Crea una richiesta per iniziare!'
                  : 'Non hai ancora progetti assegnati. Cerca richieste a cui fare offerte!'
              }
            </p>
            {!searchTerm && !statoFilter && (
              <div className="mt-4">
                {user.is_cliente ? (
                  <Link to="/dashboard" className="btn btn-primary rounded-pill px-4">
                    <FaRocket className="me-2" />
                    Crea Nuova Richiesta
                  </Link>
                ) : (
                  <Link to="/richieste" className="btn btn-primary rounded-pill px-4">
                    <FaHandshake className="me-2" />
                    Cerca Progetti
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Progetti; 
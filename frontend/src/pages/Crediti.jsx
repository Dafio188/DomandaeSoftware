import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE } from '../config/api.js';
import { FaTicketAlt, FaEuroSign, FaPlus, FaFileUpload, FaCheckCircle, FaExclamationTriangle, FaClock, FaInfoCircle, FaFileAlt } from 'react-icons/fa';
import '../styles/MacStyle.css';

function Crediti() {
  const { user, token, refreshProfile } = useAuth();
  const [packages, setPackages] = useState([]);
  const [iban, setIban] = useState('');
  const [intestatario, setIntestatario] = useState('');
  const [banca, setBanca] = useState('');
  const [ricariche, setRicariche] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [files, setFiles] = useState({});

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const cfg = await axios.get(`${API_BASE}auth/crediti/pacchetti/`).then(r => r.data);
      setPackages(cfg.packages || []);
      setIban(cfg.iban || '');
      setIntestatario(cfg.intestatario || '');
      setBanca(cfg.banca || '');

      const list = await axios.get(`${API_BASE}auth/crediti/ricariche/`, { headers }).then(r => r.data || []);
      setRicariche(list);
    } catch (e) {
      setError(e?.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [token]);

  const createRicarica = async (crediti) => {
    setError('');
    setSuccess('');
    try {
      const r = await axios.post(`${API_BASE}auth/crediti/ricariche/`, { crediti }, { headers }).then(res => res.data);
      setSuccess(`Ricarica richiesta (#${r.id}). Effettua il bonifico e attendi conferma admin.`);
      await load();
      if (refreshProfile) refreshProfile().catch(() => {});
    } catch (e) {
      setError(e?.response?.data?.detail || e.message);
    }
  };

  const uploadRicevuta = async (ricaricaId) => {
    setError('');
    setSuccess('');
    const file = files[ricaricaId];
    if (!file) {
      setError('Seleziona un file prima di caricare la ricevuta.');
      return;
    }
    try {
      const form = new FormData();
      form.append('file', file);
      await axios.post(`${API_BASE}auth/crediti/ricariche/${ricaricaId}/ricevuta/`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles((prev) => ({ ...prev, [ricaricaId]: undefined }));
      setSuccess('Ricevuta caricata. Attendi conferma admin.');
      await load();
    } catch (e) {
      setError(e?.response?.data?.detail || e.message);
    }
  };

  const isFornitore = user?.ruolo === 'fornitore';

  return (
    <div className="mac-page-wrapper pt-5">
      <div className="container py-5">
        <div className="row align-items-center mb-5">
          <div className="col-lg-8">
            <div className="d-flex align-items-center mb-3">
              <div className="bg-primary bg-opacity-10 p-3 rounded-4 me-3">
                <FaTicketAlt className="text-primary" size={32} />
              </div>
              <span className="mac-badge bg-primary text-white">GESTIONE CREDITI</span>
            </div>
            <h1 className="display-4 mac-title mb-2">I Tuoi Crediti</h1>
            <p className="lead mac-subtitle opacity-90">
              Gestisci il tuo saldo per inviare offerte ai clienti. 
              Ogni offerta ha un costo simbolico per garantire la qualità delle proposte.
            </p>
          </div>
          <div className="col-lg-4 text-center">
            <div className="mac-glass-card p-4">
              <div className="h1 mac-title text-primary mb-1">{user?.crediti ?? 0}</div>
              <p className="mac-subtitle mb-0 small text-uppercase fw-bold">Saldo Attuale</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger border-0 rounded-4 mb-4 bg-danger bg-opacity-10 text-danger d-flex align-items-center">
            <FaExclamationTriangle className="me-3" />
            <strong>{error}</strong>
          </div>
        )}
        {success && (
          <div className="alert alert-success border-0 rounded-4 mb-4 bg-success bg-opacity-10 text-success d-flex align-items-center">
            <FaCheckCircle className="me-3" />
            <strong>{success}</strong>
          </div>
        )}

        {!isFornitore ? (
          <div className="mac-glass-card p-5 text-center">
            <FaInfoCircle size={48} className="text-warning opacity-50 mb-4" />
            <h4 className="mac-title mb-3">Sezione Riservata ai Fornitori</h4>
            <p className="mac-subtitle mb-0">
              I crediti sono necessari per i fornitori che desiderano inviare offerte per le richieste pubblicate. 
              Se sei un cliente, non hai bisogno di acquistare crediti.
            </p>
          </div>
        ) : (
          <>
            {/* Pacchetti Crediti */}
            <div className="row mb-5">
              <div className="col-12">
                <h3 className="mac-title mb-4 px-2">Acquista Pacchetti</h3>
                <div className="row g-4">
                  {packages.length === 0 ? (
                    <div className="col-12">
                      <div className="mac-glass-card p-4 text-center">
                        <p className="mac-subtitle mb-0">Nessun pacchetto configurato al momento.</p>
                      </div>
                    </div>
                  ) : (
                    packages.map((p) => (
                      <div key={p.crediti} className="col-md-4">
                        <div className="mac-glass-card p-4 h-100 d-flex flex-column text-center">
                          <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3 mx-auto">
                            <FaTicketAlt className="text-primary" size={24} />
                          </div>
                          <h4 className="mac-title mb-1">{p.crediti} Crediti</h4>
                          <div className="h2 text-success fw-bold mb-4">{Number(p.prezzo).toFixed(2)}€</div>
                          <button 
                            className="btn btn-primary rounded-pill px-4 py-2 mt-auto fw-bold" 
                            onClick={() => createRicarica(p.crediti)} 
                            disabled={loading}
                          >
                            <FaPlus className="me-2" />
                            Richiedi Ricarica
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Info Pagamento */}
            <h3 className="mac-title mb-4 px-2">Istruzioni per il Pagamento</h3>
            <div className="row g-4 mb-5">
              
              {/* Opzione 1: Bonifico Banco */}
              <div className="col-md-6">
                <div className="mac-glass-card p-4 h-100 border-info border-opacity-10 position-relative">
                  <div className="position-absolute top-0 end-0 mt-3 me-3">
                    <span className="badge bg-secondary">Opzione 1</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-info bg-opacity-10 p-3 rounded-4 me-3">
                      <FaInfoCircle className="text-info" size={24} />
                    </div>
                    <h5 className="mac-title mb-0">Bonifico Bancario</h5>
                  </div>
                  <p className="mac-subtitle small mb-3">
                    Effettua il bonifico inserendo la <strong>causale automatica</strong> per il riconoscimento rapido.
                  </p>
                  <div className="p-3 bg-white bg-opacity-50 rounded-4 border">
                    <div className="row g-3">
                      <div className="col-12">
                        <small className="mac-subtitle d-block x-small fw-bold">IBAN</small>
                        <strong className="text-dark small font-monospace">{iban || 'non configurato'}</strong>
                      </div>
                      <div className="col-12">
                        <small className="mac-subtitle d-block x-small fw-bold">INTESTATARIO</small>
                        <strong className="text-dark small">{intestatario || 'SoftMatch'}</strong>
                      </div>
                      {banca && (
                        <div className="col-12">
                          <small className="mac-subtitle d-block x-small fw-bold">BANCA</small>
                          <strong className="text-dark small">{banca}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Opzione 2: PayPal */}
              <div className="col-md-6">
                <div className="mac-glass-card p-4 h-100 border-primary border-opacity-10 position-relative" style={{background: 'linear-gradient(to right bottom, #ffffff, #f1f8ff)'}}>
                  <div className="position-absolute top-0 end-0 mt-3 me-3">
                    <span className="badge bg-primary">Opzione 2 (Veloce)</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <div className="p-3 rounded-4 me-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#003087', color: 'white' }}>
                       <span style={{fontWeight: '900', fontSize:'16px', letterSpacing:'-1px'}}><i>P</i></span>
                    </div>
                    <h5 className="mac-title mb-0" style={{color: '#003087'}}>PayPal</h5>
                  </div>
                  <p className="mac-subtitle small mb-3">
                    Paga comodamente tramite PayPal usando il nostro indirizzo ufficiale. Inserisci la causale generata.
                  </p>
                  <div className="p-3 bg-white rounded-4 border border-primary border-opacity-25 shadow-sm text-center">
                    <small className="mac-subtitle d-block x-small fw-bold text-uppercase mb-1">INVIA PAGAMENTO A</small>
                    <a href="https://paypal.me/fiodavidelink" target="_blank" rel="noreferrer" className="text-decoration-none">
                      <strong className="text-primary fs-5">fio.davide@gmail.com</strong>
                    </a>
                  </div>
                  <p className="text-center x-small mt-3 mb-0 text-muted">
                    Carica lo screenshot della ricevuta per farti attivare i crediti all'istante
                  </p>
                </div>
              </div>

            </div>

            {/* Storico Ricariche */}
            <div className="col-12">
              <h3 className="mac-title mb-4 px-2">Le Tue Ricariche</h3>
              <div className="mac-glass-card overflow-hidden border-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0 align-middle">
                    <thead className="bg-primary bg-opacity-5">
                      <tr>
                        <th className="px-4 py-3 border-0 mac-subtitle x-small fw-bold">ID</th>
                        <th className="py-3 border-0 mac-subtitle x-small fw-bold">CREDITI</th>
                        <th className="py-3 border-0 mac-subtitle x-small fw-bold">PREZZO</th>
                        <th className="py-3 border-0 mac-subtitle x-small fw-bold">STATO</th>
                        <th className="py-3 border-0 mac-subtitle x-small fw-bold">CAUSALE</th>
                        <th className="px-4 py-3 border-0 mac-subtitle x-small fw-bold text-end">AZIONE / RICEVUTA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ricariche.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-5">
                            <FaFileAlt size={32} className="text-muted opacity-30 mb-3" />
                            <p className="mac-subtitle mb-0">Nessuna ricarica registrata.</p>
                          </td>
                        </tr>
                      ) : (
                        ricariche.map((r) => (
                          <tr key={r.id}>
                            <td className="px-4 py-3 border-0 fw-bold text-primary">#{r.id}</td>
                            <td className="py-3 border-0 fw-bold">{r.crediti}</td>
                            <td className="py-3 border-0">{Number(r.prezzo).toFixed(2)}€</td>
                            <td className="py-3 border-0">
                              <span className={`mac-badge ${
                                r.stato === 'confermata' ? 'bg-success text-white' :
                                r.stato === 'annullata' ? 'bg-danger text-white' : 'bg-warning text-dark'
                              }`}>
                                {r.stato === 'confermata' ? '✅ Confermata' :
                                 r.stato === 'annullata' ? '❌ Annullata' : '⏳ In Attesa'}
                              </span>
                            </td>
                            <td className="py-3 border-0 x-small font-monospace">{r.causale}</td>
                            <td className="px-4 py-3 border-0 text-end">
                              {r.ricevuta_url ? (
                                <a 
                                  href={r.ricevuta_url} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="btn btn-light btn-sm rounded-pill px-3 shadow-sm"
                                >
                                  <FaFileAlt className="me-1" /> Apri
                                </a>
                              ) : r.stato === 'in_attesa' ? (
                                <div className="d-flex gap-2 justify-content-end align-items-center">
                                  <div className="position-relative">
                                    <input
                                      type="file"
                                      id={`file-${r.id}`}
                                      className="d-none"
                                      accept=".pdf,image/*"
                                      onChange={(e) => setFiles((prev) => ({ ...prev, [r.id]: e.target.files?.[0] }))}
                                    />
                                    <label 
                                      htmlFor={`file-${r.id}`} 
                                      className={`btn btn-sm rounded-pill px-3 mb-0 ${files[r.id] ? 'btn-info text-white' : 'btn-outline-primary'}`}
                                      style={{ cursor: 'pointer' }}
                                    >
                                      {files[r.id] ? '📎 Pronto' : 'Seleziona'}
                                    </label>
                                  </div>
                                  <button 
                                    className="btn btn-primary btn-sm rounded-pill px-3" 
                                    onClick={() => uploadRicevuta(r.id)} 
                                    disabled={loading || !files[r.id]}
                                  >
                                    <FaFileUpload className="me-1" /> Carica
                                  </button>
                                </div>
                              ) : (
                                <span className="text-muted">—</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Crediti;

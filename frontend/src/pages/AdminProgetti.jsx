import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE } from '../config/api.js';
import { FaCheckCircle, FaExternalLinkAlt, FaFileCsv } from 'react-icons/fa';

function AdminProgetti() {
  const { token } = useAuth();
  const [progetti, setProgetti] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagamentiConfig, setPagamentiConfig] = useState(null);
  const [files, setFiles] = useState({});

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE}progetti/`, { headers });
      setProgetti(res.data || []);
    } catch (e) {
      setProgetti([]);
      setError(e?.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [token]);

  useEffect(() => {
    axios.get('/api/pagamenti/config/').then((res) => setPagamentiConfig(res.data)).catch(() => setPagamentiConfig(null));
  }, []);

  const spuntaFase = async (id, fase) => {
    try {
      await axios.post(`${API_BASE}progetti/${id}/spunta-fase/`, { fase }, { headers });
      await load();
    } catch (e) {
      setError(e?.response?.data?.detail || e.message);
    }
  };

  const uploadBonificoRicevuta = async (id) => {
    setError('');
    const file = files[id];
    if (!file) {
      setError('Seleziona un file prima di caricare la ricevuta.');
      return;
    }
    try {
      const form = new FormData();
      form.append('file', file);
      await axios.post(`${API_BASE}progetti/${id}/bonifico-ricevuta/`, form, { headers });
      setFiles((prev) => ({ ...prev, [id]: undefined }));
      await load();
    } catch (e) {
      setError(e?.response?.data?.detail || e.message);
    }
  };

  const inAttesaBonificoCliente = progetti.filter(p => p.bozza_cliente_ok && !p.pagamento_cliente_ok);
  const inVerificaAdmin = progetti.filter(p => p.pagamento_cliente_ok && !p.pagamento_admin_ok);
  const daBonificareFornitore = progetti.filter(p => p.pagamento_cliente_ok && p.pagamento_admin_ok && p.stato === 'completato' && !p.bonifico_admin_ok);
  const inAttesaConfermaFornitore = progetti.filter(p => p.pagamento_cliente_ok && p.pagamento_admin_ok && p.stato === 'completato' && p.bonifico_admin_ok && !p.bonifico_fornitore_ok);
  const contestazioni = progetti.filter(p => p.stato === 'in_contestazione');

  const exportBonificiCsv = () => {
    const sep = ';';
    const esc = (value) => {
      const s = value === null || value === undefined ? '' : String(value);
      const needsQuotes = s.includes('"') || s.includes('\n') || s.includes('\r') || s.includes(sep);
      const out = s.replaceAll('"', '""');
      return needsQuotes ? `"${out}"` : out;
    };

    const rows = [
      [
        'progetto_id',
        'richiesta',
        'fornitore',
        'iban',
        'intestatario',
        'importo_eur',
        'causale',
      ],
      ...daBonificareFornitore
        .slice()
        .sort((a, b) => Number(a.id) - Number(b.id))
        .map((p) => {
          const causale = `SoftMatch Payout Progetto #${p.id} - ${p.fornitore_username}`;
          return [
            p.id,
            p.richiesta_titolo,
            p.fornitore_username,
            p.fornitore_iban || '',
            p.fornitore_iban_intestatario || '',
            p.importo_atteso_fornitore ?? '',
            causale,
          ];
        }),
    ];

    const csv = '\uFEFF' + rows.map((r) => r.map(esc).join(sep)).join('\r\n') + '\r\n';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `bonifici_fornitori_${date}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="mb-1">Gestione Progetti</h2>
          <div className="text-muted">Supervisione fasi e conferme pagamento</div>
        </div>
        <button className="btn btn-primary" onClick={load} disabled={loading}>Aggiorna</button>
      </div>

      {error && (
        <div className="alert alert-danger border-0 rounded-4">{error}</div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-lg rounded-4 h-100">
            <div className="card-body p-4">
              <div className="text-muted small">In attesa bonifico cliente</div>
              <div className="h3 fw-bold mb-0">{inAttesaBonificoCliente.length}</div>
              <div className="text-muted small mt-2">Coordinate SoftMatch: {pagamentiConfig?.iban || 'non configurato'}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-lg rounded-4 h-100">
            <div className="card-body p-4">
              <div className="text-muted small">Pagamento in verifica admin</div>
              <div className="h3 fw-bold mb-0">{inVerificaAdmin.length}</div>
              <div className="text-muted small mt-2">Spuntare pagamento_admin solo dopo accredito</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-lg rounded-4 h-100">
            <div className="card-body p-4">
              <div className="text-muted small">Da bonificare al fornitore</div>
              <div className="h3 fw-bold mb-0">{daBonificareFornitore.length}</div>
              <div className="text-muted small mt-2">Richiede IBAN fornitore + importo</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-lg rounded-4 h-100">
            <div className="card-body p-4">
              <div className="text-muted small">Contestazioni aperte</div>
              <div className="h3 fw-bold mb-0">{contestazioni.length}</div>
              <div className="text-muted small mt-2">Mediazione richiesta</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-lg rounded-4 mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">Attesa bonifico cliente</h5>
          <div className="table-responsive">
            <table className="table mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Progetto</th>
                  <th>Cliente</th>
                  <th>Importo</th>
                  <th>IBAN SoftMatch</th>
                </tr>
              </thead>
              <tbody>
                {inAttesaBonificoCliente.length === 0 ? (
                  <tr><td colSpan="5" className="py-3 text-muted">Nessuna attività in attesa.</td></tr>
                ) : inAttesaBonificoCliente.map(p => (
                  <tr key={p.id}>
                    <td className="fw-semibold">#{p.id}</td>
                    <td>{p.richiesta_titolo}</td>
                    <td>{p.cliente_username}</td>
                    <td className="fw-semibold">{p.importo_atteso_cliente ?? '-'}€</td>
                    <td>{pagamentiConfig?.iban || 'non configurato'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-lg rounded-4 mb-4">
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <h5 className="fw-bold mb-0">Da bonificare al fornitore (post consegna e pagamento)</h5>
            <button className="btn btn-outline-primary" onClick={exportBonificiCsv} disabled={daBonificareFornitore.length === 0}>
              <FaFileCsv className="me-2" />
              Export CSV
            </button>
          </div>
          <div className="table-responsive">
            <table className="table mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Progetto</th>
                  <th>Fornitore</th>
                  <th>IBAN</th>
                  <th>Importo</th>
                  <th>Margine</th>
                  <th>Ricevuta</th>
                  <th className="text-end">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {daBonificareFornitore.length === 0 ? (
                  <tr><td colSpan="8" className="py-3 text-muted">Nessuna attività in attesa.</td></tr>
                ) : daBonificareFornitore.map(p => (
                  <tr key={p.id}>
                    <td className="fw-semibold">#{p.id}</td>
                    <td>{p.richiesta_titolo}</td>
                    <td>{p.fornitore_username}</td>
                    <td>
                      <div className="fw-semibold">{p.fornitore_iban || '—'}</div>
                      <div className="text-muted small">{p.fornitore_iban_intestatario || ''}</div>
                    </td>
                    <td className="fw-semibold">{p.importo_atteso_fornitore ?? '-'}€</td>
                    <td className="fw-semibold">{p.margine_piattaforma_atteso ?? '-'}€</td>
                    <td>
                      {p.bonifico_fornitore_ricevuta ? (
                        <a href={p.bonifico_fornitore_ricevuta} target="_blank" rel="noreferrer">Apri</a>
                      ) : (
                        <div className="d-flex gap-2 flex-wrap">
                          <input
                            type="file"
                            className="form-control form-control-sm"
                            accept=".pdf,image/*"
                            onChange={(e) => setFiles((prev) => ({ ...prev, [p.id]: e.target.files?.[0] }))}
                          />
                          <button className="btn btn-sm btn-outline-primary" onClick={() => uploadBonificoRicevuta(p.id)} disabled={loading}>
                            Carica
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-success" onClick={() => spuntaFase(p.id, 'bonifico_admin')}>
                        <FaCheckCircle className="me-1" />
                        Bonifico inviato
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-muted small mt-3">
            Carica la ricevuta e spunta “Bonifico inviato”. Il fornitore confermerà la ricezione dal progetto.
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-lg rounded-4 mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">Bonifico inviato, in attesa conferma fornitore</h5>
          <div className="table-responsive">
            <table className="table mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Progetto</th>
                  <th>Fornitore</th>
                  <th>Importo</th>
                  <th>Ricevuta</th>
                </tr>
              </thead>
              <tbody>
                {inAttesaConfermaFornitore.length === 0 ? (
                  <tr><td colSpan="5" className="py-3 text-muted">Nessuna attività in attesa.</td></tr>
                ) : inAttesaConfermaFornitore.map(p => (
                  <tr key={p.id}>
                    <td className="fw-semibold">#{p.id}</td>
                    <td>{p.richiesta_titolo}</td>
                    <td>{p.fornitore_username}</td>
                    <td className="fw-semibold">{p.importo_atteso_fornitore ?? '-'}€</td>
                    <td>{p.bonifico_fornitore_ricevuta ? <a href={p.bonifico_fornitore_ricevuta} target="_blank" rel="noreferrer">Apri</a> : <span className="text-muted">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-lg rounded-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">ID</th>
                  <th>Richiesta</th>
                  <th>Cliente</th>
                  <th>Fornitore</th>
                  <th>Stato</th>
                  <th>Pagamenti</th>
                  <th className="text-end pe-4">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className="ps-4 py-4" colSpan="7">Caricamento…</td></tr>
                ) : progetti.length === 0 ? (
                  <tr><td className="ps-4 py-4" colSpan="7">Nessun progetto trovato.</td></tr>
                ) : (
                  progetti.map((p) => (
                    <tr key={p.id}>
                      <td className="ps-4 fw-semibold">#{p.id}</td>
                      <td className="fw-semibold">{p.richiesta_titolo}</td>
                      <td>{p.cliente_username}</td>
                      <td>{p.fornitore_username}</td>
                      <td>{p.stato}</td>
                      <td>
                        <div className="d-flex flex-wrap gap-2">
                          <span className={`badge rounded-pill ${p.pagamento_cliente_ok ? 'bg-success' : 'bg-secondary'}`}>cliente</span>
                          <span className={`badge rounded-pill ${p.pagamento_admin_ok ? 'bg-success' : 'bg-secondary'}`}>admin</span>
                        </div>
                      </td>
                      <td className="text-end pe-4">
                        <div className="d-flex justify-content-end gap-2 flex-wrap">
                          {!p.pagamento_admin_ok && (
                            <button className="btn btn-sm btn-outline-success" onClick={() => spuntaFase(p.id, 'pagamento_admin')}>
                              <FaCheckCircle className="me-1" />
                              Conferma pagamento
                            </button>
                          )}
                          <Link className="btn btn-sm btn-outline-primary" to={`/progetto/${p.id}`}>
                            <FaExternalLinkAlt className="me-1" />
                            Apri
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProgetti;

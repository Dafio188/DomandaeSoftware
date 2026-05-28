import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE } from '../config/api.js';
import { FaPlus, FaMinus, FaSearch, FaTrash, FaKey, FaBan } from 'react-icons/fa';
function AdminUtenti() {
  const { token } = useAuth();
  const [utenti, setUtenti] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE}auth/users/`, { headers, params: q ? { q } : {} });
      setUtenti(res.data || []);
    } catch (e) {
      setUtenti([]);
      setError(e?.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [token]);

  const addCrediti = async (userId, delta) => {
    try {
      await axios.post(`${API_BASE}auth/users/${userId}/crediti/add/`, { delta }, { headers });
      await load();
    } catch (e) {
      setError(e?.response?.data?.detail || e.message);
    }
  };

  const suspendUser = async (userId) => {
    if (!window.confirm('Sei sicuro di voler sospendere/eliminare questo utente? Non potrà più accedere.')) return;
    try {
      await axios.delete(`${API_BASE}auth/users/${userId}/`, { headers });
      await load();
    } catch (e) {
      setError(e?.response?.data?.detail || e.message);
    }
  };

  const resetUserPassword = async (userId) => {
    const pwd = window.prompt("Inserisci la NUOVA PASSWORD per questo utente (min. 8 caratteri):");
    if (!pwd) return;
    if (pwd.length < 8) {
      alert("La password deve avere almeno 8 caratteri.");
      return;
    }
    
    try {
      await axios.patch(`${API_BASE}auth/users/${userId}/`, { password: pwd }, { headers });
      alert("Password modificata con successo.");
    } catch (e) {
      setError(e?.response?.data?.detail || e.message);
    }
  };

  const confirmRicarica = async (ricaricaId) => {
    try {
      await axios.post(`${API_BASE}auth/crediti/ricariche/${ricaricaId}/conferma/`, {}, { headers });
      await load();
    } catch (e) {
      setError(e?.response?.data?.detail || e.message);
    }
  };

  const loadRicariche = async () => {
    try {
      const res = await axios.get(`${API_BASE}auth/crediti/ricariche/`, { headers });
      return res.data || [];
    } catch {
      return [];
    }
  };

  const [ricariche, setRicariche] = useState([]);

  useEffect(() => {
    if (!token) return;
    loadRicariche().then(setRicariche);
    // eslint-disable-next-line
  }, [token]);

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="mb-1">Gestione Utenti</h2>
          <div className="text-muted">Ruoli, stato e crediti ticket</div>
        </div>

        <div className="input-group" style={{ maxWidth: 420 }}>
          <span className="input-group-text">
            <FaSearch />
          </span>
          <input
            className="form-control"
            placeholder="Cerca username o email"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="btn btn-primary" onClick={load} disabled={loading}>
            Cerca
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger border-0 rounded-4">{error}</div>
      )}

      <div className="card border-0 shadow-lg rounded-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Username</th>
                  <th>Email</th>
                  <th>Ruolo</th>
                  <th>Stato</th>
                  <th>Crediti</th>
                  <th className="text-end pe-4">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="ps-4 py-4" colSpan="6">Caricamento…</td>
                  </tr>
                ) : utenti.length === 0 ? (
                  <tr>
                    <td className="ps-4 py-4" colSpan="6">Nessun utente trovato.</td>
                  </tr>
                ) : (
                  utenti.map((u) => (
                    <tr key={u.id}>
                      <td className="ps-4 fw-semibold">{u.username}</td>
                      <td>{u.email}</td>
                      <td>{u.ruolo}</td>
                      <td>{u.stato}</td>
                      <td className="fw-semibold">{u.crediti ?? 0}</td>
                      <td className="text-end pe-4">
                        <div className="btn-group me-2">
                          <button title="Aggiungi 10 crediti" className="btn btn-sm btn-outline-success" onClick={() => addCrediti(u.id, 10)}>
                            <FaPlus className="me-1" />10
                          </button>
                          <button title="Sottrai 10 crediti" className="btn btn-sm btn-outline-danger" onClick={() => addCrediti(u.id, -10)}>
                            <FaMinus className="me-1" />10
                          </button>
                        </div>
                        <div className="btn-group">
                          <button title="Cambia Password" className="btn btn-sm btn-outline-secondary" onClick={() => resetUserPassword(u.id)}>
                            <FaKey />
                          </button>
                          {u.is_active !== false && (
                            <button title="Sospendi Utente" className="btn btn-sm btn-outline-danger" onClick={() => suspendUser(u.id)}>
                              <FaTrash />
                            </button>
                          )}
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

      <div className="card border-0 shadow-lg rounded-4 mt-4">
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <h5 className="fw-bold mb-0">Ricariche crediti (in attesa)</h5>
            <button className="btn btn-outline-primary" onClick={() => loadRicariche().then(setRicariche)}>Aggiorna</button>
          </div>
          <div className="table-responsive">
            <table className="table mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Utente</th>
                  <th>Crediti</th>
                  <th>Prezzo</th>
                  <th>Stato</th>
                  <th>Causale</th>
                  <th>Ricevuta</th>
                  <th className="text-end">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {ricariche.filter(r => r.stato === 'in_attesa').length === 0 ? (
                  <tr><td colSpan="8" className="text-muted py-3">Nessuna ricarica in attesa.</td></tr>
                ) : (
                  ricariche.filter(r => r.stato === 'in_attesa').map((r) => (
                    <tr key={r.id}>
                      <td className="fw-semibold">#{r.id}</td>
                      <td className="fw-semibold">{r.username}</td>
                      <td>{r.crediti}</td>
                      <td>{Number(r.prezzo).toFixed(2)}€</td>
                      <td>{r.stato}</td>
                      <td className="text-muted">{r.causale}</td>
                      <td>
                        {r.ricevuta_url ? (
                          <a href={r.ricevuta_url} target="_blank" rel="noreferrer">Apri</a>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-success" onClick={() => confirmRicarica(r.id)}>
                          Conferma
                        </button>
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

export default AdminUtenti;

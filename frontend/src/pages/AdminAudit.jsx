import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE } from '../config/api.js';

function AdminAudit() {
  const { token } = useAuth();
  const [action, setAction] = useState('');
  const [progetto, setProgetto] = useState('');
  const [actor, setActor] = useState('');
  const [limit, setLimit] = useState(200);
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const params = {
        limit: Math.min(Math.max(Number(limit) || 200, 1), 500),
      };
      if (action) params.action = action;
      if (progetto) params.progetto = progetto;
      if (actor) params.actor = actor;
      const res = await axios.get(`${API_BASE}audit/`, { headers, params });
      setRows(res.data?.results || []);
      setCount(res.data?.count || 0);
    } catch (e) {
      setRows([]);
      setCount(0);
      setError(e?.response?.data?.detail || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [token]);

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="mb-1">Audit</h2>
          <div className="text-muted">Log eventi operativi (azioni, attori, progetti)</div>
        </div>
        <button className="btn btn-primary" onClick={load} disabled={loading}>Aggiorna</button>
      </div>

      <div className="card border-0 shadow-lg rounded-4 mb-4">
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-bold">Action</label>
              <input className="form-control" value={action} onChange={(e) => setAction(e.target.value)} placeholder="es: offerta.created" />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">Progetto ID</label>
              <input className="form-control" value={progetto} onChange={(e) => setProgetto(e.target.value)} placeholder="es: 12" />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-bold">Actor ID</label>
              <input className="form-control" value={actor} onChange={(e) => setActor(e.target.value)} placeholder="es: 5" />
            </div>
            <div className="col-md-2">
              <label className="form-label fw-bold">Limit</label>
              <input className="form-control" type="number" min="1" max="500" value={limit} onChange={(e) => setLimit(e.target.value)} />
            </div>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <button className="btn btn-outline-primary" onClick={load} disabled={loading}>Filtra</button>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger border-0 rounded-4">{error}</div>}

      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="text-muted small">Totale eventi: {count}</div>
      </div>

      <div className="card border-0 shadow-lg rounded-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">ID</th>
                  <th>Quando</th>
                  <th>Azione</th>
                  <th>Actor</th>
                  <th>Progetto</th>
                  <th>Target</th>
                  <th>IP</th>
                  <th className="pe-4">Meta</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className="ps-4 py-4" colSpan="8">Caricamento…</td></tr>
                ) : rows.length === 0 ? (
                  <tr><td className="ps-4 py-4" colSpan="8">Nessun evento.</td></tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id}>
                      <td className="ps-4 fw-semibold">#{r.id}</td>
                      <td className="text-muted">{r.created_at}</td>
                      <td className="fw-semibold">{r.action}</td>
                      <td>{r.actor_username ? `${r.actor_username} (#${r.actor_id})` : (r.actor_id ? `#${r.actor_id}` : '—')}</td>
                      <td>{r.progetto_id ? `#${r.progetto_id}` : '—'}</td>
                      <td className="text-muted">{r.target_model}{r.target_id ? `#${r.target_id}` : ''}</td>
                      <td className="text-muted">{r.ip_address || '—'}</td>
                      <td className="pe-4">
                        <pre className="mb-0" style={{ maxWidth: 520, whiteSpace: 'pre-wrap' }}>
                          {JSON.stringify(r.meta || {}, null, 2)}
                        </pre>
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

export default AdminAudit;


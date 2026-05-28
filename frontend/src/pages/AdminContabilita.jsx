import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE } from '../config/api.js';

function Row({ label, value }) {
  return (
    <div className="d-flex align-items-center justify-content-between py-2 border-bottom">
      <div className="text-muted">{label}</div>
      <div className="fw-bold">{value}</div>
    </div>
  );
}

function AdminContabilita() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const load = async () => {
    if (!token) return;
    setError('');
    try {
      const res = await axios.get(`${API_BASE}transazioni/contabilita/`, { headers });
      setData(res.data);
    } catch (e) {
      setData(null);
      setError(e?.response?.data?.detail || e.message);
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
          <h2 className="mb-1">Contabilità</h2>
          <div className="text-muted">Totali transazioni e margine piattaforma</div>
        </div>
        <button className="btn btn-primary" onClick={load}>Aggiorna</button>
      </div>

      {error && <div className="alert alert-danger border-0 rounded-4">{error}</div>}

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card border-0 shadow-lg rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Totali</h5>
              <Row label="Transazioni" value={data?.totali?.transazioni ?? 0} />
              <Row label="Incassato cliente (totale)" value={`${(data?.totali?.importo_totale ?? 0).toFixed(2)}€`} />
              <Row label="Da bonificare fornitore (totale)" value={`${(data?.totali?.importo_fornitore ?? 0).toFixed(2)}€`} />
              <Row label="Margine piattaforma (totale)" value={`${(data?.totali?.commissione_totale ?? 0).toFixed(2)}€`} />
            </div>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="card border-0 shadow-lg rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Per stato</h5>
              <div className="table-responsive">
                <table className="table mb-0">
                  <thead>
                    <tr>
                      <th>Stato</th>
                      <th>Count</th>
                      <th>Totale</th>
                      <th>Margine</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.per_stato || []).length === 0 ? (
                      <tr><td colSpan="4" className="text-muted py-3">Nessun dato.</td></tr>
                    ) : (
                      data.per_stato.map((r) => (
                        <tr key={r.stato}>
                          <td className="fw-semibold">{r.stato}</td>
                          <td>{r.count}</td>
                          <td>{Number(r.importo_totale ?? 0).toFixed(2)}€</td>
                          <td>{Number(r.commissione_totale ?? 0).toFixed(2)}€</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="text-muted small mt-3">
                Il margine è calcolato come somma di commissione_cliente + commissione_fornitore (fee mode configurabile).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminContabilita;


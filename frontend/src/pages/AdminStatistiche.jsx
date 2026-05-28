import { createElement, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE } from '../config/api.js';
import { FaUsers, FaClipboardList, FaHandshake, FaProjectDiagram } from 'react-icons/fa';

function StatCard({ icon, label, value }) {
  return (
    <div className="col-md-3">
      <div className="card border-0 shadow-lg rounded-4 h-100">
        <div className="card-body p-4 d-flex align-items-center">
          <div className="me-3 text-primary">
            {createElement(icon, { size: 28 })}
          </div>
          <div>
            <div className="text-muted small">{label}</div>
            <div className="h4 mb-0 fw-bold">{value}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminStatistiche() {
  const { token } = useAuth();
  const [stats, setStats] = useState({ utenti: 0, richieste: 0, offerte: 0, progetti: 0 });
  const [error, setError] = useState('');

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const load = async () => {
    if (!token) return;
    setError('');
    try {
      const [utenti, richieste, offerte, progetti] = await Promise.all([
        axios.get(`${API_BASE}auth/users/`, { headers }).then(r => r.data || []),
        axios.get(`${API_BASE}richieste/`, { headers }).then(r => r.data || []),
        axios.get(`${API_BASE}offerte/`, { headers }).then(r => r.data || []),
        axios.get(`${API_BASE}progetti/`, { headers }).then(r => r.data || []),
      ]);
      setStats({
        utenti: utenti.length,
        richieste: richieste.length,
        offerte: offerte.length,
        progetti: progetti.length,
      });
    } catch (e) {
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
          <h2 className="mb-1">Statistiche</h2>
          <div className="text-muted">Panoramica rapida per supervisione</div>
        </div>
        <button className="btn btn-primary" onClick={load}>Aggiorna</button>
      </div>

      {error && <div className="alert alert-danger border-0 rounded-4">{error}</div>}

      <div className="row g-4">
        <StatCard icon={FaUsers} label="Utenti" value={stats.utenti} />
        <StatCard icon={FaClipboardList} label="Richieste" value={stats.richieste} />
        <StatCard icon={FaHandshake} label="Offerte" value={stats.offerte} />
        <StatCard icon={FaProjectDiagram} label="Progetti" value={stats.progetti} />
      </div>
    </div>
  );
}

export default AdminStatistiche;

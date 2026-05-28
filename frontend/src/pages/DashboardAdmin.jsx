import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getUtentiAdmin, getAllRichieste, getAllOfferte } from '../services/api';
import { Link } from 'react-router-dom';
import { FaUser, FaProjectDiagram, FaChartLine, FaShieldAlt, FaCog, FaHistory, FaCheckCircle, FaClock, FaUsers, FaLightbulb, FaEuroSign, FaArrowRight } from 'react-icons/fa';
import '../styles/MacStyle.css';

function DashboardAdmin() {
  const { user, token } = useAuth();
  const [utenti, setUtenti] = useState([]);
  const [richieste, setRichieste] = useState([]);
  const [offerte, setOfferte] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setLoading(true);
      Promise.all([
        getUtentiAdmin(token).then(setUtenti).catch(() => setUtenti([])),
        getAllRichieste(token).then(setRichieste).catch(() => setRichieste([])),
        getAllOfferte(token).then(setOfferte).catch(() => setOfferte([]))
      ]).finally(() => setLoading(false));
    }
  }, [token]);

  const stats = [
    { label: 'Utenti Totali', value: utenti.length, icon: <FaUsers />, color: '#0071e3' },
    { label: 'Richieste Attive', value: richieste.filter(r => r.stato === 'aperta').length, icon: <FaLightbulb />, color: '#ff9500' },
    { label: 'Offerte Totali', value: offerte.length, icon: <FaEuroSign />, color: '#34c759' },
    { label: 'Progetti in Corso', value: richieste.filter(r => r.stato === 'assegnato').length, icon: <FaProjectDiagram />, color: '#af52de' }
  ];

  if (loading) {
    return (
      <div className="mac-page-wrapper d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      {/* Header Section */}
        <header className="mb-5 animate__animated animate__fadeIn">
          <h1 className="mac-title display-4 mb-2">Dashboard Admin</h1>
          <p className="mac-subtitle lead mb-4">Benvenuto nel centro di controllo, {user?.username}.</p>
          
          <div className="row g-4">
            {stats.map((stat, index) => (
              <div key={index} className="col-md-3">
                <div className="mac-glass-card p-4 h-100 d-flex flex-column align-items-center text-center">
                  <div className="rounded-circle p-3 mb-3" style={{ backgroundColor: `${stat.color}15`, color: stat.color, fontSize: '1.5rem' }}>
                    {stat.icon}
                  </div>
                  <h3 className="mac-title mb-1 h2">{stat.value}</h3>
                  <p className="mac-subtitle mb-0 small uppercase font-weight-bold">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </header>

        {/* Quick Actions */}
        <section className="mb-5 animate__animated animate__fadeIn animate__delay-1s">
          <h2 className="mac-title h4 mb-4">Azioni Rapide</h2>
          <div className="row g-3">
            <div className="col-6 col-md-4 col-lg-2">
              <Link to="/admin/utenti" className="mac-glass-card p-3 d-flex flex-column align-items-center text-decoration-none h-100">
                <FaUser className="mb-2 text-primary" />
                <span className="small font-weight-bold text-dark">Utenti</span>
              </Link>
            </div>
            <div className="col-6 col-md-4 col-lg-2">
              <Link to="/admin/progetti" className="mac-glass-card p-3 d-flex flex-column align-items-center text-decoration-none h-100">
                <FaProjectDiagram className="mb-2 text-primary" />
                <span className="small font-weight-bold text-dark">Progetti</span>
              </Link>
            </div>
            <div className="col-6 col-md-4 col-lg-2">
              <Link to="/admin/statistiche" className="mac-glass-card p-3 d-flex flex-column align-items-center text-decoration-none h-100">
                <FaChartLine className="mb-2 text-primary" />
                <span className="small font-weight-bold text-dark">Stats</span>
              </Link>
            </div>
            <div className="col-6 col-md-4 col-lg-2">
              <Link to="/admin/sicurezza" className="mac-glass-card p-3 d-flex flex-column align-items-center text-decoration-none h-100">
                <FaShieldAlt className="mb-2 text-primary" />
                <span className="small font-weight-bold text-dark">Sicurezza</span>
              </Link>
            </div>
            <div className="col-6 col-md-4 col-lg-2">
              <Link to="/admin/impostazioni" className="mac-glass-card p-3 d-flex flex-column align-items-center text-decoration-none h-100">
                <FaCog className="mb-2 text-primary" />
                <span className="small font-weight-bold text-dark">Setup</span>
              </Link>
            </div>
            <div className="col-6 col-md-4 col-lg-2">
              <Link to="/admin/audit" className="mac-glass-card p-3 d-flex flex-column align-items-center text-decoration-none h-100">
                <FaHistory className="mb-2 text-primary" />
                <span className="small font-weight-bold text-dark">Audit</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Overview Tables */}
        <div className="row g-4 animate__animated animate__fadeIn animate__delay-2s">
          {/* Utenti Recenti */}
          <div className="col-lg-6">
            <div className="mac-glass-card p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mac-title h5 mb-0">Ultimi Utenti</h3>
                <Link to="/admin/utenti" className="btn btn-sm btn-link text-decoration-none">Vedi tutti <FaArrowRight size={10} /></Link>
              </div>
              <div className="list-group list-group-flush bg-transparent">
                {utenti.slice(0, 5).map(u => (
                  <div key={u.id} className="list-group-item bg-transparent border-0 px-0 py-3 d-flex align-items-center">
                    <div className="rounded-circle bg-light p-2 me-3">
                      <FaUser size={14} className="text-secondary" />
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-0 font-weight-bold">{u.username}</h6>
                      <p className="mb-0 small text-muted text-capitalize">{u.ruolo}</p>
                    </div>
                    <div className="text-end">
                      <span className={`badge rounded-pill ${u.stato === 'attivo' ? 'bg-success' : 'bg-warning'} bg-opacity-10 text-${u.stato === 'attivo' ? 'success' : 'warning'} border-0 px-2 py-1`} style={{ fontSize: '0.65rem' }}>
                        {u.stato.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
                {utenti.length === 0 && <p className="text-center text-muted py-4">Nessun utente registrato.</p>}
              </div>
            </div>
          </div>

          {/* Richieste Recenti */}
          <div className="col-lg-6">
            <div className="mac-glass-card p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mac-title h5 mb-0">Richieste Recenti</h3>
                <Link to="/admin/progetti" className="btn btn-sm btn-link text-decoration-none">Vedi tutte <FaArrowRight size={10} /></Link>
              </div>
              <div className="list-group list-group-flush bg-transparent">
                {richieste.slice(0, 5).map(r => (
                  <div key={r.id} className="list-group-item bg-transparent border-0 px-0 py-3 d-flex align-items-center">
                    <div className="rounded-circle bg-light p-2 me-3">
                      <FaLightbulb size={14} className="text-secondary" />
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-0 font-weight-bold text-truncate" style={{ maxWidth: '200px' }}>{r.titolo}</h6>
                      <p className="mb-0 small text-muted">Stato: {r.stato}</p>
                    </div>
                    <div className="text-end">
                      <span className="badge bg-primary bg-opacity-10 text-primary border-0 px-2 py-1" style={{ fontSize: '0.65rem' }}>
                        ID: #{r.id}
                      </span>
                    </div>
                  </div>
                ))}
                {richieste.length === 0 && <p className="text-center text-muted py-4">Nessuna richiesta trovata.</p>}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default DashboardAdmin; 

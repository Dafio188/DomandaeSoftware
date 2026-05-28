import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaShieldAlt, FaLock, FaStar, FaHandshake, FaArrowRight, FaHeadset, FaUserShield, FaLightbulb, FaCode, FaChartLine, FaGlobe, FaMobile, FaCogs, FaSearch, FaCheckCircle, FaUsers, FaQuoteLeft, FaBrain } from 'react-icons/fa';
import '../styles/DarkPage.css';

function Home() {
  const [stats, setStats] = useState({ richieste: 0, fornitori: 0, progetti: 0, soddisfazione: 98 });

  useEffect(() => {
    // Load stats from API if available
    const loadStats = async () => {
      try {
        const res = await fetch('/api/stats/home/');
        if (res.ok) {
          const data = await res.json();
          setStats(prev => ({ ...prev, ...data }));
        }
      } catch {}
    };
    loadStats();
  }, []);

  const categorie = [
    { icon: '/immagini icona homepage/01.png', title: 'Sviluppo Software', desc: 'Soluzioni custom su misura', projects: 45, color: '#4e73df' },
    { icon: '/immagini icona homepage/02.png', title: 'App Mobile', desc: 'iOS e Android nativi', projects: 23, color: '#e74a3b' },
    { icon: '/immagini icona homepage/03.png', title: 'Siti Web', desc: 'Design moderni e responsivi', projects: 67, color: '#1cc88a' },
    { icon: '/immagini icona homepage/06.png', title: 'AI & Automazione', desc: 'Modelli e integrazioni AI', projects: 34, color: '#6f42c1' },
  ];

  const passi = [
    { icon: <FaLightbulb size={22} />, title: 'Pubblica la tua idea', desc: 'Descrivi cosa vuoi realizzare e cosa ti serve' },
    { icon: <FaUsers size={22} />, title: 'Ricevi offerte', desc: 'Confronta profili, tempi e prezzi con serenità' },
    { icon: <FaRocket size={22} />, title: 'Collabora e realizza', desc: 'Scegli lo sviluppatore ideale e segui i progressi' },
  ];

  return (
    <div className="dark-page">

      {/* HERO — Minimal */}
      <section className="position-relative overflow-hidden" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #0a0a0c 0%, #1a1a2e 50%, #0a0a0c 100%)' }}>
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="mb-4">
                <span className="dark-badge mb-4 d-inline-block">IL MARKETPLACE ITALIANO</span>
              </div>
              <h1 className="fw-bold mb-4" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', letterSpacing: '-0.04em', lineHeight: '1.1', color: '#f5f5f7' }}>
                Connettiamo Visionari<br />
                con i Migliori<br />
                <span style={{ color: '#0071e3' }}>Sviluppatori</span>
              </h1>
              <p className="mb-5" style={{ color: '#86868b', fontSize: '1.15rem', maxWidth: '520px', lineHeight: '1.6' }}>
                Trasforma le tue idee in soluzioni software innovative. Il marketplace leader per progetti digitali d'eccellenza.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/register" className="btn btn-lg rounded-pill fw-bold d-inline-flex align-items-center gap-2" 
                  style={{ background: '#0071e3', border: 'none', padding: '14px 32px', borderRadius: '980px', fontSize: '1rem', color: '#fff' }}>
                  <FaRocket size={16} /> Inizia Ora
                </Link>
                <Link to="/scopo-del-sito" className="btn btn-lg rounded-pill fw-bold d-inline-flex align-items-center gap-2"
                  style={{ border: '1px solid rgba(255,255,255,0.15)', padding: '14px 32px', borderRadius: '980px', fontSize: '1rem', color: '#f5f5f7', background: 'transparent' }}>
                  Scopri Come
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Glow decorativo */}
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,113,227,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      </section>

      {/* CATEGORIE — 4 card, link a /scopo-del-sito */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-3">
            <div>
              <h2 className="fw-bold mb-1" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', letterSpacing: '-0.03em', color: '#f5f5f7' }}>Categorie Software</h2>
              <p className="dark-muted mb-0">Scopri le nostre specializzazioni</p>
            </div>
            <Link to="/scopo-del-sito" className="fw-bold text-decoration-none d-inline-flex align-items-center gap-2" style={{ color: '#0071e3', fontSize: '0.9rem' }}>
              Vedi tutte <FaArrowRight size={12} />
            </Link>
          </div>
          <div className="row g-3">
            {categorie.map((cat, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="dark-card p-3 p-md-4 text-center h-100" style={{ cursor: 'default' }}>
                  <div className="d-inline-flex align-items-center justify-content-center mb-3 overflow-hidden" 
                    style={{ width: 56, height: 56, borderRadius: 16, background: `${cat.color}15` }}>
                    <img src={cat.icon} alt={cat.title} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }}
                      onError={(e) => { e.target.style.display = 'none' }} />
                  </div>
                  <h6 className="fw-bold mb-1 dark-text" style={{ fontSize: '0.85rem' }}>{cat.title}</h6>
                  <small className="dark-muted d-block">{cat.desc}</small>
                  <small className="d-block mt-2 fw-bold" style={{ color: cat.color, fontSize: '0.72rem' }}>{cat.projects} progetti attivi</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COME FUNZIONA — 3 passi rapidi */}
      <section className="py-5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-2" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.03em', color: '#f5f5f7' }}>Come Funziona</h2>
            <p className="dark-muted">Tre passi per realizzare il tuo progetto</p>
          </div>
          <div className="row g-3 justify-content-center">
            {passi.map((passo, i) => (
              <div key={i} className="col-md-4">
                <div className="dark-card p-4 text-center h-100 position-relative">
                  <div className="position-absolute top-0 end-0 pe-3 pt-2" style={{ fontSize: '2.5rem', fontWeight: 900, color: 'rgba(0,113,227,0.1)', lineHeight: 1 }}>
                    {i + 1}
                  </div>
                  <div className="d-inline-flex align-items-center justify-content-center mb-3" 
                    style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(0,113,227,0.1)', color: '#0071e3' }}>
                    {passo.icon}
                  </div>
                  <h6 className="fw-bold mb-2 dark-text" style={{ fontSize: '0.95rem' }}>{passo.title}</h6>
                  <p className="dark-muted small mb-0">{passo.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/scopo-del-sito" className="btn rounded-pill px-4 fw-bold" 
              style={{ background: 'rgba(0,113,227,0.1)', color: '#0071e3', border: '1px solid rgba(0,113,227,0.2)', borderRadius: '980px' }}>
              Scopri tutti i dettagli <FaArrowRight className="ms-2" size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-4">
        <div className="container">
          <div className="row g-2 justify-content-center text-center">
            {[
              { value: `${stats.progetti || '18'}+`, label: 'Progetti Attivi', color: '#0071e3' },
              { value: `${stats.fornitori || '50'}+`, label: 'Sviluppatori', color: '#30c56d' },
              { value: `${stats.soddisfazione || 98}%`, label: 'Soddisfazione', color: '#ffc107' },
              { value: `${stats.richieste || '200'}+`, label: 'Richieste Pubblicate', color: '#00a2ff' },
            ].map((stat, i) => (
              <div key={i} className="col-3 col-md-3">
                <div className="p-2 p-md-3">
                  <div className="fw-bold mb-1" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 2rem)', color: stat.color, letterSpacing: '-0.02em' }}>{stat.value}</div>
                  <small className="dark-muted" style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{stat.label}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GARANZIE + CHI SIAMO — Compatto */}
      <section className="py-5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="dark-card p-4 h-100">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="d-inline-flex align-items-center justify-content-center" style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(0,113,227,0.1)', color: '#0071e3' }}>
                    <FaShieldAlt size={20} />
                  </div>
                  <h5 className="fw-bold mb-0 dark-text" style={{ fontSize: '1rem' }}>Garanzie SoftMatch</h5>
                </div>
                <div className="row g-2">
                  {[
                    { icon: <FaCheckCircle size={14} />, text: 'Pagamenti sicuri', color: '#30c56d' },
                    { icon: <FaStar size={14} />, text: 'Feedback trasparenti', color: '#ffc107' },
                    { icon: <FaHeadset size={14} />, text: 'Supporto dedicato', color: '#0071e3' },
                    { icon: <FaUserShield size={14} />, text: 'Tutela della privacy', color: '#00a2ff' },
                  ].map((g, i) => (
                    <div key={i} className="col-6">
                      <div className="d-flex align-items-center gap-2 py-1">
                        <span style={{ color: g.color }}>{g.icon}</span>
                        <small className="dark-muted">{g.text}</small>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/chi-siamo" className="btn btn-sm rounded-pill px-3 mt-3 fw-bold" 
                  style={{ background: 'rgba(0,113,227,0.08)', color: '#0071e3', border: '1px solid rgba(0,113,227,0.15)', borderRadius: '980px' }}>
                  Chi siamo <FaArrowRight className="ms-1" size={10} />
                </Link>
              </div>
            </div>
            <div className="col-md-6">
              <div className="dark-card p-4 h-100 d-flex flex-column justify-content-center text-center">
                <FaQuoteLeft size={28} style={{ color: 'rgba(0,113,227,0.2)' }} className="mb-3 mx-auto" />
                <p className="dark-muted small mb-2" style={{ fontStyle: 'italic', lineHeight: '1.6' }}>
                  "Grazie a SoftMatch abbiamo trovato il partner perfetto per il nostro CRM. Risultato eccellente in tempi record!"
                </p>
                <div className="fw-bold dark-text" style={{ fontSize: '0.85rem' }}>Marco Rossi</div>
                <small className="dark-muted" style={{ fontSize: '0.75rem' }}>CEO, TechStart Srl</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINALE */}
      <section className="py-5 text-center">
        <div className="container">
          <div className="dark-card p-5 mx-auto" style={{ maxWidth: '700px' }}>
            <h3 className="fw-bold mb-3 dark-text" style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', letterSpacing: '-0.03em' }}>Pronto a Iniziare?</h3>
            <p className="dark-muted mb-4" style={{ maxWidth: '450px', margin: '0 auto' }}>
              Unisciti a migliaia di clienti e sviluppatori che stanno già trasformando idee in successi digitali.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/register" className="btn btn-lg rounded-pill fw-bold d-inline-flex align-items-center gap-2"
                style={{ background: '#0071e3', border: 'none', padding: '14px 32px', borderRadius: '980px', color: '#fff' }}>
                <FaRocket size={16} /> Registrati Gratis
              </Link>
              <Link to="/contatti" className="btn btn-lg rounded-pill fw-bold d-inline-flex align-items-center gap-2"
                style={{ border: '1px solid rgba(255,255,255,0.15)', padding: '14px 32px', borderRadius: '980px', color: '#f5f5f7', background: 'transparent' }}>
                Contattaci
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;

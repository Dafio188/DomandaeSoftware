import { 
  FaRocket, 
  FaShieldAlt, 
  FaUsers, 
  FaLightbulb, 
  FaHandshake, 
  FaGlobe,
  FaAward,
  FaCrown,
  FaCode,
  FaCogs,
  FaSearch,
  FaEye,
  FaLock,
  FaDatabase,
  FaCreditCard,
  FaUserShield
} from 'react-icons/fa';
import '../styles/DarkPage.css';

function ChiSiamo() {
  return (
    <div className="dark-page">

      {/* Hero */}
      <div className="dark-hero">
        <div className="container">
          <div className="d-flex align-items-center justify-content-center mb-4 gap-3">
            <div className="dark-icon-circle">
              <FaRocket size={24} style={{ color: '#0071e3' }} />
            </div>
            <span className="dark-badge">CHI SIAMO</span>
          </div>
          <h1>La rivoluzione dello sviluppo software</h1>
          <p>
            SoftMatch è l'ecosistema digitale dove le idee diventano codice. Connettiamo visione e 
            competenza per creare il software del futuro.
          </p>
        </div>
      </div>

      <div className="container">
        {/* Mission + badge */}
        <div className="row align-items-center mb-5">
          <div className="col-lg-7">
            <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-lg-start">
              <span className="dark-badge" style={{ borderColor: 'rgba(48,197,109,0.3)', color: '#30c56d', background: 'rgba(48,197,109,0.08)' }}>
                🛡️ Sicurezza Apple-grade
              </span>
              <span className="dark-badge" style={{ borderColor: 'rgba(0,162,255,0.3)', color: '#00a2ff', background: 'rgba(0,162,255,0.08)' }}>
                🤝 Community Elite
              </span>
              <span className="dark-badge" style={{ borderColor: 'rgba(255,193,7,0.3)', color: '#ffc107', background: 'rgba(255,193,7,0.08)' }}>
                💎 Qualità Garantita
              </span>
            </div>
          </div>
          <div className="col-lg-5 text-center mt-5 mt-lg-0">
            <div className="dark-card p-4">
              <div className="dark-icon-circle mx-auto mb-3" style={{ width: 64, height: 64, background: 'rgba(0,113,227,0.12)' }}>
                <FaGlobe size={28} style={{ color: '#0071e3' }} />
              </div>
              <h5 className="dark-title mb-2">La Nostra Missione</h5>
              <p className="dark-muted mb-0" style={{ fontSize: '0.9rem' }}>
                Democratizzare l'accesso allo sviluppo software di alta qualità, 
                eliminando le barriere tra chi ha una visione e chi ha il talento per realizzarla.
              </p>
            </div>
          </div>
        </div>

        {/* La Nostra Storia */}
        <div className="dark-card p-5 mb-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="pe-lg-5">
                <div className="d-flex align-items-center mb-4">
                  <div className="dark-icon-circle me-3" style={{ background: 'rgba(255,204,0,0.12)' }}>
                    <FaLightbulb style={{ color: '#ffc107' }} size={22} />
                  </div>
                  <h2 className="dark-title mb-0" style={{ fontSize: '1.8rem', letterSpacing: '-0.03em' }}>La Nostra Storia</h2>
                </div>
                
                <p className="dark-muted mb-4" style={{ lineHeight: '1.7' }}>
                  SoftMatch nasce dall'esigenza di risolvere i problemi cronici dello sviluppo software: 
                  mancanza di trasparenza, ritardi e incertezza sui pagamenti. 
                  Abbiamo costruito quello che avremmo voluto usare noi stessi.
                </p>
                
                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <div className="dark-stat">
                      <h3 style={{ color: '#30c56d' }}>94%</h3>
                      <small>PROGETTI COMPLETATI</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="dark-stat">
                      <h3 style={{ color: '#0071e3' }}>4.8/5</h3>
                      <small>RATING UTENTI</small>
                    </div>
                  </div>
                </div>
                
                <h5 className="dark-title mb-3" style={{ color: '#0071e3' }}>Un Nuovo Standard</h5>
                <p className="dark-muted mb-0" style={{ lineHeight: '1.7' }}>
                  Ogni riga di codice, ogni transazione e ogni interazione su SoftMatch 
                  è pensata per costruire fiducia. Non siamo solo una piattaforma, 
                  siamo il partner tecnologico della tua crescita.
                </p>
              </div>
            </div>
            
            <div className="col-lg-6 mt-5 mt-lg-0">
              <div className="position-relative text-center">
                <FaCode size={160} style={{ color: 'rgba(0,113,227,0.15)', position: 'relative', zIndex: 1 }} />
                <div className="dark-card p-4 mx-auto mt-3" style={{ maxWidth: '240px', position: 'relative', zIndex: 2 }}>
                  <h5 className="dark-title mb-1" style={{ color: '#0071e3' }}>Innovazione</h5>
                  <small className="dark-muted">Senza compromessi</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* I Nostri Valori */}
        <div className="dark-section-title">
          <h2>I Nostri Valori</h2>
          <p>Ciò che ci rende diversi dagli altri</p>
        </div>
        
        <div className="row g-4 mb-5">
          <div className="col-lg-4">
            <div className="dark-value-card">
              <div className="dark-icon-circle mx-auto mb-4" style={{ background: 'rgba(255,59,48,0.12)' }}>
                <FaShieldAlt size={22} style={{ color: '#ff3b30' }} />
              </div>
              <h5>Sicurezza Totale</h5>
              <p>
                Transazioni protette e supervisione costante. La tua proprietà intellettuale 
                e il tuo budget sono al sicuro con noi.
              </p>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="dark-value-card">
              <div className="dark-icon-circle mx-auto mb-4" style={{ background: 'rgba(48,197,109,0.12)' }}>
                <FaHandshake size={22} style={{ color: '#30c56d' }} />
              </div>
              <h5>Trasparenza</h5>
              <p>
                Nessun costo nascosto. Comunicazione diretta e chiara tra cliente e fornitore 
                per tutta la durata del progetto.
              </p>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="dark-value-card">
              <div className="dark-icon-circle mx-auto mb-4" style={{ background: 'rgba(0,162,255,0.12)' }}>
                <FaUsers size={22} style={{ color: '#00a2ff' }} />
              </div>
              <h5>Eccellenza</h5>
              <p>
                Selezioniamo solo i migliori talenti. La qualità del codice è il nostro 
                biglietto da visita nel mondo.
              </p>
            </div>
          </div>
        </div>

        {/* Come Lavoriamo */}
        <div className="dark-card p-5 mb-5">
          <div className="text-center mb-5">
            <h2 className="dark-title mb-2">Come Lavoriamo</h2>
            <p className="dark-muted">Il nostro approccio unico per il tuo successo</p>
          </div>
          
          <div className="row g-4">
            {[
              { icon: <FaSearch size={22} />, title: 'Verifica', desc: 'Processo di selezione rigoroso per ogni fornitore.' },
              { icon: <FaHandshake size={22} />, title: 'Matching', desc: 'Algoritmi per connetterti al talento ideale.' },
              { icon: <FaEye size={22} />, title: 'Monitoraggio', desc: 'Supervisione costante su ogni fase del progetto.' },
              { icon: <FaAward size={22} />, title: 'Qualità', desc: 'Consegna garantita secondo i massimi standard.' },
            ].map((item, i) => (
              <div key={i} className="col-lg-3 col-md-6">
                <div className="dark-process-step">
                  <div className="dark-icon-circle mx-auto mb-3" style={{ width: 60, height: 60, background: 'rgba(0,113,227,0.1)' }}>
                    <span style={{ color: '#0071e3' }}>{item.icon}</span>
                  </div>
                  <h6>{item.title}</h6>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy e Sicurezza */}
        <div className="dark-card p-5 mb-5" style={{ borderColor: 'rgba(48,197,109,0.2)' }}>
          <div className="row align-items-center">
            <div className="col-lg-2 text-center mb-4 mb-lg-0">
              <FaLock size={70} style={{ color: 'rgba(48,197,109,0.3)' }} />
            </div>
            <div className="col-lg-10">
              <h3 className="dark-title mb-3">La tua sicurezza è la nostra priorità</h3>
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="dark-feature">
                    <div className="dark-feature-icon" style={{ background: 'rgba(48,197,109,0.12)', color: '#30c56d' }}>
                      <FaShieldAlt />
                    </div>
                    <div>
                      <h6>Crittografia Avanzata</h6>
                      <p>Tutti i dati e le comunicazioni sono protetti da protocolli di sicurezza leader del settore.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="dark-feature">
                    <div className="dark-feature-icon" style={{ background: 'rgba(48,197,109,0.12)', color: '#30c56d' }}>
                      <FaUserShield />
                    </div>
                    <div>
                      <h6>GDPR Compliance</h6>
                      <p>Rispettiamo totalmente la tua privacy secondo le normative europee vigenti.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChiSiamo; 

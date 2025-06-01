import { 
  FaRocket, 
  FaShieldAlt, 
  FaUsers, 
  FaLightbulb, 
  FaHandshake, 
  FaGlobe,
  FaAward,
  FaHeart,
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
import './ChiSiamo.css';

function ChiSiamo() {
  return (
    <div className="min-vh-100 bg-gradient chi-siamo-page">
      {/* Hero Section */}
      <div className="hero-section bg-primary text-white position-relative overflow-hidden">
        <div className="container py-5 position-relative z-2">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <h1 className="display-3 fw-bold mb-4">
                Chi Siamo
                <div className="hero-icon-floating">
                  <FaRocket size={60} className="text-warning" />
                </div>
              </h1>
              <p className="lead mb-4 opacity-90">
                Siamo una piattaforma innovativa che connette <strong>clienti</strong> con <strong>sviluppatori professionali</strong> 
                per realizzare progetti software su misura, garantendo sicurezza, qualità e trasparenza in ogni fase.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <div className="feature-badge">
                  <FaShieldAlt className="me-2" />
                  Sicurezza Garantita
                </div>
                <div className="feature-badge">
                  <FaUsers className="me-2" />
                  Community Verificata
                </div>
                <div className="feature-badge">
                  <FaHandshake className="me-2" />
                  Pagamenti Protetti
                </div>
              </div>
            </div>
            <div className="col-lg-5 text-center">
              <div className="hero-illustration">
                <div className="floating-card">
                  <div className="card border-0 shadow-lg">
                    <div className="card-body text-center text-dark">
                      <FaGlobe size={48} className="text-primary mb-3" />
                      <h5 className="text-primary">La Nostra Missione</h5>
                      <p className="small mb-0">
                        Democratizzare l'accesso allo sviluppo software di qualità
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-decoration"></div>
      </div>

      <div className="container py-5">
        {/* La Nostra Storia */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold text-primary mb-3">
                <FaLightbulb className="me-3 text-warning" />
                La Nostra Storia
              </h2>
              <p className="lead text-light">Come è nata l'idea di Domanda & Software</p>
            </div>
          </div>
        </div>

        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="story-content">
              <h3 className="fw-bold mb-4 text-primary">La Nostra Storia</h3>
              <p className="text-light mb-4">
                Domanda & Software nasce dall'esperienza diretta dei problemi che affliggono 
                il mondo dello sviluppo software freelance. Troppi progetti falliscono per 
                mancanza di fiducia, comunicazione inadeguata e assenza di garanzie.
              </p>
              
              <div className="problem-stats mb-4">
                <div className="row g-3">
                  <div className="col-6">
                    <div className="stat-item text-center p-3 bg-danger bg-opacity-10 rounded-3">
                      <h4 className="text-danger fw-bold mb-1">67%</h4>
                      <small className="text-light">Progetti falliti per mancanza di fiducia</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="stat-item text-center p-3 bg-warning bg-opacity-10 rounded-3">
                      <h4 className="text-warning fw-bold mb-1">43%</h4>
                      <small className="text-light">Sviluppatori sottopagati</small>
                    </div>
                  </div>
                </div>
              </div>
              
              <h4 className="fw-bold mb-3 text-success">La Nostra Soluzione</h4>
              <p className="text-light mb-4">
                Abbiamo creato una piattaforma che mette al centro la <strong>fiducia</strong>, 
                la <strong>trasparenza</strong> e la <strong>sicurezza</strong>. Ogni progetto 
                è supervisionato, ogni pagamento è garantito, ogni comunicazione è protetta.
              </p>
              
              <div className="success-stats mb-4">
                <div className="row g-3">
                  <div className="col-6">
                    <div className="stat-item text-center p-3 bg-success bg-opacity-10 rounded-3">
                      <h4 className="text-success fw-bold mb-1">94%</h4>
                      <small className="text-light">Progetti completati con successo</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="stat-item text-center p-3 bg-info bg-opacity-10 rounded-3">
                      <h4 className="text-info fw-bold mb-1">4.8/5</h4>
                      <small className="text-light">Soddisfazione media clienti</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6">
            <div className="story-visual text-center">
              <div className="story-illustration">
                <FaRocket size={120} className="text-primary mb-4" />
                <h4 className="text-primary fw-bold">Innovazione Continua</h4>
              </div>
            </div>
          </div>
        </div>

        {/* I Nostri Valori */}
        <div className="values-section mb-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-primary mb-3">
              <FaHeart className="me-3 text-danger" />
              I Nostri Valori
            </h2>
            <p className="lead text-light">I principi che guidano ogni nostra decisione</p>
          </div>
          
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="value-card">
                <div className="value-icon">
                  <FaShieldAlt />
                </div>
                <h5 className="fw-bold mb-3">Sicurezza Prima di Tutto</h5>
                <p className="text-dark">
                  Ogni transazione è protetta, ogni comunicazione è supervisionata, 
                  ogni progetto è garantito. La sicurezza non è un'opzione, è la base.
                </p>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="value-card">
                <div className="value-icon">
                  <FaHandshake />
                </div>
                <h5 className="fw-bold mb-3">Trasparenza Totale</h5>
                <p className="text-dark">
                  Nessun costo nascosto, nessuna sorpresa. Tutto è chiaro fin dall'inizio: 
                  prezzi, tempi, commissioni e garanzie.
                </p>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="value-card">
                <div className="value-icon">
                  <FaUsers />
                </div>
                <h5 className="fw-bold mb-3">Comunità di Qualità</h5>
                <p className="text-dark">
                  Solo professionisti verificati e clienti seri. Costruiamo una comunità 
                  basata sulla competenza e sul rispetto reciproco.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Come Funzioniamo */}
        <div className="working-section mb-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-primary mb-3">
              <FaCogs className="me-3 text-info" />
              Come Lavoriamo
            </h2>
            <p className="lead text-light">Il nostro approccio unico per garantire il successo</p>
          </div>
          
          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="working-step">
                <div className="step-number">1</div>
                <div className="step-icon">
                  <FaSearch />
                </div>
                <h6 className="fw-bold mb-2">Verifica Rigorosa</h6>
                <p className="small text-dark">
                  Ogni sviluppatore viene verificato: competenze, portfolio, 
                  identità e referenze professionali.
                </p>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <div className="working-step">
                <div className="step-number">2</div>
                <div className="step-icon">
                  <FaHandshake />
                </div>
                <h6 className="fw-bold mb-2">Matching Intelligente</h6>
                <p className="small text-dark">
                  Algoritmi avanzati abbinano progetti e sviluppatori 
                  in base a competenze e compatibilità.
                </p>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <div className="working-step">
                <div className="step-number">3</div>
                <div className="step-icon">
                  <FaEye />
                </div>
                <h6 className="fw-bold mb-2">Supervisione Attiva</h6>
                <p className="small text-dark">
                  Ogni progetto è monitorato da admin esperti che 
                  intervengono in caso di problemi.
                </p>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <div className="working-step">
                <div className="step-number">4</div>
                <div className="step-icon">
                  <FaAward />
                </div>
                <h6 className="fw-bold mb-2">Garanzia Totale</h6>
                <p className="small text-dark">
                  Pagamenti protetti, qualità garantita, 
                  soddisfazione assicurata o rimborso.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy e Sicurezza */}
        <div className="privacy-section">
          <div className="card border-0 shadow-lg rounded-4 bg-light">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <FaLock className="me-3 text-warning" size={60} />
                <h3 className="text-primary fw-bold">Privacy e Sicurezza</h3>
                <p className="lead text-dark">La vostra privacy è sacra per noi</p>
              </div>
              
              <div className="row g-4">
                <div className="col-lg-6">
                  <div className="privacy-item">
                    <FaShieldAlt className="text-success me-3" size={24} />
                    <div>
                      <h6 className="fw-bold mb-1">Crittografia End-to-End</h6>
                      <p className="small text-dark mb-3">
                        Tutte le comunicazioni sono crittografate con standard militari. 
                        Nessuno può intercettare i vostri messaggi.
                      </p>
                    </div>
                  </div>
                  
                  <div className="privacy-item">
                    <FaDatabase className="text-info me-3" size={24} />
                    <div>
                      <h6 className="fw-bold mb-1">Dati Protetti GDPR</h6>
                      <p className="small text-dark mb-3">
                        Conformità totale al GDPR europeo. I vostri dati sono al sicuro 
                        e utilizzati solo per i servizi richiesti.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="col-lg-6">
                  <div className="privacy-item">
                    <FaCreditCard className="text-warning me-3" size={24} />
                    <div>
                      <h6 className="fw-bold mb-1">Pagamenti Sicuri</h6>
                      <p className="small text-dark mb-3">
                        Integrazione con i migliori gateway di pagamento mondiali. 
                        Le vostre carte sono sempre protette.
                      </p>
                    </div>
                  </div>
                  
                  <div className="privacy-item">
                    <FaUserShield className="text-primary me-3" size={24} />
                    <div>
                      <h6 className="fw-bold mb-1">Identità Verificata</h6>
                      <p className="small text-dark mb-3">
                        Processo di verifica dell'identità per tutti gli utenti. 
                        Solo persone reali nella nostra piattaforma.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="alert alert-info border-0 rounded-3 mt-4">
                <div className="d-flex align-items-center">
                  <FaShieldAlt className="me-3 text-info" />
                  <div>
                    <strong>Impegno per la Privacy:</strong> Non vendiamo mai i vostri dati a terzi. 
                    Non inviamo spam. Non tracciamo le vostre attività al di fuori della piattaforma. 
                    La vostra fiducia è il nostro bene più prezioso.
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
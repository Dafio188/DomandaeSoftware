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
  FaCode
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
              <p className="lead text-muted">Come è nata l'idea di Domanda & Software</p>
            </div>
          </div>
        </div>

        <div className="row g-4 mb-5">
          <div className="col-lg-6">
            <div className="card border-0 shadow-lg h-100 rounded-4">
              <div className="card-body p-5">
                <div className="story-icon mb-4">
                  <FaLightbulb size={48} className="text-warning" />
                </div>
                <h4 className="text-primary mb-3">Il Problema</h4>
                <p className="text-muted mb-4">
                  Abbiamo notato che molti <strong>piccoli imprenditori</strong> e <strong>privati</strong> 
                  avevano difficoltà a trovare sviluppatori affidabili per i loro progetti. 
                  Dall'altra parte, molti <strong>sviluppatori freelance</strong> faticavano a trovare 
                  clienti seri e progetti interessanti.
                </p>
                <div className="problem-stats">
                  <div className="row text-center">
                    <div className="col-6">
                      <h5 className="text-danger">78%</h5>
                      <small className="text-muted">Progetti falliti per mancanza di fiducia</small>
                    </div>
                    <div className="col-6">
                      <h5 className="text-danger">65%</h5>
                      <small className="text-muted">Sviluppatori sottopagati</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6">
            <div className="card border-0 shadow-lg h-100 rounded-4">
              <div className="card-body p-5">
                <div className="story-icon mb-4">
                  <FaRocket size={48} className="text-success" />
                </div>
                <h4 className="text-success mb-3">La Soluzione</h4>
                <p className="text-muted mb-4">
                  Abbiamo creato una piattaforma che <strong>supervisiona ogni progetto</strong>, 
                  garantisce <strong>pagamenti sicuri</strong> e facilita la <strong>comunicazione trasparente</strong> 
                  tra clienti e sviluppatori, eliminando rischi e malintesi.
                </p>
                <div className="solution-stats">
                  <div className="row text-center">
                    <div className="col-6">
                      <h5 className="text-success">95%</h5>
                      <small className="text-muted">Progetti completati con successo</small>
                    </div>
                    <div className="col-6">
                      <h5 className="text-success">4.8/5</h5>
                      <small className="text-muted">Soddisfazione media clienti</small>
                    </div>
                  </div>
                </div>
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
            <p className="lead text-muted">I principi che guidano ogni nostra decisione</p>
          </div>
          
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="value-card">
                <div className="value-icon">
                  <FaShieldAlt size={40} />
                </div>
                <h5 className="fw-bold">Sicurezza Prima di Tutto</h5>
                <p className="text-muted">
                  Ogni transazione è protetta, ogni comunicazione è supervisionata, 
                  ogni dato è crittografato. La vostra sicurezza è la nostra priorità assoluta.
                </p>
                <div className="value-features">
                  <small className="text-success">✓ Pagamenti garantiti</small><br />
                  <small className="text-success">✓ Chat supervisionate</small><br />
                  <small className="text-success">✓ Dati crittografati</small>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="value-card">
                <div className="value-icon">
                  <FaHandshake size={40} />
                </div>
                <h5 className="fw-bold">Trasparenza Totale</h5>
                <p className="text-muted">
                  Nessun costo nascosto, nessuna sorpresa. Ogni fase del progetto è tracciata, 
                  ogni pagamento è documentato, ogni regola è chiara fin dall'inizio.
                </p>
                <div className="value-features">
                  <small className="text-success">✓ Prezzi fissi e chiari</small><br />
                  <small className="text-success">✓ Timeline definite</small><br />
                  <small className="text-success">✓ Processo tracciabile</small>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="value-card">
                <div className="value-icon">
                  <FaAward size={40} />
                </div>
                <h5 className="fw-bold">Qualità Eccellente</h5>
                <p className="text-muted">
                  Solo sviluppatori verificati, solo progetti di qualità. 
                  Controlliamo ogni deliverable e garantiamo standard professionali elevati.
                </p>
                <div className="value-features">
                  <small className="text-success">✓ Sviluppatori certificati</small><br />
                  <small className="text-success">✓ Code review incluse</small><br />
                  <small className="text-success">✓ Supporto post-vendita</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Come Funzioniamo */}
        <div className="working-section mb-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-primary mb-3">
              <FaCode className="me-3 text-info" />
              Come Funzioniamo
            </h2>
            <p className="lead text-muted">Il nostro approccio unico per garantire il successo</p>
          </div>
          
          <div className="row g-4">
            <div className="col-lg-3">
              <div className="working-step">
                <div className="step-number">1</div>
                <div className="step-icon">
                  <FaUsers size={30} />
                </div>
                <h6 className="fw-bold">Verifica Utenti</h6>
                <p className="small text-muted">
                  Verifichiamo l'identità di clienti e sviluppatori per garantire serietà e professionalità
                </p>
              </div>
            </div>
            
            <div className="col-lg-3">
              <div className="working-step">
                <div className="step-number">2</div>
                <div className="step-icon">
                  <FaHandshake size={30} />
                </div>
                <h6 className="fw-bold">Matching Perfetto</h6>
                <p className="small text-muted">
                  Abbiniamo clienti e sviluppatori in base a competenze, budget e tipologia di progetto
                </p>
              </div>
            </div>
            
            <div className="col-lg-3">
              <div className="working-step">
                <div className="step-number">3</div>
                <div className="step-icon">
                  <FaCrown size={30} />
                </div>
                <h6 className="fw-bold">Supervisione Admin</h6>
                <p className="small text-muted">
                  I nostri admin supervisionano ogni fase per prevenire problemi e mediare eventuali dispute
                </p>
              </div>
            </div>
            
            <div className="col-lg-3">
              <div className="working-step">
                <div className="step-number">4</div>
                <div className="step-icon">
                  <FaAward size={30} />
                </div>
                <h6 className="fw-bold">Garanzia Qualità</h6>
                <p className="small text-muted">
                  Garantiamo la qualità finale e offriamo supporto post-consegna per la vostra tranquillità
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
                <FaShieldAlt size={60} className="text-success mb-3" />
                <h3 className="text-primary fw-bold">Privacy e Sicurezza dei Dati</h3>
                <p className="lead text-muted">La vostra privacy è sacra per noi</p>
              </div>
              
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="privacy-feature">
                    <h6 className="text-success fw-bold">🔒 Crittografia Avanzata</h6>
                    <p className="small text-muted mb-3">
                      Tutti i dati sono crittografati con algoritmi AES-256 e trasmessi 
                      tramite connessioni SSL/TLS sicure.
                    </p>
                  </div>
                  
                  <div className="privacy-feature">
                    <h6 className="text-success fw-bold">🏰 Server Sicuri</h6>
                    <p className="small text-muted mb-3">
                      Utilizziamo data center certificati ISO 27001 con accesso fisico 
                      limitato e monitoraggio 24/7.
                    </p>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="privacy-feature">
                    <h6 className="text-success fw-bold">🛡️ Conformità GDPR</h6>
                    <p className="small text-muted mb-3">
                      Rispettiamo rigorosamente il GDPR europeo. Potete richiedere, 
                      modificare o cancellare i vostri dati in qualsiasi momento.
                    </p>
                  </div>
                  
                  <div className="privacy-feature">
                    <h6 className="text-success fw-bold">👥 Accesso Limitato</h6>
                    <p className="small text-muted mb-3">
                      Solo il personale autorizzato ha accesso ai dati, e solo per 
                      finalità di supporto tecnico e sicurezza.
                    </p>
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
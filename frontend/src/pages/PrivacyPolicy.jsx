import { 
  FaShieldAlt, 
  FaLock, 
  FaUserShield, 
  FaDatabase,
  FaEnvelope,
  FaExclamationTriangle,
  FaGavel,
  FaCalendarAlt,
  FaInfoCircle
} from 'react-icons/fa';
import './PrivacyPolicy.css';

function PrivacyPolicy() {
  return (
    <div className="min-vh-100 bg-gradient privacy-policy-page">
      {/* Hero Section */}
      <div className="hero-section bg-primary text-white position-relative overflow-hidden">
        <div className="container py-5 position-relative z-2">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="display-3 fw-bold mb-4">
                <FaShieldAlt className="me-3 text-warning" />
                Privacy Policy
              </h1>
              <p className="lead mb-4 opacity-90">
                La tua privacy è importante per noi. Questa policy spiega come raccogliamo, 
                utilizziamo e proteggiamo i tuoi dati personali in conformità al <strong>GDPR</strong>.
              </p>
              <div className="text-center">
                <span className="badge bg-warning text-dark px-4 py-2 rounded-pill">
                  <FaCalendarAlt className="me-2" />
                  Ultimo aggiornamento: Aprile 2026
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-decoration"></div>
      </div>

      <div className="container py-5">
        
        {/* Informazioni Generali */}
        <div className="card border-0 shadow-lg rounded-4 mb-5">
          <div className="card-header bg-gradient-primary text-white border-0 rounded-top-4 p-4">
            <div className="d-flex align-items-center">
              <FaInfoCircle className="me-3" size={24} />
              <h4 className="mb-0">1. Informazioni Generali</h4>
            </div>
          </div>
          <div className="card-body p-5">
            <h5 className="text-primary mb-3">Chi Siamo</h5>
            <p className="mb-4">
              <strong>SoftMatch</strong> è una piattaforma marketplace che connette 
              clienti con sviluppatori professionali per progetti software su misura.
            </p>
            
            <div className="row g-4">
              <div className="col-md-6">
                <h6 className="fw-bold text-success">📋 Titolare del Trattamento</h6>
                <ul className="list-unstyled">
                  <li><strong>Denominazione:</strong> SoftMatch S.r.l.</li>
                  <li><strong>Sede:</strong> Via Roma 123, 00100 Roma (IT)</li>
                  <li><strong>Email:</strong> privacy@softmatch.it</li>
                  <li><strong>P.IVA:</strong> IT12345678901</li>
                </ul>
              </div>
              <div className="col-md-6">
                <h6 className="fw-bold text-info">⚖️ Base Giuridica</h6>
                <ul className="list-unstyled small">
                  <li>• <strong>Art. 6(1)(b) GDPR:</strong> Esecuzione contratto</li>
                  <li>• <strong>Art. 6(1)(f) GDPR:</strong> Legittimo interesse</li>
                  <li>• <strong>Art. 6(1)(a) GDPR:</strong> Consenso esplicito</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Dati Raccolti */}
        <div className="card border-0 shadow-lg rounded-4 mb-5">
          <div className="card-header bg-gradient-success text-white border-0 rounded-top-4 p-4">
            <div className="d-flex align-items-center">
              <FaDatabase className="me-3" size={24} />
              <h4 className="mb-0">2. Dati che Raccogliamo</h4>
            </div>
          </div>
          <div className="card-body p-5">
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="data-category">
                  <h6 className="fw-bold text-primary mb-3">
                    <FaUserShield className="me-2" />
                    Dati di Registrazione
                  </h6>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <span className="badge bg-light text-dark me-2">Obbligatorio</span>
                      Username, email, password
                    </li>
                    <li className="mb-2">
                      <span className="badge bg-light text-dark me-2">Facoltativo</span>
                      Nome, cognome, ruolo professionale
                    </li>
                  </ul>
                </div>
                
                <div className="data-category mt-4">
                  <h6 className="fw-bold text-success mb-3">
                    <FaEnvelope className="me-2" />
                    Dati di Comunicazione
                  </h6>
                  <ul className="list-unstyled">
                    <li className="mb-2">• Messaggi nella chat di progetto</li>
                    <li className="mb-2">• Recensioni e feedback</li>
                    <li className="mb-2">• Richieste di supporto</li>
                  </ul>
                </div>
              </div>
              
              <div className="col-lg-6">
                <div className="data-category">
                  <h6 className="fw-bold text-info mb-3">
                    <FaDatabase className="me-2" />
                    Dati di Progetto
                  </h6>
                  <ul className="list-unstyled">
                    <li className="mb-2">• Descrizioni progetti e richieste</li>
                    <li className="mb-2">• Offerte e proposte commerciali</li>
                    <li className="mb-2">• File e documentazione condivisa</li>
                    <li className="mb-2">• Cronologia transazioni</li>
                  </ul>
                </div>
                
                <div className="data-category mt-4">
                  <h6 className="fw-bold text-warning mb-3">
                    <FaLock className="me-2" />
                    Dati Automatici
                  </h6>
                  <ul className="list-unstyled">
                    <li className="mb-2">• Indirizzo IP e geolocalizzazione</li>
                    <li className="mb-2">• Log di accesso e navigazione</li>
                    <li className="mb-2">• Cookie e preferenze browser</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Finalità del Trattamento */}
        <div className="card border-0 shadow-lg rounded-4 mb-5">
          <div className="card-header bg-gradient-info text-white border-0 rounded-top-4 p-4">
            <div className="d-flex align-items-center">
              <FaGavel className="me-3" size={24} />
              <h4 className="mb-0">3. Perché Trattiamo i Tuoi Dati</h4>
            </div>
          </div>
          <div className="card-body p-5">
            <div className="row g-4">
              <div className="col-md-6">
                <div className="finalita-card">
                  <h6 className="fw-bold text-primary mb-3">🎯 Servizi Principali</h6>
                  <ul className="small">
                    <li>Gestione account e autenticazione</li>
                    <li>Facilitare matching cliente-sviluppatore</li>
                    <li>Supervisione progetti e pagamenti</li>
                    <li>Chat sicura e documentazione</li>
                    <li>Sistema recensioni e reputazione</li>
                  </ul>
                </div>
              </div>
              <div className="col-md-6">
                <div className="finalita-card">
                  <h6 className="fw-bold text-success mb-3">📊 Miglioramento Servizi</h6>
                  <ul className="small">
                    <li>Analisi utilizzo piattaforma</li>
                    <li>Prevenzione frodi e abusi</li>
                    <li>Supporto tecnico e assistenza</li>
                    <li>Comunicazioni di servizio</li>
                    <li>Sviluppo nuove funzionalità</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sicurezza */}
        <div className="card border-0 shadow-lg rounded-4 mb-5">
          <div className="card-header bg-gradient-warning text-dark border-0 rounded-top-4 p-4">
            <div className="d-flex align-items-center">
              <FaShieldAlt className="me-3" size={24} />
              <h4 className="mb-0">4. Come Proteggiamo i Tuoi Dati</h4>
            </div>
          </div>
          <div className="card-body p-5">
            <div className="row g-4">
              <div className="col-lg-4">
                <div className="security-measure">
                  <div className="security-icon">
                    <FaLock size={30} className="text-primary" />
                  </div>
                  <h6 className="fw-bold mt-3">Crittografia Avanzata</h6>
                  <p className="small text-muted">
                    Tutti i dati sono crittografati con algoritmi AES-256 e trasmessi via HTTPS/TLS.
                  </p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="security-measure">
                  <div className="security-icon">
                    <FaDatabase size={30} className="text-success" />
                  </div>
                  <h6 className="fw-bold mt-3">Server Sicuri</h6>
                  <p className="small text-muted">
                    Data center certificati ISO 27001 con accesso fisico limitato e monitoraggio 24/7.
                  </p>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="security-measure">
                  <div className="security-icon">
                    <FaUserShield size={30} className="text-info" />
                  </div>
                  <h6 className="fw-bold mt-3">Accesso Limitato</h6>
                  <p className="small text-muted">
                    Solo personale autorizzato può accedere ai dati, con log di audit completi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Diritti GDPR */}
        <div className="card border-0 shadow-lg rounded-4 mb-5">
          <div className="card-header bg-gradient-danger text-white border-0 rounded-top-4 p-4">
            <div className="d-flex align-items-center">
              <FaGavel className="me-3" size={24} />
              <h4 className="mb-0">5. I Tuoi Diritti (GDPR)</h4>
            </div>
          </div>
          <div className="card-body p-5">
            <div className="alert alert-info border-0 rounded-3 mb-4">
              <FaInfoCircle className="me-2" />
              <strong>Hai pieno controllo sui tuoi dati.</strong> Ecco cosa puoi fare:
            </div>
            
            <div className="row g-4">
              <div className="col-md-6">
                <div className="right-item">
                  <h6 className="fw-bold text-primary">👁️ Diritto di Accesso</h6>
                  <p className="small">Richiedere copia di tutti i dati che abbiamo su di te</p>
                </div>
                <div className="right-item">
                  <h6 className="fw-bold text-success">✏️ Diritto di Rettifica</h6>
                  <p className="small">Correggere informazioni inesatte o incomplete</p>
                </div>
                <div className="right-item">
                  <h6 className="fw-bold text-danger">🗑️ Diritto alla Cancellazione</h6>
                  <p className="small">Richiedere l'eliminazione dei tuoi dati ("diritto all'oblio")</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="right-item">
                  <h6 className="fw-bold text-warning">⏸️ Diritto di Limitazione</h6>
                  <p className="small">Limitare il trattamento in specifiche circostanze</p>
                </div>
                <div className="right-item">
                  <h6 className="fw-bold text-info">📁 Diritto di Portabilità</h6>
                  <p className="small">Ricevere i tuoi dati in formato strutturato</p>
                </div>
                <div className="right-item">
                  <h6 className="fw-bold text-secondary">🚫 Diritto di Opposizione</h6>
                  <p className="small">Opporti al trattamento per marketing diretto</p>
                </div>
              </div>
            </div>
            
            <div className="alert alert-warning border-0 rounded-3 mt-4">
              <div className="d-flex align-items-center">
                <FaExclamationTriangle className="me-3 text-warning" />
                <div>
                  <strong>Come Esercitare i Tuoi Diritti:</strong><br />
                  Invia una richiesta a <strong>privacy@softmatch.it</strong> o 
                  usa il pulsante "Cancella Account" nel tuo profilo. Risponderemo entro 30 giorni.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conservazione e Cookie */}
        <div className="row g-4 mb-5">
          <div className="col-lg-6">
            <div className="card border-0 shadow-lg rounded-4 h-100">
              <div className="card-header bg-light border-0 rounded-top-4 p-4">
                <h5 className="mb-0 text-primary">
                  <FaCalendarAlt className="me-2" />
                  Conservazione Dati
                </h5>
              </div>
              <div className="card-body p-4">
                <ul className="list-unstyled">
                  <li className="mb-3">
                    <strong>Account attivi:</strong> Finché mantieni l'account
                  </li>
                  <li className="mb-3">
                    <strong>Progetti completati:</strong> 5 anni per fini contabili
                  </li>
                  <li className="mb-3">
                    <strong>Log di sicurezza:</strong> 2 anni massimo
                  </li>
                  <li className="mb-3">
                    <strong>Cancellazione:</strong> Entro 30 giorni dalla richiesta
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6">
            <div className="card border-0 shadow-lg rounded-4 h-100">
              <div className="card-header bg-light border-0 rounded-top-4 p-4">
                <h5 className="mb-0 text-warning">
                  <FaInfoCircle className="me-2" />
                  Cookie e Tecnologie
                </h5>
              </div>
              <div className="card-body p-4">
                <p className="small mb-3">Utilizziamo cookie per:</p>
                <ul className="list-unstyled small">
                  <li className="mb-2">🔐 <strong>Tecnici:</strong> Autenticazione e sicurezza</li>
                  <li className="mb-2">📊 <strong>Analitici:</strong> Miglioramento servizi</li>
                  <li className="mb-2">⚙️ <strong>Funzionali:</strong> Preferenze utente</li>
                </ul>
                <p className="small text-muted">
                  Puoi gestire i cookie dalle impostazioni del browser.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contatti */}
        <div className="card border-0 shadow-lg rounded-4 bg-light">
          <div className="card-body p-5 text-center">
            <FaEnvelope size={48} className="text-primary mb-3" />
            <h4 className="fw-bold text-primary mb-3">Hai Domande sulla Privacy?</h4>
            <p className="mb-4">
              Il nostro team privacy è a disposizione per qualsiasi chiarimento o richiesta.
            </p>
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="contact-info">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <strong>📧 Email Privacy:</strong><br />
                      privacy@softmatch.it
                    </div>
                    <div className="col-md-6">
                      <strong>⏰ Tempi Risposta:</strong><br />
                      Entro 30 giorni (GDPR)
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="alert alert-success border-0 rounded-3 mt-4">
              <small>
                <FaShieldAlt className="me-2" />
                <strong>Sicurezza garantita:</strong> Non condividiamo mai i tuoi dati con terze parti per scopi commerciali. 
                La tua privacy è il nostro impegno più importante.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;

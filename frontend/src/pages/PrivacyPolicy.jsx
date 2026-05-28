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
import '../styles/DarkPage.css';

function PrivacyPolicy() {
  return (
    <div className="dark-page">
      <div className="dark-hero">
        <div className="container">
          <div className="d-flex align-items-center justify-content-center mb-4 gap-3">
            <div className="dark-icon-circle">
              <FaShieldAlt size={24} style={{ color: '#0071e3' }} />
            </div>
            <span className="dark-badge">PRIVACY</span>
          </div>
          <h1>Privacy Policy</h1>
          <p>
            La tua privacy è importante per noi. Spieghiamo come raccogliamo, utilizziamo e proteggiamo 
            i tuoi dati personali in conformità al <strong>GDPR</strong>.
          </p>
          <div className="mt-4">
            <span className="dark-badge" style={{ borderColor: 'rgba(255,204,0,0.3)', color: '#ffc107', background: 'rgba(255,204,0,0.08)' }}>
              <FaCalendarAlt className="me-2" />
              Ultimo aggiornamento: Aprile 2026
            </span>
          </div>
        </div>
      </div>

      <div className="container py-5">
        {/* 1. Informazioni Generali */}
        <div className="dark-card mb-5 overflow-hidden">
          <div className="p-4" style={{ background: 'rgba(0,113,227,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="d-flex align-items-center">
              <FaInfoCircle style={{ color: '#0071e3' }} className="me-3" size={22} />
              <h4 className="dark-title mb-0">1. Informazioni Generali</h4>
            </div>
          </div>
          <div className="p-5">
            <h5 className="dark-title mb-3" style={{ color: '#0071e3' }}>Chi Siamo</h5>
            <p className="dark-muted mb-4">
              <strong className="text-white">SoftMatch</strong> è una piattaforma marketplace che connette 
              clienti con sviluppatori professionali per progetti software su misura.
            </p>
            
            <div className="row g-4">
              <div className="col-md-6">
                <h6 className="fw-bold mb-3" style={{ color: '#30c56d' }}>📋 Titolare del Trattamento</h6>
                <ul className="list-unstyled dark-muted" style={{ fontSize: '0.9rem' }}>
                  <li><strong className="text-white">Denominazione:</strong> SoftMatch S.r.l.</li>
                  <li><strong className="text-white">Sede:</strong> Via Roma 123, 00100 Roma (IT)</li>
                  <li><strong className="text-white">Email:</strong> privacy@softmatch.it</li>
                  <li><strong className="text-white">P.IVA:</strong> IT12345678901</li>
                </ul>
              </div>
              <div className="col-md-6">
                <h6 className="fw-bold mb-3" style={{ color: '#00a2ff' }}>⚖️ Base Giuridica</h6>
                <ul className="list-unstyled dark-muted" style={{ fontSize: '0.88rem' }}>
                  <li>• <strong className="text-white">Art. 6(1)(b) GDPR:</strong> Esecuzione contratto</li>
                  <li>• <strong className="text-white">Art. 6(1)(f) GDPR:</strong> Legittimo interesse</li>
                  <li>• <strong className="text-white">Art. 6(1)(a) GDPR:</strong> Consenso esplicito</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Dati Raccolti */}
        <div className="dark-card mb-5 overflow-hidden">
          <div className="p-4" style={{ background: 'rgba(48,197,109,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="d-flex align-items-center">
              <FaDatabase style={{ color: '#30c56d' }} className="me-3" size={22} />
              <h4 className="dark-title mb-0">2. Dati che Raccogliamo</h4>
            </div>
          </div>
          <div className="p-5">
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="dark-card p-4 mb-4">
                  <h6 className="fw-bold mb-3" style={{ color: '#0071e3' }}>
                    <FaUserShield className="me-2" />
                    Dati di Registrazione
                  </h6>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <span className="badge me-2" style={{ background: 'rgba(0,113,227,0.12)', color: '#0071e3' }}>Obbligatorio</span>
                      <span className="dark-muted">Username, email, password</span>
                    </li>
                    <li className="mb-2">
                      <span className="badge me-2" style={{ background: 'rgba(255,255,255,0.05)', color: '#86868b' }}>Facoltativo</span>
                      <span className="dark-muted">Nome, cognome, ruolo professionale</span>
                    </li>
                  </ul>
                </div>
                
                <div className="dark-card p-4">
                  <h6 className="fw-bold mb-3" style={{ color: '#30c56d' }}>
                    <FaEnvelope className="me-2" />
                    Dati di Comunicazione
                  </h6>
                  <ul className="list-unstyled dark-muted" style={{ fontSize: '0.88rem' }}>
                    <li className="mb-2">• Messaggi nella chat di progetto</li>
                    <li className="mb-2">• Recensioni e feedback</li>
                    <li className="mb-2">• Richieste di supporto</li>
                  </ul>
                </div>
              </div>
              
              <div className="col-lg-6">
                <div className="dark-card p-4 mb-4">
                  <h6 className="fw-bold mb-3" style={{ color: '#00a2ff' }}>
                    <FaDatabase className="me-2" />
                    Dati di Progetto
                  </h6>
                  <ul className="list-unstyled dark-muted" style={{ fontSize: '0.88rem' }}>
                    <li className="mb-2">• Descrizioni progetti e richieste</li>
                    <li className="mb-2">• Offerte e proposte commerciali</li>
                    <li className="mb-2">• File e documentazione condivisa</li>
                    <li className="mb-2">• Cronologia transazioni</li>
                  </ul>
                </div>
                
                <div className="dark-card p-4">
                  <h6 className="fw-bold mb-3" style={{ color: '#ffc107' }}>
                    <FaLock className="me-2" />
                    Dati Automatici
                  </h6>
                  <ul className="list-unstyled dark-muted" style={{ fontSize: '0.88rem' }}>
                    <li className="mb-2">• Indirizzo IP e geolocalizzazione</li>
                    <li className="mb-2">• Log di accesso e navigazione</li>
                    <li className="mb-2">• Cookie e preferenze browser</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Finalità */}
        <div className="dark-card mb-5 overflow-hidden">
          <div className="p-4" style={{ background: 'rgba(0,162,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="d-flex align-items-center">
              <FaGavel style={{ color: '#00a2ff' }} className="me-3" size={22} />
              <h4 className="dark-title mb-0">3. Perché Trattiamo i Tuoi Dati</h4>
            </div>
          </div>
          <div className="p-5">
            <div className="row g-4">
              <div className="col-md-6">
                <div className="dark-card p-4 h-100">
                  <h6 className="fw-bold mb-3" style={{ color: '#0071e3' }}>🎯 Servizi Principali</h6>
                  <ul className="dark-muted" style={{ fontSize: '0.88rem' }}>
                    <li>Gestione account e autenticazione</li>
                    <li>Facilitare matching cliente-sviluppatore</li>
                    <li>Supervisione progetti e pagamenti</li>
                    <li>Chat sicura e documentazione</li>
                    <li>Sistema recensioni e reputazione</li>
                  </ul>
                </div>
              </div>
              <div className="col-md-6">
                <div className="dark-card p-4 h-100">
                  <h6 className="fw-bold mb-3" style={{ color: '#30c56d' }}>📊 Miglioramento Servizi</h6>
                  <ul className="dark-muted" style={{ fontSize: '0.88rem' }}>
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

        {/* 4. Sicurezza */}
        <div className="dark-card mb-5 overflow-hidden">
          <div className="p-4" style={{ background: 'rgba(255,204,0,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="d-flex align-items-center">
              <FaShieldAlt style={{ color: '#ffc107' }} className="me-3" size={22} />
              <h4 className="dark-title mb-0">4. Come Proteggiamo i Tuoi Dati</h4>
            </div>
          </div>
          <div className="p-5">
            <div className="row g-4">
              {[
                { icon: <FaLock size={28} />, color: '#0071e3', title: 'Crittografia Avanzata', desc: 'Tutti i dati sono crittografati con algoritmi AES-256 e trasmessi via HTTPS/TLS.' },
                { icon: <FaDatabase size={28} />, color: '#30c56d', title: 'Server Sicuri', desc: 'Data center certificati ISO 27001 con accesso fisico limitato e monitoraggio 24/7.' },
                { icon: <FaUserShield size={28} />, color: '#00a2ff', title: 'Accesso Limitato', desc: 'Solo personale autorizzato può accedere ai dati, con log di audit completi.' },
              ].map((item, i) => (
                <div key={i} className="col-lg-4">
                  <div className="dark-card p-4 text-center h-100">
                    <div className="dark-icon-circle mx-auto mb-3" style={{ width: 60, height: 60, background: `${item.color}15` }}>
                      <span style={{ color: item.color }}>{item.icon}</span>
                    </div>
                    <h6 className="dark-title fw-bold mt-3">{item.title}</h6>
                    <p className="dark-muted small mb-0">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Diritti GDPR */}
        <div className="dark-card mb-5 overflow-hidden">
          <div className="p-4" style={{ background: 'rgba(255,59,48,0.08)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="d-flex align-items-center">
              <FaGavel style={{ color: '#ff3b30' }} className="me-3" size={22} />
              <h4 className="dark-title mb-0">5. I Tuoi Diritti (GDPR)</h4>
            </div>
          </div>
          <div className="p-5">
            <div className="d-flex align-items-start gap-3 p-4 rounded-3 mb-4" style={{ background: 'rgba(0,162,255,0.08)', border: '1px solid rgba(0,162,255,0.15)' }}>
              <FaInfoCircle style={{ color: '#00a2ff' }} className="flex-shrink-0 mt-1" />
              <div>
                <strong className="text-white">Hai pieno controllo sui tuoi dati.</strong>
                <span className="dark-muted"> Ecco cosa puoi fare:</span>
              </div>
            </div>
            
            <div className="row g-4">
              <div className="col-md-6">
                {[
                  { title: '👁️ Diritto di Accesso', desc: 'Richiedere copia di tutti i dati che abbiamo su di te', color: '#0071e3' },
                  { title: '✏️ Diritto di Rettifica', desc: 'Correggere informazioni inesatte o incomplete', color: '#30c56d' },
                  { title: '🗑️ Diritto alla Cancellazione', desc: 'Richiedere l\'eliminazione dei tuoi dati ("diritto all\'oblio")', color: '#ff3b30' },
                ].map((item, i) => (
                  <div key={i} className="dark-feature mb-3">
                    <div className="dark-feature-icon" style={{ background: `${item.color}15`, color: item.color }}>
                      <span style={{ fontSize: '0.9rem' }}>{item.title.split(' ')[0]}</span>
                    </div>
                    <div>
                      <h6 className="fw-bold dark-title" style={{ fontSize: '0.88rem' }}>{item.title}</h6>
                      <p className="dark-muted small mb-0">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="col-md-6">
                {[
                  { title: '⏸️ Diritto di Limitazione', desc: 'Limitare il trattamento in specifiche circostanze', color: '#ffc107' },
                  { title: '📁 Diritto di Portabilità', desc: 'Ricevere i tuoi dati in formato strutturato', color: '#00a2ff' },
                  { title: '🚫 Diritto di Opposizione', desc: 'Opporti al trattamento per marketing diretto', color: '#86868b' },
                ].map((item, i) => (
                  <div key={i} className="dark-feature mb-3">
                    <div className="dark-feature-icon" style={{ background: `${item.color}15`, color: item.color }}>
                      <span style={{ fontSize: '0.9rem' }}>{item.title.split(' ')[0]}</span>
                    </div>
                    <div>
                      <h6 className="fw-bold dark-title" style={{ fontSize: '0.88rem' }}>{item.title}</h6>
                      <p className="dark-muted small mb-0">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="d-flex align-items-start gap-3 p-4 rounded-3 mt-4" style={{ background: 'rgba(255,204,0,0.08)', border: '1px solid rgba(255,204,0,0.15)' }}>
              <FaExclamationTriangle style={{ color: '#ffc107' }} className="flex-shrink-0 mt-1" />
              <div>
                <strong className="text-white">Come Esercitare i Tuoi Diritti:</strong><br />
                <span className="dark-muted">Invia una richiesta a <strong className="text-white">privacy@softmatch.it</strong> o 
                usa il pulsante "Cancella Account" nel tuo profilo. Risponderemo entro 30 giorni.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Conservazione e Cookie */}
        <div className="row g-4 mb-5">
          <div className="col-lg-6">
            <div className="dark-card h-100 overflow-hidden">
              <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <h5 className="dark-title mb-0">
                  <FaCalendarAlt className="me-2" style={{ color: '#0071e3' }} />
                  Conservazione Dati
                </h5>
              </div>
              <div className="p-4">
                <ul className="list-unstyled dark-muted" style={{ fontSize: '0.9rem' }}>
                  <li className="mb-3"><strong className="text-white">Account attivi:</strong> Finché mantieni l'account</li>
                  <li className="mb-3"><strong className="text-white">Progetti completati:</strong> 5 anni per fini contabili</li>
                  <li className="mb-3"><strong className="text-white">Log di sicurezza:</strong> 2 anni massimo</li>
                  <li className="mb-3"><strong className="text-white">Cancellazione:</strong> Entro 30 giorni dalla richiesta</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6">
            <div className="dark-card h-100 overflow-hidden">
              <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <h5 className="dark-title mb-0">
                  <FaInfoCircle className="me-2" style={{ color: '#ffc107' }} />
                  Cookie e Tecnologie
                </h5>
              </div>
              <div className="p-4">
                <p className="dark-muted small mb-3">Utilizziamo cookie per:</p>
                <ul className="list-unstyled dark-muted small">
                  <li className="mb-2">🔐 <strong className="text-white">Tecnici:</strong> Autenticazione e sicurezza</li>
                  <li className="mb-2">📊 <strong className="text-white">Analitici:</strong> Miglioramento servizi</li>
                  <li className="mb-2">⚙️ <strong className="text-white">Funzionali:</strong> Preferenze utente</li>
                </ul>
                <p className="dark-muted small mb-0">
                  Puoi gestire i cookie dalle impostazioni del browser.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contatti */}
        <div className="dark-card overflow-hidden text-center p-5">
          <FaEnvelope size={48} style={{ color: 'rgba(0,113,227,0.3)' }} className="mb-3" />
          <h4 className="dark-title mb-3" style={{ color: '#0071e3' }}>Hai Domande sulla Privacy?</h4>
          <p className="dark-muted mb-4">
            Il nostro team privacy è a disposizione per qualsiasi chiarimento o richiesta.
          </p>
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="row g-3 dark-muted" style={{ fontSize: '0.9rem' }}>
                <div className="col-md-6">
                  <strong className="text-white">📧 Email Privacy:</strong><br />
                  privacy@softmatch.it
                </div>
                <div className="col-md-6">
                  <strong className="text-white">⏰ Tempi Risposta:</strong><br />
                  Entro 30 giorni (GDPR)
                </div>
              </div>
            </div>
          </div>
          
          <div className="d-flex align-items-start gap-3 p-4 rounded-3 mt-4 text-start mx-auto" 
            style={{ maxWidth: '600px', background: 'rgba(48,197,109,0.08)', border: '1px solid rgba(48,197,109,0.15)' }}>
            <FaShieldAlt style={{ color: '#30c56d' }} className="flex-shrink-0 mt-1" />
            <small className="dark-muted">
              <strong className="text-white">Sicurezza garantita:</strong> Non condividiamo mai i tuoi dati con terze parti per scopi commerciali. 
              La tua privacy è il nostro impegno più importante.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;

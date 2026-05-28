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
import PageHeader from '../components/PageHeader';
import '../styles/MacStyle.css';

function ChiSiamo() {
  return (
    <div className="mac-page-wrapper pt-5">
      {/* Hero Section - Mac Style */}
      <PageHeader 
        title="La rivoluzione dello sviluppo software"
        subtitle="SoftMatch è l'ecosistema digitale dove le idee diventano codice. Connettiamo visione e competenza per creare il software del futuro, con la semplicità e l'eleganza che meritano i grandi progetti."
        badge="CHI SIAMO"
        icon={FaRocket}
        theme="primary"
      />

      <div className="container mb-5">
        <div className="row align-items-center">
          <div className="col-lg-7">
            <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-lg-start">
              <span className="mac-badge bg-light text-dark shadow-sm">🛡️ Sicurezza Apple-grade</span>
              <span className="mac-badge bg-light text-dark shadow-sm">🤝 Community Elite</span>
              <span className="mac-badge bg-light text-dark shadow-sm">💎 Qualità Garantita</span>
            </div>
          </div>
          <div className="col-lg-5 text-center mt-5 mt-lg-0">
            <div className="mac-glass-card p-4">
              <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                <FaGlobe size={32} className="text-primary" />
              </div>
              <h4 className="mac-title mb-2 h5">La Nostra Missione</h4>
              <p className="mac-subtitle mb-0 small">
                Democratizzare l'accesso allo sviluppo software di alta qualità, 
                eliminando le barriere tra chi ha una visione e chi ha il talento per realizzarla.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        {/* La Nostra Storia - Mac Style */}
        <div className="mac-glass-card p-5 mb-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="pe-lg-5">
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-warning bg-opacity-10 p-2 rounded-3 me-3">
                    <FaLightbulb className="text-warning" size={24} />
                  </div>
                  <h2 className="mac-title mb-0">La Nostra Storia</h2>
                </div>
                
                <p className="mac-subtitle mb-4">
                  SoftMatch nasce dall'esigenza di risolvere i problemi cronici dello sviluppo software: 
                  mancanza di trasparenza, ritardi e incertezza sui pagamenti. 
                  Abbiamo costruito quello che avremmo voluto usare noi stessi.
                </p>
                
                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <div className="p-3 bg-white bg-opacity-50 rounded-4 text-center">
                      <h3 className="mac-title text-success mb-1">94%</h3>
                      <small className="mac-subtitle x-small fw-bold">PROGETTI COMPLETATI</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 bg-white bg-opacity-50 rounded-4 text-center">
                      <h3 className="mac-title text-info mb-1">4.8/5</h3>
                      <small className="mac-subtitle x-small fw-bold">RATING UTENTI</small>
                    </div>
                  </div>
                </div>
                
                <h4 className="mac-title mb-3 text-primary">Un Nuovo Standard</h4>
                <p className="mac-subtitle mb-0">
                  Ogni riga di codice, ogni transazione e ogni interazione su SoftMatch 
                  è pensata per costruire fiducia. Non siamo solo una piattaforma, 
                  siamo il partner tecnologico della tua crescita.
                </p>
              </div>
            </div>
            
            <div className="col-lg-6 mt-5 mt-lg-0">
              <div className="position-relative">
                <div className="bg-primary bg-opacity-10 rounded-circle position-absolute top-50 start-50 translate-middle" style={{ width: '300px', height: '300px' }}></div>
                <div className="text-center position-relative">
                  <FaCode size={180} className="text-primary opacity-25" />
                  <div className="mac-glass-card p-4 position-absolute top-50 start-50 translate-middle shadow-lg" style={{ minWidth: '200px' }}>
                    <h5 className="mac-title text-primary mb-0">Innovazione</h5>
                    <small className="mac-subtitle">Senza compromessi</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* I Nostri Valori - Widget Grid */}
        <div className="text-center mb-5 pt-5">
          <h2 className="mac-title mb-2">I Nostri Valori</h2>
          <p className="mac-subtitle">Ciò che ci rende diversi dagli altri</p>
        </div>
        
        <div className="row g-4 mb-5 pb-5">
          <div className="col-lg-4">
            <div className="mac-glass-card h-100 p-4 text-center">
              <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex p-3 mb-4">
                <FaShieldAlt className="text-danger" size={24} />
              </div>
              <h5 className="mac-title mb-3">Sicurezza Totale</h5>
              <p className="mac-subtitle small">
                Transazioni protette e supervisione costante. La tua proprietà intellettuale 
                e il tuo budget sono al sicuro con noi.
              </p>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="mac-glass-card h-100 p-4 text-center">
              <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex p-3 mb-4">
                <FaHandshake className="text-success" size={24} />
              </div>
              <h5 className="mac-title mb-3">Trasparenza</h5>
              <p className="mac-subtitle small">
                Nessun costo nascosto. Comunicazione diretta e chiara tra cliente e fornitore 
                per tutta la durata del progetto.
              </p>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="mac-glass-card h-100 p-4 text-center">
              <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex p-3 mb-4">
                <FaUsers className="text-info" size={24} />
              </div>
              <h5 className="mac-title mb-3">Eccellenza</h5>
              <p className="mac-subtitle small">
                Selezioniamo solo i migliori talenti. La qualità del codice è il nostro 
                biglietto da visita nel mondo.
              </p>
            </div>
          </div>
        </div>

        {/* Come Funzioniamo - Mac Style */}
        <div className="mac-glass-card p-5 mb-5 bg-dark bg-opacity-5">
          <div className="text-center mb-5">
            <h2 className="mac-title mb-2">Come Lavoriamo</h2>
            <p className="mac-subtitle">Il nostro approccio unico per il tuo successo</p>
          </div>
          
          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="text-center p-3">
                <div className="bg-white rounded-circle shadow-sm d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
                  <FaSearch className="text-primary" size={24} />
                </div>
                <h6 className="mac-title mb-2">Verifica</h6>
                <p className="mac-subtitle small">Processo di selezione rigoroso per ogni fornitore.</p>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <div className="text-center p-3">
                <div className="bg-white rounded-circle shadow-sm d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
                  <FaHandshake className="text-primary" size={24} />
                </div>
                <h6 className="mac-title mb-2">Matching</h6>
                <p className="mac-subtitle small">Algoritmi per connetterti al talento ideale.</p>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <div className="text-center p-3">
                <div className="bg-white rounded-circle shadow-sm d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
                  <FaEye className="text-primary" size={24} />
                </div>
                <h6 className="mac-title mb-2">Monitoraggio</h6>
                <p className="mac-subtitle small">Supervisione costante su ogni fase del progetto.</p>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <div className="text-center p-3">
                <div className="bg-white rounded-circle shadow-sm d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
                  <FaAward className="text-primary" size={24} />
                </div>
                <h6 className="mac-title mb-2">Qualità</h6>
                <p className="mac-subtitle small">Consegna garantita secondo i massimi standard.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy e Sicurezza - Mac Style */}
        <div className="mac-glass-card p-5 mb-5 border-success border-opacity-10">
          <div className="row align-items-center">
            <div className="col-lg-2 text-center mb-4 mb-lg-0">
              <FaLock size={80} className="text-success opacity-50" />
            </div>
            <div className="col-lg-10">
              <h3 className="mac-title mb-3">La tua sicurezza è la nostra priorità</h3>
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <FaShieldAlt className="text-success me-3 mt-1" />
                    <div>
                      <h6 className="mac-title mb-1 small">Crittografia Avanzata</h6>
                      <p className="mac-subtitle x-small mb-0">Tutti i dati e le comunicazioni sono protetti da protocolli di sicurezza leader del settore.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <FaUserShield className="text-success me-3 mt-1" />
                    <div>
                      <h6 className="mac-title mb-1 small">GDPR Compliance</h6>
                      <p className="mac-subtitle x-small mb-0">Rispettiamo totalmente la tua privacy secondo le normative europee vigenti.</p>
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

import { useState } from 'react';
import { 
  FaRocket, 
  FaShieldAlt, 
  FaUsers, 
  FaHandshake, 
  FaEuroSign,
  FaCode,
  FaLaptop,
  FaMobile,
  FaStore,
  FaChartLine,
  FaCog,
  FaGlobe,
  FaUserTie,
  FaUser,
  FaCrown,
  FaComments,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLightbulb,
  FaArrowRight,
  FaPlay,
  FaBolt,
  FaAward,
  FaHeart,
  FaStar
} from 'react-icons/fa';
import './ScopoDelSito.css';

function ScopoDelSito() {
  const [activeUserType, setActiveUserType] = useState('cliente');

  const tipiProgetto = [
    {
      tipo: 'sito_web',
      nome: 'Siti Web',
      icon: <FaGlobe />,
      esempi: ['Sito aziendale', 'Portfolio personale', 'Blog professionale', 'Landing page'],
      descrizione: 'Siti web responsive e moderni per la tua presenza online'
    },
    {
      tipo: 'app_mobile',
      nome: 'App Mobile',
      icon: <FaMobile />,
      esempi: ['App iOS/Android', 'App cross-platform', 'PWA', 'App aziendali'],
      descrizione: 'Applicazioni mobile native e cross-platform per ogni esigenza'
    },
    {
      tipo: 'ecommerce',
      nome: 'E-commerce',
      icon: <FaStore />,
      esempi: ['Negozio online', 'Marketplace', 'Catalogo prodotti', 'Sistema ordini'],
      descrizione: 'Piattaforme e-commerce complete per vendere online'
    },
    {
      tipo: 'gestionale',
      nome: 'Software Gestionali',
      icon: <FaChartLine />,
      esempi: ['CRM', 'ERP', 'Sistema HR', 'Gestione magazzino'],
      descrizione: 'Software per automatizzare e ottimizzare i processi aziendali'
    },
    {
      tipo: 'personalizzato',
      nome: 'Software Personalizzato',
      icon: <FaCog />,
      esempi: ['Tool specifici', 'Automazioni', 'Integrazioni API', 'Script'],
      descrizione: 'Soluzioni software su misura per le tue esigenze specifiche'
    }
  ];

  const processoCliente = [
    {
      step: 1,
      titolo: 'Descrivi il Tuo Progetto',
      descrizione: 'Compila il form dettagliato specificando cosa vuoi realizzare',
      azioni: ['Scegli il tipo di software', 'Descrivi le funzionalità', 'Indica il budget', 'Specifica i tempi'],
      icon: <FaLightbulb />
    },
    {
      step: 2,
      titolo: 'Ricevi Offerte Qualificate',
      descrizione: 'Sviluppatori verificati inviano proposte dettagliate per il tuo progetto',
      azioni: ['Confronta le offerte', 'Valuta portfolio', 'Leggi recensioni', 'Fai domande'],
      icon: <FaUsers />
    },
    {
      step: 3,
      titolo: 'Scegli il Fornitore',
      descrizione: 'Seleziona lo sviluppatore che meglio soddisfa le tue esigenze',
      azioni: ['Valuta competenze', 'Controlla disponibilità', 'Negozia dettagli', 'Accetta offerta'],
      icon: <FaHandshake />
    },
    {
      step: 4,
      titolo: 'Supervisione Sicura',
      descrizione: 'Il progetto viene eseguito con supervisione admin e pagamenti protetti',
      azioni: ['Comunica via chat', 'Monitora progressi', 'Approva milestone', 'Paga in sicurezza'],
      icon: <FaShieldAlt />
    }
  ];

  const processoFornitore = [
    {
      step: 1,
      titolo: 'Cerca Progetti Interessanti',
      descrizione: 'Esplora i progetti pubblicati dai clienti e trova quelli adatti alle tue competenze',
      azioni: ['Filtra per tecnologie', 'Controlla budget', 'Valuta complessità', 'Leggi requisiti'],
      icon: <FaCode />
    },
    {
      step: 2,
      titolo: 'Invia Offerte Competitive',
      descrizione: 'Proponi soluzioni dettagliate mostrando le tue competenze e portfolio',
      azioni: ['Descrivi approccio', 'Mostra portfolio', 'Proponi timeline', 'Specifica prezzo'],
      icon: <FaRocket />
    },
    {
      step: 3,
      titolo: 'Inizia il Progetto',
      descrizione: 'Una volta selezionato, inizia lo sviluppo seguendo le milestone concordate',
      azioni: ['Pianifica sviluppo', 'Comunica progressi', 'Consegna milestone', 'Richiedi feedback'],
      icon: <FaPlay />
    },
    {
      step: 4,
      titolo: 'Ricevi Pagamenti Sicuri',
      descrizione: 'I pagamenti sono garantiti e protetti dalla piattaforma',
      azioni: ['Completa milestone', 'Ricevi approvazioni', 'Consegna finale', 'Incassa il 95%'],
      icon: <FaEuroSign />
    }
  ];

  return (
    <div className="min-vh-100 bg-gradient scopo-page">
      {/* Hero Section */}
      <div className="hero-section bg-primary text-white position-relative overflow-hidden">
        <div className="container py-5 position-relative z-2">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="display-3 fw-bold mb-4">
                <FaRocket className="me-3 text-warning" />
                Scopo del Sito
              </h1>
              <p className="lead mb-5 opacity-90">
                Comprendiamo esattamente <strong>come funziona la nostra piattaforma</strong>, 
                cosa offriamo a <strong>clienti</strong> e <strong>sviluppatori</strong>, 
                e come garantiamo <strong>sicurezza</strong> e <strong>qualità</strong> in ogni progetto.
              </p>
              
              {/* Toggle User Type */}
              <div className="user-type-toggle mb-4">
                <div className="btn-group" role="group">
                  <button 
                    className={`btn btn-lg ${activeUserType === 'cliente' ? 'btn-warning' : 'btn-outline-light'}`}
                    onClick={() => setActiveUserType('cliente')}
                  >
                    <FaUser className="me-2" />
                    Sono un Cliente
                  </button>
                  <button 
                    className={`btn btn-lg ${activeUserType === 'fornitore' ? 'btn-warning' : 'btn-outline-light'}`}
                    onClick={() => setActiveUserType('fornitore')}
                  >
                    <FaUserTie className="me-2" />
                    Sono uno Sviluppatore
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-decoration"></div>
      </div>

      <div className="container py-5">
        {/* Tipi di Progetti Supportati */}
        <div className="section mb-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-primary mb-3">
              <FaCode className="me-3 text-info" />
              Cosa Puoi Realizzare
            </h2>
            <p className="lead text-muted">Tipologie di software e progetti supportati dalla nostra piattaforma</p>
          </div>
          
          <div className="row g-4">
            {tipiProgetto.map((tipo, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div className="project-type-card">
                  <div className="project-icon">
                    {tipo.icon}
                  </div>
                  <h5 className="fw-bold mb-3">{tipo.nome}</h5>
                  <p className="text-muted mb-3">{tipo.descrizione}</p>
                  <div className="esempi-list">
                    <h6 className="small fw-bold text-primary mb-2">Esempi:</h6>
                    <ul className="list-unstyled">
                      {tipo.esempi.map((esempio, idx) => (
                        <li key={idx} className="small text-muted mb-1">
                          <FaArrowRight className="me-2 text-success" size={12} />
                          {esempio}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Processo Dettagliato */}
        <div className="section mb-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-primary mb-3">
              {activeUserType === 'cliente' ? (
                <>
                  <FaUser className="me-3 text-success" />
                  Come Funziona per i Clienti
                </>
              ) : (
                <>
                  <FaUserTie className="me-3 text-info" />
                  Come Funziona per gli Sviluppatori
                </>
              )}
            </h2>
            <p className="lead text-muted">
              {activeUserType === 'cliente' 
                ? 'Il processo completo per realizzare il tuo progetto software'
                : 'Come trovare progetti interessanti e costruire la tua carriera freelance'
              }
            </p>
          </div>
          
          <div className="processo-timeline">
            {(activeUserType === 'cliente' ? processoCliente : processoFornitore).map((step, index) => (
              <div key={index} className="processo-step">
                <div className="step-connector"></div>
                <div className="step-content">
                  <div className="step-header">
                    <div className="step-number">{step.step}</div>
                    <div className="step-icon">
                      {step.icon}
                    </div>
                  </div>
                  <div className="step-body">
                    <h4 className="fw-bold mb-3">{step.titolo}</h4>
                    <p className="text-muted mb-4">{step.descrizione}</p>
                    <div className="step-actions">
                      <h6 className="small fw-bold text-primary mb-2">Azioni da compiere:</h6>
                      <div className="row g-2">
                        {step.azioni.map((azione, idx) => (
                          <div key={idx} className="col-md-6">
                            <div className="action-item">
                              <FaCheckCircle className="me-2 text-success" size={14} />
                              <span className="small">{azione}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Garanzie e Sicurezza */}
        <div className="section mb-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-primary mb-3">
              <FaShieldAlt className="me-3 text-success" />
              Le Nostre Garanzie
            </h2>
            <p className="lead text-muted">Cosa ti garantiamo per una collaborazione sicura e di successo</p>
          </div>
          
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="garanzia-card cliente-garanzie">
                <div className="garanzia-header">
                  <FaUser size={30} className="text-success" />
                  <h5 className="fw-bold">Per i Clienti</h5>
                </div>
                <div className="garanzie-list">
                  <div className="garanzia-item">
                    <FaShieldAlt className="text-success me-3" />
                    <div>
                      <h6 className="fw-bold mb-1">Pagamento Protetto</h6>
                      <small className="text-muted">Paghi solo quando sei soddisfatto del lavoro ricevuto</small>
                    </div>
                  </div>
                  <div className="garanzia-item">
                    <FaCrown className="text-warning me-3" />
                    <div>
                      <h6 className="fw-bold mb-1">Supervisione Admin</h6>
                      <small className="text-muted">Ogni progetto è supervisionato per garantire qualità e rispetto degli accordi</small>
                    </div>
                  </div>
                  <div className="garanzia-item">
                    <FaComments className="text-info me-3" />
                    <div>
                      <h6 className="fw-bold mb-1">Comunicazione Trasparente</h6>
                      <small className="text-muted">Chat supervisionata per evitare malintesi e proteggere entrambe le parti</small>
                    </div>
                  </div>
                  <div className="garanzia-item">
                    <FaAward className="text-purple me-3" />
                    <div>
                      <h6 className="fw-bold mb-1">Sviluppatori Verificati</h6>
                      <small className="text-muted">Solo professionisti con competenze certificate e portfolio verificato</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="garanzia-card fornitore-garanzie">
                <div className="garanzia-header">
                  <FaUserTie size={30} className="text-primary" />
                  <h5 className="fw-bold">Per gli Sviluppatori</h5>
                </div>
                <div className="garanzie-list">
                  <div className="garanzia-item">
                    <FaEuroSign className="text-success me-3" />
                    <div>
                      <h6 className="fw-bold mb-1">Pagamento Garantito</h6>
                      <small className="text-muted">Una volta completato il lavoro, il pagamento è assicurato (95% del totale)</small>
                    </div>
                  </div>
                  <div className="garanzia-item">
                    <FaBolt className="text-warning me-3" />
                    <div>
                      <h6 className="fw-bold mb-1">Progetti Pre-finanziati</h6>
                      <small className="text-muted">I clienti depositano i fondi prima dell'inizio, eliminando il rischio di mancato pagamento</small>
                    </div>
                  </div>
                  <div className="garanzia-item">
                    <FaHandshake className="text-info me-3" />
                    <div>
                      <h6 className="fw-bold mb-1">Clienti Verificati</h6>
                      <small className="text-muted">Solo clienti seri con identità verificata e budget confermato</small>
                    </div>
                  </div>
                  <div className="garanzia-item">
                    <FaStar className="text-warning me-3" />
                    <div>
                      <h6 className="fw-bold mb-1">Sistema di Reputazione</h6>
                      <small className="text-muted">Costruisci la tua reputazione con recensioni verificate per attrarre clienti migliori</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Commissioni e Costi */}
        <div className="section mb-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-primary mb-3">
              <FaEuroSign className="me-3 text-success" />
              Commissioni e Costi
            </h2>
            <p className="lead text-muted">Trasparenza totale sui costi - nessuna sorpresa</p>
          </div>
          
          <div className="row g-4 justify-content-center">
            <div className="col-lg-8">
              <div className="pricing-card">
                <div className="pricing-header">
                  <h4 className="fw-bold text-center mb-4">
                    <FaHeart className="text-danger me-2" />
                    Modello di Business Trasparente
                  </h4>
                </div>
                
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="pricing-section cliente-pricing">
                      <h6 className="fw-bold text-success mb-3">
                        <FaUser className="me-2" />
                        Per i Clienti
                      </h6>
                      <div className="pricing-details">
                        <div className="pricing-item">
                          <span className="label">Commissione Piattaforma:</span>
                          <span className="value text-primary fw-bold">+5%</span>
                        </div>
                        <div className="pricing-item">
                          <span className="label">Esempio:</span>
                          <span className="value">Progetto 1000€ = Paghi 1050€</span>
                        </div>
                        <div className="pricing-note">
                          <small className="text-muted">
                            <FaCheckCircle className="text-success me-1" />
                            Include: supervisione admin, garanzie, supporto, infrastruttura sicura
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="pricing-section fornitore-pricing">
                      <h6 className="fw-bold text-primary mb-3">
                        <FaUserTie className="me-2" />
                        Per gli Sviluppatori
                      </h6>
                      <div className="pricing-details">
                        <div className="pricing-item">
                          <span className="label">Ricevi:</span>
                          <span className="value text-success fw-bold">95%</span>
                        </div>
                        <div className="pricing-item">
                          <span className="label">Esempio:</span>
                          <span className="value">Progetto 1000€ = Ricevi 950€</span>
                        </div>
                        <div className="pricing-note">
                          <small className="text-muted">
                            <FaCheckCircle className="text-success me-1" />
                            Include: pagamento garantito, progetti pre-finanziati, supporto clienti
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="alert alert-info border-0 rounded-3 mt-4">
                  <div className="d-flex align-items-center">
                    <FaLightbulb className="text-info me-3" size={24} />
                    <div>
                      <strong>Perché il 5%?</strong> La nostra commissione copre: infrastruttura sicura, 
                      supervisione professionale, supporto 24/7, garanzie sui pagamenti, 
                      sistema di reputazione e tutti i servizi che rendono possibile una collaborazione sicura.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="section">
          <div className="cta-card">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h3 className="fw-bold mb-3">
                  Pronto a Iniziare?
                </h3>
                <p className="lead mb-4">
                  {activeUserType === 'cliente' 
                    ? 'Pubblica il tuo progetto e ricevi offerte da sviluppatori qualificati in 24 ore'
                    : 'Registrati come sviluppatore e inizia a lavorare su progetti interessanti e remunerativi'
                  }
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <a href="/register" className="btn btn-primary btn-lg px-5 rounded-pill">
                    <FaRocket className="me-2" />
                    {activeUserType === 'cliente' ? 'Pubblica Progetto' : 'Diventa Fornitore'}
                  </a>
                  <a href="/chi-siamo" className="btn btn-outline-primary btn-lg px-4 rounded-pill">
                    Scopri di Più
                  </a>
                </div>
              </div>
              <div className="col-lg-4 text-center">
                <div className="cta-illustration">
                  {activeUserType === 'cliente' ? (
                    <FaUser size={80} className="text-success" />
                  ) : (
                    <FaUserTie size={80} className="text-primary" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScopoDelSito; 
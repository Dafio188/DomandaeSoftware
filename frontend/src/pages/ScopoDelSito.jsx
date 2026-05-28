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
  FaLightbulb,
  FaArrowRight,
  FaPlay,
  FaBolt,
  FaAward,
  FaHeart,
  FaStar,
  FaTicketAlt
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import './ScopoDelSito.css';

function ScopoDelSito() {
  const [activeUserType, setActiveUserType] = useState('cliente');

  const tipiProgetto = [
    {
      tipo: 'sito_web',
      nome: 'Siti Web',
      icon: '/immagini icona homepage/03.png',
      esempi: ['Sito aziendale', 'Portfolio personale', 'Blog professionale', 'Landing page'],
      descrizione: 'Siti web responsive e moderni per la tua presenza online'
    },
    {
      tipo: 'app_mobile',
      nome: 'App Mobile',
      icon: '/immagini icona homepage/02.png',
      esempi: ['App iOS/Android', 'App cross-platform', 'PWA', 'App aziendali'],
      descrizione: 'Applicazioni mobile native e cross-platform per ogni esigenza'
    },
    {
      tipo: 'ecommerce',
      nome: 'E-commerce',
      icon: '/immagini icona homepage/05.png',
      esempi: ['Negozio online', 'Marketplace', 'Catalogo prodotti', 'Sistema ordini'],
      descrizione: 'Piattaforme e-commerce complete per vendere online'
    },
    {
      tipo: 'gestionale',
      nome: 'Software Gestionali',
      icon: '/immagini icona homepage/04.png',
      esempi: ['CRM', 'ERP', 'Sistema HR', 'Gestione magazzino'],
      descrizione: 'Software per automatizzare e ottimizzare i processi aziendali'
    },
    {
      tipo: 'personalizzato',
      nome: 'Software Personalizzato',
      icon: '/immagini icona homepage/01.png',
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
      azioni: ['Completa milestone', 'Ricevi approvazioni', 'Consegna finale', 'Incassa il 100%'],
      icon: <FaEuroSign />
    }
  ];

  return (
    <div className="scopo-page">
      {/* Hero Section */}
      <div className="scopo-hero">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="d-flex align-items-center justify-content-center mb-4 gap-3">
                <div className="p-3 rounded-4" style={{ background: 'rgba(0,113,227,0.1)' }}>
                  <FaRocket size={32} style={{ color: '#0071e3' }} />
                </div>
                <span className="mac-badge bg-primary text-white shadow-sm px-3">IL NOSTRO SCOPO</span>
              </div>
              <h1>Scopo del Sito</h1>
              <p>
                Comprendiamo esattamente come funziona la nostra piattaforma, cosa offriamo a clienti e 
                sviluppatori, e come garantiamo sicurezza e qualità in ogni progetto.
              </p>
            </div>
          </div>

          {/* User Type Toggle */}
          <div className="row justify-content-center mt-4">
            <div className="col-lg-8">
              <div className="user-type-toggle d-flex justify-content-center">
                <div className="btn-group" role="group">
                  <button 
                    className={`btn rounded-pill px-4 ${activeUserType === 'cliente' ? 'btn-primary shadow-sm' : 'btn-link text-decoration-none'}`}
                    onClick={() => setActiveUserType('cliente')}
                  >
                    <FaUser className="me-2" />
                    Sono un Cliente
                  </button>
                  <button 
                    className={`btn rounded-pill px-4 ${activeUserType === 'fornitore' ? 'btn-primary shadow-sm' : 'btn-link text-decoration-none'}`}
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
      </div>

      {/* Tipi di Progetti */}
      <div className="scopo-section">
        <div className="container">
          <div className="scopo-section-header">
            <h2>
              <FaCode style={{ color: '#0071e3' }} className="me-3" />
              Cosa Puoi Realizzare
            </h2>
            <p>Tipologie di software e progetti supportati dalla nostra piattaforma</p>
          </div>

          <div className="row g-4">
            {tipiProgetto.map((tipo, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div className="project-type-card">
                  <div className="project-icon">
                    <img 
                      src={tipo.icon} 
                      alt={tipo.nome}
                      className="w-100 h-100"
                      style={{ objectFit: 'contain', padding: '12px', borderRadius: '50%' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                  <h5>{tipo.nome}</h5>
                  <p>{tipo.descrizione}</p>
                  <div className="esempi-list">
                    <h6>Esempi:</h6>
                    <ul className="list-unstyled">
                      {tipo.esempi.map((esempio, idx) => (
                        <li key={idx}>
                          <FaArrowRight style={{ color: '#30c56d' }} size={12} className="me-2" />
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
      </div>

      {/* Processo Dettagliato — Card Grid */}
      <div className="scopo-section" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div className="scopo-section-header">
            <h2>
              {activeUserType === 'cliente' ? (
                <><FaUser style={{ color: '#30c56d' }} className="me-3" />Come Funziona per i Clienti</>
              ) : (
                <><FaUserTie style={{ color: '#0071e3' }} className="me-3" />Come Funziona per gli Sviluppatori</>
              )}
            </h2>
            <p>
              {activeUserType === 'cliente' 
                ? 'Il processo completo per realizzare il tuo progetto software'
                : 'Come trovare progetti interessanti e costruire la tua carriera freelance'
              }
            </p>
          </div>

          <div className="row g-4">
            {(activeUserType === 'cliente' ? processoCliente : processoFornitore).map((step, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="process-card h-100" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="process-card-number">{step.step}</div>
                  <div className="process-card-icon">
                    {step.icon}
                  </div>
                  <h4 className="process-card-title">{step.titolo}</h4>
                  <p className="process-card-desc">{step.descrizione}</p>
                  <div className="process-card-actions">
                    <h6>Azioni:</h6>
                    {step.azioni.map((azione, idx) => (
                      <div key={idx} className="process-card-action-item">
                        <FaCheckCircle style={{ color: '#30c56d' }} size={12} className="flex-shrink-0 me-2 mt-1" />
                        <span>{azione}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Garanzie e Sicurezza */}
      <div className="scopo-section" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div className="scopo-section-header">
            <h2>
              <FaShieldAlt style={{ color: '#30c56d' }} className="me-3" />
              Le Nostre Garanzie
            </h2>
            <p>Cosa ti garantiamo per una collaborazione sicura e di successo</p>
          </div>

          <div className="row g-4">
            {/* Per i Clienti */}
            <div className="col-lg-6">
              <div className="garanzia-card">
                <div className="garanzia-header">
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(48,197,109,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                    <FaUser size={26} style={{ color: '#30c56d' }} />
                  </div>
                  <h5>Per i Clienti</h5>
                </div>
                <div className="garanzia-items">
                  <div className="garanzia-item">
                    <div className="garanzia-item-icon" style={{ background: 'rgba(48,197,109,0.12)', color: '#30c56d' }}>
                      <FaShieldAlt />
                    </div>
                    <div className="garanzia-item-content">
                      <h6>Pagamento Protetto</h6>
                      <small>Paghi solo quando sei soddisfatto del lavoro ricevuto</small>
                    </div>
                  </div>
                  <div className="garanzia-item">
                    <div className="garanzia-item-icon" style={{ background: 'rgba(255,193,7,0.12)', color: '#ffc107' }}>
                      <FaCrown />
                    </div>
                    <div className="garanzia-item-content">
                      <h6>Supervisione Admin</h6>
                      <small>Ogni progetto è supervisionato per garantire qualità e rispetto degli accordi</small>
                    </div>
                  </div>
                  <div className="garanzia-item">
                    <div className="garanzia-item-icon" style={{ background: 'rgba(0,162,255,0.12)', color: '#00a2ff' }}>
                      <FaComments />
                    </div>
                    <div className="garanzia-item-content">
                      <h6>Comunicazione Trasparente</h6>
                      <small>Chat supervisionata per evitare malintesi e proteggere entrambe le parti</small>
                    </div>
                  </div>
                  <div className="garanzia-item">
                    <div className="garanzia-item-icon" style={{ background: 'rgba(111,66,193,0.12)', color: '#9b59b6' }}>
                      <FaAward />
                    </div>
                    <div className="garanzia-item-content">
                      <h6>Sviluppatori Verificati</h6>
                      <small>Solo professionisti con competenze certificate e portfolio verificato</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Per gli Sviluppatori */}
            <div className="col-lg-6">
              <div className="garanzia-card">
                <div className="garanzia-header">
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(0,113,227,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                    <FaUserTie size={26} style={{ color: '#0071e3' }} />
                  </div>
                  <h5>Per gli Sviluppatori</h5>
                </div>
                <div className="garanzia-items">
                  <div className="garanzia-item">
                    <div className="garanzia-item-icon" style={{ background: 'rgba(48,197,109,0.12)', color: '#30c56d' }}>
                      <FaEuroSign />
                    </div>
                    <div className="garanzia-item-content">
                      <h6>Pagamento Garantito</h6>
                      <small>Una volta completato il lavoro, il pagamento è assicurato (100% del totale)</small>
                    </div>
                  </div>
                  <div className="garanzia-item">
                    <div className="garanzia-item-icon" style={{ background: 'rgba(255,193,7,0.12)', color: '#ffc107' }}>
                      <FaBolt />
                    </div>
                    <div className="garanzia-item-content">
                      <h6>Progetti Pre-finanziati</h6>
                      <small>I clienti depositano i fondi prima dell'inizio, eliminando il rischio di mancato pagamento</small>
                    </div>
                  </div>
                  <div className="garanzia-item">
                    <div className="garanzia-item-icon" style={{ background: 'rgba(0,162,255,0.12)', color: '#00a2ff' }}>
                      <FaHandshake />
                    </div>
                    <div className="garanzia-item-content">
                      <h6>Clienti Verificati</h6>
                      <small>Solo clienti seri con identità verificata e budget confermato</small>
                    </div>
                  </div>
                  <div className="garanzia-item">
                    <div className="garanzia-item-icon" style={{ background: 'rgba(255,193,7,0.12)', color: '#ffc107' }}>
                      <FaStar />
                    </div>
                    <div className="garanzia-item-content">
                      <h6>Sistema di Reputazione</h6>
                      <small>Costruisci la tua reputazione con recensioni verificate per attrarre clienti migliori</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Commissioni e Costi */}
      <div className="scopo-section" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div className="scopo-section-header">
            <h2>
              <FaEuroSign style={{ color: '#30c56d' }} className="me-3" />
              Commissioni e Costi
            </h2>
            <p>Trasparenza totale sui costi — nessuna sorpresa</p>
          </div>

          <div className="row g-4 justify-content-center">
            <div className="col-lg-8">
              <div className="pricing-card">
                <div className="pricing-header-area">
                  <h4>
                    <FaHeart style={{ color: '#ff3b30' }} className="me-2" />
                    Modello di Business Trasparente
                  </h4>
                </div>
                <div className="pricing-body">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="pricing-col" style={{ borderColor: 'rgba(48,197,109,0.3)' }}>
                        <h6 style={{ color: '#30c56d' }}>
                          <FaUser className="me-2" />
                          Per i Clienti
                        </h6>
                        <div className="pricing-row">
                          <span className="label">Commissione Piattaforma:</span>
                          <span className="value" style={{ color: '#0071e3' }}>+5%</span>
                        </div>
                        <div className="pricing-row">
                          <span className="label">Esempio:</span>
                          <span className="value">Progetto 1000€ = Paghi 1050€</span>
                        </div>
                        <div className="pricing-note">
                          <FaCheckCircle style={{ color: '#30c56d' }} className="me-1" />
                          Include: supervisione admin, garanzie, supporto, infrastruttura sicura
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="pricing-col" style={{ borderColor: 'rgba(0,113,227,0.3)' }}>
                        <h6 style={{ color: '#0071e3' }}>
                          <FaUserTie className="me-2" />
                          Per gli Sviluppatori
                        </h6>
                        <div className="pricing-row">
                          <span className="label">Ricevi:</span>
                          <span className="value" style={{ color: '#30c56d' }}>100%</span>
                        </div>
                        <div className="pricing-row">
                          <span className="label">Esempio:</span>
                          <span className="value">Progetto 1000€ = Ricevi 1000€</span>
                        </div>
                        <div className="pricing-note">
                          <FaCheckCircle style={{ color: '#30c56d' }} className="me-1" />
                          Include: pagamento garantito, progetti pre-finanziati, supporto clienti
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pricing-info-banner">
                    <FaLightbulb style={{ color: '#0071e3' }} size={20} className="flex-shrink-0 mt-1" />
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

          {/* Ticket & Crediti */}
          <div className="row g-4 justify-content-center mt-4">
            <div className="col-lg-8">
              <div className="pricing-card">
                <div className="pricing-header-area">
                  <h4>
                    <FaTicketAlt style={{ color: '#ff9500' }} className="me-2" />
                    Ticket & Crediti (anti-spam)
                  </h4>
                </div>
                <div className="pricing-body">
                  <div className="p-3 mb-4 rounded-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <strong className="text-white">I crediti non sostituiscono il pagamento del progetto.</strong>
                    <span style={{ color: '#86868b' }}> Servono solo a regolamentare l'invio delle offerte e ridurre lo spam.</span>
                  </div>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="pricing-col" style={{ borderColor: 'rgba(48,197,109,0.3)' }}>
                        <h6 style={{ color: '#30c56d' }}>
                          <FaUser className="me-2" />
                          Cliente
                        </h6>
                        <div className="pricing-row">
                          <span className="label">Crediti richiesti:</span>
                          <span className="value" style={{ color: '#30c56d' }}>No</span>
                        </div>
                        <div className="pricing-row">
                          <span className="label">Pubblicare richiesta:</span>
                          <span className="value">Gratis</span>
                        </div>
                        <div className="pricing-note">
                          <FaCheckCircle style={{ color: '#30c56d' }} className="me-1" />
                          Paghi solo quando confermi il deposito/garanzia per avviare il progetto
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="pricing-col" style={{ borderColor: 'rgba(0,113,227,0.3)' }}>
                        <h6 style={{ color: '#0071e3' }}>
                          <FaUserTie className="me-2" />
                          Fornitore
                        </h6>
                        <div className="pricing-row">
                          <span className="label">Inviare offerta:</span>
                          <span className="value" style={{ color: '#ff9500' }}>1 credito</span>
                        </div>
                        <div className="pricing-row">
                          <span className="label">Come ricarichi:</span>
                          <span className="value">Scegli un pacchetto e ricevi la causale bonifico</span>
                        </div>
                        <div className="pricing-note">
                          <FaCheckCircle style={{ color: '#30c56d' }} className="me-1" />
                          I crediti acquistati non scadono mai
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Finale */}
      <div className="scopo-cta">
        <div className="container">
          <h3>Pronto a Iniziare?</h3>
          <p>Unisciti a migliaia di clienti e sviluppatori che stanno già collaborando su SoftMatch.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/register" className="btn btn-primary btn-lg">
              <FaRocket className="me-2" />
              Pubblica Progetto
            </Link>
            <Link to="/chi-siamo" className="btn btn-outline-light btn-lg">
              Scopri di Più
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScopoDelSito;

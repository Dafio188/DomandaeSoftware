import { useState } from 'react';
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaClock,
  FaHeadset,
  FaPaperPlane,
  FaQuestionCircle,
  FaRocket,
  FaShieldAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaBuilding,
  FaGlobe,
  FaWhatsapp,
  FaUser,
  FaUserTie
} from 'react-icons/fa';
import './Contatti.css';

function Contatti() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    tipo: '',
    oggetto: '',
    messaggio: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const tipiRichiesta = [
    { value: 'generale', label: 'Informazioni Generali', icon: FaInfoCircle },
    { value: 'cliente', label: 'Supporto Cliente', icon: FaUser },
    { value: 'fornitore', label: 'Supporto Fornitore', icon: FaUserTie },
    { value: 'tecnico', label: 'Supporto Tecnico', icon: FaHeadset },
    { value: 'partnership', label: 'Partnership', icon: FaRocket },
    { value: 'altro', label: 'Altro', icon: FaQuestionCircle }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simula invio (in una vera app, qui ci sarebbe la chiamata API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      setFormData({
        nome: '',
        email: '',
        tipo: '',
        oggetto: '',
        messaggio: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 bg-gradient contatti-page">
      {/* Hero Section */}
      <div className="hero-section bg-primary text-white position-relative overflow-hidden">
        <div className="container py-5 position-relative z-2">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="display-3 fw-bold mb-4">
                <FaEnvelope className="me-3 text-warning" />
                Contattaci
              </h1>
              <p className="lead mb-4 opacity-90">
                Siamo qui per aiutarti! Che tu sia un <strong>cliente</strong> con un'idea innovativa o uno <strong>sviluppatore</strong> 
                in cerca di nuove opportunità, il nostro team è pronto a supportarti.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <div className="feature-badge">
                  <FaClock className="me-2" />
                  Risposta in 24h
                </div>
                <div className="feature-badge">
                  <FaHeadset className="me-2" />
                  Supporto Dedicato
                </div>
                <div className="feature-badge">
                  <FaShieldAlt className="me-2" />
                  Assistenza Sicura
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-decoration"></div>
      </div>

      <div className="container py-5">
        <div className="row g-5 contatti-layout">
          {/* Modulo di Contatto */}
          <div className="col-lg-8 order-1">
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-header bg-primary bg-gradient text-white border-0 rounded-top-4">
                <div className="d-flex align-items-center">
                  <FaPaperPlane className="me-3" size={20} />
                  <div>
                    <h4 className="mb-0">Invia un Messaggio</h4>
                    <small className="opacity-75">Compila il modulo e ti risponderemo al più presto</small>
                  </div>
                </div>
              </div>
              <div className="card-body p-4">
                {submitStatus === 'success' && (
                  <div className="alert alert-success border-0 rounded-3 mb-4">
                    <div className="d-flex align-items-center">
                      <FaCheckCircle className="me-3 text-success" size={24} />
                      <div>
                        <strong>Messaggio inviato con successo!</strong><br />
                        <small>Ti risponderemo entro 24 ore all'indirizzo email fornito.</small>
                      </div>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="alert alert-danger border-0 rounded-3 mb-4">
                    <div className="d-flex align-items-center">
                      <FaExclamationTriangle className="me-3 text-danger" size={24} />
                      <div>
                        <strong>Errore nell'invio del messaggio</strong><br />
                        <small>Riprova più tardi o contattaci direttamente via email.</small>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Nome e Cognome *</label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        placeholder="Il tuo nome completo"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Email *</label>
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="la-tua-email@esempio.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Tipo di Richiesta *</label>
                    <select
                      className="form-select form-select-lg"
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleziona il tipo di richiesta...</option>
                      {tipiRichiesta.map(tipo => (
                        <option key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Oggetto *</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      name="oggetto"
                      value={formData.oggetto}
                      onChange={handleInputChange}
                      placeholder="Riassumi brevemente la tua richiesta"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold">Messaggio *</label>
                    <textarea
                      className="form-control"
                      rows="6"
                      name="messaggio"
                      value={formData.messaggio}
                      onChange={handleInputChange}
                      placeholder="Descrivi dettagliatamente la tua richiesta o domanda..."
                      required
                    ></textarea>
                    <small className="text-muted">
                      Più dettagli fornisci, più accurata sarà la nostra risposta!
                    </small>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      <FaShieldAlt className="me-1" />
                      I tuoi dati sono protetti e non verranno condivisi con terzi
                    </small>
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg rounded-pill px-4"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                          Invio in corso...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="me-2" />
                          Invia Messaggio
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Informazioni di Contatto */}
          <div className="col-lg-4 order-2 order-lg-2">
            <div className="contatti-sidebar">
              {/* Contatti Diretti */}
              <div className="card border-0 shadow-lg rounded-4 mb-4 bg-white bg-opacity-75">
                <div className="card-header bg-success bg-gradient text-white border-0 rounded-top-4">
                  <h5 className="mb-0 text-center">
                    Contatti Diretti
                  </h5>
                </div>
                <div className="card-body p-4">
                  <div className="contact-item mb-3">
                    <div className="text-center">
                      <div className="contact-info">
                        <h6 className="fw-bold mb-1">Email Generale</h6>
                        <a href="mailto:info@domandaesoftware.it" className="text-decoration-none contact-email">
                          info@domandaesoftware.it
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="contact-item mb-3">
                    <div className="text-center">
                      <div className="contact-info">
                        <h6 className="fw-bold mb-1">Supporto Clienti</h6>
                        <a href="mailto:clienti@domandaesoftware.it" className="text-decoration-none contact-email">
                          clienti@domandaesoftware.it
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="contact-item mb-3">
                    <div className="text-center">
                      <div className="contact-info">
                        <h6 className="fw-bold mb-1">Supporto Fornitori</h6>
                        <a href="mailto:fornitori@domandaesoftware.it" className="text-decoration-none contact-email">
                          fornitori@domandaesoftware.it
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="text-center">
                      <div className="contact-info">
                        <h6 className="fw-bold mb-1">WhatsApp Business</h6>
                        <a href="https://wa.me/393123456789" className="text-decoration-none contact-phone" target="_blank" rel="noopener noreferrer">
                          +39 312 345 6789
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informazioni Azienda */}
              <div className="card border-0 shadow-lg rounded-4 mb-4">
                <div className="card-header bg-info bg-gradient text-white border-0 rounded-top-4">
                  <h5 className="mb-0">
                    <FaBuilding className="me-2" />
                    Informazioni Azienda
                  </h5>
                </div>
                <div className="card-body p-4">
                  <div className="info-item mb-3">
                    <div className="d-flex align-items-start">
                      <FaMapMarkerAlt className="text-primary me-3 mt-1" />
                      <div>
                        <h6 className="fw-bold mb-1">Sede Legale</h6>
                        <p className="mb-0 text-muted">
                          Via dell'Innovazione, 123<br />
                          20100 Milano (MI)<br />
                          Italia
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="info-item mb-3">
                    <div className="d-flex align-items-start">
                      <FaClock className="text-success me-3 mt-1" />
                      <div>
                        <h6 className="fw-bold mb-1">Orari di Supporto</h6>
                        <p className="mb-0 text-muted">
                          Lun - Ven: 9:00 - 18:00<br />
                          Sab: 9:00 - 13:00<br />
                          Dom: Chiuso
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="d-flex align-items-start">
                      <FaGlobe className="text-info me-3 mt-1" />
                      <div>
                        <h6 className="fw-bold mb-1">Dati Fiscali</h6>
                        <p className="mb-0 text-muted">
                          P.IVA: 12345678901<br />
                          C.F.: 12345678901<br />
                          REA: MI-1234567
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Rapide */}
              <div className="card border-0 shadow-lg rounded-4">
                <div className="card-header bg-warning bg-gradient text-dark border-0 rounded-top-4">
                  <h5 className="mb-0">
                    <FaQuestionCircle className="me-2" />
                    FAQ Rapide
                  </h5>
                </div>
                <div className="card-body p-4">
                  <div className="faq-item mb-3">
                    <h6 className="fw-bold mb-1">Quanto tempo per una risposta?</h6>
                    <p className="small text-muted mb-0">
                      Rispondiamo entro 24 ore nei giorni lavorativi.
                    </p>
                  </div>

                  <div className="faq-item mb-3">
                    <h6 className="fw-bold mb-1">Posso chiamare direttamente?</h6>
                    <p className="small text-muted mb-0">
                      Preferiamo email/WhatsApp per tracciare meglio le richieste.
                    </p>
                  </div>

                  <div className="faq-item">
                    <h6 className="fw-bold mb-1">Supporto in altre lingue?</h6>
                    <p className="small text-muted mb-0">
                      Attualmente supportiamo Italiano e Inglese.
                    </p>
                  </div>

                  <div className="text-center mt-4">
                    <a href="/faq" className="btn btn-outline-warning rounded-pill">
                      <FaQuestionCircle className="me-2" />
                      Tutte le FAQ
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card border-0 shadow-lg rounded-4 bg-gradient-primary text-white">
              <div className="card-body p-5 text-center">
                <FaRocket size={60} className="mb-4 text-warning" />
                <h3 className="fw-bold mb-3">Non hai ancora un account?</h3>
                <p className="lead mb-4">
                  Unisciti alla nostra community di visionari e sviluppatori. È gratuito e ci vogliono solo 2 minuti!
                </p>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <a href="/register" className="btn btn-light btn-lg rounded-pill px-4">
                    <FaUser className="me-2" />
                    Registrati come Cliente
                  </a>
                  <a href="/register" className="btn btn-outline-light btn-lg rounded-pill px-4">
                    <FaUserTie className="me-2" />
                    Registrati come Fornitore
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contatti; 
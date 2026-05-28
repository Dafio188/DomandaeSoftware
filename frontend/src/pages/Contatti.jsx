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
import PageHeader from '../components/PageHeader';
import '../styles/MacStyle.css';

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
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-4">
      {/* Hero Section - Mac Style */}
      <PageHeader 
        title="Siamo qui per te"
        subtitle="Hai un'idea da realizzare o hai bisogno di supporto tecnico? Il nostro team è pronto a risponderti in meno di 24 ore."
        badge="CONTATTI"
        icon={FaEnvelope}
        theme="warning"
      />

      <div className="row justify-content-center mb-5">
        <div className="col-lg-8">
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <div className="mac-glass-card px-3 py-2 d-flex align-items-center shadow-sm">
                <FaClock className="text-success me-2" />
                <span className="small fw-bold">Risposta in 24h</span>
              </div>
              <div className="mac-glass-card px-3 py-2 d-flex align-items-center shadow-sm">
                <FaHeadset className="text-primary me-2" />
                <span className="small fw-bold">Supporto Dedicato</span>
              </div>
            </div>
        </div>
      </div>

      <div className="row g-5">
          {/* Modulo di Contatto - Mac Style */}
          <div className="col-lg-8">
            <div className="mac-glass-card p-4">
              <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3">
                  <FaPaperPlane className="text-primary" size={20} />
                </div>
                <div>
                  <h4 className="mac-title mb-0">Invia un Messaggio</h4>
                  <p className="mac-subtitle mb-0 small">Ti risponderemo il prima possibile</p>
                </div>
              </div>

              {submitStatus === 'success' && (
                <div className="alert alert-success border-0 rounded-4 mb-4 bg-success bg-opacity-10 text-success">
                  <FaCheckCircle className="me-2" />
                  <strong>Messaggio inviato!</strong> Ti risponderemo entro 24 ore.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label mac-subtitle small text-uppercase fw-bold">Nome e Cognome</label>
                    <input
                      type="text"
                      className="form-control rounded-3 mac-input-field"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      placeholder="es. Mario Rossi"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label mac-subtitle small text-uppercase fw-bold">Email</label>
                    <input
                      type="email"
                      className="form-control rounded-3 mac-input-field"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="es. info@softmatch.it"
                      required
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="form-label mac-subtitle small text-uppercase fw-bold">Tipo di Richiesta</label>
                  <select
                    className="form-select rounded-3 mac-input-field"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleziona...</option>
                    {tipiRichiesta.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-3">
                  <label className="form-label mac-subtitle small text-uppercase fw-bold">Oggetto</label>
                  <input
                    type="text"
                    className="form-control rounded-3 mac-input-field"
                    name="oggetto"
                    value={formData.oggetto}
                    onChange={handleInputChange}
                    placeholder="Riassumi brevemente la tua richiesta"
                    required
                  />
                </div>

                <div className="mt-3 mb-4">
                  <label className="form-label mac-subtitle small text-uppercase fw-bold">Messaggio</label>
                  <textarea
                    className="form-control rounded-4 mac-input-field"
                    name="messaggio"
                    rows="5"
                    value={formData.messaggio}
                    onChange={handleInputChange}
                    placeholder="Descrivi dettagliatamente la tua richiesta o domanda..."
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg rounded-pill px-5 fw-bold w-100 shadow-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <><FaPaperPlane className="fa-spin me-2" /> Invio...</> : <><FaPaperPlane className="me-2" /> Invia Messaggio</>}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar Info - Mac Style Widgets */}
          <div className="col-lg-4">
            {/* Contatti Rapidi */}
            <div className="mac-glass-card p-4 mb-4">
              <h5 className="mac-title mb-4">Canali Diretti</h5>
              
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                  <FaEnvelope className="text-primary" size={14} />
                </div>
                <div>
                  <small className="mac-subtitle d-block x-small fw-bold text-uppercase">Email</small>
                  <a href="mailto:info@softmatch.it" className="text-decoration-none text-dark small fw-bold">info@softmatch.it</a>
                </div>
              </div>

              <div className="d-flex align-items-center mb-3">
                <div className="bg-success bg-opacity-10 p-2 rounded-circle me-3">
                  <FaWhatsapp className="text-success" size={14} />
                </div>
                <div>
                  <small className="mac-subtitle d-block x-small fw-bold text-uppercase">WhatsApp</small>
                  <a href="https://wa.me/393906600661" className="text-decoration-none text-dark small fw-bold" target="_blank" rel="noopener noreferrer">+39 390 6600661</a>
                </div>
              </div>

              <div className="d-flex align-items-center">
                <div className="bg-info bg-opacity-10 p-2 rounded-circle me-3">
                  <FaClock className="text-info" size={14} />
                </div>
                <div>
                  <small className="mac-subtitle d-block x-small fw-bold text-uppercase">Orari</small>
                  <span className="text-dark small fw-bold">Lun-Ven 9:00 - 18:00</span>
                </div>
              </div>
            </div>

            {/* Sede e Dati - Mac Card */}
            <div className="mac-glass-card p-4 mb-4">
              <h5 className="mac-title mb-3">Dove Siamo</h5>
              <div className="d-flex align-items-start mb-3">
                <FaMapMarkerAlt className="text-danger me-2 mt-1" size={14} />
                <p className="mac-subtitle small mb-0">
                  Via dell'Innovazione, 123<br />
                  20100 Milano (MI), Italia
                </p>
              </div>
              <div className="d-flex align-items-center">
                <FaGlobe className="text-primary me-2" size={14} />
                <small className="mac-subtitle x-small">P.IVA: 12345678901</small>
              </div>
            </div>

            {/* Social - Mac Card */}
            <div className="mac-glass-card p-4">
              <h5 className="mac-title mb-3 text-center">Seguici</h5>
              <div className="d-flex justify-content-center gap-3">
                <a href="#" className="bg-light p-3 rounded-circle text-primary hover-scale shadow-sm"><FaLinkedin size={20} /></a>
                <a href="#" className="bg-light p-3 rounded-circle text-info hover-scale shadow-sm"><FaTwitter size={20} /></a>
                <a href="#" className="bg-light p-3 rounded-circle text-danger hover-scale shadow-sm"><FaInstagram size={20} /></a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA - Mac Style */}
        <div className="row mt-5 pt-5 pb-5">
          <div className="col-12">
            <div className="mac-glass-card p-5 text-center bg-primary bg-opacity-5 border-primary border-opacity-10">
              <FaRocket size={48} className="text-primary opacity-25 mb-4" />
              <h3 className="mac-title mb-3">Pronto a iniziare il tuo progetto?</h3>
              <p className="mac-subtitle mb-4">Unisciti a noi e trasforma le tue idee in software di successo.</p>
              <div className="d-flex justify-content-center gap-3">
                <a href="/register" className="btn btn-primary rounded-pill px-4 fw-bold">Registrati ora</a>
                <a href="/faq" className="btn btn-light rounded-pill px-4">Consulta FAQ</a>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default Contatti; 

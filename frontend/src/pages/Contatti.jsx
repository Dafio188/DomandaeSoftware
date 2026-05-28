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
  FaInfoCircle,
  FaBuilding,
  FaGlobe,
  FaWhatsapp,
  FaUser,
  FaUserTie
} from 'react-icons/fa';
import '../styles/DarkPage.css';

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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({ nome: '', email: '', tipo: '', oggetto: '', messaggio: '' });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dark-page">
      <div className="dark-hero">
        <div className="container">
          <div className="d-flex align-items-center justify-content-center mb-4 gap-3">
            <div className="dark-icon-circle">
              <FaEnvelope size={24} style={{ color: '#0071e3' }} />
            </div>
            <span className="dark-badge">CONTATTI</span>
          </div>
          <h1>Siamo qui per te</h1>
          <p>
            Hai un'idea da realizzare o hai bisogno di supporto tecnico? 
            Il nostro team è pronto a risponderti in meno di 24 ore.
          </p>
        </div>
      </div>

      <div className="container">
        {/* Badge info */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8">
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <div className="dark-card px-4 py-2 d-flex align-items-center" style={{ borderRadius: '980px', padding: '8px 18px' }}>
                <FaClock style={{ color: '#30c56d' }} className="me-2" />
                <span className="dark-muted small fw-bold">Risposta in 24h</span>
              </div>
              <div className="dark-card px-4 py-2 d-flex align-items-center" style={{ borderRadius: '980px', padding: '8px 18px' }}>
                <FaHeadset style={{ color: '#0071e3' }} className="me-2" />
                <span className="dark-muted small fw-bold">Supporto Dedicato</span>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-5">
          {/* Form — Versione Premium V2 */}
          <div className="col-lg-8">
            <div className="overflow-hidden" style={{ 
              background: '#16181c',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
            }}>
              {/* Header */}
              <div className="px-4 py-3 d-flex align-items-center gap-3" style={{ 
                borderBottom: '1px solid rgba(255,255,255,0.05)', 
                background: 'linear-gradient(90deg, rgba(0,113,227,0.07) 0%, transparent 100%)'
              }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #0071e3, #0058b0)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FaPaperPlane size={16} style={{ color: '#fff' }} />
                </div>
                <div>
                  <h5 className="fw-bold mb-0" style={{ color: '#f5f5f7', fontSize: '1rem', letterSpacing: '-0.02em' }}>Invia un Messaggio</h5>
                  <small style={{ color: '#6b6b70', fontSize: '0.78rem' }}>Tutti i campi sono obbligatori</small>
                </div>
              </div>

              {submitStatus === 'success' && (
                <div className="mx-4 mt-4 d-flex align-items-start gap-3 p-3 rounded-2" 
                  style={{ background: 'rgba(48,197,109,0.06)', border: '1px solid rgba(48,197,109,0.15)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(48,197,109,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FaCheckCircle size={14} style={{ color: '#30c56d' }} />
                  </div>
                  <div>
                    <div className="fw-semibold" style={{ color: '#f5f5f7', fontSize: '0.85rem' }}>Messaggio inviato con successo!</div>
                    <div style={{ color: '#6b6b70', fontSize: '0.78rem' }}>Ti risponderemo entro 24 ore lavorative.</div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ background: 'transparent', padding: '28px 28px 24px' }}>
                {/* Riga 1: Nome + Email */}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="d-block mb-1" style={{ color: '#8e8e93', fontSize: '0.7rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      <FaUser className="me-1" size={10} style={{ color: '#0071e3' }} />
                      Nome e Cognome
                    </label>
                    <div className="position-relative">
                      <div style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#4a4a4e', zIndex: 3, pointerEvents: 'none', fontSize: '0.85rem' }}>
                        <FaUser size={13} />
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        placeholder="Mario Rossi"
                        required
                        style={{ 
                          background: '#f5f5f7',
                          border: '1px solid #d1d1d6',
                          color: '#1d1d1f',
                          padding: '11px 13px 11px 36px',
                          borderRadius: '8px',
                          fontSize: '0.88rem',
                          transition: 'all 0.15s ease'
                        }}
                        onFocus={(e) => { 
                          e.target.style.borderColor = '#0071e3'; 
                          e.target.style.boxShadow = '0 0 0 3px rgba(0,113,227,0.12)'; 
                          e.target.style.background = '#ffffff';
                        }}
                        onBlur={(e) => { 
                          e.target.style.borderColor = '#d1d1d6'; 
                          e.target.style.boxShadow = 'none'; 
                          e.target.style.background = '#f5f5f7';
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="d-block mb-1" style={{ color: '#a1a1a6', fontSize: '0.7rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      <FaEnvelope className="me-1" size={10} style={{ color: '#0071e3' }} />
                      Email
                    </label>
                    <div className="position-relative">
                      <div style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#8e8e93', zIndex: 3, pointerEvents: 'none', fontSize: '0.85rem' }}>
                        <FaEnvelope size={13} />
                      </div>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="info@softmatch.it"
                        required
                        style={{ 
                          background: '#f5f5f7',
                          border: '1px solid #d1d1d6',
                          color: '#1d1d1f',
                          padding: '11px 13px 11px 36px',
                          borderRadius: '8px',
                          fontSize: '0.88rem',
                          transition: 'all 0.15s ease'
                        }}
                        onFocus={(e) => { 
                          e.target.style.borderColor = '#0071e3'; 
                          e.target.style.boxShadow = '0 0 0 3px rgba(0,113,227,0.12)'; 
                          e.target.style.background = '#ffffff';
                        }}
                        onBlur={(e) => { 
                          e.target.style.borderColor = '#d1d1d6'; 
                          e.target.style.boxShadow = 'none'; 
                          e.target.style.background = '#f5f5f7';
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Riga 2: Tipo + Oggetto */}
                <div className="row g-3 mb-3">
                  <div className="col-md-5">
                    <label className="d-block mb-1" style={{ color: '#8e8e93', fontSize: '0.7rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      <FaHeadset className="me-1" size={10} style={{ color: '#0071e3' }} />
                      Tipo Richiesta
                    </label>
                    <div className="position-relative">
                      <div style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#4a4a4e', zIndex: 3, pointerEvents: 'none', fontSize: '0.85rem' }}>
                        <FaHeadset size={13} />
                      </div>
                      <select
                        className="form-select"
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleInputChange}
                        required
                        style={{ 
                          background: '#f5f5f7',
                          border: '1px solid #d1d1d6',
                          color: '#1d1d1f',
                          padding: '11px 30px 11px 36px',
                          borderRadius: '8px',
                          fontSize: '0.88rem',
                          appearance: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onFocus={(e) => { 
                          e.target.style.borderColor = '#0071e3'; 
                          e.target.style.boxShadow = '0 0 0 3px rgba(0,113,227,0.12)'; 
                          e.target.style.background = '#ffffff';
                        }}
                        onBlur={(e) => { 
                          e.target.style.borderColor = '#d1d1d6'; 
                          e.target.style.boxShadow = 'none'; 
                          e.target.style.background = '#f5f5f7';
                        }}
                      >
                        <option value="" style={{ background: '#f5f5f7', color: '#8e8e93' }}>Seleziona...</option>
                        {tipiRichiesta.map(tipo => (
                          <option key={tipo.value} value={tipo.value} style={{ background: '#f5f5f7', color: '#1d1d1f' }}>{tipo.label}</option>
                        ))}
                      </select>
                      <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#8e8e93' }}>
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-7">
                    <label className="d-block mb-1" style={{ color: '#8e8e93', fontSize: '0.7rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      <FaInfoCircle className="me-1" size={10} style={{ color: '#0071e3' }} />
                      Oggetto
                    </label>
                    <div className="position-relative">
                      <div style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#4a4a4e', zIndex: 3, pointerEvents: 'none', fontSize: '0.85rem' }}>
                        <FaInfoCircle size={13} />
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        name="oggetto"
                        value={formData.oggetto}
                        onChange={handleInputChange}
                        placeholder="Richiesta informazioni"
                        required
                        style={{ 
                          background: '#f5f5f7',
                          border: '1px solid #d1d1d6',
                          color: '#1d1d1f',
                          padding: '11px 13px 11px 36px',
                          borderRadius: '8px',
                          fontSize: '0.88rem',
                          transition: 'all 0.15s ease'
                        }}
                        onFocus={(e) => { 
                          e.target.style.borderColor = '#0071e3'; 
                          e.target.style.boxShadow = '0 0 0 3px rgba(0,113,227,0.12)'; 
                          e.target.style.background = '#ffffff';
                        }}
                        onBlur={(e) => { 
                          e.target.style.borderColor = '#d1d1d6'; 
                          e.target.style.boxShadow = 'none'; 
                          e.target.style.background = '#f5f5f7';
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Riga 3: Messaggio */}
                <div className="mb-4">
                  <label className="d-block mb-1" style={{ color: '#a1a1a6', fontSize: '0.7rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <FaPaperPlane className="me-1" size={10} style={{ color: '#0071e3' }} />
                    Messaggio
                  </label>
                  <div className="position-relative">
                    <div style={{ position: 'absolute', left: 13, top: '16px', color: '#8e8e93', zIndex: 3, pointerEvents: 'none', fontSize: '0.85rem' }}>
                      <FaPaperPlane size={13} />
                    </div>
                    <textarea
                      className="form-control"
                      name="messaggio"
                      rows="4"
                      value={formData.messaggio}
                      onChange={handleInputChange}
                      placeholder="Descrivi la tua richiesta..."
                      required
                      style={{ 
                        background: '#f5f5f7',
                        border: '1px solid #d1d1d6',
                        color: '#1d1d1f',
                        padding: '11px 13px 11px 36px',
                        borderRadius: '8px',
                        fontSize: '0.88rem',
                        resize: 'vertical',
                        minHeight: '95px',
                        transition: 'all 0.15s ease'
                      }}
                      onFocus={(e) => { 
                        e.target.style.borderColor = '#0071e3'; 
                        e.target.style.boxShadow = '0 0 0 3px rgba(0,113,227,0.12)'; 
                        e.target.style.background = '#ffffff';
                      }}
                      onBlur={(e) => { 
                        e.target.style.borderColor = '#d1d1d6'; 
                        e.target.style.boxShadow = 'none'; 
                        e.target.style.background = '#f5f5f7';
                      }}
                    ></textarea>
                  </div>
                </div>

                {/* Pulsante */}
                <div className="d-flex align-items-center justify-content-between gap-3">
                  <small style={{ color: '#6b6b70', fontSize: '0.75rem' }}>
                    <FaShieldAlt className="me-1" size={11} style={{ color: '#30c56d' }} />
                    I tuoi dati sono al sicuro
                  </small>
                  <button 
                    type="submit" 
                    className="btn d-inline-flex align-items-center gap-2 fw-semibold"
                    disabled={isSubmitting}
                    style={{ 
                      background: isSubmitting ? 'rgba(0,113,227,0.4)' : '#0071e3',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 24px',
                      fontSize: '0.85rem',
                      color: '#fff',
                      letterSpacing: '-0.01em',
                      transition: 'all 0.15s ease',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                    onMouseEnter={(e) => { 
                      if (!isSubmitting) { 
                        e.target.style.background = '#0077ed';
                      }
                    }}
                    onMouseLeave={(e) => { 
                      e.target.style.background = '#0071e3';
                    }}
                  >
                    {isSubmitting ? (
                      <><span className="spinner-border spinner-border-sm me-1" role="status"></span> Invio...</>
                    ) : (
                      <><FaPaperPlane size={13} /> Invia Messaggio</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Canali Diretti */}
            <div className="overflow-hidden mb-4 p-4" style={{ 
              background: '#16181c',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
            }}>
              <h5 className="dark-title mb-4">Canali Diretti</h5>
              
              <div className="dark-feature mb-3">
                <div className="dark-feature-icon" style={{ background: 'rgba(0,113,227,0.12)', color: '#0071e3' }}>
                  <FaEnvelope />
                </div>
                <div>
                  <small className="dark-muted d-block text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>Email</small>
                  <a href="mailto:info@softmatch.it" className="text-decoration-none" style={{ color: '#f5f5f7', fontSize: '0.85rem', fontWeight: 600 }}>info@softmatch.it</a>
                </div>
              </div>

              <div className="dark-feature mb-3">
                <div className="dark-feature-icon" style={{ background: 'rgba(48,197,109,0.12)', color: '#30c56d' }}>
                  <FaWhatsapp />
                </div>
                <div>
                  <small className="dark-muted d-block text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>WhatsApp</small>
                  <a href="https://wa.me/393906600661" className="text-decoration-none" target="_blank" rel="noopener noreferrer" style={{ color: '#f5f5f7', fontSize: '0.85rem', fontWeight: 600 }}>+39 390 6600661</a>
                </div>
              </div>

              <div className="dark-feature">
                <div className="dark-feature-icon" style={{ background: 'rgba(0,162,255,0.12)', color: '#00a2ff' }}>
                  <FaClock />
                </div>
                <div>
                  <small className="dark-muted d-block text-uppercase fw-bold" style={{ fontSize: '0.65rem' }}>Orari</small>
                  <span style={{ color: '#f5f5f7', fontSize: '0.85rem', fontWeight: 600 }}>Lun-Ven 9:00 - 18:00</span>
                </div>
              </div>
            </div>

            {/* Dove Siamo */}
            <div className="overflow-hidden mb-4 p-4" style={{ 
              background: '#16181c',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
            }}>
              <h5 className="dark-title mb-3">Dove Siamo</h5>
              <div className="d-flex align-items-start mb-3">
                <FaMapMarkerAlt style={{ color: '#ff3b30' }} className="me-2 mt-1" />
                <p className="dark-muted small mb-0">
                  Via dell'Innovazione, 123<br />
                  20100 Milano (MI), Italia
                </p>
              </div>
              <div className="d-flex align-items-center">
                <FaGlobe style={{ color: '#0071e3' }} className="me-2" />
                <small className="dark-muted">P.IVA: 12345678901</small>
              </div>
            </div>

            {/* Social */}
            <div className="overflow-hidden p-4 text-center" style={{ 
              background: '#16181c',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
            }}>
              <h5 className="dark-title mb-3">Seguici</h5>
              <div className="d-flex justify-content-center gap-3">
                {[
                  { icon: <FaLinkedin size={18} />, color: '#0071e3' },
                  { icon: <FaTwitter size={18} />, color: '#00a2ff' },
                  { icon: <FaInstagram size={18} />, color: '#ff3b30' },
                ].map((s, i) => (
                  <a key={i} href="#" 
                    className="d-inline-flex align-items-center justify-content-center text-decoration-none" 
                    style={{ 
                      width: 50, height: 50, borderRadius: '50%', 
                      background: `${s.color}12`, 
                      border: `1.5px solid ${s.color}25`,
                      color: s.color, 
                      transition: 'all 0.25s ease'
                    }}
                    onMouseEnter={(e) => { e.target.style.background = `${s.color}25`; e.target.style.transform = 'translateY(-3px)'; e.target.style.boxShadow = `0 6px 20px ${s.color}30`; }}
                    onMouseLeave={(e) => { e.target.style.background = `${s.color}12`; e.target.style.transform = 'none'; e.target.style.boxShadow = 'none'; }}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="dark-cta">
          <h3>Pronto a iniziare il tuo progetto?</h3>
          <p>Unisciti a noi e trasforma le tue idee in software di successo.</p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <a href="/register" className="btn btn-lg rounded-pill px-4 fw-bold" style={{ background: '#0071e3', border: 'none', borderRadius: '980px' }}>Registrati ora</a>
            <a href="/faq" className="btn btn-lg rounded-pill px-4" style={{ border: '1px solid rgba(255,255,255,0.2)', color: '#f5f5f7', borderRadius: '980px' }}>Consulta FAQ</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contatti; 

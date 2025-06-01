import { useState } from 'react';
import { 
  FaQuestionCircle, 
  FaComments, 
  FaUserShield, 
  FaPlus, 
  FaMinus,
  FaUser,
  FaCrown,
  FaPaperPlane,
  FaSearch,
  FaFilter,
  FaThumbsUp,
  FaReply,
  FaExclamationTriangle,
  FaInfoCircle,
  FaLightbulb,
  FaShieldAlt
} from 'react-icons/fa';
import './FAQ.css';

function FAQ() {
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // FAQ predefinite organizzate per categoria
  const faqData = [
    {
      id: 1,
      category: 'account',
      question: "Come posso registrarmi sulla piattaforma?",
      answer: "La registrazione è semplice e gratuita. Clicca su 'Registrati', compila il form con i tuoi dati e verifica la tua email. Per gli sviluppatori è richiesta una verifica aggiuntiva delle competenze."
    },
    {
      id: 2,
      category: 'progetti',
      question: "Come funziona il processo di creazione di un progetto?",
      answer: "Dopo aver effettuato l'accesso, vai su 'Nuovo Progetto', descrivi dettagliatamente le tue esigenze, imposta il budget e i tempi. Il nostro algoritmo troverà gli sviluppatori più adatti al tuo progetto."
    },
    {
      id: 3,
      category: 'pagamenti',
      question: "I pagamenti sono sicuri?",
      answer: "Assolutamente sì! Utilizziamo sistemi di pagamento certificati e crittografia bancaria. I fondi vengono trattenuti in escrow fino al completamento soddisfacente del progetto."
    },
    {
      id: 4,
      category: 'sviluppatori',
      question: "Come vengono verificati gli sviluppatori?",
      answer: "Ogni sviluppatore passa attraverso un rigoroso processo di verifica: controllo identità, test tecnici, valutazione portfolio e verifica referenze professionali."
    },
    {
      id: 5,
      category: 'supporto',
      question: "Cosa succede se ci sono problemi durante il progetto?",
      answer: "Il nostro team di supporto monitora attivamente tutti i progetti. In caso di problemi, interveniamo immediatamente per mediare e trovare una soluzione equa per entrambe le parti."
    }
  ];

  // Commenti degli utenti con risposte admin (simulati)
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "Marco Rossi",
      userType: "client",
      date: "2024-01-15",
      comment: "Ottima piattaforma! Ho trovato uno sviluppatore eccellente per il mio e-commerce. Processo molto trasparente.",
      likes: 12,
      adminReply: {
        admin: "Admin Sarah",
        date: "2024-01-15",
        reply: "Grazie Marco! Siamo felici che tu abbia avuto un'esperienza positiva. Continua a condividere i tuoi feedback!"
      }
    },
    {
      id: 2,
      user: "Laura Bianchi",
      userType: "developer",
      date: "2024-01-14",
      comment: "Come sviluppatrice, apprezzo molto il sistema di pagamenti protetti. Finalmente posso lavorare senza preoccupazioni!",
      likes: 8,
      adminReply: {
        admin: "Admin Tech",
        date: "2024-01-14",
        reply: "Esatto Laura! La sicurezza dei pagamenti è una nostra priorità assoluta. Grazie per essere parte della nostra community!"
      }
    },
    {
      id: 3,
      user: "Giuseppe Verde",
      userType: "client",
      date: "2024-01-13",
      comment: "Vorrei sapere se è possibile avere un progetto con più sviluppatori che lavorano insieme.",
      likes: 5,
      adminReply: null // In attesa di risposta
    }
  ]);

  const categories = [
    { id: 'all', name: 'Tutte le Categorie', icon: FaQuestionCircle },
    { id: 'account', name: 'Account e Registrazione', icon: FaUser },
    { id: 'progetti', name: 'Gestione Progetti', icon: FaLightbulb },
    { id: 'pagamenti', name: 'Pagamenti e Sicurezza', icon: FaShieldAlt },
    { id: 'sviluppatori', name: 'Sviluppatori', icon: FaUserShield },
    { id: 'supporto', name: 'Supporto', icon: FaComments }
  ];

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        user: "Tu", // In una vera app, questo verrebbe dal sistema di autenticazione
        userType: "client", // Simulato
        date: new Date().toISOString().split('T')[0],
        comment: newComment,
        likes: 0,
        adminReply: null
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredComments = comments.filter(comment =>
    comment.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-vh-100 bg-gradient faq-page">
      {/* Hero Section */}
      <div className="hero-section bg-primary text-white position-relative overflow-hidden">
        <div className="container py-5 position-relative z-2">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="display-3 fw-bold mb-4">
                <FaQuestionCircle className="me-3 text-warning" />
                FAQ & Community
              </h1>
              <p className="lead mb-4 opacity-90">
                Trova risposte alle domande più frequenti e partecipa alla discussione con la nostra community. 
                Gli <strong>utenti registrati</strong> possono lasciare commenti e ricevere risposte dirette dal nostro team di esperti.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <div className="feature-badge">
                  <FaQuestionCircle className="me-2" />
                  FAQ Dettagliate
                </div>
                <div className="feature-badge">
                  <FaComments className="me-2" />
                  Community Attiva
                </div>
                <div className="feature-badge">
                  <FaUserShield className="me-2" />
                  Supporto Admin
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-decoration"></div>
      </div>

      <div className="container py-5">
        {/* Sezione Ricerca e Filtri */}
        <div className="search-section mb-5">
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Cerca nelle FAQ o nei commenti..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-lg-4">
              <select
                className="form-select form-select-lg"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sezione FAQ */}
        <div className="faq-section mb-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-primary mb-3">
              <FaQuestionCircle className="me-3 text-info" />
              Domande Frequenti
            </h2>
            <p className="lead text-light">
              Le risposte alle domande più comuni sulla nostra piattaforma
            </p>
          </div>

          <div className="row">
            <div className="col-lg-10 mx-auto">
              {filteredFAQs.map(faq => (
                <div key={faq.id} className="faq-item mb-3">
                  <div 
                    className="faq-question"
                    onClick={() => toggleFAQ(faq.id)}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0 fw-bold">{faq.question}</h5>
                      <div className="faq-toggle">
                        {expandedFAQ === faq.id ? <FaMinus /> : <FaPlus />}
                      </div>
                    </div>
                  </div>
                  {expandedFAQ === faq.id && (
                    <div className="faq-answer">
                      <p className="mb-0">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sezione Community Comments */}
        <div className="community-section">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-primary mb-3">
              <FaComments className="me-3 text-success" />
              Community & Supporto
            </h2>
            <p className="lead text-light">
              Condividi la tua esperienza, fai domande e ricevi risposte dal nostro team
            </p>
          </div>

          {/* Info Box per utenti non registrati */}
          <div className="alert alert-info border-0 rounded-4 mb-4">
            <div className="d-flex align-items-center">
              <FaInfoCircle className="me-3 text-info" size={24} />
              <div>
                <strong>Per Utenti Registrati:</strong> Accedi al tuo account per lasciare commenti, 
                fare domande specifiche e ricevere risposte personalizzate dal nostro team di supporto.
                <br />
                <small className="text-muted">
                  Non hai un account? <a href="/registrazione" className="text-decoration-none">Registrati gratuitamente</a>
                </small>
              </div>
            </div>
          </div>

          {/* Form per nuovo commento */}
          <div className="comment-form-section mb-5">
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3 text-primary">
                  <FaPaperPlane className="me-2" />
                  Lascia un Commento o una Domanda
                </h5>
                <form onSubmit={handleSubmitComment}>
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Condividi la tua esperienza, fai una domanda o lascia un feedback..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      <FaExclamationTriangle className="me-1" />
                      I commenti sono moderati e riceverai una risposta entro 24 ore
                    </small>
                    <button type="submit" className="btn btn-primary">
                      <FaPaperPlane className="me-2" />
                      Invia Commento
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Lista Commenti */}
          <div className="comments-list">
            <h5 className="fw-bold mb-4 text-primary">
              Commenti della Community ({filteredComments.length})
            </h5>
            
            {filteredComments.map(comment => (
              <div key={comment.id} className="comment-item mb-4">
                <div className="card border-0 shadow-sm rounded-3">
                  <div className="card-body p-4">
                    {/* Header del commento */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center">
                        <div className={`user-avatar ${comment.userType}`}>
                          {comment.userType === 'developer' ? <FaUserShield /> : <FaUser />}
                        </div>
                        <div className="ms-3">
                          <h6 className="mb-0 fw-bold">{comment.user}</h6>
                          <small className="text-muted">
                            {comment.userType === 'developer' ? 'Sviluppatore' : 'Cliente'} • {comment.date}
                          </small>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <button className="btn btn-sm btn-outline-primary me-2">
                          <FaThumbsUp className="me-1" />
                          {comment.likes}
                        </button>
                        <button className="btn btn-sm btn-outline-secondary">
                          <FaReply />
                        </button>
                      </div>
                    </div>

                    {/* Contenuto del commento */}
                    <p className="mb-3">{comment.comment}</p>

                    {/* Risposta Admin */}
                    {comment.adminReply && (
                      <div className="admin-reply mt-3 p-3 bg-light rounded-3">
                        <div className="d-flex align-items-center mb-2">
                          <div className="admin-avatar">
                            <FaCrown />
                          </div>
                          <div className="ms-2">
                            <h6 className="mb-0 fw-bold text-warning">{comment.adminReply.admin}</h6>
                            <small className="text-muted">Team Domanda & Software • {comment.adminReply.date}</small>
                          </div>
                        </div>
                        <p className="mb-0 text-dark">{comment.adminReply.reply}</p>
                      </div>
                    )}

                    {/* In attesa di risposta */}
                    {!comment.adminReply && (
                      <div className="pending-reply mt-3 p-3 bg-warning bg-opacity-10 rounded-3">
                        <div className="d-flex align-items-center">
                          <FaExclamationTriangle className="text-warning me-2" />
                          <small className="text-muted">
                            <strong>In attesa di risposta admin</strong> - Riceverai una notifica quando il team risponderà
                          </small>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="cta-section mt-5">
            <div className="card border-0 shadow-lg rounded-4 bg-gradient-primary text-white">
              <div className="card-body p-5 text-center">
                <FaUserShield size={60} className="mb-4 text-warning" />
                <h3 className="fw-bold mb-3">Hai Bisogno di Supporto Personalizzato?</h3>
                <p className="lead mb-4">
                  Il nostro team di esperti è sempre disponibile per aiutarti con qualsiasi domanda specifica
                </p>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <button className="btn btn-light btn-lg">
                    <FaComments className="me-2" />
                    Contatta il Supporto
                  </button>
                  <button className="btn btn-outline-light btn-lg">
                    <FaQuestionCircle className="me-2" />
                    Guida Completa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQ; 
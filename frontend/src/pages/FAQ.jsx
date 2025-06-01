import { useState, useEffect } from 'react';
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
  FaShieldAlt,
  FaSpinner
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import faqService from '../services/faqService';
import './FAQ.css';

function FAQ() {
  const { user, isAuthenticated } = useAuth();
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  
  // Dati dal backend
  const [categories, setCategories] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [comments, setComments] = useState([]);
  const [stats, setStats] = useState(null);

  // Carica dati iniziali
  useEffect(() => {
    loadInitialData();
  }, []);

  // Filtra FAQ quando cambiano i parametri di ricerca
  useEffect(() => {
    if (categories.length > 0) {
      loadFAQs();
    }
  }, [searchTerm, selectedCategory, categories]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Carica categorie, FAQ iniziali, commenti e statistiche in parallelo
      const [categoriesData, faqsData, commentsData, statsData] = await Promise.all([
        faqService.getCategories(),
        faqService.getFAQs(),
        faqService.getComments(),
        faqService.getStats().catch(() => null) // Le statistiche sono opzionali
      ]);

      setCategories([
        { id: 'all', name: 'Tutte le Categorie', icon: 'FaQuestionCircle' },
        ...categoriesData
      ]);
      setFaqs(faqsData);
      setComments(commentsData);
      setStats(statsData);
      
    } catch (error) {
      console.error('Errore nel caricamento dati FAQ:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFAQs = async () => {
    try {
      let faqsData;
      
      if (searchTerm || selectedCategory !== 'all') {
        // Usa la ricerca se ci sono filtri
        faqsData = await faqService.searchFAQs(searchTerm, selectedCategory);
      } else {
        // Carica tutte le FAQ
        faqsData = await faqService.getFAQs();
      }
      
      setFaqs(faqsData);
    } catch (error) {
      console.error('Errore nel caricamento FAQ:', error);
    }
  };

  const toggleFAQ = async (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
    
    // Se stiamo espandendo una FAQ, carica i suoi dettagli e commenti
    if (expandedFAQ !== id) {
      try {
        const [faqDetails, faqComments] = await Promise.all([
          faqService.getFAQ(id),
          faqService.getComments(id)
        ]);
        
        // Aggiorna la FAQ con i dettagli completi
        setFaqs(prevFaqs => 
          prevFaqs.map(faq => 
            faq.id === id ? { ...faq, ...faqDetails } : faq
          )
        );
        
        // Aggiorna i commenti per questa FAQ
        setComments(faqComments);
      } catch (error) {
        console.error('Errore nel caricamento dettagli FAQ:', error);
      }
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Devi essere autenticato per lasciare un commento');
      return;
    }
    
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      
      const commentData = {
        comment: newComment,
        faq: expandedFAQ, // Se stiamo commentando una FAQ specifica
        is_question: false
      };
      
      const newCommentResponse = await faqService.createComment(commentData);
      
      // Aggiungi il nuovo commento alla lista (sarà in stato 'pending')
      setComments(prevComments => [newCommentResponse, ...prevComments]);
      setNewComment('');
      
      // Mostra messaggio di successo
      alert('Commento inviato! Sarà visibile dopo la moderazione.');
      
    } catch (error) {
      console.error('Errore nell\'invio commento:', error);
      alert('Errore nell\'invio del commento. Riprova.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleVoteHelpful = async (faqId) => {
    if (!isAuthenticated) {
      alert('Devi essere autenticato per votare');
      return;
    }

    try {
      const response = await faqService.voteHelpful(faqId);
      
      // Aggiorna il contatore nella FAQ
      setFaqs(prevFaqs =>
        prevFaqs.map(faq =>
          faq.id === faqId 
            ? { ...faq, helpful_count: response.helpful_count, user_has_voted_helpful: true }
            : faq
        )
      );
      
    } catch (error) {
      if (error.response?.status === 400) {
        alert('Hai già votato questa FAQ');
      } else {
        console.error('Errore nel voto:', error);
        alert('Errore nel voto. Riprova.');
      }
    }
  };

  const handleToggleCommentLike = async (commentId) => {
    if (!isAuthenticated) {
      alert('Devi essere autenticato per mettere like');
      return;
    }

    try {
      const response = await faqService.toggleCommentLike(commentId);
      
      // Aggiorna il commento nella lista
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === commentId
            ? { 
                ...comment, 
                likes_count: response.likes_count,
                user_has_liked: !comment.user_has_liked
              }
            : comment
        )
      );
      
    } catch (error) {
      console.error('Errore nel like:', error);
      alert('Errore nel like. Riprova.');
    }
  };

  // Filtra FAQ e commenti localmente per la ricerca in tempo reale
  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || 
                           faq.category_slug === selectedCategory;
    const matchesSearch = !searchTerm || 
                         faq.question.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredComments = comments.filter(comment =>
    comment.status === 'approved' && (
      !searchTerm ||
      comment.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.user_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="min-vh-100 bg-gradient faq-page d-flex align-items-center justify-content-center">
        <div className="text-center text-white">
          <FaSpinner className="fa-spin mb-3" size={48} />
          <h4>Caricamento FAQ...</h4>
        </div>
      </div>
    );
  }

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
                  {stats?.total_faqs || 0} FAQ
                </div>
                <div className="feature-badge">
                  <FaComments className="me-2" />
                  {stats?.total_comments || 0} Commenti
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
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map(faq => (
                  <div key={faq.id} className="faq-item mb-3">
                    <div 
                      className="faq-question"
                      onClick={() => toggleFAQ(faq.id)}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="flex-grow-1">
                          <h5 className="mb-1 fw-bold">{faq.question}</h5>
                          <small className="text-muted">
                            {faq.category_name} • {faq.views_count} visualizzazioni • {faq.helpful_count} voti utili
                          </small>
                        </div>
                        <div className="faq-toggle">
                          {expandedFAQ === faq.id ? <FaMinus /> : <FaPlus />}
                        </div>
                      </div>
                    </div>
                    {expandedFAQ === faq.id && (
                      <div className="faq-answer">
                        <p className="mb-3">{faq.answer}</p>
                        
                        {/* Azioni FAQ */}
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            {isAuthenticated && faq.can_vote_helpful && !faq.user_has_voted_helpful && (
                              <button 
                                className="btn btn-sm btn-outline-success me-2"
                                onClick={() => handleVoteHelpful(faq.id)}
                              >
                                <FaThumbsUp className="me-1" />
                                Utile ({faq.helpful_count})
                              </button>
                            )}
                            {faq.user_has_voted_helpful && (
                              <span className="text-success">
                                <FaThumbsUp className="me-1" />
                                Hai trovato utile questa FAQ
                              </span>
                            )}
                          </div>
                          <small className="text-muted">
                            {faq.comments_count || 0} commenti
                          </small>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-5">
                  <FaQuestionCircle size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">Nessuna FAQ trovata</h5>
                  <p className="text-muted">Prova a modificare i filtri di ricerca</p>
                </div>
              )}
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
          {!isAuthenticated && (
            <div className="alert alert-info border-0 rounded-4 mb-4">
              <div className="d-flex align-items-center">
                <FaInfoCircle className="me-3 text-info" size={24} />
                <div>
                  <strong>Per Utenti Registrati:</strong> Accedi al tuo account per lasciare commenti, 
                  fare domande specifiche e ricevere risposte personalizzate dal nostro team di supporto.
                  <br />
                  <small className="text-muted">
                    Non hai un account? <a href="/register" className="text-decoration-none">Registrati gratuitamente</a>
                  </small>
                </div>
              </div>
            </div>
          )}

          {/* Form per nuovo commento */}
          {isAuthenticated && (
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
                        disabled={submittingComment}
                      ></textarea>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        <FaExclamationTriangle className="me-1" />
                        I commenti sono moderati e riceverai una risposta entro 24 ore
                      </small>
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={submittingComment}
                      >
                        {submittingComment ? (
                          <>
                            <FaSpinner className="fa-spin me-2" />
                            Invio...
                          </>
                        ) : (
                          <>
                            <FaPaperPlane className="me-2" />
                            Invia Commento
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Lista Commenti */}
          <div className="comments-list">
            <h5 className="fw-bold mb-4 text-primary">
              Commenti della Community ({filteredComments.length})
            </h5>
            
            {filteredComments.length > 0 ? (
              filteredComments.map(comment => (
                <div key={comment.id} className="comment-item mb-4">
                  <div className="card border-0 shadow-sm rounded-3">
                    <div className="card-body p-4">
                      {/* Header del commento */}
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center">
                          <div className={`user-avatar ${comment.user_type}`}>
                            {comment.user_type === 'fornitore' ? <FaUserShield /> : <FaUser />}
                          </div>
                          <div className="ms-3">
                            <h6 className="mb-0 fw-bold">{comment.user_name || comment.user_username}</h6>
                            <small className="text-muted">
                              {comment.user_type === 'fornitore' ? 'Sviluppatore' : 'Cliente'} • {faqService.formatDate(comment.created_at)}
                            </small>
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          {isAuthenticated && comment.can_like && (
                            <button 
                              className={`btn btn-sm me-2 ${comment.user_has_liked ? 'btn-primary' : 'btn-outline-primary'}`}
                              onClick={() => handleToggleCommentLike(comment.id)}
                            >
                              <FaThumbsUp className="me-1" />
                              {comment.likes_count}
                            </button>
                          )}
                          {!isAuthenticated && (
                            <span className="btn btn-sm btn-outline-secondary me-2">
                              <FaThumbsUp className="me-1" />
                              {comment.likes_count}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Contenuto del commento */}
                      <p className="mb-3">{comment.comment}</p>

                      {/* Risposta Admin */}
                      {comment.admin_reply && (
                        <div className="admin-reply mt-3 p-3 bg-light rounded-3">
                          <div className="d-flex align-items-center mb-2">
                            <div className="admin-avatar">
                              <FaCrown />
                            </div>
                            <div className="ms-2">
                              <h6 className="mb-0 fw-bold text-warning">
                                {comment.admin_reply.admin_name || comment.admin_reply.admin_username}
                              </h6>
                              <small className="text-muted">
                                Team Domanda & Software • {faqService.formatDate(comment.admin_reply.created_at)}
                              </small>
                            </div>
                          </div>
                          <p className="mb-0 text-dark">{comment.admin_reply.reply}</p>
                        </div>
                      )}

                      {/* In attesa di risposta */}
                      {!comment.admin_reply && (
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
              ))
            ) : (
              <div className="text-center py-5">
                <FaComments size={48} className="text-muted mb-3" />
                <h5 className="text-muted">Nessun commento trovato</h5>
                <p className="text-muted">Sii il primo a lasciare un commento!</p>
              </div>
            )}
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
                  <a href="/contatti" className="btn btn-light btn-lg">
                    <FaComments className="me-2" />
                    Contatta il Supporto
                  </a>
                  <a href="/docs" className="btn btn-outline-light btn-lg">
                    <FaQuestionCircle className="me-2" />
                    Guida Completa
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

export default FAQ; 
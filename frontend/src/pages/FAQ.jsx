import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
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
  FaSpinner,
  FaHeadset,
  FaUsers
} from 'react-icons/fa';
import PageHeader from '../components/PageHeader';
import faqService from '../services/faqService';
import '../styles/MacStyle.css';

function FAQ() {
  const { isAuthenticated } = useAuth();
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

  const loadFAQs = useCallback(async () => {
    try {
      let faqsData;
      
      if (searchTerm || selectedCategory !== 'all') {
        faqsData = await faqService.searchFAQs(searchTerm, selectedCategory);
      } else {
        faqsData = await faqService.getFAQs();
      }
      
      setFaqs(faqsData);
    } catch (error) {
      console.error('Errore nel caricamento FAQ:', error);
    }
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    if (categories.length > 0) {
      loadFAQs();
    }
  }, [categories.length, loadFAQs]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      const [categoriesData, faqsData, commentsData, statsData] = await Promise.all([
        faqService.getCategories(),
        faqService.getFAQs(),
        faqService.getComments(),
        faqService.getStats().catch(() => null)
      ]);

      setCategories([
        { id: 'all', slug: 'all', name: 'Tutte le Categorie', icon: 'FaQuestionCircle' },
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

  const toggleFAQ = async (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
    
    if (expandedFAQ !== id) {
      try {
        const [faqDetails, faqComments] = await Promise.all([
          faqService.getFAQ(id),
          faqService.getComments(id)
        ]);
        
        setFaqs(prevFaqs => 
          prevFaqs.map(faq => 
            faq.id === id ? { ...faq, ...faqDetails } : faq
          )
        );
        
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
        faq: expandedFAQ,
        is_question: false
      };
      
      const newCommentResponse = await faqService.createComment(commentData);
      setComments(prevComments => [newCommentResponse, ...prevComments]);
      setNewComment('');
      alert('Commento inviato! Sarà visibile dopo la moderazione dello staff.');
      
    } catch (error) {
      console.error('Errore nell\'invio commento:', error);
      alert('Errore nell\'invio del commento. Riprova tra poco.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleVoteHelpful = async (faqId) => {
    if (!isAuthenticated) {
      alert('Devi effettuare il login per votare');
      return;
    }

    try {
      const response = await faqService.voteHelpful(faqId);
      
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
    }
  };

  // Filtra FAQ localmente per la ricerca in tempo reale
  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || 
                           faq.category_slug === selectedCategory;
    const matchesSearch = !searchTerm || 
                         faq.question.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <FaSpinner className="text-primary mb-3" size={48} style={{ animation: 'spin 1s linear infinite' }} />
          <h5 className="mac-subtitle mt-3">Caricamento Centro Aiuto...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5">
      {/* Hero Section - Mac Style */}
      <PageHeader 
        title="Centro Aiuto & FAQ"
        subtitle="Trova risposte rapide alle domande più comuni o contatta il nostro team di supporto. Siamo qui per aiutarti a far crescere il tuo business su SoftMatch."
        badge="SUPPORTO & FAQ"
        icon={FaQuestionCircle}
        theme="info"
      />

      {/* Badge Features */}
      <div className="row justify-content-center mb-5">
        <div className="col-lg-8">
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <div className="mac-glass-card px-4 py-2 d-flex align-items-center shadow-sm">
              <FaHeadset className="text-success me-2" size={16} />
              <span className="small fw-bold">Supporto 24/7</span>
            </div>
            <div className="mac-glass-card px-4 py-2 d-flex align-items-center shadow-sm">
              <FaUsers className="text-primary me-2" size={16} />
              <span className="small fw-bold">Community Attiva</span>
            </div>
            <div className="mac-glass-card px-4 py-2 d-flex align-items-center shadow-sm">
              <FaShieldAlt className="text-warning me-2" size={16} />
              <span className="small fw-bold">Staff Certificato</span>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Sidebar Filtri - Mac Style */}
        <div className="col-lg-3">
          <div className="sticky-top" style={{ top: '100px' }}>
            <div className="mac-glass-card p-4 mb-4">
              <h5 className="mac-title mb-4 d-flex align-items-center">
                <FaFilter className="me-2 text-primary" size={16} /> 
                Categorie
              </h5>
              <div className="d-flex flex-column gap-2">
                {categories.map(category => (
                  <button 
                    key={category.id} 
                    className={`btn text-start fw-semibold rounded-3 px-3 py-2 d-flex align-items-center transition-all ${
                      selectedCategory === category.slug 
                        ? 'btn-primary shadow-sm' 
                        : 'btn-light-transparent mac-subtitle'
                    }`}
                    onClick={() => setSelectedCategory(category.slug)}
                    style={{ fontSize: '0.9rem', border: 'none' }}
                  >
                    <FaQuestionCircle 
                      className={`me-2 ${selectedCategory === category.slug ? 'text-white' : 'text-primary'}`} 
                      size={13} 
                    />
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Statistiche Community */}
            {stats && (
              <div className="mac-glass-card p-4">
                <h5 className="mac-title mb-4">Statistiche</h5>
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <span className="mac-subtitle small">FAQ totali</span>
                  <span className="fw-bold text-primary">{stats.total_faqs}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <span className="mac-subtitle small">Commenti</span>
                  <span className="fw-bold text-info">{stats.total_comments}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="mac-subtitle small">Voti utili</span>
                  <span className="fw-bold text-success">{stats.total_helpful_votes}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contenuto principale */}
        <div className="col-lg-9">
          {/* Barra di Ricerca */}
          <div className="mac-glass-card p-4 mb-5">
            <div className="input-group input-group-lg border-0 bg-light rounded-4 p-1 shadow-sm">
              <span className="input-group-text bg-transparent border-0 ps-3">
                <FaSearch className="text-muted" />
              </span>
              <input 
                type="text" 
                className="form-control bg-transparent border-0 shadow-none ps-2" 
                placeholder="Cerca tra le domande frequenti..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ borderRadius: '0 15px 15px 0' }}
              />
              {searchTerm && (
                <button 
                  className="btn btn-light border-0 rounded-4 me-1"
                  onClick={() => setSearchTerm('')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Lista FAQ */}
          <div className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="mac-title mb-0">
                Domande Frequenti
              </h4>
              <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2">
                {filteredFAQs.length} risposta{filteredFAQs.length !== 1 ? 'e' : ''}
              </span>
            </div>

            {filteredFAQs.length > 0 ? (
              filteredFAQs.map(faq => (
                <div key={faq.id} className="mac-glass-card mb-3 overflow-hidden border-0" style={{ borderRadius: '20px', transition: 'all 0.3s ease' }}>
                  <button 
                    className="w-100 text-start bg-transparent border-0 p-4 d-flex justify-content-between align-items-center"
                    onClick={() => toggleFAQ(faq.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3 flex-shrink-0">
                        <FaQuestionCircle className="text-primary" size={16} />
                      </div>
                      <h5 className="mac-title mb-0" style={{ fontSize: '1rem', fontWeight: 600 }}>
                        {faq.question}
                      </h5>
                    </div>
                    <div className="flex-shrink-0 ms-3">
                      {expandedFAQ === faq.id 
                        ? <FaMinus className="text-primary" size={14} /> 
                        : <FaPlus className="text-muted" size={14} />
                      }
                    </div>
                  </button>
                  
                  {expandedFAQ === faq.id && (
                    <div className="px-4 pb-4 bg-light bg-opacity-40 border-top">
                      <p className="mac-subtitle pt-4 mb-4" style={{ lineHeight: '1.7' }}>
                        {faq.answer}
                      </p>
                      
                      <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                        <div className="d-flex align-items-center gap-3">
                          <span className="mac-subtitle small">Questa risposta ti è stata utile?</span>
                          <button 
                            className={`btn btn-sm rounded-pill px-3 ${faq.user_has_voted_helpful ? 'btn-success' : 'btn-outline-success'}`}
                            onClick={() => handleVoteHelpful(faq.id)}
                            disabled={faq.user_has_voted_helpful}
                          >
                            <FaThumbsUp className="me-1" size={12} /> {faq.helpful_count || 0}
                          </button>
                        </div>
                        <span className="mac-subtitle small">
                          Categoria: <strong>{faq.category_name}</strong>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-5 mac-glass-card">
                <FaSearch size={48} className="text-muted mb-3" />
                <h5 className="mac-title">Nessuna FAQ trovata</h5>
                <p className="mac-subtitle">Prova con un termine di ricerca diverso o cambia categoria</p>
                <button className="btn btn-primary mac-button" onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>
                  Mostra tutte le FAQ
                </button>
              </div>
            )}
          </div>

          {/* Area Discussione Community */}
          <div className="mb-5">
            <h4 className="mac-title mb-4">Comunità di discussione</h4>
            <div className="mac-glass-card p-4">
              {/* Form Commento */}
              <form onSubmit={handleSubmitComment} className="mb-5">
                <div className="d-flex align-items-start gap-3">
                  <div className="bg-primary bg-opacity-10 p-2 rounded-circle d-none d-md-flex align-items-center justify-content-center" style={{width: 40, height: 40}}>
                    <FaUser className="text-primary" size={14} />
                  </div>
                  <div className="flex-grow-1">
                    <textarea 
                      className="form-control border-0 bg-light rounded-4 mb-3" 
                      rows="3" 
                      placeholder={isAuthenticated 
                        ? "Hai una domanda o vuoi condividere la tua esperienza con la community?" 
                        : "Esegui il login per partecipare alla discussione"
                      }
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      disabled={!isAuthenticated}
                      style={{ resize: 'none', padding: '15px' }}
                    />
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="mac-subtitle">I commenti sono moderati dallo staff prima della pubblicazione</small>
                      <button 
                        type="submit" 
                        className="btn btn-primary mac-button rounded-pill px-4"
                        disabled={!isAuthenticated || submittingComment || !newComment.trim()}
                      >
                        {submittingComment 
                          ? <FaSpinner className="me-2" style={{ animation: 'spin 1s linear infinite' }} /> 
                          : <FaPaperPlane className="me-2" />
                        }
                        Commento pubblico
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Lista Commenti */}
              <div className="comments-list">
                {comments.length > 0 ? (
                  comments.map(comment => (
                    <div key={comment.id} className="mb-4 pb-4 border-bottom">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="d-flex align-items-center">
                          <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3" style={{width: 36, height: 36}}>
                            <FaUser size={14} className="text-secondary" />
                          </div>
                          <div>
                            <h6 className="mb-0 fw-bold" style={{ fontSize: '0.9rem' }}>{comment.user_username}</h6>
                            <small className="text-muted">{new Date(comment.created_at).toLocaleDateString('it-IT')}</small>
                          </div>
                        </div>
                        {comment.is_official && (
                          <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3">
                            <FaCrown className="me-1" size={10} /> Staff
                          </span>
                        )}
                      </div>
                      <p className="mac-subtitle mb-3 ms-5">{comment.comment}</p>
                      <div className="ms-5 d-flex gap-3">
                        <button 
                          className={`btn btn-sm btn-link text-decoration-none p-0 ${comment.user_has_liked ? 'text-danger' : 'text-muted'}`}
                          onClick={() => handleToggleCommentLike(comment.id)}
                        >
                          <FaThumbsUp className="me-1" size={12} /> {comment.likes_count} Like
                        </button>
                        <button className="btn btn-sm btn-link text-decoration-none p-0 text-muted">
                          <FaReply className="me-1" size={12} /> Rispondi
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <FaComments size={36} className="text-muted mb-3" />
                    <p className="mac-subtitle mb-0">Nessun commento presente. Sii il primo a partecipare!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .btn-light-transparent {
          background: transparent !important;
          color: inherit;
        }
        .btn-light-transparent:hover {
          background: rgba(0,0,0,0.04) !important;
        }
      ` }} />
    </div>
  );
}

export default FAQ;

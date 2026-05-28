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
import faqService from '../services/faqService';
import '../styles/MacStyle.css';
import '../styles/DarkPage.css';

function FAQ() {
  const { isAuthenticated } = useAuth();
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  
  const [categories, setCategories] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [comments, setComments] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => { loadInitialData(); }, []);

  const loadFAQs = useCallback(async () => {
    try {
      const faqsData = (searchTerm || selectedCategory !== 'all')
        ? await faqService.searchFAQs(searchTerm, selectedCategory)
        : await faqService.getFAQs();
      setFaqs(faqsData);
    } catch (error) {
      console.error('Errore nel caricamento FAQ:', error);
    }
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    if (categories.length > 0) loadFAQs();
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
        setFaqs(prevFaqs => prevFaqs.map(faq => faq.id === id ? { ...faq, ...faqDetails } : faq));
        setComments(faqComments);
      } catch (error) {
        console.error('Errore nel caricamento dettagli FAQ:', error);
      }
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { alert('Devi essere autenticato per lasciare un commento'); return; }
    if (!newComment.trim()) return;
    try {
      setSubmittingComment(true);
      const commentData = { comment: newComment, faq: expandedFAQ, is_question: false };
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
    if (!isAuthenticated) { alert('Devi effettuare il login per votare'); return; }
    try {
      const response = await faqService.voteHelpful(faqId);
      setFaqs(prevFaqs => prevFaqs.map(faq =>
        faq.id === faqId ? { ...faq, helpful_count: response.helpful_count, user_has_voted_helpful: true } : faq
      ));
    } catch (error) {
      if (error.response?.status === 400) alert('Hai già votato questa FAQ');
      else console.error('Errore nel voto:', error);
    }
  };

  const handleToggleCommentLike = async (commentId) => {
    if (!isAuthenticated) { alert('Devi essere autenticato per mettere like'); return; }
    try {
      const response = await faqService.toggleCommentLike(commentId);
      setComments(prevComments => prevComments.map(comment =>
        comment.id === commentId ? { ...comment, likes_count: response.likes_count, user_has_liked: !comment.user_has_liked } : comment
      ));
    } catch (error) {
      console.error('Errore nel like:', error);
    }
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category_slug === selectedCategory;
    const matchesSearch = !searchTerm || faq.question.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="dark-page min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <FaSpinner className="mb-3" size={48} style={{ color: '#0071e3', animation: 'spin 1s linear infinite' }} />
          <h5 className="dark-muted mt-3">Caricamento Centro Aiuto...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="dark-page">
      <div className="dark-hero">
        <div className="container">
          <div className="d-flex align-items-center justify-content-center mb-4 gap-3">
            <div className="dark-icon-circle">
              <FaQuestionCircle size={24} style={{ color: '#0071e3' }} />
            </div>
            <span className="dark-badge">SUPPORTO & FAQ</span>
          </div>
          <h1>Centro Aiuto & FAQ</h1>
          <p>
            Trova risposte rapide alle domande più comuni o contatta il nostro team di supporto. 
            Siamo qui per aiutarti a far crescere il tuo business su SoftMatch.
          </p>
        </div>
      </div>

      <div className="container">
        {/* Badge Features */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8">
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <div className="dark-card px-4 py-2 d-flex align-items-center" style={{ borderRadius: '980px', padding: '8px 18px' }}>
                <FaHeadset style={{ color: '#30c56d' }} className="me-2" size={16} />
                <span className="dark-muted small fw-bold">Supporto 24/7</span>
              </div>
              <div className="dark-card px-4 py-2 d-flex align-items-center" style={{ borderRadius: '980px', padding: '8px 18px' }}>
                <FaUsers style={{ color: '#0071e3' }} className="me-2" size={16} />
                <span className="dark-muted small fw-bold">Community Attiva</span>
              </div>
              <div className="dark-card px-4 py-2 d-flex align-items-center" style={{ borderRadius: '980px', padding: '8px 18px' }}>
                <FaShieldAlt style={{ color: '#ffc107' }} className="me-2" size={16} />
                <span className="dark-muted small fw-bold">Staff Certificato</span>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Sidebar Filtri */}
          <div className="col-lg-3">
            <div className="sticky-top" style={{ top: '100px' }}>
              <div className="dark-card p-4 mb-4">
                <h5 className="dark-title mb-4 d-flex align-items-center">
                  <FaFilter className="me-2" style={{ color: '#0071e3' }} size={16} /> 
                  Categorie
                </h5>
                <div className="d-flex flex-column gap-2">
                  {categories.map(category => (
                    <button 
                      key={category.id} 
                      className={`btn text-start fw-semibold rounded-3 px-3 py-2 d-flex align-items-center ${
                        selectedCategory === category.slug 
                          ? 'btn-primary shadow-sm' 
                          : ''
                      }`}
                      onClick={() => setSelectedCategory(category.slug)}
                      style={{ 
                        fontSize: '0.9rem', border: 'none',
                        background: selectedCategory === category.slug ? '#0071e3' : 'rgba(255,255,255,0.03)',
                        color: selectedCategory === category.slug ? '#fff' : '#86868b'
                      }}
                    >
                      <FaQuestionCircle className="me-2" size={13} 
                        style={{ color: selectedCategory === category.slug ? '#fff' : '#0071e3' }} 
                      />
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {stats && (
                <div className="dark-card p-4">
                  <h5 className="dark-title mb-4">Statistiche</h5>
                  <div className="d-flex justify-content-between align-items-center mb-3 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="dark-muted small">FAQ totali</span>
                    <span className="fw-bold" style={{ color: '#0071e3' }}>{stats.total_faqs}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="dark-muted small">Commenti</span>
                    <span className="fw-bold" style={{ color: '#00a2ff' }}>{stats.total_comments}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="dark-muted small">Voti utili</span>
                    <span className="fw-bold" style={{ color: '#30c56d' }}>{stats.total_helpful_votes}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contenuto principale */}
          <div className="col-lg-9">
            {/* Barra di Ricerca */}
            <div className="dark-card p-4 mb-5">
              <div className="input-group input-group-lg p-1 rounded-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="input-group-text bg-transparent border-0 ps-3">
                  <FaSearch className="dark-muted" />
                </span>
                <input 
                  type="text" 
                  className="form-control bg-transparent border-0 shadow-none ps-2" 
                  placeholder="Cerca tra le domande frequenti..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ borderRadius: '0 15px 15px 0', color: '#f5f5f7' }}
                />
                {searchTerm && (
                  <button 
                    className="btn border-0 rounded-4 me-1"
                    onClick={() => setSearchTerm('')}
                    style={{ color: '#86868b' }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Lista FAQ */}
            <div className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="dark-title mb-0">Domande Frequenti</h4>
                <span className="badge rounded-pill px-3 py-2" 
                  style={{ background: 'rgba(0,113,227,0.12)', color: '#0071e3' }}>
                  {filteredFAQs.length} risposta{filteredFAQs.length !== 1 ? 'e' : ''}
                </span>
              </div>

              {filteredFAQs.length > 0 ? (
                filteredFAQs.map(faq => (
                  <div key={faq.id} className="dark-card mb-3 overflow-hidden" style={{ borderRadius: '20px' }}>
                    <button 
                      className="w-100 text-start bg-transparent border-0 p-4 d-flex justify-content-between align-items-center"
                      onClick={() => toggleFAQ(faq.id)}
                      style={{ cursor: 'pointer', color: '#f5f5f7' }}
                    >
                      <div className="d-flex align-items-center">
                        <div className="dark-icon-circle me-3" style={{ width: 40, height: 40 }}>
                          <FaQuestionCircle style={{ color: '#0071e3' }} size={16} />
                        </div>
                        <h5 className="dark-title mb-0" style={{ fontSize: '1rem', fontWeight: 600 }}>
                          {faq.question}
                        </h5>
                      </div>
                      <div className="flex-shrink-0 ms-3">
                        {expandedFAQ === faq.id 
                          ? <FaMinus style={{ color: '#0071e3' }} size={14} /> 
                          : <FaPlus className="dark-muted" size={14} />
                        }
                      </div>
                    </button>
                    
                    {expandedFAQ === faq.id && (
                      <div className="px-4 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                        <p className="dark-muted pt-4 mb-4" style={{ lineHeight: '1.7' }}>
                          {faq.answer}
                        </p>
                        
                        <div className="d-flex justify-content-between align-items-center pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                          <div className="d-flex align-items-center gap-3">
                            <span className="dark-muted small">Questa risposta ti è stata utile?</span>
                            <button 
                              className={`btn btn-sm rounded-pill px-3 ${faq.user_has_voted_helpful ? 'btn-success' : ''}`}
                              onClick={() => handleVoteHelpful(faq.id)}
                              disabled={faq.user_has_voted_helpful}
                              style={!faq.user_has_voted_helpful ? { border: '1px solid rgba(48,197,109,0.3)', color: '#30c56d', background: 'transparent' } : {}}
                            >
                              <FaThumbsUp className="me-1" size={12} /> {faq.helpful_count || 0}
                            </button>
                          </div>
                          <span className="dark-muted small">
                            Categoria: <strong style={{ color: '#f5f5f7' }}>{faq.category_name}</strong>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-5 dark-card p-5">
                  <FaSearch size={48} className="dark-muted mb-3" />
                  <h5 className="dark-title">Nessuna FAQ trovata</h5>
                  <p className="dark-muted">Prova con un termine di ricerca diverso o cambia categoria</p>
                  <button className="btn rounded-pill px-4 fw-bold" 
                    onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                    style={{ background: '#0071e3', border: 'none', borderRadius: '980px' }}>
                    Mostra tutte le FAQ
                  </button>
                </div>
              )}
            </div>

            {/* Area Discussione Community */}
            <div className="mb-5">
              <h4 className="dark-title mb-4">Comunità di discussione</h4>
              <div className="dark-card p-4">
                <form onSubmit={handleSubmitComment} className="mb-5">
                  <div className="d-flex align-items-start gap-3">
                    <div className="dark-icon-circle d-none d-md-flex" style={{ width: 40, height: 40 }}>
                      <FaUser style={{ color: '#0071e3' }} size={14} />
                    </div>
                    <div className="flex-grow-1">
                      <textarea 
                        className="form-control rounded-4 mb-3" 
                        rows="3" 
                        placeholder={isAuthenticated 
                          ? "Hai una domanda o vuoi condividere la tua esperienza con la community?" 
                          : "Esegui il login per partecipare alla discussione"
                        }
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={!isAuthenticated}
                        style={{ 
                          resize: 'none', padding: '15px', 
                          background: 'rgba(255,255,255,0.04)', 
                          border: '1px solid rgba(255,255,255,0.08)', 
                          color: '#f5f5f7' 
                        }}
                      />
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="dark-muted">I commenti sono moderati dallo staff prima della pubblicazione</small>
                        <button 
                          type="submit" 
                          className="btn rounded-pill px-4 fw-bold"
                          disabled={!isAuthenticated || submittingComment || !newComment.trim()}
                          style={{ background: '#0071e3', border: 'none', borderRadius: '980px' }}
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

                <div className="comments-list">
                  {comments.length > 0 ? (
                    comments.map(comment => (
                      <div key={comment.id} className="mb-4 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                              style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.05)' }}>
                              <FaUser size={14} className="dark-muted" />
                            </div>
                            <div>
                              <h6 className="mb-0 fw-bold dark-title" style={{ fontSize: '0.9rem' }}>{comment.user_username}</h6>
                              <small className="dark-muted">{new Date(comment.created_at).toLocaleDateString('it-IT')}</small>
                            </div>
                          </div>
                          {comment.is_official && (
                            <span className="badge rounded-pill px-3" 
                              style={{ background: 'rgba(0,113,227,0.12)', color: '#0071e3' }}>
                              <FaCrown className="me-1" size={10} /> Staff
                            </span>
                          )}
                        </div>
                        <p className="dark-muted mb-3 ms-5">{comment.comment}</p>
                        <div className="ms-5 d-flex gap-3">
                          <button 
                            className={`btn btn-sm btn-link text-decoration-none p-0 ${comment.user_has_liked ? '' : ''}`}
                            onClick={() => handleToggleCommentLike(comment.id)}
                            style={{ color: comment.user_has_liked ? '#ff3b30' : '#86868b' }}
                          >
                            <FaThumbsUp className="me-1" size={12} /> {comment.likes_count} Like
                          </button>
                          <button className="btn btn-sm btn-link text-decoration-none p-0" style={{ color: '#86868b' }}>
                            <FaReply className="me-1" size={12} /> Rispondi
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <FaComments size={36} className="dark-muted mb-3" />
                      <p className="dark-muted mb-0">Nessun commento presente. Sii il primo a partecipare!</p>
                    </div>
                  )}
                </div>
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
      `}} />
    </div>
  );
}

export default FAQ;

import axios from 'axios';
import { API_BASE } from '../config/api.js';

// Crea un'istanza axios configurata per le FAQ
const api = axios.create({
  baseURL: `${API_BASE}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor per aggiungere il token di autenticazione
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class FAQService {
  // Categorie FAQ
  async getCategories() {
    try {
      const response = await api.get('/faq/categories/');
      return response.data;
    } catch (error) {
      console.error('Errore nel recupero categorie FAQ:', error);
      throw error;
    }
  }

  // Lista FAQ
  async getFAQs(params = {}) {
    try {
      const response = await api.get('/faq/', { params });
      return response.data;
    } catch (error) {
      console.error('Errore nel recupero FAQ:', error);
      throw error;
    }
  }

  // Dettaglio FAQ
  async getFAQ(id) {
    try {
      const response = await api.get(`/faq/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Errore nel recupero FAQ:', error);
      throw error;
    }
  }

  // Ricerca FAQ
  async searchFAQs(query, category = '', sortBy = 'relevance') {
    try {
      const params = { query, category, sort_by: sortBy };
      const response = await api.get('/faq/search/', { params });
      return response.data;
    } catch (error) {
      console.error('Errore nella ricerca FAQ:', error);
      throw error;
    }
  }

  // Statistiche FAQ
  async getStats() {
    try {
      const response = await api.get('/faq/stats/');
      return response.data;
    } catch (error) {
      console.error('Errore nel recupero statistiche FAQ:', error);
      throw error;
    }
  }

  // Vota FAQ come utile
  async voteHelpful(faqId) {
    try {
      const response = await api.post(`/faq/${faqId}/vote-helpful/`);
      return response.data;
    } catch (error) {
      console.error('Errore nel voto FAQ:', error);
      throw error;
    }
  }

  // Commenti FAQ
  async getComments(faqId = null) {
    try {
      const params = faqId ? { faq_id: faqId } : {};
      const response = await api.get('/faq/comments/', { params });
      return response.data;
    } catch (error) {
      console.error('Errore nel recupero commenti:', error);
      throw error;
    }
  }

  // Crea commento
  async createComment(commentData) {
    try {
      const response = await api.post('/faq/comments/', commentData);
      return response.data;
    } catch (error) {
      console.error('Errore nella creazione commento:', error);
      throw error;
    }
  }

  // Like/Unlike commento
  async toggleCommentLike(commentId) {
    try {
      const response = await api.post(`/faq/comments/${commentId}/like/`);
      return response.data;
    } catch (error) {
      console.error('Errore nel like commento:', error);
      throw error;
    }
  }

  // Risposta admin a commento (solo per staff)
  async replyToComment(commentId, reply) {
    try {
      const response = await api.post(`/faq/comments/${commentId}/reply/`, { reply });
      return response.data;
    } catch (error) {
      console.error('Errore nella risposta commento:', error);
      throw error;
    }
  }

  // I miei commenti
  async getMyComments() {
    try {
      const response = await api.get('/faq/comments/my/');
      return response.data;
    } catch (error) {
      console.error('Errore nel recupero miei commenti:', error);
      throw error;
    }
  }

  // Commenti in attesa (solo per staff)
  async getPendingComments() {
    try {
      const response = await api.get('/faq/comments/pending/');
      return response.data;
    } catch (error) {
      console.error('Errore nel recupero commenti in attesa:', error);
      throw error;
    }
  }

  // Approva commento (solo per staff)
  async approveComment(commentId) {
    try {
      const response = await api.post(`/faq/comments/${commentId}/approve/`);
      return response.data;
    } catch (error) {
      console.error('Errore nell\'approvazione commento:', error);
      throw error;
    }
  }

  // Metodi di utilità
  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  truncateText(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  // Cache per le categorie (per evitare chiamate ripetute)
  _categoriesCache = null;
  _categoriesCacheTime = null;
  
  async getCategoriesWithCache(maxAge = 5 * 60 * 1000) { // 5 minuti
    const now = Date.now();
    
    if (this._categoriesCache && 
        this._categoriesCacheTime && 
        (now - this._categoriesCacheTime) < maxAge) {
      return this._categoriesCache;
    }
    
    const categories = await this.getCategories();
    this._categoriesCache = categories;
    this._categoriesCacheTime = now;
    
    return categories;
  }

  // Pulisci cache
  clearCache() {
    this._categoriesCache = null;
    this._categoriesCacheTime = null;
  }
}

// Esporta un'istanza singleton
const faqService = new FAQService();
export default faqService; 
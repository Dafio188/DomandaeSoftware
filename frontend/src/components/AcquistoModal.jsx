import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { acquistaProdotto } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { 
  FaShoppingCart, FaEuroSign, FaUser, FaBox, FaSpinner, 
  FaTimes, FaCheck, FaExclamationTriangle, FaRocket 
} from 'react-icons/fa';

function AcquistoModal({ prodotto, show, onClose }) {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAcquisto = async () => {
    if (!user) {
      alert('Devi essere loggato per acquistare un prodotto!');
      onClose();
      navigate('/login');
      return;
    }

    if (user.ruolo !== 'cliente') {
      alert('Solo i clienti possono acquistare prodotti!');
      onClose();
      return;
    }

    setLoading(true);
    
    try {
      const response = await acquistaProdotto(token, prodotto.id);
      
      if (response.success) {
        setSuccess(true);
        
        // Mostra successo per 2 secondi poi redirect
        setTimeout(() => {
          onClose();
          navigate(`/progetto/${response.progetto_id}`);
        }, 2000);
      } else {
        throw new Error(response.detail || 'Errore durante l\'acquisto');
      }
    } catch (error) {
      console.error('Errore acquisto:', error);
      alert(`Errore: ${error.response?.data?.detail || error.message}`);
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-xl rounded-4">
          {success ? (
            // Schermata di successo
            <div className="modal-body text-center p-5">
              <div className="success-animation mb-4">
                <div className="check-circle">
                  <FaCheck className="text-success" size={64} />
                </div>
              </div>
              <h3 className="text-success fw-bold mb-3">🎉 Acquisto Completato!</h3>
              <p className="lead mb-4">
                Hai acquistato con successo "<strong>{prodotto.titolo}</strong>"!
              </p>
              <div className="alert alert-info">
                <FaRocket className="me-2" />
                Ti stiamo reindirizzando alla pagina del progetto...
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="modal-header bg-primary text-white rounded-top-4 border-0">
                <div className="d-flex align-items-center">
                  <FaShoppingCart className="me-3" size={24} />
                  <h4 className="modal-title mb-0">Conferma Acquisto</h4>
                </div>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={onClose}
                  disabled={loading}
                ></button>
              </div>

              {/* Body */}
              <div className="modal-body p-4">
                {/* Prodotto Info */}
                <div className="row">
                  <div className="col-md-4">
                    {prodotto.immagine ? (
                      <img 
                        src={prodotto.immagine} 
                        alt={prodotto.titolo}
                        className="img-fluid rounded-3 shadow-sm"
                        style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" 
                           style={{ height: '200px' }}>
                        <FaBox size={48} className="text-muted" />
                      </div>
                    )}
                  </div>
                  <div className="col-md-8">
                    <h5 className="fw-bold text-primary mb-3">{prodotto.titolo}</h5>
                    <p className="text-muted mb-3" style={{ maxHeight: '100px', overflow: 'hidden' }}>
                      {prodotto.descrizione.length > 200 
                        ? prodotto.descrizione.substring(0, 200) + '...'
                        : prodotto.descrizione
                      }
                    </p>
                    
                    <div className="row g-3">
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <FaEuroSign className="text-success me-2" />
                          <div>
                            <small className="text-muted d-block">Prezzo</small>
                            <strong className="text-success fs-5">€{prodotto.prezzo}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="d-flex align-items-center">
                          <FaUser className="text-info me-2" />
                          <div>
                            <small className="text-muted d-block">Fornitore</small>
                            <strong>{prodotto.fornitore_username}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                {/* Warning per utenti non loggati */}
                {!user && (
                  <div className="alert alert-warning">
                    <FaExclamationTriangle className="me-2" />
                    <strong>Attenzione:</strong> Devi essere loggato come cliente per procedere all'acquisto.
                  </div>
                )}

                {/* Warning per fornitori */}
                {user && user.ruolo !== 'cliente' && (
                  <div className="alert alert-warning">
                    <FaExclamationTriangle className="me-2" />
                    <strong>Attenzione:</strong> Solo i clienti possono acquistare prodotti.
                  </div>
                )}

                {/* Cosa succede dopo l'acquisto */}
                <div className="bg-light rounded-3 p-3 mb-4">
                  <h6 className="fw-bold mb-2">📋 Cosa succede dopo l'acquisto?</h6>
                  <ul className="list-unstyled mb-0 small">
                    <li>✅ Verrà creato automaticamente un progetto per la consegna</li>
                    <li>✅ Potrai comunicare direttamente con il fornitore</li>
                    <li>✅ Riceverai il prodotto secondo le tempistiche concordate</li>
                    <li>✅ Avrai accesso al supporto per 30 giorni</li>
                  </ul>
                </div>

                {/* Totale */}
                <div className="bg-primary bg-opacity-10 rounded-3 p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">Totale da pagare:</span>
                    <span className="fs-4 fw-bold text-success">€{prodotto.prezzo}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer border-0 p-4">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary rounded-pill px-4" 
                  onClick={onClose}
                  disabled={loading}
                >
                  Annulla
                </button>
                <button 
                  type="button" 
                  className={`btn btn-success rounded-pill px-5 ${loading ? 'disabled' : ''}`}
                  onClick={handleAcquisto}
                  disabled={loading || !user || user.ruolo !== 'cliente'}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="fa-spin me-2" />
                      Elaborazione...
                    </>
                  ) : (
                    <>
                      <FaShoppingCart className="me-2" />
                      Conferma Acquisto
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .success-animation {
          animation: successPulse 1.5s ease-in-out;
        }
        
        .check-circle {
          width: 120px;
          height: 120px;
          border: 4px solid #28a745;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          animation: checkScale 0.8s ease-out;
        }
        
        @keyframes successPulse {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes checkScale {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export default AcquistoModal; 
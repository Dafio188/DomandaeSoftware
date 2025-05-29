import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function PasswordReset() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8001/api/utenti/password-reset/', {
        email: email
      });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Errore nell\'invio della richiesta');
    }
    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-header bg-primary text-white text-center rounded-top-4 py-4">
                <div className="mb-3">
                  <div className="icon-circle mx-auto mb-3" style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '2rem' }}>🔑</span>
                  </div>
                  <h2 className="mb-0">Recupera Password</h2>
                  <p className="mb-0 opacity-75">Ti invieremo le istruzioni via email</p>
                </div>
              </div>
              <div className="card-body p-5">
                {!message ? (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="form-label fw-bold">Indirizzo Email</label>
                      <input 
                        type="email" 
                        className="form-control form-control-lg rounded-3" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        placeholder="Inserisci la tua email"
                        required 
                      />
                      <div className="form-text">
                        📧 Inserisci l'email associata al tuo account
                      </div>
                    </div>
                    
                    {error && (
                      <div className="alert alert-danger border-0 rounded-3 mb-4">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {error}
                      </div>
                    )}
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg w-100 rounded-3 mb-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Invio in corso...
                        </>
                      ) : (
                        <>
                          <span className="me-2">📨</span>
                          Invia Link di Reset
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="text-center">
                    <div className="alert alert-success border-0 rounded-3 mb-4">
                      <div className="mb-3">
                        <span style={{ fontSize: '3rem' }}>✅</span>
                      </div>
                      <h5 className="mb-3">Email Inviata!</h5>
                      <p className="mb-0">{message}</p>
                    </div>
                    <div className="bg-light rounded-3 p-4 mb-4">
                      <h6 className="fw-bold mb-3">📋 Prossimi Passi:</h6>
                      <ol className="text-start small">
                        <li className="mb-2">Controlla la tua casella email</li>
                        <li className="mb-2">Cerca l'email da "recupero.gestionale@gmail.com"</li>
                        <li className="mb-2">Clicca sul link per resettare la password</li>
                        <li>Il link è valido per 24 ore</li>
                      </ol>
                    </div>
                  </div>
                )}
                
                <hr className="my-4" />
                
                <div className="text-center">
                  <Link to="/login" className="btn btn-outline-primary rounded-3">
                    <span className="me-2">⬅️</span>
                    Torna al Login
                  </Link>
                </div>
                
                <div className="mt-4 text-center">
                  <small className="text-muted">
                    💡 <strong>Suggerimento:</strong> Se non ricevi l'email, controlla la cartella spam
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordReset; 
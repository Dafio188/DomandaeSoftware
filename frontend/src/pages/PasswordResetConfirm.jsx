import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PasswordResetConfirm() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!uid || !token) {
      setError('Link di reset non valido');
    }
  }, [uid, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (newPassword !== confirmPassword) {
      setError('Le password non coincidono');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('La password deve essere di almeno 8 caratteri');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8001/api/auth/password-reset-confirm/', {
        uid: uid,
        token: token,
        new_password: newPassword
      });
      setMessage(response.data.message);
      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Errore nel reset della password');
    }
    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-header bg-success text-white text-center rounded-top-4 py-4">
                <div className="mb-3">
                  <div className="icon-circle mx-auto mb-3" style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '2rem' }}>🔐</span>
                  </div>
                  <h2 className="mb-0">Nuova Password</h2>
                  <p className="mb-0 opacity-75">Inserisci la tua nuova password sicura</p>
                </div>
              </div>
              <div className="card-body p-5">
                {!success ? (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="form-label fw-bold">Nuova Password</label>
                      <input 
                        type="password" 
                        className="form-control form-control-lg rounded-3" 
                        value={newPassword} 
                        onChange={e => setNewPassword(e.target.value)} 
                        placeholder="Inserisci la nuova password"
                        required 
                        minLength="8"
                      />
                      <div className="form-text">
                        🔒 Almeno 8 caratteri, mescola lettere, numeri e simboli
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-bold">Conferma Password</label>
                      <input 
                        type="password" 
                        className="form-control form-control-lg rounded-3" 
                        value={confirmPassword} 
                        onChange={e => setConfirmPassword(e.target.value)} 
                        placeholder="Ripeti la nuova password"
                        required 
                        minLength="8"
                      />
                      <div className="form-text">
                        ✅ Deve coincidere con la password sopra
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
                      className="btn btn-success btn-lg w-100 rounded-3 mb-3"
                      disabled={loading || !uid || !token}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Aggiornamento...
                        </>
                      ) : (
                        <>
                          <span className="me-2">🔐</span>
                          Aggiorna Password
                        </>
                      )}
                    </button>
                    
                    {(!uid || !token) && (
                      <div className="alert alert-warning border-0 rounded-3">
                        ⚠️ Link di reset non valido o scaduto
                      </div>
                    )}
                  </form>
                ) : (
                  <div className="text-center">
                    <div className="alert alert-success border-0 rounded-3 mb-4">
                      <div className="mb-3">
                        <span style={{ fontSize: '3rem' }}>🎉</span>
                      </div>
                      <h5 className="mb-3">Password Aggiornata!</h5>
                      <p className="mb-0">{message}</p>
                    </div>
                    <div className="bg-light rounded-3 p-4 mb-4">
                      <h6 className="fw-bold mb-3">✅ Tutto Pronto!</h6>
                      <p className="small mb-2">La tua password è stata aggiornata con successo.</p>
                      <p className="small mb-0">Verrai reindirizzato al login tra pochi secondi...</p>
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
                    🔐 <strong>Sicurezza:</strong> Usa una password complessa e unica
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

export default PasswordResetConfirm; 
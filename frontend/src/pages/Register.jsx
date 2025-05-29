import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [ruolo, setRuolo] = useState('cliente');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (password !== password2) {
      setError('Le password non coincidono');
      return;
    }
    try {
      await axios.post('/api/auth/register/', {
        username,
        email,
        password,
        ruolo
      });
      setSuccess('Registrazione avvenuta con successo! Ora puoi accedere.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError('Errore nella registrazione. Username o email già usati?');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow">
          <div className="card-body">
            <h2 className="mb-4 text-center">Registrati</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input type="text" className="form-control" value={username} onChange={e => setUsername(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Conferma Password</label>
                <input type="password" className="form-control" value={password2} onChange={e => setPassword2(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Ruolo</label>
                <select className="form-select" value={ruolo} onChange={e => setRuolo(e.target.value)}>
                  <option value="cliente">Cliente</option>
                  <option value="fornitore">Fornitore</option>
                </select>
              </div>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              <button type="submit" className="btn btn-primary w-100">Registrati</button>
            </form>
            <p className="mt-3 text-center text-muted">Hai già un account? <a href="/login">Accedi</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register; 
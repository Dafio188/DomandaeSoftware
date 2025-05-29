import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const tokens = await login(username, password);
      await loginUser(tokens);
      navigate('/dashboard');
    } catch (err) {
      setError('Credenziali non valide');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow">
          <div className="card-body">
            <h2 className="mb-4 text-center">Accedi</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input type="text" className="form-control" value={username} onChange={e => setUsername(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              {error && <div className="alert alert-danger">{error}</div>}
              <button type="submit" className="btn btn-primary w-100">Accedi</button>
            </form>
            <div className="text-center mt-3">
              <a href="/password-reset" className="text-primary text-decoration-none">
                🔑 Password dimenticata?
              </a>
            </div>
            <p className="mt-3 text-center text-muted">Non hai un account? Registrati tramite l'amministratore.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login; 
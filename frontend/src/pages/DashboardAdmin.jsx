import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getUtentiAdmin, getAllRichieste, getAllOfferte } from '../services/api';

function DashboardAdmin() {
  const { user, token } = useAuth();
  const [utenti, setUtenti] = useState([]);
  const [richieste, setRichieste] = useState([]);
  const [offerte, setOfferte] = useState([]);

  useEffect(() => {
    if (token) {
      getUtentiAdmin(token).then(setUtenti).catch(() => setUtenti([]));
      getAllRichieste(token).then(setRichieste).catch(() => setRichieste([]));
      getAllOfferte(token).then(setOfferte).catch(() => setOfferte([]));
    }
  }, [token]);

  return (
    <div className="text-center">
      <h2 className="mb-4">Dashboard Amministratore</h2>
      <p className="lead">Benvenuto, {user?.username}! Qui puoi gestire utenti, richieste, offerte, progetti e visualizzare statistiche della piattaforma.</p>
      <div className="row mt-5">
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Gestione utenti</h5>
              <ul className="list-group">
                {utenti.length > 0 ? utenti.map(u => (
                  <li key={u.id} className="list-group-item text-start">
                    <strong>{u.username}</strong> - {u.ruolo}
                  </li>
                )) : <li className="list-group-item">Nessun utente trovato.</li>}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Gestione richieste</h5>
              <ul className="list-group">
                {richieste.length > 0 ? richieste.map(r => (
                  <li key={r.id} className="list-group-item text-start">
                    <strong>{r.titolo}</strong> - {r.stato}
                  </li>
                )) : <li className="list-group-item">Nessuna richiesta trovata.</li>}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Gestione offerte</h5>
              <ul className="list-group">
                {offerte.length > 0 ? offerte.map(o => (
                  <li key={o.id} className="list-group-item text-start">
                    <strong>{o.descrizione}</strong> - {o.stato}
                  </li>
                )) : <li className="list-group-item">Nessuna offerta trovata.</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin; 
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function ProdottoDettaglio() {
  const { id } = useParams();
  const [prodotto, setProdotto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    
    console.log('Caricamento prodotto ID:', id);
    
    axios.get(`http://localhost:8001/api/prodotti-pronti/${id}/`)
      .then(res => {
        console.log('Prodotto caricato:', res.data);
        setProdotto(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Errore caricamento prodotto:", err);
        console.error("Response:", err.response);
        console.error("Status:", err.response?.status);
        console.error("Data:", err.response?.data);
        
        if (err.response?.status === 404) {
          setError("Prodotto non trovato");
        } else if (err.response?.status === 500) {
          setError("Errore del server");
        } else {
          setError("Impossibile caricare i dettagli del prodotto. " + (err.response?.data?.detail || err.message));
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="container py-5">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </div>
        <p className="mt-2">Caricamento dettagli prodotto...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="container py-5">
      <div className="alert alert-danger">
        {error}
      </div>
    </div>
  );

  if (!prodotto) return null;

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow-sm">
            {prodotto.immagine && (
              <img 
                src={prodotto.immagine} 
                alt={prodotto.titolo} 
                className="card-img-top"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
            )}
            <div className="card-body">
              <h2 className="card-title mb-3">{prodotto.titolo}</h2>
              <p className="card-text fs-5">{prodotto.descrizione}</p>
              
              <div className="d-flex align-items-center mb-4">
                <div className="me-3">
                  <span className="text-muted">Pubblicato da:</span> 
                  <span className="ms-1 fw-bold">{prodotto.fornitore_username}</span>
                </div>
                <div>
                  <span className="text-muted">Data:</span> 
                  <span className="ms-1">{new Date(prodotto.data_pubblicazione).toLocaleDateString()}</span>
                </div>
              </div>
              
              {prodotto.link_demo && (
                <a 
                  href={prodotto.link_demo} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary"
                >
                  Vai alla demo del prodotto
                </a>
              )}
            </div>
          </div>
          
          <div className="mt-4 d-flex justify-content-between">
            <a href="/prodotti-pronti" className="btn btn-outline-secondary">
              &laquo; Torna ai prodotti
            </a>
            
            <a href={`mailto:${prodotto.fornitore_email || 'info@domandaesoftware.it'}?subject=Informazioni su ${prodotto.titolo}`} className="btn btn-success">
              Contatta il fornitore
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProdottoDettaglio;

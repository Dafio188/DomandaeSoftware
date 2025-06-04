import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaStar, FaQuoteLeft, FaQuoteRight, FaUser } from 'react-icons/fa';
import Slider from 'react-slick';
import { API_BASE } from '../config/api.js';

function Testimonianze() {
  const [testimonianze, setTestimonianze] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usingPlaceholder, setUsingPlaceholder] = useState(false);

  useEffect(() => {
    const fetchTestimonianze = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE}testimonianze/`);
        console.log('Testimonianze caricate:', response.data);
        
        if (response.data && response.data.length > 0) {
          setTestimonianze(response.data);
          setUsingPlaceholder(false);
        } else {
          console.log('Nessuna testimonianza trovata, uso i placeholder');
          setUsingPlaceholder(true);
        }
      } catch (err) {
        console.error('Errore caricamento testimonianze:', err);
        setError('Errore nel caricamento dei commenti');
        setUsingPlaceholder(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonianze();
  }, []);

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: testimonianze.length < 3 ? Math.max(1, testimonianze.length) : 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: Math.min(2, testimonianze.length || 1) } },
      { breakpoint: 768, settings: { slidesToShow: 1 } }
    ]
  };

  // Placeholder testimonianze se non ci sono dati
  const placeholderData = [
    { id: 1, testo: "Grazie a D&S ho trovato il partner perfetto per il mio gestionale!", autore: "Cliente", tipo_autore: "cliente" },
    { id: 2, testo: "Ho ricevuto richieste mirate e ho potuto mostrare i miei prodotti a nuovi clienti.", autore: "Fornitore", tipo_autore: "fornitore" },
    { id: 3, testo: "La piattaforma è intuitiva e il supporto è stato rapido e risolutivo.", autore: "Startup", tipo_autore: "startup" }
  ];

  // Usa i dati reali se disponibili, altrimenti usa i placeholder
  const displayData = !usingPlaceholder && testimonianze.length > 0 ? testimonianze : placeholderData;

  // Funzione per determinare il colore di sfondo in base al tipo di autore
  const getBackgroundGradient = (tipoAutore) => {
    switch(tipoAutore) {
      case 'cliente':
        return 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)';
      case 'fornitore':
        return 'linear-gradient(135deg, #f6f9ff 0%, #e6f0ff 100%)';
      case 'startup':
        return 'linear-gradient(135deg, #fff9f6 0%, #ffe6e2 100%)';
      default:
        return 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)';
    }
  };

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center mb-5 fw-bold" data-aos="fade-up">Ringraziamenti e commenti</h2>
        
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Caricamento...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-warning">{error}</div>
        ) : (
          <>
            {usingPlaceholder && (
              <div className="text-center mb-3">
                <small className="text-muted">Visualizzazione di esempio - Dati dal backend non disponibili</small>
              </div>
            )}
            <Slider {...sliderSettings}>
              {displayData.map((t, index) => {
                const tipoAutore = t.tipo_autore || 'default';
                const bgGradient = getBackgroundGradient(tipoAutore);
                
                return (
                  <div className="px-3" key={t.id || index}>
                    <div 
                      className="card border-0 rounded-4 p-4 mb-4 h-100 position-relative" 
                      style={{ 
                        background: bgGradient,
                        boxShadow: '0 10px 20px rgba(0,0,0,0.05)', 
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        overflow: 'hidden'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)';
                      }}
                    >
                      <div className="d-flex flex-column h-100">
                        <div className="text-end mb-3">
                          <span className="d-inline-block p-2 rounded-circle" style={{ background: 'rgba(255,200,0,0.2)' }}>
                            <FaStar className="text-warning" size={20} />
                          </span>
                        </div>
                        
                        <div className="flex-grow-1 position-relative px-2">
                          <FaQuoteLeft className="text-black-50 opacity-25 position-absolute top-0 start-0" style={{ fontSize: '1.5rem' }} />
                          <p className="mb-4 px-4 text-center fw-normal" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                            {t.testo}
                          </p>
                          <FaQuoteRight className="text-black-50 opacity-25 position-absolute bottom-0 end-0" style={{ fontSize: '1.5rem' }} />
                        </div>
                        
                        <div className="mt-auto text-center pt-3 border-top border-light">
                          <div className="d-inline-flex align-items-center justify-content-center bg-white p-2 rounded-circle shadow-sm mb-2">
                            <FaUser size={18} className="text-primary" />
                          </div>
                          <p className="mb-0 fw-bold">{t.autore}</p>
                          <small className="text-muted">{t.tipo_autore_display || t.tipo_autore}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </>
        )}
      </div>
    </section>
  );
}

export default Testimonianze; 
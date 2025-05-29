import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState, useRef, useMemo } from 'react';
import axios from 'axios';
import './Progetto.css';
import { calcolaImporti } from '../utils/calcoli';
import { 
  FaCheckCircle, 
  FaUser, 
  FaUserTie, 
  FaExclamationTriangle, 
  FaClock,
  FaComments,
  FaPaperPlane,
  FaProjectDiagram,
  FaEuroSign,
  FaCalendar,
  FaStar,
  FaRocket,
  FaHandshake,
  FaLightbulb,
  FaTools,
  FaTrophy,
  FaArrowRight,
  FaPlay,
  FaSpinner,
  FaPlus,
  FaMagic,
  FaCrown,
  FaHeart,
  FaBolt,
  FaFlag,
  FaCode,
  FaGift,
  FaInfoCircle,
  FaArchive,
  FaUndo
} from 'react-icons/fa';

function Progetto() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [progetto, setProgetto] = useState(null);
  const [messaggi, setMessaggi] = useState([]);
  const [testo, setTesto] = useState('');
  const [recensione, setRecensione] = useState('');
  const [voto, setVoto] = useState(5);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [newStep, setNewStep] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [activeTab, setActiveTab] = useState('deliverables');
  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);

  // Caricamento dati progetto
  useEffect(() => {
    console.log('🔍 INIZIANDO CARICAMENTO PROGETTO');
    console.log('ID progetto:', id);
    console.log('Token presente:', !!token);
    console.log('User presente:', !!user);
    
    if (token && user) {
      console.log('✅ Token e user presenti, facendo richieste API...');
      
      const progettoUrl = `http://localhost:8001/api/progetti/${id}/`;
      const messaggiUrl = `http://localhost:8001/api/messaggi/?progetto=${id}`;
      
      Promise.all([
        axios.get(progettoUrl, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(messaggiUrl, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]).then(([progettoRes, messaggiRes]) => {
        console.log('✅ SUCCESSO - Progetto caricato:', progettoRes.data);
        console.log('🔍 DEBUG - Prezzo offerta:', progettoRes.data.offerta_prezzo);
        setProgetto(progettoRes.data);
        setMessaggi(messaggiRes.data);
        setLoading(false);
        setError('');
      }).catch((err) => {
        console.error('❌ ERRORE nel caricamento:', err);
        if (err.response?.status === 404) {
          setError(`Progetto #${id} non trovato.`);
        } else if (err.response?.status === 403) {
          setError('Non hai i permessi per accedere a questo progetto.');
        } else if (err.response?.status === 401) {
          setError('Sessione scaduta. Effettua nuovamente il login.');
        } else {
          setError('Errore nel caricamento del progetto: ' + (err.response?.data?.detail || err.message));
        }
        setLoading(false);
      });
    } else {
      setError('Token di autenticazione non presente. Effettua il login.');
      setLoading(false);
    }
  }, [id, token, user]);

  // CORREZIONE: Calcoli importi usando useMemo che si aggiorna quando progetto cambia
  const { prezzo, importoCliente, importoFornitore } = useMemo(() => {
    return calcolaImporti(progetto?.offerta_prezzo);
  }, [progetto?.offerta_prezzo]);

  // Debug per verificare i calcoli
  useEffect(() => {
    if (progetto?.offerta_prezzo) {
      console.log('🎯 IMPORTI CALCOLATI:', {
        offerta_prezzo: progetto.offerta_prezzo,
        prezzo,
        importoCliente,
        importoFornitore,
        progetto_id: progetto.id
      });
    }
  }, [progetto?.offerta_prezzo, prezzo, importoCliente, importoFornitore]);

  // Test function per forzare re-render
  const testCalcoli = () => {
    console.log('🧪 TEST CALCOLI MANUALI:');
    console.log('progetto?.offerta_prezzo:', progetto?.offerta_prezzo);
    console.log('typeof progetto?.offerta_prezzo:', typeof progetto?.offerta_prezzo);
    
    if (progetto?.offerta_prezzo) {
      const testPrezzo = parseFloat(progetto.offerta_prezzo);
      const testCliente = (testPrezzo * 1.05).toFixed(2);
      const testFornitore = (testPrezzo * 0.95).toFixed(2);
      
      console.log('Test manuale:', {
        testPrezzo,
        testCliente,
        testFornitore
      });
      
      alert(`Calcoli manuali:
Prezzo base: ${testPrezzo}€
Cliente paga: ${testCliente}€ 
Fornitore riceve: ${testFornitore}€

Calcoli automatici:
prezzo: ${prezzo}
importoCliente: ${importoCliente}
importoFornitore: ${importoFornitore}`);
    }
  };

  return (
    <div className="min-vh-100 bg-gradient project-page">
      {/* Test Button per debug */}
      {progetto && (
        <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999 }}>
          <button 
            className="btn btn-danger btn-sm"
            onClick={testCalcoli}
          >
            🧪 Test Calcoli
          </button>
        </div>
      )}
      
      <div className="container py-5">
        <h1>Progetto #{id}</h1>
        {progetto && (
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5>🧪 DEBUG IMPORTI</h5>
                </div>
                <div className="card-body">
                  <p><strong>Prezzo Offerta (raw):</strong> {progetto.offerta_prezzo}</p>
                  <p><strong>Tipo:</strong> {typeof progetto.offerta_prezzo}</p>
                  <p><strong>Prezzo Calcolato:</strong> {prezzo}</p>
                  <p><strong>Importo Cliente:</strong> {importoCliente}€</p>
                  <p><strong>Importo Fornitore:</strong> {importoFornitore}€</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="card">
                <div className="card-header bg-success text-white">
                  <h5>💰 Informazioni Pagamento</h5>
                </div>
                <div className="card-body">
                  {user?.id === progetto.cliente ? (
                    <div>
                      <h4 className="text-success">{importoCliente}€</h4>
                      <p>Importo che dovrai pagare (include 5% commissione)</p>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-primary">{importoFornitore}€</h4>
                      <p>Importo che riceverai (5% commissione trattenuta)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {loading && <p>Caricamento...</p>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!progetto && !loading && <p>Progetto non trovato</p>}
      </div>
    </div>
  );
}

export default Progetto; 
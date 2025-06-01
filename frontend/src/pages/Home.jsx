import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import AcquistoModal from '../components/AcquistoModal';
import { FaUserTie, FaUser, FaShieldAlt, FaLock, FaEuroSign, FaStar, FaHandshake, FaArrowRight, FaMoneyBillWave, FaComments, FaHeadset, FaUserShield, FaRocket, FaLightbulb, FaCode, FaChartLine, FaGlobe, FaMobile, FaDesktop, FaCloud, FaCogs, FaSearch, FaHeart, FaCheckCircle, FaBolt, FaTrophy, FaPlay, FaQuoteLeft, FaShoppingCart, FaEye, FaAward, FaUsers, FaBars, FaTimes, FaHome, FaInfoCircle, FaEnvelope, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import Slider from 'react-slick';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Testimonianze from '../components/Testimonianze';

function Home() {
  const { user, logout } = useAuth();
  const [richieste, setRichieste] = useState([]);
  const [prodotti, setProdotti] = useState([]);
  const [activeGaranzia, setActiveGaranzia] = useState(null);
  const [stats, setStats] = useState({ richieste: 0, fornitori: 0, progetti: 0, soddisfazione: 98 });
  
  // Stati per il modal di acquisto
  const [showAcquistoModal, setShowAcquistoModal] = useState(false);
  const [prodottoSelezionato, setProdottoSelezionato] = useState(null);

  // Stati per menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Sistema foto dinamico
  const [heroImage, setHeroImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Sistema dinamico per caricare tutte le foto dalla cartella
  const [allHeroImages, setAllHeroImages] = useState([]);
  
  // Carica dinamicamente tutte le immagini dalla cartella foto_home
  useEffect(() => {
    const loadImages = async () => {
      try {
        // Carica tutti i file dalla cartella foto_home
        const imageModules = import.meta.glob('/foto_home/*.(png|jpg|jpeg|webp)', { eager: true });
        
        const imageArray = Object.keys(imageModules).map((path, index) => ({
          src: path,
          alt: `Domanda & Software - Immagine ${index + 1}`
        }));
        
        console.log('Immagini caricate dinamicamente:', imageArray);
        setAllHeroImages(imageArray);
        
        // Imposta la prima immagine random
        if (imageArray.length > 0) {
          const randomIndex = Math.floor(Math.random() * imageArray.length);
          setCurrentImageIndex(randomIndex);
          setHeroImage(imageArray[randomIndex]);
          console.log(`Caricata foto iniziale: ${imageArray[randomIndex].src}`);
        }
      } catch (error) {
        console.error('Errore caricamento immagini:', error);
        // Fallback alle immagini hardcoded
        const fallbackImages = [
          { src: '/foto_home/sfondo_home.png', alt: 'Domanda & Software - Marketplace' },
          { src: '/foto_home/sfondo_home_2.png', alt: 'Domanda & Software - Sviluppatori' },
          { src: '/foto_home/sfondo_home_3.png', alt: 'Domanda & Software - Progetti' }
        ];
        setAllHeroImages(fallbackImages);
        setCurrentImageIndex(0);
        setHeroImage(fallbackImages[0]);
      }
    };
    
    loadImages();
  }, []);

  // Rotazione automatica foto con intervalli random
  useEffect(() => {
    if (allHeroImages.length === 0) return; // Non iniziare se non ci sono immagini
    
    const getRandomInterval = () => Math.floor(Math.random() * 5000) + 8000; // 8-13 secondi random
    
    const scheduleNextImage = () => {
      const interval = getRandomInterval();
      console.log(`Prossima foto tra ${interval/1000} secondi`);
      
      setTimeout(() => {
        setCurrentImageIndex(prev => {
          // Scegli un indice diverso da quello attuale
          let nextIndex;
          do {
            nextIndex = Math.floor(Math.random() * allHeroImages.length);
          } while (nextIndex === prev && allHeroImages.length > 1);
          
          setHeroImage(allHeroImages[nextIndex]);
          console.log(`Cambiata a foto: ${allHeroImages[nextIndex].src}`);
          return nextIndex;
        });
        scheduleNextImage(); // Programma la prossima rotazione
      }, interval);
    };

    scheduleNextImage();
    
    // Cleanup non necessario perché usiamo setTimeout ricorsivo
    return () => {};
  }, [allHeroImages]);

  // Opzioni tipo software per visualizzazione
  const tipiSoftware = [
    { value: 'crm', label: 'CRM', icon: '👥', color: '#4e73df' },
    { value: 'gestionale', label: 'Gestionale/ERP', icon: '📊', color: '#f6c23e' },
    { value: 'ecommerce', label: 'E-commerce', icon: '🛒', color: '#36b9cc' },
    { value: 'sito_web', label: 'Sito Web', icon: '🌐', color: '#1cc88a' },
    { value: 'app_mobile', label: 'App Mobile', icon: '📱', color: '#e74a3b' },
    { value: 'web_app', label: 'Web App', icon: '💻', color: '#6f42c1' },
    { value: 'software_desktop', label: 'Software Desktop', icon: '🖥️', color: '#858796' },
    { value: 'api_servizi', label: 'API/Servizi', icon: '🔌', color: '#5a5c69' },
    { value: 'automazione', label: 'Automazione', icon: '⚙️', color: '#f8f9fc' },
    { value: 'business_intelligence', label: 'Business Intelligence', icon: '📈', color: '#fd7e14' },
    { value: 'altro', label: 'Altro', icon: '💡', color: '#20c997' }
  ];

  // Categorie prodotti per visualizzazione
  const categorieProdotti = [
    { value: 'template', label: 'Template/Temi', icon: '🎨', color: '#e74c3c' },
    { value: 'plugin', label: 'Plugin/Estensioni', icon: '🔌', color: '#9b59b6' },
    { value: 'script', label: 'Script/Codici', icon: '💻', color: '#3498db' },
    { value: 'software', label: 'Software Completi', icon: '📦', color: '#2ecc71' },
    { value: 'app', label: 'App Mobile', icon: '📱', color: '#f39c12' },
    { value: 'servizio', label: 'Servizi/Consulenze', icon: '🎯', color: '#34495e' }
  ];

  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
    
    // Carica richieste
    axios.get('/api/richieste/')
      .then(res => {
        setRichieste(res.data);
        setStats(prev => ({ ...prev, richieste: res.data.length }));
      });
      
    // Carica prodotti pronti
    axios.get('/api/prodotti-pronti/')
      .then(res => {
        setProdotti(res.data);
      })
      .catch(err => {
        console.log('Errore caricamento prodotti:', err);
      });
      
    // Simula statistiche (in un'app reale verrebbero da API)
    setStats(prev => ({ 
      ...prev, 
      fornitori: 150, 
      progetti: 287,
      soddisfazione: 98 
    }));
  }, []);

  // Slider settings per richieste
  const richiesteSliderSettings = {
    dots: true,
    infinite: richieste.length >= 3,
    speed: 600,
    slidesToShow: Math.min(3, richieste.length),
    slidesToScroll: 1,
    autoplay: richieste.length >= 3,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: Math.min(2, richieste.length) } },
      { breakpoint: 768, settings: { slidesToShow: 1 } }
    ]
  };

  // Slider settings per prodotti
  const prodottiSliderSettings = {
    dots: true,
    infinite: prodotti.length >= 3,
    speed: 600,
    slidesToShow: Math.min(3, prodotti.length),
    slidesToScroll: 1,
    autoplay: prodotti.length >= 3,
    autoplaySpeed: 4500,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: Math.min(2, prodotti.length) } },
      { breakpoint: 768, settings: { slidesToShow: 1 } }
    ]
  };

  // Slider settings per testimonianze
  const testimonialSliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } }
    ]
  };
  
  // Dati per le garanzie
  const garanzie = [
    {
      id: 1,
      icon: <FaMoneyBillWave size={32} />,
      title: "Pagamenti sicuri",
      description: "Il pagamento viene rilasciato solo a lavoro completato. Garantiamo sicurezza in ogni transazione con sistema escrow integrato.",
      color: "#4e73df",
      bgColor: "#eef2ff"
    },
    {
      id: 2,
      icon: <FaComments size={32} />,
      title: "Feedback trasparenti",
      description: "Recensioni reali da parte di clienti e fornitori, per garantire sempre la massima trasparenza nel marketplace.",
      color: "#f6c23e",
      bgColor: "#fff9e6"
    },
    {
      id: 3,
      icon: <FaHeadset size={32} />,
      title: "Supporto dedicato",
      description: "Assistenza specializzata in ogni fase del progetto, dal primo contatto fino alla consegna finale e post-vendita.",
      color: "#36b9cc",
      bgColor: "#e6f8fa"
    },
    {
      id: 4,
      icon: <FaUserShield size={32} />,
      title: "Tutela della privacy",
      description: "I tuoi dati sono protetti secondo le normative GDPR. La tua privacy è la nostra priorità assoluta.",
      color: "#1cc88a",
      bgColor: "#e6f8f1"
    }
  ];

  // Categorie software highlight
  const categorieHighlight = [
    { icon: <FaCode />, title: "Sviluppo Software", desc: "Soluzioni custom su misura", projects: 45, color: "#4e73df" },
    { icon: <FaMobile />, title: "App Mobile", desc: "iOS e Android nativi", projects: 23, color: "#e74a3b" },
    { icon: <FaGlobe />, title: "Siti Web", desc: "Design moderni e responsivi", projects: 67, color: "#1cc88a" },
    { icon: <FaCloud />, title: "Cloud Solutions", desc: "Soluzioni scalabili", projects: 18, color: "#36b9cc" },
    { icon: <FaCogs />, title: "Automazione", desc: "Processi intelligenti", projects: 34, color: "#6f42c1" }
  ];

  const testimonials = [
    {
      name: "Marco Rossi",
      role: "CEO, TechStart Srl",
      text: "Grazie a D&S abbiamo trovato il partner perfetto per il nostro CRM. Risultato eccellente in tempi record!",
      rating: 5,
      avatar: "👨‍💼"
    },
    {
      name: "Giulia Bianchi", 
      role: "Marketing Manager",
      text: "Piattaforma incredibile! Ho pubblicato la richiesta e in 24h avevo già 5 offerte qualificate.",
      rating: 5,
      avatar: "👩‍💻"
    },
    {
      name: "Alessandro Tech",
      role: "Sviluppatore Freelance", 
      text: "Come fornitore, D&S mi ha aperto le porte a progetti interessanti. Clienti seri e pagamenti puntuali.",
      rating: 5,
      avatar: "👨‍🔧"
    }
  ];

  // Funzione per aprire il modal di acquisto
  const handleAcquistaProdotto = (prodotto) => {
    setProdottoSelezionato(prodotto);
    setShowAcquistoModal(true);
  };

  // Funzione per chiudere il modal
  const handleCloseModal = () => {
    setShowAcquistoModal(false);
    setProdottoSelezionato(null);
  };

  return (
    <div className="home-page">
      {/* HERO SECTION WIDESCREEN CON MENU OVERLAY */}
      <section 
        className="hero-section position-relative overflow-hidden"
        style={{
          height: '55vh',
          minHeight: '450px',
          maxHeight: '650px',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        {/* Immagine di sfondo widescreen */}
        {heroImage && (
          <img 
            src={heroImage.src}
            alt={heroImage.alt}
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              objectFit: 'cover',
              objectPosition: 'center center',
              zIndex: 1,
              width: '100%',
              height: '100%'
            }}
            onLoad={() => console.log('Immagine caricata:', heroImage.src)}
            onError={() => console.error('Errore caricamento immagine:', heroImage.src)}
          />
        )}
        
        {/* Overlay gradiente per leggibilità */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2))',
            zIndex: 2
          }}
        />
        
        {/* CONTENUTO HERO CENTRATO */}
        <div className="container-fluid position-relative" style={{ zIndex: 3, height: '100%' }}>
          <div className="row align-items-center justify-content-center" style={{ height: '100%', paddingTop: '90px' }}>
            <div className="col-12 col-lg-10 d-flex justify-content-center align-items-center">
              <div className="hero-main-card text-center" data-aos="fade-up" style={{ width: '100%', maxWidth: '800px' }}>
                <div className="py-3 px-3">
                  <h1 className="display-2 fw-bold mb-3 text-white" style={{ 
                    textShadow: '3px 3px 8px rgba(0,0,0,0.9)',
                    lineHeight: '1.1',
                    marginBottom: '1.5rem'
                  }}>
                    Domanda & <span className="text-warning">Software</span>
                  </h1>
                  
                  <p className="lead mb-4 text-white fs-4" style={{ 
                    textShadow: '2px 2px 6px rgba(0,0,0,0.9)',
                    maxWidth: '700px',
                    margin: '0 auto 2rem auto',
                    lineHeight: '1.4'
                  }}>
                    Il marketplace che connette <strong>visionari</strong> con i migliori <strong>sviluppatori</strong>. 
                    Trasforma le tue idee in soluzioni software innovative.
                  </p>
                  
                  <div className="hero-cta d-flex flex-wrap gap-4 justify-content-center">
                    <Link to="/register" className="btn btn-warning btn-lg rounded-pill px-5 py-3 shadow-lg fs-5 fw-bold">
                      <FaRocket className="me-2" />
                      Inizia Ora
                    </Link>
                    <a href="#categorie" className="btn btn-outline-light btn-lg rounded-pill px-5 py-3 shadow border-2 fs-5">
                      <FaPlay className="me-2" />
                      Scopri Come
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Indicatori foto cliccabili */}
        <div className="photo-indicators">
          {allHeroImages.map((_, index) => (
            <div
              key={index}
              className={`photo-indicator ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => {
                setCurrentImageIndex(index);
                setHeroImage(allHeroImages[index]);
              }}
            />
          ))}
        </div>
      </section>

      {/* CATEGORIE SOFTWARE */}
      <section className="py-5 bg-dark" id="categorie">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="display-4 fw-bold mb-3 text-white">Categorie Software</h2>
            <p className="lead text-light">Scopri le nostre specializzazioni e trova il partner perfetto per il tuo progetto</p>
          </div>
          
          {/* LAYOUT ATTUALE - Soluzione 1: Compatto */}
          <div className="row g-4">
            {categorieHighlight.map((cat, index) => (
              <div key={index} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="categoria-card h-100">
                  <div className="card border-2 border-opacity-10 rounded-4 shadow-lg h-100 overflow-hidden card-hover">
                    <div className="card-body p-3 position-relative d-flex flex-column justify-content-between" style={{ minHeight: '180px' }}>
                      <div>
                        <div className="d-flex align-items-center mb-3">
                          <div className="categoria-icon me-3 flex-shrink-0" style={{ color: cat.color, fontSize: '2.5rem' }}>
                            {cat.icon}
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="fw-bold mb-1 text-white" style={{ fontSize: '1.3rem', lineHeight: '1.2' }}>{cat.title}</h5>
                            <p className="text-muted mb-0" style={{ fontSize: '0.95rem', lineHeight: '1.3' }}>{cat.desc}</p>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <small className="text-muted fw-semibold" style={{ fontSize: '0.9rem' }}>{cat.projects} progetti attivi</small>
                        <FaArrowRight style={{ color: cat.color }} size={18} />
                      </div>
                      <div className="categoria-overlay" style={{ background: `linear-gradient(135deg, ${cat.color}15, ${cat.color}08)` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* LAYOUT ALTERNATIVO - Soluzione 2: Orizzontale (commentato)
          <div className="row g-3">
            {categorieHighlight.map((cat, index) => (
              <div key={index} className="col-12" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="categoria-card">
                  <div className="card border-2 border-opacity-10 rounded-4 shadow-lg overflow-hidden card-hover">
                    <div className="card-body p-4 position-relative">
                      <div className="row align-items-center">
                        <div className="col-auto">
                          <div className="categoria-icon-circle d-flex align-items-center justify-content-center rounded-circle" 
                               style={{ 
                                 width: '80px', 
                                 height: '80px', 
                                 backgroundColor: `${cat.color}20`,
                                 color: cat.color, 
                                 fontSize: '2rem' 
                               }}>
                            {cat.icon}
                          </div>
                        </div>
                        <div className="col">
                          <div className="row align-items-center">
                            <div className="col-md-8">
                              <h5 className="fw-bold mb-1 text-white" style={{ fontSize: '1.4rem' }}>{cat.title}</h5>
                              <p className="text-muted mb-0" style={{ fontSize: '1rem' }}>{cat.desc}</p>
                            </div>
                            <div className="col-md-4 text-md-end">
                              <div className="d-flex align-items-center justify-content-md-end">
                                <small className="text-muted fw-semibold me-3">{cat.projects} progetti attivi</small>
                                <FaArrowRight style={{ color: cat.color }} size={20} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="categoria-overlay" style={{ background: `linear-gradient(135deg, ${cat.color}15, ${cat.color}08)` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          */}

          {/* LAYOUT ALTERNATIVO - Soluzione 3: Ultra-Compatto (commentato)
          <div className="row g-3">
            {categorieHighlight.map((cat, index) => (
              <div key={index} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="categoria-card-compact">
                  <div className="card border-0 rounded-3 shadow-sm overflow-hidden card-hover" 
                       style={{ 
                         background: `linear-gradient(135deg, ${cat.color}10, ${cat.color}05)`,
                         border: `2px solid ${cat.color}30 !important`
                       }}>
                    <div className="card-body p-3 text-center">
                      <div className="categoria-icon mb-2" style={{ color: cat.color, fontSize: '2rem' }}>
                        {cat.icon}
                      </div>
                      <h6 className="fw-bold mb-1 text-white" style={{ fontSize: '1.1rem' }}>{cat.title}</h6>
                      <p className="text-muted mb-2 small">{cat.desc}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted" style={{ fontSize: '0.8rem' }}>{cat.projects} progetti</small>
                        <FaArrowRight style={{ color: cat.color }} size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          */}
        </div>
      </section>

      {/* COME FUNZIONA */}
      <section className="py-5 bg-dark">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="display-4 fw-bold mb-3 text-white">Come Funziona</h2>
            <p className="lead text-light">Semplice, veloce e sicuro. In 3 passi trasformi la tua idea in realtà</p>
          </div>
          
          <div className="row g-5">
            {/* LATO CLIENTI */}
            <div className="col-lg-6" data-aos="fade-right">
              <div className="how-it-works-section h-100">
                <div className="section-header text-center mb-4">
                  <div className="icon-wrapper bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <FaUser size={32} className="text-primary" />
                  </div>
                  <h3 className="fw-bold text-primary mb-2">Per i Clienti</h3>
                  <p className="text-muted">Dalla idea al software funzionante</p>
                </div>
                
                <div className="steps-container">
                  <div className="step-item d-flex align-items-start mb-4">
                    <div className="step-number-modern bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-4 flex-shrink-0" style={{ width: '50px', height: '50px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                      1
                    </div>
                    <div className="step-content">
                      <h5 className="fw-bold mb-2" style={{ fontSize: '1.1rem', textAlign: 'center' }}>Pubblica la tua idea</h5>
                      <p className="text-muted mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.4', textAlign: 'center' }}>Descrivi dettagliatamente il software che hai in mente, il budget e i tempi di realizzazione desiderati.</p>
                    </div>
                  </div>
                  
                  <div className="step-item d-flex align-items-start mb-4">
                    <div className="step-number-modern bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-4 flex-shrink-0" style={{ width: '50px', height: '50px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                      2
                    </div>
                    <div className="step-content">
                      <h5 className="fw-bold mb-2" style={{ fontSize: '1.1rem', textAlign: 'center' }}>Ricevi offerte qualificate</h5>
                      <p className="text-muted mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.4', textAlign: 'center' }}>Sviluppatori esperti verificati ti invieranno proposte personalizzate con tempi e costi dettagliati.</p>
                    </div>
                  </div>
                  
                  <div className="step-item d-flex align-items-start">
                    <div className="step-number-modern bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-4 flex-shrink-0" style={{ width: '50px', height: '50px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                      3
                    </div>
                    <div className="step-content">
                      <h5 className="fw-bold mb-2" style={{ fontSize: '1.1rem', textAlign: 'center' }}>Scegli e collabora</h5>
                      <p className="text-muted mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.4', textAlign: 'center' }}>Seleziona l'offerta migliore e inizia a collaborare con pagamenti sicuri e comunicazione supervisionata.</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-4">
                  <Link to="/register" className="btn btn-primary btn-lg rounded-pill px-4">
                    <FaRocket className="me-2" />
                    Inizia come Cliente
                  </Link>
                </div>
              </div>
            </div>
            
            {/* LATO FORNITORI */}
            <div className="col-lg-6" data-aos="fade-left">
              <div className="how-it-works-section h-100">
                <div className="section-header text-center mb-4">
                  <div className="icon-wrapper bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <FaUserTie size={32} className="text-success" />
                  </div>
                  <h3 className="fw-bold text-success mb-2">Per i Fornitori</h3>
                  <p className="text-muted">Dalle competenze ai guadagni</p>
                </div>
                
                <div className="steps-container">
                  <div className="step-item d-flex align-items-start mb-4">
                    <div className="step-number-modern bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-4 flex-shrink-0" style={{ width: '50px', height: '50px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                      1
                    </div>
                    <div className="step-content">
                      <h5 className="fw-bold mb-2" style={{ fontSize: '1.1rem', textAlign: 'center' }}>Esplora le opportunità</h5>
                      <p className="text-muted mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.4', textAlign: 'center' }}>Naviga tra le richieste di progetti e trova quelli che corrispondono perfettamente alle tue competenze.</p>
                    </div>
                  </div>
                  
                  <div className="step-item d-flex align-items-start mb-4">
                    <div className="step-number-modern bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-4 flex-shrink-0" style={{ width: '50px', height: '50px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                      2
                    </div>
                    <div className="step-content">
                      <h5 className="fw-bold mb-2" style={{ fontSize: '1.1rem', textAlign: 'center' }}>Invia la tua proposta</h5>
                      <p className="text-muted mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.4', textAlign: 'center' }}>Presenta la tua offerta professionale con tempi di consegna, costi competitivi e metodologia di lavoro.</p>
                    </div>
                  </div>
                  
                  <div className="step-item d-flex align-items-start">
                    <div className="step-number-modern bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-4 flex-shrink-0" style={{ width: '50px', height: '50px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                      3
                    </div>
                    <div className="step-content">
                      <h5 className="fw-bold mb-2" style={{ fontSize: '1.1rem', textAlign: 'center' }}>Sviluppa e guadagna</h5>
                      <p className="text-muted mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.4', textAlign: 'center' }}>Una volta accettata l'offerta, sviluppa il progetto e ricevi il pagamento garantito al completamento.</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-4">
                  <Link to="/register" className="btn btn-success btn-lg rounded-pill px-4">
                    <FaCode className="me-2" />
                    Inizia come Fornitore
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* SEZIONE VANTAGGI AGGIUNTIVA */}
          <div className="row mt-5 pt-5">
            <div className="col-12" data-aos="fade-up">
              <div className="text-center mb-4">
                <h4 className="fw-bold text-white">Perché scegliere Domanda&Software?</h4>
              </div>
              <div className="row g-4">
                <div className="col-md-3 text-center">
                  <div className="feature-card bg-white rounded-4 p-4 h-100 shadow-sm">
                    <FaShieldAlt size={32} className="text-warning mb-3" />
                    <h6 className="fw-bold">Sicurezza Garantita</h6>
                    <small className="text-muted">Pagamenti protetti con sistema escrow</small>
                  </div>
                </div>
                <div className="col-md-3 text-center">
                  <div className="feature-card bg-white rounded-4 p-4 h-100 shadow-sm">
                    <FaCheckCircle size={32} className="text-success mb-3" />
                    <h6 className="fw-bold">Qualità Verificata</h6>
                    <small className="text-muted">Sviluppatori e progetti controllati</small>
                  </div>
                </div>
                <div className="col-md-3 text-center">
                  <div className="feature-card bg-white rounded-4 p-4 h-100 shadow-sm">
                    <FaHeadset size={32} className="text-info mb-3" />
                    <h6 className="fw-bold">Supporto 24/7</h6>
                    <small className="text-muted">Assistenza dedicata in ogni fase</small>
                  </div>
                </div>
                <div className="col-md-3 text-center">
                  <div className="feature-card bg-white rounded-4 p-4 h-100 shadow-sm">
                    <FaBolt size={32} className="text-primary mb-3" />
                    <h6 className="fw-bold">Tempi Rapidi</h6>
                    <small className="text-muted">Trova il partner giusto in 24h</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RICHIESTE IN EVIDENZA */}
      <section className="py-5 bg-dark" id="richieste">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="display-4 fw-bold mb-3 text-white">Richieste in Evidenza</h2>
            <p className="lead text-light">Scopri le ultime opportunità pubblicate dalla community</p>
          </div>
          
          {richieste.length > 0 ? (
            <>
              <div data-aos="fade-up">
                <Slider {...richiesteSliderSettings} className="richieste-slider">
                  {richieste.slice(-8).reverse().map(r => {
                    const tipoSoftware = tipiSoftware.find(t => t.value === r.tipo_software);
                    return (
                      <div key={r.id} className="px-3">
                        <div className="richiesta-card">
                          <div className="card border-2 border-opacity-10 shadow-lg rounded-4 h-100 overflow-hidden card-hover">
                            <div className="card-body p-4">
                              <div className="d-flex align-items-center mb-3">
                                {tipoSoftware && (
                                  <div className="badge rounded-pill me-2 fw-semibold text-truncate" style={{ 
                                    backgroundColor: `${tipoSoftware.color}25`, 
                                    color: tipoSoftware.color, 
                                    border: `1px solid ${tipoSoftware.color}40`,
                                    maxWidth: '120px',
                                    fontSize: '0.75rem'
                                  }}>
                                    <span className="me-1">{tipoSoftware.icon}</span>
                                    {tipoSoftware.label.split(' - ')[0]}
                                  </div>
                                )}
                                <span className={`badge rounded-pill fw-semibold ${r.stato === 'aperta' ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize: '0.75rem' }}>
                                  {r.stato.toUpperCase()}
                                </span>
                              </div>
                              
                              {r.immagine && (
                                <div className="richiesta-image mb-3">
                                  <img 
                                    src={r.immagine} 
                                    alt={r.titolo}
                                    className="img-fluid rounded-3 w-100"
                                    style={{ height: '140px', objectFit: 'cover', border: '1px solid rgba(0,0,0,0.1)' }}
                                  />
                                </div>
                              )}
                              
                              <h5 className="card-title fw-bold mb-2 text-white text-truncate" style={{ fontSize: '1.1rem' }}>{r.titolo}</h5>
                              <p className="card-text text-muted mb-3" style={{ 
                                height: '48px', 
                                overflow: 'hidden', 
                                lineHeight: '1.3',
                                fontSize: '0.9rem',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                              }}>
                                {r.descrizione.length > 80 ? r.descrizione.substring(0, 80) + '...' : r.descrizione}
                              </p>
                              
                              <div className="richiesta-footer">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <div className="d-flex align-items-center text-success">
                                    <FaEuroSign className="me-1" />
                                    <strong className="fs-6">{r.budget}€</strong>
                                  </div>
                                  <small className="text-muted fw-semibold">
                                    <FaUser className="me-1" />
                                    {r.cliente_username}
                                  </small>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                  <small className="text-muted">
                                    {new Date(r.data_pubblicazione).toLocaleDateString()}
                                  </small>
                                  <Link to="/login" className="btn btn-primary btn-sm rounded-pill">
                                    Dettagli <FaArrowRight className="ms-1" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Slider>
              </div>

              {/* Link per vedere tutte le richieste */}
              <div className="text-center mt-5" data-aos="fade-up">
                <Link to="/richieste" className="btn btn-primary btn-lg rounded-pill px-5 py-3 shadow-lg">
                  <FaSearch className="me-2" />
                  Esplora Tutte le Richieste ({richieste.length})
                </Link>
                <p className="small text-muted mt-2">
                  🔍 Usa filtri avanzati per trovare il progetto perfetto per te
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-5" data-aos="fade-up">
              <FaSearch size={64} className="text-muted mb-3" />
              <h4 className="text-white">Nessun progetto pubblicato ancora</h4>
              <p className="text-muted">Sii il primo a pubblicare la tua idea!</p>
            </div>
          )}
        </div>
      </section>

      {/* PRODOTTI IN EVIDENZA */}
      <section className="py-5 bg-dark" id="prodotti">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="flex-grow-1">
                <h2 className="display-4 fw-bold mb-3 text-white">Prodotti in Evidenza</h2>
                <p className="lead text-light">Soluzioni software pronte all'uso create dai nostri sviluppatori</p>
              </div>
              <div className="d-flex align-items-center">
                <div className="text-center me-4">
                  <h3 className="mb-0 text-primary">{prodotti.length}</h3>
                  <small className="text-light">disponibili</small>
                </div>
                <Link to="/prodotti-pronti" className="btn btn-warning btn-lg rounded-pill shadow px-4">
                  <FaShoppingCart className="me-2" />
                  Marketplace
                </Link>
              </div>
            </div>
          </div>
          
          {prodotti.length > 0 ? (
            <div data-aos="fade-up">
              <Slider {...prodottiSliderSettings} className="prodotti-slider">
                {prodotti.slice(-6).reverse().map(p => {
                  const categoriaProdotto = categorieProdotti.find(c => c.value === p.categoria);
                  return (
                    <div key={p.id} className="px-3">
                      <div className="prodotto-card">
                        <div className="card border-2 border-opacity-10 shadow-lg rounded-4 h-100 overflow-hidden card-hover">
                          <div className="card-body p-4">
                            <div className="d-flex align-items-center mb-3">
                              {categoriaProdotto && (
                                <div className="badge rounded-pill me-2 fw-semibold text-truncate" style={{ 
                                  backgroundColor: `${categoriaProdotto.color}25`, 
                                  color: categoriaProdotto.color, 
                                  border: `1px solid ${categoriaProdotto.color}40`,
                                  maxWidth: '110px',
                                  fontSize: '0.75rem'
                                }}>
                                  <span className="me-1">{categoriaProdotto.icon}</span>
                                  {categoriaProdotto.label.split('/')[0]}
                                </div>
                              )}
                              <span className="badge bg-info rounded-pill fw-semibold" style={{ fontSize: '0.75rem' }}>
                                PRONTO
                              </span>
                            </div>
                            
                            {p.immagine && (
                              <div className="prodotto-image mb-3">
                                <img 
                                  src={p.immagine} 
                                  alt={p.titolo}
                                  className="img-fluid rounded-3 w-100"
                                  style={{ height: '140px', objectFit: 'cover', border: '1px solid rgba(0,0,0,0.1)' }}
                                />
                              </div>
                            )}
                            
                            <h5 className="card-title fw-bold mb-2 text-white text-truncate" style={{ fontSize: '1.1rem' }}>{p.titolo}</h5>
                            <p className="card-text text-muted mb-3" style={{ 
                              height: '48px', 
                              overflow: 'hidden', 
                              lineHeight: '1.3',
                              fontSize: '0.9rem',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}>
                              {p.descrizione.length > 80 ? p.descrizione.substring(0, 80) + '...' : p.descrizione}
                            </p>
                            
                            <div className="prodotto-footer">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="d-flex align-items-center text-success">
                                  <FaEuroSign className="me-1" />
                                  <strong className="fs-6">{p.prezzo}€</strong>
                                </div>
                                <small className="text-muted fw-semibold">
                                  <FaUser className="me-1" />
                                  {p.fornitore_username}
                                </small>
                              </div>
                              <div className="d-flex justify-content-between align-items-center">
                                <small className="text-muted">
                                  {new Date(p.data_pubblicazione).toLocaleDateString()}
                                </small>
                                <button 
                                  className="btn btn-success btn-sm rounded-pill"
                                  onClick={() => handleAcquistaProdotto(p)}
                                >
                                  Acquista <FaArrowRight className="ms-1" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Slider>
            </div>
          ) : (
            <div className="text-center py-5" data-aos="fade-up">
              <FaShoppingCart size={64} className="text-muted mb-3" />
              <h4 className="text-white">Nessun prodotto disponibile ancora</h4>
              <p className="text-muted">I nostri sviluppatori stanno preparando soluzioni innovative!</p>
              <Link to="/prodotti-pronti" className="btn btn-primary rounded-pill px-4 py-2 mt-3">
                Esplora Marketplace <FaArrowRight className="ms-2" />
              </Link>
            </div>
          )}
          
          {/* Call to Action per Marketplace */}
          {prodotti.length > 0 && (
            <div className="text-center mt-5" data-aos="fade-up">
              <div className="bg-light rounded-4 p-4 border border-warning border-opacity-25">
                <h4 className="fw-bold text-white mb-2">
                  <FaShoppingCart className="text-warning me-2" />
                  Esplora Tutto il Marketplace
                </h4>
                <p className="text-muted mb-3">
                  Scopri centinaia di soluzioni software pronte all'uso create dai migliori sviluppatori
                </p>
                <Link to="/prodotti-pronti" className="btn btn-warning btn-lg rounded-pill px-5 shadow">
                  <FaEye className="me-2" />
                  Sfoglia Tutti i Prodotti
                  <FaArrowRight className="ms-2" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* TESTIMONIANZE */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="display-4 fw-bold mb-3 text-white">Cosa Dicono di Noi</h2>
            <p className="lead text-light">Le storie di successo della nostra community</p>
          </div>
          
          <div data-aos="fade-up">
            <Slider {...testimonialSliderSettings} className="testimonials-slider">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="px-3">
                  <div className="testimonial-card">
                    <div className="card border-0 shadow-lg rounded-4 h-100">
                      <div className="card-body p-4">
                        <div className="testimonial-avatar mb-3">
                          <span className="avatar-emoji">{testimonial.avatar}</span>
                        </div>
                        
                        <div className="testimonial-rating mb-3">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <FaStar key={i} className="text-warning me-1" />
                          ))}
                        </div>
                        
                        <div className="testimonial-quote mb-3">
                          <FaQuoteLeft className="text-primary opacity-25 mb-2" size={24} />
                          <p className="mb-0 fs-6">{testimonial.text}</p>
                        </div>
                        
                        <div className="testimonial-author">
                          <h6 className="fw-bold mb-0">{testimonial.name}</h6>
                          <small className="text-muted">{testimonial.role}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* GARANZIE */}
      <section className="py-5 bg-light position-relative overflow-hidden">
        <div className="container position-relative z-2">
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="display-4 fw-bold mb-3">Garanzie D&S</h2>
            <p className="lead text-muted">La tua sicurezza è la nostra priorità</p>
          </div>
          
          <div className="row g-4 justify-content-center">
            {garanzie.map((garanzia) => (
              <div className="col-lg-6 col-xl-3" key={garanzia.id} data-aos="fade-up" data-aos-delay={garanzia.id * 100}>
                <div 
                  className="garanzia-card h-100"
                  onMouseEnter={() => setActiveGaranzia(garanzia.id)}
                  onMouseLeave={() => setActiveGaranzia(null)}
                >
                  <div className="card border-0 rounded-4 h-100 p-0 overflow-hidden shadow-lg">
                    <div className="card-body p-4 h-100 d-flex flex-column position-relative">
                      <div 
                        className="garanzia-icon mb-3" 
                        style={{ color: garanzia.color }}
                      >
                        {garanzia.icon}
                      </div>
                      
                      <h5 className="fw-bold mb-2" style={{ color: garanzia.color }}>
                        {garanzia.title}
                      </h5>
                      <p className="text-muted mb-0 flex-grow-1">{garanzia.description}</p>
                      
                      <div 
                        className="garanzia-overlay position-absolute top-0 start-0 w-100 h-100"
                        style={{ 
                          background: activeGaranzia === garanzia.id ? 
                            `linear-gradient(135deg, ${garanzia.color}15, ${garanzia.color}05)` : 
                            'transparent',
                          transition: 'all 0.3s ease'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-decoration position-absolute top-0 end-0 opacity-5">
          <FaBolt size={200} className="text-primary" />
        </div>
      </section>

      {/* CTA FINALE */}
      <section className="py-5 bg-primary text-white position-relative overflow-hidden">
        <div className="container position-relative z-2">
          <div className="row align-items-center">
            <div className="col-lg-8" data-aos="fade-right">
              <h2 className="display-4 fw-bold mb-3">Pronto a Iniziare?</h2>
              <p className="lead mb-4">
                Unisciti a migliaia di clienti e sviluppatori che stanno già trasformando idee in successi digitali.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/register" className="btn btn-light btn-lg rounded-pill px-5 py-3">
                  <FaRocket className="me-2" />
                  Registrati Gratis
                </Link>
                <Link to="/login" className="btn btn-outline-light btn-lg rounded-pill px-5 py-3">
                  Accedi Ora
                </Link>
              </div>
            </div>
            <div className="col-lg-4 text-center" data-aos="fade-left">
              <div className="cta-icon">
                <FaHeart size={120} className="text-white opacity-25" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-decoration position-absolute bottom-0 start-0 opacity-10">
          <FaRocket size={150} className="text-white" />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-5 bg-dark text-white">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <h3 className="fw-bold mb-3">Domanda & Software</h3>
              <p className="text-white-50 mb-3">
                Il marketplace italiano che connette visionari e sviluppatori per creare il futuro digitale.
              </p>
              <div className="social-links">
                <span className="text-white-50">Seguici:</span>
                {/* Qui andrebbero i link social */}
              </div>
            </div>
            <div className="col-lg-2">
              <h5 className="fw-bold mb-3">Piattaforma</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><Link to="/login" className="text-white-50 text-decoration-none">Accedi</Link></li>
                <li className="mb-2"><Link to="/register" className="text-white-50 text-decoration-none">Registrati</Link></li>
                <li className="mb-2"><Link to="/prodotti-pronti" className="text-white-50 text-decoration-none">Prodotti</Link></li>
              </ul>
            </div>
            <div className="col-lg-2">
              <h5 className="fw-bold mb-3">Supporto</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><Link to="/scopo-del-sito" className="text-white-50 text-decoration-none">Scopo del Sito</Link></li>
                <li className="mb-2"><Link to="/contatti" className="text-white-50 text-decoration-none">Contatti</Link></li>
                <li className="mb-2"><Link to="/faq" className="text-white-50 text-decoration-none">FAQ</Link></li>
              </ul>
            </div>
            <div className="col-lg-2">
              <h5 className="fw-bold mb-3">Legale</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><Link to="/privacy-policy" className="text-white-50 text-decoration-none">Privacy Policy</Link></li>
                <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Termini</a></li>
                <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Cookie</a></li>
              </ul>
            </div>
            <div className="col-lg-2">
              <h5 className="fw-bold mb-3">Azienda</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><Link to="/chi-siamo" className="text-white-50 text-decoration-none">Chi Siamo</Link></li>
                <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Carriere</a></li>
                <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Partner</a></li>
              </ul>
            </div>
          </div>
          <hr className="my-4 opacity-25" />
          <div className="row align-items-center">
            <div className="col-md-6">
              <small className="text-white-50">
                © {new Date().getFullYear()} Domanda & Software. Tutti i diritti riservati.
              </small>
            </div>
            <div className="col-md-6 text-md-end">
              <small className="text-white-50">
                P.IVA 12345678901 - Made with <FaHeart className="text-danger mx-1" /> in Italy
              </small>
            </div>
          </div>
        </div>
      </footer>

      {/* MODAL DI ACQUISTO */}
      {prodottoSelezionato && (
        <AcquistoModal 
          prodotto={prodottoSelezionato}
          show={showAcquistoModal}
          onClose={handleCloseModal}
        />
      )}

      {/* CSS INLINE PER LA SEZIONE COME FUNZIONA E HERO */}
      <style>
        {`
          .home-page {
            overflow-x: hidden;
          }
          
          /* Menu Moderno Overlay */
          .nav-link-modern {
            color: white !important;
            text-decoration: none !important;
            font-weight: 500;
            padding: 8px 16px;
            border-radius: 25px;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            border: 1px solid transparent;
          }
          
          .nav-link-modern:hover {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
            color: #ffc107 !important;
          }
          
          .mobile-nav-link {
            padding: 12px 20px !important;
            border-radius: 8px;
            transition: all 0.3s ease;
            margin: 4px 0;
          }
          
          .mobile-nav-link:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateX(10px);
          }
          
          .mobile-menu-overlay {
            backdrop-filter: blur(20px);
            border-radius: 0 0 20px 20px;
          }
          
          /* Hero Section */
          .hero-section {
            position: relative;
            height: 55vh;
            overflow: hidden;
          }
          
          .hero-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            transition: opacity 1s ease-in-out;
          }
          
          .hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: white;
          }
          
          .hero-content h1 {
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
          }
          
          .hero-content p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
          }
          
          .photo-indicators {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            z-index: 5;
          }
          
          .photo-indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: rgba(255,255,255,0.5);
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .photo-indicator.active {
            background: white;
            transform: scale(1.2);
          }
          
          .hover-effect {
            transition: all 0.3s ease;
          }
          
          .hover-effect:hover {
            background-color: rgba(255,255,255,0.2) !important;
            backdrop-filter: blur(10px);
            transform: translateY(-2px);
          }
          
          @media (max-width: 768px) {
            .hero-content h1 {
              font-size: 2.5rem;
            }
            .hero-content p {
              font-size: 1rem;
            }
          }
          
          /* Card Navbar Hover Effects */
          .card-body a:hover {
            color: #ffc107 !important;
            transform: translateY(-1px);
            transition: all 0.3s ease;
            text-shadow: 0 0 10px rgba(255, 193, 7, 0.5);
          }
          
          /* Navbar trasparente */
          .card-body .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
          }
          
          .card-body .btn-outline-light:hover {
            background-color: rgba(255,255,255,0.2);
            border-color: #ffc107;
            color: #ffc107 !important;
          }
        `}
      </style>
    </div>
  );
}

export default Home; 
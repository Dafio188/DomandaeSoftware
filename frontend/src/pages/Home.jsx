import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AcquistoModal from '../components/AcquistoModal';
import { FaUserTie, FaUser, FaShieldAlt, FaLock, FaEuroSign, FaStar, FaHandshake, FaArrowRight, FaMoneyBillWave, FaComments, FaHeadset, FaUserShield, FaRocket, FaLightbulb, FaCode, FaChartLine, FaGlobe, FaMobile, FaDesktop, FaCloud, FaCogs, FaSearch, FaHeart, FaCheckCircle, FaBolt, FaTrophy, FaPlay, FaQuoteLeft, FaShoppingCart, FaEye, FaAward, FaUsers, FaBars, FaTimes, FaHome, FaInfoCircle, FaEnvelope, FaSignInAlt, FaUserPlus, FaArrowLeft, FaClock, FaBrain } from 'react-icons/fa';
import Slider from 'react-slick';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Testimonianze from '../components/Testimonianze';
import { API_BASE } from '../config/api.js';

function Home() {
  const [richieste, setRichieste] = useState([]);
  const [prodotti, setProdotti] = useState([]);
  const [activeGaranzia, setActiveGaranzia] = useState(null);
  const [stats, setStats] = useState({ richieste: 0, fornitori: 0, progetti: 0, soddisfazione: 98 });
  
  // Stati per il modal di acquisto
  const [showAcquistoModal, setShowAcquistoModal] = useState(false);
  const [prodottoSelezionato, setProdottoSelezionato] = useState(null);

  // Sistema foto dinamico - rilevamento automatico
  const [heroImage, setHeroImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allHeroImages, setAllHeroImages] = useState([]);
  
  // Funzione per rilevare automaticamente tutte le immagini
  const detectHeroImages = async () => {
    try {
      console.log('🔍 Rilevamento automatico immagini hero...');
      
      // Lista di possibili nomi di file da cercare (solo immagini hero)
      const possibleImages = [
        // Pattern con underscore (originali)
        'sfondo_home.png', 'sfondo_home.jpg', 'sfondo_home.jpeg', 'sfondo_home.webp',
        'sfondo_home_2.png', 'sfondo_home_2.jpg', 'sfondo_home_2.jpeg', 'sfondo_home_2.webp',
        'sfondo_home_3.png', 'sfondo_home_3.jpg', 'sfondo_home_3.jpeg', 'sfondo_home_3.webp',
        'sfondo_home_4.png', 'sfondo_home_4.jpg', 'sfondo_home_4.jpeg', 'sfondo_home_4.webp',
        'sfondo_home_5.png', 'sfondo_home_5.jpg', 'sfondo_home_5.jpeg', 'sfondo_home_5.webp',
        'sfondo_home_6.png', 'sfondo_home_6.jpg', 'sfondo_home_6.jpeg', 'sfondo_home_6.webp',
        // Pattern senza underscore (nuovi)
        'sfondo_home1.png', 'sfondo_home1.jpg', 'sfondo_home1.jpeg', 'sfondo_home1.webp',
        'sfondo_home2.png', 'sfondo_home2.jpg', 'sfondo_home2.jpeg', 'sfondo_home2.webp',
        'sfondo_home3.png', 'sfondo_home3.jpg', 'sfondo_home3.jpeg', 'sfondo_home3.webp',
        'sfondo_home4.png', 'sfondo_home4.jpg', 'sfondo_home4.jpeg', 'sfondo_home4.webp',
        'sfondo_home5.png', 'sfondo_home5.jpg', 'sfondo_home5.jpeg', 'sfondo_home5.webp',
        'sfondo_home6.png', 'sfondo_home6.jpg', 'sfondo_home6.jpeg', 'sfondo_home6.webp',
        // Altri pattern
        'hero_1.png', 'hero_1.jpg', 'hero_1.jpeg', 'hero_1.webp',
        'hero_2.png', 'hero_2.jpg', 'hero_2.jpeg', 'hero_2.webp',
        'hero_3.png', 'hero_3.jpg', 'hero_3.jpeg', 'hero_3.webp',
        'hero_4.png', 'hero_4.jpg', 'hero_4.jpeg', 'hero_4.webp',
        'hero_5.png', 'hero_5.jpg', 'hero_5.jpeg', 'hero_5.webp',
        'home_1.png', 'home_1.jpg', 'home_1.jpeg', 'home_1.webp',
        'home_2.png', 'home_2.jpg', 'home_2.jpeg', 'home_2.webp',
        'home_3.png', 'home_3.jpg', 'home_3.jpeg', 'home_3.webp',
        'background_1.png', 'background_1.jpg', 'background_1.jpeg', 'background_1.webp',
        'background_2.png', 'background_2.jpg', 'background_2.jpeg', 'background_2.webp',
        'background_3.png', 'background_3.jpg', 'background_3.jpeg', 'background_3.webp'
      ];
      
      // Lista di file da escludere (loghi, icone, ecc.)
      const excludePatterns = [
        /logo/i,           // Qualsiasi file con "logo" nel nome
        /icon/i,           // Qualsiasi file con "icon" nel nome
        /favicon/i,        // Favicon
        /thumbnail/i,      // Miniature
        /thumb/i,          // Miniature
        /preview/i,        // Anteprime
        /avatar/i,         // Avatar
        /profile/i,        // Immagini profilo
        /banner/i,         // Banner (se non sono hero)
        /tecnobridge/i     // Specifico per il tuo logo
      ];
      
      const validImages = [];
      
      // Testa ogni possibile immagine
      for (const imageName of possibleImages) {
        try {
          // Controlla se il nome del file è nella lista di esclusione
          const shouldExclude = excludePatterns.some(pattern => pattern.test(imageName));
          if (shouldExclude) {
            console.log(`🚫 Escluso file: ${imageName} (corrisponde a pattern di esclusione)`);
            continue;
          }
          
          const imagePath = `/foto_home/${imageName}`;
          
          // Crea un elemento img per testare se l'immagine esiste
          const img = new Image();
          
          const imageExists = await new Promise((resolve) => {
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = imagePath;
            
            // Timeout dopo 2 secondi
            setTimeout(() => resolve(false), 2000);
          });
          
          if (imageExists) {
            validImages.push({
              src: imagePath,
              alt: `SoftMatch - ${imageName.replace(/\.(png|jpg|jpeg|webp)$/i, '').replace(/_/g, ' ')}`
            });
            console.log(`✅ Trovata immagine hero: ${imagePath}`);
          }
        } catch {
          // Ignora errori per immagini non trovate
        }
      }
      
      if (validImages.length > 0) {
        console.log(`🎉 Rilevate ${validImages.length} immagini hero automaticamente!`);
        setAllHeroImages(validImages);
        
        // Imposta la prima immagine random
        const randomIndex = Math.floor(Math.random() * validImages.length);
        setCurrentImageIndex(randomIndex);
        setHeroImage(validImages[randomIndex]);
        console.log(`📸 Immagine iniziale: ${validImages[randomIndex].src}`);
      } else {
        console.warn('⚠️ Nessuna immagine hero trovata, uso fallback');
        // Fallback alle immagini di default
        const fallbackImages = [
          { src: '/foto_home/sfondo_home.png', alt: 'SoftMatch - Marketplace' }
        ];
        setAllHeroImages(fallbackImages);
        setCurrentImageIndex(0);
        setHeroImage(fallbackImages[0]);
      }
    } catch (error) {
      console.error('❌ Errore nel rilevamento automatico:', error);
      // Fallback in caso di errore
      const fallbackImages = [
        { src: '/foto_home/sfondo_home.png', alt: 'SoftMatch - Marketplace' }
      ];
      setAllHeroImages(fallbackImages);
      setCurrentImageIndex(0);
      setHeroImage(fallbackImages[0]);
    }
  };
  
  // Inizializza il rilevamento automatico delle immagini
  useEffect(() => {
    detectHeroImages();
  }, []);

  // Rotazione automatica foto con intervalli random
  useEffect(() => {
    if (allHeroImages.length <= 1) return; // Non ruotare se c'è solo un'immagine
    
    const getRandomInterval = () => Math.floor(Math.random() * 5000) + 8000; // 8-13 secondi random
    
    const scheduleNextImage = () => {
      const interval = getRandomInterval();
      console.log(`⏰ Prossima foto tra ${interval/1000} secondi`);
      
      setTimeout(() => {
        setCurrentImageIndex(prev => {
          // Scegli un indice diverso da quello attuale
          let nextIndex;
          do {
            nextIndex = Math.floor(Math.random() * allHeroImages.length);
          } while (nextIndex === prev && allHeroImages.length > 1);
          
          setHeroImage(allHeroImages[nextIndex]);
          console.log(`🔄 Cambiata a foto: ${allHeroImages[nextIndex].src}`);
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

    const fetchStats = async () => {
      try {
        const richiesteResponse = await axios.get(`${API_BASE}richieste/`);
        const richiesteData = Array.isArray(richiesteResponse.data)
          ? richiesteResponse.data
          : (richiesteResponse.data?.results || []);
        setRichieste(richiesteData);

        const prodottiResponse = await axios.get(`${API_BASE}prodotti-pronti/`);
        const prodottiData = Array.isArray(prodottiResponse.data)
          ? prodottiResponse.data
          : (prodottiResponse.data?.results || []);
        setProdotti(prodottiData);

        const response = await axios.get(`${API_BASE}stats/home/`);
        setStats(response.data);
      } catch {
        return;
      }
    };
    
    fetchStats();
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
    { iconSrc: "/immagini icona homepage/01.png", title: "Sviluppo Software", desc: "Soluzioni custom su misura", projects: 45, color: "#4e73df" },
    { iconSrc: "/immagini icona homepage/02.png", title: "App Mobile", desc: "iOS e Android nativi", projects: 23, color: "#e74a3b" },
    { iconSrc: "/immagini icona homepage/03.png", title: "Siti Web", desc: "Design moderni e responsivi", projects: 67, color: "#1cc88a" },
    { iconSrc: "/immagini icona homepage/04.png", title: "Cloud Solutions", desc: "Soluzioni scalabili", projects: 18, color: "#36b9cc" },
    { iconSrc: "/immagini icona homepage/05.png", title: "Automazione", desc: "Processi intelligenti", projects: 34, color: "#6f42c1" },
    { iconSrc: "/immagini icona homepage/06.png", title: "Intelligenza Artificiale", desc: "Modelli e integrazioni AI", projects: 51, color: "#ffb703" }
  ];

  const testimonials = [
    {
      name: "Marco Rossi",
      role: "CEO, TechStart Srl",
      text: "Grazie a SoftMatch abbiamo trovato il partner perfetto per il nostro CRM. Risultato eccellente in tempi record!",
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
      text: "Come fornitore, SoftMatch mi ha aperto le porte a progetti interessanti. Clienti seri e pagamenti puntuali.",
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
          minHeight: '600px',
          maxHeight: '900px',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center'
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
        
        {/* Overlay gradiente per leggibilità - RIDOTTO PER VISIBILITA IMMAGINE */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,0.2), rgba(0,0,0,0.1))',
            zIndex: 2
          }}
        />
        
        {/* CONTENUTO HERO CENTRATO */}
        <div className="container-fluid position-relative" style={{ zIndex: 3, minHeight: '100%' }}>
          <div className="row align-items-center justify-content-center" style={{ minHeight: '600px', paddingTop: '140px', paddingBottom: '80px' }}>
            <div className="col-12 col-lg-10 d-flex justify-content-center align-items-center">
              <div className="hero-main-card" data-aos="fade-up" style={{ 
                width: '100%', 
                maxWidth: '900px',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '30px',
                padding: '50px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
              }}>
                <div className="text-center">
                  <h1 className="display-1 fw-bold mb-4 text-white" style={{ 
                    textShadow: '0 5px 15px rgba(0,0,0,0.4)',
                    letterSpacing: '-0.04em',
                    lineHeight: '1.05'
                  }}>
                    Connettiamo Visionari con i Migliori Sviluppatori
                  </h1>
                  
                  <p className="lead mb-5 text-white fs-3 opacity-90" style={{ 
                    maxWidth: '800px',
                    margin: '0 auto 3rem auto',
                    fontWeight: '400',
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                  }}>
                    Trasforma le tue idee in soluzioni software innovative. <br/>
                    Il marketplace leader per progetti digitali d'eccellenza.
                  </p>
                  
                  <div className="hero-cta d-flex flex-wrap gap-4 justify-content-center">
                    <Link to="/register" className="btn btn-primary btn-lg rounded-pill px-5 py-3 shadow-lg fs-5 fw-bold" style={{
                      background: '#0071e3',
                      border: 'none'
                    }}>
                      <FaRocket className="me-2" />
                      Inizia Ora
                    </Link>
                    <a href="#come-funziona" className="btn btn-outline-light btn-lg rounded-pill px-5 py-3 shadow border-2 fs-5">
                      <FaPlay className="me-2" />
                      Scopri Come
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* NUOVI CONTROLLI FRECCE FLOATING - SENZA PALLINI */}
        <div className="hero-navigation">
          {/* Freccia Sinistra */}
          <button 
            className="hero-nav-arrow hero-nav-left"
            onClick={() => {
              const newIndex = currentImageIndex === 0 ? allHeroImages.length - 1 : currentImageIndex - 1;
              setCurrentImageIndex(newIndex);
              setHeroImage(allHeroImages[newIndex]);
            }}
            aria-label="Immagine precedente"
          >
            <FaArrowLeft />
          </button>
          
          {/* Freccia Destra */}
          <button 
            className="hero-nav-arrow hero-nav-right"
            onClick={() => {
              const newIndex = currentImageIndex === allHeroImages.length - 1 ? 0 : currentImageIndex + 1;
              setCurrentImageIndex(newIndex);
              setHeroImage(allHeroImages[newIndex]);
            }}
            aria-label="Immagine successiva"
          >
            <FaArrowRight />
          </button>
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
                    <div className="card-body p-4 position-relative categoria-card-body">
                      <div className="categoria-icon-wrap">
                        <img
                          src={cat.iconSrc}
                          alt={cat.title}
                          className="categoria-img"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/sito_web.png';
                          }}
                        />
                      </div>
                      <div className="categoria-text">
                        <h5 className="categoria-title text-white mb-1">{cat.title}</h5>
                        <div className="categoria-sub">{cat.projects} progetti attivi</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/categorie" className="text-primary fw-semibold">Vedi Tutte le Categorie</Link>
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
      <section className="py-5 bg-dark hiw-section" id="come-funziona">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="display-4 fw-bold mb-2 text-white">Come Funziona</h2>
          </div>

          <div className="row g-5 align-items-start" data-aos="fade-up">
            <div className="col-lg-6">
              <div className="hiw-col hiw-col-clienti">
                <h3 className="hiw-col-title hiw-col-title-clienti">Per i Clienti</h3>

                <div className="hiw-step">
                  <div className="hiw-step-rail">
                    <div className="hiw-step-number hiw-step-number-clienti">1</div>
                    <div className="hiw-step-line hiw-step-line-clienti"></div>
                  </div>
                  <div className="hiw-step-body">
                    <div className="hiw-step-title">Pubblica la tua idea</div>
                    <div className="hiw-step-desc">
                      Pubblica la tua idea e inizia una sfida: descrivi cosa vuoi realizzare e cosa ti serve,
                      e contatta i migliori professionisti.
                    </div>
                    <Link to="/register" className="btn hiw-pill hiw-pill-clienti">
                      Pubblica la tua idea
                    </Link>
                  </div>
                </div>

                <div className="hiw-step">
                  <div className="hiw-step-rail">
                    <div className="hiw-step-number hiw-step-number-clienti">2</div>
                    <div className="hiw-step-line hiw-step-line-clienti"></div>
                  </div>
                  <div className="hiw-step-body">
                    <div className="hiw-step-title">Ricevi offerte qualificate</div>
                    <div className="hiw-step-desc">
                      Ricevi offerte qualificate, ragionevoli e trasparenti. Confronta i profili,
                      tempi e prezzi con serenità.
                    </div>
                    <a href="#richieste" className="btn hiw-pill hiw-pill-clienti">
                      Ricevi offerte qualificate
                    </a>
                  </div>
                </div>

                <div className="hiw-step hiw-step-last">
                  <div className="hiw-step-rail">
                    <div className="hiw-step-number hiw-step-number-clienti">3</div>
                  </div>
                  <div className="hiw-step-body">
                    <div className="hiw-step-title">Scegli e collabora</div>
                    <div className="hiw-step-desc">
                      Scegli il collaboratore ideale e segui i dettagli del lavoro, tutto in un unico posto.
                      Pagamenti sicuri e consegna tracciata.
                    </div>
                    <Link to="/login" className="btn hiw-pill hiw-pill-clienti">
                      Scegli e collabora
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="hiw-col hiw-col-fornitori">
                <h3 className="hiw-col-title hiw-col-title-fornitori">Per i Fornitori</h3>

                <div className="hiw-step">
                  <div className="hiw-step-rail">
                    <div className="hiw-step-number hiw-step-number-fornitori">1</div>
                    <div className="hiw-step-line hiw-step-line-fornitori"></div>
                  </div>
                  <div className="hiw-step-body">
                    <div className="hiw-step-title">Esplora le opportunità</div>
                    <div className="hiw-step-desc">
                      Esplora le opportunità e invia la tua proposta: se la combini con standard di qualità,
                      aumenti le chance di successo.
                    </div>
                    <Link to="/richieste" className="btn hiw-pill hiw-pill-fornitori">
                      Esplora le opportunità
                    </Link>
                  </div>
                </div>

                <div className="hiw-step">
                  <div className="hiw-step-rail">
                    <div className="hiw-step-number hiw-step-number-fornitori">2</div>
                    <div className="hiw-step-line hiw-step-line-fornitori"></div>
                  </div>
                  <div className="hiw-step-body">
                    <div className="hiw-step-title">Invia la tua proposta</div>
                    <div className="hiw-step-desc">
                      Proponi una proposta chiara: tempi, costi e metodologia. Trasparenza e comunicazione
                      portano risultati.
                    </div>
                    <Link to="/register" className="btn hiw-pill hiw-pill-fornitori">
                      Invia la tua proposta
                    </Link>
                  </div>
                </div>

                <div className="hiw-step hiw-step-last">
                  <div className="hiw-step-rail">
                    <div className="hiw-step-number hiw-step-number-fornitori">3</div>
                  </div>
                  <div className="hiw-step-body">
                    <div className="hiw-step-title">Sviluppa e guadagna</div>
                    <div className="hiw-step-desc">
                      Sviluppa e guadagna: lavora con clienti reali, costruisci reputazione e ricevi pagamenti
                      al completamento.
                    </div>
                    <Link to="/register" className="btn hiw-pill hiw-pill-fornitori">
                      Sviluppa e guadagna
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATISTICHE */}
      <section className="py-4 bg-dark">
        <div className="container" data-aos="fade-up">
          <div className="hiw-stats-strip">
            <div className="hiw-stat">
              <div className="hiw-stat-icon hiw-stat-icon-blue">
                <FaBolt />
              </div>
              <div className="hiw-stat-value">{stats.ore_media_offerta || 18}+</div>
              <div className="hiw-stat-label">Average Offers</div>
            </div>
            <div className="hiw-stat">
              <div className="hiw-stat-icon hiw-stat-icon-green">
                <FaShieldAlt />
              </div>
              <div className="hiw-stat-value">{stats.pagamenti_sicuri || 100}%</div>
              <div className="hiw-stat-label">Secure Payments</div>
            </div>
            <div className="hiw-stat">
              <div className="hiw-stat-icon hiw-stat-icon-cyan">
                <FaUsers />
              </div>
              <div className="hiw-stat-value">{stats.sviluppatori_attivi || 150}+</div>
              <div className="hiw-stat-label">Active Devs</div>
            </div>
            <div className="hiw-stat">
              <div className="hiw-stat-icon hiw-stat-icon-gold">
                <FaTrophy />
              </div>
              <div className="hiw-stat-value">{stats.soddisfazione_clienti || 94}%</div>
              <div className="hiw-stat-label">Client Satisfaction</div>
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
            <h2 className="display-4 fw-bold mb-3">Garanzie SoftMatch</h2>
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
              <div className="d-flex align-items-center gap-3 mb-3">
                <img
                  src="/images/softmatch-logo.png?v=20260327-105709"
                  alt="SoftMatch"
                  style={{ height: '47px', width: 'auto', borderRadius: '10px' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/softmatch-logo.svg';
                  }}
                />
                <h3 className="fw-bold mb-0">SoftMatch</h3>
              </div>
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
                © {new Date().getFullYear()} SoftMatch. Tutti i diritti riservati.
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
          
          /* NUOVI INDICATORI PROGRESS BAR */
          .photo-progress-container {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            z-index: 5;
            background: rgba(0, 0, 0, 0.5);
            padding: 16px 24px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          }
          
          .photo-progress-bar {
            width: 200px;
            height: 4px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
            overflow: hidden;
          }
          
          .photo-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #007bff, #0056b3);
            border-radius: 2px;
            transition: width 0.3s ease;
          }
          
          .photo-counter {
            display: flex;
            align-items: center;
            gap: 4px;
            font-weight: 600;
            color: white;
            font-size: 0.9rem;
          }
          
          .photo-counter .divider {
            opacity: 0.7;
          }
          
          .photo-thumbnails {
            display: flex;
            gap: 8px;
          }
          
          .photo-thumbnail {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.4);
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .photo-thumbnail:hover {
            background: rgba(255, 255, 255, 0.7);
            transform: scale(1.2);
          }
          
          .photo-thumbnail.active {
            background: #007bff;
            box-shadow: 0 0 10px rgba(0, 123, 255, 0.6);
            transform: scale(1.3);
          }
          
          /* Responsive per progress container */
          @media (max-width: 768px) {
            .photo-progress-container {
              bottom: 15px;
              padding: 12px 18px;
              border-radius: 16px;
            }
            
            .photo-progress-bar {
              width: 150px;
            }
            
            .photo-counter {
              font-size: 0.8rem;
            }
            
            .photo-thumbnail {
              width: 6px;
              height: 6px;
            }
          }
          
          @media (max-width: 480px) {
            .photo-progress-container {
              bottom: 10px;
              padding: 10px 16px;
              border-radius: 14px;
            }
            
            .photo-progress-bar {
              width: 120px;
              height: 3px;
            }
            
            .photo-thumbnails {
              gap: 6px;
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
          
          /* ===== CONTROLLI FRECCE FLOATING - CLEAN ===== */
          .hero-navigation {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            z-index: 5;
          }
          
          .hero-nav-arrow {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 60px;
            height: 60px;
            background: rgba(0, 0, 0, 0.7);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            color: white;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            pointer-events: all;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            z-index: 10;
          }
          
          .hero-nav-arrow:hover {
            background: rgba(0, 123, 255, 0.9);
            border-color: rgba(255, 255, 255, 0.6);
            transform: translateY(-50%) scale(1.1);
            box-shadow: 0 10px 30px rgba(0, 123, 255, 0.4);
          }
          
          .hero-nav-arrow:active {
            transform: translateY(-50%) scale(0.95);
          }
          
          .hero-nav-left {
            left: 30px;
          }
          
          .hero-nav-right {
            right: 30px;
          }
          
          /* RESPONSIVE DESIGN FRECCE */
          @media (max-width: 992px) {
            .hero-nav-arrow {
              width: 50px;
              height: 50px;
              font-size: 18px;
            }
            
            .hero-nav-left {
              left: 20px;
            }
            
            .hero-nav-right {
              right: 20px;
            }
          }
          
          @media (max-width: 768px) {
            .hero-nav-arrow {
              width: 45px;
              height: 45px;
              font-size: 16px;
            }
            
            .hero-nav-left {
              left: 15px;
            }
            
            .hero-nav-right {
              right: 15px;
            }
          }
          
          .hero-dots {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 12px;
            padding: 12px 20px;
            background: rgba(0, 0, 0, 0.6);
            border-radius: 30px;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            pointer-events: all;
          }
          
          .hero-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.4);
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            padding: 0;
          }
          
          .hero-dot:hover {
            background: rgba(255, 255, 255, 0.7);
            transform: scale(1.2);
          }
          
          .hero-dot.active {
            background: #007bff;
            box-shadow: 0 0 20px rgba(0, 123, 255, 0.6);
            transform: scale(1.3);
          }
          
          /* Categoria icon image */
          .categoria-icon-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            padding-top: 10px;
          }

          .categoria-img {
            width: 270px;
            height: 270px;
            object-fit: contain;
            border-radius: 22px;
            background: transparent;
            will-change: filter, transform;
            display: block;
          }

          .categoria-card-body {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            min-height: 360px;
          }

          .categoria-text {
            margin-top: auto;
            text-align: center;
            padding-top: 18px;
          }

          .categoria-title {
            font-size: 1.5rem;
            font-weight: 700;
            letter-spacing: -0.02em;
            line-height: 1.15;
          }

          .categoria-sub {
            font-size: 1.25rem;
            color: rgba(255,255,255,0.65);
            font-weight: 600;
          }

          /* ===== COME FUNZIONA (stile mock) ===== */
          .hiw-section {
            background: radial-gradient(1200px 600px at 50% 0%, rgba(0, 123, 255, 0.12), transparent 60%),
                        radial-gradient(900px 500px at 80% 20%, rgba(40, 167, 69, 0.10), transparent 55%),
                        radial-gradient(900px 500px at 20% 30%, rgba(255, 193, 7, 0.08), transparent 55%);
          }

          .hiw-col {
            position: relative;
            padding: 10px 10px;
          }

          .hiw-col-title {
            font-size: 1.75rem;
            font-weight: 800;
            margin: 0 0 18px 0;
            letter-spacing: -0.02em;
          }

          .hiw-col-title-clienti {
            color: #2f9bff;
          }

          .hiw-col-title-fornitori {
            color: #37d67a;
          }

          .hiw-step {
            display: flex;
            gap: 14px;
            padding: 18px 0;
          }

          .hiw-step-rail {
            width: 44px;
            display: flex;
            flex-direction: column;
            align-items: center;
            flex-shrink: 0;
            margin-top: 2px;
          }

          .hiw-step-number {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 0.95rem;
            color: rgba(255,255,255,0.92);
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.14);
            box-shadow: 0 10px 24px rgba(0,0,0,0.25);
          }

          .hiw-step-number-clienti {
            box-shadow: 0 10px 24px rgba(0, 123, 255, 0.18);
          }

          .hiw-step-number-fornitori {
            box-shadow: 0 10px 24px rgba(40, 167, 69, 0.18);
          }

          .hiw-step-line {
            width: 2px;
            flex: 1;
            margin-top: 10px;
            background: rgba(255,255,255,0.10);
            border-radius: 2px;
          }

          .hiw-step-line-clienti {
            background: linear-gradient(180deg, rgba(47, 155, 255, 0.55), rgba(255,255,255,0.06));
          }

          .hiw-step-line-fornitori {
            background: linear-gradient(180deg, rgba(55, 214, 122, 0.55), rgba(255,255,255,0.06));
          }

          .hiw-step-body {
            padding-right: 10px;
          }

          .hiw-step-title {
            font-size: 1.1rem;
            font-weight: 800;
            color: rgba(255,255,255,0.95);
            margin-bottom: 6px;
          }

          .hiw-step-desc {
            color: rgba(255,255,255,0.70);
            font-size: 0.92rem;
            line-height: 1.55;
            max-width: 520px;
            margin-bottom: 12px;
          }

          .hiw-pill {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 10px 14px;
            border-radius: 999px;
            font-weight: 700;
            font-size: 0.9rem;
            border: 1px solid rgba(255,255,255,0.14);
            color: rgba(255,255,255,0.92);
            background: rgba(255,255,255,0.06);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            box-shadow: 0 12px 30px rgba(0,0,0,0.25);
            transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          }

          .hiw-pill:hover {
            transform: translateY(-1px);
            box-shadow: 0 16px 40px rgba(0,0,0,0.30);
            background: rgba(255,255,255,0.09);
            color: rgba(255,255,255,0.95);
          }

          .hiw-pill-clienti {
            background: rgba(0, 123, 255, 0.18);
            border-color: rgba(0, 123, 255, 0.35);
          }

          .hiw-pill-fornitori {
            background: rgba(40, 167, 69, 0.18);
            border-color: rgba(40, 167, 69, 0.35);
          }

          /* ===== STATS STRIP (stile mock) ===== */
          .hiw-stats-strip {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 18px;
            padding: 18px 22px;
            border-radius: 18px;
            background: linear-gradient(180deg, rgba(30,30,35,0.75), rgba(18,18,22,0.75));
            border: 1px solid rgba(255,255,255,0.08);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            box-shadow: 0 18px 50px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05);
          }

          .categoria-card .card {
            background: linear-gradient(180deg, rgba(30,30,35,0.86), rgba(18,18,22,0.88));
            border: 1px solid rgba(255,255,255,0.12) !important;
            box-shadow: 0 18px 50px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05);
          }

          .categoria-card .card:hover {
            border-color: rgba(255,255,255,0.22) !important;
            box-shadow: 0 24px 70px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.07);
          }

          .categoria-card .card-body {
            gap: 0;
          }

          @media (max-width: 576px) {
            .categoria-img {
              width: 220px;
              height: 220px;
              border-radius: 22px;
            }
          }
          .categoria-card .card .card-body {
            position: relative;
          }
          .card-hover:hover {
            transform: translateY(-4px);
            transition: transform 0.2s ease;
          }

          .hiw-stat {
            display: grid;
            grid-template-columns: 44px 1fr;
            grid-template-rows: auto auto;
            column-gap: 12px;
            align-items: center;
            padding: 10px 6px;
          }

          .hiw-stat-icon {
            width: 44px;
            height: 44px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.10);
            color: rgba(255,255,255,0.9);
            grid-row: 1 / span 2;
            box-shadow: 0 12px 30px rgba(0,0,0,0.25);
          }

          .hiw-stat-icon-blue { background: rgba(0, 123, 255, 0.16); border-color: rgba(0, 123, 255, 0.28); }
          .hiw-stat-icon-green { background: rgba(40, 167, 69, 0.16); border-color: rgba(40, 167, 69, 0.28); }
          .hiw-stat-icon-cyan { background: rgba(54, 185, 204, 0.16); border-color: rgba(54, 185, 204, 0.28); }
          .hiw-stat-icon-gold { background: rgba(255, 193, 7, 0.16); border-color: rgba(255, 193, 7, 0.28); }

          .hiw-stat-value {
            font-weight: 900;
            font-size: 1.6rem;
            line-height: 1.1;
            color: rgba(255,255,255,0.95);
          }

          .hiw-stat-label {
            color: rgba(255,255,255,0.65);
            font-size: 0.85rem;
            font-weight: 600;
          }

          @media (max-width: 992px) {
            .hiw-stats-strip {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @media (max-width: 576px) {
            .hiw-stats-strip {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Home; 

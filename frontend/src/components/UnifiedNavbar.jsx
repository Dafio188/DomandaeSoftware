import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaHome, 
  FaInfoCircle, 
  FaRocket, 
  FaShieldAlt, 
  FaSignInAlt, 
  FaUserPlus,
  FaUser,
  FaUserTie,
  FaQuestionCircle,
  FaEnvelope,
  FaBars,
  FaTimes,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaTachometerAlt,
  FaProjectDiagram,
  FaStore
} from 'react-icons/fa';
import './UnifiedNavbar.css';

function UnifiedNavbar({ variant = 'auto', autoHide = true }) {
  const { user, role, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState(3); // Simulato

  // Determina il variant automaticamente se non specificato
  const getNavbarVariant = () => {
    if (variant !== 'auto') return variant;
    
    if (location.pathname === '/') return 'transparent';
    if (location.pathname.startsWith('/dashboard')) return 'dashboard';
    return 'solid';
  };

  const currentVariant = getNavbarVariant();

  // Gestione scroll per auto-hide e trasparenza
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Auto-hide logic
      if (autoHide) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      }
      
      // Trasparenza logic per homepage
      setIsScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, autoHide]);

  // Chiudi menu mobile quando cambia route
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false); // Chiudi anche dropdown utente
  }, [location.pathname]);

  // Chiudi dropdown utente quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserDropdownOpen && !event.target.closest('.user-dropdown')) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const closeUserDropdown = () => {
    setIsUserDropdownOpen(false);
  };

  // Menu items base per pagine pubbliche
  const publicMenuItems = [
    { path: '/', label: 'Home', icon: FaHome },
    { path: '/chi-siamo', label: 'Chi Siamo', icon: FaInfoCircle },
    { path: '/scopo-del-sito', label: 'Scopo del Sito', icon: FaRocket },
    { path: '/faq', label: 'FAQ & Supporto', icon: FaQuestionCircle },
    { path: '/contatti', label: 'Contatti', icon: FaEnvelope },
    { path: '/prodotti-pronti', label: 'Prodotti', icon: FaStore }
  ];

  // Menu items per dashboard
  const dashboardMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { path: '/le-tue-idee', label: 'I Miei Progetti', icon: FaProjectDiagram },
    { path: '/prodotti-pronti', label: 'Prodotti', icon: FaStore }
  ];

  const menuItems = currentVariant === 'dashboard' ? dashboardMenuItems : publicMenuItems;

  // Classi CSS dinamiche
  const getNavbarClasses = () => {
    let classes = 'unified-navbar';
    
    if (!isVisible) classes += ' navbar-hidden';
    if (currentVariant === 'transparent' && !isScrolled) classes += ' navbar-transparent';
    if (currentVariant === 'dashboard') classes += ' navbar-dashboard';
    if (isScrolled) classes += ' navbar-scrolled';
    
    return classes;
  };

  return (
    <>
      <nav className={getNavbarClasses()}>
        <div className="navbar-container">
          <div className="navbar-content">
            
            {/* Brand/Logo */}
            <div className="navbar-brand">
              <Link to={user ? '/dashboard' : '/'} className="brand-link">
                <div className="brand-content">
                  <img 
                    src="/images/LOGO_TECNOBRIDGE.png" 
                    alt="TechnoBridge" 
                    className="brand-logo"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'inline';
                    }}
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="navbar-menu d-none d-lg-flex">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon className="nav-icon" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Auth Section */}
            <div className="navbar-auth d-none d-lg-flex">
              {!user ? (
                <div className="auth-buttons">
                  <Link to="/login" className="btn btn-outline-light btn-sm">
                    <FaSignInAlt className="me-1" />
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-warning btn-sm">
                    <FaUserPlus className="me-1" />
                    Registrati
                  </Link>
                </div>
              ) : (
                <div className="user-menu">
                  {/* Notifiche */}
                  <div className="notification-icon">
                    <FaBell />
                    {notifications > 0 && (
                      <span className="notification-badge">{notifications}</span>
                    )}
                  </div>
                  
                  {/* User Dropdown */}
                  <div className="user-dropdown">
                    <button 
                      className="user-button"
                      onClick={toggleUserDropdown}
                    >
                      <div className="user-avatar">
                        {role === 'cliente' ? <FaUser /> : <FaUserTie />}
                      </div>
                      <div className="user-info">
                        <span className="user-name">{user.username}</span>
                        <span className="user-role">{role}</span>
                      </div>
                    </button>
                    
                    <div className={`dropdown-menu ${isUserDropdownOpen ? 'show' : ''}`}>
                      <Link 
                        to="/dashboard" 
                        className="dropdown-item"
                        onClick={closeUserDropdown}
                      >
                        <FaTachometerAlt className="me-2" />
                        Dashboard
                      </Link>
                      <Link 
                        to="/profilo" 
                        className="dropdown-item"
                        onClick={closeUserDropdown}
                      >
                        <FaCog className="me-2" />
                        Impostazioni
                      </Link>
                      <div className="dropdown-divider"></div>
                      <button 
                        onClick={() => {
                          handleLogout();
                          closeUserDropdown();
                        }} 
                        className="dropdown-item logout"
                      >
                        <FaSignOutAlt className="me-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-toggle d-lg-none"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-content">
          
          {/* Mobile Menu Items */}
          <div className="mobile-nav-items">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="mobile-nav-icon" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Auth Section */}
          <div className="mobile-auth-section">
            {!user ? (
              <div className="mobile-auth-buttons">
                <Link 
                  to="/login" 
                  className="btn btn-outline-light btn-lg w-100 mb-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaSignInAlt className="me-2" />
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-warning btn-lg w-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUserPlus className="me-2" />
                  Registrati
                </Link>
              </div>
            ) : (
              <div className="mobile-user-section">
                <div className="mobile-user-info">
                  <div className="mobile-user-avatar">
                    {role === 'cliente' ? <FaUser /> : <FaUserTie />}
                  </div>
                  <div>
                    <div className="mobile-user-name">{user.username}</div>
                    <div className="mobile-user-role">{role}</div>
                  </div>
                  {notifications > 0 && (
                    <div className="mobile-notifications">
                      <FaBell />
                      <span className="notification-badge">{notifications}</span>
                    </div>
                  )}
                </div>
                
                <div className="mobile-user-actions">
                  <Link 
                    to="/profilo" 
                    className="mobile-action-btn"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaCog className="me-2" />
                    Impostazioni
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }} 
                    className="mobile-action-btn logout"
                  >
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop per mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

export default UnifiedNavbar; 
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaTachometerAlt,
  FaUsers,
  FaProjectDiagram,
  FaCog,
  FaChartBar,
  FaShieldAlt,
  FaWallet,
  FaClipboardList,
  FaBell,
  FaSignOutAlt,
  FaCrown,
  FaBars,
  FaTimes,
  FaHome
} from 'react-icons/fa';
import './AdminNavbar.css';

function AdminNavbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications] = useState(5); // Simulato
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  const adminMenuItems = [
    { path: '/dashboard/admin', label: 'Dashboard', icon: FaTachometerAlt },
    { path: '/admin/utenti', label: 'Gestione Utenti', icon: FaUsers },
    { path: '/admin/progetti', label: 'Gestione Progetti', icon: FaProjectDiagram },
    { path: '/admin/statistiche', label: 'Statistiche', icon: FaChartBar },
    { path: '/admin/contabilita', label: 'Contabilità', icon: FaWallet },
    { path: '/admin/audit', label: 'Audit', icon: FaClipboardList },
    { path: '/admin/sicurezza', label: 'Sicurezza', icon: FaShieldAlt },
    { path: '/admin/impostazioni', label: 'Impostazioni', icon: FaCog }
  ];

  return (
    <>
      <nav className="admin-navbar">
        <div className="admin-navbar-container">
          <div className="admin-navbar-content">
            
            {/* Brand Admin */}
            <div className="admin-brand">
              <Link to="/dashboard/admin" className="admin-brand-link">
                <div className="admin-brand-content">
                  <div className="admin-crown-icon">
                    <FaCrown />
                  </div>
                  <span className="admin-brand-text">
                    Admin <span className="text-warning">Panel</span>
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="admin-menu d-none d-lg-flex">
              {adminMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`admin-nav-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon className="admin-nav-icon" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Admin Actions */}
            <div className="admin-actions d-none d-lg-flex">
              {/* Torna al sito */}
              <Link to="/" className="admin-action-btn site-link" title="Vai alla Home pubblica">
                <FaHome className="me-2" />
                Sito Pubblico
              </Link>

              {/* Notifiche Admin */}
              <div className="admin-notification-icon ms-2">
                <FaBell />
                {notifications > 0 && (
                  <span className="admin-notification-badge">{notifications}</span>
                )}
              </div>
              
              {/* Admin User Menu */}
              <div className="admin-user-dropdown-container d-flex align-items-center ms-3">
                <div className="admin-user-profile me-2">
                  <div className="admin-user-info text-end">
                    <span className="admin-user-name d-block text-white" style={{fontSize: '0.9rem', fontWeight: 'bold'}}>{user?.username}</span>
                    <span className="admin-user-role d-block text-warning" style={{fontSize: '0.7rem'}}>Administrator</span>
                  </div>
                </div>

                <button onClick={handleLogout} className="btn btn-sm btn-outline-light rounded-pill px-3 py-1" title="Esci dal sistema">
                  <FaSignOutAlt className="me-1" /> Logout
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="admin-mobile-toggle d-lg-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle admin menu"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`admin-mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="admin-mobile-content">
          
          {/* Mobile Menu Items */}
          <div className="admin-mobile-items">
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`admin-mobile-link ${isActive ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="admin-mobile-icon" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Admin Section */}
          <div className="admin-mobile-section">
            <div className="admin-mobile-user">
              <div className="admin-mobile-user-info">
                <div className="admin-mobile-avatar">
                  <FaCrown />
                </div>
                <div>
                  <div className="admin-mobile-name">{user?.username}</div>
                  <div className="admin-mobile-role">Administrator</div>
                </div>
              </div>
              
              <div className="admin-mobile-actions">
                <Link 
                  to="/" 
                  className="admin-mobile-action"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaHome className="me-2" />
                  Torna al Sito
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }} 
                  className="admin-mobile-action logout"
                >
                  <FaSignOutAlt className="me-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="admin-mobile-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

export default AdminNavbar;

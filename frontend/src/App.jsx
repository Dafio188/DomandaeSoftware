import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import UnifiedNavbar from './components/UnifiedNavbar';
import AdminNavbar from './components/AdminNavbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import DashboardCliente from './pages/DashboardCliente';
import DashboardFornitore from './pages/DashboardFornitore';
import DashboardAdmin from './pages/DashboardAdmin';
import AdminUtenti from './pages/AdminUtenti';
import AdminProgetti from './pages/AdminProgetti';
import AdminStatistiche from './pages/AdminStatistiche';
import AdminSicurezza from './pages/AdminSicurezza';
import AdminImpostazioni from './pages/AdminImpostazioni';
import AdminContabilita from './pages/AdminContabilita';
import AdminAudit from './pages/AdminAudit';
import Crediti from './pages/Crediti';
import ProtectedRoute from './components/ProtectedRoute';
import Progetto from './pages/Progetto';
import Progetti from './pages/Progetti';
import Register from './pages/Register';
import ProdottiPronti from './pages/ProdottiPronti';
import ProdottoDettaglio from './pages/ProdottoDettaglio';
import RichiestePage from './pages/RichiestePage';
import PasswordReset from './pages/PasswordReset';
import PasswordResetConfirm from './pages/PasswordResetConfirm';
import ChiSiamo from './pages/ChiSiamo';
import ScopoDelSito from './pages/ScopoDelSito';
import LeTueIdee from './pages/LeTueIdee';
import LeMieOfferteCliente from './pages/LeMieOfferteCliente';
import PrivacyPolicy from './pages/PrivacyPolicy';
import FAQ from './pages/FAQ';
import Contatti from './pages/Contatti';
import ProfiloImpostazioni from './pages/ProfiloImpostazioni';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { role } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // Mostra la AdminNavbar solo se siamo su una rotta admin E l'utente è effettivamente un amministratore
  const isAdminPath = location.pathname.startsWith('/dashboard/admin') || location.pathname.startsWith('/admin');
  const showAdminNavbar = isAdminPath && role === 'amministratore';

  return (
    <>
      {/* Navbar condizionale */}
      {showAdminNavbar ? <AdminNavbar /> : <UnifiedNavbar />}
      
      {/* Container con stile Mac globale */}
      <div className={isHomePage ? "" : "mac-page-wrapper"} style={{ paddingTop: isHomePage ? '0' : '90px' }}>
        <div className={isHomePage ? "" : "container"}>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chi-siamo" element={<ChiSiamo />} />
          <Route path="/scopo-del-sito" element={<ScopoDelSito />} />
          <Route path="/le-tue-idee" element={<LeTueIdee />} />
          <Route path="/le-mie-offerte-cliente" element={<ProtectedRoute><LeMieOfferteCliente /></ProtectedRoute>} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contatti" element={<Contatti />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/password-reset" element={<Auth />} />
          <Route path="/richieste" element={<RichiestePage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/cliente" element={<ProtectedRoute allowedRoles={['cliente']}><DashboardCliente /></ProtectedRoute>} />
          <Route path="/dashboard/fornitore" element={<ProtectedRoute allowedRoles={['fornitore']}><DashboardFornitore /></ProtectedRoute>} />
          <Route path="/dashboard/admin" element={<ProtectedRoute allowedRoles={['amministratore']}><DashboardAdmin /></ProtectedRoute>} />
          <Route path="/admin/utenti" element={<ProtectedRoute allowedRoles={['amministratore']}><AdminUtenti /></ProtectedRoute>} />
          <Route path="/admin/progetti" element={<ProtectedRoute allowedRoles={['amministratore']}><AdminProgetti /></ProtectedRoute>} />
          <Route path="/admin/statistiche" element={<ProtectedRoute allowedRoles={['amministratore']}><AdminStatistiche /></ProtectedRoute>} />
          <Route path="/admin/sicurezza" element={<ProtectedRoute allowedRoles={['amministratore']}><AdminSicurezza /></ProtectedRoute>} />
          <Route path="/admin/impostazioni" element={<ProtectedRoute allowedRoles={['amministratore']}><AdminImpostazioni /></ProtectedRoute>} />
          <Route path="/admin/contabilita" element={<ProtectedRoute allowedRoles={['amministratore']}><AdminContabilita /></ProtectedRoute>} />
          <Route path="/admin/audit" element={<ProtectedRoute allowedRoles={['amministratore']}><AdminAudit /></ProtectedRoute>} />
          <Route path="/crediti" element={<ProtectedRoute allowedRoles={['fornitore', 'cliente']}><Crediti /></ProtectedRoute>} />
          {/* Rotte alternative con trattino per compatibilità */}
          <Route path="/dashboard-cliente" element={<ProtectedRoute allowedRoles={['cliente']}><DashboardCliente /></ProtectedRoute>} />
          <Route path="/dashboard-fornitore" element={<ProtectedRoute allowedRoles={['fornitore']}><DashboardFornitore /></ProtectedRoute>} />
          <Route path="/progetto/:id" element={<ProtectedRoute><Progetto /></ProtectedRoute>} />
          <Route path="/progetti" element={<ProtectedRoute><Progetti /></ProtectedRoute>} />
          <Route path="/prodotti-pronti" element={<ProdottiPronti />} />
          <Route path="/prodotti-pronti/:id" element={<ProdottoDettaglio />} />
          <Route path="/reset-password/:uid/:token" element={<ProtectedRoute><PasswordResetConfirm /></ProtectedRoute>} />
          <Route path="/profilo-impostazioni" element={<ProfiloImpostazioni />} />
        </Routes>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} theme="light" />
    </div>
  </>
);
}

export default App;

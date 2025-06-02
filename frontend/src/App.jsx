import { Routes, Route, useLocation } from 'react-router-dom';
import UnifiedNavbar from './components/UnifiedNavbar';
import AdminNavbar from './components/AdminNavbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardCliente from './pages/DashboardCliente';
import DashboardFornitore from './pages/DashboardFornitore';
import DashboardAdmin from './pages/DashboardAdmin';
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

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isAdminPage = location.pathname.startsWith('/dashboard/admin') || location.pathname.startsWith('/admin');

  return (
    <>
      {/* Navbar condizionale */}
      {isAdminPage ? <AdminNavbar /> : <UnifiedNavbar />}
      
      {/* Container con padding-top per compensare navbar fixed */}
      <div className={isHomePage ? "" : "container mt-4"} style={{ paddingTop: isHomePage ? '0' : '90px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chi-siamo" element={<ChiSiamo />} />
          <Route path="/scopo-del-sito" element={<ScopoDelSito />} />
          <Route path="/le-tue-idee" element={<LeTueIdee />} />
          <Route path="/le-mie-offerte-cliente" element={<ProtectedRoute><LeMieOfferteCliente /></ProtectedRoute>} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contatti" element={<Contatti />} />
          <Route path="/login" element={<Login />} />
          <Route path="/richieste" element={<RichiestePage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/cliente" element={<ProtectedRoute><DashboardCliente /></ProtectedRoute>} />
          <Route path="/dashboard/fornitore" element={<ProtectedRoute><DashboardFornitore /></ProtectedRoute>} />
          <Route path="/dashboard/admin" element={<ProtectedRoute><DashboardAdmin /></ProtectedRoute>} />
          {/* Rotte alternative con trattino per compatibilità */}
          <Route path="/dashboard-cliente" element={<ProtectedRoute><DashboardCliente /></ProtectedRoute>} />
          <Route path="/dashboard-fornitore" element={<ProtectedRoute><DashboardFornitore /></ProtectedRoute>} />
          <Route path="/progetto/:id" element={<ProtectedRoute><Progetto /></ProtectedRoute>} />
          <Route path="/progetti" element={<ProtectedRoute><Progetti /></ProtectedRoute>} />
          <Route path="/register" element={<Register />} />
          <Route path="/prodotti-pronti" element={<ProdottiPronti />} />
          <Route path="/prodotti-pronti/:id" element={<ProdottoDettaglio />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/reset-password/:uid/:token" element={<ProtectedRoute><PasswordResetConfirm /></ProtectedRoute>} />
          <Route path="/profilo-impostazioni" element={<ProfiloImpostazioni />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

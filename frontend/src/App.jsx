import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardCliente from './pages/DashboardCliente';
import DashboardFornitore from './pages/DashboardFornitore';
import DashboardAdmin from './pages/DashboardAdmin';
import ProtectedRoute from './components/ProtectedRoute';
import Progetto from './pages/Progetto';
import Register from './pages/Register';
import ProdottiPronti from './pages/ProdottiPronti';
import ProdottoDettaglio from './pages/ProdottoDettaglio';
import RichiestePage from './pages/RichiestePage';
import PasswordReset from './pages/PasswordReset';
import PasswordResetConfirm from './pages/PasswordResetConfirm';
import ChiSiamo from './pages/ChiSiamo';
import ScopoDelSito from './pages/ScopoDelSito';
import LeTueIdee from './pages/LeTueIdee';
import PrivacyPolicy from './pages/PrivacyPolicy';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chi-siamo" element={<ChiSiamo />} />
          <Route path="/scopo-del-sito" element={<ScopoDelSito />} />
          <Route path="/le-tue-idee" element={<LeTueIdee />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/richieste" element={<RichiestePage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/cliente" element={<ProtectedRoute><DashboardCliente /></ProtectedRoute>} />
          <Route path="/dashboard/fornitore" element={<ProtectedRoute><DashboardFornitore /></ProtectedRoute>} />
          <Route path="/dashboard/admin" element={<ProtectedRoute><DashboardAdmin /></ProtectedRoute>} />
          <Route path="/progetto/:id" element={<ProtectedRoute><Progetto /></ProtectedRoute>} />
          <Route path="/register" element={<Register />} />
          <Route path="/prodotti-pronti" element={<ProdottiPronti />} />
          <Route path="/prodotti-pronti/:id" element={<ProdottoDettaglio />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/reset-password/:uid/:token" element={<PasswordResetConfirm />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

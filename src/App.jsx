import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../src/styles/design-tokens.css';
import '../src/styles/components.css';

import { useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppRoutes from './Routes/Router.jsx';

import Header from './components/Layout/Header.jsx';
import AuthHeader from './components/Auth/AuthHeader.jsx';
import Footer from './components/Layout/Footer.jsx';

export default function App() {
  const { pathname } = useLocation();
  const { currentUser, loading } = useAuth();

  if (loading) return null;
  const authWizardRoutes = ['/login', '/register', '/forgot-password', '/profilesetup', '/verify-email'];
  const showAuthHeader = authWizardRoutes.includes(pathname);
  // const isAuthRoute = authRoutes.includes(pathname);
  return (
    <>
      {showAuthHeader ? <AuthHeader /> : <Header />}
      <AppRoutes />
      <Footer />
    </>
  );
}

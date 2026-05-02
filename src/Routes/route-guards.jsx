// central guards so we avoid repeating logic everywhere
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ───────────────────────── PROTECTED ───────────────────────── */
export function RequireAuth() {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // while Firebase figures things out
  if (loading) return null;

  // not signed-in → bounce to login, but remember where we came from
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;       // render child routes
}


// above uncomment





















// /* ──────────────────────── GUEST-ONLY ───────────────────────── */
// export function GuestOnly() {
//   const { currentUser, loading } = useAuth();

//   if (loading) return null;
//   return currentUser ? <Navigate to="/" replace /> : <Outlet />;
// }

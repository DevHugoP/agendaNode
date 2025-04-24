import { useAuth } from '../store/auth';
import { Navigate, Outlet } from 'react-router-dom';

import { useAutoRefreshToken } from '../hooks/useAutoRefreshToken';

const ProtectedRoute = () => {
  useAutoRefreshToken();
  const { accessToken, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    // ⚠️ Tant que isAuthLoading est true, aucun composant enfant (et donc aucune requête API protégée) ne doit être monté.
    // Cela évite tout double appel à /auth/refresh-token lors du rechargement.
    // Tu peux personnaliser ce loader si besoin.
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f9f9fc'
      }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agenda-purple mb-6"></div>
        <div style={{fontWeight:'bold', fontSize:18, color:'#6c47ff'}}>Vérification de la session…</div>
        <div style={{marginTop:8, color:'#888', fontSize:14}}>Merci de patienter</div>
      </div>
    );
  }
  // Si l'utilisateur n'est pas authentifié après chargement, on redirige
  if (!isAuthLoading && !accessToken) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
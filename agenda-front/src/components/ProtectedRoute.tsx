import { useAuth } from '../store/auth';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { accessToken } = useAuth();
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;

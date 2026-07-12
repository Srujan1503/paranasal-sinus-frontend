// Guards routes that require authentication and redirects unauthenticated users.
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

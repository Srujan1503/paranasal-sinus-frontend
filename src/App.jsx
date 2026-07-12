import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './routes/ProtectedRoute';
import useAuth from './hooks/useAuth';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import History from './pages/History';
import Statistics from './pages/Statistics';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import PredictionResults from './pages/PredictionResults';
import NotFound from './pages/NotFound';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <Signup />} />
        <Route
          path="/forgot-password"
          element={user ? <Navigate to="/dashboard" replace /> : <ForgotPassword />}
        />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/history" element={<History />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/prediction-results" element={<PredictionResults />} />
        </Route>

        <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '12px',
            background: '#0f172a',
            color: '#f8fafc',
          },
        }}
      />
    </>
  );
}

export default App;

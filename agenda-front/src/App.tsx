import { Routes, Route, Navigate } from "react-router-dom";
import ClientsList from "./pages/ClientsList";
import ClientDetails from "./pages/ClientDetails";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import { useAuth } from "./store/auth";
import NotFound from './pages/NotFound';

function IndexRedirect() {
  const { token } = useAuth();
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Index />;
}
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import NewAppointment from "./pages/NewAppointment";
import UserProfile from "./pages/UserProfile";
import SmsHistory from "./pages/SmsHistory";
import { Toaster } from "sonner";

// Création du queryClient
const queryClient = new QueryClient();

// Composant pour protéger les routes
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAuth();
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  const { setToken } = useAuth();
  
  // Récupérer le token du localStorage au démarrage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, [setToken]);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors position="top-right" />
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<IndexRedirect />} />
        <Route path="/register" element={<Register />} />
        
        {/* Routes protégées */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/new-appointment" 
          element={
            <ProtectedRoute>
              <NewAppointment />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/calendar" 
          element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/sms-history" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/vouchers" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/sms"
          element={
            <ProtectedRoute>
              <SmsHistory />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/help" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        

        <Route path="/clients" element={<ClientsList />} />
        <Route path="/clients/:id" element={<ClientDetails />} />
        {/* Catch-all : si connecté → dashboard, sinon → accueil */}
        <Route path="*" element={<AuthRedirect />} />
      </Routes>
    </QueryClientProvider>
  );
}

// Redirige vers dashboard si connecté, sinon vers accueil
function AuthRedirect() {
  const { token } = useAuth();
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Navigate to="/" replace />;
}

export default App;

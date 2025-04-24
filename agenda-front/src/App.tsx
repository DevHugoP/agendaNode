import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import ClientsList from "./pages/ClientsList";
import ClientDetails from "./pages/ClientDetails";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import NewAppointment from "./pages/NewAppointment";
import UserProfile from "./pages/UserProfile";
import SmsHistory from "./pages/SmsHistory";
import { Toaster } from "sonner";

// Création du queryClient
const queryClient = new QueryClient();

import type { ReactElement } from "react";
import { useAutoRefreshToken } from "./hooks/useAutoRefreshToken";

function App(): ReactElement {
  useAutoRefreshToken(); // Auth ready avant routage
  // (plus de blocage global sur isAuthLoading)

  useAutoRefreshToken();

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors position="top-right" />
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes privées */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/appointments/new" element={<NewAppointment />} />
          <Route path="/sms-history" element={<SmsHistory />} />
          <Route path="/clients" element={<ClientsList />} />
          <Route path="/clients/:id" element={<ClientDetails />} />
          <Route path="/settings" element={<Dashboard />} />
          <Route path="/vouchers" element={<Dashboard />} />
          <Route path="/help" element={<Dashboard />} />
          <Route path="/sms" element={<SmsHistory />} />
          {/* autres routes privées ici */}
        </Route>
        {/* Catch-all: toute route non trouvée redirige vers /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;

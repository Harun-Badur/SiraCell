import { type ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from './pages/LoginPage';
import { BranchListPage } from './pages/BranchListPage';
import { BranchDetailPage } from './pages/BranchDetailPage';
import { MyTicketPage } from './pages/TicketStatusPage';
import { StaffPanelPage } from './pages/StaffPanelPage';
import { InstitutionSelectionPage } from './pages/InstitutionSelectionPage';
import { PastTicketsPage } from './pages/PastTicketsPage';
import { Navbar } from './components/Navbar';
import { FeedbackToaster } from './components/Feedback';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 10_000,
    },
  },
});

// Korumalı rota: token yoksa login'e yönlendir
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

// Personel rotası: role kontrolü için genişletilebilir
const StaffRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem('token');
  // TODO: JWT'den role parse edilerek STAFF/MANAGER/ADMIN kontrolü yapılabilir
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FeedbackToaster />
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* --- Public --- */}
              <Route path="/login" element={<LoginPage />} />

              {/* --- Müşteri Rotaları (Korumalı) --- */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <InstitutionSelectionPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/branches"
                element={
                  <ProtectedRoute>
                    <BranchListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <PastTicketsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/branch/:id"
                element={
                  <ProtectedRoute>
                    <BranchDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-ticket/:ticketId"
                element={
                  <ProtectedRoute>
                    <MyTicketPage />
                  </ProtectedRoute>
                }
              />

              {/* --- Personel Rotası --- */}
              <Route
                path="/staff"
                element={
                  <StaffRoute>
                    <StaffPanelPage />
                  </StaffRoute>
                }
              />

              {/* --- Bilinmeyen rotaları login'e at --- */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
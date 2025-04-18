import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { ProtectedRoute, PublicRoute } from "./context/ProtectedRoute";
import { MainLayout } from "./components/layout/MainLayout";
import Dashboard from "./pages/dashboard";
import LeadsPage from "./pages/LeadsPage";
import LeadProfilePage from "./pages/LeadProfilePage";
import LeadInteractionsPage from "./pages/LeadInteractionsPage";
import CalendarPage from "./pages/CalendarPage";
import CampaignsPage from "./pages/CampaignsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import TasksPage from "./pages/TasksPage";
import SettingsPage from "./pages/SettingsPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SIgnupPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
          <Route path="/" element={<ProtectedRoute><MainLayout><Outlet /></MainLayout></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="leads/:id" element={<LeadProfilePage />} />
            <Route path="leads/:id/interactions" element={<LeadInteractionsPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="campaigns" element={<CampaignsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="admin" element={<ProtectedRoute requiredRole="admin"><AdminPage /></ProtectedRoute>} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;

import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProfilePage from '@/pages/ProfilePage';
import EditProfilePage from '@/pages/EditProfilePage';
import SettingsPage from '@/pages/SettingsPage';
import SecurityPage from '@/pages/SecurityPage';
import NotificationsPage from '@/pages/NotificationsPage';
import WalletPage from '@/pages/WalletPage';
import PaymentMethodsPage from '@/pages/PaymentMethodsPage';
import HelpPage from '@/pages/HelpPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import AdminAuthPage from '@/pages/AdminAuthPage';
import ProviderModePage from '@/pages/ProviderModePage';
import OnboardingPage from '@/pages/OnboardingPage';
import ServiceDetail from '@/pages/ServiceDetail';
import SearchPage from '@/pages/SearchPage';
import ChatPage from '@/pages/ChatPage';
import BookingsPage from '@/pages/BookingsPage';
import Layout from '@/components/Layout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import './App.css';

const queryClient = new QueryClient();

// Pages that should not have the bottom navigation
const noBottomNavPages = ['/login', '/register', '/onboarding', '/admin'];

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-container">
        <Routes>
          {/* Pages without bottom navigation */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/admin" element={<AdminAuthPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
          
          {/* Pages with bottom navigation */}
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
          <Route path="/profile/edit" element={<Layout><EditProfilePage /></Layout>} />
          <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
          <Route path="/security" element={<Layout><SecurityPage /></Layout>} />
          <Route path="/notifications" element={<Layout><NotificationsPage /></Layout>} />
          <Route path="/wallet" element={<Layout><WalletPage /></Layout>} />
          <Route path="/payment-methods" element={<Layout><PaymentMethodsPage /></Layout>} />
          <Route path="/help" element={<Layout><HelpPage /></Layout>} />
          <Route path="/provider" element={<Layout><ProviderModePage /></Layout>} />
          <Route path="/service/:id" element={<Layout><ServiceDetail /></Layout>} />
          <Route path="/search" element={<Layout><SearchPage /></Layout>} />
          <Route path="/chat" element={<Layout><ChatPage /></Layout>} />
          <Route path="/bookings" element={<Layout><BookingsPage /></Layout>} />
        </Routes>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;


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
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/payment-methods" element={<PaymentMethodsPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/provider" element={<ProviderModePage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/bookings" element={<Layout><BookingsPage /></Layout>} />
        </Routes>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

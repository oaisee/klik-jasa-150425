
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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from './providers/ThemeProvider';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
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
          </Routes>
        </div>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

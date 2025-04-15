
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ServiceDetail from "./pages/ServiceDetail";
import WalletPage from "./pages/WalletPage";
import BookingConfirmation from "./pages/BookingConfirmation";
import CreateService from "./pages/CreateService";
import SearchPage from "./pages/SearchPage";
import BookingsPage from "./pages/BookingsPage";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import Layout from "./components/Layout";
import NotificationsPage from "./pages/NotificationsPage";
import SecurityPage from "./pages/SecurityPage";
import PaymentMethodsPage from "./pages/PaymentMethodsPage";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";
import EditProfilePage from "./pages/EditProfilePage";
import ProviderModePage from "./pages/ProviderModePage";
import SplashScreen from "./components/SplashScreen";
import OnboardingPage from "./pages/OnboardingPage";

const App = () => {
  // Create a new QueryClient instance inside the component
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/splash" element={<SplashScreen />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/search" element={<Layout><SearchPage /></Layout>} />
            <Route path="/bookings" element={<Layout><BookingsPage /></Layout>} />
            <Route path="/chat" element={<Layout><ChatPage /></Layout>} />
            <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
            <Route path="/service/:id" element={<Layout><ServiceDetail /></Layout>} />
            <Route path="/wallet" element={<Layout><WalletPage /></Layout>} />
            <Route path="/booking-confirmation/:id" element={<Layout><BookingConfirmation /></Layout>} />
            <Route path="/create-service" element={<Layout><CreateService /></Layout>} />
            <Route path="/notifications" element={<Layout><NotificationsPage /></Layout>} />
            <Route path="/security" element={<Layout><SecurityPage /></Layout>} />
            <Route path="/payment-methods" element={<Layout><PaymentMethodsPage /></Layout>} />
            <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
            <Route path="/help" element={<Layout><HelpPage /></Layout>} />
            <Route path="/edit-profile" element={<Layout><EditProfilePage /></Layout>} />
            <Route path="/provider-mode" element={<Layout><ProviderModePage /></Layout>} />
            <Route path="*" element={<NotFound />} />
            {/* Default route redirecting to splash screen */}
            <Route index element={<Navigate to="/splash" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

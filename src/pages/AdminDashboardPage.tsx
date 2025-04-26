
import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminDashboardLayout from '@/components/admin/layout/AdminDashboardLayout';
import AdminMobileTabsHeader from '@/components/admin/layout/AdminMobileTabsHeader';
import AdminTabsContent from '@/components/admin/AdminTabsContent';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AdminDashboardPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const tabParam = searchParams.get('tab');
  
  const [activeTab, setActiveTab] = useState(tabParam || 'dashboard');
  
  const { 
    connectionStatus, 
    loading, 
    refreshing, 
    handleSignOut, 
    handleRefresh 
  } = useAdminAuth();
  
  // Update active tab when URL parameters change
  useEffect(() => {
    console.log('URL changed, tabParam:', tabParam);
    if (tabParam) {
      console.log('Setting active tab to:', tabParam);
      setActiveTab(tabParam);
    } else if (location.pathname === '/admin-dashboard' && !tabParam) {
      // Default to dashboard tab if no tab parameter is provided
      navigate('/admin-dashboard?tab=dashboard', { replace: true });
    }
  }, [tabParam, location, navigate]);
  
  // Handle tab changes
  const handleTabChange = (tab: string) => {
    console.log('handleTabChange called with tab:', tab);
    setActiveTab(tab);
    navigate(`/admin-dashboard?tab=${tab}`);
  };
  
  useEffect(() => {
    // Check connection status on mount
    if (connectionStatus && !connectionStatus.success) {
      toast.error("Koneksi ke database bermasalah");
    }
  }, [connectionStatus]);
  
  console.log('AdminDashboardPage rendering with activeTab:', activeTab);
  
  return (
    <AdminDashboardLayout
      isLoading={loading}
      refreshing={refreshing}
      activeTab={activeTab}
      setActiveTab={handleTabChange}
      onRefresh={handleRefresh}
      onSignOut={handleSignOut}
    >
      {/* Mobile tabs header - visible on mobile only */}
      <AdminMobileTabsHeader 
        activeTab={activeTab} 
        setActiveTab={handleTabChange}
        handleSignOut={handleSignOut}
      />
      
      {/* Content area with tabs */}
      <AdminTabsContent 
        activeTab={activeTab} 
        connectionStatus={connectionStatus} 
      />
    </AdminDashboardLayout>
  );
};

export default AdminDashboardPage;


import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminDashboardLayout from '@/components/admin/layout/AdminDashboardLayout';
import AdminMobileTabsHeader from '@/components/admin/layout/AdminMobileTabsHeader';
import AdminTabsContent from '@/components/admin/layout/AdminTabsContent';
import { useSearchParams } from 'react-router-dom';

const AdminDashboardPage = () => {
  const [searchParams] = useSearchParams();
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
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  
  return (
    <AdminDashboardLayout
      isLoading={loading}
      refreshing={refreshing}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onRefresh={handleRefresh}
      onSignOut={handleSignOut}
    >
      {/* Mobile tabs header - visible on mobile only */}
      <AdminMobileTabsHeader 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
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


import { useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminDashboardLayout from '@/components/admin/layout/AdminDashboardLayout';
import AdminMobileTabsHeader from '@/components/admin/layout/AdminMobileTabsHeader';
import AdminTabsContent from '@/components/admin/layout/AdminTabsContent';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { 
    connectionStatus, 
    loading, 
    refreshing, 
    handleSignOut, 
    handleRefresh 
  } = useAdminAuth();
  
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

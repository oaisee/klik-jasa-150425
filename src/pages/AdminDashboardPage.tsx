
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, checkSupabaseConnection } from '@/integrations/supabase/client';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Import refactored components
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminMobileHeader from '@/components/admin/AdminMobileHeader';
import AdminDashboardContent from '@/components/admin/AdminDashboardContent';
import AdminTabContents from '@/components/admin/AdminTabContents';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [connectionStatus, setConnectionStatus] = useState<{success: boolean, message: string} | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    document.title = 'KlikJasa Admin Dashboard';
    
    // Check user authentication
    const checkAdmin = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      
      if (!data.session || data.session.user?.email !== 'admin@klikjasa.com') {
        toast.error("Akses tidak diizinkan");
        navigate('/admin');
        return;
      }
      
      // Check Supabase connection
      const status = await checkSupabaseConnection();
      setConnectionStatus(status);
      setLoading(false);
    };
    
    checkAdmin();
  }, [navigate]);
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logout berhasil");
      navigate('/login');
    } catch (error) {
      toast.error("Gagal logout");
      console.error('Error signing out:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-marketplace-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Mobile Header */}
      <AdminMobileHeader 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        handleSignOut={handleSignOut}
      />
      
      {/* Main Content */}
      <div className="flex-1 md:p-8 p-4 md:pt-8 pt-28">
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="dashboard">
            <AdminDashboardContent connectionStatus={connectionStatus} />
          </TabsContent>
          
          <TabsContent value="users">
            <AdminTabContents activeTab="users" />
          </TabsContent>
          
          <TabsContent value="services">
            <AdminTabContents activeTab="services" />
          </TabsContent>
          
          <TabsContent value="transactions">
            <AdminTabContents activeTab="transactions" />
          </TabsContent>
          
          <TabsContent value="settings">
            <AdminTabContents activeTab="settings" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

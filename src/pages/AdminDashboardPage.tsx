
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, checkSupabaseConnection } from '@/integrations/supabase/client';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { RefreshCw, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LoadingIndicator from '@/components/shared/LoadingIndicator';

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
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
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
    
    // Handle responsive sidebar
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    // Set initial sidebar state based on screen size
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
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
  
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Check Supabase connection
      const status = await checkSupabaseConnection();
      setConnectionStatus(status);
      toast.success("Data berhasil disegarkan");
    } catch (error) {
      toast.error("Gagal menyegarkan data");
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <LoadingIndicator size="lg" text="Memuat dashboard admin..." />
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar - only visible on md and up when sidebarOpen is true */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                        md:translate-x-0 fixed md:relative z-30 transform transition-transform duration-300 ease-in-out h-full`}>
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-gray-800 bg-opacity-50 z-20"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top navbar */}
        <div className="bg-white border-b border-gray-200 flex items-center justify-between p-4 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="md:hidden"
            >
              <Menu />
            </Button>
            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">KlikJasa Admin Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              disabled={refreshing}
              className="flex items-center gap-1"
            >
              <RefreshCw size={16} className={`${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{refreshing ? 'Menyegarkan...' : 'Segarkan Data'}</span>
            </Button>
            
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleSignOut}
              className="flex items-center gap-1"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        </div>
        
        {/* Mobile tabs header - visible on mobile only */}
        <div className="md:hidden px-4 py-2 bg-white border-b border-gray-200">
          <AdminMobileHeader 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            handleSignOut={handleSignOut}
          />
        </div>
        
        {/* Content area */}
        <div className="flex-1 overflow-auto p-4 pb-16">
          <Tabs value={activeTab} className="w-full">
            <TabsContent value="dashboard" className="mt-0">
              <AdminDashboardContent connectionStatus={connectionStatus} />
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-0">
              <AdminTabContents activeTab="analytics" />
            </TabsContent>
            
            <TabsContent value="users" className="mt-0">
              <AdminTabContents activeTab="users" />
            </TabsContent>
            
            <TabsContent value="services" className="mt-0">
              <AdminTabContents activeTab="services" />
            </TabsContent>
            
            <TabsContent value="transactions" className="mt-0">
              <AdminTabContents activeTab="transactions" />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0">
              <AdminTabContents activeTab="settings" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

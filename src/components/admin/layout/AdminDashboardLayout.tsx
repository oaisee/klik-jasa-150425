
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, LogOut, RefreshCw } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import { toast } from 'sonner';

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
  isLoading: boolean;
  refreshing: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRefresh: () => Promise<void>;
  onSignOut: () => Promise<void>;
}

const AdminDashboardLayout = ({
  children,
  isLoading,
  refreshing,
  activeTab,
  setActiveTab,
  onRefresh,
  onSignOut
}: AdminDashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  useEffect(() => {
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
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  if (isLoading) {
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
              onClick={onRefresh} 
              disabled={refreshing}
              className="flex items-center gap-1"
            >
              <RefreshCw size={16} className={`${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{refreshing ? 'Menyegarkan...' : 'Segarkan Data'}</span>
            </Button>
            
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={onSignOut}
              className="flex items-center gap-1"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        </div>
        
        {/* Content */}
        {children}
      </div>
    </div>
  );
};

export default AdminDashboardLayout;

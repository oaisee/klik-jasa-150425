
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, checkSupabaseConnection } from '@/integrations/supabase/client';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Briefcase, 
  Settings, 
  LogOut, 
  AlertCircle,
  CheckCircle2,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [connectionStatus, setConnectionStatus] = useState<{success: boolean, message: string} | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    document.title = 'KlikJasa Admin Dashboard';
    
    // Check Supabase connection
    const checkConnection = async () => {
      setLoading(true);
      const status = await checkSupabaseConnection();
      setConnectionStatus(status);
      setLoading(false);
    };
    
    checkConnection();
  }, []);
  
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
  
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-4 flex items-center space-x-2">
          <img
            src="/lovable-uploads/3e7ce3dd-6c4b-47e9-971d-7483e3d4ab64.png"
            alt="KlikJasa Logo"
            className="w-10 h-10"
          />
          <h1 className="text-xl font-bold text-marketplace-primary">KlikJasa Admin</h1>
        </div>
        
        <Separator />
        
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <li>
              <Button
                variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('dashboard')}
              >
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Dashboard
              </Button>
            </li>
            <li>
              <Button
                variant={activeTab === 'users' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('users')}
              >
                <Users className="mr-2 h-5 w-5" />
                Pengguna
              </Button>
            </li>
            <li>
              <Button
                variant={activeTab === 'services' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('services')}
              >
                <Briefcase className="mr-2 h-5 w-5" />
                Layanan
              </Button>
            </li>
            <li>
              <Button
                variant={activeTab === 'transactions' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('transactions')}
              >
                <FileText className="mr-2 h-5 w-5" />
                Transaksi
              </Button>
            </li>
            <li>
              <Button
                variant={activeTab === 'settings' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="mr-2 h-5 w-5" />
                Pengaturan
              </Button>
            </li>
          </ul>
        </nav>
        
        <div className="p-4">
          <Button
            variant="outline"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Keluar
          </Button>
        </div>
      </div>
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img
              src="/lovable-uploads/3e7ce3dd-6c4b-47e9-971d-7483e3d4ab64.png"
              alt="KlikJasa Logo"
              className="w-8 h-8"
            />
            <h1 className="text-lg font-bold text-marketplace-primary">KlikJasa Admin</h1>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5 text-red-500" />
          </Button>
        </div>
        
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="dashboard" onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard className="h-5 w-5" />
          </TabsTrigger>
          <TabsTrigger value="users" onClick={() => setActiveTab('users')}>
            <Users className="h-5 w-5" />
          </TabsTrigger>
          <TabsTrigger value="services" onClick={() => setActiveTab('services')}>
            <Briefcase className="h-5 w-5" />
          </TabsTrigger>
          <TabsTrigger value="transactions" onClick={() => setActiveTab('transactions')}>
            <FileText className="h-5 w-5" />
          </TabsTrigger>
          <TabsTrigger value="settings" onClick={() => setActiveTab('settings')}>
            <Settings className="h-5 w-5" />
          </TabsTrigger>
        </TabsList>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 md:p-8 p-4 md:pt-8 pt-28">
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="dashboard" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Dashboard</h2>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            {/* Connection Status */}
            {connectionStatus && (
              <Alert variant={connectionStatus.success ? "default" : "destructive"}>
                <div className="flex items-center">
                  {connectionStatus.success ? (
                    <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mr-2" />
                  )}
                  <AlertTitle>
                    {connectionStatus.success ? "Supabase Terhubung" : "Koneksi Supabase Gagal"}
                  </AlertTitle>
                </div>
                <AlertDescription className="mt-2">
                  {connectionStatus.message}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={<Users className="h-8 w-8 text-blue-500" />}
                title="Total Pengguna"
                value="128"
                trend="+12% dari bulan lalu"
                trendPositive={true}
              />
              <StatCard
                icon={<Briefcase className="h-8 w-8 text-green-500" />}
                title="Layanan Aktif"
                value="85"
                trend="+7% dari bulan lalu"
                trendPositive={true}
              />
              <StatCard
                icon={<FileText className="h-8 w-8 text-purple-500" />}
                title="Transaksi Bulan Ini"
                value="36"
                trend="-3% dari bulan lalu"
                trendPositive={false}
              />
              <StatCard
                icon={<Database className="h-8 w-8 text-amber-500" />}
                title="Total Komisi"
                value="Rp 2.4jt"
                trend="+18% dari bulan lalu"
                trendPositive={true}
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Aktivitas Terbaru</CardTitle>
                  <CardDescription>10 transaksi terakhir pada platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <ActivityItem
                      type="booking"
                      title="Booking Baru"
                      description="Ahmad membooking Jasa Bersih Rumah"
                      time="10 menit lalu"
                    />
                    <ActivityItem
                      type="registration"
                      title="Pengguna Baru"
                      description="Budi mendaftar sebagai penyedia jasa"
                      time="45 menit lalu"
                    />
                    <ActivityItem
                      type="booking"
                      title="Booking Baru"
                      description="Siti membooking Jasa Memasak"
                      time="2 jam lalu"
                    />
                    <ActivityItem
                      type="service"
                      title="Layanan Baru"
                      description="Joko menambahkan Jasa Perbaikan AC"
                      time="5 jam lalu"
                    />
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Lihat Semua Aktivitas</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Layanan Populer</CardTitle>
                  <CardDescription>Berdasarkan jumlah booking</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <PopularServiceItem
                      title="Jasa Bersih Rumah"
                      provider="Bersih Express"
                      bookings={42}
                      rating={4.8}
                    />
                    <PopularServiceItem
                      title="Perbaikan AC"
                      provider="TeknikPro"
                      bookings={38}
                      rating={4.6}
                    />
                    <PopularServiceItem
                      title="Tukang Ledeng"
                      provider="Pipa Jaya"
                      bookings={35}
                      rating={4.7}
                    />
                    <PopularServiceItem
                      title="Tukang Masak"
                      provider="Chef Rumahan"
                      bookings={31}
                      rating={4.9}
                    />
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Lihat Semua Layanan</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Manajemen Pengguna</CardTitle>
                <CardDescription>Kelola pengguna dan penyedia jasa di platform KlikJasa</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-gray-500">Konten manajemen pengguna akan ditampilkan di sini.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Manajemen Layanan</CardTitle>
                <CardDescription>Kelola semua layanan yang terdaftar di platform KlikJasa</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-gray-500">Konten manajemen layanan akan ditampilkan di sini.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Manajemen Transaksi</CardTitle>
                <CardDescription>Kelola semua transaksi yang terjadi di platform KlikJasa</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-gray-500">Konten manajemen transaksi akan ditampilkan di sini.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan</CardTitle>
                <CardDescription>Kelola pengaturan platform KlikJasa</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-gray-500">Konten pengaturan akan ditampilkan di sini.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Komponen pendukung
const StatCard = ({ icon, title, value, trend, trendPositive }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className="p-2 bg-gray-100 rounded-md">
            {icon}
          </div>
        </div>
        <p className={`text-xs mt-2 ${trendPositive ? 'text-green-500' : 'text-red-500'}`}>
          {trend}
        </p>
      </CardContent>
    </Card>
  );
};

const ActivityItem = ({ type, title, description, time }) => {
  const getBgColor = () => {
    switch (type) {
      case 'booking': return 'bg-blue-100 text-blue-500';
      case 'registration': return 'bg-green-100 text-green-500';
      case 'service': return 'bg-purple-100 text-purple-500';
      default: return 'bg-gray-100 text-gray-500';
    }
  };
  
  const getIcon = () => {
    switch (type) {
      case 'booking': return <FileText className="h-4 w-4" />;
      case 'registration': return <Users className="h-4 w-4" />;
      case 'service': return <Briefcase className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };
  
  return (
    <li className="flex items-start space-x-3">
      <div className={`p-2 rounded-full ${getBgColor()}`}>
        {getIcon()}
      </div>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <p className="text-xs text-gray-400">{time}</p>
    </li>
  );
};

const PopularServiceItem = ({ title, provider, bookings, rating }) => {
  return (
    <li className="flex items-center space-x-3">
      <div className="p-2 bg-gray-100 rounded-md">
        <Briefcase className="h-5 w-5 text-marketplace-primary" />
      </div>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">oleh {provider}</p>
      </div>
      <div className="text-right">
        <p className="font-medium">{bookings} booking</p>
        <p className="text-sm text-yellow-500">★ {rating}</p>
      </div>
    </li>
  );
};

export default AdminDashboardPage;

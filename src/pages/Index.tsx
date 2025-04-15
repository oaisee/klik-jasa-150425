
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SearchBar from '@/components/SearchBar';
import CategoryList from '@/components/CategoryList';
import ServicesList from '@/components/ServicesList';
import Layout from '@/components/Layout';
import SplashScreen from '@/components/SplashScreen';
import { Wallet, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Define mock services data
const mockServices = [
  {
    id: '1',
    image: '/placeholder.svg',
    title: 'Cleaning Service',
    providerName: 'Budi Santoso',
    rating: 4.8,
    price: 150000,
    distance: 0.8,
  },
  {
    id: '2',
    image: '/placeholder.svg',
    title: 'Plumbing Repair',
    providerName: 'Ahmad Wijaya',
    rating: 4.5,
    price: 200000,
    distance: 1.2,
  },
  {
    id: '3',
    image: '/placeholder.svg',
    title: 'Electrical Service',
    providerName: 'Siti Rahayu',
    rating: 4.7,
    price: 250000,
    distance: 1.5,
  },
  {
    id: '4',
    image: '/placeholder.svg',
    title: 'Home Painting',
    providerName: 'Dewi Kusuma',
    rating: 4.6,
    price: 300000,
    distance: 2.0,
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [nearbyServices, setNearbyServices] = useState(mockServices);

  useEffect(() => {
    document.title = 'KlikJasa - Temukan Penyedia Jasa Terbaik';
    
    // Check authentication status and get profile data
    const checkAuthAndGetProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setIsAuthenticated(true);
          console.info("Index page auth check: Authenticated");
          
          // Get user profile including wallet balance
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('wallet_balance')
            .eq('id', session.user.id)
            .single();
          
          if (error) throw error;
          
          if (profile) {
            setWalletBalance(profile.wallet_balance);
          }
          
          // Check for notifications (placeholder for real notification system)
          // This could be replaced with a real notification check from the database
          setHasNotifications(true);
        } else {
          console.info("Index page auth check: Not authenticated");
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthAndGetProfile();
  }, []);

  // Handle notification click
  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  // Handle wallet click
  const handleWalletClick = () => {
    navigate('/wallet');
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Layout>
      <div className="px-4 py-5 animate-fade-in">
        <div className="flex items-center mb-6">
          <h1 className="text-xl font-bold flex-1">KlikJasa</h1>
          
          {isAuthenticated && (
            <div className="flex items-center">
              <div 
                className="flex items-center mr-5 text-marketplace-primary cursor-pointer"
                onClick={handleWalletClick}
              >
                <Wallet className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">
                  Rp {walletBalance?.toLocaleString('id-ID') ?? '0'}
                </span>
              </div>
              
              <div 
                className="relative cursor-pointer"
                onClick={handleNotificationClick}
              >
                <Bell className="h-6 w-6 text-gray-600" />
                {hasNotifications && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-white">
                    <span className="sr-only">Notifications</span>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="mb-7">
          <SearchBar />
        </div>
        
        <div className="mb-8">
          <CategoryList />
        </div>
        
        <ServicesList services={nearbyServices} title="Penyedia Jasa Terdekat" />
      </div>
    </Layout>
  );
};

export default Index;

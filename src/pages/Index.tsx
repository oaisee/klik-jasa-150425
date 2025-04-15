
import React, { useEffect, useState } from 'react';
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
import { categories } from '@/components/CategoryList';

// Define mock services data
const mockServices = [{
  id: '1',
  image: '/placeholder.svg',
  title: 'Cleaning Service',
  providerName: 'Budi Santoso',
  rating: 4.8,
  price: 150000,
  distance: 0.8,
  category: 'Kebersihan'
}, {
  id: '2',
  image: '/placeholder.svg',
  title: 'Plumbing Repair',
  providerName: 'Ahmad Wijaya',
  rating: 4.5,
  price: 200000,
  distance: 1.2,
  category: 'Perbaikan'
}, {
  id: '3',
  image: '/placeholder.svg',
  title: 'Electrical Service',
  providerName: 'Siti Rahayu',
  rating: 4.7,
  price: 250000,
  distance: 1.5,
  category: 'Perbaikan'
}, {
  id: '4',
  image: '/placeholder.svg',
  title: 'Home Painting',
  providerName: 'Dewi Kusuma',
  rating: 4.6,
  price: 300000,
  distance: 2.0,
  category: 'Kreatif'
}, {
  id: '5',
  image: '/placeholder.svg',
  title: 'Kursus Matematika',
  providerName: 'Arief Wibowo',
  rating: 4.9,
  price: 350000,
  distance: 1.7,
  category: 'Pendidikan'
}, {
  id: '6',
  image: '/placeholder.svg',
  title: 'Jasa Angkut Barang',
  providerName: 'Joko Susilo',
  rating: 4.3,
  price: 175000,
  distance: 3.0,
  category: 'Transportasi'
}];

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [services, setServices] = useState(mockServices);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = 'KlikJasa - Temukan Penyedia Jasa Terbaik';

    // Check authentication status and get profile data
    const checkAuthAndGetProfile = async () => {
      try {
        const {
          data: {
            session
          }
        } = await supabase.auth.getSession();
        if (session) {
          setIsAuthenticated(true);
          console.info("Index page auth check: Authenticated");

          // Get user profile including wallet balance
          const {
            data: profile,
            error
          } = await supabase.from('profiles').select('wallet_balance').eq('id', session.user.id).single();
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

  useEffect(() => {
    // Filter services based on selected category and search query
    let filtered = mockServices;
    
    if (selectedCategory) {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        service => 
          service.title.toLowerCase().includes(query) || 
          service.providerName.toLowerCase().includes(query) ||
          service.category.toLowerCase().includes(query)
      );
    }
    
    setServices(filtered);
  }, [selectedCategory, searchQuery]);

  // Handle notification click
  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  // Handle wallet click
  const handleWalletClick = () => {
    navigate('/wallet');
  };
  
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(prevCategory => prevCategory === category ? null : category);
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const getServicesTitle = () => {
    if (selectedCategory) {
      return `Layanan ${selectedCategory}`;
    }
    if (searchQuery) {
      return `Hasil Pencarian: "${searchQuery}"`;
    }
    return "Penyedia Jasa Terdekat";
  };
  
  if (isLoading) {
    return <SplashScreen />;
  }
  
  return <Layout>
      <div className="px-4 py-5 animate-fade-in">
        <div className="flex items-center mb-6">
          <div className="flex items-center flex-1">
            <img src="/lovable-uploads/3e7ce3dd-6c4b-47e9-971d-7483e3d4ab64.png" alt="KlikJasa Logo" className="h-8 w-8 mr-3" />
            <h1 className="text-marketplace-primary text-left text-xl font-extrabold">KlikJasa</h1>
          </div>
          
          {isAuthenticated && <div className="flex items-center">
              <div className="flex items-center mr-5 text-marketplace-primary cursor-pointer" onClick={handleWalletClick}>
                <Wallet className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">
                  Rp {walletBalance?.toLocaleString('id-ID') ?? '0'}
                </span>
              </div>
              
              <div className="relative cursor-pointer" onClick={handleNotificationClick}>
                <Bell className="h-6 w-6 text-gray-600" />
                {hasNotifications && <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-white">
                    <span className="sr-only">Notifications</span>
                  </Badge>}
              </div>
            </div>}
        </div>
        
        <div className="mb-7">
          <SearchBar onSearch={handleSearch} placeholder="Cari layanan atau penyedia..." />
        </div>
        
        <div className="mb-8">
          <CategoryList onCategoryClick={handleCategoryClick} />
        </div>
        
        <ServicesList services={services} title={getServicesTitle()} />
      </div>
    </Layout>;
};
export default Index;

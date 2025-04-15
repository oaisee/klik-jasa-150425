
import { Wallet, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface HomeHeaderProps {
  isAuthenticated: boolean;
  walletBalance: number | null;
  hasNotifications: boolean;
}

const HomeHeader = ({ isAuthenticated, walletBalance, hasNotifications }: HomeHeaderProps) => {
  const navigate = useNavigate();
  
  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  const handleWalletClick = () => {
    navigate('/wallet');
  };
  
  return (
    <div className="flex items-center mb-6">
      <div className="flex items-center flex-1">
        <img src="/lovable-uploads/3e7ce3dd-6c4b-47e9-971d-7483e3d4ab64.png" alt="KlikJasa Logo" className="h-8 w-8 mr-3" />
        <h1 className="text-marketplace-primary text-left text-xl font-extrabold">KlikJasa</h1>
      </div>
      
      {isAuthenticated && (
        <div className="flex items-center">
          <div className="flex items-center mr-5 text-marketplace-primary cursor-pointer" onClick={handleWalletClick}>
            <Wallet className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">
              Rp {walletBalance?.toLocaleString('id-ID') ?? '0'}
            </span>
          </div>
          
          <div className="relative cursor-pointer" onClick={handleNotificationClick}>
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
  );
};

export default HomeHeader;

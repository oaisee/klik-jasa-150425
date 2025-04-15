
import { useState } from 'react';
import VerificationStatsWidget from './VerificationStatsWidget';
import VerificationRequestsList from './VerificationRequestsList';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const VerificationDashboard = () => {
  const [refreshing, setRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    // This will trigger useEffect in both child components
    // We just need a delay to show the refresh animation
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Verifikasi Pengguna</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="flex items-center gap-1"
        >
          <RefreshCw size={16} className={`${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Menyegarkan...' : 'Segarkan Data'}</span>
        </Button>
      </div>
      
      <VerificationStatsWidget />
      
      <VerificationRequestsList />
    </div>
  );
};

export default VerificationDashboard;

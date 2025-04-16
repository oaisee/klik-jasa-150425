
import { useState } from 'react';
import VerificationStatsWidget from './VerificationStatsWidget';
import VerificationRequestsList from './VerificationRequestsList';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const VerificationDashboard = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [statsKey, setStatsKey] = useState(Date.now());
  const [requestsKey, setRequestsKey] = useState(Date.now());
  
  const handleRefresh = async () => {
    setRefreshing(true);
    // Update keys to force re-render of child components
    setStatsKey(Date.now());
    setRequestsKey(Date.now());
    
    // Simulate delay to show the refresh animation
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
      
      <VerificationStatsWidget key={`stats-${statsKey}`} />
      
      <VerificationRequestsList key={`requests-${requestsKey}`} />
    </div>
  );
};

export default VerificationDashboard;

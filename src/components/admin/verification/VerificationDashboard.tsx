
import { useState, useEffect } from 'react';
import DashboardHeader from './components/DashboardHeader';
import VerificationStatsWidget from './VerificationStatsWidget';
import VerificationRequestsList from './VerificationRequestsList';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const VerificationDashboard = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [statsKey, setStatsKey] = useState(Date.now());
  const [requestsKey, setRequestsKey] = useState(Date.now());
  
  console.log('VerificationDashboard rendering');
  
  const checkVerificationRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('verification_requests')
        .select('status')
        .eq('status', 'pending');
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        toast.info(`${data.length} permintaan verifikasi menunggu review`);
      }
    } catch (err) {
      console.error('Error checking verification requests:', err);
    }
  };
  
  useEffect(() => {
    console.log('VerificationDashboard mounted - triggering initial refresh');
    handleRefresh();
    checkVerificationRequests();
  }, []);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    // Update keys to force re-render of child components
    setStatsKey(Date.now());
    setRequestsKey(Date.now());
    
    try {
      await checkVerificationRequests();
    } catch (error) {
      console.error('Error refreshing verification dashboard:', error);
    } finally {
      // Add a small delay to show the refresh animation
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    }
  };
  
  return (
    <div className="space-y-4">
      <DashboardHeader 
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
      
      <VerificationStatsWidget key={`stats-${statsKey}`} />
      
      <VerificationRequestsList key={`requests-${requestsKey}`} />
    </div>
  );
};

export default VerificationDashboard;

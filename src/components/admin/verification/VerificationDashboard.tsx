
import { useState, useEffect } from 'react';
import DashboardHeader from './components/DashboardHeader';
import VerificationStatsWidget from './VerificationStatsWidget';
import VerificationRequestsList from './VerificationRequestsList';

const VerificationDashboard = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [statsKey, setStatsKey] = useState(Date.now());
  const [requestsKey, setRequestsKey] = useState(Date.now());
  
  console.log('VerificationDashboard rendering');
  
  // Force refresh on mount to ensure data is loaded
  useEffect(() => {
    console.log('VerificationDashboard mounted - triggering initial refresh');
    handleRefresh();
  }, []);
  
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

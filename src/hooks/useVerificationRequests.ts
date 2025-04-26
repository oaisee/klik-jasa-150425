
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { VerificationRequest } from '@/types/database';

export const useVerificationRequests = () => {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Define fetchVerificationRequests as useCallback to prevent unnecessary recreation
  const fetchVerificationRequests = useCallback(async (showToasts = true) => {
    if (refreshing) return; // Prevent multiple simultaneous fetches
    
    showToasts ? setRefreshing(true) : null;
    setLoading(loading && showToasts); // Only show loading state on initial load or manual refresh
    
    try {
      console.log('Fetching verification requests');
      
      // Join with profiles table to get user data
      const { data, error } = await supabase
        .from('verification_requests')
        .select(`
          *,
          profile:profiles(id, full_name, phone)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching verification requests:', error);
        throw error;
      }
      
      console.log('Verification requests fetched successfully:', data?.length || 0, 'records');
      if (data && data.length > 0) {
        console.log('Sample verification request:', data[0]);
      } else {
        console.log('No verification requests found');
      }
      
      // Map the data to match VerificationRequest type
      const mappedRequests = (data || []).map(req => ({
        ...req,
        profile: req.profile || undefined
      }));

      setRequests(mappedRequests as VerificationRequest[]);
      setFilteredRequests(mappedRequests as VerificationRequest[]);
      
      if (showToasts && mappedRequests.length > 0) {
        toast.success(`${mappedRequests.length} permintaan verifikasi dimuat`);
      }
    } catch (error) {
      console.error('Error in fetchVerificationRequests:', error);
      if (showToasts) {
        toast.error('Gagal memuat permintaan verifikasi');
      }
    } finally {
      setLoading(false);
      if (showToasts) {
        setRefreshing(false);
      } else {
        setTimeout(() => setRefreshing(false), 500); // Small delay to prevent UI flicker on silent refresh
      }
    }
  }, [refreshing, loading]);

  useEffect(() => {
    console.log('useVerificationRequests hook initialized');
    fetchVerificationRequests();

    // Set up periodic refresh every 30 seconds
    const intervalId = setInterval(() => {
      console.log('Auto-refreshing verification requests');
      fetchVerificationRequests(false); // Silent refresh (no toasts)
    }, 30000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [fetchVerificationRequests]);

  useEffect(() => {
    filterRequests();
  }, [searchQuery, statusFilter, requests]);

  const filterRequests = () => {
    let filtered = [...requests];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === statusFilter);
    }
    
    // Apply search filter (case insensitive)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(req => 
        (req.profile?.full_name?.toLowerCase().includes(query) || false) ||
        (req.profile?.phone?.toLowerCase().includes(query) || false)
      );
    }
    
    setFilteredRequests(filtered);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchVerificationRequests();
    } catch (error) {
      console.error('Error refreshing verification requests:', error);
      toast.error('Gagal menyegarkan data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      console.log('Approving verification request:', id);
      
      // Find the request to get user_id
      const requestData = requests.find(req => req.id === id);
      if (!requestData) {
        console.error('Request not found:', id);
        throw new Error('Request not found');
      }
      
      console.log('Request data found:', requestData);

      // Update verification status to approved
      const { error: verificationError } = await supabase
        .from('verification_requests')
        .update({ 
          status: 'approved', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (verificationError) {
        console.error('Error updating verification status:', verificationError);
        throw verificationError;
      }
      
      console.log('Verification status updated successfully');

      // Update profile table to mark user as provider
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_provider: true })
        .eq('id', requestData.user_id);

      if (profileError) {
        console.error('Error updating user profile:', profileError);
        throw profileError;
      }
      
      console.log('User profile updated successfully');

      toast.success('Verifikasi berhasil disetujui');
      fetchVerificationRequests(); // Refresh the list
    } catch (error) {
      console.error('Error approving verification:', error);
      toast.error('Gagal menyetujui verifikasi');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string, notes?: string) => {
    setProcessingId(id);
    try {
      console.log('Rejecting verification request:', id);
      
      const { error } = await supabase
        .from('verification_requests')
        .update({ 
          status: 'rejected', 
          notes: notes || null,
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) {
        console.error('Error rejecting verification:', error);
        throw error;
      }
      
      console.log('Verification rejected successfully');
      
      toast.success('Verifikasi berhasil ditolak');
      fetchVerificationRequests(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting verification:', error);
      toast.error('Gagal menolak verifikasi');
    } finally {
      setProcessingId(null);
    }
  };

  return {
    requests,
    filteredRequests,
    loading,
    refreshing,
    processingId,
    searchQuery,
    statusFilter,
    setSearchQuery,
    setStatusFilter,
    handleRefresh,
    handleApprove,
    handleReject,
    hasActiveFilters: searchQuery.trim() !== '' || statusFilter !== 'all'
  };
};


import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { VerificationRequest } from '@/types/database';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import EmptyState from '@/components/shared/EmptyState';
import { FileX, RefreshCw } from 'lucide-react';
import VerificationRequestItem from './VerificationRequestItem';
import ImagePreviewDialog from './ImagePreviewDialog';

const VerificationRequestsList = () => {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    fetchVerificationRequests();
  }, []);

  const fetchVerificationRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('verification_requests')
        .select('*, profile:profiles(id, full_name, phone)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map the data to match VerificationRequest type
      const mappedRequests = (data || []).map(req => ({
        ...req,
        profile: req.profile || undefined
      }));

      setRequests(mappedRequests as VerificationRequest[]);
    } catch (error) {
      console.error('Error fetching verification requests:', error);
      toast.error('Gagal memuat permintaan verifikasi');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchVerificationRequests();
      toast.success('Data berhasil disegarkan');
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
      // Find the request to get user_id
      const requestData = requests.find(req => req.id === id);
      if (!requestData) throw new Error('Request not found');

      // Update verification status to approved
      const { error: verificationError } = await supabase
        .from('verification_requests')
        .update({ status: 'approved', updated_at: new Date().toISOString() })
        .eq('id', id);

      if (verificationError) throw verificationError;

      // Update user is_provider status to true
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_provider: true })
        .eq('id', requestData.user_id);

      if (profileError) throw profileError;

      toast.success('Verifikasi berhasil disetujui');
      fetchVerificationRequests(); // Refresh the list
    } catch (error) {
      console.error('Error approving verification:', error);
      toast.error('Gagal menyetujui verifikasi');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      const { error } = await supabase
        .from('verification_requests')
        .update({ 
          status: 'rejected', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;
      toast.success('Verifikasi berhasil ditolak');
      fetchVerificationRequests(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting verification:', error);
      toast.error('Gagal menolak verifikasi');
    } finally {
      setProcessingId(null);
    }
  };

  const handleOpenImagePreview = (url: string) => {
    setPreviewImage(url);
  };

  const handleCloseImagePreview = () => {
    setPreviewImage(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permintaan Verifikasi</CardTitle>
        <CardDescription>Mengelola permintaan verifikasi KTP dari calon penyedia jasa</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingIndicator />
        ) : requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((request) => (
              <VerificationRequestItem
                key={request.id}
                request={request}
                onApprove={handleApprove}
                onReject={handleReject}
                onPreviewImage={handleOpenImagePreview}
                processingId={processingId}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FileX}
            title="Tidak ada permintaan verifikasi"
            description="Tidak ada permintaan verifikasi saat ini"
          />
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Memuat Ulang...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Muat Ulang Data
            </>
          )}
        </Button>
      </CardFooter>

      <ImagePreviewDialog
        isOpen={!!previewImage}
        onClose={handleCloseImagePreview}
        imageUrl={previewImage}
      />
    </Card>
  );
};

export default VerificationRequestsList;

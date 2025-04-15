
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, ExternalLink, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface VerificationRequest {
  id: string;
  user_id: string;
  document_url: string;
  status: 'pending' | 'approved' | 'rejected';
  document_type: string;
  created_at: string;
  profile?: {
    full_name: string;
    phone: string;
  };
}

const VerificationRequestsList = () => {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
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
        .select('*, profile:profiles(full_name, phone)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching verification requests:', error);
      toast.error('Gagal memuat permintaan verifikasi');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      // Update verification status to approved
      const { error: verificationError } = await supabase
        .from('verification_requests')
        .update({ status: 'approved' })
        .eq('id', id);

      if (verificationError) throw verificationError;

      // Get user ID from the verification request
      const { data: requestData, error: requestError } = await supabase
        .from('verification_requests')
        .select('user_id')
        .eq('id', id)
        .single();

      if (requestError) throw requestError;

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
        .update({ status: 'rejected' })
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Menunggu</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Disetujui</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Ditolak</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permintaan Verifikasi</CardTitle>
        <CardDescription>Mengelola permintaan verifikasi KTP dari calon penyedia jasa</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-marketplace-primary"></div>
          </div>
        ) : requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{request.profile?.full_name || 'Unnamed User'}</h3>
                    <p className="text-sm text-gray-500">{request.profile?.phone || 'No phone'}</p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Dikirim pada {formatDate(request.created_at)}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => setPreviewImage(request.document_url)}
                    >
                      Lihat Dokumen <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                  
                  {request.status === 'pending' && (
                    <div className="flex space-x-2 mt-3 sm:mt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-700 hover:bg-red-50"
                        onClick={() => handleReject(request.id)}
                        disabled={!!processingId}
                      >
                        {processingId === request.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <X className="h-4 w-4 mr-1" /> Tolak
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(request.id)}
                        disabled={!!processingId}
                      >
                        {processingId === request.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-1" /> Setujui
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Tidak ada permintaan verifikasi saat ini
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={fetchVerificationRequests}>
          Muat Ulang Data
        </Button>
      </CardFooter>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Dokumen KTP</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            {previewImage && (
              <img 
                src={previewImage} 
                alt="KTP Document" 
                className="max-w-full max-h-[70vh] object-contain" 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default VerificationRequestsList;

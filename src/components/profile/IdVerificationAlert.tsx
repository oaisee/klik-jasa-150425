
import { useState, useEffect } from 'react';
import { AlertCircle, X, Shield, CheckCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import KtpVerificationModal from './KtpVerificationModal';
import { supabase } from '@/integrations/supabase/client';

interface IdVerificationAlertProps {
  onVerify: () => void;
  onCancel: () => void;
  userId: string;
}

const IdVerificationAlert = ({ onVerify, onCancel, userId }: IdVerificationAlertProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  const [loading, setLoading] = useState(true);
  const [rejectionNotes, setRejectionNotes] = useState<string | null>(null);

  useEffect(() => {
    checkVerificationStatus();
  }, [userId]);

  const checkVerificationStatus = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // Query verification_requests table to check status
      const { data, error } = await supabase
        .from('verification_requests')
        .select('status, notes')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setVerificationStatus(data[0].status as any);
        setRejectionNotes(data[0].notes);
        
        // If approved, automatically call onVerify
        if (data[0].status === 'approved') {
          onVerify();
        }
      } else {
        setVerificationStatus('none');
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleVerificationSubmitted = () => {
    // Update status to pending
    setVerificationStatus('pending');
    checkVerificationStatus();
  };

  if (loading) {
    return (
      <Alert className="bg-gray-50 border-gray-200">
        <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
        <AlertDescription className="text-gray-600">
          Memeriksa status verifikasi...
        </AlertDescription>
      </Alert>
    );
  }

  if (verificationStatus === 'approved') {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <AlertDescription className="text-green-800">
          <p className="font-medium mb-1">Verifikasi KTP Berhasil</p>
          <p className="text-sm">Anda telah terverifikasi sebagai penyedia jasa dan dapat menawarkan layanan Anda di KlikJasa.</p>
        </AlertDescription>
      </Alert>
    );
  }

  if (verificationStatus === 'pending') {
    return (
      <Alert className="bg-yellow-50 border-yellow-200">
        <AlertCircle className="h-5 w-5 text-yellow-500" />
        <AlertDescription className="text-yellow-800">
          <p className="font-medium mb-1">Verifikasi KTP Sedang Diproses</p>
          <p className="text-sm mb-2">Tim kami sedang memverifikasi dokumen KTP Anda. Proses ini biasanya membutuhkan waktu 1x24 jam kerja.</p>
          <div className="flex space-x-2 mt-2">
            <Button 
              variant="ghost" 
              className="text-gray-600 hover:bg-gray-100"
              onClick={onCancel}
            >
              <X className="w-4 h-4 mr-1" /> Lanjutkan Tanpa Verifikasi
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (verificationStatus === 'rejected') {
    return (
      <Alert className="bg-red-50 border-red-200">
        <AlertCircle className="h-5 w-5 text-red-500" />
        <AlertDescription className="text-red-800">
          <p className="font-medium mb-1">Verifikasi KTP Ditolak</p>
          <p className="text-sm mb-1">Mohon maaf, verifikasi KTP Anda ditolak.</p>
          {rejectionNotes && (
            <div className="p-2 bg-red-100 rounded-md text-sm mb-2">
              <p className="font-medium">Alasan:</p>
              <p>{rejectionNotes}</p>
            </div>
          )}
          <p className="text-sm mb-2">Silakan unggah ulang KTP Anda dengan memastikan kualitas gambar yang lebih baik.</p>
          <div className="flex space-x-2 mt-2">
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleOpenModal}
            >
              Unggah Ulang KTP
            </Button>
            <Button 
              variant="ghost" 
              className="text-gray-600 hover:bg-gray-100"
              onClick={onCancel}
            >
              <X className="w-4 h-4 mr-1" /> Batal
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <Alert className="bg-blue-50 border-blue-200">
        <Shield className="h-5 w-5 text-blue-500" />
        <AlertDescription className="text-blue-800">
          <p className="font-medium mb-1">Verifikasi KTP Diperlukan</p>
          <p className="text-sm mb-2">Untuk menjadi penyedia jasa, Anda perlu memverifikasi identitas dengan mengunggah KTP. Ini untuk memastikan keamanan semua pengguna KlikJasa.</p>
          <div className="flex space-x-2 mt-2">
            <Button 
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleOpenModal}
            >
              Verifikasi KTP
            </Button>
            <Button 
              variant="ghost" 
              className="text-gray-600 hover:bg-gray-100"
              onClick={onCancel}
            >
              <X className="w-4 h-4 mr-1" /> Batal
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      <KtpVerificationModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        userId={userId}
        onVerificationSubmitted={handleVerificationSubmitted}
      />
    </>
  );
};

export default IdVerificationAlert;

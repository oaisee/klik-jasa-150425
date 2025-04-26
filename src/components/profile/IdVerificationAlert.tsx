import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import KtpVerificationModal from './KtpVerificationModal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import VerificationInitial from './verification/VerificationInitial';
import VerificationPending from './verification/VerificationPending';
import VerificationApproved from './verification/VerificationApproved';
import VerificationRejected from './verification/VerificationRejected';

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
    if (userId) {
      checkVerificationStatus();
    }
  }, [userId]);

  const checkVerificationStatus = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      console.log('Checking verification status for user:', userId);
      
      const { data, error } = await supabase
        .from('verification_requests')
        .select('status, notes')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error('Error checking verification status:', error);
        toast.error('Gagal memeriksa status verifikasi', { 
          description: 'Silakan refresh halaman atau coba lagi nanti'
        });
        return;
      }
      
      console.log('Verification status query result:', data);
      
      if (data && data.length > 0) {
        setVerificationStatus(data[0].status as any);
        setRejectionNotes(data[0].notes);
        
        // If approved, automatically call onVerify
        if (data[0].status === 'approved') {
          console.log('User is already approved, calling onVerify');
          onVerify();
        }
      } else {
        console.log('No verification requests found');
        setVerificationStatus('none');
      }
    } catch (error) {
      console.error('Error in checkVerificationStatus:', error);
      toast.error('Terjadi kesalahan saat memeriksa status verifikasi');
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
    console.log('Verification submitted, updating status');
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
    return <VerificationApproved />;
  }

  if (verificationStatus === 'pending') {
    return <VerificationPending />;
  }

  if (verificationStatus === 'rejected') {
    return (
      <>
        <VerificationRejected 
          notes={rejectionNotes}
          onRetry={handleOpenModal}
        />
        <KtpVerificationModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          userId={userId}
          onVerificationSubmitted={handleVerificationSubmitted}
        />
      </>
    );
  }

  return (
    <>
      <VerificationInitial 
        onStartVerification={handleOpenModal}
        onCancel={onCancel}
      />
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

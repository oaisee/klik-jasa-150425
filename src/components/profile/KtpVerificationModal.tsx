
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import KtpVerification from './verification/KtpVerification';

interface KtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onVerificationSubmitted: () => void;
}

const KtpVerificationModal = ({ 
  isOpen, 
  onClose, 
  userId,
  onVerificationSubmitted 
}: KtpVerificationModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader>
          <DialogTitle>Verifikasi KTP</DialogTitle>
        </DialogHeader>
        
        <KtpVerification 
          userId={userId}
          onVerificationSubmitted={onVerificationSubmitted}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default KtpVerificationModal;

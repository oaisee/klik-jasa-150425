
import { useState } from 'react';
import { toast } from 'sonner';
import PreviewButton from './actions/PreviewButton';
import ActionButtons from './actions/ActionButtons';
import RejectDialog from './actions/RejectDialog';
import ApproveDialog from './actions/ApproveDialog';

interface VerificationActionsProps {
  requestId: string;
  status: string;
  userName: string;
  documentUrl: string;
  processingId: string | null;
  onPreviewImage: () => void;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, notes?: string) => Promise<void>;
  isPreviewLoading?: boolean;
}

const VerificationActions = ({
  requestId,
  status,
  userName,
  documentUrl,
  processingId,
  onPreviewImage,
  onApprove,
  onReject,
  isPreviewLoading = false,
}: VerificationActionsProps) => {
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isConfirmApproveOpen, setIsConfirmApproveOpen] = useState(false);
  const [rejectNotes, setRejectNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRejectRequest = async () => {
    try {
      setIsProcessing(true);
      await onReject(requestId, rejectNotes.trim() || undefined);
      toast.success('Verifikasi berhasil ditolak');
    } catch (error) {
      console.error('Error rejecting verification:', error);
      toast.error('Gagal menolak verifikasi');
    } finally {
      setIsRejectDialogOpen(false);
      setIsProcessing(false);
    }
  };

  const handleApproveRequest = async () => {
    try {
      setIsProcessing(true);
      await onApprove(requestId);
      toast.success('Verifikasi berhasil disetujui');
    } catch (error) {
      console.error('Error approving verification:', error);
      toast.error('Gagal menyetujui verifikasi');
    } finally {
      setIsConfirmApproveOpen(false);
      setIsProcessing(false);
    }
  };

  const isDisabled = !!processingId || isProcessing;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3">
        <PreviewButton
          onPreviewImage={onPreviewImage}
          isPreviewLoading={isPreviewLoading}
          isDisabled={isDisabled}
          documentUrl={documentUrl}
        />
        
        {status === 'pending' && (
          <ActionButtons
            isProcessing={isProcessing}
            isDisabled={isDisabled}
            onReject={() => setIsRejectDialogOpen(true)}
            onApprove={() => setIsConfirmApproveOpen(true)}
          />
        )}
      </div>

      <RejectDialog
        isOpen={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
        userName={userName}
        notes={rejectNotes}
        onNotesChange={setRejectNotes}
        onConfirm={handleRejectRequest}
        isProcessing={isProcessing}
      />

      <ApproveDialog
        isOpen={isConfirmApproveOpen}
        onOpenChange={setIsConfirmApproveOpen}
        userName={userName}
        onConfirm={handleApproveRequest}
        isProcessing={isProcessing}
      />
    </>
  );
};

export default VerificationActions;


import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, Eye, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface VerificationActionsProps {
  requestId: string;
  status: string;
  userName: string;
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
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs flex items-center gap-1"
          onClick={onPreviewImage}
          disabled={isPreviewLoading || isDisabled}
        >
          {isPreviewLoading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Memuat...
            </>
          ) : (
            <>
              <Eye className="h-3 w-3" /> Lihat Dokumen
            </>
          )}
        </Button>
        
        {status === 'pending' && (
          <div className="flex space-x-2 mt-3 sm:mt-0">
            <Button
              variant="outline"
              size="sm"
              className="border-red-200 text-red-700 hover:bg-red-50"
              onClick={() => setIsRejectDialogOpen(true)}
              disabled={isDisabled}
            >
              {(processingId === requestId || isProcessing) ? (
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
              onClick={() => setIsConfirmApproveOpen(true)}
              disabled={isDisabled}
            >
              {(processingId === requestId || isProcessing) ? (
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

      {/* Reject Dialog */}
      <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tolak Verifikasi KTP</AlertDialogTitle>
            <AlertDialogDescription>
              Anda yakin ingin menolak permintaan verifikasi KTP dari {userName}?
              Tambahkan catatan optional di bawah untuk menjelaskan alasan penolakan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-3">
            <Textarea
              placeholder="Catatan penolakan (opsional)"
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRejectRequest} 
              className="bg-red-600 hover:bg-red-700"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses...
                </div>
              ) : (
                'Tolak Verifikasi'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={isConfirmApproveOpen} onOpenChange={setIsConfirmApproveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Setujui Verifikasi KTP</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menyetujui verifikasi KTP dari {userName}?
              Setelah disetujui, pengguna akan mendapatkan status sebagai penyedia jasa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleApproveRequest} 
              className="bg-green-600 hover:bg-green-700"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses...
                </div>
              ) : (
                'Setujui Verifikasi'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default VerificationActions;

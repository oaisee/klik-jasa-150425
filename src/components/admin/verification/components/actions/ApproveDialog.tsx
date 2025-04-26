
import { Loader2 } from 'lucide-react';
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

interface ApproveDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  onConfirm: () => Promise<void>;
  isProcessing: boolean;
}

const ApproveDialog = ({
  isOpen,
  onOpenChange,
  userName,
  onConfirm,
  isProcessing
}: ApproveDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
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
            onClick={onConfirm}
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
  );
};

export default ApproveDialog;

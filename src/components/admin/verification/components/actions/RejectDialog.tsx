
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
import { Textarea } from '@/components/ui/textarea';

interface RejectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  notes: string;
  onNotesChange: (notes: string) => void;
  onConfirm: () => Promise<void>;
  isProcessing: boolean;
}

const RejectDialog = ({
  isOpen,
  onOpenChange,
  userName,
  notes,
  onNotesChange,
  onConfirm,
  isProcessing
}: RejectDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
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
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>Batal</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
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
  );
};

export default RejectDialog;

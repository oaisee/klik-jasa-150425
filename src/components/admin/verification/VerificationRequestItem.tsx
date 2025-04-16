
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  X, 
  ExternalLink, 
  Loader2, 
  AlertTriangle,
  Eye,
  UserCheck,
  Calendar
} from 'lucide-react';
import { VerificationRequest } from '@/types/database';
import { toast } from 'sonner';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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

interface VerificationRequestItemProps {
  request: VerificationRequest;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, notes?: string) => Promise<void>;
  onPreviewImage: (url: string) => void;
  processingId: string | null;
}

const VerificationRequestItem = ({ 
  request, 
  onApprove, 
  onReject, 
  onPreviewImage,
  processingId 
}: VerificationRequestItemProps) => {
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectNotes, setRejectNotes] = useState('');
  const [isConfirmApproveOpen, setIsConfirmApproveOpen] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
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
  
  const handlePreviewImage = () => {
    setIsPreviewLoading(true);
    // Check if the image URL is valid before showing preview
    const img = new Image();
    img.onload = () => {
      setIsPreviewLoading(false);
      onPreviewImage(request.document_url);
    };
    img.onerror = () => {
      setIsPreviewLoading(false);
      toast.error("Gagal memuat gambar. URL mungkin tidak valid.");
    };
    img.src = request.document_url;
  };

  const handleRejectRequest = () => {
    setIsRejectDialogOpen(false);
    onReject(request.id, rejectNotes.trim() || undefined);
  };

  const handleApproveRequest = () => {
    setIsConfirmApproveOpen(false);
    onApprove(request.id);
  };

  return (
    <div className="border rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium flex items-center gap-2">
            {request.profile?.full_name || 'Unnamed User'} 
            {request.status === 'approved' && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <UserCheck className="h-4 w-4 text-green-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Pengguna telah diverifikasi</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </h3>
          <p className="text-sm text-gray-500">{request.profile?.phone || 'No phone'}</p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(request.status)}
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center text-xs text-gray-500 gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(request.created_at).split(' ')[0]}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{formatDate(request.created_at)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {request.notes && (
        <div className="mt-2 mb-3 p-2 bg-red-50 border border-red-100 rounded text-sm text-red-700">
          <div className="flex gap-1 items-start">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>{request.notes}</p>
          </div>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3">
        <div>
          <p className="text-sm text-gray-500 mb-1">
            Dikirim pada {formatDate(request.created_at)}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs flex items-center gap-1"
            onClick={handlePreviewImage}
            disabled={isPreviewLoading}
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
        </div>
        
        {request.status === 'pending' && (
          <div className="flex space-x-2 mt-3 sm:mt-0">
            <Button
              variant="outline"
              size="sm"
              className="border-red-200 text-red-700 hover:bg-red-50"
              onClick={() => setIsRejectDialogOpen(true)}
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
              onClick={() => setIsConfirmApproveOpen(true)}
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

      {/* Reject Dialog */}
      <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tolak Verifikasi KTP</AlertDialogTitle>
            <AlertDialogDescription>
              Anda yakin ingin menolak permintaan verifikasi KTP dari {request.profile?.full_name || 'pengguna ini'}?
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
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleRejectRequest} className="bg-red-600 hover:bg-red-700">
              Tolak Verifikasi
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
              Apakah Anda yakin ingin menyetujui verifikasi KTP dari {request.profile?.full_name || 'pengguna ini'}?
              Setelah disetujui, pengguna akan mendapatkan status sebagai penyedia jasa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleApproveRequest} className="bg-green-600 hover:bg-green-700">
              Setujui Verifikasi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VerificationRequestItem;

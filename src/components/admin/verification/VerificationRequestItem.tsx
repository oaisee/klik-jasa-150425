
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, ExternalLink, Loader2 } from 'lucide-react';
import { VerificationRequest } from '@/types/database';
import { toast } from 'sonner';

interface VerificationRequestItemProps {
  request: VerificationRequest;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
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

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium">{request.profile?.full_name || 'Unnamed User'}</h3>
          <p className="text-sm text-gray-500">{request.profile?.phone || 'No phone'}</p>
        </div>
        {getStatusBadge(request.status)}
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3">
        <div>
          <p className="text-sm text-gray-500 mb-1">
            Dikirim pada {formatDate(request.created_at)}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={handlePreviewImage}
            disabled={isPreviewLoading}
          >
            {isPreviewLoading ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Memuat...
              </>
            ) : (
              <>
                Lihat Dokumen <ExternalLink className="h-3 w-3 ml-1" />
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
              onClick={() => onReject(request.id)}
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
              onClick={() => onApprove(request.id)}
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
  );
};

export default VerificationRequestItem;

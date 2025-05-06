
import { VerificationRequest } from '@/types/database';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Check, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/formatters';
import { Skeleton } from '@/components/ui/skeleton';
import { useSupabaseImage } from '@/hooks/useSupabaseImage';

interface VerificationTableProps {
  requests: VerificationRequest[];
  processingId: string | null;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, notes?: string) => Promise<void>;
  onPreviewImage: (url: string) => void;
  isPreviewLoading: boolean;
}

const KtpThumbnail = ({ url, onClick }: { url: string; onClick: () => void }) => {
  const { imageData, loading, error } = useSupabaseImage(url);
  
  if (loading) {
    return (
      <div className="w-32 h-20 rounded-md bg-gray-100 border flex items-center justify-center">
        <Skeleton className="h-16 w-28" />
      </div>
    );
  }
  
  if (error || !imageData) {
    return (
      <div className="w-32 h-20 rounded-md bg-gray-100 border flex items-center justify-center">
        <span className="text-gray-400 text-xs">Gagal memuat</span>
      </div>
    );
  }
  
  return (
    <div className="relative group">
      <div className="w-32 h-20 rounded-md overflow-hidden bg-gray-100 border flex items-center justify-center">
        <img
          src={imageData}
          alt="KTP"
          className="max-w-full max-h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
            e.currentTarget.className = 'w-8 h-8 text-gray-400';
          }}
        />
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-md">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white"
          onClick={onClick}
        >
          <Eye size={18} />
        </Button>
      </div>
    </div>
  );
};

const VerificationTable = ({
  requests,
  processingId,
  onApprove,
  onReject,
  onPreviewImage,
  isPreviewLoading
}: VerificationTableProps) => {
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Menunggu</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Disetujui</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Ditolak</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Nama</TableHead>
            <TableHead>No. Telepon</TableHead>
            <TableHead>Dokumen KTP</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[220px]">Tanggal Dibuat</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">
                {request.profile?.full_name || 'Tanpa Nama'}
              </TableCell>
              <TableCell>
                {request.profile?.phone || '-'}
              </TableCell>
              <TableCell>
                <div className="relative">
                  {request.document_url ? (
                    <KtpThumbnail 
                      url={request.document_url} 
                      onClick={() => onPreviewImage(request.document_url)}
                    />
                  ) : (
                    <div className="w-32 h-20 rounded-md bg-gray-100 border flex items-center justify-center">
                      <span className="text-gray-400 text-xs">Tidak ada gambar</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(request.status)}
              </TableCell>
              <TableCell>
                {formatDate(request.created_at || '')}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {request.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onApprove(request.id)}
                        disabled={!!processingId}
                        className="text-green-600 border-green-200 hover:bg-green-50"
                      >
                        <Check size={14} className="mr-1" />
                        Setuju
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onReject(request.id)}
                        disabled={!!processingId}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <X size={14} className="mr-1" />
                        Tolak
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPreviewImage(request.document_url)}
                    disabled={isPreviewLoading}
                  >
                    <Eye size={14} className="mr-1" />
                    Detail
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VerificationTable;

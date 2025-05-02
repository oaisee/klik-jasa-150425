
import { VerificationRequest } from '@/types/database';
import VerificationUserInfo from './components/VerificationUserInfo';
import VerificationStatus from './components/VerificationStatus';
import RejectionNotes from './components/RejectionNotes';
import VerificationActions from './components/VerificationActions';

interface VerificationRequestItemProps {
  request: VerificationRequest;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, notes?: string) => Promise<void>;
  onPreviewImage: (url: string) => void;
  processingId: string | null;
  isPreviewLoading?: boolean;
}

const VerificationRequestItem = ({ 
  request, 
  onApprove, 
  onReject, 
  onPreviewImage,
  processingId,
  isPreviewLoading = false
}: VerificationRequestItemProps) => {
  return (
    <div className="border rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <VerificationUserInfo 
          fullName={request.profile?.full_name || ''}
          phone={request.profile?.phone || ''}
          isApproved={request.status === 'approved'}
        />
        
        <VerificationStatus 
          status={request.status}
          createdAt={request.created_at || ''}
        />
      </div>
      
      <RejectionNotes notes={request.notes || ''} />
      
      <VerificationActions
        requestId={request.id}
        status={request.status}
        userName={request.profile?.full_name || 'pengguna ini'}
        processingId={processingId}
        onPreviewImage={() => onPreviewImage(request.document_url)}
        onApprove={onApprove}
        onReject={onReject}
        isPreviewLoading={isPreviewLoading}
      />
    </div>
  );
};

export default VerificationRequestItem;

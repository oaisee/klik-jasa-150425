
import { UserCheck } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface VerificationUserInfoProps {
  fullName: string;
  phone: string;
  isApproved: boolean;
}

const VerificationUserInfo = ({ fullName, phone, isApproved }: VerificationUserInfoProps) => {
  return (
    <div>
      <h3 className="font-medium flex items-center gap-2">
        {fullName || 'Unnamed User'} 
        {isApproved && (
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
      <p className="text-sm text-gray-500">{phone || 'No phone'}</p>
    </div>
  );
};

export default VerificationUserInfo;

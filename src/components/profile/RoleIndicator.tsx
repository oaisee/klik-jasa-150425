
import { User, Briefcase } from 'lucide-react';

interface RoleIndicatorProps {
  isProvider: boolean;
}

const RoleIndicator = ({ isProvider }: RoleIndicatorProps) => {
  return (
    <div className="flex items-center space-x-4">
      {isProvider ? (
        <div className="p-2 bg-blue-100 rounded-full">
          <Briefcase className="w-5 h-5 text-blue-600" />
        </div>
      ) : (
        <div className="p-2 bg-green-100 rounded-full">
          <User className="w-5 h-5 text-green-600" />
        </div>
      )}
      <div>
        <h3 className="font-medium">
          {isProvider ? 'Mode Penyedia Jasa' : 'Mode Pengguna'}
        </h3>
        <p className="text-sm text-gray-500">
          {isProvider 
            ? 'Anda dapat menawarkan jasa' 
            : 'Anda dapat memesan jasa'}
        </p>
      </div>
    </div>
  );
};

export default RoleIndicator;

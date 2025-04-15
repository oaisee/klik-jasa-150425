
import { Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
  size?: 'sm' | 'default' | 'lg';
  text?: string;
}

const LoadingIndicator = ({ size = 'default', text }: LoadingIndicatorProps) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <Loader2 className={`${sizeMap[size]} animate-spin text-marketplace-primary`} />
      {text && <p className="mt-2 text-sm text-gray-500">{text}</p>}
    </div>
  );
};

export default LoadingIndicator;

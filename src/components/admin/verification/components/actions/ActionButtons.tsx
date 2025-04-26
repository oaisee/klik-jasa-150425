
import { Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  isProcessing: boolean;
  isDisabled: boolean;
  onReject: () => void;
  onApprove: () => void;
}

const ActionButtons = ({ isProcessing, isDisabled, onReject, onApprove }: ActionButtonsProps) => {
  return (
    <div className="flex space-x-2 mt-3 sm:mt-0">
      <Button
        variant="outline"
        size="sm"
        className="border-red-200 text-red-700 hover:bg-red-50"
        onClick={onReject}
        disabled={isDisabled}
      >
        {isProcessing ? (
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
        onClick={onApprove}
        disabled={isDisabled}
      >
        {isProcessing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Check className="h-4 w-4 mr-1" /> Setujui
          </>
        )}
      </Button>
    </div>
  );
};

export default ActionButtons;


import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface TopUpDialogFooterProps {
  selectedAmount: number | '';
  isProcessing: boolean;
  onTopUp: () => void;
}

const TopUpDialogFooter = ({ selectedAmount, isProcessing, onTopUp }: TopUpDialogFooterProps) => {
  return (
    <DialogFooter>
      <Button
        onClick={onTopUp}
        disabled={!selectedAmount || isProcessing}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Memproses...
          </>
        ) : `Top Up ${selectedAmount ? `Rp ${Number(selectedAmount).toLocaleString()}` : ""}`}
      </Button>
    </DialogFooter>
  );
};

export default TopUpDialogFooter;


import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Loader2 } from 'lucide-react';
import PresetAmountButtons from './PresetAmountButtons';
import CustomAmountInput from './CustomAmountInput';
import PaymentInfoAlert from './PaymentInfoAlert';
import { useMidtransPayment } from '@/hooks/useMidtransPayment';

interface TopUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTopUp: (amount: number) => void;
}

const TopUpDialog = ({ open, onOpenChange, onTopUp }: TopUpDialogProps) => {
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<number | ''>('');
  
  const { isProcessing, initializePayment } = useMidtransPayment({
    onSuccess: onTopUp,
    onClose: () => onOpenChange(false)
  });

  const handlePresetAmountClick = (presetAmount: number) => {
    setSelectedAmount(presetAmount);
    setCustomAmount(presetAmount.toString());
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(value ? parseInt(value, 10) : '');
  };

  const handleTopUp = () => {
    if (typeof selectedAmount === 'number') {
      initializePayment(selectedAmount);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Top Up Saldo KlikJasa
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <PresetAmountButtons
            selectedAmount={selectedAmount}
            onAmountSelect={handlePresetAmountClick}
          />
          
          <Separator className="my-2" />
          
          <CustomAmountInput
            value={customAmount}
            onChange={handleCustomAmountChange}
          />
          
          <PaymentInfoAlert />
        </div>
        
        <DialogFooter>
          <Button
            onClick={handleTopUp}
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
      </DialogContent>
    </Dialog>
  );
};

export default TopUpDialog;

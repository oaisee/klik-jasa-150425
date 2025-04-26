
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import PresetAmountButtons from './PresetAmountButtons';
import CustomAmountInput from './CustomAmountInput';
import PaymentInfoAlert from './PaymentInfoAlert';
import TopUpDialogHeader from './TopUpDialogHeader';
import TopUpDialogFooter from './TopUpDialogFooter';
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
        <TopUpDialogHeader />
        
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
        
        <TopUpDialogFooter
          selectedAmount={selectedAmount}
          isProcessing={isProcessing}
          onTopUp={handleTopUp}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TopUpDialog;

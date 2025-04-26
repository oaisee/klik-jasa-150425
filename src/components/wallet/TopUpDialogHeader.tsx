
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreditCard } from 'lucide-react';

const TopUpDialogHeader = () => {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center">
        <CreditCard className="mr-2 h-5 w-5" />
        Top Up Saldo KlikJasa
      </DialogTitle>
    </DialogHeader>
  );
};

export default TopUpDialogHeader;

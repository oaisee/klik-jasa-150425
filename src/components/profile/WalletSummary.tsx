
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WalletSummaryProps {
  walletBalance: number;
}

const WalletSummary = ({ walletBalance }: WalletSummaryProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="mb-6 shadow-md border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="h-3 bg-gradient-to-r from-marketplace-accent to-marketplace-secondary opacity-80"></div>
      <CardContent className="p-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="p-2 bg-marketplace-accent bg-opacity-10 rounded-full mr-3">
              <CreditCard className="h-6 w-6 text-marketplace-accent" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Saldo Wallet</h3>
              <p className="text-xl font-bold text-gray-800">
                Rp {walletBalance.toLocaleString()}
              </p>
            </div>
          </div>
          
          <Button 
            size="sm" 
            className="bg-marketplace-accent hover:bg-marketplace-accent/90"
            onClick={() => navigate('/wallet')}
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            Top Up
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletSummary;

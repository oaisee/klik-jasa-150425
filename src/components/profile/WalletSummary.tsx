
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface WalletSummaryProps {
  walletBalance: number;
}

const WalletSummary = ({ walletBalance }: WalletSummaryProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Wallet className="w-5 h-5 mr-2 text-marketplace-primary" />
            <h3 className="font-semibold">Saldo KlikJasa</h3>
          </div>
          <Link to="/wallet">
            <Button variant="ghost" className="text-marketplace-primary p-0">
              Lihat Detail
            </Button>
          </Link>
        </div>
        <div className="mt-2">
          <p className="text-2xl font-semibold">Rp {walletBalance.toLocaleString('id-ID')}</p>
          <div className="mt-2 flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate('/wallet')}>
              Isi Saldo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletSummary;

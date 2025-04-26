
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Wallet } from "lucide-react";

interface WalletBalanceCardProps {
  balance: number;
  onTopUp: () => void;
}

const WalletBalanceCard = ({ balance, onTopUp }: WalletBalanceCardProps) => {
  return (
    <Card className="mb-6 bg-gradient-to-r from-marketplace-secondary to-marketplace-primary text-white">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm opacity-80 mb-1">Saldo Saat Ini</div>
            <div className="text-2xl font-bold">Rp {balance?.toLocaleString() || '0'}</div>
          </div>
          <Wallet className="h-8 w-8 opacity-80" />
        </div>
        
        <Button 
          variant="secondary" 
          className="w-full mt-4 text-marketplace-primary"
          onClick={onTopUp}
        >
          <Plus className="mr-2 h-4 w-4" /> Top Up Saldo
        </Button>
      </CardContent>
    </Card>
  );
};

export default WalletBalanceCard;

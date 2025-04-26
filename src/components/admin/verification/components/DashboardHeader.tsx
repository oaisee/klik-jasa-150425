
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface DashboardHeaderProps {
  refreshing: boolean;
  onRefresh: () => void;
}

const DashboardHeader = ({ refreshing, onRefresh }: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Verifikasi Pengguna</h2>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefresh} 
        disabled={refreshing}
        className="flex items-center gap-1"
      >
        <RefreshCw size={16} className={`${refreshing ? 'animate-spin' : ''}`} />
        <span>{refreshing ? 'Menyegarkan...' : 'Segarkan Data'}</span>
      </Button>
    </div>
  );
};

export default DashboardHeader;

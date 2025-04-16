
import React from 'react';
import { Link } from 'react-router-dom';
import { BellIcon, Wallet } from 'lucide-react';
import { formatRupiah } from '@/utils/formatters';
import { Button } from '@/components/ui/button';

interface HomeHeaderProps {
  isAuthenticated: boolean;
  walletBalance: number;
  hasNotifications: boolean;
}

const HomeHeader = ({ 
  isAuthenticated, 
  walletBalance, 
  hasNotifications 
}: HomeHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-green-500 to-blue-600 fixed top-0 left-0 right-0 z-10 px-4 py-3 flex justify-between items-center text-white">
      <div className="flex items-center">
        <img 
          src="/logo.png" 
          alt="KlikJasa" 
          className="h-8 mr-2" 
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/placeholder.svg";
          }} 
        />
        <h1 className="text-xl font-bold">KlikJasa</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        {isAuthenticated ? (
          <>
            <Link to="/wallet" className="relative flex items-center mr-1 p-2">
              <Wallet size={20} />
              <span className="ml-1 text-sm font-medium">
                {formatRupiah(walletBalance)}
              </span>
            </Link>
            
            <Link to="/notifications" className="relative p-2">
              <BellIcon size={20} />
              {hasNotifications && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </Link>
          </>
        ) : (
          <Button asChild size="sm" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
            <Link to="/login">Masuk</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default HomeHeader;

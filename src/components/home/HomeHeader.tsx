
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface HomeHeaderProps {
  isAuthenticated: boolean;
  walletBalance: number;
  hasNotifications: boolean;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ 
  isAuthenticated, 
  walletBalance, 
  hasNotifications 
}) => {
  // Update status bar color on mount
  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) metaThemeColor.setAttribute('content', '#1EAEDB');
    
    const statusBarStyle = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (statusBarStyle) statusBarStyle.setAttribute('content', 'light-content');
    
    document.documentElement.classList.add('status-bar-dark');
    document.documentElement.classList.remove('status-bar-light');
  }, []);
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-marketplace-primary text-white shadow-md">
      <div className="flex items-center justify-between py-3 px-4">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/3e7ce3dd-6c4b-47e9-971d-7483e3d4ab64.png" 
            alt="KlikJasa Logo" 
            className="w-8 h-8" 
          />
          <h1 className="text-xl font-bold">KlikJasa</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <Link to="/wallet" className="flex items-center">
              <Wallet size={20} className="mr-1" />
              <span className="text-sm">{formatCurrency(walletBalance)}</span>
            </Link>
          )}
          
          <Link to="/notifications" className="relative">
            <Bell size={22} />
            {hasNotifications && (
              <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3"></span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeHeader;

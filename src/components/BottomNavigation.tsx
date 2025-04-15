
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Calendar, MessageCircle, User } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();
  
  const getActiveClass = (path: string) => {
    return location.pathname === path 
      ? "text-marketplace-primary" 
      : "text-gray-500";
  };
  
  return (
    <div className="app-bottom-nav">
      <div className="flex justify-between items-center h-16">
        <Link to="/" className={`flex flex-col items-center w-1/5 ${getActiveClass('/')}`}>
          <Home size={22} />
          <span className="text-xs mt-1">Beranda</span>
        </Link>
        <Link to="/search" className={`flex flex-col items-center w-1/5 ${getActiveClass('/search')}`}>
          <Search size={22} />
          <span className="text-xs mt-1">Cari</span>
        </Link>
        <Link to="/bookings" className={`flex flex-col items-center w-1/5 ${getActiveClass('/bookings')}`}>
          <Calendar size={22} />
          <span className="text-xs mt-1">Pesanan</span>
        </Link>
        <Link to="/chat" className={`flex flex-col items-center w-1/5 ${getActiveClass('/chat')}`}>
          <MessageCircle size={22} />
          <span className="text-xs mt-1">Chat</span>
        </Link>
        <Link to="/profile" className={`flex flex-col items-center w-1/5 ${getActiveClass('/profile')}`}>
          <User size={22} />
          <span className="text-xs mt-1">Profil</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;


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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-sm z-10">
      <div className="app-container">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className={`flex flex-col items-center w-1/5 ${getActiveClass('/')}`}>
            <Home size={22} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link to="/search" className={`flex flex-col items-center w-1/5 ${getActiveClass('/search')}`}>
            <Search size={22} />
            <span className="text-xs mt-1">Search</span>
          </Link>
          <Link to="/bookings" className={`flex flex-col items-center w-1/5 ${getActiveClass('/bookings')}`}>
            <Calendar size={22} />
            <span className="text-xs mt-1">Bookings</span>
          </Link>
          <Link to="/chat" className={`flex flex-col items-center w-1/5 ${getActiveClass('/chat')}`}>
            <MessageCircle size={22} />
            <span className="text-xs mt-1">Chat</span>
          </Link>
          <Link to="/profile" className={`flex flex-col items-center w-1/5 ${getActiveClass('/profile')}`}>
            <User size={22} />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;

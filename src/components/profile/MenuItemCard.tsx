
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface MenuItemCardProps {
  icon: React.ReactNode;
  title: string;
  path: string;
}

const MenuItemCard = ({ icon, title, path }: MenuItemCardProps) => {
  // Check if this is the logout option (doesn't use a Link)
  const isLogout = path === "#";
  
  const content = (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-all duration-200">
      <div className="flex items-center">
        <div className="p-2 bg-gray-100 rounded-full mr-3">
          {icon}
        </div>
        <span className={`${title === 'Keluar' ? 'text-red-500' : 'text-gray-700'}`}>{title}</span>
      </div>
      <ChevronRight size={18} className="text-gray-400" />
    </div>
  );
  
  return isLogout ? (
    <div className="cursor-pointer">
      {content}
    </div>
  ) : (
    <Link to={path}>
      {content}
    </Link>
  );
};

export default MenuItemCard;

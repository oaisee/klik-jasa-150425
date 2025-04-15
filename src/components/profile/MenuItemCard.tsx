
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

interface MenuItemCardProps {
  icon: React.ReactNode;
  title: string;
  path: string;
}

const MenuItemCard = ({ icon, title, path }: MenuItemCardProps) => {
  return (
    <Link to={path}>
      <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-gray-500 mr-3">
              {icon}
            </div>
            <span>{title}</span>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </CardContent>
      </Card>
    </Link>
  );
};

export default MenuItemCard;

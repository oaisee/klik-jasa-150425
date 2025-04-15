
import { Briefcase } from 'lucide-react';

interface PopularServiceItemProps {
  title: string;
  category: string;
  price: string;
  location: string;
}

const PopularServiceItem = ({ title, category, price, location }: PopularServiceItemProps) => {
  return (
    <li className="flex items-center space-x-3">
      <div className="p-2 bg-gray-100 rounded-md">
        <Briefcase className="h-5 w-5 text-marketplace-primary" />
      </div>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">{category}</p>
      </div>
      <div className="text-right">
        <p className="font-medium">{price}</p>
        <p className="text-sm text-gray-500">{location}</p>
      </div>
    </li>
  );
};

export default PopularServiceItem;

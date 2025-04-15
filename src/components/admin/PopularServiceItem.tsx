
import { Briefcase } from 'lucide-react';

interface PopularServiceItemProps {
  title: string;
  provider: string;
  bookings: number;
  rating: number;
}

const PopularServiceItem = ({ title, provider, bookings, rating }: PopularServiceItemProps) => {
  return (
    <li className="flex items-center space-x-3">
      <div className="p-2 bg-gray-100 rounded-md">
        <Briefcase className="h-5 w-5 text-marketplace-primary" />
      </div>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">oleh {provider}</p>
      </div>
      <div className="text-right">
        <p className="font-medium">{bookings} booking</p>
        <p className="text-sm text-yellow-500">★ {rating}</p>
      </div>
    </li>
  );
};

export default PopularServiceItem;

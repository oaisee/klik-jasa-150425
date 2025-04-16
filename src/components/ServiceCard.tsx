import { Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
interface ServiceCardProps {
  id: string;
  image: string;
  title: string;
  providerName: string;
  rating: number;
  price: number;
  currency?: string;
  distance: number;
  category?: string;
}
const ServiceCard = ({
  id,
  image,
  title,
  providerName,
  rating,
  price,
  currency = 'Rp',
  distance,
  category
}: ServiceCardProps) => {
  return <Link to={`/service/${id}`} className="block bg-white rounded-lg overflow-hidden shadow border border-gray-100 hover:shadow-md transition-shadow">
      <div className="relative h-36">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-3.5">
        <h3 className="font-semibold text-sm truncate text-marketplace-secondary text-left">{title}</h3>
        <div className="flex items-center mt-1.5 text-xs text-gray-600">
          <span>{providerName}</span>
          <div className="flex items-center ml-2">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="ml-0.5">{rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2.5">
          <p className="text-sm font-medium">Mulai {currency} {price.toLocaleString()}</p>
        </div>
        <div className="flex items-center mt-1.5 text-xs text-gray-500">
          <MapPin size={12} />
          <span className="ml-1">{distance.toFixed(1)} km dari Anda</span>
        </div>
      </div>
    </Link>;
};
export default ServiceCard;
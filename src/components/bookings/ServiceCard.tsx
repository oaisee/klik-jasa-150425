
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Eye, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ServiceCardProps {
  id: string;
  title: string;
  price: number;
  status: string;
  views: number;
  ordersCount: number;
}

const ServiceCard = ({ 
  id, 
  title, 
  price, 
  status,
  views,
  ordersCount
}: ServiceCardProps) => {
  const navigate = useNavigate();
  
  const getStatusBadge = () => {
    switch(status) {
      case 'active':
        return <span className="px-2.5 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">Aktif</span>;
      case 'inactive':
        return <span className="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium">Nonaktif</span>;
      case 'draft':
        return <span className="px-2.5 py-1 bg-yellow-50 text-yellow-600 rounded-full text-xs font-medium">Draft</span>;
      default:
        return null;
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold truncate">{title}</h3>
            {getStatusBadge()}
          </div>
          
          <div className="font-medium text-marketplace-primary">
            Rp {price.toLocaleString()}
          </div>
          
          <div className="flex space-x-4 mt-2 text-sm text-gray-500">
            <div className="flex items-center">
              <Eye size={14} className="mr-1" />
              <span>{views} kali dilihat</span>
            </div>
            <div className="flex items-center">
              <ShoppingBag size={14} className="mr-1" />
              <span>{ordersCount} pesanan</span>
            </div>
          </div>
        </div>
        
        <div className="flex border-t border-gray-100">
          <Button 
            variant="ghost" 
            className="flex-1 rounded-none text-sm h-10 border-r border-gray-100"
            onClick={() => navigate(`/service/${id}`)}
          >
            <Eye size={16} className="mr-1" /> Lihat
          </Button>
          <Button 
            variant="ghost" 
            className="flex-1 rounded-none text-sm h-10"
            onClick={() => navigate(`/edit-service/${id}`)}
          >
            <Pencil size={16} className="mr-1" /> Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;


import React from 'react';
import ServiceCard from './ServiceCard';
import EmptyState from '../shared/EmptyState';
import LoadingIndicator from '../shared/LoadingIndicator';
import { Button } from '@/components/ui/button';
import { Plus, Wrench, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Service {
  id: string;
  title: string;
  price: number;
  status: string;
  views: number;
  ordersCount: number;
}

interface ServicesListProps {
  services: Service[];
  loading: boolean;
  status: 'active' | 'inactive' | 'draft';
  onStatusToggle: (serviceId: string, currentStatus: string) => void;
}

const ServicesList = ({ services, loading, status, onStatusToggle }: ServicesListProps) => {
  const navigate = useNavigate();
  const filteredServices = services.filter(service => service.status === status);
  
  const statusText = {
    'active': 'aktif',
    'inactive': 'nonaktif',
    'draft': 'draft'
  };

  const statusIcon = {
    'active': Wrench,
    'inactive': AlertCircle,
    'draft': AlertCircle
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (filteredServices.length === 0) {
    return (
      <EmptyState 
        icon={statusIcon[status]}
        title={`Belum Ada Layanan ${status === 'active' ? 'Aktif' : status === 'inactive' ? 'Nonaktif' : 'Draft'}`}
        description={`Anda belum memiliki layanan yang ${statusText[status]}`}
        action={
          status === 'active' ? 
          <Button 
            onClick={() => navigate('/create-service')}
            size="sm"
            className="mx-auto"
          >
            <Plus className="w-4 h-4 mr-1" /> Tambah Layanan
          </Button> : null
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {filteredServices.map(service => (
        <ServiceCard
          key={service.id}
          id={service.id}
          title={service.title}
          price={service.price}
          status={service.status}
          views={service.views}
          ordersCount={service.ordersCount}
          onStatusToggle={() => onStatusToggle(service.id, service.status)}
        />
      ))}
    </div>
  );
};

export default ServicesList;

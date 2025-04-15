
import ServiceCard from './ServiceCard';
import { Service } from '@/types/service';

interface ServicesListProps {
  services: Service[];
  title: string;
}

const ServicesList = ({ services = [], title }: ServicesListProps) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-2 gap-4">
        {services && services.length > 0 ? (
          services.map((service) => (
            <ServiceCard 
              key={service.id} 
              id={service.id}
              image={service.image}
              title={service.title}
              providerName={service.providerName}
              rating={service.rating}
              price={service.price}
              distance={service.distance}
            />
          ))
        ) : (
          <div className="col-span-2 py-10 text-center text-gray-500">
            Tidak ada layanan tersedia saat ini
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesList;

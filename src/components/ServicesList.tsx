
import ServiceCard from './ServiceCard';

interface Service {
  id: string;
  image: string;
  title: string;
  providerName: string;
  rating: number;
  price: number;
  distance: number;
}

interface ServicesListProps {
  services: Service[];
  title: string;
}

const ServicesList = ({ services, title }: ServicesListProps) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <div className="grid grid-cols-2 gap-3">
        {services.map((service) => (
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
        ))}
      </div>
    </div>
  );
};

export default ServicesList;

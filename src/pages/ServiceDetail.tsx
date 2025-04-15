
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star, MapPin, MessageCircle, ChevronLeft } from 'lucide-react';
import { serviceDetail } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import ReviewItem from '@/components/reviews/ReviewItem';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentImage, setCurrentImage] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  // In a real app, you would fetch this data based on the ID
  const service = serviceDetail;
  
  useEffect(() => {
    document.title = `${service.title} | KlikJasa`;
    window.scrollTo(0, 0);
    
    // Check authentication status
    checkAuth();
  }, [service.title]);
  
  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession();
    setIsAuthenticated(!!data.session);
  };
  
  const handleRequestBooking = () => {
    if (isAuthenticated) {
      navigate(`/booking-confirmation/${id}`);
    } else {
      toast({
        title: "Login Diperlukan",
        description: "Anda perlu login terlebih dahulu untuk memesan layanan ini.",
      });
      // Store service ID in localStorage to redirect back after login
      localStorage.setItem('redirectAfterLogin', `/service/${id}`);
      navigate('/login');
    }
  };
  
  const handleChat = () => {
    if (isAuthenticated) {
      navigate('/chat');
    } else {
      toast({
        title: "Login Diperlukan",
        description: "Anda perlu login terlebih dahulu untuk menggunakan fitur chat.",
      });
      localStorage.setItem('redirectAfterLogin', `/service/${id}`);
      navigate('/login');
    }
  };
  
  return (
    <div className="animate-fade-in pb-8">
      {/* Header images with gallery */}
      <div className="relative h-64">
        <button 
          className="absolute left-4 top-4 z-10 bg-white/80 p-1.5 rounded-full"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={20} />
        </button>
        <img 
          src={service.images[currentImage]} 
          alt={service.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 right-4 flex space-x-2">
          {service.images.map((_, idx) => (
            <button 
              key={idx} 
              className={`w-2 h-2 rounded-full ${idx === currentImage ? 'bg-white' : 'bg-white/50'}`}
              onClick={() => setCurrentImage(idx)}
            />
          ))}
        </div>
      </div>
      
      <div className="px-4">
        {/* Provider info */}
        <div className="flex items-center -mt-6 relative">
          <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden">
            <img 
              src={service.providerImage} 
              alt={service.providerName} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-2">
            <h3 className="font-medium">{service.providerName}</h3>
            <div className="flex items-center text-sm">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <span className="ml-1">{service.rating}</span>
              <span className="ml-1 text-gray-500">({service.reviewCount} ulasan)</span>
            </div>
          </div>
        </div>
        
        {/* Service title and price */}
        <div className="mt-4">
          <h1 className="text-xl font-bold">{service.title}</h1>
          <p className="text-lg font-semibold mt-2 text-marketplace-primary">
            Rp {service.price.toLocaleString()}
          </p>
        </div>
        
        {/* Location */}
        <div className="flex items-center mt-3 text-sm text-gray-600">
          <MapPin size={16} />
          <span className="ml-1">{service.location}</span>
          <span className="ml-2 text-xs">({service.serviceArea})</span>
        </div>
        
        {/* Description */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Deskripsi</h2>
          <div className="text-sm whitespace-pre-line">
            {service.description}
          </div>
        </div>
        
        {/* Reviews */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Ulasan Pelanggan</h2>
          <div>
            {service.reviews.map((review, idx) => (
              <ReviewItem
                key={idx}
                name={review.name}
                date={review.date}
                rating={review.rating}
                content={review.content}
              />
            ))}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="mt-8 flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 flex items-center justify-center"
            onClick={handleChat}
          >
            <MessageCircle size={18} className="mr-2" />
            Chat
          </Button>
          <Button 
            className="flex-1 bg-marketplace-primary hover:bg-marketplace-secondary"
            onClick={handleRequestBooking}
          >
            Pesan Layanan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;

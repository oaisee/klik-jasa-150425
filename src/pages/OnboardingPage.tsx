
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const onboardingSlides = [
  {
    title: "Temukan Layanan Lokal",
    description: "Temukan jasa dan layanan berkualitas dari penyedia di sekitar Anda",
    image: "/lovable-uploads/3e7ce3dd-6c4b-47e9-971d-7483e3d4ab64.png"
  },
  {
    title: "Booking Mudah",
    description: "Pesan jasa dengan mudah dan bayar langsung kepada penyedia jasa",
    image: "/lovable-uploads/3e7ce3dd-6c4b-47e9-971d-7483e3d4ab64.png"
  },
  {
    title: "Bergabunglah Sekarang",
    description: "Pilih jenis akun yang sesuai dengan kebutuhan Anda",
    image: "/lovable-uploads/3e7ce3dd-6c4b-47e9-971d-7483e3d4ab64.png",
    isLast: true
  }
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    document.title = 'Selamat Datang di KlikJasa';
  }, []);

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  const handleUserTypeSelection = (type: 'user' | 'provider') => {
    // In a real app, you'd set the user type in context/state
    // and redirect to the appropriate registration flow
    if (type === 'provider') {
      navigate('/provider-mode');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex justify-between items-center p-4">
        {currentSlide > 0 ? (
          <button 
            onClick={handlePrevious}
            className="p-2 text-gray-500 hover:text-marketplace-primary"
          >
            <ChevronLeft size={24} />
          </button>
        ) : (
          <div className="w-8"></div>
        )}
        
        <button 
          onClick={handleSkip} 
          className="text-sm font-medium text-marketplace-primary"
        >
          Lewati
        </button>
      </div>
      
      <Carousel 
        className="flex-1 w-full"
        setApi={(api) => {
          if (api) {
            api.on('select', () => {
              setCurrentSlide(api.selectedScrollSnap());
            });
          }
        }}
      >
        <CarouselContent>
          {onboardingSlides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="h-full flex flex-col items-center justify-center px-6 py-8 text-center">
                <div className={`mb-10 ${index === currentSlide ? 'animate-bounce' : ''}`}>
                  <img 
                    src={slide.image} 
                    alt={slide.title} 
                    className="w-32 h-32 mx-auto mb-2"
                  />
                </div>
                
                <h2 className="text-2xl font-bold mb-3 text-marketplace-dark">
                  {slide.title}
                </h2>
                
                <p className="text-gray-500 mb-10 max-w-xs mx-auto">
                  {slide.description}
                </p>
                
                {slide.isLast && (
                  <div className="mt-8 w-full max-w-xs space-y-4">
                    <Button 
                      onClick={() => handleUserTypeSelection('user')}
                      className="w-full bg-marketplace-primary hover:bg-marketplace-primary/90"
                    >
                      Daftar sebagai Pengguna
                    </Button>
                    <Button 
                      onClick={() => handleUserTypeSelection('provider')}
                      variant="outline"
                      className="w-full border-marketplace-primary text-marketplace-primary hover:bg-marketplace-primary/10"
                    >
                      Daftar sebagai Penyedia Jasa
                    </Button>
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      {!onboardingSlides[currentSlide].isLast && (
        <div className="px-6 py-8">
          <div className="flex justify-center mb-8">
            {onboardingSlides.map((_, index) => (
              <div 
                key={index}
                className={`h-2 w-2 rounded-full mx-1 ${
                  currentSlide === index 
                    ? 'bg-marketplace-primary' 
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          
          <Button 
            onClick={handleNext}
            className="w-full bg-marketplace-primary hover:bg-marketplace-primary/90"
          >
            Lanjut <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default OnboardingPage;

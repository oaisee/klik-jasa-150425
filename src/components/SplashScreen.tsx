
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    // Check if splash screen has already been shown in this session
    const splashShown = sessionStorage.getItem('splashShown');
    
    if (splashShown) {
      // If already shown in this session, hide immediately
      navigate('/onboarding', { replace: true });
      return;
    }
    
    const timer = setTimeout(() => {
      // Fade out animation
      setVisible(false);
      
      // Navigate after animation completes and mark as shown
      setTimeout(() => {
        sessionStorage.setItem('splashShown', 'true');
        navigate('/onboarding', { replace: true });
      }, 500);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div 
      className={`fixed inset-0 bg-white flex flex-col items-center justify-center transition-opacity duration-500 z-50 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="animate-bounce mb-8">
        <img 
          src="/lovable-uploads/3e7ce3dd-6c4b-47e9-971d-7483e3d4ab64.png" 
          alt="KlikJasa Logo" 
          className="w-64 h-64" 
        />
      </div>
      <h1 className="text-4xl font-bold text-marketplace-primary relative">
        <span className="animate-scribble inline-block">KlikJasa</span>
      </h1>
    </div>
  );
};

export default SplashScreen;

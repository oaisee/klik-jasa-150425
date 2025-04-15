
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      // Fade out animation
      setVisible(false);
      
      // Navigate after animation completes
      setTimeout(() => {
        navigate('/onboarding');
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
      <div className="animate-bounce mb-6">
        <img 
          src="/lovable-uploads/3e7ce3dd-6c4b-47e9-971d-7483e3d4ab64.png" 
          alt="KlikJasa Logo" 
          className="w-24 h-24"
        />
      </div>
      <h1 className="text-2xl font-bold text-marketplace-primary mt-4">KlikJasa</h1>
      <p className="text-gray-500 mt-2">Layanan lokal terpercaya</p>
    </div>
  );
};

export default SplashScreen;

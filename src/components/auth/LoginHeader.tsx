
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const LoginHeader = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center p-4">
        <button 
          onClick={() => navigate('/onboarding')}
          className="p-2 text-gray-500 hover:text-marketplace-primary transition-colors"
          aria-label="Kembali"
        >
          <ArrowLeft size={24} />
        </button>
      </div>
      
      <div className="text-center mb-8 animate-fade-in">
        <img 
          src="/lovable-uploads/3e7ce3dd-6c4b-47e9-971d-7483e3d4ab64.png" 
          alt="KlikJasa Logo" 
          className="w-24 h-24 mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold text-marketplace-dark">Masuk ke KlikJasa</h1>
        <p className="text-gray-500 mt-2">Lanjutkan untuk mengakses layanan</p>
      </div>
    </>
  );
};

export default LoginHeader;

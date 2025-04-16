import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

interface ServiceCardProps {
  loading: boolean;
  profileComplete: boolean;
  hasServices: boolean;
}

const ServiceCard = ({ 
  loading, 
  profileComplete, 
  hasServices 
}: ServiceCardProps) => {
  const navigate = useNavigate();
  
  const handleCreateService = () => {
    navigate('/create-service');
  };
  
  const handleViewServices = () => {
    navigate('/bookings');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
      <h3 className="font-semibold text-lg mb-2">Layanan Anda</h3>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-marketplace-primary rounded-full"></div>
        </div>
      ) : (
        <>
          {!profileComplete ? (
            <p className="text-gray-500 mb-3">Anda perlu melengkapi profil untuk membuat layanan.</p>
          ) : (
            <>
              {hasServices ? (
                <div className="space-y-3">
                  <p className="text-gray-600">Anda sudah memiliki layanan yang ditawarkan.</p>
                  <button 
                    onClick={handleViewServices}
                    className="w-full bg-marketplace-primary text-white py-3 rounded-lg flex items-center justify-center"
                  >
                    Lihat Layanan Saya
                  </button>
                  <button 
                    onClick={handleCreateService}
                    className="w-full border border-marketplace-primary text-marketplace-primary py-3 rounded-lg flex items-center justify-center"
                  >
                    <PlusCircle size={18} className="mr-2" />
                    Tambah Layanan Baru
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-gray-600">Anda belum memiliki layanan yang ditawarkan.</p>
                  <button 
                    onClick={handleCreateService}
                    className="w-full bg-marketplace-primary text-white py-3 rounded-lg flex items-center justify-center"
                  >
                    <PlusCircle size={18} className="mr-2" />
                    Buat Layanan Pertama
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ServiceCard;

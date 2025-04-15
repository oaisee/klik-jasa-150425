
import { User, Plus, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ServiceCardProps {
  loading: boolean;
  profileComplete: boolean;
  hasServices: boolean;
}

const ServiceCard = ({ loading, profileComplete, hasServices }: ServiceCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        {loading ? (
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-marketplace-primary"></div>
          </div>
        ) : !profileComplete ? (
          <div className="text-center mb-4">
            <p className="text-amber-600 font-medium mb-2">Lengkapi profil Anda untuk dapat menambahkan jasa</p>
            <Button 
              className="w-full flex items-center justify-center"
              onClick={() => navigate('/edit-profile')}
            >
              <User size={18} className="mr-2" />
              Lengkapi Profil
            </Button>
          </div>
        ) : hasServices ? (
          <div className="text-center mb-4">
            <p className="text-green-600 font-medium mb-2">Anda telah memiliki jasa yang ditawarkan</p>
            <Button 
              className="w-full flex items-center justify-center"
              onClick={() => navigate('/create-service')}
            >
              <Plus size={18} className="mr-2" />
              Tambah Jasa Lainnya
            </Button>
          </div>
        ) : (
          <div className="text-center mb-4">
            <p className="text-gray-500 mb-4">Anda belum memiliki jasa yang ditawarkan</p>
            <Button 
              className="w-full flex items-center justify-center"
              onClick={() => navigate('/create-service')}
              disabled={!profileComplete}
            >
              <Plus size={18} className="mr-2" />
              Tambah Jasa Baru
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceCard;


import { useEffect } from 'react';
import { ArrowLeft, HelpCircle, FileText, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const HelpPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Pusat Bantuan | KlikJasa';
  }, []);

  return (
    <div className="px-4 py-4 pb-20 animate-fade-in">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Pusat Bantuan</h1>
      </div>

      <div className="space-y-4">
        <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center">
              <FileText size={20} className="mr-3 text-gray-500" />
              <span>FAQ & Pertanyaan Umum</span>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center">
              <HelpCircle size={20} className="mr-3 text-gray-500" />
              <span>Cara Menggunakan KlikJasa</span>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Mail size={20} className="mr-3 text-gray-500" />
              <span>Kontak Email</span>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Phone size={20} className="mr-3 text-gray-500" />
              <span>Hubungi Kami</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpPage;

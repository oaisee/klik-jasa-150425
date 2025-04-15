
import { useEffect } from 'react';
import { ArrowLeft, Globe, Bell, Moon, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

const SettingsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Pengaturan | KlikJasa';
  }, []);

  return (
    <div className="px-4 py-4 pb-20 animate-fade-in">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Pengaturan</h1>
      </div>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell size={20} className="mr-3 text-gray-500" />
                <span>Notifikasi</span>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Moon size={20} className="mr-3 text-gray-500" />
                <span>Mode Gelap</span>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Globe size={20} className="mr-3 text-gray-500" />
                <span>Bahasa</span>
              </div>
              <span className="text-sm text-gray-500">Indonesia</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Lock size={20} className="mr-3 text-gray-500" />
                <span>Privasi</span>
              </div>
              <span className="text-sm text-gray-500">Kelola</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;

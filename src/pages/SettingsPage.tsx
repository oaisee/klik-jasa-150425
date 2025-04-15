
import { useState, useEffect } from 'react';
import { ArrowLeft, Globe, Bell, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("Indonesia");

  useEffect(() => {
    document.title = 'Pengaturan | KlikJasa';
  }, []);

  const handleNotificationsChange = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    toast({
      title: newValue ? "Notifikasi Diaktifkan" : "Notifikasi Dinonaktifkan",
      description: newValue 
        ? "Anda akan menerima notifikasi dari KlikJasa" 
        : "Anda tidak akan menerima notifikasi dari KlikJasa",
    });
  };

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    setLanguageOpen(false);
    toast({
      title: "Bahasa Diubah",
      description: `Bahasa aplikasi sekarang dalam ${language}`,
    });
  };

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
              <Switch 
                checked={notificationsEnabled} 
                onCheckedChange={handleNotificationsChange} 
              />
            </div>
          </CardContent>
        </Card>

        <Dialog open={languageOpen} onOpenChange={setLanguageOpen}>
          <Card>
            <DialogTrigger asChild>
              <CardContent className="p-4 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Globe size={20} className="mr-3 text-gray-500" />
                    <span>Bahasa</span>
                  </div>
                  <span className="text-sm text-gray-500">{currentLanguage}</span>
                </div>
              </CardContent>
            </DialogTrigger>
          </Card>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Pilih Bahasa</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 mt-2">
              <Button
                variant={currentLanguage === "Indonesia" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => handleLanguageChange("Indonesia")}
              >
                Indonesia
              </Button>
              <Button
                variant={currentLanguage === "English" ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => handleLanguageChange("English")}
              >
                English
              </Button>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setLanguageOpen(false)}>
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card>
          <CardContent className="p-4 cursor-pointer" onClick={() => navigate('/security')}>
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

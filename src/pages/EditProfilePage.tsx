
import { useEffect } from 'react';
import { ArrowLeft, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar } from '@/components/ui/avatar';

const EditProfilePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Edit Profil | KlikJasa';
  }, []);

  return (
    <div className="px-4 py-4 pb-20 animate-fade-in">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Edit Profil</h1>
      </div>

      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <img 
              src="https://randomuser.me/api/portraits/men/42.jpg" 
              alt="Profile" 
              className="rounded-full object-cover w-full h-full"
            />
          </Avatar>
          <button className="absolute bottom-0 right-0 bg-marketplace-primary text-white p-2 rounded-full">
            <Camera size={16} />
          </button>
        </div>
      </div>

      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" defaultValue="Rahmat Hidayat" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue="rahmat.hidayat@example.com" />
            </div>
            <div>
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input id="phone" defaultValue="+62 812 3456 7890" />
            </div>
            <div>
              <Label htmlFor="address">Alamat</Label>
              <Input id="address" defaultValue="Jl. Merdeka No. 123, Jakarta" />
            </div>

            <Button className="w-full">Simpan Perubahan</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProfilePage;

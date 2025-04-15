
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
}

interface ProfileFormProps {
  userData: ProfileFormData;
  loading: boolean;
  saving: boolean;
  uploadingAvatar: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: () => Promise<void>;
}

const ProfileForm = ({ 
  userData, 
  loading, 
  saving, 
  uploadingAvatar,
  onChange, 
  onSave 
}: ProfileFormProps) => {
  if (loading) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin text-marketplace-primary" />
          <p className="ml-2">Memuat data profil...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input 
              id="name" 
              value={userData.name} 
              onChange={onChange}
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              value={userData.email} 
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah</p>
          </div>
          
          <div>
            <Label htmlFor="phone">Nomor Telepon</Label>
            <Input 
              id="phone" 
              value={userData.phone} 
              onChange={onChange}
            />
          </div>
          
          <div>
            <Label htmlFor="address">Alamat</Label>
            <Input 
              id="address" 
              value={userData.address} 
              onChange={onChange}
            />
          </div>
          
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio" 
              value={userData.bio} 
              onChange={onChange}
              placeholder="Ceritakan tentang diri Anda..."
              className="resize-none"
            />
          </div>

          <Button 
            className="w-full" 
            onClick={onSave}
            disabled={saving || uploadingAvatar}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Menyimpan...
              </>
            ) : 'Simpan Perubahan'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;

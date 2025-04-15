
import { Avatar } from '@/components/ui/avatar';
import { Camera, Loader2 } from 'lucide-react';

interface AvatarUploadProps {
  avatarUrl: string | null;
  avatarPreview: string | null;
  uploadingAvatar: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
}

const AvatarUpload = ({ 
  avatarUrl, 
  avatarPreview, 
  uploadingAvatar, 
  onChange,
  name
}: AvatarUploadProps) => {
  return (
    <div className="relative">
      <Avatar className="h-24 w-24">
        {avatarPreview ? (
          <img 
            src={avatarPreview} 
            alt="Profile Preview" 
            className="rounded-full object-cover w-full h-full"
          />
        ) : avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt="Profile" 
            className="rounded-full object-cover w-full h-full"
          />
        ) : (
          <div className="bg-gray-200 rounded-full w-full h-full flex items-center justify-center">
            <span className="text-2xl">{name.charAt(0)}</span>
          </div>
        )}
      </Avatar>
      <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-marketplace-primary text-white p-2 rounded-full cursor-pointer">
        {uploadingAvatar ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
      </label>
      <input 
        type="file" 
        id="avatar-upload" 
        className="hidden"
        accept="image/*"
        onChange={onChange}
        disabled={uploadingAvatar}
      />
    </div>
  );
};

export default AvatarUpload;

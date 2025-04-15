
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AvatarUpload from '@/components/profile/AvatarUpload';
import ProfileForm from '@/components/profile/ProfileForm';
import { useEditProfile } from '@/hooks/useEditProfile';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const {
    userData,
    loading,
    saving,
    uploadingAvatar,
    avatarPreview,
    handleInputChange,
    handleAvatarChange,
    handleSaveProfile
  } = useEditProfile();

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
        <AvatarUpload
          avatarUrl={userData.avatarUrl}
          avatarPreview={avatarPreview}
          uploadingAvatar={uploadingAvatar}
          onChange={handleAvatarChange}
          name={userData.name}
        />
      </div>

      <ProfileForm
        userData={userData}
        loading={loading}
        saving={saving}
        uploadingAvatar={uploadingAvatar}
        onChange={handleInputChange}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default EditProfilePage;

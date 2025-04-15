
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProfileSummary from '@/components/profile/ProfileSummary';
import ProfileMenu from '@/components/profile/ProfileMenu';
import UserRoleToggle from '@/components/profile/UserRoleToggle';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { loading, userData, fetchUserProfile } = useProfile();
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    document.title = 'Profil | KlikJasa';
    
    // Get current user session
    const getUserId = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUserId(session.user.id);
        }
      } catch (error) {
        console.error('Error fetching user session:', error);
      }
    };
    
    getUserId();
  }, []);

  const handleRoleChange = () => {
    // Refresh profile data after role change
    fetchUserProfile();
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 animate-fade-in">
      <div className="bg-white px-4 py-3 flex items-center shadow-sm">
        <button 
          onClick={() => navigate(-1)} 
          className="mr-3"
          aria-label="Kembali"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold">Profil</h1>
      </div>
      
      <div className="flex-1 px-4 pb-24 pt-4">
        <ProfileSummary 
          fullName={userData.name}
          joinDate={userData.joinDate}
          rating={userData.rating} 
          totalReviews={userData.reviews}
          avatarUrl={userData.avatarUrl}
          isLoading={loading}
        />
        
        {userId && (
          <div className="mt-4 mb-6">
            <UserRoleToggle 
              isProvider={userData.isProvider} 
              userId={userId}
              onRoleChange={handleRoleChange}
            />
          </div>
        )}
        
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Pengaturan Akun</h2>
          <ProfileMenu />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

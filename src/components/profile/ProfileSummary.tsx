
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Star, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileSummaryProps {
  loading: boolean;
  userData: {
    name: string;
    rating: number;
    reviews: number;
    joinDate: string;
    avatarUrl: string | null;
    isProvider: boolean;
  };
}

const ProfileSummary = ({ loading, userData }: ProfileSummaryProps) => {
  const navigate = useNavigate();

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-marketplace-primary" />
            <p className="ml-2">Memuat data profil...</p>
          </div>
        ) : (
          <div className="flex items-center">
            <Avatar className="h-16 w-16 mr-4">
              {userData.avatarUrl ? (
                <img 
                  src={userData.avatarUrl} 
                  alt="Profile" 
                  className="rounded-full object-cover w-full h-full"
                />
              ) : (
                <div className="bg-gray-200 rounded-full w-full h-full flex items-center justify-center">
                  <span className="text-lg">{userData.name.charAt(0)}</span>
                </div>
              )}
            </Avatar>
            <div>
              <h2 className="font-semibold text-lg">{userData.name}</h2>
              <div className="flex items-center text-sm text-gray-500">
                <Star className="w-4 h-4 text-yellow-400 mr-1 fill-yellow-400" />
                <span>{userData.rating.toFixed(1)} ({userData.reviews} ulasan)</span>
              </div>
              <p className="text-sm text-gray-500">{userData.joinDate}</p>
            </div>
          </div>
        )}
        
        <div className="mt-4 flex justify-between">
          <Button className="flex-1 mr-2" variant="outline" onClick={() => navigate('/edit-profile')}>
            Edit Profil
          </Button>
          <Button 
            className="flex-1 ml-2" 
            variant={userData.isProvider ? "default" : "outline"}
            onClick={() => navigate('/provider-mode')}
          >
            {userData.isProvider ? "Mode Penyedia" : "Jadi Penyedia"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSummary;

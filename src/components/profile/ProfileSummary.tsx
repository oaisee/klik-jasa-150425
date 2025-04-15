
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface ProfileSummaryProps {
  fullName: string;
  joinDate: string;
  rating: number;
  totalReviews: number;
  avatarUrl: string | null;
  isLoading: boolean;
  isProvider?: boolean;
}

const ProfileSummary = ({
  fullName,
  joinDate,
  rating,
  totalReviews,
  avatarUrl,
  isLoading,
  isProvider = false
}: ProfileSummaryProps) => {
  const navigate = useNavigate();

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-marketplace-primary" />
            <p className="ml-2">Memuat data profil...</p>
          </div>
        ) : (
          <div className="flex items-center">
            <Avatar className="h-16 w-16 mr-4">
              {avatarUrl ? (
                <AvatarImage 
                  src={avatarUrl} 
                  alt="Profile" 
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="bg-gray-200">
                  {fullName.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="font-semibold text-lg">{fullName}</h2>
              <div className="flex items-center text-sm text-gray-500">
                <Star className="w-4 h-4 text-yellow-400 mr-1 fill-yellow-400" />
                <span>{rating.toFixed(1)} ({totalReviews} ulasan)</span>
              </div>
              <p className="text-sm text-gray-500">{joinDate}</p>
            </div>
          </div>
        )}
        
        <div className="mt-4 flex justify-between">
          <Button className="flex-1 mr-2" variant="outline" onClick={() => navigate('/edit-profile')}>
            Edit Profil
          </Button>
          <Button 
            className="flex-1 ml-2" 
            variant={isProvider ? "default" : "outline"}
            onClick={() => navigate('/wallet')}
          >
            Lihat Wallet
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSummary;

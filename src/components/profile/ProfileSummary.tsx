
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Loader2, Edit, Wallet } from 'lucide-react';
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
    <Card className="mb-6 border-gray-100 shadow-md overflow-hidden animate-fade-in">
      <div className="h-16 bg-gradient-to-r from-marketplace-primary to-marketplace-secondary"></div>
      <CardContent className="p-5 -mt-8">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-marketplace-primary" />
            <p className="ml-2">Memuat data profil...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Avatar className="h-20 w-20 border-4 border-white shadow-md">
              {avatarUrl ? (
                <AvatarImage 
                  src={avatarUrl} 
                  alt="Profile" 
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="bg-marketplace-primary bg-opacity-10 text-marketplace-primary">
                  {fullName.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="text-center mt-3">
              <h2 className="font-semibold text-lg text-gray-800">{fullName}</h2>
              <div className="flex items-center justify-center text-sm text-gray-500 mt-1">
                <Star className="w-4 h-4 text-yellow-400 mr-1 fill-yellow-400" />
                <span>{rating.toFixed(1)} ({totalReviews} ulasan)</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{joinDate}</p>
            </div>
          </div>
        )}
        
        <div className="mt-6 flex justify-between">
          <Button 
            className="flex-1 mr-2 hover:shadow-md transition-all duration-200" 
            variant="outline" 
            onClick={() => navigate('/edit-profile')}
          >
            <Edit size={16} className="mr-2" />
            Edit Profil
          </Button>
          <Button 
            className="flex-1 ml-2 hover:shadow-md transition-all duration-200" 
            variant={isProvider ? "default" : "outline"}
            onClick={() => navigate('/wallet')}
          >
            <Wallet size={16} className="mr-2" />
            Lihat Wallet
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSummary;


import { ProfileFormData } from '@/types/profile';

export const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  userData: ProfileFormData,
  setUserData: React.Dispatch<React.SetStateAction<ProfileFormData>>
) => {
  const { id, value } = e.target;
  setUserData(prev => ({
    ...prev,
    [id]: value
  }));
};

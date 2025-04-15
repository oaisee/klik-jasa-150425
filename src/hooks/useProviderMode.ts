
import { useState, useEffect } from 'react';
import { useProviderAuth } from './providerMode/useProviderAuth';
import { useProviderProfile } from './providerMode/useProviderProfile';
import { useProviderServices } from './providerMode/useProviderServices';

export const useProviderMode = () => {
  const { userId } = useProviderAuth();
  const { profileComplete, profileData, getMissingFields } = useProviderProfile(userId);
  const { hasServices, loading } = useProviderServices(userId);

  return {
    hasServices,
    loading,
    profileComplete,
    profileData,
    getMissingFields
  };
};


import React from 'react';
import Layout from '@/components/Layout';
import SplashScreen from '@/components/SplashScreen';
import HomeHeader from '@/components/home/HomeHeader';
import HomeContent from '@/components/home/HomeContent';
import { useHomePageData } from '@/hooks/useHomePageData';

const Index = () => {
  const {
    isLoading,
    isAuthenticated,
    walletBalance,
    hasNotifications,
    services,
    selectedCategory,
    searchQuery,
    handleCategoryClick,
    handleSearch
  } = useHomePageData();
  
  if (isLoading) {
    return <SplashScreen />;
  }
  
  return (
    <Layout>
      <div className="px-4 py-5 animate-fade-in">
        <HomeHeader 
          isAuthenticated={isAuthenticated} 
          walletBalance={walletBalance} 
          hasNotifications={hasNotifications} 
        />
        
        <HomeContent 
          services={services}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onCategoryClick={handleCategoryClick}
          onSearch={handleSearch}
        />
      </div>
    </Layout>
  );
};

export default Index;

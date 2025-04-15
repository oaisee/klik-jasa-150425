
import React, { useEffect } from 'react';
import BottomNavigation from './BottomNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Log when layout renders to help debug
  useEffect(() => {
    console.log("Layout component mounted");
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 pb-20">
        <div className="app-container">
          {children}
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;

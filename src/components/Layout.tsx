
import React, { useEffect } from 'react';
import BottomNavigation from './BottomNavigation';

interface LayoutProps {
  children: React.ReactNode;
  headerColor?: 'light' | 'dark';
}

const Layout: React.FC<LayoutProps> = ({ children, headerColor = 'light' }) => {
  // Set the theme-color meta tag based on the header color
  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const statusBarStyle = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    
    if (headerColor === 'dark') {
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#1EAEDB');
      if (statusBarStyle) statusBarStyle.setAttribute('content', 'light-content');
      document.documentElement.classList.add('status-bar-dark');
      document.documentElement.classList.remove('status-bar-light');
    } else {
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#ffffff');
      if (statusBarStyle) statusBarStyle.setAttribute('content', 'default');
      document.documentElement.classList.add('status-bar-light');
      document.documentElement.classList.remove('status-bar-dark');
    }
  }, [headerColor]);

  return (
    <div className="flex flex-col min-h-screen max-w-full w-full bg-gray-50">
      <main className="flex-1 pb-16">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import LoginHeader from '@/components/auth/LoginHeader';
import LoginForm from '@/components/auth/LoginForm';
import LoginOptions from '@/components/auth/LoginOptions';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking auth:", error);
          return;
        }
        
        if (data.session) {
          console.log("User already authenticated, redirecting...");
          setIsAuthenticated(true);
          // Redirect to home page if already authenticated
          navigate('/', { replace: true });
        }
      } catch (err) {
        console.error("Error in auth check:", err);
      }
    };
    
    checkAuth();
  }, [navigate]);

  // If already authenticated, don't render the login form
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <LoginHeader />
      
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10">
        <div className="w-full max-w-md space-y-8">
          <LoginForm />
          <LoginOptions />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

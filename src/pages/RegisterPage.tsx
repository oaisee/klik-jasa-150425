
import { useLocation } from 'react-router-dom';
import RegisterHeader from '@/components/auth/RegisterHeader';
import RegisterForm from '@/components/auth/RegisterForm';

const RegisterPage = () => {
  const location = useLocation();
  const isProvider = location.search.includes('provider=true');
  
  return (
    <div className="min-h-screen bg-white">
      <RegisterHeader isProvider={isProvider} />
      
      <div className="container max-w-md mx-auto px-6 pb-10">
        <RegisterForm isProvider={isProvider} />
      </div>
    </div>
  );
};

export default RegisterPage;

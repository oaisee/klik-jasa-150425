
import { useLocation } from 'react-router-dom';
import RegisterHeader from '@/components/auth/RegisterHeader';
import RegisterForm from '@/components/auth/RegisterForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const location = useLocation();
  const isProvider = location.search.includes('provider=true');
  
  return (
    <div className="min-h-screen bg-white">
      <RegisterHeader isProvider={isProvider} />
      
      <div className="container max-w-md mx-auto px-6 pb-10">
        {isProvider && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            <AlertDescription className="text-blue-800">
              Sebagai penyedia jasa, Anda perlu mengunggah foto KTP untuk verifikasi identitas.
            </AlertDescription>
          </Alert>
        )}
        
        <RegisterForm isProvider={isProvider} />
      </div>
    </div>
  );
};

export default RegisterPage;

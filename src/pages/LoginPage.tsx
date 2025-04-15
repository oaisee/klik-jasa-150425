
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Dummy login logic - in a real app, this would connect to an auth service
    try {
      if (email && password) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        navigate('/', { replace: true });
      } else {
        setError('Mohon isi semua kolom');
      }
    } catch (err) {
      setError('Terjadi kesalahan, silakan coba lagi');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="flex items-center mb-8">
        <button 
          onClick={() => navigate('/onboarding')}
          className="p-2 text-gray-500 hover:text-marketplace-primary"
        >
          <ArrowLeft size={24} />
        </button>
      </div>
      
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/3e7ce3dd-6c4b-47e9-971d-7483e3d4ab64.png" 
            alt="KlikJasa Logo" 
            className="w-24 h-24 mx-auto mb-2"
          />
          <h1 className="text-2xl font-bold text-marketplace-dark">Masuk ke KlikJasa</h1>
          <p className="text-gray-500 mt-2">Masukkan detail akun Anda</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <Input 
                id="email"
                type="email" 
                placeholder="nama@email.com" 
                className="pl-10" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Kata Sandi</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <Input 
                id="password"
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="pl-10" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-marketplace-primary">
              Lupa kata sandi?
            </Link>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-marketplace-primary hover:bg-marketplace-primary/90"
            disabled={loading}
            size="lg"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </Button>
          
          <div className="text-center">
            <p className="text-gray-500">
              Belum punya akun?{' '}
              <Link to="/register" className="text-marketplace-primary font-medium">
                Daftar
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

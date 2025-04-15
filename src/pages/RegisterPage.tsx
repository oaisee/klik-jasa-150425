
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Lock, ArrowLeft, Eye, EyeOff, Phone, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isProvider = location.search.includes('provider=true');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!name || !email || !phone || !password || !confirmPassword) {
      setError('Mohon isi semua kolom');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Kata sandi tidak cocok');
      return;
    }
    
    setLoading(true);
    
    // Dummy registration logic - in a real app, this would connect to an auth service
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect based on user type
      if (isProvider) {
        navigate('/provider-mode', { replace: true });
      } else {
        navigate('/', { replace: true });
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
          <h1 className="text-2xl font-bold text-marketplace-dark">
            Daftar {isProvider ? 'Penyedia Jasa' : 'Pengguna'}
          </h1>
          <p className="text-gray-500 mt-2">Buat akun baru untuk mulai menggunakan KlikJasa</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <User size={18} />
              </div>
              <Input 
                id="name"
                type="text" 
                placeholder="Nama lengkap" 
                className="pl-10" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          
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
            <Label htmlFor="phone">Nomor Telepon</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Phone size={18} />
              </div>
              <Input 
                id="phone"
                type="tel" 
                placeholder="08xxxxxxxxxx" 
                className="pl-10" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <UserCheck size={18} />
              </div>
              <Input 
                id="confirmPassword"
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="pl-10" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-marketplace-primary hover:bg-marketplace-primary/90 mt-6"
            disabled={loading}
            size="lg"
          >
            {loading ? 'Memproses...' : 'Daftar Sekarang'}
          </Button>
          
          <div className="text-center mt-4">
            <p className="text-gray-500">
              Sudah memiliki akun?{' '}
              <Link to="/login" className="text-marketplace-primary font-medium">
                Masuk
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;


import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Lock, ArrowLeft, Eye, EyeOff, Phone, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from "sonner";

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
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !phone || !password || !confirmPassword) {
      toast.error("Mohon isi semua kolom");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Kata sandi tidak cocok");
      return;
    }
    
    if (!agreeTerms) {
      toast.error("Anda harus menyetujui syarat dan ketentuan");
      return;
    }
    
    setLoading(true);
    
    // Dummy registration logic - in a real app, this would connect to an auth service
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Pendaftaran berhasil");
      
      // Redirect based on user type
      if (isProvider) {
        navigate('/provider-mode', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      toast.error("Terjadi kesalahan, silakan coba lagi");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center p-4">
        <button 
          onClick={() => navigate('/onboarding')}
          className="p-2 text-gray-500 hover:text-marketplace-primary transition-colors"
          aria-label="Kembali"
        >
          <ArrowLeft size={24} />
        </button>
      </div>
      
      <div className="container max-w-md mx-auto px-6 pb-10">
        <div className="text-center mb-8 animate-fade-in">
          <img 
            src="/lovable-uploads/3e7ce3dd-6c4b-47e9-971d-7483e3d4ab64.png" 
            alt="KlikJasa Logo" 
            className="w-20 h-20 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-marketplace-dark">
            Daftar {isProvider ? 'Penyedia Jasa' : 'Pengguna'}
          </h1>
          <p className="text-gray-500 mt-1">Buat akun untuk menggunakan KlikJasa</p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-4 animate-fade-in" style={{animationDelay: "100ms"}}>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">Nama Lengkap</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <User size={18} />
              </div>
              <Input 
                id="name"
                type="text" 
                placeholder="Nama lengkap" 
                className="pl-10 border-gray-200" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">Email</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <Input 
                id="email"
                type="email" 
                placeholder="nama@email.com" 
                className="pl-10 border-gray-200" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-700">Nomor Telepon</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Phone size={18} />
              </div>
              <Input 
                id="phone"
                type="tel" 
                placeholder="08xxxxxxxxxx" 
                className="pl-10 border-gray-200" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">Kata Sandi</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <Input 
                id="password"
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="pl-10 border-gray-200" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-700">Konfirmasi Kata Sandi</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <UserCheck size={18} />
              </div>
              <Input 
                id="confirmPassword"
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="pl-10 border-gray-200" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="flex items-start space-x-3 mt-4">
            <Checkbox 
              id="terms" 
              checked={agreeTerms}
              onCheckedChange={(checked) => setAgreeTerms(checked === true)}
              className="mt-1 data-[state=checked]:bg-marketplace-primary data-[state=checked]:border-marketplace-primary"
            />
            <Label 
              htmlFor="terms" 
              className="text-sm text-gray-600 font-normal leading-tight"
            >
              Saya menyetujui <Link to="/terms" className="text-marketplace-primary hover:underline">Syarat dan Ketentuan</Link> serta <Link to="/privacy" className="text-marketplace-primary hover:underline">Kebijakan Privasi</Link> KlikJasa
            </Label>
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 mt-6 bg-marketplace-primary hover:bg-marketplace-primary/90 text-white font-medium transition-all shadow-sm hover:shadow-md"
            disabled={loading}
            size="lg"
          >
            {loading ? 'Memproses...' : 'Daftar Sekarang'}
          </Button>
          
          <div className="text-center mt-6">
            <p className="text-gray-500">
              Sudah memiliki akun?{' '}
              <Link to="/login" className="text-marketplace-primary font-medium hover:underline">
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

import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
const LoginOptions = () => {
  return <>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Belum punya akun?</span>
        </div>
      </div>
      
      <div className="text-center">
        <Link to="/register" className="inline-block w-full py-3 px-4 border border-marketplace-primary text-marketplace-primary hover:bg-marketplace-primary/5 text-center rounded-md font-medium transition-colors">
          Daftar Sekarang
        </Link>
      </div>
      
      
    </>;
};
export default LoginOptions;
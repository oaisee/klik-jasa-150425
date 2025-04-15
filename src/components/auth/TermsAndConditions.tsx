
import { Link } from 'react-router-dom';
import { Label } from '@/components/ui/label';

const TermsAndConditions = () => {
  return (
    <Label 
      htmlFor="terms" 
      className="text-sm text-gray-600 font-normal leading-tight"
    >
      Saya menyetujui <Link to="/terms" className="text-marketplace-primary hover:underline">Syarat dan Ketentuan</Link> serta <Link to="/privacy" className="text-marketplace-primary hover:underline">Kebijakan Privasi</Link> KlikJasa
    </Label>
  );
};

export default TermsAndConditions;

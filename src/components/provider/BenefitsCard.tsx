
import { Card, CardContent } from '@/components/ui/card';

const BenefitsCard = () => {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">Keuntungan Menjadi Penyedia Jasa</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• Dapatkan pelanggan dari KlikJasa</li>
          <li>• Kelola jadwal Anda dengan fleksibel</li>
          <li>• Terima pembayaran secara langsung</li>
          <li>• Bangun profil dan ulasan Anda</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default BenefitsCard;

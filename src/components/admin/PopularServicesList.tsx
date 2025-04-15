
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import PopularServiceItem from './PopularServiceItem';

const PopularServicesList = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Layanan Populer</CardTitle>
        <CardDescription>Berdasarkan jumlah booking</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          <PopularServiceItem
            title="Jasa Bersih Rumah"
            provider="Bersih Express"
            bookings={42}
            rating={4.8}
          />
          <PopularServiceItem
            title="Perbaikan AC"
            provider="TeknikPro"
            bookings={38}
            rating={4.6}
          />
          <PopularServiceItem
            title="Tukang Ledeng"
            provider="Pipa Jaya"
            bookings={35}
            rating={4.7}
          />
          <PopularServiceItem
            title="Tukang Masak"
            provider="Chef Rumahan"
            bookings={31}
            rating={4.9}
          />
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">Lihat Semua Layanan</Button>
      </CardFooter>
    </Card>
  );
};

export default PopularServicesList;

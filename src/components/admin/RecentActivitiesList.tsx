
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ActivityItem from './ActivityItem';

const RecentActivitiesList = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktivitas Terbaru</CardTitle>
        <CardDescription>10 transaksi terakhir pada platform</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          <ActivityItem
            type="booking"
            title="Booking Baru"
            description="Ahmad membooking Jasa Bersih Rumah"
            time="10 menit lalu"
          />
          <ActivityItem
            type="registration"
            title="Pengguna Baru"
            description="Budi mendaftar sebagai penyedia jasa"
            time="45 menit lalu"
          />
          <ActivityItem
            type="booking"
            title="Booking Baru"
            description="Siti membooking Jasa Memasak"
            time="2 jam lalu"
          />
          <ActivityItem
            type="service"
            title="Layanan Baru"
            description="Joko menambahkan Jasa Perbaikan AC"
            time="5 jam lalu"
          />
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">Lihat Semua Aktivitas</Button>
      </CardFooter>
    </Card>
  );
};

export default RecentActivitiesList;

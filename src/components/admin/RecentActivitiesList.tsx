
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import ActivityItem from './ActivityItem';
import { Service, Profile } from '@/types/database';

type ActivityType = 'booking' | 'service' | 'registration';

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  time: string;
}

const RecentActivitiesList = () => {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        
        // Fetch latest services
        const { data: services, error: servicesError } = await supabase
          .from('services')
          .select('*, provider:profiles(full_name)')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (servicesError) throw servicesError;
        
        // Fetch latest profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (profilesError) throw profilesError;
        
        // Create activities from services and profiles
        const serviceActivities: Activity[] = (services || []).map(service => ({
          id: service.id,
          type: 'service',
          title: 'Layanan Baru',
          description: `${(service.provider as any)?.full_name || 'Pengguna'} menambahkan ${service.title}`,
          time: formatTimeAgo(service.created_at || '')
        }));
        
        const registrationActivities: Activity[] = (profiles || []).map(profile => ({
          id: profile.id,
          type: 'registration',
          title: 'Pengguna Baru',
          description: `${profile.full_name || 'Pengguna'} telah mendaftar ${profile.is_provider ? 'sebagai penyedia jasa' : 'sebagai pengguna'}`,
          time: formatTimeAgo(profile.created_at || '')
        }));
        
        // Combine and sort activities
        const allActivities = [...serviceActivities, ...registrationActivities]
          .sort((a, b) => {
            const timeA = parseTimeAgo(a.time);
            const timeB = parseTimeAgo(b.time);
            return timeA - timeB;
          })
          .slice(0, 5);
        
        setActivities(allActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivities();
  }, []);
  
  // Helper function to format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) {
      return `${diffDay} hari lalu`;
    } else if (diffHour > 0) {
      return `${diffHour} jam lalu`;
    } else if (diffMin > 0) {
      return `${diffMin} menit lalu`;
    } else {
      return 'Baru saja';
    }
  };
  
  // Helper function to parse time ago for sorting
  const parseTimeAgo = (timeAgo: string) => {
    if (timeAgo === 'Baru saja') return 0;
    
    const [amount, unit] = timeAgo.split(' ');
    const value = parseInt(amount, 10);
    
    if (unit.includes('menit')) {
      return value * 60;
    } else if (unit.includes('jam')) {
      return value * 60 * 60;
    } else if (unit.includes('hari')) {
      return value * 24 * 60 * 60;
    }
    
    return 0;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktivitas Terbaru</CardTitle>
        <CardDescription>Transaksi terakhir pada platform</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-marketplace-primary"></div>
          </div>
        ) : activities.length > 0 ? (
          <ul className="space-y-4">
            {activities.map(activity => (
              <ActivityItem
                key={activity.id}
                type={activity.type}
                title={activity.title}
                description={activity.description}
                time={activity.time}
              />
            ))}
          </ul>
        ) : (
          <p className="text-center py-8 text-gray-500">
            Belum ada aktivitas terbaru
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">Lihat Semua Aktivitas</Button>
      </CardFooter>
    </Card>
  );
};

export default RecentActivitiesList;

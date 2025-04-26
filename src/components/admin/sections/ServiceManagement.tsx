
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  MoreHorizontal, 
  Search, 
  Edit2, 
  Eye, 
  Trash2,
  CheckCircle,
  XCircle,
  Map,
  Calendar,
  User
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Service } from '@/types/database';
import { formatRupiah } from '@/utils/admin';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ServiceWithProvider extends Service {
  provider?: {
    full_name?: string;
    avatar_url?: string;
  }
}

const ServiceDetailView = ({ 
  service, 
  onClose 
}: { 
  service: ServiceWithProvider | null;
  onClose: () => void;
}) => {
  const [loading, setLoading] = useState(true);
  const [serviceImages, setServiceImages] = useState<{id: string; image_url: string}[]>([]);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      if (!service) return;
      
      setLoading(true);
      try {
        // Fetch service images
        const { data: images, error } = await supabase
          .from('service_images')
          .select('id, image_url')
          .eq('service_id', service.id)
          .order('sort_order', { ascending: true });
        
        if (error) throw error;
        setServiceImages(images || []);
      } catch (error) {
        console.error('Error fetching service details:', error);
        toast.error('Gagal memuat detail layanan');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [service]);

  if (!service) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      ) : (
        <>
          {/* Image gallery */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {serviceImages.length > 0 ? (
              serviceImages.map((image) => (
                <img 
                  key={image.id}
                  src={image.image_url}
                  alt={service.title}
                  className="h-48 w-48 object-cover rounded-lg"
                />
              ))
            ) : (
              <div className="h-48 w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                Tidak ada gambar
              </div>
            )}
          </div>
          
          {/* Service information */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{service.title}</h3>
              <Badge variant="outline" className={`px-2 py-1 ${
                service.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'
              }`}>
                {service.status === 'active' ? (
                  <>
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Aktif
                  </>
                ) : (
                  <>
                    <XCircle className="mr-1 h-3 w-3" />
                    Tidak Aktif
                  </>
                )}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(service.created_at)}
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {service.provider?.full_name || 'Pengguna tidak diketahui'}
              </span>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium text-gray-700">Deskripsi</h4>
              <p className="mt-1 text-gray-600">{service.description || 'Tidak ada deskripsi'}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="font-medium text-gray-700">Kategori</h4>
                <p className="mt-1 text-gray-600">{service.category || '-'}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Harga</h4>
                <p className="mt-1 text-gray-600 font-medium">{formatRupiah(service.price)}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Lokasi</h4>
                <p className="mt-1 text-gray-600 flex items-center gap-1">
                  <Map className="h-3 w-3" />
                  {service.location || '-'}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Radius Layanan</h4>
                <p className="mt-1 text-gray-600">{service.service_radius || '-'} km</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const ServiceManagement = () => {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<ServiceWithProvider[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceWithProvider | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('services')
          .select(`
            *,
            provider:profiles(full_name, avatar_url)
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setServices(data || []);
      } catch (error) {
        console.error('Error fetching services:', error);
        toast.error('Gagal memuat data layanan');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filter services based on search query
  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    service.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleViewDetails = (service: ServiceWithProvider) => {
    setSelectedService(service);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    // Small delay before removing the service data from state
    setTimeout(() => setSelectedService(null), 300);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Manajemen Layanan</CardTitle>
          <CardDescription>Kelola semua layanan yang terdaftar di platform KlikJasa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari layanan berdasarkan judul atau kategori..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul Layanan</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal Dibuat</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-32">
                        {searchQuery ? 'Tidak ada layanan yang sesuai dengan pencarian' : 'Belum ada layanan yang ditambahkan'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredServices.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.title}</TableCell>
                        <TableCell>{service.category || '-'}</TableCell>
                        <TableCell>{formatRupiah(service.price)}</TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {service.status === 'active' ? (
                              <>
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Aktif
                              </>
                            ) : (
                              <>
                                <XCircle className="mr-1 h-3 w-3" />
                                Tidak Aktif
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(service.created_at)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="cursor-pointer" onClick={() => handleViewDetails(service)}>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>Lihat Detail</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <Edit2 className="mr-2 h-4 w-4" />
                                <span>Edit Layanan</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Hapus</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={handleCloseDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detail Layanan</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang layanan
            </DialogDescription>
          </DialogHeader>
          <ServiceDetailView 
            service={selectedService} 
            onClose={handleCloseDetails}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServiceManagement;

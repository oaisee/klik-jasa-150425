
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Upload, X, MapPin, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import LoadingIndicator from '@/components/shared/LoadingIndicator';

const formSchema = z.object({
  title: z.string().min(5, 'Judul minimal 5 karakter').max(100, 'Judul maksimal 100 karakter'),
  description: z.string().min(20, 'Deskripsi minimal 20 karakter').max(500, 'Deskripsi maksimal 500 karakter'),
  category: z.string().min(1, 'Pilih kategori'),
  price: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Harga harus berupa angka positif',
  }),
  location: z.string().min(5, 'Lokasi minimal 5 karakter'),
  serviceRadius: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 50, {
    message: 'Radius layanan harus antara 1-50 km',
  }),
});

const CreateServicePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      price: '',
      location: '',
      serviceRadius: '5',
    },
  });
  
  useEffect(() => {
    document.title = 'Tambah Jasa Baru | KlikJasa';
    
    // Check if user is logged in and is a provider
    const checkAuth = async () => {
      setCheckingAuth(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast.error("Silakan login terlebih dahulu");
          navigate('/login');
          return;
        }
        
        setUserId(session.user.id);
        
        // Check if user is a provider
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_provider')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (!profile.is_provider) {
          toast.error("Anda harus menjadi penyedia jasa untuk mengakses halaman ini");
          navigate('/provider');
          return;
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        toast.error("Terjadi kesalahan saat memeriksa otentikasi");
        navigate('/');
      } finally {
        setCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    const files = e.target.files;
    if (!files) return;
    
    const newFiles = Array.from(files);
    
    // Limit to maximum 5 images
    if (imageFiles.length + newFiles.length > 5) {
      toast.error("Maksimal 5 gambar");
      return;
    }
    
    // Create preview URLs
    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    
    setImageFiles([...imageFiles, ...newFiles]);
    setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
  };
  
  const removeImage = (index: number) => {
    // Release the object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index]);
    
    const updatedFiles = [...imageFiles];
    const updatedPreviewUrls = [...imagePreviewUrls];
    
    updatedFiles.splice(index, 1);
    updatedPreviewUrls.splice(index, 1);
    
    setImageFiles(updatedFiles);
    setImagePreviewUrls(updatedPreviewUrls);
  };
  
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (imageFiles.length === 0) {
      toast.error("Harap unggah setidaknya 1 gambar");
      return;
    }
    
    setLoading(true);
    
    try {
      // Convert price and service radius to numbers
      const price = Number(data.price);
      const serviceRadius = Number(data.serviceRadius);
      
      // Insert service to database
      const { data: service, error: serviceError } = await supabase
        .from('services')
        .insert({
          provider_id: userId,
          title: data.title,
          description: data.description,
          category: data.category,
          price: price,
          location: data.location,
          service_radius: serviceRadius,
          status: 'active'
        })
        .select()
        .single();
      
      if (serviceError) throw serviceError;
      
      // Upload images and create service_images records
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const fileName = `${Date.now()}_${i}_${file.name.replace(/\s+/g, '_')}`;
        const filePath = `service_images/${service.id}/${fileName}`;
        
        // Upload image to storage
        const { error: uploadError } = await supabase
          .storage
          .from('service_images')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: publicUrl } = supabase
          .storage
          .from('service_images')
          .getPublicUrl(filePath);
        
        // Create service_image record
        const { error: imageRecordError } = await supabase
          .from('service_images')
          .insert({
            service_id: service.id,
            image_url: publicUrl.publicUrl,
            sort_order: i
          });
        
        if (imageRecordError) throw imageRecordError;
      }
      
      toast.success("Jasa berhasil ditambahkan");
      navigate('/provider');
      
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error("Gagal menambahkan jasa. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };
  
  if (checkingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingIndicator size="lg" />
      </div>
    );
  }
  
  return (
    <div className="px-4 pb-20 animate-fade-in">
      <div className="sticky top-0 bg-white z-10 px-4 py-3 -mx-4 flex items-center shadow-sm">
        <button 
          onClick={() => navigate('/provider')} 
          className="mr-3"
          aria-label="Kembali"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold">Tambah Jasa Baru</h1>
      </div>
      
      <div className="py-4">
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center mb-4">
              <Info size={18} className="text-amber-500 mr-2" />
              <p className="text-sm text-gray-600">
                Lengkapi informasi jasa yang akan Anda tawarkan di KlikJasa
              </p>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Judul Jasa</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Jasa Pembersihan Rumah" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi Jasa</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Jelaskan detail jasa yang Anda tawarkan" 
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kategori jasa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cleaning">Pembersihan</SelectItem>
                          <SelectItem value="repair">Perbaikan & Servis</SelectItem>
                          <SelectItem value="beauty">Kecantikan</SelectItem>
                          <SelectItem value="health">Kesehatan</SelectItem>
                          <SelectItem value="food">Makanan & Minuman</SelectItem>
                          <SelectItem value="education">Pendidikan</SelectItem>
                          <SelectItem value="transport">Transportasi</SelectItem>
                          <SelectItem value="other">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga (Rp)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min="0"
                          placeholder="Contoh: 150000" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lokasi</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="Masukkan lokasi Anda" 
                            {...field}
                            className="pl-10" 
                          />
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="serviceRadius"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Radius Layanan (km)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min="1"
                          max="50"
                          placeholder="Contoh: 5" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <FormLabel>Foto Jasa</FormLabel>
                  <div className="mt-2">
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {imagePreviewUrls.map((url, index) => (
                        <div key={index} className="relative h-24 border rounded overflow-hidden">
                          <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      
                      {imagePreviewUrls.length < 5 && (
                        <label className="h-24 border border-dashed rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                          <Upload size={20} className="text-gray-400" />
                          <span className="text-xs text-gray-500 mt-1">Unggah Foto</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            multiple
                          />
                        </label>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Unggah hingga 5 foto (maks. 2MB per foto)
                    </p>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? <LoadingIndicator /> : 'Simpan & Publikasikan'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateServicePage;

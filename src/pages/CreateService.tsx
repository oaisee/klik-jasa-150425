
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, MapPin, X, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Profile, Service } from '@/types/database';

const CATEGORIES = [
  { value: 'cleaning', label: 'Kebersihan Rumah' },
  { value: 'tutoring', label: 'Les Privat' },
  { value: 'handyman', label: 'Tukang' },
  { value: 'photography', label: 'Fotografi' },
  { value: 'beauty', label: 'Kecantikan' },
  { value: 'massage', label: 'Pijat' },
  { value: 'transportation', label: 'Transportasi' },
  { value: 'digital', label: 'Jasa Digital' },
  { value: 'other', label: 'Lainnya' }
];

const CreateService = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState<{ id: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    location: '',
    radius: '5', // Default radius
  });
  
  // Image upload state
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  useEffect(() => {
    document.title = 'Buat Jasa Baru | KlikJasa';
    checkUserSession();
  }, []);
  
  const checkUserSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (!session) {
        toast.error("Anda harus login untuk membuat jasa");
        navigate('/login');
        return;
      }
      
      // Fetch provider profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, is_provider')
        .eq('id', session.user.id)
        .single();
      
      if (profileError) throw profileError;
      
      if (!profile) {
        toast.error("Profil tidak ditemukan");
        navigate('/profile');
        return;
      }
      
      // Check if user is a provider
      if (!profile.is_provider) {
        toast.error("Anda harus menjadi penyedia jasa terlebih dahulu");
        navigate('/provider-mode');
        return;
      }
      
      setUserData({ id: profile.id });
    } catch (error) {
      console.error("Session check error:", error);
      toast.error("Terjadi kesalahan, silakan coba lagi");
      navigate('/profile');
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    
    // Limit to 5 images total
    if (imageFiles.length + newFiles.length > 5) {
      toast.warning("Maksimal 5 foto yang diperbolehkan");
      return;
    }
    
    // Create previews for the new files
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreviews(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    
    // Add new files to state
    setImageFiles(prev => [...prev, ...newFiles]);
    
    // Reset the input
    e.target.value = '';
  };
  
  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  const uploadImages = async (serviceId: string): Promise<string[]> => {
    if (imageFiles.length === 0) return [];
    
    setUploadingImages(true);
    const uploadPromises = imageFiles.map(async (file, index) => {
      try {
        // Create a unique file path
        const fileExt = file.name.split('.').pop();
        const fileName = `${serviceId}/${Date.now()}_${index}.${fileExt}`;
        
        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('services')
          .upload(fileName, file);
        
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('services')
          .getPublicUrl(fileName);
        
        return urlData.publicUrl;
      } catch (error) {
        console.error(`Error uploading image ${index}:`, error);
        toast.error(`Gagal mengunggah gambar ${index + 1}`);
        return null;
      }
    });
    
    const uploadedUrls = await Promise.all(uploadPromises);
    setUploadingImages(false);
    return uploadedUrls.filter(Boolean) as string[];
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userData?.id) {
      toast.error("Data pengguna tidak ditemukan");
      return;
    }
    
    // Validation
    if (!formData.title || !formData.category || !formData.description || 
        !formData.price || !formData.location || !formData.radius) {
      toast.error("Mohon lengkapi semua kolom yang diperlukan");
      return;
    }
    
    if (imageFiles.length === 0) {
      toast.error("Mohon unggah setidaknya 1 foto");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert price and radius to numbers
      const price = parseInt(formData.price);
      const radius = parseInt(formData.radius);
      
      if (isNaN(price) || price <= 0) {
        toast.error("Harga harus berupa angka positif");
        setIsSubmitting(false);
        return;
      }
      
      if (isNaN(radius) || radius <= 0) {
        toast.error("Radius harus berupa angka positif");
        setIsSubmitting(false);
        return;
      }
      
      // Insert service data
      const { data: createdService, error: serviceError } = await supabase
        .from('services')
        .insert({
          provider_id: userData.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          price: price,
          location: formData.location,
          service_radius: radius,
          status: 'active'
        })
        .select()
        .single();
      
      if (serviceError) throw serviceError;
      
      if (!createdService) {
        throw new Error("Failed to create service");
      }
      
      // Upload images
      const imageUrls = await uploadImages(createdService.id);
      
      // Insert image records
      if (imageUrls.length > 0) {
        const imageRecords = imageUrls.map((url, index) => ({
          service_id: createdService.id,
          image_url: url,
          sort_order: index
        }));
        
        const { error: imagesError } = await supabase
          .from('service_images')
          .insert(imageRecords);
        
        if (imagesError) throw imagesError;
      }
      
      toast.success("Jasa berhasil dibuat");
      navigate('/provider-mode');
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error("Gagal membuat jasa");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="animate-fade-in pb-8">
      <div className="px-4 py-4 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Buat Jasa Baru</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="px-4">
        <div className="mb-5">
          <label className="block text-sm font-medium mb-1">Judul Jasa</label>
          <Input 
            id="title"
            placeholder="mis. Jasa Bersih Rumah Profesional"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="mb-5">
          <label className="block text-sm font-medium mb-1">Kategori</label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleSelectChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="mb-5">
          <label className="block text-sm font-medium mb-1">Deskripsi</label>
          <Textarea 
            id="description"
            placeholder="Jelaskan jasa Anda secara detail..."
            className="min-h-[150px]"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="mb-5">
          <label className="block text-sm font-medium mb-1">Harga (Rp)</label>
          <Input 
            id="price"
            type="number" 
            placeholder="mis. 250000"
            min="1000"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="mb-5">
          <label className="block text-sm font-medium mb-1">Lokasi Jasa</label>
          <div className="flex">
            <Input 
              id="location"
              placeholder="Area jasa Anda"
              className="flex-1"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
            <Button 
              type="button" 
              variant="outline"
              className="ml-2"
            >
              <MapPin size={18} />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Masukkan lokasi Anda atau gunakan pin peta untuk menentukannya</p>
        </div>
        
        <div className="mb-5">
          <label className="block text-sm font-medium mb-1">Radius Jasa (km)</label>
          <Input 
            id="radius"
            type="number" 
            placeholder="mis. 10"
            min="1"
            max="100"
            value={formData.radius}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="mb-8">
          <label className="block text-sm font-medium mb-1">Unggah Foto</label>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          
          <div className="grid grid-cols-3 gap-2">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="aspect-square relative border border-gray-200 rounded-md overflow-hidden">
                <img 
                  src={preview} 
                  alt={`Preview ${index}`} 
                  className="w-full h-full object-cover"
                />
                <button 
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            
            {imagePreviews.length < 5 && (
              <div 
                className="aspect-square border-2 border-dashed border-gray-200 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50"
                onClick={handleImageSelect}
              >
                <div className="text-center">
                  <Plus size={24} className="mx-auto text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Tambah</span>
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Unggah setidaknya satu foto jasa Anda (maksimal 5 foto)</p>
        </div>
        
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Catatan:</span> Komisi 5% akan dipotong dari dompet Anda untuk setiap pemesanan. Pastikan Anda memiliki saldo yang cukup.
          </p>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-marketplace-primary hover:bg-marketplace-primary/90"
          disabled={isSubmitting || uploadingImages}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Membuat...
            </>
          ) : 'Buat Jasa'}
        </Button>
      </form>
    </div>
  );
};

export default CreateService;

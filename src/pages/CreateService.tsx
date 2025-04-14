
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, MapPin } from 'lucide-react';
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

const CreateService = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    document.title = 'Create Service | ServiceFinder';
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/');
    }, 1500);
  };
  
  return (
    <div className="animate-fade-in pb-8">
      <div className="px-4 py-4 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Create New Service</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="px-4">
        <div className="mb-5">
          <label className="block text-sm font-medium mb-1">Service Title</label>
          <Input 
            placeholder="e.g. Professional House Cleaning"
            required
          />
        </div>
        
        <div className="mb-5">
          <label className="block text-sm font-medium mb-1">Category</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cleaning">Home Cleaning</SelectItem>
              <SelectItem value="tutoring">Tutoring</SelectItem>
              <SelectItem value="handyman">Handyman</SelectItem>
              <SelectItem value="photography">Photography</SelectItem>
              <SelectItem value="beauty">Hair & Beauty</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="mb-5">
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea 
            placeholder="Describe your service in detail..."
            className="min-h-[150px]"
            required
          />
        </div>
        
        <div className="mb-5">
          <label className="block text-sm font-medium mb-1">Price (Rp)</label>
          <Input 
            type="number" 
            placeholder="e.g. 250000"
            min="1000"
            required
          />
        </div>
        
        <div className="mb-5">
          <label className="block text-sm font-medium mb-1">Service Location</label>
          <div className="flex">
            <Input 
              placeholder="Your service area"
              className="flex-1"
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
          <p className="text-xs text-gray-500 mt-1">Enter your location or use the map pin to set it</p>
        </div>
        
        <div className="mb-5">
          <label className="block text-sm font-medium mb-1">Service Radius (km)</label>
          <Input 
            type="number" 
            placeholder="e.g. 10"
            min="1"
            max="100"
            required
          />
        </div>
        
        <div className="mb-8">
          <label className="block text-sm font-medium mb-1">Upload Photos</label>
          <div className="grid grid-cols-3 gap-2">
            <div className="aspect-square border-2 border-dashed border-gray-200 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50">
              <div className="text-center">
                <Upload size={24} className="mx-auto text-gray-400" />
                <span className="text-xs text-gray-500 mt-1">Add</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Upload at least one photo of your service (max 5 photos)</p>
        </div>
        
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Note:</span> A 5% commission will be deducted from your wallet for each booking. Please ensure you have sufficient balance.
          </p>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-marketplace-primary hover:bg-marketplace-secondary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Service'}
        </Button>
      </form>
    </div>
  );
};

export default CreateService;

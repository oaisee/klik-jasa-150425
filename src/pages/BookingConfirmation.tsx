
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { bookingData } from '@/data/mockData';

const BookingConfirmation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [viewType, setViewType] = useState<'consumer' | 'provider'>('consumer');
  
  // In a real app, you would fetch this data based on the ID
  const booking = bookingData;
  
  useEffect(() => {
    document.title = 'Booking Confirmation | ServiceFinder';
  }, []);
  
  const toggleView = () => {
    setViewType(viewType === 'consumer' ? 'provider' : 'consumer');
  };
  
  return (
    <div className="animate-fade-in pb-8">
      <div className="px-4 py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center">Booking Confirmation</h1>
        <Button variant="ghost" size="sm" onClick={toggleView}>
          View as {viewType === 'consumer' ? 'Provider' : 'Consumer'}
        </Button>
      </div>
      
      <div className="flex flex-col items-center justify-center px-4 py-6">
        <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mb-4">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-center">
          {viewType === 'consumer' ? 'Booking Confirmed!' : 'Booking Accepted!'}
        </h2>
      </div>
      
      {viewType === 'consumer' ? (
        <div className="px-4">
          <div className="bg-white border border-gray-100 rounded-lg p-5">
            <p className="text-center mb-6">
              You will meet <span className="font-semibold">{booking.providerName}</span> for <span className="font-semibold">{booking.serviceName}</span> on {booking.date} at {booking.time}.
            </p>
            
            <div className="flex items-center mb-3">
              <Calendar size={20} className="text-marketplace-primary mr-3" />
              <div>
                <p className="font-medium">{booking.date}</p>
                <p className="text-sm text-gray-500">Date</p>
              </div>
            </div>
            
            <div className="flex items-center mb-3">
              <Clock size={20} className="text-marketplace-primary mr-3" />
              <div>
                <p className="font-medium">{booking.time}</p>
                <p className="text-sm text-gray-500">Time</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <MapPin size={20} className="text-marketplace-primary mr-3" />
              <div>
                <p className="font-medium">To be coordinated</p>
                <p className="text-sm text-gray-500">Location</p>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex justify-between mb-2">
                <p>Service Fee</p>
                <p className="font-medium">Rp {booking.price.toLocaleString()}</p>
              </div>
              <p className="text-sm text-gray-500 mb-4">Please coordinate details via chat and pay directly in cash after service.</p>
            </div>
          </div>
          
          <div className="mt-6 flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
            <Button 
              className="flex-1 bg-marketplace-primary hover:bg-marketplace-secondary"
              onClick={() => navigate('/chat')}
            >
              Chat with Provider
            </Button>
          </div>
        </div>
      ) : (
        <div className="px-4">
          <div className="bg-white border border-gray-100 rounded-lg p-5">
            <p className="text-center mb-4">
              Rp {booking.commission.toLocaleString()} has been deducted from your wallet for commission.
            </p>
            
            <p className="text-center mb-6">
              Please coordinate details with <span className="font-semibold">{booking.consumerName}</span> via chat for the service on {booking.date} at {booking.time}.
            </p>
            
            <div className="flex items-center mb-3">
              <Calendar size={20} className="text-marketplace-primary mr-3" />
              <div>
                <p className="font-medium">{booking.date}</p>
                <p className="text-sm text-gray-500">Date</p>
              </div>
            </div>
            
            <div className="flex items-center mb-3">
              <Clock size={20} className="text-marketplace-primary mr-3" />
              <div>
                <p className="font-medium">{booking.time}</p>
                <p className="text-sm text-gray-500">Time</p>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex justify-between mb-2">
                <p>Service Fee</p>
                <p className="font-medium">Rp {booking.price.toLocaleString()}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p>Platform Commission (5%)</p>
                <p className="font-medium text-red-500">- Rp {booking.commission.toLocaleString()}</p>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t border-gray-100 mt-2">
                <p>You'll Receive</p>
                <p>Rp {(booking.price - booking.commission).toLocaleString()}</p>
              </div>
              <p className="text-sm text-gray-500 mt-4">The customer will pay you directly in cash after service completion.</p>
            </div>
          </div>
          
          <div className="mt-6 flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => navigate('/wallet')}
            >
              View Wallet
            </Button>
            <Button 
              className="flex-1 bg-marketplace-primary hover:bg-marketplace-secondary"
              onClick={() => navigate('/chat')}
            >
              Chat with Customer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingConfirmation;

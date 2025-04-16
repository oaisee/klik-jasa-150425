
import React from 'react';
import { MessageSquare, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatPageHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm z-10 sticky top-0">
      <div className="flex items-center">
        <button 
          onClick={() => navigate(-1)} 
          className="mr-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Kembali"
        >
          <ChevronLeft size={22} className="text-gray-600" />
        </button>
        
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-600 to-green-500 p-2 rounded-full mr-3 flex-shrink-0">
            <MessageSquare size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-800 text-left">Pesan</h1>
            <p className="text-xs text-gray-500">Percakapan dengan penyedia jasa</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPageHeader;

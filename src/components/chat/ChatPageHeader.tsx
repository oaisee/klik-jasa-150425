import React from 'react';
import { MessageSquare } from 'lucide-react';
const ChatPageHeader = () => {
  return <div className="bg-gradient-to-r from-blue-600 to-green-500 px-4 py-3 flex items-center shadow-sm z-10">
      <div className="flex items-center">
        <div className="bg-marketplace-primary/10 p-2 rounded-full mr-3">
          <MessageSquare size={22} className="text-marketplace-primary" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-center">Pesan</h1>
          <p className="text-xs text-gray-500">Percakapan dengan penyedia jasa</p>
        </div>
      </div>
    </div>;
};
export default ChatPageHeader;
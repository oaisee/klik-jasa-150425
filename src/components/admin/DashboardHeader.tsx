
import { useState, useEffect } from 'react';

const DashboardHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <p className="text-sm text-gray-500">
        {new Date().toLocaleDateString('id-ID', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </p>
    </div>
  );
};

export default DashboardHeader;

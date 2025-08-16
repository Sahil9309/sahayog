import React from 'react';
import { Heart } from 'lucide-react';

const MyContributionsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900">My Contributions</h1>
        <p className="text-gray-600 mt-2">This page is under construction. Your contribution history will appear here.</p>
      </div>
    </div>
  );
};

export default MyContributionsPage;
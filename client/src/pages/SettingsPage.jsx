import React from 'react';
import { Settings } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">This page is under construction. Your account settings will be available here.</p>
      </div>
    </div>
  );
};

export default SettingsPage;
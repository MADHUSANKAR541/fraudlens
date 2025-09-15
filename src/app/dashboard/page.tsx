'use client';

import React, { useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import DashboardContent from './components/DashboardContent';
import UploadContent from './components/UploadContent';
import DetectContent from './components/DetectContent';
import AIContent from './components/AIContent';

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardContent />;
      case 'upload':
        return <UploadContent onNavigateToAI={() => setCurrentPage('neuro-ai')} />;
      case 'detect':
        return <DetectContent />;
      case 'neuro-ai':
        return <AIContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <DashboardLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderContent()}
    </DashboardLayout>
  );
}


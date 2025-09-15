'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  BarChart3,
  Download,
  Users,
  Menu,
  Plus,
  Compass,
  Calendar,
  Grid3X3,
  Star
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export default function DashboardLayout({ children, currentPage, onPageChange }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, href: '/dashboard' },
    { id: 'upload', label: 'Upload', icon: Download, href: '/dashboard/upload' },
    { id: 'detect', label: 'Detect', icon: Shield, href: '/dashboard/detect' },
    { id: 'neuro-ai', label: 'AI', icon: Compass, href: '/dashboard/ai' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 bg-white border-r border-gray-200`}>
        <div className="h-full p-6 flex flex-col gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm opacity-90"></div>
            </div>
            <span className="font-bold text-xl text-gray-900">NeuroBank</span>
          </div>

          {/* User Welcome Card */}
          <div className="bg-gray-50 rounded-2xl p-4 relative">
            <div className="flex items-start mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <Users className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-1">MONDAY, MARCH 24</div>
            <div className="text-lg font-bold text-gray-900">Welcome back, George!</div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Pro Button */}
          <div className="mt-auto">
            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-4 flex items-center gap-3 hover:from-blue-700 hover:to-blue-800 transition-all">
              <Star className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold">NeuroBank Pro</div>
                <div className="text-sm opacity-90">AI-powered finance</div>
              </div>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="h-16 px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">This Month</span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50">
                <Grid3X3 className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Manage</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                <span className="text-sm">Add Widget</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import BackendStatusIndicator from './components/BackendStatusIndicator';

const inter = Inter({ subsets: ['latin'] });

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={inter.className}>
      <BackendStatusIndicator />
      {children}
    </div>
  );
}

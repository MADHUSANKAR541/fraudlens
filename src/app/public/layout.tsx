import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FraudLens - Advanced AI Fraud Detection',
  description: 'Protect your business with state-of-the-art machine learning algorithms that detect fraud with 99.7% accuracy and real-time monitoring.',
  keywords: 'fraud detection, AI, machine learning, security, fintech, banking',
  authors: [{ name: 'FraudLens Team' }],
  openGraph: {
    title: 'FraudLens - Advanced AI Fraud Detection',
    description: 'Protect your business with state-of-the-art machine learning algorithms that detect fraud with 99.7% accuracy and real-time monitoring.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FraudLens - Advanced AI Fraud Detection',
    description: 'Protect your business with state-of-the-art machine learning algorithms that detect fraud with 99.7% accuracy and real-time monitoring.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={inter.className}>
      {children}
    </div>
  );
}

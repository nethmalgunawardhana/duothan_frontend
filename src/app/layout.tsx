// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { AdminProvider } from '@/contexts/AdminContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OASIS - Ready Player One Buildathon',
  description: 'Competition platform for Ready Player One Buildathon',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-oasis-dark text-white`}>
        <AdminProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
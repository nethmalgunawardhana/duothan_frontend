import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { AdminProvider } from '@/contexts/AdminContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OASIS Protocol - Buildathon',
  description: 'Ready Player One inspired coding platform',
  keywords: ['coding', 'buildathon', 'oasis', 'ready player one'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-oasis-dark text-white antialiased`}>
        <AdminProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
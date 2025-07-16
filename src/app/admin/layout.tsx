// src/app/admin/layout.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminAuth } from '@/contexts/AdminContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading, initialized } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // Only redirect if the context is initialized and user is not authenticated
    if (initialized && !loading && !isAuthenticated && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, loading, initialized, router, isLoginPage]);

  // Show loading while initializing
  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-oasis-dark flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If it's the login page, render it without the admin layout wrapper
  if (isLoginPage) {
    return <>{children}</>;
  }

  // If not authenticated and not on login page, show nothing (redirect will happen)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-oasis-dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-white mb-4">Redirecting to login...</div>
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}
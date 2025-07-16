import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default function AdminSubmissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
} 
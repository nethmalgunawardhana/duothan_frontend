'use client';

import React from 'react';
import { AuthContextProvider } from '@/contexts/AuthContext';
import { AdminProvider } from '@/contexts/AdminContext';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <AuthContextProvider>
      <AdminProvider>
        {children}
      </AdminProvider>
    </AuthContextProvider>
  );
};
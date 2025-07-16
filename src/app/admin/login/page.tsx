// src/app/admin/login/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAdminAuth } from '@/contexts/AdminContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// Validation function
const validateAdminCredentials = (email: string, password: string) => {
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }
  if (!email.includes('@')) {
    return { isValid: false, error: 'Please enter a valid email' };
  }
  if (!password.trim()) {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < 3) {
    return { isValid: false, error: 'Password must be at least 3 characters' };
  }
  return { isValid: true };
};

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { loginAdmin, loading, error: authError, isAuthenticated, initialized } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialized && isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, initialized, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const validation = validateAdminCredentials(email, password);
    if (!validation.isValid) {
      setError(validation.error || '');
      setIsSubmitting(false);
      return;
    }

    try {
      const success = await loginAdmin(email, password);
      if (success) {
        router.push('/admin');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentError = error || authError;

  // Show loading while initializing
  if (!initialized) {
    return (
      <div className="min-h-screen bg-oasis-dark flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-oasis-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-oasis-primary mb-2">
            🔒 OASIS Admin
          </h1>
          <p className="text-gray-400">
            Administrative Access Portal
          </p>
        </div>

        <Card className="w-full" glowing>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Admin Email"
              placeholder="admin@oasis.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<span>👤</span>}
              required
              disabled={isSubmitting || loading}
            />

            <Input
              type="password"
              label="Admin Password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<span>🔑</span>}
              required
              disabled={isSubmitting || loading}
            />

            {currentError && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm">{currentError}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={!email.trim() || !password.trim() || isSubmitting || loading}
            >
              {isSubmitting || loading ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Signing in...</span>
                </div>
              ) : (
                'Access Admin Portal'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Demo Credentials:
            </p>
            <p className="text-oasis-accent text-sm">
              admin@oasis.com / admin123
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
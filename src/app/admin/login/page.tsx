'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAdminAuth } from '@/contexts/AdminContext';
import { validateAdminCredentials } from '@/utils/validation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginAdmin, loading, error: authError, isAuthenticated } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validation = validateAdminCredentials(email, password);
    if (!validation.isValid) {
      setError(validation.error || '');
      return;
    }

    const success = await loginAdmin(email, password);
    if (success) {
      router.push('/admin');
    }
  };

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
            />

            <Input
              type="password"
              label="Admin Password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<span>🔑</span>}
              required
            />

            {(error || authError) && (
              <div className="p-3 bg-oasis-error/10 border border-oasis-error rounded-lg">
                <p className="text-oasis-error text-sm">{error || authError}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={loading}
              disabled={!email.trim() || !password.trim()}
            >
              Access Admin Portal
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Demo Credentials:
            </p>
            <p className="text-oasis-accent text-sm">
              admin@oasis.com / oasis123
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
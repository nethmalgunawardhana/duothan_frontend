'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { team, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !team) {
      router.push('/login');
    }
  }, [team, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-oasis-dark flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!team) {
    return null; // Will redirect in the useEffect
  }

  return <>{children}</>;
} 
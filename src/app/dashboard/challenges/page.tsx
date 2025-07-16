'use client';

import React, { useState, useEffect } from 'react';
import { apiClient, ChallengeData } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';
import AuthGuard from '@/components/auth/AuthGuard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ChallengeList } from '@/components/ui/ChallengeList';

export default function ChallengesPage() {
  const { team } = useAuth();
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiClient.getActiveChallenges();
        
        if (response.success && response.data) {
          setChallenges(response.data);
        } else {
          setError(response.error || 'Failed to fetch challenges');
        }
      } catch {
        setError('An error occurred while fetching challenges');
      } finally {
        setLoading(false);
      }
    };
    
    fetchChallenges();
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-oasis-dark">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-oasis-primary mb-4">
              Challenges
            </h1>
            <p className="text-gray-400 text-lg">
              Complete challenges to earn points and advance in the buildathon
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-500">
              {error}
            </div>
          ) : (
            <ChallengeList 
              challenges={challenges} 
              completedChallengeIds={team?.completedChallenges || []}
            />
          )}
        </div>
      </div>
    </AuthGuard>
  );
} 
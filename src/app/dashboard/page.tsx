'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import AuthGuard from '@/components/auth/AuthGuard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { TeamDashboard } from '@/components/ui/TeamDashboard';
import { apiClient, ChallengeData } from '@/utils/api';

export default function DashboardPage() {
  const { team, loading: authLoading } = useAuth();
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      if (!team) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiClient.getChallenges();
        
        if (response.success && response.data) {
          setChallenges(response.data.filter(challenge => challenge.isActive));
        } else {
          setError(response.error || 'Failed to fetch challenges');
        }
      } catch (err) {
        setError('An error occurred while fetching challenges');
      } finally {
        setLoading(false);
      }
    };
    
    if (team) {
      fetchChallenges();
    }
  }, [team]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-oasis-dark flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-oasis-dark">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-oasis-primary mb-4">
              Welcome to OASIS Protocol
            </h1>
            <p className="text-gray-400 text-lg">
              Ready Player One Buildathon Dashboard
            </p>
          </div>

          {team && (
            <div className="mb-8">
              <TeamDashboard team={team} challenges={challenges} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-oasis-surface rounded-lg p-6 border border-oasis-primary/30">
              <h3 className="text-xl font-bold text-white mb-4">Challenges</h3>
              <p className="text-gray-400 mb-4">
                Complete coding challenges to earn points and advance in the buildathon.
              </p>
              <Link href="/dashboard/challenges">
                <button className="bg-oasis-primary text-oasis-dark px-4 py-2 rounded-lg font-semibold hover:bg-oasis-primary/90 transition-colors">
                  View Challenges
                </button>
              </Link>
            </div>

            <div className="bg-oasis-surface rounded-lg p-6 border border-oasis-primary/30">
              <h3 className="text-xl font-bold text-white mb-4">Leaderboard</h3>
              <p className="text-gray-400 mb-4">
                See how your team ranks against other participants in the buildathon.
              </p>
              <Link href="/dashboard/leaderboard">
                <button className="bg-oasis-secondary text-white px-4 py-2 rounded-lg font-semibold hover:bg-oasis-secondary/90 transition-colors">
                  View Rankings
                </button>
              </Link>
            </div>

            <div className="bg-oasis-surface rounded-lg p-6 border border-oasis-primary/30">
              <h3 className="text-xl font-bold text-white mb-4">Resources</h3>
              <p className="text-gray-400 mb-4">
                Access documentation, tutorials, and tools to help you succeed.
              </p>
              <Link href="/dashboard/resources">
                <button className="bg-oasis-accent text-oasis-dark px-4 py-2 rounded-lg font-semibold hover:bg-oasis-accent/90 transition-colors">
                  Access Resources
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

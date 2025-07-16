'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthGuard from '@/components/auth/AuthGuard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { LeaderboardTable } from '@/components/ui/LeaderboardTable';
import { apiClient, LeaderboardEntry } from '@/utils/api';

export default function LeaderboardPage() {
  const { team } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiClient.getLeaderboard();
        
        if (response.success && response.data) {
          setLeaderboard(response.data);
        } else {
          setError(response.error || 'Failed to fetch leaderboard');
        }
      } catch (err) {
        setError('An error occurred while fetching the leaderboard');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
    
    // Refresh leaderboard every 60 seconds
    const interval = setInterval(fetchLeaderboard, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-oasis-dark">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-oasis-primary mb-4">
              Leaderboard
            </h1>
            <p className="text-gray-400 text-lg">
              See how your team ranks against other participants
            </p>
          </div>
          
          <div className="bg-oasis-surface rounded-lg p-6 border border-oasis-primary/30 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 md:mb-0">
                Current Rankings
              </h2>
              
              <div className="flex items-center space-x-2 text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span className="text-sm">
                  {loading ? 'Updating...' : 'Updates automatically every minute'}
                </span>
              </div>
            </div>
            
            <LeaderboardTable 
              leaderboard={leaderboard}
              loading={loading}
              error={error}
              currentTeamId={team?.id}
            />
          </div>
          
          <div className="bg-oasis-surface rounded-lg p-6 border border-oasis-primary/30">
            <h2 className="text-2xl font-bold text-white mb-4">
              How Ranking Works
            </h2>
            <div className="space-y-4 text-gray-300">
              <div className="bg-oasis-dark rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Points</h3>
                <p>
                  Teams earn 1 point for each completed challenge. The more challenges you complete, the higher your ranking.
                </p>
              </div>
              
              <div className="bg-oasis-dark rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Tie-Breaking</h3>
                <p>
                  If multiple teams have the same number of points, rankings are determined by submission time. 
                  Teams that completed challenges earlier will be ranked higher.
                </p>
              </div>
              
              <div className="bg-oasis-dark rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">Challenge Types</h3>
                <p>
                  Both algorithmic challenges and buildathon projects count equally toward your team's ranking.
                  Focus on completing the challenges that best match your team's strengths.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
} 
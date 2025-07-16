// src/app/admin/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { StatsCard } from '@/components/admin/StatsCard';
import { apiClient, DashboardStats } from '@/utils/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAdminAuth } from '@/contexts/AdminContext';

export default function AdminDashboardPage() {
  const { isAuthenticated, initialized } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardStats() {
      if (!isAuthenticated || !initialized) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await apiClient.getDashboardStats();
        
        if (response.success && response.data) {
          setStats(response.data);
        } else {
          setError(response.error || 'Failed to fetch dashboard stats');
        }
      } catch (err) {
        console.error('Dashboard stats error:', err);
        setError('An error occurred while fetching dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardStats();
  }, [isAuthenticated, initialized]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
      
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Teams"
            value={stats.totalTeams}
            icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Total Challenges"
            value={stats.totalChallenges}
            icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
          <StatsCard
            title="Total Submissions"
            value={stats.totalSubmissions}
            icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            trend={{ value: 24, isPositive: true }}
          />
          <StatsCard
            title="Completion Rate"
            value={stats.totalSubmissions > 0 ? `${Math.round((stats.completedSubmissions / stats.totalSubmissions) * 100)}%` : '0%'}
            icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-oasis-surface rounded-lg border border-oasis-primary/30 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Submissions</h2>
          <div className="space-y-4">
            {stats?.recentSubmissions && stats.recentSubmissions.length > 0 ? (
              stats.recentSubmissions.map((submission) => (
                <div key={submission.id} className="flex items-start pb-4 border-b border-gray-700">
                  <div className="bg-oasis-primary/20 p-2 rounded-lg mr-4">
                    <svg
                      className="w-5 h-5 text-oasis-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      Team {submission.teamId} submitted a solution
                    </p>
                    <p className="text-sm text-gray-400">
                      Challenge: {submission.challengeId} • {submission.language} • {submission.status}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(submission.submittedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                No recent submissions
              </div>
            )}
          </div>
        </div>

        <div className="bg-oasis-surface rounded-lg border border-oasis-primary/30 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Top Performing Teams</h2>
          <div className="space-y-4">
            {stats?.topTeams && stats.topTeams.length > 0 ? (
              stats.topTeams.map((team, index) => (
                <div key={team.id} className="flex items-center justify-between pb-4 border-b border-gray-700">
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-oasis-primary to-oasis-secondary w-8 h-8 rounded-full flex items-center justify-center text-oasis-dark font-bold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-medium">{team.teamName}</p>
                      <p className="text-sm text-gray-400">
                        Team ID: {team.id}
                      </p>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-oasis-primary">{team.points}</div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                No teams registered yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
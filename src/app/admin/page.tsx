'use client';

import React, { useState, useEffect } from 'react';
import { StatsCard } from '@/components/admin/StatsCard';
import { apiClient } from '@/utils/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface DashboardStats {
  totalTeams: number;
  totalChallenges: number;
  totalSubmissions: number;
  completedSubmissions: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        // Simulating API call for now - replace with actual API call when available
        // const response = await apiClient.getDashboardStats();
        // if (response.success && response.data) {
        //   setStats(response.data);
        // } else {
        //   setError(response.error || 'Failed to fetch dashboard stats');
        // }
        
        // Mock data for demonstration
        setTimeout(() => {
          setStats({
            totalTeams: 32,
            totalChallenges: 12,
            totalSubmissions: 128,
            completedSubmissions: 98,
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('An error occurred while fetching dashboard data');
        setLoading(false);
      }
    }

    fetchDashboardStats();
  }, []);

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
            value={`${Math.round((stats.completedSubmissions / stats.totalSubmissions) * 100)}%`}
            icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-oasis-surface rounded-lg border border-oasis-primary/30 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {/* Activity items - replace with actual data when available */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start pb-4 border-b border-gray-700">
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">Team Alpha submitted a solution</p>
                  <p className="text-sm text-gray-400">Challenge: Web3 Integration - {i} hour ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-oasis-surface rounded-lg border border-oasis-primary/30 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Top Performing Teams</h2>
          <div className="space-y-4">
            {/* Team items - replace with actual data when available */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-700">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-oasis-primary to-oasis-secondary w-8 h-8 rounded-full flex items-center justify-center text-oasis-dark font-bold mr-3">
                    {i}
                  </div>
                  <div>
                    <p className="text-white font-medium">Team {String.fromCharCode(64 + i)}</p>
                    <p className="text-sm text-gray-400">{6 - i} challenges completed</p>
                  </div>
                </div>
                <div className="text-xl font-bold text-oasis-primary">{110 - i * 10}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
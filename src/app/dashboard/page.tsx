'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthGuard from '@/components/auth/AuthGuard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
  const { team, loading } = useAuth();

  if (loading) {
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
            <div className="bg-oasis-surface rounded-lg p-6 mb-8 border border-oasis-primary/30">
              <h2 className="text-2xl font-bold text-white mb-4">Team Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">Team Name:</p>
                  <p className="text-white font-semibold">{team.teamName}</p>
                </div>
                <div>
                  <p className="text-gray-400">Email:</p>
                  <p className="text-white font-semibold">{team.email}</p>
                </div>
                <div>
                  <p className="text-gray-400">Points:</p>
                  <p className="text-oasis-primary font-bold text-xl">{team.points}</p>
                </div>
                <div>
                  <p className="text-gray-400">Auth Provider:</p>
                  <p className="text-white font-semibold capitalize">{team.authProvider}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-oasis-surface rounded-lg p-6 border border-oasis-primary/30">
              <h3 className="text-xl font-bold text-white mb-4">Challenges</h3>
              <p className="text-gray-400 mb-4">
                Complete coding challenges to earn points and advance in the buildathon.
              </p>
              <button className="bg-oasis-primary text-oasis-dark px-4 py-2 rounded-lg font-semibold hover:bg-oasis-primary/90 transition-colors">
                View Challenges
              </button>
            </div>

            <div className="bg-oasis-surface rounded-lg p-6 border border-oasis-primary/30">
              <h3 className="text-xl font-bold text-white mb-4">Leaderboard</h3>
              <p className="text-gray-400 mb-4">
                See how your team ranks against other participants in the buildathon.
              </p>
              <button className="bg-oasis-secondary text-white px-4 py-2 rounded-lg font-semibold hover:bg-oasis-secondary/90 transition-colors">
                View Rankings
              </button>
            </div>

            <div className="bg-oasis-surface rounded-lg p-6 border border-oasis-primary/30">
              <h3 className="text-xl font-bold text-white mb-4">Resources</h3>
              <p className="text-gray-400 mb-4">
                Access documentation, tutorials, and tools to help you succeed.
              </p>
              <button className="bg-oasis-accent text-oasis-dark px-4 py-2 rounded-lg font-semibold hover:bg-oasis-accent/90 transition-colors">
                Access Resources
              </button>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

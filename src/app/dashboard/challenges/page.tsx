'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiClient, ChallengeData } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';
import AuthGuard from '@/components/auth/AuthGuard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function ChallengesPage() {
  const { team } = useAuth();
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<{
    type: 'all' | 'algorithmic' | 'buildathon';
    difficulty: 'all' | 'easy' | 'medium' | 'hard';
    completed: 'all' | 'completed' | 'incomplete';
  }>({
    type: 'all',
    difficulty: 'all',
    completed: 'all',
  });
  
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
  
  const filteredChallenges = challenges.filter(challenge => {
    if (filter.type !== 'all' && challenge.type !== filter.type) {
      return false;
    }
    
    if (filter.difficulty !== 'all' && challenge.difficulty !== filter.difficulty) {
      return false;
    }
    
    if (filter.completed !== 'all') {
      const isCompleted = team?.completedChallenges?.includes(challenge.id);
      if (filter.completed === 'completed' && !isCompleted) {
        return false;
      }
      if (filter.completed === 'incomplete' && isCompleted) {
        return false;
      }
    }
    
    return true;
  });
  
  const renderDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <span className="bg-green-900/30 text-green-500 px-2 py-1 rounded text-xs font-medium">Easy</span>;
      case 'medium':
        return <span className="bg-yellow-900/30 text-yellow-500 px-2 py-1 rounded text-xs font-medium">Medium</span>;
      case 'hard':
        return <span className="bg-red-900/30 text-red-500 px-2 py-1 rounded text-xs font-medium">Hard</span>;
      default:
        return null;
    }
  };

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
          
          <div className="bg-oasis-surface rounded-lg p-6 mb-8 border border-oasis-primary/30">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div>
                <label className="block text-gray-400 text-sm mb-1">Type</label>
                <select
                  value={filter.type}
                  onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value as any }))}
                  className="bg-oasis-dark text-white border border-gray-700 rounded px-3 py-2"
                >
                  <option value="all">All Types</option>
                  <option value="algorithmic">Algorithmic</option>
                  <option value="buildathon">Buildathon</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-1">Difficulty</label>
                <select
                  value={filter.difficulty}
                  onChange={(e) => setFilter(prev => ({ ...prev, difficulty: e.target.value as any }))}
                  className="bg-oasis-dark text-white border border-gray-700 rounded px-3 py-2"
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-400 text-sm mb-1">Status</label>
                <select
                  value={filter.completed}
                  onChange={(e) => setFilter(prev => ({ ...prev, completed: e.target.value as any }))}
                  className="bg-oasis-dark text-white border border-gray-700 rounded px-3 py-2"
                >
                  <option value="all">All Challenges</option>
                  <option value="completed">Completed</option>
                  <option value="incomplete">Incomplete</option>
                </select>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : error ? (
              <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-500">
                {error}
              </div>
            ) : filteredChallenges.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                No challenges match your filters
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChallenges.map((challenge) => {
                  const isCompleted = team?.completedChallenges?.includes(challenge.id);
                  
                  return (
                    <Link
                      key={challenge.id}
                      href={`/dashboard/challenges/${challenge.id}`}
                      className="bg-oasis-dark rounded-lg p-6 border border-gray-700 hover:border-oasis-primary/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-white">{challenge.title}</h3>
                        {isCompleted && (
                          <span className="bg-green-900/30 text-green-500 px-2 py-1 rounded-full text-xs">
                            Completed
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3 mb-4">
                        {renderDifficultyBadge(challenge.difficulty)}
                        <span className="bg-oasis-primary/20 text-oasis-primary px-2 py-1 rounded text-xs font-medium">
                          {challenge.points} Points
                        </span>
                        <span className="bg-oasis-secondary/20 text-oasis-secondary px-2 py-1 rounded text-xs font-medium capitalize">
                          {challenge.type}
                        </span>
                      </div>
                      
                      <p className="text-gray-400 line-clamp-3 mb-4">
                        {challenge.description}
                      </p>
                      
                      <div className="flex justify-end">
                        <span className="text-oasis-primary hover:underline text-sm flex items-center">
                          View Challenge
                          <svg
                            className="w-4 h-4 ml-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5l7 7-7 7"
                            ></path>
                          </svg>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
} 
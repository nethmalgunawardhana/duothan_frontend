'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { apiClient, ChallengeData } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';
import AuthGuard from '@/components/auth/AuthGuard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { CodeEditor } from '@/components/ui/CodeEditor';
import { SubmissionHistory } from '@/components/ui/SubmissionHistory';
import { ProblemViewer } from '@/components/ui/ProblemViewer';
import { FlagSubmission } from '@/components/ui/FlagSubmission';
import { BuildathonUpload } from '@/components/ui/BuildathonUpload';
import { ExecutionResults } from '@/components/ui/ExecutionResults';
import { useJudge0 } from '@/hooks/useJudge0';

export default function ChallengePage() {
  const { id } = useParams();
  const { team } = useAuth();
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'submission' | 'history'>('description');
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const { loading: executionLoading, error: executionError, result: executionResult } = useJudge0();
  
  useEffect(() => {
    const fetchChallenge = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiClient.getActiveChallengeById(id as string);
        
        if (response.success && response.data) {
          setChallenge(response.data);
          
          // Check if the challenge is already completed by the team
          if (team?.completedChallenges?.includes(response.data.id)) {
            setIsCompleted(true);
          }
        } else {
          setError(response.error || 'Failed to fetch challenge details');
        }
      } catch {
        setError('An error occurred while fetching challenge details');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchChallenge();
    }
  }, [id, team]);
  
  const handleSubmissionComplete = (submissionId: string) => {
    setSubmissionComplete(true);
    setActiveTab('history');
    setIsCompleted(true);
  };
  
  const handleFlagSubmissionComplete = (success: boolean) => {
    if (success) {
      setIsCompleted(true);
    }
  };

  const handleBuildathonSubmissionComplete = () => {
    setIsCompleted(true);
    setActiveTab('description');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-oasis-dark flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="min-h-screen bg-oasis-dark p-4">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-500">
          {error || 'Challenge not found'}
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-oasis-dark">
        <div className="container mx-auto px-4 py-8">
          {isCompleted && (
            <div className="bg-green-900/20 border border-green-500 rounded-lg p-4 mb-6 flex items-center">
              <svg
                className="w-6 h-6 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-green-500 font-medium">
                You've successfully completed this challenge!
              </span>
            </div>
          )}
          
          <div className="bg-oasis-surface rounded-lg p-6 mb-8 border border-oasis-primary/30">
            <div className="flex border-b border-gray-700 mb-6">
              <button
                className={`px-4 py-2 ${activeTab === 'description' ? 'border-b-2 border-oasis-primary text-white' : 'text-gray-400'}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button
                className={`px-4 py-2 ${activeTab === 'submission' ? 'border-b-2 border-oasis-primary text-white' : 'text-gray-400'}`}
                onClick={() => setActiveTab('submission')}
              >
                Submit Solution
              </button>
              <button
                className={`px-4 py-2 ${activeTab === 'history' ? 'border-b-2 border-oasis-primary text-white' : 'text-gray-400'}`}
                onClick={() => setActiveTab('history')}
              >
                Submission History
              </button>
            </div>
            
            {activeTab === 'description' && (
              <ProblemViewer challenge={challenge} />
            )}
            
            {activeTab === 'submission' && (
              <div className="space-y-6">
                {challenge.type === 'algorithmic' ? (
                  <CodeEditor
                    challengeId={challenge.id}
                    testCases={challenge.testCases || []}
                    onSubmissionComplete={handleSubmissionComplete}
                  />
                ) : challenge.type === 'buildathon' ? (
                  <BuildathonUpload
                    challengeId={challenge.id}
                    onSubmissionComplete={handleBuildathonSubmissionComplete}
                  />
                ) : (
                  <FlagSubmission 
                    challengeId={challenge.id}
                    onSubmissionComplete={handleFlagSubmissionComplete}
                  />
                )}
              </div>
            )}
            
            {activeTab === 'history' && (
              <SubmissionHistory challengeId={challenge.id} />
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
} 
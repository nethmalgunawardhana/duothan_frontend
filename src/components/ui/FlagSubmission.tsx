import React, { useState } from 'react';
import { apiClient } from '@/utils/api';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';

interface FlagSubmissionProps {
  challengeId: string;
  onSubmissionComplete?: (success: boolean) => void;
}

export const FlagSubmission: React.FC<FlagSubmissionProps> = ({
  challengeId,
  onSubmissionComplete,
}) => {
  const [flag, setFlag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  const handleFlagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlag(e.target.value);
    setError(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!flag.trim()) {
      setError('Please enter a flag');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.submitFlag({
        challengeId,
        flag: flag.trim(),
      });
      
      if (response.success) {
        setSuccess(true);
        if (onSubmissionComplete) {
          onSubmissionComplete(true);
        }
      } else {
        setError(response.error || 'Invalid flag');
        setAttempts(prev => prev + 1);
        if (onSubmissionComplete) {
          onSubmissionComplete(false);
        }
      }
    } catch (err) {
      setError('An error occurred while submitting the flag');
      setAttempts(prev => prev + 1);
      if (onSubmissionComplete) {
        onSubmissionComplete(false);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setFlag('');
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="bg-oasis-surface rounded-lg p-6 border border-oasis-primary/30">
      <h2 className="text-xl font-bold text-white mb-4">Submit Flag</h2>
      
      {success ? (
        <div className="text-center">
          <div className="bg-green-900/20 border border-green-500 rounded-lg p-4 mb-4">
            <svg
              className="w-12 h-12 text-green-500 mx-auto mb-2"
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
            <p className="text-green-500 font-bold text-lg">Flag Accepted!</p>
            <p className="text-gray-400 mt-2">
              Congratulations! You've successfully completed this challenge.
            </p>
          </div>
          
          <Button onClick={resetForm} variant="secondary">
            Try Another Flag
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-1">
              Enter the flag you discovered:
            </label>
            <input
              type="text"
              value={flag}
              onChange={handleFlagChange}
              placeholder="flag{...}"
              className="w-full bg-oasis-dark text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-oasis-primary"
              disabled={loading}
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
            {attempts > 0 && (
              <p className="text-yellow-500 text-sm mt-1">
                Incorrect attempts: {attempts}
              </p>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={loading || !flag.trim()}>
              {loading ? (
                <><LoadingSpinner size="sm" /> Submitting...</>
              ) : (
                'Submit Flag'
              )}
            </Button>
          </div>
          
          <div className="mt-4 text-gray-400 text-sm">
            <p>
              <strong>Hint:</strong> Flags are usually in the format{' '}
              <code className="bg-oasis-dark px-1 py-0.5 rounded">flag&#123;some_text_here&#125;</code>
            </p>
          </div>
        </form>
      )}
    </div>
  );
}; 
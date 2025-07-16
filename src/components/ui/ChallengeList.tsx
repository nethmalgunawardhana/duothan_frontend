import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChallengeData, apiClient } from '@/utils/api';
import { Modal } from './Modal';
import { LoadingSpinner } from './LoadingSpinner';

interface ChallengeListProps {
  challenges: ChallengeData[];
  completedChallengeIds?: string[];
}

export const ChallengeList: React.FC<ChallengeListProps> = ({ 
  challenges, 
  completedChallengeIds = [] 
}) => {
  const router = useRouter();
  const [filter, setFilter] = useState<{
    type: 'all' | 'algorithmic' | 'buildathon';
    difficulty: 'all' | 'easy' | 'medium' | 'hard';
    completed: 'all' | 'completed' | 'incomplete';
  }>({
    type: 'all',
    difficulty: 'all',
    completed: 'all',
  });
  
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeData | null>(null);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flag, setFlag] = useState('');
  const [flagError, setFlagError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  const filteredChallenges = challenges.filter(challenge => {
    if (filter.type !== 'all' && challenge.type !== filter.type) {
      return false;
    }
    
    if (filter.difficulty !== 'all' && challenge.difficulty !== filter.difficulty) {
      return false;
    }
    
    if (filter.completed !== 'all') {
      const isCompleted = completedChallengeIds.includes(challenge.id);
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

  const handleChallengeClick = (challenge: ChallengeData, e: React.MouseEvent) => {
    e.preventDefault();
    
    // If challenge is already completed, navigate directly
    if (completedChallengeIds.includes(challenge.id)) {
      router.push(`/dashboard/challenges/${challenge.id}`);
      return;
    }
    
    // Otherwise show flag validation modal
    setSelectedChallenge(challenge);
    setShowFlagModal(true);
    setFlag('');
    setFlagError(null);
  };
  
  const handleFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedChallenge) return;
    
    if (!flag.trim()) {
      setFlagError('Please enter a flag');
      return;
    }
    
    setLoading(true);
    setFlagError(null);
    
    try {
      const response = await apiClient.submitFlag({
        challengeId: selectedChallenge.id,
        flag: flag.trim(),
      });
      
      if (response.success) {
        // Flag is correct, navigate to challenge
        router.push(`/dashboard/challenges/${selectedChallenge.id}`);
      } else {
        setFlagError(response.error || 'Invalid flag');
        setAttempts(prev => prev + 1);
      }
    } catch (err) {
      setFlagError('An error occurred while validating the flag');
      setAttempts(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };
  
  const closeModal = () => {
    setShowFlagModal(false);
    setSelectedChallenge(null);
    setFlag('');
    setFlagError(null);
    setAttempts(0);
  };

  return (
    <div className="bg-oasis-surface rounded-lg p-6 border border-oasis-primary/30">
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
      
      {filteredChallenges.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No challenges match your filters
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => {
            const isCompleted = completedChallengeIds.includes(challenge.id);
            
            return (
              <div
                key={challenge.id}
                className="bg-oasis-dark rounded-lg p-6 border border-gray-700 hover:border-oasis-primary/50 transition-colors cursor-pointer"
                onClick={(e) => handleChallengeClick(challenge, e)}
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
              </div>
            );
          })}
        </div>
      )}
      
      {/* Flag Validation Modal */}
      <Modal 
        isOpen={showFlagModal} 
        onClose={closeModal}
        title={`Unlock Challenge: ${selectedChallenge?.title || ''}`}
      >
        <div className="p-6">
          <p className="text-gray-300 mb-4">
            To access this challenge, you need to enter the correct flag.
          </p>
          
          <form onSubmit={handleFlagSubmit}>
            <div className="mb-4">
              <label className="block text-gray-400 text-sm mb-1">
                Enter the flag:
              </label>
              <input
                type="text"
                value={flag}
                onChange={(e) => {
                  setFlag(e.target.value);
                  setFlagError(null);
                }}
                placeholder="flag{...}"
                className="w-full bg-oasis-dark text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:border-oasis-primary"
                disabled={loading}
              />
              {flagError && (
                <p className="text-red-500 text-sm mt-1">{flagError}</p>
              )}
              {attempts > 0 && (
                <p className="text-yellow-500 text-sm mt-1">
                  Incorrect attempts: {attempts}
                </p>
              )}
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading || !flag.trim()}
                className="bg-oasis-primary text-oasis-dark px-4 py-2 rounded font-semibold hover:bg-oasis-primary/90 transition-colors disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Validating...
                  </>
                ) : (
                  'Submit Flag'
                )}
              </button>
            </div>
            
            <div className="mt-4 text-gray-400 text-sm">
              <p>
                <strong>Hint:</strong> Flags are usually in the format{' '}
                <code className="bg-oasis-dark px-1 py-0.5 rounded">flag&#123;some_text_here&#125;</code>
              </p>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}; 
'use client';

import React, { useState, useEffect } from 'react';
import { apiClient, ChallengeData } from '@/utils/api';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ChallengeManagerProps {
  onEdit?: (challenge: ChallengeData) => void;
}

export const ChallengeManager: React.FC<ChallengeManagerProps> = ({ onEdit }) => {
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeData | null>(null);

  useEffect(() => {
    async function fetchChallenges() {
      try {
        const response = await apiClient.getChallenges();
        if (response.success && response.data) {
          setChallenges(response.data);
        } else {
          setError(response.error || 'Failed to fetch challenges');
        }
      } catch {
        setError('Failed to fetch challenges');
      } finally {
        setLoading(false);
      }
    }

    fetchChallenges();
  }, []);
              difficulty: 'medium',
              points: 50,
              testCases: [
                {
                  input: '[10, 5, 15, 2, 7, 12, 20]',
                  expectedOutput: 'true',
                  isHidden: false,
                },
              ],
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: '3',
              title: 'Frontend UI Challenge',
              description: 'Build a responsive dashboard with React.',
              type: 'buildathon',
              difficulty: 'easy',
              points: 30,
              isActive: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ]);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('An error occurred while fetching challenges');
        setLoading(false);
      }
    }

    fetchChallenges();
  }, []);

  const handleEditChallenge = (challenge: ChallengeData) => {
    if (onEdit) {
      onEdit(challenge);
    } else {
      // Navigate to edit page or open edit form
      console.log('Edit challenge:', challenge);
    }
  };

  const handleDeleteClick = (challenge: ChallengeData) => {
    setSelectedChallenge(challenge);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedChallenge) return;

    try {
      setLoading(true);
      
      // Comment out the real API call for now
      // const response = await apiClient.deleteChallenge(selectedChallenge.id);
      
      // if (response.success) {
      //   setChallenges(challenges.filter(c => c.id !== selectedChallenge.id));
      // } else {
      //   setError(response.error || 'Failed to delete challenge');
      // }

      // Mock successful deletion
      setTimeout(() => {
        setChallenges(challenges.filter(c => c.id !== selectedChallenge.id));
        setShowDeleteModal(false);
        setSelectedChallenge(null);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('An error occurred while deleting the challenge');
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/20 text-green-500';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'hard':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  if (loading && challenges.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && challenges.length === 0) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Challenge Management</h2>
        <Button variant="primary">
          Add New Challenge
        </Button>
      </div>

      <div className="bg-oasis-surface border border-oasis-primary/30 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-oasis-primary/20 text-oasis-primary">
              <tr>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Difficulty</th>
                <th className="px-6 py-4 font-medium">Points</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {challenges.map((challenge) => (
                <tr key={challenge.id} className="hover:bg-oasis-surface-hover">
                  <td className="px-6 py-4 text-white font-medium">{challenge.title}</td>
                  <td className="px-6 py-4 text-gray-300 capitalize">{challenge.type}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-oasis-primary font-semibold">{challenge.points}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      challenge.isActive 
                        ? 'bg-green-500/20 text-green-500' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {challenge.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleEditChallenge(challenge)}
                        className="text-gray-400 hover:text-oasis-primary transition-colors"
                      >
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
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(challenge)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
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
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Challenge"
      >
        <div className="p-6">
          <p className="text-gray-300 mb-6">
            Are you sure you want to delete the challenge:{' '}
            <span className="font-semibold text-white">{selectedChallenge?.title}</span>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button 
              variant="ghost" 
              onClick={() => setShowDeleteModal(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDeleteConfirm}
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}; 
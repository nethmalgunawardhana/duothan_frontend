'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { apiClient, ChallengeData } from '@/utils/api';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAdminAuth } from '@/contexts/AdminContext';

interface ChallengeManagerProps {
  onEdit?: (challenge: ChallengeData) => void;
}

export const ChallengeManager: React.FC<ChallengeManagerProps> = ({ onEdit }) => {
  const { isAuthenticated, initialized } = useAdminAuth();
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeData | null>(null);

  const fetchChallenges = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if admin is authenticated before making API call
      if (!isAuthenticated) {
        setError('Please log in to access challenges');
        return;
      }
      
      const response = await apiClient.getChallenges();
      if (response.success && response.data) {
        setChallenges(response.data);
        setError(null);
      } else {
        setError(response.error || 'Failed to fetch challenges');
      }
    } catch (err) {
      console.error('Error fetching challenges:', err);
      setError('Failed to fetch challenges');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Only fetch challenges when admin context is initialized and authenticated
    if (initialized && isAuthenticated) {
      fetchChallenges();
    } else if (initialized && !isAuthenticated) {
      setLoading(false);
      setError('Please log in to access challenges');
    }
  }, [initialized, isAuthenticated, fetchChallenges]);

  const handleEditChallenge = (challenge: ChallengeData) => {
    if (onEdit) {
      onEdit(challenge);
    } else {
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
      
      const response = await apiClient.deleteChallenge(selectedChallenge.id);
      
      if (response.success) {
        setChallenges(challenges.filter(c => c.id !== selectedChallenge.id));
      } else {
        setError(response.error || 'Failed to delete challenge');
      }
    } catch {
      setError('Failed to delete challenge');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setSelectedChallenge(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSelectedChallenge(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">{error}</p>
        <Button 
          onClick={() => window.location.reload()}
          className="mt-2"
          variant="outline"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Challenge Management</h2>
        <p className="text-gray-600">{challenges.length} challenges total</p>
      </div>

      {challenges.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No challenges found. Create your first challenge to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{challenge.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      challenge.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {challenge.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{challenge.description}</p>
                  
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span className="capitalize">Type: {challenge.type}</span>
                    <span className="capitalize">Difficulty: {challenge.difficulty}</span>
                    <span>Points: {challenge.points}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => handleEditChallenge(challenge)}
                    size="sm"
                    variant="outline"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(challenge)}
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        title="Delete Challenge"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete &quot;{selectedChallenge?.title}&quot;? This action cannot be undone.
          </p>
          
          <div className="flex gap-2 justify-end">
            <Button 
              onClick={handleDeleteCancel}
              variant="outline"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Challenge
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

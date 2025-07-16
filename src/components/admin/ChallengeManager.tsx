// src/components/admin/ChallengeManager.tsx
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
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchChallenges = useCallback(async () => {
    if (!isAuthenticated || !initialized) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.getChallenges();
      if (response.success && response.data) {
        setChallenges(response.data);
      } else {
        setError(response.error || 'Failed to fetch challenges');
      }
    } catch (err) {
      console.error('Error fetching challenges:', err);
      setError('Failed to fetch challenges');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, initialized]);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  const handleEditChallenge = (challenge: ChallengeData) => {
    if (onEdit) {
      onEdit(challenge);
    }
  };

  const handleDeleteClick = (challenge: ChallengeData) => {
    setSelectedChallenge(challenge);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedChallenge) return;

    try {
      setDeleteLoading(true);
      
      const response = await apiClient.deleteChallenge(selectedChallenge.id);
      
      if (response.success) {
        setChallenges(challenges.filter(c => c.id !== selectedChallenge.id));
        setShowDeleteModal(false);
        setSelectedChallenge(null);
      } else {
        setError(response.error || 'Failed to delete challenge');
      }
    } catch (err) {
      console.error('Error deleting challenge:', err);
      setError('Failed to delete challenge');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSelectedChallenge(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
        <p className="text-red-400">{error}</p>
        <Button 
          onClick={fetchChallenges}
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
        <h2 className="text-xl font-semibold text-white">Challenge Management</h2>
        <p className="text-gray-400">{challenges.length} challenges total</p>
      </div>

      {challenges.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-16 w-16 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <p className="text-gray-400 text-lg">No challenges found</p>
          <p className="text-gray-500 text-sm mt-2">Create your first challenge to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="bg-oasis-surface border border-oasis-primary/30 rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{challenge.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      challenge.isActive 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {challenge.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">{challenge.description}</p>
                  
                  <div className="flex gap-4 text-sm text-gray-400">
                    <span className="capitalize flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {challenge.type}
                    </span>
                    <span className="capitalize flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {challenge.difficulty}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      {challenge.points} points
                    </span>
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-500">
                    Created: {new Date(challenge.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    onClick={() => handleEditChallenge(challenge)}
                    size="sm"
                    variant="outline"
                    className="border-oasis-primary/30 text-oasis-primary hover:bg-oasis-primary/10"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(challenge)}
                    size="sm"
                    variant="outline"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
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
          <p className="text-gray-300">
            Are you sure you want to delete <strong className="text-white">{selectedChallenge?.title}</strong>? 
            This action cannot be undone.
          </p>
          
          <div className="flex gap-2 justify-end">
            <Button 
              onClick={handleDeleteCancel}
              variant="outline"
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteLoading ? <LoadingSpinner size="sm" /> : 'Delete Challenge'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
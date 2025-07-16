// src/app/admin/challenges/page.tsx
'use client';

import React, { useState } from 'react';
import { ChallengeManager } from '@/components/admin/ChallengeManager';
import { ChallengeForm } from '@/components/admin/ChallengeForm';
import { ChallengeData, apiClient } from '@/utils/api';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useAdminAuth } from '@/contexts/AdminContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function AdminChallengesPage() {
  const { isAuthenticated, loading, initialized } = useAdminAuth();
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeData | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Don't render if not initialized or still loading
  if (!initialized || loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center text-gray-400 min-h-64 flex items-center justify-center">
        <div>
          <svg
            className="mx-auto h-16 w-16 text-gray-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <p>Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  const handleOpenCreateForm = () => {
    setSelectedChallenge(null);
    setShowFormModal(true);
  };

  const handleOpenEditForm = (challenge: ChallengeData) => {
    setSelectedChallenge(challenge);
    setShowFormModal(true);
  };

  const handleCloseForm = () => {
    setShowFormModal(false);
    setSelectedChallenge(null);
  };

  const handleSubmitChallenge = async (
    challengeData: Omit<ChallengeData, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      let response;
      
      if (selectedChallenge) {
        // Update existing challenge
        response = await apiClient.updateChallenge(selectedChallenge.id, challengeData);
      } else {
        // Create new challenge
        response = await apiClient.createChallenge(challengeData);
      }
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to save challenge');
      }
      
      setShowFormModal(false);
      setSelectedChallenge(null);
      // Trigger refresh of the challenge list
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error('Error saving challenge:', error);
      
      // Check if it's an authentication error
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('Session expired') || errorMessage.includes('Invalid token')) {
        window.location.href = '/admin/login';
        return;
      }
      
      throw error;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Challenges</h1>
        <Button 
          variant="primary" 
          onClick={handleOpenCreateForm}
          className="bg-oasis-primary hover:bg-oasis-primary/90"
        >
          <svg
            className="w-5 h-5 mr-2"
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
          Create New Challenge
        </Button>
      </div>

      <ChallengeManager
        key={refreshTrigger}
        onEdit={handleOpenEditForm}
      />

      {/* Challenge Form Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={handleCloseForm}
        title={selectedChallenge ? 'Edit Challenge' : 'Create Challenge'}
        size="lg"
      >
        <div className="p-6">
          <ChallengeForm
            challenge={selectedChallenge || undefined}
            onSubmit={handleSubmitChallenge}
            onCancel={handleCloseForm}
          />
        </div>
      </Modal>
    </div>
  );
}
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Don't render if not initialized, authenticated or still loading
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
        Please log in to access this page.
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
      // Check if admin is authenticated before making API calls
      if (!isAuthenticated) {
        throw new Error('Not authenticated. Please log in again.');
      }

      setIsSubmitting(true);
      let response;
      
      if (selectedChallenge) {
        // Update existing challenge
        response = await apiClient.updateChallenge(selectedChallenge.id, challengeData);
        console.log('Challenge updated successfully:', response);
      } else {
        // Create new challenge
        response = await apiClient.createChallenge(challengeData);
        console.log('Challenge created successfully:', response);
      }
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to save challenge');
      }
      
      setShowFormModal(false);
      setSelectedChallenge(null);
      // Trigger refresh of the challenge list
      setRefreshTrigger((prev) => prev + 1);
    } catch (error: unknown) {
      console.error('Error saving challenge:', error);
      
      // Check if it's an authentication error
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('Session expired') || errorMessage.includes('Invalid token')) {
        // Redirect to login page
        window.location.href = '/admin/login';
        return;
      }
      
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Challenges</h1>
        <Button variant="primary" onClick={handleOpenCreateForm}>
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
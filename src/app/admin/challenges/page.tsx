'use client';

import React, { useState } from 'react';
import { ChallengeManager } from '@/components/admin/ChallengeManager';
import { ChallengeForm } from '@/components/admin/ChallengeForm';
import { ChallengeData, apiClient } from '@/utils/api';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export default function AdminChallengesPage() {
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeData | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
      if (selectedChallenge) {
        // Update existing challenge
        // const response = await apiClient.updateChallenge(selectedChallenge.id, challengeData);
        console.log('Updating challenge:', selectedChallenge.id, challengeData);
      } else {
        // Create new challenge
        // const response = await apiClient.createChallenge(challengeData);
        console.log('Creating challenge:', challengeData);
      }
      
      setShowFormModal(false);
      setSelectedChallenge(null);
      // Trigger refresh of the challenge list
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error('Error saving challenge:', error);
      throw error;
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
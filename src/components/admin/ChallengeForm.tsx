'use client';

import React, { useState, useEffect } from 'react';
import { apiClient, ChallengeData } from '@/utils/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ChallengeFormProps {
  challenge?: ChallengeData;
  onSubmit: (challenge: Omit<ChallengeData, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
}

type ChallengeFormData = Omit<ChallengeData, 'id' | 'createdAt' | 'updatedAt'>;

const defaultFormData: ChallengeFormData = {
  title: '',
  description: '',
  type: 'algorithmic',
  difficulty: 'medium',
  points: 50,
  flags: [],
  testCases: [],
  resources: [],
  isActive: true,
};

export const ChallengeForm: React.FC<ChallengeFormProps> = ({
  challenge,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ChallengeFormData>(challenge || defaultFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flagInput, setFlagInput] = useState('');
  const [testCaseInput, setTestCaseInput] = useState({
    input: '',
    expectedOutput: '',
    isHidden: false,
  });
  
  const isEditing = !!challenge;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
    } else if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checkbox.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddFlag = () => {
    if (flagInput.trim() === '') return;
    
    setFormData((prev) => ({
      ...prev,
      flags: [...(prev.flags || []), flagInput.trim()],
    }));
    setFlagInput('');
  };

  const handleRemoveFlag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      flags: prev.flags?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleAddTestCase = () => {
    if (testCaseInput.input.trim() === '' || testCaseInput.expectedOutput.trim() === '') return;
    
    setFormData((prev) => ({
      ...prev,
      testCases: [...(prev.testCases || []), { ...testCaseInput }],
    }));
    setTestCaseInput({
      input: '',
      expectedOutput: '',
      isHidden: false,
    });
  };

  const handleRemoveTestCase = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      testCases: prev.testCases?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await onSubmit(formData);
    } catch (err) {
      setError('An error occurred while saving the challenge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-500">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
            Challenge Title *
          </label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter challenge title"
            required
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-2">
            Challenge Type *
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full bg-oasis-dark border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-oasis-primary"
            required
          >
            <option value="algorithmic">Algorithmic</option>
            <option value="buildathon">Buildathon</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={5}
          className="w-full bg-oasis-dark border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-oasis-primary"
          placeholder="Enter challenge description"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300 mb-2">
            Difficulty *
          </label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full bg-oasis-dark border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-oasis-primary"
            required
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <label htmlFor="points" className="block text-sm font-medium text-gray-300 mb-2">
            Points *
          </label>
          <Input
            id="points"
            name="points"
            type="number"
            value={formData.points}
            onChange={handleChange}
            min={1}
            required
          />
        </div>

        <div>
          <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-300 mb-2">
            Time Limit (minutes)
          </label>
          <Input
            id="timeLimit"
            name="timeLimit"
            type="number"
            value={formData.timeLimit || ''}
            onChange={handleChange}
            min={0}
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="isActive"
          name="isActive"
          type="checkbox"
          checked={formData.isActive}
          onChange={handleChange}
          className="h-4 w-4 text-oasis-primary bg-oasis-dark border-gray-700 rounded focus:ring-oasis-primary"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-300">
          Active (visible to teams)
        </label>
      </div>

      {/* Flags Section */}
      <div className="border border-gray-700 rounded-lg p-4">
        <h3 className="text-white font-medium mb-4">Challenge Tags/Flags</h3>
        
        <div className="flex mb-4">
          <Input
            value={flagInput}
            onChange={(e) => setFlagInput(e.target.value)}
            placeholder="Add a tag (e.g., 'algorithms', 'web3')"
            className="mr-2"
          />
          <Button type="button" onClick={handleAddFlag} variant="secondary">
            Add
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {formData.flags?.map((flag, index) => (
            <div 
              key={index} 
              className="bg-oasis-primary/20 text-oasis-primary px-3 py-1 rounded-full text-sm flex items-center"
            >
              {flag}
              <button
                type="button"
                onClick={() => handleRemoveFlag(index)}
                className="ml-2 text-oasis-primary hover:text-white focus:outline-none"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Test Cases Section (for algorithmic challenges) */}
      {formData.type === 'algorithmic' && (
        <div className="border border-gray-700 rounded-lg p-4">
          <h3 className="text-white font-medium mb-4">Test Cases</h3>
          
          <div className="space-y-4 mb-4">
            <div>
              <label htmlFor="testInput" className="block text-sm font-medium text-gray-300 mb-2">
                Input
              </label>
              <Input
                id="testInput"
                value={testCaseInput.input}
                onChange={(e) => setTestCaseInput((prev) => ({ ...prev, input: e.target.value }))}
                placeholder="Input for test case"
              />
            </div>
            
            <div>
              <label htmlFor="testOutput" className="block text-sm font-medium text-gray-300 mb-2">
                Expected Output
              </label>
              <Input
                id="testOutput"
                value={testCaseInput.expectedOutput}
                onChange={(e) => setTestCaseInput((prev) => ({ ...prev, expectedOutput: e.target.value }))}
                placeholder="Expected output for test case"
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="testHidden"
                type="checkbox"
                checked={testCaseInput.isHidden}
                onChange={(e) => setTestCaseInput((prev) => ({ ...prev, isHidden: e.target.checked }))}
                className="h-4 w-4 text-oasis-primary bg-oasis-dark border-gray-700 rounded focus:ring-oasis-primary"
              />
              <label htmlFor="testHidden" className="ml-2 block text-sm text-gray-300">
                Hidden test case (not visible to teams)
              </label>
            </div>
            
            <Button type="button" onClick={handleAddTestCase} variant="secondary">
              Add Test Case
            </Button>
          </div>
          
          {formData.testCases && formData.testCases.length > 0 && (
            <div className="space-y-4 mt-6">
              <h4 className="text-gray-300 text-sm font-medium">Added Test Cases:</h4>
              <div className="border border-gray-700 rounded-lg divide-y divide-gray-700">
                {formData.testCases.map((testCase, index) => (
                  <div key={index} className="p-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-white">
                        Test Case {index + 1} {testCase.isHidden && '(Hidden)'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTestCase(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg
                          className="w-4 h-4"
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
                    <div className="mt-2 text-sm">
                      <div className="text-gray-400">Input:</div>
                      <div className="text-white bg-oasis-dark/50 p-2 rounded mt-1 font-mono">
                        {testCase.input}
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      <div className="text-gray-400">Expected Output:</div>
                      <div className="text-white bg-oasis-dark/50 p-2 rounded mt-1 font-mono">
                        {testCase.expectedOutput}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <Button type="button" onClick={onCancel} variant="ghost" disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? <LoadingSpinner size="sm" /> : isEditing ? 'Update Challenge' : 'Create Challenge'}
        </Button>
      </div>
    </form>
  );
}; 
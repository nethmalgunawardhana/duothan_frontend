import React, { useState } from 'react';
import { apiClient } from '@/utils/api';
import { LoadingSpinner } from './LoadingSpinner';

interface BuildathonUploadProps {
  challengeId: string;
  onSubmissionComplete: () => void;
}

export const BuildathonUpload: React.FC<BuildathonUploadProps> = ({ 
  challengeId,
  onSubmissionComplete
}) => {
  const [githubUrl, setGithubUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Basic URL validation
  const isValidGithubUrl = (url: string) => {
    const githubRegex = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/i;
    return githubRegex.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setSuccess(null);
    
    // Validate URL
    if (!githubUrl.trim()) {
      setError('GitHub URL is required');
      return;
    }
    
    if (!isValidGithubUrl(githubUrl)) {
      setError('Please enter a valid GitHub repository URL');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await apiClient.submitBuildathonProject({
        challengeId,
        githubUrl: githubUrl.trim()
      });
      
      if (response.success) {
        setSuccess('Project submitted successfully!');
        setGithubUrl('');
        onSubmissionComplete();
      } else {
        setError(response.error || 'Failed to submit project');
      }
    } catch (err) {
      setError('An error occurred while submitting your project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-oasis-dark rounded-lg p-6 border border-oasis-primary/30">
      <h3 className="text-xl font-bold text-white mb-4">Submit Your Project</h3>
      
      {success && (
        <div className="bg-green-900/20 border border-green-500 rounded-lg p-4 mb-4 text-green-500">
          {success}
        </div>
      )}
      
      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-4 text-red-500">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="githubUrl" className="block text-gray-400 mb-2">
            GitHub Repository URL
          </label>
          <input
            type="text"
            id="githubUrl"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/username/repository"
            className="w-full bg-oasis-surface text-white border border-gray-700 rounded-lg px-4 py-2 focus:border-oasis-primary focus:outline-none"
            disabled={loading}
          />
          <p className="text-gray-500 text-sm mt-1">
            Please provide the URL to your GitHub repository containing the project code
          </p>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="bg-oasis-primary text-oasis-dark px-6 py-2 rounded-lg font-semibold hover:bg-oasis-primary/90 transition-colors disabled:opacity-50 flex items-center"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Submitting...
            </>
          ) : (
            'Submit Project'
          )}
        </button>
      </form>
    </div>
  );
}; 
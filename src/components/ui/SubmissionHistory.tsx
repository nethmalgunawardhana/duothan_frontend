import React, { useState, useEffect } from 'react';
import { apiClient, SubmissionData, handleApiError } from '@/utils/api';
import { LoadingSpinner } from './LoadingSpinner';

interface SubmissionHistoryProps {
  challengeId?: string;
}

export const SubmissionHistory: React.FC<SubmissionHistoryProps> = ({ challengeId }) => {
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionData | null>(null);
  
  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiClient.getTeamSubmissionHistory(challengeId);
        
        if (response.success && response.data) {
          setSubmissions(response.data);
        } else {
          // Handle specific error cases using utility function
          const { userMessage } = handleApiError(response.error || 'Unknown error');
          setError(userMessage);
        }
      } catch (err) {
        console.error('Error fetching submission history:', err);
        setError('An error occurred while fetching submission history');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmissions();
  }, [challengeId]);
  
  const handleViewDetails = (submission: SubmissionData) => {
    setSelectedSubmission(submission);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'correct':
        return 'text-green-500';
      case 'incorrect':
        return 'text-red-500';
      case 'pending':
      case 'processing':
        return 'text-yellow-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-oasis-surface rounded-lg border border-oasis-primary/30 p-4">
      <h2 className="text-xl font-bold text-white mb-4">Submission History</h2>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-red-400 p-6 bg-red-900/20 rounded-lg border border-red-500/30">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 6.5c-.77.833-.192 2.5 1.732 2.5z"
              />
            </svg>
            <span className="font-medium">Error Loading Submission History</span>
          </div>
          <p className="mt-2 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-oasis-primary hover:underline text-sm"
          >
            Try refreshing the page
          </button>
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-gray-400 text-center py-8">
          No submissions yet
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-oasis-dark">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Language</th>
                <th className="px-4 py-3">Points</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id} className="border-b border-gray-700">
                  <td className="px-4 py-3">{formatDate(submission.submittedAt)}</td>
                  <td className={`px-4 py-3 font-medium ${getStatusColor(submission.status)}`}>
                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                  </td>
                  <td className="px-4 py-3 capitalize">{submission.language}</td>
                  <td className="px-4 py-3">{submission.points}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleViewDetails(submission)}
                      className="text-oasis-primary hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-oasis-surface rounded-lg border border-oasis-primary/30 p-4 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Submission Details</h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-400">Submission Date:</p>
                <p className="text-white">{formatDate(selectedSubmission.submittedAt)}</p>
              </div>
              <div>
                <p className="text-gray-400">Status:</p>
                <p className={`font-medium ${getStatusColor(selectedSubmission.status)}`}>
                  {selectedSubmission.status.charAt(0).toUpperCase() + selectedSubmission.status.slice(1)}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Language:</p>
                <p className="text-white capitalize">{selectedSubmission.language}</p>
              </div>
              <div>
                <p className="text-gray-400">Points:</p>
                <p className="text-oasis-primary font-bold">{selectedSubmission.points}</p>
              </div>
              
              {selectedSubmission.executionTime && (
                <div>
                  <p className="text-gray-400">Execution Time:</p>
                  <p className="text-white">{selectedSubmission.executionTime} ms</p>
                </div>
              )}
              
              {selectedSubmission.executionMemory && (
                <div>
                  <p className="text-gray-400">Memory Used:</p>
                  <p className="text-white">{selectedSubmission.executionMemory} KB</p>
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <p className="text-gray-400 mb-1">Solution:</p>
              <pre className="bg-oasis-dark p-3 rounded text-white overflow-x-auto">
                {selectedSubmission.solution}
              </pre>
            </div>
            
            {selectedSubmission.feedback && (
              <div className="mb-4">
                <p className="text-gray-400 mb-1">Feedback:</p>
                <div className="bg-oasis-dark p-3 rounded text-white">
                  {selectedSubmission.feedback}
                </div>
              </div>
            )}
            
            {selectedSubmission.executionResult && (
              <>
                {selectedSubmission.executionResult.stdout && (
                  <div className="mb-4">
                    <p className="text-gray-400 mb-1">Standard Output:</p>
                    <pre className="bg-oasis-dark p-3 rounded text-white overflow-x-auto">
                      {selectedSubmission.executionResult.stdout}
                    </pre>
                  </div>
                )}
                
                {selectedSubmission.executionResult.stderr && (
                  <div className="mb-4">
                    <p className="text-gray-400 mb-1">Standard Error:</p>
                    <pre className="bg-oasis-dark p-3 rounded text-red-300 overflow-x-auto">
                      {selectedSubmission.executionResult.stderr}
                    </pre>
                  </div>
                )}
                
                {selectedSubmission.executionResult.compile_output && (
                  <div className="mb-4">
                    <p className="text-gray-400 mb-1">Compilation Output:</p>
                    <pre className="bg-oasis-dark p-3 rounded text-yellow-300 overflow-x-auto">
                      {selectedSubmission.executionResult.compile_output}
                    </pre>
                  </div>
                )}
              </>
            )}
            
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="bg-oasis-secondary text-white px-4 py-2 rounded-lg font-semibold hover:bg-oasis-secondary/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 
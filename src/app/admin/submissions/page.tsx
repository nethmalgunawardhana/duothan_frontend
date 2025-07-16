'use client';

import React, { useState, useEffect } from 'react';
import { apiClient, SubmissionData } from '@/utils/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionData | null>(null);
  const [filter, setFilter] = useState<{
    status: 'all' | 'pending' | 'correct' | 'incorrect' | 'processing';
  }>({
    status: 'all',
  });
  
  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const statusFilter = filter.status !== 'all' ? { status: filter.status } : undefined;
        const response = await apiClient.getSubmissions(statusFilter);
        
        if (response.success && response.data) {
          setSubmissions(response.data);
        } else {
          setError(response.error || 'Failed to fetch submissions');
        }
      } catch (err) {
        setError('An error occurred while fetching submissions');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmissions();
  }, [filter]);
  
  const handleViewDetails = (submission: SubmissionData) => {
    setSelectedSubmission(submission);
  };
  
  const handleUpdateStatus = async (id: string, status: 'pending' | 'correct' | 'incorrect', feedback?: string) => {
    try {
      const response = await apiClient.updateSubmission(id, { status, feedback });
      
      if (response.success) {
        setSubmissions(prev => prev.map(sub => sub.id === id ? { ...sub, status, feedback } : sub));
        if (selectedSubmission?.id === id) {
          setSelectedSubmission({ ...selectedSubmission, status, feedback });
        }
      } else {
        console.error('Failed to update submission:', response.error);
      }
    } catch (err) {
      console.error('Error updating submission:', err);
    }
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
        return 'text-yellow-500';
      case 'processing':
        return 'text-blue-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Submissions</h1>
      
      <div className="bg-oasis-surface rounded-lg p-6 mb-8 border border-oasis-primary/30">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white mb-4 md:mb-0">All Submissions</h2>
          
          <div className="flex items-center">
            <label className="text-gray-400 mr-2">Status:</label>
            <select
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value as any }))}
              className="bg-oasis-dark text-white border border-gray-700 rounded px-3 py-2"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="correct">Correct</option>
              <option value="incorrect">Incorrect</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-500">
            {error}
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No submissions found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase bg-oasis-dark">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Team</th>
                  <th className="px-4 py-3">Challenge</th>
                  <th className="px-4 py-3">Language</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Points</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission.id} className="border-b border-gray-700">
                    <td className="px-4 py-3">{formatDate(submission.submittedAt)}</td>
                    <td className="px-4 py-3">{submission.teamId}</td>
                    <td className="px-4 py-3">{submission.challengeId}</td>
                    <td className="px-4 py-3 capitalize">{submission.language}</td>
                    <td className={`px-4 py-3 font-medium ${getStatusColor(submission.status)}`}>
                      {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                    </td>
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
      </div>
      
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-oasis-surface rounded-lg border border-oasis-primary/30 p-4 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
                <p className="text-gray-400">Submission ID:</p>
                <p className="text-white font-mono text-sm">{selectedSubmission.id}</p>
              </div>
              <div>
                <p className="text-gray-400">Submission Date:</p>
                <p className="text-white">{formatDate(selectedSubmission.submittedAt)}</p>
              </div>
              <div>
                <p className="text-gray-400">Team ID:</p>
                <p className="text-white font-mono text-sm">{selectedSubmission.teamId}</p>
              </div>
              <div>
                <p className="text-gray-400">Challenge ID:</p>
                <p className="text-white font-mono text-sm">{selectedSubmission.challengeId}</p>
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
            
            <div className="mb-4">
              <p className="text-gray-400 mb-1">Feedback:</p>
              <textarea
                value={selectedSubmission.feedback || ''}
                onChange={(e) => setSelectedSubmission({...selectedSubmission, feedback: e.target.value})}
                className="w-full bg-oasis-dark text-white p-3 rounded min-h-[100px]"
                placeholder="Enter feedback for the team..."
              />
            </div>
            
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
            
            <div className="flex justify-between mt-6">
              <div>
                <button
                  onClick={() => handleUpdateStatus(selectedSubmission.id, 'incorrect', selectedSubmission.feedback)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors mr-3"
                >
                  Mark Incorrect
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedSubmission.id, 'correct', selectedSubmission.feedback)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Mark Correct
                </button>
              </div>
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
} 
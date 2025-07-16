// src/app/admin/submissions/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { apiClient, SubmissionData } from '@/utils/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { useAdminAuth } from '@/contexts/AdminContext';

export default function AdminSubmissionsPage() {
  const { isAuthenticated, initialized } = useAdminAuth();
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
      if (!isAuthenticated || !initialized) {
        setLoading(false);
        return;
      }
      
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
        console.error('Error fetching submissions:', err);
        setError('An error occurred while fetching submissions');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmissions();
  }, [filter, isAuthenticated, initialized]);
  
  const handleViewDetails = (submission: SubmissionData) => {
    setSelectedSubmission(submission);
  };
  
  const handleUpdateStatus = async (id: string, status: 'pending' | 'correct' | 'incorrect', feedback?: string) => {
    try {
      const response = await apiClient.updateSubmission(id, { status, feedback });
      
      if (response.success) {
        setSubmissions(prev => prev.map(sub => 
          sub.id === id ? { ...sub, status, feedback } : sub
        ));
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
    return new Date(dateString).toLocaleString();
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'correct':
        return 'text-green-400';
      case 'incorrect':
        return 'text-red-400';
      case 'pending':
        return 'text-yellow-400';
      case 'processing':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  if (!initialized || loading) {
    return (
      <div className="flex justify-center py-12">
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Submissions</h1>
      
      <div className="bg-oasis-surface rounded-lg p-6 mb-8 border border-oasis-primary/30">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white mb-4 md:mb-0">All Submissions</h2>
          
          <div className="flex items-center">
            <label className="text-gray-400 mr-2">Status:</label>
            <select
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value as any }))}
              className="bg-oasis-dark text-white border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-oasis-primary"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="correct">Correct</option>
              <option value="incorrect">Incorrect</option>
            </select>
          </div>
        </div>
        
        {error ? (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
            {error}
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p>No submissions found</p>
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
                  <tr key={submission.id} className="border-b border-gray-700 hover:bg-oasis-dark/50">
                    <td className="px-4 py-3">{formatDate(submission.submittedAt)}</td>
                    <td className="px-4 py-3 font-mono text-sm">{submission.teamId}</td>
                    <td className="px-4 py-3 font-mono text-sm">{submission.challengeId}</td>
                    <td className="px-4 py-3 capitalize">{submission.language}</td>
                    <td className={`px-4 py-3 font-medium ${getStatusColor(submission.status)}`}>
                      {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                    </td>
                    <td className="px-4 py-3 text-oasis-primary font-bold">{submission.points}</td>
                    <td className="px-4 py-3">
                      <Button
                        onClick={() => handleViewDetails(submission)}
                        size="sm"
                        variant="outline"
                        className="text-oasis-primary border-oasis-primary/30 hover:bg-oasis-primary/10"
                      >
                        View Details
                      </Button>
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
          <div className="bg-oasis-surface rounded-lg border border-oasis-primary/30 p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Submission Details</h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-400 hover:text-white p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-gray-400 text-sm">Submission ID:</p>
                <p className="text-white font-mono text-sm">{selectedSubmission.id}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Submission Date:</p>
                <p className="text-white">{formatDate(selectedSubmission.submittedAt)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Team ID:</p>
                <p className="text-white font-mono text-sm">{selectedSubmission.teamId}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Challenge ID:</p>
                <p className="text-white font-mono text-sm">{selectedSubmission.challengeId}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Status:</p>
                <p className={`font-medium ${getStatusColor(selectedSubmission.status)}`}>
                  {selectedSubmission.status.charAt(0).toUpperCase() + selectedSubmission.status.slice(1)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Language:</p>
                <p className="text-white capitalize">{selectedSubmission.language}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Points:</p>
                <p className="text-oasis-primary font-bold">{selectedSubmission.points}</p>
              </div>
              
              {selectedSubmission.executionTime && (
                <div>
                  <p className="text-gray-400 text-sm">Execution Time:</p>
                  <p className="text-white">{selectedSubmission.executionTime} ms</p>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <p className="text-gray-400 text-sm mb-2">Solution:</p>
              <pre className="bg-oasis-dark p-4 rounded text-white text-sm overflow-x-auto border border-gray-700">
                {selectedSubmission.solution}
              </pre>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-400 text-sm mb-2">Feedback:</p>
              <textarea
                value={selectedSubmission.feedback || ''}
                onChange={(e) => setSelectedSubmission({...selectedSubmission, feedback: e.target.value})}
                className="w-full bg-oasis-dark text-white p-3 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-oasis-primary min-h-[100px]"
                placeholder="Enter feedback for the team..."
              />
            </div>
            
            {selectedSubmission.executionResult && (
              <div className="space-y-4 mb-6">
                {selectedSubmission.executionResult.stdout && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Standard Output:</p>
                    <pre className="bg-oasis-dark p-3 rounded text-white text-sm overflow-x-auto border border-gray-700">
                      {selectedSubmission.executionResult.stdout}
                    </pre>
                  </div>
                )}
                
                {selectedSubmission.executionResult.stderr && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Standard Error:</p>
                    <pre className="bg-oasis-dark p-3 rounded text-red-300 text-sm overflow-x-auto border border-red-500/30">
                      {selectedSubmission.executionResult.stderr}
                    </pre>
                  </div>
                )}
                
                {selectedSubmission.executionResult.compile_output && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Compilation Output:</p>
                    <pre className="bg-oasis-dark p-3 rounded text-yellow-300 text-sm overflow-x-auto border border-yellow-500/30">
                      {selectedSubmission.executionResult.compile_output}
                    </pre>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-between">
              <div className="space-x-3">
                <Button
                  onClick={() => handleUpdateStatus(selectedSubmission.id, 'incorrect', selectedSubmission.feedback)}
                  variant="outline"
                  className="bg-red-600/20 border-red-500/30 text-red-400 hover:bg-red-600/30"
                >
                  Mark Incorrect
                </Button>
                <Button
                  onClick={() => handleUpdateStatus(selectedSubmission.id, 'correct', selectedSubmission.feedback)}
                  variant="outline"
                  className="bg-green-600/20 border-green-500/30 text-green-400 hover:bg-green-600/30"
                >
                  Mark Correct
                </Button>
              </div>
              <Button
                onClick={() => setSelectedSubmission(null)}
                variant="outline"
                className="border-oasis-primary/30 text-oasis-primary hover:bg-oasis-primary/10"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
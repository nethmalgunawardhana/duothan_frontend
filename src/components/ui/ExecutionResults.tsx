import React from 'react';
import { Judge0Result } from '@/hooks/useJudge0';
import { LoadingSpinner } from './LoadingSpinner';

interface ExecutionResultsProps {
  loading: boolean;
  error: string | null;
  result: Judge0Result | null;
  testResults?: Array<{ passed: boolean; output: string; error?: string }>;
}

export const ExecutionResults: React.FC<ExecutionResultsProps> = ({
  loading,
  error,
  result,
  testResults = [],
}) => {
  const getStatusColor = (statusId: number) => {
    // Status codes from Judge0
    switch (statusId) {
      case 3: // Accepted
        return 'text-green-500';
      case 4: // Wrong Answer
      case 5: // Time Limit Exceeded
      case 6: // Compilation Error
      case 7: // Runtime Error
      case 8: // Internal Error
        return 'text-red-500';
      case 1: // In Queue
      case 2: // Processing
        return 'text-yellow-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="p-4 bg-oasis-dark text-white h-full overflow-auto">
      {loading && (
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner size="lg" />
        </div>
      )}
      
      {!loading && testResults.length === 0 && !result && !error && (
        <div className="text-gray-400 text-center py-8">
          Run tests to see results here
        </div>
      )}
      
      {!loading && testResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold mb-4">Test Results</h3>
          {testResults.map((result, index) => (
            <div 
              key={index}
              className={`p-3 rounded border ${result.passed ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'}`}
            >
              <div className="flex items-center mb-2">
                <span className={`text-lg font-bold ${result.passed ? 'text-green-500' : 'text-red-500'}`}>
                  Test Case {index + 1}: {result.passed ? 'Passed' : 'Failed'}
                </span>
              </div>
              
              {result.output && (
                <div className="mb-2">
                  <span className="text-gray-400">Output:</span>
                  <pre className="bg-oasis-dark p-2 rounded mt-1 text-white overflow-x-auto">
                    {result.output}
                  </pre>
                </div>
              )}
              
              {result.error && (
                <div>
                  <span className="text-red-400">Error:</span>
                  <pre className="bg-oasis-dark p-2 rounded mt-1 text-red-300 overflow-x-auto">
                    {result.error}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {!loading && result && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold mb-4">Execution Result</h3>
          
          <div className="p-3 rounded border border-gray-700">
            <div className="flex items-center mb-2">
              <span className={`text-lg font-bold ${getStatusColor(result.status.id)}`}>
                Status: {result.status.description}
              </span>
            </div>
            
            {result.stdout && (
              <div className="mb-2">
                <span className="text-gray-400">Standard Output:</span>
                <pre className="bg-black/30 p-2 rounded mt-1 text-white overflow-x-auto">
                  {result.stdout}
                </pre>
              </div>
            )}
            
            {result.stderr && (
              <div className="mb-2">
                <span className="text-red-400">Standard Error:</span>
                <pre className="bg-black/30 p-2 rounded mt-1 text-red-300 overflow-x-auto">
                  {result.stderr}
                </pre>
              </div>
            )}
            
            {result.compile_output && (
              <div className="mb-2">
                <span className="text-yellow-400">Compilation Output:</span>
                <pre className="bg-black/30 p-2 rounded mt-1 text-yellow-300 overflow-x-auto">
                  {result.compile_output}
                </pre>
              </div>
            )}
            
            {result.message && (
              <div className="mb-2">
                <span className="text-gray-400">Message:</span>
                <pre className="bg-black/30 p-2 rounded mt-1 text-white overflow-x-auto">
                  {result.message}
                </pre>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              {result.time !== null && (
                <div>
                  <span className="text-gray-400">Execution Time:</span>
                  <p className="text-white">{result.time} s</p>
                </div>
              )}
              
              {result.memory !== null && (
                <div>
                  <span className="text-gray-400">Memory Used:</span>
                  <p className="text-white">{result.memory} KB</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="p-3 rounded border border-red-500 bg-red-900/20 text-red-300">
          {error}
        </div>
      )}
    </div>
  );
}; 
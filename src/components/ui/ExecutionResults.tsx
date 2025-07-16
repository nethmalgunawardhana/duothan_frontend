import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ExecutionResult {
  status?: {
    id: string;
    description: string;
  };
  stdout?: string;
  stderr?: string;
  compile_output?: string;
  message?: string;
  time?: number;
  memory?: number;
}

interface TestResult {
  passed: boolean;
  output?: string;
  error?: string;
}

interface ExecutionResultsProps {
  loading: boolean;
  error: string | null;
  result: ExecutionResult | null;
  testResults?: TestResult[];
}

export const ExecutionResults: React.FC<ExecutionResultsProps> = ({
  loading,
  error,
  result,
  testResults = [],
}) => {
  const getStatusColor = (status: string) => {
    // Status based on description
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'text-green-500';
      case 'wrong answer':
      case 'time limit exceeded':
      case 'compilation error':
      case 'runtime error':
      case 'internal error':
        return 'text-red-500';
      case 'in queue':
      case 'processing':
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
          {testResults.map((testResult: TestResult, index: number) => (
            <div 
              key={index}
              className={`p-3 rounded border ${testResult.passed ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'}`}
            >
              <div className="flex items-center mb-2">
                <span className={`text-lg font-bold ${testResult.passed ? 'text-green-500' : 'text-red-500'}`}>
                  Test Case {index + 1}: {testResult.passed ? 'Passed' : 'Failed'}
                </span>
              </div>
              
              {testResult.output && (
                <div className="mb-2">
                  <span className="text-gray-400">Output:</span>
                  <pre className="bg-oasis-dark p-2 rounded mt-1 text-white overflow-x-auto">
                    {testResult.output}
                  </pre>
                </div>
              )}
              
              {testResult.error && (
                <div>
                  <span className="text-red-400">Error:</span>
                  <pre className="bg-oasis-dark p-2 rounded mt-1 text-red-300 overflow-x-auto">
                    {testResult.error}
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
              <span className={`text-lg font-bold ${getStatusColor(result.status?.description || 'unknown')}`}>
                Status: {result.status?.description || 'Unknown'}
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
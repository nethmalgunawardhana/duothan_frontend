import React, { useState } from 'react';
import { apiClient } from '@/utils/api';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';
import { ExecutionResults } from './ExecutionResults';

interface CodeEditorProps {
  challengeId: string;
  initialCode?: string;
  testCases?: { input: string; expectedOutput: string; isHidden: boolean }[];
  onSubmissionComplete?: (submissionId: string) => void;
}

// Language IDs matching backend configuration
const LANGUAGE_OPTIONS = {
  javascript: { id: 63, name: 'JavaScript' },
  python: { id: 71, name: 'Python' },
  java: { id: 62, name: 'Java' },
  cpp: { id: 54, name: 'C++' },
  c: { id: 50, name: 'C' },
  typescript: { id: 74, name: 'TypeScript' },
  ruby: { id: 72, name: 'Ruby' },
  go: { id: 60, name: 'Go' },
};

interface CodeEditorProps {
  challengeId: string;
  initialCode?: string;
  testCases?: { input: string; expectedOutput: string; isHidden: boolean }[];
  onSubmissionComplete?: (submissionId: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  challengeId,
  initialCode = '',
  testCases = [],
  onSubmissionComplete,
}) => {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState<keyof typeof LANGUAGE_OPTIONS>('javascript');
  const [activeTab, setActiveTab] = useState<'editor' | 'result'>('editor');
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'testing' | 'submitting' | 'completed' | 'error'>('idle');
  const [executionResult, setExecutionResult] = useState<{
    status?: string;
    statusDescription?: string;
    stdout?: string;
    stderr?: string;
    compile_output?: string;
    executionTime?: number;
    memory?: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle code change
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  // Handle language change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as keyof typeof LANGUAGE_OPTIONS);
  };

  // Test code execution
  const handleTestCode = async () => {
    if (!code.trim()) return;
    
    setSubmissionStatus('testing');
    setActiveTab('result');
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.submitCode({
        challengeId,
        code,
        language,
        stdin: testCases[0]?.input || '', // Use first test case input if available
      });
      
      if (response.success && response.data) {
        setExecutionResult(response.data.executionResult);
        setSubmissionStatus('idle');
      } else {
        setError(response.error || 'Code execution failed');
        setSubmissionStatus('error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during testing');
      setSubmissionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // Submit solution for evaluation
  const handleSubmitSolution = async () => {
    if (!code.trim()) return;
    
    setSubmissionStatus('submitting');
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.submitCode({
        challengeId,
        code,
        language,
      });
      
      if (response.success && response.data) {
        setSubmissionStatus('completed');
        if (onSubmissionComplete) {
          onSubmissionComplete(response.data.id);
        }
      } else {
        setSubmissionStatus('error');
        setError(response.error || 'Submission failed');
      }
    } catch (err) {
      setSubmissionStatus('error');
      setError(err instanceof Error ? err.message : 'Submission error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-oasis-surface rounded-lg border border-oasis-primary/30 overflow-hidden">
      <div className="flex border-b border-oasis-primary/30">
        <button
          className={`px-4 py-2 ${activeTab === 'editor' ? 'bg-oasis-primary text-oasis-dark' : 'text-gray-400'}`}
          onClick={() => setActiveTab('editor')}
        >
          Code Editor
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'result' ? 'bg-oasis-primary text-oasis-dark' : 'text-gray-400'}`}
          onClick={() => setActiveTab('result')}
        >
          Results
        </button>
        
        <div className="ml-auto flex items-center pr-2">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="bg-oasis-dark text-white border border-gray-700 rounded px-2 py-1 text-sm mr-2"
          >
            {Object.entries(LANGUAGE_OPTIONS).map(([key, { name }]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className={`${activeTab === 'editor' ? 'block' : 'hidden'}`}>
        <textarea
          value={code}
          onChange={handleCodeChange}
          className="w-full bg-oasis-dark text-white font-mono p-4 h-96 focus:outline-none"
          placeholder="Write your code here..."
          spellCheck={false}
        />
      </div>
      
      <div className={`${activeTab === 'result' ? 'block' : 'hidden'} h-96`}>
        <ExecutionResults
          loading={loading}
          error={error}
          result={executionResult}
        />
      </div>
      
      <div className="flex justify-between p-4 border-t border-oasis-primary/30">
        <Button
          onClick={handleTestCode}
          variant="secondary"
          disabled={loading || !code.trim() || submissionStatus === 'submitting'}
        >
          {loading && submissionStatus === 'testing' ? (
            <><LoadingSpinner size="sm" /> Testing...</>
          ) : (
            'Test Code'
          )}
        </Button>
        
        <Button
          onClick={handleSubmitSolution}
          disabled={loading || !code.trim() || submissionStatus === 'submitting' || submissionStatus === 'testing'}
        >
          {loading && submissionStatus === 'submitting' ? (
            <><LoadingSpinner size="sm" /> Submitting...</>
          ) : (
            'Submit Solution'
          )}
        </Button>
      </div>
    </div>
  );
}; 
import React, { useState } from 'react';
import { apiClient } from '@/utils/api';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';
import { ExecutionResults } from './ExecutionResults';
import { useJudge0 } from '@/hooks/useJudge0';

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
  const [testResults, setTestResults] = useState<Array<{
    passed: boolean;
    output?: string;
    error?: string;
    expected?: string;
    input?: string;
  }>>([]);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Use Judge0 hook for code execution
  const { loading: judge0Loading, error: judge0Error, result: judge0Result, executeCode } = useJudge0();

  // Handle code change
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  // Handle language change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as keyof typeof LANGUAGE_OPTIONS);
  };

  // Test code execution against test cases
  const handleTestCode = async () => {
    if (!code.trim()) return;
    
    setSubmissionStatus('testing');
    setActiveTab('result');
    setTestResults([]);
    setSubmissionError(null);
    
    try {
      const languageId = LANGUAGE_OPTIONS[language].id;
      const results: Array<{
        passed: boolean;
        output?: string;
        error?: string;
        expected?: string;
        input?: string;
      }> = [];
      
      // If no test cases, just run the code once
      if (testCases.length === 0) {
        const result = await executeCode({
          source_code: code,
          language_id: languageId,
        });
        
        results.push({
          passed: result.status.id === 3, // Accepted
          output: result.stdout || '',
          error: result.stderr || result.compile_output || result.message || '',
          expected: '',
          input: '',
        });
      } else {
        // Run code against each test case
        for (let i = 0; i < testCases.length; i++) {
          const testCase = testCases[i];
          
          try {
            const result = await executeCode({
              source_code: code,
              language_id: languageId,
              stdin: testCase.input,
            });
            
            const actualOutput = (result.stdout || '').trim();
            const expectedOutput = testCase.expectedOutput.trim();
            const passed = actualOutput === expectedOutput && result.status.id === 3;
            
            results.push({
              passed,
              output: actualOutput,
              error: result.stderr || result.compile_output || result.message || '',
              expected: expectedOutput,
              input: testCase.input,
            });
          } catch (error) {
            results.push({
              passed: false,
              output: '',
              error: error instanceof Error ? error.message : 'Execution failed',
              expected: testCase.expectedOutput,
              input: testCase.input,
            });
          }
        }
      }
      
      setTestResults(results);
      setSubmissionStatus('idle');
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : 'An error occurred during testing');
      setSubmissionStatus('error');
    }
  };

  // Submit solution for evaluation
  const handleSubmitSolution = async () => {
    if (!code.trim()) return;
    
    setSubmissionStatus('submitting');
    setSubmissionLoading(true);
    setSubmissionError(null);
    
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
        setSubmissionError(response.error || 'Submission failed');
      }
    } catch (err) {
      setSubmissionStatus('error');
      setSubmissionError(err instanceof Error ? err.message : 'Submission error');
    } finally {
      setSubmissionLoading(false);
    }
  };

  const isLoading = judge0Loading || submissionLoading;
  const currentError = judge0Error || submissionError;

  // Convert Judge0Result to ExecutionResult format
  const convertedResult = judge0Result ? {
    status: judge0Result.status,
    stdout: judge0Result.stdout || undefined,
    stderr: judge0Result.stderr || undefined,
    compile_output: judge0Result.compile_output || undefined,
    message: judge0Result.message || undefined,
    time: judge0Result.time || undefined,
    memory: judge0Result.memory || undefined,
  } : null;

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
          loading={isLoading}
          error={currentError}
          result={convertedResult}
          testResults={testResults}
        />
      </div>
      
      <div className="flex justify-between p-4 border-t border-oasis-primary/30">
        <Button
          onClick={handleTestCode}
          variant="secondary"
          disabled={isLoading || !code.trim()}
        >
          {isLoading && submissionStatus === 'testing' ? (
            <><LoadingSpinner size="sm" /> Testing...</>
          ) : (
            'Test Code'
          )}
        </Button>
        
        <Button
          onClick={handleSubmitSolution}
          disabled={isLoading || !code.trim()}
        >
          {isLoading && submissionStatus === 'submitting' ? (
            <><LoadingSpinner size="sm" /> Submitting...</>
          ) : (
            'Submit Solution'
          )}
        </Button>
      </div>
    </div>
  );
}; 
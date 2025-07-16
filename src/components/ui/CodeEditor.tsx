import React, { useState } from 'react';
import { useJudge0, LANGUAGE_IDS } from '@/hooks/useJudge0';
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

export const CodeEditor: React.FC<CodeEditorProps> = ({
  challengeId,
  initialCode = '',
  testCases = [],
  onSubmissionComplete,
}) => {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState<keyof typeof LANGUAGE_IDS>('javascript');
  const [activeTab, setActiveTab] = useState<'editor' | 'result'>('editor');
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'testing' | 'submitting' | 'completed' | 'error'>('idle');
  const [testResults, setTestResults] = useState<Array<{ passed: boolean; output: string; error?: string }>>([]);
  
  const { loading, error, result, executeCode } = useJudge0();

  // Handle code change
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  // Handle language change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as keyof typeof LANGUAGE_IDS);
  };

  // Test code against test cases
  const handleTestCode = async () => {
    if (!code.trim()) return;
    
    setSubmissionStatus('testing');
    setActiveTab('result');
    setTestResults([]);
    
    const visibleTestCases = testCases.filter(tc => !tc.isHidden);
    const results = [];
    
    for (const testCase of visibleTestCases) {
      try {
        const result = await executeCode({
          source_code: code,
          language_id: LANGUAGE_IDS[language],
          stdin: testCase.input,
          expected_output: testCase.expectedOutput,
        });
        
        if (result.status.id === 3) { // Accepted
          const passed = result.stdout?.trim() === testCase.expectedOutput.trim();
          results.push({
            passed,
            output: result.stdout || '',
            error: passed ? undefined : 'Output does not match expected output',
          });
        } else {
          results.push({
            passed: false,
            output: '',
            error: result.stderr || result.compile_output || result.message || `Execution error: ${result.status.description}`,
          });
        }
      } catch (err) {
        results.push({
          passed: false,
          output: '',
          error: err instanceof Error ? err.message : 'An error occurred during testing',
        });
      }
    }
    
    setTestResults(results);
    setSubmissionStatus('idle');
  };

  // Submit solution
  const handleSubmitSolution = async () => {
    if (!code.trim()) return;
    
    setSubmissionStatus('submitting');
    
    try {
      const response = await apiClient.submitSolution({
        challengeId,
        solution: code,
        language,
      });
      
      if (response.success && response.data) {
        setSubmissionStatus('completed');
        if (onSubmissionComplete) {
          onSubmissionComplete(response.data.id);
        }
      } else {
        setSubmissionStatus('error');
        console.error('Submission failed:', response.error);
      }
    } catch (err) {
      setSubmissionStatus('error');
      console.error('Submission error:', err);
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
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="typescript">TypeScript</option>
            <option value="ruby">Ruby</option>
            <option value="go">Go</option>
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
          result={result}
          testResults={testResults}
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
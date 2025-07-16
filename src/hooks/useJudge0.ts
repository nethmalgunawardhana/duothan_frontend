import { useState, useCallback } from 'react';

// Define types for Judge0 API
export interface Judge0Submission {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
}

export interface Judge0Result {
  token: string;
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status: {
    id: number;
    description: string;
  };
  memory: number | null;
  time: number | null;
  expected_output?: string;
  matching?: boolean;
}

// Language IDs for Judge0
export const LANGUAGE_IDS = {
  javascript: 63,  // JavaScript (Node.js 12.14.0)
  python: 71,      // Python (3.8.1)
  java: 62,        // Java (OpenJDK 13.0.1)
  cpp: 54,         // C++ (GCC 9.2.0)
  c: 50,           // C (GCC 9.2.0)
  typescript: 74,  // TypeScript (3.7.4)
  ruby: 72,        // Ruby (2.7.0)
  go: 60,          // Go (1.13.5)
};

// Status codes from Judge0
export const STATUS_CODES = {
  ACCEPTED: 3,
  WRONG_ANSWER: 4,
  TIME_LIMIT_EXCEEDED: 5,
  COMPILATION_ERROR: 6,
  RUNTIME_ERROR: 7,
  INTERNAL_ERROR: 8,
  COMPILATION_PENDING: 1,
  RUNNING: 2,
};

export const useJudge0 = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Judge0Result | null>(null);

  // Judge0 API endpoint - Custom CE instance
  const JUDGE0_API = process.env.NEXT_PUBLIC_JUDGE0_API || 'http://10.3.5.139:2358';
  const JUDGE0_API_TOKEN = process.env.NEXT_PUBLIC_JUDGE0_API_TOKEN || 'ZHVvdGhhbjUuMA==';

  // Submit code to Judge0
  const submitCode = useCallback(async (submission: Judge0Submission): Promise<string> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${JUDGE0_API}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JUDGE0_API_TOKEN}`,
        },
        body: JSON.stringify({
          source_code: submission.source_code,
          language_id: submission.language_id,
          stdin: submission.stdin || '',
          wait: false,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit code');
      }
      
      const data = await response.json();
      return data.token;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during submission');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [JUDGE0_API, JUDGE0_API_TOKEN]);

  // Get submission result
  const getSubmissionResult = useCallback(async (token: string): Promise<Judge0Result> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${JUDGE0_API}/submissions/${token}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${JUDGE0_API_TOKEN}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to get submission result');
      }
      
      const data = await response.json();
      
      // Judge0 CE returns data directly without base64 encoding
      const result: Judge0Result = {
        token: data.token,
        stdout: data.stdout || null,
        stderr: data.stderr || null,
        compile_output: data.compile_output || null,
        message: data.message || null,
        status: data.status,
        memory: data.memory,
        time: data.time,
      };
      
      setResult(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching results');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [JUDGE0_API, JUDGE0_API_TOKEN]);

  // Execute code with polling for results
  const executeCode = useCallback(async (submission: Judge0Submission): Promise<Judge0Result> => {
    try {
      const token = await submitCode(submission);
      
      // Poll for results
      let result: Judge0Result | null = null;
      let attempts = 0;
      const maxAttempts = 10;
      
      while (attempts < maxAttempts) {
        attempts++;
        
        const currentResult = await getSubmissionResult(token);
        
        // If the submission is still processing, wait and try again
        if (currentResult.status.id === STATUS_CODES.COMPILATION_PENDING || 
            currentResult.status.id === STATUS_CODES.RUNNING) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        
        result = currentResult;
        break;
      }
      
      if (!result) {
        throw new Error('Execution timed out');
      }
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during execution');
      throw err;
    }
  }, [submitCode, getSubmissionResult]);

  // Clear the current result
  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    loading,
    error,
    result,
    submitCode,
    getSubmissionResult,
    executeCode,
    clearResult,
  };
}; 